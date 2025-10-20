import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Zap, Shield, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AISuggestion {
  id: string;
  type: 'rebalance' | 'exit' | 'reduce';
  protocol: string;
  action: string;
  reason: string;
  confidence: number;
  expectedRiskDrop: number;
  details: {
    from?: string;
    to?: string;
    amount?: string;
    percentage?: number;
  };
}

export function AutonomousMode() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<AISuggestion | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    
    if (checked) {
      // Simulate AI generating a suggestion after a short delay
      setTimeout(() => {
        const suggestion: AISuggestion = {
          id: Date.now().toString(),
          type: 'rebalance',
          protocol: 'SOMI-ETH Pool',
          action: 'Rebalance Position',
          reason: 'High volatility detected with 92% confidence. Model predicts 35% risk increase in 36h.',
          confidence: 92,
          expectedRiskDrop: 18,
          details: {
            from: 'SOMI-ETH',
            to: 'USDT-USDC',
            amount: '30%',
            percentage: 30,
          },
        };
        setCurrentSuggestion(suggestion);
        setShowSuggestion(true);
      }, 3000);
    }
  };

  const handleApprove = async () => {
    setIsExecuting(true);
    // Simulate transaction execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExecuting(false);
    setShowSuggestion(false);
    // In production, this would trigger actual on-chain transaction via RainbowKit
  };

  const handleReject = () => {
    setShowSuggestion(false);
    setCurrentSuggestion(null);
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Autonomous Mode</CardTitle>
                <p className="text-sm text-muted-foreground">AI-powered automatic protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={isEnabled ? "default" : "secondary"}
                className="gap-1"
              >
                {isEnabled ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    Active
                  </>
                ) : (
                  'Inactive'
                )}
              </Badge>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                data-testid="switch-autonomous-mode"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <h4 className="text-sm font-medium mb-3">How it works</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5" />
                <span>AI continuously monitors your positions every few minutes</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5" />
                <span>When risk thresholds are breached, AI suggests protective actions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5" />
                <span>You review and approve every action via wallet confirmation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5" />
                <span>Smart contracts execute approved actions on-chain instantly</span>
              </div>
            </div>
          </div>

          {isEnabled && (
            <div className="p-4 rounded-lg border border-primary/50 bg-primary/5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Autonomous Protection Active</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI agent is monitoring your positions in real-time. You'll be prompted to approve any suggested actions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isEnabled && (
            <div className="p-4 rounded-lg border border-muted bg-muted/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-muted-foreground">Manual Mode</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable Autonomous Mode to let AI protect your positions automatically when risks are detected.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestion Dialog */}
      <Dialog open={showSuggestion} onOpenChange={setShowSuggestion}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Suggestion
            </DialogTitle>
            <DialogDescription>
              Review and approve the AI-recommended action
            </DialogDescription>
          </DialogHeader>

          {currentSuggestion && (
            <div className="space-y-4 py-4">
              {/* Confidence Badge */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-sm font-medium">AI Confidence</span>
                <Badge className="bg-primary text-primary-foreground">
                  {currentSuggestion.confidence}%
                </Badge>
              </div>

              {/* Action Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Protocol</span>
                  <p className="font-medium">{currentSuggestion.protocol}</p>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Suggested Action</span>
                  <p className="font-medium">{currentSuggestion.action}</p>
                </div>

                {currentSuggestion.details.from && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">{currentSuggestion.details.from}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{currentSuggestion.details.to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">{currentSuggestion.details.amount}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm text-muted-foreground">Reason</span>
                  <p className="text-sm mt-1">{currentSuggestion.reason}</p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-3/5 border border-chart-3/20">
                  <TrendingUp className="w-4 h-4 text-chart-3" />
                  <span className="text-sm">
                    Expected risk drop: <span className="font-medium text-chart-3">-{currentSuggestion.expectedRiskDrop}%</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isExecuting}
              className="flex-1"
              data-testid="button-reject-suggestion"
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isExecuting}
              className="flex-1 gap-2"
              data-testid="button-approve-suggestion"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Approve Action
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
