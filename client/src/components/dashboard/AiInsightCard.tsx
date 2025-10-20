import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AIProcessingLoader } from "@/components/ui/ai-processing-loader";
import { AIResponseCard } from "@/components/ui/ai-response-card";

interface AiInsight {
  id: string;
  title: string;
  description: string;
  recommendations: string;
  severity?: string;
  createdAt: string;
}

export function AiInsightCard() {
  const { address } = useAccount();
  
  const { data: insights, isLoading } = useQuery<AiInsight[]>({
    queryKey: ["/api/ai-insights", address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/ai-insights?wallet=${address}`);
      if (!response.ok) throw new Error("Failed to fetch insights");
      return response.json();
    },
    enabled: !!address,
  });

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="py-8">
          <AIProcessingLoader message="Analyzing portfolio with AI..." size="md" />
        </CardContent>
      </Card>
    );
  }

  const latestInsight = insights?.[0];

  if (!latestInsight) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No AI insights available yet. Add some positions to get started with AI-powered risk analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        AI Risk Analysis
      </h3>
      
      <AIResponseCard
        title={latestInsight.title}
        description={latestInsight.description}
        severity={latestInsight.severity as "info" | "warning" | "critical" | "success" || "info"}
        recommendations={latestInsight.recommendations}
        animated={true}
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Updated {formatDistanceToNow(new Date(latestInsight.createdAt), { addSuffix: true })}</span>
      </div>
    </div>
  );
}
