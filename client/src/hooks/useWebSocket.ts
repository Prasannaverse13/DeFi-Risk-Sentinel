import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface WebSocketMessage {
  type: "protocol_update" | "risk_alert" | "new_insight" | "position_change" | "connected" | "pong";
  data?: any;
  message?: string;
  timestamp: string;
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Use window.location to determine protocol (ws or wss)
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Send ping to test connection
      ws.send(JSON.stringify({ type: "ping", timestamp: new Date().toISOString() }));
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      wsRef.current = null;
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  }, []);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log("WebSocket message:", message);

    switch (message.type) {
      case "connected":
        console.log("Connected to WebSocket server:", message.message);
        break;

      case "protocol_update":
        // Invalidate protocols query to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
        queryClient.invalidateQueries({ queryKey: ["/api/risk-timeline"] });
        toast({
          title: "Protocol Updated",
          description: "Risk data has been updated for a monitored protocol",
        });
        break;

      case "risk_alert":
        // Show critical alert toast
        queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
        toast({
          title: "⚠️ High Risk Alert",
          description: message.data?.message || "A protocol has exceeded risk threshold",
          variant: "destructive",
        });
        break;

      case "new_insight":
        // Invalidate AI insights
        queryClient.invalidateQueries({ queryKey: ["/api/ai-insights"] });
        const severity = message.data?.severity;
        toast({
          title: severity === "critical" ? "🚨 Critical Insight" : "💡 New AI Insight",
          description: "A new risk analysis insight is available",
          variant: severity === "critical" ? "destructive" : "default",
        });
        break;

      case "position_change":
        // Invalidate positions query
        queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/portfolio-history"] });
        break;

      case "pong":
        // Health check response
        console.log("WebSocket ping-pong successful");
        break;

      default:
        console.log("Unknown WebSocket message type:", message.type);
    }
  }, [queryClient, toast]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { isConnected: wsRef.current?.readyState === WebSocket.OPEN };
}
