import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle, TrendingUp } from "lucide-react";
import { AIProcessingLoader } from "@/components/ui/ai-processing-loader";
import { TypingText } from "@/components/ui/typing-text";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface RiskExplanation {
  summary: string;
  keyFactors: Array<{
    factor: string;
    impact: string;
    explanation: string;
  }>;
  technicalAnalysis: string;
  recommendation: string;
}

interface ExplainRiskDialogProps {
  protocolId: string;
  protocolName: string;
  trigger?: React.ReactNode;
}

const impactColors = {
  High: "text-destructive",
  Medium: "text-yellow-500 dark:text-yellow-400",
  Low: "text-green-500 dark:text-green-400"
};

export function ExplainRiskDialog({ protocolId, protocolName, trigger }: ExplainRiskDialogProps) {
  const [open, setOpen] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  const { mutate: explainRisk, data: explanation, isPending } = useMutation<RiskExplanation>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/explain-risk", { protocolId });
      return response.json();
    },
    onSuccess: () => {
      setShowTyping(true);
      setTimeout(() => setShowTyping(false), 3000);
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !explanation) {
      explainRisk();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-testid={`button-explain-${protocolId}`}>
            <Info className="w-4 h-4 mr-2" />
            Explain Decision
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="w-5 h-5 text-primary" />
            AI Risk Explanation: {protocolName}
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of why this risk score was assigned
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <AIProcessingLoader message="Generating detailed explanation..." size="lg" />
        ) : explanation ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 mt-4"
          >
            {/* Summary */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Summary
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-explanation-summary">
                  {showTyping ? (
                    <TypingText text={explanation.summary} speed={20} />
                  ) : (
                    explanation.summary
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Key Factors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Risk Factors</h3>
              <div className="space-y-3">
                {explanation.keyFactors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover-elevate" data-testid={`card-factor-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-semibold">{factor.factor}</h4>
                          <Badge 
                            variant="outline"
                            className={impactColors[factor.impact as keyof typeof impactColors]}
                            data-testid={`badge-impact-${index}`}
                          >
                            {factor.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {factor.explanation}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technical Analysis */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Technical Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {explanation.technicalAnalysis}
                </p>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">AI Recommendation</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-recommendation">
                  {explanation.recommendation}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click to load explanation
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
