import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Network, ArrowRight, Brain } from "lucide-react";

interface AgentMessage {
  id: string;
  timestamp: Date;
  from: string;
  to: string;
  type: 'alert' | 'response' | 'query';
  message: string;
  importance: 'low' | 'medium' | 'high';
}

export function AgentMesh() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize with some sample agent communications
    const initialMessages: AgentMessage[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60000),
        from: 'DeFiRiskSentinel',
        to: 'YieldGuard',
        type: 'alert',
        message: 'SOMI-ETH pool instability detected. Risk score: 82/100',
        importance: 'high',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3 * 60000),
        from: 'YieldGuard',
        to: 'DeFiRiskSentinel',
        type: 'response',
        message: 'Strategy reduced by 12%. Reallocating to stable pools.',
        importance: 'medium',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 5 * 60000),
        from: 'LiquidationBot',
        to: 'DeFiRiskSentinel',
        type: 'query',
        message: 'Request risk assessment for 0x742d...8f2a position',
        importance: 'low',
      },
    ];

    setMessages(initialMessages);
    setIsConnected(true);

    // Simulate agent messages
    const agentNames = ['DeFiRiskSentinel', 'YieldGuard', 'LiquidationBot', 'RebalanceAgent', 'GovernanceAI'];
    const messageTemplates = [
      'High volatility detected in {pool}',
      'Position rebalancing recommended',
      'Flash loan attack pattern identified',
      'Governance proposal #X requires review',
      'Whale movement detected: {amount}',
      'Risk threshold breached for {protocol}',
      'Optimal reallocation computed',
      'Smart contract upgrade detected',
    ];

    const interval = setInterval(() => {
      const from = agentNames[Math.floor(Math.random() * agentNames.length)];
      let to = agentNames[Math.floor(Math.random() * agentNames.length)];
      while (to === from) {
        to = agentNames[Math.floor(Math.random() * agentNames.length)];
      }

      const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      const message = template
        .replace('{pool}', ['SOMI-ETH', 'BTC-USDC', 'USDT-DAI'][Math.floor(Math.random() * 3)])
        .replace('{amount}', `${(Math.random() * 10).toFixed(1)}M SOMI`)
        .replace('{protocol}', ['SomniaSwap', 'DreamPool', 'StableFarm'][Math.floor(Math.random() * 3)]);

      const newMessage: AgentMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        from,
        to,
        type: ['alert', 'response', 'query'][Math.floor(Math.random() * 3)] as any,
        message,
        importance: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      };

      setMessages(prev => [newMessage, ...prev].slice(0, 50));
    }, 15000); // New message every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-destructive/10 text-destructive';
      case 'response': return 'bg-chart-3/10 text-chart-3';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high': return <Badge className="bg-destructive/10 text-destructive">High Priority</Badge>;
      case 'medium': return <Badge className="bg-chart-4/10 text-chart-4">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Agent Mesh Network</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time AI-to-AI communication</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-chart-3 animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Mesh Active' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={msg.id}
                className="p-4 rounded-lg border border-border bg-muted/30 hover-elevate transition-all"
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                }}
                data-testid={`agent-message-${msg.id}`}
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(msg.type)}>
                        {msg.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {getImportanceBadge(msg.importance)}
                  </div>

                  {/* Agent Communication Flow */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10">
                      <Brain className="w-3 h-3 text-primary" />
                      <span className="font-medium">{msg.from}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-chart-2/10">
                      <Brain className="w-3 h-3 text-chart-2" />
                      <span className="font-medium">{msg.to}</span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-sm text-foreground pl-2 border-l-2 border-primary/30">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔗 Public mesh relay - All agent communications are transparent and auditable
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
