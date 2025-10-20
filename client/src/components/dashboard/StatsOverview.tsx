import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsOverview() {
  const { data: metrics, isLoading } = useQuery<{
    totalValue: string;
    avgRiskScore: number;
    protocolsMonitored: number;
    activeAlerts: number;
  }>({
    queryKey: ["/api/risk-metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Value Locked (TVL)",
      value: `$${metrics?.totalValue || "0"}`,
      icon: TrendingUp,
      trend: "+12.5%",
      trendUp: true,
      testId: "stat-total-value",
    },
    {
      label: "Average Risk Score",
      value: metrics?.avgRiskScore || 0,
      suffix: "/100",
      icon: Shield,
      trend: "-3 pts",
      trendUp: true,
      color: "text-chart-3",
      testId: "stat-avg-risk",
    },
    {
      label: "Protocols Monitored",
      value: metrics?.protocolsMonitored || 0,
      icon: TrendingUp,
      testId: "stat-protocols",
    },
    {
      label: "Active Alerts",
      value: metrics?.activeAlerts || 0,
      icon: AlertTriangle,
      trend: "+2",
      trendUp: false,
      color: "text-chart-4",
      testId: "stat-alerts",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-border hover-elevate transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color || ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-chart-3' : 'text-chart-5'}`}>
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">{stat.trend}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold" data-testid={stat.testId}>
                  {stat.value}{stat.suffix}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
