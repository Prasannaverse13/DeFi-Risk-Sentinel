import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, TrendingUp, Bell, Sparkles, Brain, Eye, Zap, Activity, BarChart3, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-chart-2/10 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by Gemini AI on Somnia Blockchain</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Protect Your DeFi <br />
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-pulse">
                Investments with AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Autonomous DeFi watchdog that continuously monitors protocols for risks like impermanent loss, 
              price manipulation, and rug-pull patterns — in real-time.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              size="lg"
                              className="text-lg px-8 py-6 h-auto"
                              data-testid="button-connect-wallet"
                            >
                              <Shield className="w-5 h-5 mr-2" />
                              Connect Wallet to Start
                            </Button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <Button
                              onClick={openChainModal}
                              variant="destructive"
                              size="lg"
                              data-testid="button-wrong-network"
                            >
                              Wrong network
                            </Button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
                <span>Somnia Testnet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Autonomous Agent Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">7 Autonomous AI Agent Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Advanced AI Protection Systems
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our autonomous AI agents work 24/7 to protect your DeFi investments with cutting-edge 
              machine learning, real-time monitoring, and predictive analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Feature 1: Explainable AI (XAI) */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Explainable AI (XAI)</h3>
                <p className="text-muted-foreground">
                  Understand every risk decision with detailed AI explanations. See key risk factors, 
                  technical analysis, and actionable recommendations in natural language.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    Live Now
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: AI Risk Detection */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-3/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold">AI Risk Detection</h3>
                <p className="text-muted-foreground">
                  Gemini-powered ML models analyze liquidity movements, volatility patterns, 
                  and suspicious wallet behaviors to detect threats before they materialize.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-chart-3 bg-chart-3/10 px-2 py-1 rounded">
                    Live Now
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: Whale Tracker */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-2/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">Whale Tracker & Market Pulse</h3>
                <p className="text-muted-foreground">
                  Monitor large transfers in real-time. AI classifies whale movements as routine, 
                  dump signals, or flash-loan attacks with instant WebSocket alerts.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Predictive Risk Forecasting */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-4/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Predictive Risk Forecasting</h3>
                <p className="text-muted-foreground">
                  Time-series ML models predict 24-48hr risk changes with confidence intervals. 
                  See volatility forecasts before they impact your positions.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5: Autonomous Action System */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-5/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold">Autonomous Auto-Rebalancing</h3>
                <p className="text-muted-foreground">
                  AI agents can automatically rebalance your positions when risk thresholds are breached. 
                  You control the rules, AI executes instantly.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6: Dynamic Trust Scoring */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Dynamic Trust Index</h3>
                <p className="text-muted-foreground">
                  Every protocol receives a 0-100 reputation score based on historical performance, 
                  security audits, anomaly frequency, and on-chain behavior.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    Live Now
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 7: Real-time Smart Alerts */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300 relative overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-4/20 to-transparent rounded-bl-full" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Smart Alerts</h3>
                <p className="text-muted-foreground">
                  WebSocket-powered instant notifications for high-risk events, pool breaches, 
                  price manipulation, and rug-pull indicators.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-medium text-chart-4 bg-chart-4/10 px-2 py-1 rounded">
                    ✨ Live Now
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Experience the future of autonomous DeFi risk management
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <Button
                  onClick={openConnectModal}
                  size="lg"
                  variant="default"
                  className="text-lg px-8 py-6 h-auto"
                  disabled={!mounted}
                  data-testid="button-try-ai-features"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Try AI Features Now
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to AI-powered DeFi protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Link your Somnia-compatible wallet using RainbowKit. Your positions 
                  are automatically detected and analyzed by AI.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">AI Analyzes Risks</h3>
                <p className="text-muted-foreground">
                  Gemini AI continuously monitors protocols, calculates risk scores, 
                  and identifies potential threats in real-time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border bg-card hover-elevate transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Get Instant Alerts</h3>
                <p className="text-muted-foreground">
                  Receive real-time notifications and AI-powered recommendations 
                  to rebalance, withdraw, or hold based on risk analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to protect your DeFi portfolio
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Somnia-compatible wallet using RainbowKit. Your positions 
                  will be automatically detected and analyzed.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-chart-2 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">AI Analyzes Your Positions</h3>
                <p className="text-muted-foreground">
                  Our Gemini-powered AI engine scans your DeFi positions, calculates risk scores, 
                  and identifies potential threats across all protocols.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-chart-3 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">Get Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  Receive AI-powered insights and actionable recommendations to rebalance, 
                  withdraw, or hold based on real-time risk analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Protect Your Portfolio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the future of DeFi security on Somnia blockchain
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <Button
                onClick={openConnectModal}
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                disabled={!mounted}
                data-testid="button-connect-wallet-footer"
              >
                <Shield className="w-5 h-5 mr-2" />
                Connect Wallet Now
              </Button>
            )}
          </ConnectButton.Custom>
        </div>
      </section>
    </div>
  );
}
