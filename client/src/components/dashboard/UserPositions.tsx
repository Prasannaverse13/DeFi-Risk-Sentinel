import { useQuery, useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserPosition } from "@shared/schema";
import { useState } from "react";

export function UserPositions() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [rebalancingId, setRebalancingId] = useState<string | null>(null);
  
  const { data: positions, isLoading } = useQuery<UserPosition[]>({
    queryKey: ["/api/positions", address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/positions?wallet=${address}`);
      if (!response.ok) throw new Error("Failed to fetch positions");
      return response.json();
    },
    enabled: !!address,
  });

  const rebalanceMutation = useMutation({
    mutationFn: async (positionId: string) => {
      const response = await apiRequest("POST", "/api/rebalance-position", { positionId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Rebalance Initiated",
        description: `Position rebalancing in progress. ${data.message || 'Check back shortly for updates.'}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
      setRebalancingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Rebalance Failed",
        description: error.message || "Failed to rebalance position. Please try again.",
        variant: "destructive",
      });
      setRebalancingId(null);
    },
  });

  const handleRebalance = (positionId: string) => {
    setRebalancingId(positionId);
    rebalanceMutation.mutate(positionId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your DeFi Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-chart-3 text-white";
      case "medium":
        return "bg-chart-4 text-white";
      case "high":
        return "bg-chart-5 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Your DeFi Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {positions && positions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.map((position) => (
              <Card
                key={position.id}
                className="border-border hover-elevate transition-all"
                data-testid={`position-${position.poolName.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Pool Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{position.poolName}</h4>
                        <Badge className={getRiskColor(position.riskLevel)}>
                          {position.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Protocol ID: {position.protocolId}</p>
                    </div>

                    {/* Amount & APY */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-mono font-semibold">
                          {parseFloat(position.amount).toFixed(4)}
                        </span>
                      </div>
                      {position.apy && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">APY</span>
                          <span className="font-semibold text-chart-3 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {parseFloat(position.apy).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRebalance(position.id)}
                      disabled={rebalancingId === position.id}
                      data-testid={`button-rebalance-${position.poolName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${rebalancingId === position.id ? 'animate-spin' : ''}`} />
                      {rebalancingId === position.id ? 'Rebalancing...' : 'Rebalance'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No positions found</h3>
            <p className="text-sm text-muted-foreground">
              Connect to DeFi protocols to start monitoring your positions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
