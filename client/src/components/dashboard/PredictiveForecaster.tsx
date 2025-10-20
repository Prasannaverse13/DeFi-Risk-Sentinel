import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Brain, Zap, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as tf from '@tensorflow/tfjs';

interface ForecastData {
  timestamp: string;
  predicted_risk: number;
  confidence_upper: number;
  confidence_lower: number;
  is_prediction: boolean;
}

export function PredictiveForecaster({ protocolId }: { protocolId?: string }) {
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [volatilityChange, setVolatilityChange] = useState<number>(0);

  // Fetch historical risk timeline data
  const { data: historicalData, isSuccess } = useQuery<any[]>({
    queryKey: ['/api/risk-timeline', protocolId],
    enabled: !!protocolId,
  });

  // Reset forecast data when protocol changes
  useEffect(() => {
    setForecastData([]);
    setConfidence(0);
    setVolatilityChange(0);
  }, [protocolId]);

  // Auto-run forecast when data is ready
  useEffect(() => {
    if (isSuccess && historicalData && historicalData.length >= 7 && !forecastData.length && !isForecasting && protocolId) {
      runForecast();
    }
  }, [isSuccess, historicalData, protocolId, forecastData.length, isForecasting]);

  // Real LSTM-based prediction using TensorFlow.js
  const runForecast = async () => {
    if (!historicalData || historicalData.length < 7) {
      return;
    }

    setIsForecasting(true);

    // Track tensors for cleanup in finally block
    let tensorData: tf.Tensor1D | null = null;
    let mean: tf.Tensor | null = null;
    let std: tf.Tensor | null = null;
    let normalizedData: tf.Tensor | null = null;
    let xsTensor: tf.Tensor3D | null = null;
    let ysTensor: tf.Tensor2D | null = null;
    let trainLoss: tf.Tensor | null = null;
    let model: tf.Sequential | null = null;

    try {
      // Prepare time series data
      const allRiskScores = historicalData.map(d => d.riskScore / 100);
      const riskScores = allRiskScores.slice(-Math.min(allRiskScores.length, 14));
      
      // Normalize data - track all tensors including intermediates
      tensorData = tf.tensor1d(riskScores);
      mean = tensorData.mean();
      const moments = tf.moments(tensorData);  // Creates BOTH mean and variance tensors
      std = moments.variance.sqrt();
      normalizedData = tensorData.sub(mean).div(std.add(1e-7));
      
      // Extract values for later use
      const normalizedArray = await normalizedData.array() as number[];
      const meanValue = (await mean.data())[0];
      const stdValue = (await std.data())[0];
      
      // Dispose intermediate tensors immediately (moments creates both mean and variance)
      moments.mean.dispose();
      moments.variance.dispose();
      
      // Prepare LSTM sequences
      const sequenceLength = 3;
      const xs: number[][] = [];
      const ys: number[] = [];
      
      for (let i = 0; i < normalizedArray.length - sequenceLength; i++) {
        xs.push(normalizedArray.slice(i, i + sequenceLength));
        ys.push(normalizedArray[i + sequenceLength]);
      }
      
      // Build LSTM model (lighter architecture for faster training)
      model = tf.sequential({
        layers: [
          tf.layers.lstm({
            units: 6,
            inputShape: [sequenceLength, 1],
            returnSequences: false,
          }),
          tf.layers.dense({
            units: 1,
            activation: 'linear',
          }),
        ],
      });
      
      model.compile({
        optimizer: tf.train.adam(0.015),
        loss: 'meanSquaredError',
      });
      
      xsTensor = tf.tensor3d(xs.map(seq => seq.map(val => [val])));
      ysTensor = tf.tensor2d(ys, [ys.length, 1]);
      
      // Train model with UI-friendly callbacks (20 epochs)
      await model.fit(xsTensor, ysTensor, {
        epochs: 20,
        verbose: 0,
        shuffle: true,
        callbacks: {
          onEpochEnd: async () => {
            await tf.nextFrame(); // Yield control to UI thread
          }
        }
      });
      
      // Generate predictions
      const forecastResults: ForecastData[] = [];
      let currentSequence = normalizedArray.slice(-sequenceLength);
      
      for (let i = 0; i < 8; i++) {
        const timestamp = new Date();
        timestamp.setHours(timestamp.getHours() + (i + 1) * 6);
        
        // Predict next value using model
        const inputTensor = tf.tensor3d([currentSequence.map(val => [val])]);
        const predictionTensor = model.predict(inputTensor) as tf.Tensor;
        const predictedNormalized = (await predictionTensor.data())[0];
        
        // Cleanup prediction tensors
        inputTensor.dispose();
        predictionTensor.dispose();
        
        // Denormalize prediction
        const denormalized = predictedNormalized * stdValue + meanValue;
        
        // Confidence bounds (wider over time)
        const confidenceWidth = 0.08 * (1 + i * 0.12);
        
        forecastResults.push({
          timestamp: timestamp.toISOString(),
          predicted_risk: Math.max(0, Math.min(100, denormalized * 100)),
          confidence_upper: Math.min(100, denormalized * 100 + confidenceWidth * 100),
          confidence_lower: Math.max(0, denormalized * 100 - confidenceWidth * 100),
          is_prediction: true,
        });
        
        // Update sequence for next iteration
        currentSequence = [...currentSequence.slice(1), predictedNormalized];
      }
      
      // Calculate model confidence from training loss
      trainLoss = model.evaluate(xsTensor, ysTensor) as tf.Tensor;
      const lossValue = (await trainLoss.data())[0];
      const modelConfidence = Math.max(0.6, Math.min(0.95, 1 - Math.sqrt(lossValue)));
      
      // Calculate volatility change
      const avgHistorical = riskScores.slice(-7).reduce((a, b) => a + b, 0) / 7;
      const avgPredicted = forecastResults.reduce((a, b) => a + b.predicted_risk, 0) / forecastResults.length / 100;
      const volChange = ((avgPredicted - avgHistorical) / avgHistorical) * 100;
      
      setConfidence(modelConfidence);
      setVolatilityChange(volChange);
      
      // Combine historical and predictions
      const combined = [
        ...historicalData.slice(-7).map(d => ({
          timestamp: d.isoTime,
          predicted_risk: d.riskScore,
          confidence_upper: d.riskScore,
          confidence_lower: d.riskScore,
          is_prediction: false,
        })),
        ...forecastResults,
      ];
      
      setForecastData(combined);
      
    } catch (error) {
      console.error('Forecast error:', error);
    } finally {
      // Cleanup all tensors in finally block to prevent leaks even if errors occur
      if (tensorData) tensorData.dispose();
      if (mean) mean.dispose();
      if (std) std.dispose();
      if (normalizedData) normalizedData.dispose();
      if (xsTensor) xsTensor.dispose();
      if (ysTensor) ysTensor.dispose();
      if (trainLoss) trainLoss.dispose();
      if (model) model.dispose();
      
      setIsForecasting(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Forecast Window</CardTitle>
              <p className="text-sm text-muted-foreground">Predictive DeFi Shockwave Model</p>
            </div>
          </div>
          <Button 
            onClick={runForecast}
            disabled={isForecasting || !protocolId}
            className="gap-2"
            data-testid="button-run-forecast"
          >
            {isForecasting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Forecast
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {forecastData.length > 0 ? (
          <>
            {/* Forecast Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-chart-2" />
                  <span className="text-sm font-medium text-muted-foreground">Model Confidence</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{(confidence * 100).toFixed(0)}%</span>
                  <Badge variant={confidence > 0.8 ? "default" : "secondary"} className="text-xs">
                    {confidence > 0.8 ? "High" : "Medium"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-chart-4" />
                  <span className="text-sm font-medium text-muted-foreground">Volatility Change</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${volatilityChange > 0 ? 'text-destructive' : 'text-chart-3'}`}>
                    {volatilityChange > 0 ? '+' : ''}{volatilityChange.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">48h</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Prediction Horizon</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">48h</span>
                  <span className="text-sm text-muted-foreground">8 intervals</span>
                </div>
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Next 48h Risk Prediction</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
                      }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'predicted_risk') return [`${value.toFixed(1)}%`, 'Risk Score'];
                        if (name === 'confidence_upper') return [`${value.toFixed(1)}%`, 'Upper Bound'];
                        if (name === 'confidence_lower') return [`${value.toFixed(1)}%`, 'Lower Bound'];
                        return [value, name];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence_upper"
                      stroke="none"
                      fill="url(#confidenceGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence_lower"
                      stroke="none"
                      fill="url(#confidenceGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted_risk"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        return payload.is_prediction ? (
                          <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                        ) : (
                          <circle cx={cx} cy={cy} r={3} fill="hsl(var(--muted-foreground))" />
                        );
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Historical data (dots) + AI predictions (circles) with confidence intervals (shaded area)
              </p>
            </div>

            {/* Warning if high volatility predicted */}
            {volatilityChange > 20 && (
              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">High Volatility Warning</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI model predicts significant risk increase (+{volatilityChange.toFixed(0)}%) in the next 48 hours. 
                      Consider rebalancing your position or reducing exposure.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {protocolId 
                ? "Click 'Run Forecast' to generate 48h volatility predictions" 
                : "Select a protocol to run AI forecast"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
