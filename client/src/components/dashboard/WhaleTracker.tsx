import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Zap, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WhaleEvent {
  id: string;
  timestamp: Date;
  type: 'normal' | 'whale' | 'flashloan';
  protocol: string;
  action: string;
  amount: string;
  address: string;
  txHash: string;
  impact: 'low' | 'medium' | 'high';
}

export function WhaleTracker() {
  const [events, setEvents] = useState<WhaleEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate whale tracking with mock events initially
    // In production, this would connect to Somnia WebSocket
    const mockEvents: WhaleEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'whale',
        protocol: 'SomniaSwap',
        action: 'Withdraw',
        amount: '3.2M SOMI',
        address: '0x742d...8f2a',
        txHash: '0xabc123...',
        impact: 'high',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 12 * 60000),
        type: 'normal',
        protocol: 'DreamPool',
        action: 'Deposit',
        amount: '250K USDC',
        address: '0x5e8b...4d1c',
        txHash: '0xdef456...',
        impact: 'low',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 18 * 60000),
        type: 'flashloan',
        protocol: 'StableFarm',
        action: 'Flash Borrow',
        amount: '5.8M USDT',
        address: '0x9c3a...7e6f',
        txHash: '0xghi789...',
        impact: 'medium',
      },
    ];

    setEvents(mockEvents);
    setIsConnected(true);

    // Simulate new events coming in
    const interval = setInterval(() => {
      const newEvent: WhaleEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: Math.random() > 0.7 ? 'whale' : Math.random() > 0.5 ? 'normal' : 'flashloan',
        protocol: ['SomniaSwap', 'DreamPool', 'StableFarm'][Math.floor(Math.random() * 3)],
        action: ['Deposit', 'Withdraw', 'Swap'][Math.floor(Math.random() * 3)],
        amount: `${(Math.random() * 10).toFixed(1)}M ${['SOMI', 'USDC', 'ETH'][Math.floor(Math.random() * 3)]}`,
        address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        impact: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
    }, 30000); // New event every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'whale': return 'text-chart-4 bg-chart-4/10';
      case 'flashloan': return 'text-destructive bg-destructive/10';
      default: return 'text-chart-3 bg-chart-3/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whale': return <Activity className="w-6 h-6 text-chart-4" />;
      case 'flashloan': return <Zap className="w-6 h-6 text-destructive" />;
      default: return <TrendingUp className="w-6 h-6 text-chart-3" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-chart-4';
      default: return 'text-chart-3';
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <CardTitle>Whale Tracker & Market Pulse</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time large transaction monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-chart-3 animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {events.map((event, index) => (
              <div 
                key={event.id}
                className="p-4 rounded-lg border border-border bg-muted/30 hover-elevate transition-all"
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                }}
                data-testid={`whale-event-${event.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getTypeIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type === 'whale' ? 'Whale' : event.type === 'flashloan' ? 'Flash-Loan' : 'Normal'}
                        </Badge>
                        <span className="text-sm font-medium">{event.protocol}</span>
                        <span className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{event.action}:</span>
                          <span className="font-medium">{event.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">From:</span>
                          <code className="bg-muted px-1 py-0.5 rounded">{event.address}</code>
                          <a 
                            href={`https://shannon-explorer.somnia.network/tx/${event.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Tx
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={getImpactColor(event.impact)}>
                      {event.impact === 'high' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : event.impact === 'medium' ? (
                        <Activity className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {event.impact} impact
                    </Badge>
                  </div>
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
      </CardContent>
    </Card>
  );
}
