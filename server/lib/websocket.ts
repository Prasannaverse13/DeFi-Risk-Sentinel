import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

export interface WebSocketMessage {
  type: "protocol_update" | "risk_alert" | "new_insight" | "position_change";
  data: any;
  timestamp: string;
}

let wss: WebSocketServer | null = null;
const clients = new Set<WebSocket>();

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(httpServer: Server): WebSocketServer {
  wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket client connected");
    clients.add(ws);

    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("WebSocket message received:", data);
        
        // Echo back for health check
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: "connected",
      message: "Connected to DeFi Risk Sentinel",
      timestamp: new Date().toISOString(),
    }));
  });

  console.log("WebSocket server initialized on /ws");
  return wss;
}

/**
 * Broadcast a message to all connected clients
 */
export function broadcast(message: WebSocketMessage): void {
  if (!wss) {
    console.warn("WebSocket server not initialized, cannot broadcast");
    return;
  }

  const payload = JSON.stringify(message);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  console.log(`Broadcasted ${message.type} to ${clients.size} clients`);
}

/**
 * Send protocol risk update
 */
export function notifyProtocolUpdate(protocolId: string, data: any): void {
  broadcast({
    type: "protocol_update",
    data: { protocolId, ...data },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send high-risk alert
 */
export function notifyRiskAlert(protocolId: string, riskScore: number, message: string): void {
  broadcast({
    type: "risk_alert",
    data: { protocolId, riskScore, message },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send new AI insight notification
 */
export function notifyNewInsight(insightId: string, walletAddress: string, severity: string): void {
  broadcast({
    type: "new_insight",
    data: { insightId, walletAddress, severity },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send position change notification
 */
export function notifyPositionChange(walletAddress: string, change: any): void {
  broadcast({
    type: "position_change",
    data: { walletAddress, ...change },
    timestamp: new Date().toISOString(),
  });
}
