import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, TrendingUp, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DefiProtocol } from "@shared/schema";
import { ProtocolFilters, type FilterOptions } from "./ProtocolFilters";
import { ExplainRiskDialog } from "./ExplainRiskDialog";

interface ProtocolRiskTableProps {
  onProtocolSelect?: (protocolId: string) => void;
}

export function ProtocolRiskTable({ onProtocolSelect }: ProtocolRiskTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: "tvl",
    sortOrder: "desc",
  });

  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.set("search", filters.search);
  if (filters.riskLevel) queryParams.set("riskLevel", filters.riskLevel);
  if (filters.minTvl) queryParams.set("minTvl", filters.minTvl);
  if (filters.maxTvl) queryParams.set("maxTvl", filters.maxTvl);
  if (filters.minApy) queryParams.set("minApy", filters.minApy);
  if (filters.maxApy) queryParams.set("maxApy", filters.maxApy);
  if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.set("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const apiUrl = `/api/protocols${queryString ? `?${queryString}` : ""}`;

  const { data: protocols, isLoading } = useQuery<DefiProtocol[]>({
    queryKey: ["/api/protocols", filters],
    queryFn: async () => {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch protocols");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Protocol Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Protocol Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <ProtocolFilters filters={filters} onFiltersChange={setFilters} />
          
          {/* Protocols List */}
          {protocols && protocols.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No protocols found matching your filters.
            </div>
          ) : null}
          {/* Header Row - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
            <div className="col-span-3">Protocol</div>
            <div className="col-span-2">TVL</div>
            <div className="col-span-2">Risk</div>
            <div className="col-span-2">Confidence</div>
            <div className="col-span-1">Trust Index</div>
            <div className="col-span-2"></div>
          </div>

          {/* Protocol Rows */}
          {protocols?.map((protocol) => (
            <div
              key={protocol.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg hover-elevate transition-all bg-muted/30 border border-border cursor-pointer"
              onClick={() => onProtocolSelect?.(protocol.id)}
              data-testid={`protocol-${protocol.symbol.toLowerCase()}`}
            >
              {/* Protocol Info */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {protocol.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold">{protocol.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{protocol.symbol}</p>
                  </div>
                </div>
              </div>

              {/* TVL */}
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground md:hidden">TVL</p>
                <p className="font-semibold" data-testid={`tvl-${protocol.symbol.toLowerCase()}`}>
                  ${parseFloat(protocol.tvl).toLocaleString()}
                </p>
                {protocol.apy && (
                  <p className="text-xs text-chart-3">
                    {parseFloat(protocol.apy).toFixed(2)}% APY
                  </p>
                )}
              </div>

              {/* Risk Score */}
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground md:hidden mb-1">Risk Level</p>
                <Badge 
                  className={getRiskColor(protocol.riskLevel)}
                  data-testid={`risk-${protocol.symbol.toLowerCase()}`}
                >
                  {protocol.riskLevel.toUpperCase()} ({protocol.riskScore}/100)
                </Badge>
              </div>

              {/* Confidence */}
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground md:hidden mb-2">Confidence</p>
                <div className="space-y-1">
                  <Progress value={protocol.confidence} className="h-2" />
                  <p className="text-xs text-muted-foreground">{protocol.confidence}%</p>
                </div>
              </div>

              {/* Trust Index */}
              <div className="md:col-span-1">
                <p className="text-sm text-muted-foreground md:hidden mb-1">Trust Index</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    protocol.trustIndex >= 70 ? 'bg-chart-3' :
                    protocol.trustIndex >= 40 ? 'bg-chart-4' : 'bg-chart-5'
                  }`} />
                  <span className="font-semibold" data-testid={`trust-${protocol.symbol.toLowerCase()}`}>
                    {protocol.trustIndex}/100
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-2 justify-end">
                <ExplainRiskDialog
                  protocolId={protocol.id}
                  protocolName={protocol.name}
                  trigger={
                    <Button variant="outline" size="sm" data-testid={`button-explain-${protocol.id}`}>
                      <Info className="w-4 h-4 mr-1" />
                      Explain
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  data-testid={`view-${protocol.symbol.toLowerCase()}`}
                >
                  <a
                    href={`https://shannon-explorer.somnia.network/address/${protocol.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
