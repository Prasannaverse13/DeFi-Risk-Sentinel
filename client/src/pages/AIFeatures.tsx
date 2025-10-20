import { Shield, Eye, Activity, BarChart3, Zap, Target, Bell, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AIFeatures() {
  const features = [
    {
      icon: Eye,
      title: "Explainable AI (XAI)",
      description: "Understand every risk decision with detailed AI explanations. See key risk factors, technical analysis, and actionable recommendations in natural language.",
      status: "Live Now",
      statusColor: "primary",
      gradient: "from-primary/20",
    },
    {
      icon: Shield,
      title: "AI Risk Detection Engine",
      description: "Gemini-powered ML models analyze liquidity movements, volatility patterns, and suspicious wallet behaviors to detect threats before they materialize.",
      status: "Live Now",
      statusColor: "chart-3",
      gradient: "from-chart-3/20",
    },
    {
      icon: Activity,
      title: "Whale Tracker & Market Pulse",
      description: "Monitor large transfers in real-time. AI classifies whale movements as routine, dump signals, or flash-loan attacks with instant WebSocket alerts.",
      status: "Coming Soon",
      statusColor: "muted-foreground",
      gradient: "from-chart-2/20",
    },
    {
      icon: BarChart3,
      title: "Predictive Risk Forecasting",
      description: "Time-series ML models predict 24-48hr risk changes with confidence intervals. See volatility forecasts before they impact your positions.",
      status: "Coming Soon",
      statusColor: "muted-foreground",
      gradient: "from-chart-4/20",
    },
    {
      icon: Zap,
      title: "Autonomous Auto-Rebalancing",
      description: "AI agents can automatically rebalance your positions when risk thresholds are breached. You control the rules, AI executes instantly.",
      status: "Coming Soon",
      statusColor: "muted-foreground",
      gradient: "from-chart-5/20",
    },
    {
      icon: Target,
      title: "Dynamic Trust Index",
      description: "Every protocol receives a 0-100 reputation score based on historical performance, audit status, liquidity depth, and community sentiment.",
      status: "Live Now",
      statusColor: "primary",
      gradient: "from-primary/20",
    },
    {
      icon: Bell,
      title: "Real-time Smart Alerts",
      description: "Intelligent notification system filters noise and surfaces critical events: rug-pull patterns, flash crashes, and anomalous contract upgrades.",
      status: "Live Now",
      statusColor: "chart-3",
      gradient: "from-destructive/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">7 Autonomous AI Agent Features</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Advanced AI Protection Systems
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Our autonomous AI agents work 24/7 to protect your DeFi investments with cutting-edge 
              machine learning, real-time monitoring, and predictive analytics
            </p>
            <Button size="lg" data-testid="button-back-home" asChild>
              <Link href="/">
                <a>
                  <Shield className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </a>
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden"
                data-testid={`card-feature-${index}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} to-transparent rounded-bl-full`} />
                <CardContent className="p-6 space-y-4 relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-${feature.statusColor}/10 flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 text-${feature.statusColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="pt-2">
                    <span className={`text-xs font-medium text-${feature.statusColor} bg-${feature.statusColor}/10 px-2 py-1 rounded`}>
                      {feature.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto p-8 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Ready to Secure Your DeFi Portfolio?</h2>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to access all AI-powered risk protection features
              </p>
              <Button size="lg" variant="default" data-testid="button-get-started" asChild>
                <Link href="/">
                  <a>
                    <Shield className="w-5 h-5 mr-2" />
                    Get Started Now
                  </a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
