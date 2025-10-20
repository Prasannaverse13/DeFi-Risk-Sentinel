import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ProtocolRiskTable } from "@/components/dashboard/ProtocolRiskTable";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { RiskTimelineChart } from "@/components/dashboard/RiskTimelineChart";
import { UserPositions } from "@/components/dashboard/UserPositions";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { PredictiveForecaster } from "@/components/dashboard/PredictiveForecaster";
import { WhaleTracker } from "@/components/dashboard/WhaleTracker";
import { PortfolioOptimizer } from "@/components/dashboard/PortfolioOptimizer";
import { AgentMesh } from "@/components/dashboard/AgentMesh";
import { AutonomousMode } from "@/components/dashboard/AutonomousMode";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Activity, Target, Network, Zap } from "lucide-react";
import type { DefiProtocol } from "@shared/schema";

export default function Dashboard() {
  const { address } = useAccount();
  const [selectedProtocol, setSelectedProtocol] = useState<string | undefined>();
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  // Fetch protocols to auto-select first one
  const { data: protocols } = useQuery<DefiProtocol[]>({
    queryKey: ['/api/protocols'],
  });

  // Auto-select first protocol on load
  useEffect(() => {
    if (protocols && protocols.length > 0 && !selectedProtocol) {
      setSelectedProtocol(protocols[0].id);
    }
  }, [protocols, selectedProtocol]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Alert Banner */}
        <AlertBanner />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-dashboard-title">
            Risk Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitoring {address && (
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - AI Insights */}
          <div className="lg:col-span-1 space-y-6">
            <AiInsightCard />
          </div>

          {/* Right Column - Protocol Table */}
          <div className="lg:col-span-2">
            <ProtocolRiskTable onProtocolSelect={setSelectedProtocol} />
          </div>
        </div>

        {/* AI Co-Pilot Features Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Co-Pilot Features
          </h2>
          <Tabs defaultValue="forecast" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="forecast" className="gap-2" data-testid="tab-forecast">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Forecast</span>
              </TabsTrigger>
              <TabsTrigger value="whale" className="gap-2" data-testid="tab-whale">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Whale Tracker</span>
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="gap-2" data-testid="tab-optimizer">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Optimizer</span>
              </TabsTrigger>
              <TabsTrigger value="mesh" className="gap-2" data-testid="tab-mesh">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Agent Mesh</span>
              </TabsTrigger>
              <TabsTrigger value="autonomous" className="gap-2" data-testid="tab-autonomous">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Autonomous</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecast">
              <PredictiveForecaster protocolId={selectedProtocol} />
            </TabsContent>

            <TabsContent value="whale">
              <WhaleTracker />
            </TabsContent>

            <TabsContent value="optimizer">
              <PortfolioOptimizer />
            </TabsContent>

            <TabsContent value="mesh">
              <AgentMesh />
            </TabsContent>

            <TabsContent value="autonomous">
              <AutonomousMode />
            </TabsContent>
          </Tabs>
        </div>

        {/* Risk Timeline Chart */}
        <div className="mb-6">
          <RiskTimelineChart />
        </div>

        {/* User Positions */}
        <UserPositions />
      </div>
    </div>
  );
}
