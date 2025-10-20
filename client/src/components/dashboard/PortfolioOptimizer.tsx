import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Zap, TrendingUp, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AllocationSuggestion {
  protocol: string;
  percentage: number;
  expectedYield: number;
  riskContribution: number;
}

export function PortfolioOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimization, setOptimization] = useState<{
    allocations: AllocationSuggestion[];
    totalRisk: number;
    expectedReturn: number;
    episodes: number;
  } | null>(null);

  const COLORS = ['hsl(280, 85%, 60%)', 'hsl(200, 95%, 55%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)'];

  // Simulate RL optimization
  const runOptimization = async () => {
    setIsOptimizing(true);
    setProgress(0);
    
    // Simulate RL training progress
    const totalEpisodes = 1000;
    for (let i = 0; i <= totalEpisodes; i += 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress((i / totalEpisodes) * 100);
    }

    // Generate optimal allocation (simulated DQN result)
    const allocations: AllocationSuggestion[] = [
      {
        protocol: 'StableFarm (USDC-USDT)',
        percentage: 60,
        expectedYield: 8.5,
        riskContribution: 12,
      },
      {
        protocol: 'DreamPool (SOMI-ETH)',
        percentage: 30,
        expectedYield: 45.2,
        riskContribution: 38,
      },
      {
        protocol: 'SomniaSwap (BTC-ETH)',
        percentage: 10,
        expectedYield: 28.3,
        riskContribution: 25,
      },
    ];

    const totalRisk = allocations.reduce((sum, a) => sum + (a.percentage / 100 * a.riskContribution), 0);
    const expectedReturn = allocations.reduce((sum, a) => sum + (a.percentage / 100 * a.expectedYield), 0);

    setOptimization({
      allocations,
      totalRisk,
      expectedReturn,
      episodes: totalEpisodes,
    });

    setIsOptimizing(false);
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <CardTitle>Portfolio Optimizer Agent</CardTitle>
              <p className="text-sm text-muted-foreground">Reinforcement Learning-based allocation</p>
            </div>
          </div>
          <Button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="gap-2"
            data-testid="button-optimize-portfolio"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Optimize Portfolio
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isOptimizing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Simulating 1000+ allocations...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Running Deep Q-Learning to optimize yield vs. risk balance
            </p>
          </div>
        )}

        {optimization && !isOptimizing && (
          <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-chart-3" />
                  <span className="text-sm font-medium text-muted-foreground">Portfolio Risk</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{optimization.totalRisk.toFixed(0)}/100</span>
                  <Badge variant={optimization.totalRisk < 30 ? "default" : "secondary"} className="text-xs">
                    {optimization.totalRisk < 30 ? "Low" : optimization.totalRisk < 60 ? "Medium" : "High"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-chart-3" />
                  <span className="text-sm font-medium text-muted-foreground">Expected APY</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-chart-3">{optimization.expectedReturn.toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground">Annual</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">RL Episodes</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{optimization.episodes.toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs">Converged</Badge>
                </div>
              </div>
            </div>

            {/* Allocation Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Optimal Allocation</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={optimization.allocations}
                        dataKey="percentage"
                        nameKey="protocol"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={(entry) => `${entry.percentage}%`}
                      >
                        {optimization.allocations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Allocation Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Allocation Breakdown</h4>
                {optimization.allocations.map((alloc, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border border-border bg-muted/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{alloc.protocol}</span>
                      </div>
                      <Badge variant="outline">{alloc.percentage}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Expected Yield: </span>
                        <span className="font-medium text-chart-3">{alloc.expectedYield}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk: </span>
                        <span className="font-medium">{alloc.riskContribution}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="p-4 rounded-lg border border-primary/50 bg-primary/5">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-primary">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Optimal allocation balances {optimization.expectedReturn.toFixed(1)}% expected APY 
                    with {optimization.totalRisk.toFixed(0)}/100 portfolio risk. 
                    Primary allocation to stable pools ({optimization.allocations[0].percentage}%) 
                    provides risk-adjusted foundation.
                  </p>
                </div>
                <Button variant="default" size="sm" className="gap-2" data-testid="button-apply-optimization">
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}

        {!optimization && !isOptimizing && (
          <div className="py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Click 'Optimize Portfolio' to run RL simulation and find the best allocation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
