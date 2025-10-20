import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeProtocolRisk, analyzeUserPositions, explainRiskDecision } from "./lib/gemini";
import { scanAndUpdateProtocols, startProtocolScanning } from "./lib/protocolScanner";
import { getCurrentBlock } from "./lib/blockchain";
import { initializeWebSocket, notifyProtocolUpdate, notifyRiskAlert } from "./lib/websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data and start blockchain scanning
  async function initialize() {
    const existingProtocols = await storage.getProtocols();
    
    // Log Somnia blockchain connection
    try {
      const blockNumber = await getCurrentBlock();
      console.log(`✅ Connected to Somnia Testnet - Block #${blockNumber}`);
    } catch (error) {
      console.error("⚠️  Could not connect to Somnia RPC:", error);
    }
    
    if (existingProtocols.length > 0) {
      console.log(`Database initialized with ${existingProtocols.length} real protocols from Somnia blockchain`);
      // Update protocols with fresh blockchain data
      await scanAndUpdateProtocols();
    } else {
      console.log("Starting initial scan for DeFi protocols on Somnia Testnet...");
      // Scan blockchain for real protocols
      await scanAndUpdateProtocols();
      
      const protocols = await storage.getProtocols();
      if (protocols.length === 0) {
        console.log("⚠️  No DeFi protocols discovered yet. Waiting for deployments on Somnia Testnet.");
      } else {
        console.log(`✅ Discovered ${protocols.length} real protocols from Somnia blockchain`);
      }
    }
    
    // Start automated protocol scanning every 15 minutes
    startProtocolScanning(15);
  }

  // Initialize
  await initialize();

  // GET /api/risk-metrics - Overall portfolio metrics
  app.get("/api/risk-metrics", async (req, res) => {
    try {
      const protocols = await storage.getProtocols();
      
      const totalValue = protocols.reduce((sum, p) => sum + parseFloat(p.tvl), 0);
      const avgRiskScore = protocols.length > 0
        ? Math.round(protocols.reduce((sum, p) => sum + p.riskScore, 0) / protocols.length)
        : 0;
      
      // Count active alerts (protocols with risk > 70)
      const activeAlerts = protocols.filter(p => p.riskScore > 70).length;

      res.json({
        totalValue: totalValue.toFixed(2),
        avgRiskScore,
        protocolsMonitored: protocols.length,
        activeAlerts,
      });
    } catch (error) {
      console.error("Error fetching risk metrics:", error);
      res.status(500).json({ error: "Failed to fetch risk metrics" });
    }
  });

  // GET /api/protocols - List all DeFi protocols with risk data (with search and filters)
  app.get("/api/protocols", async (req, res) => {
    try {
      const { 
        search, 
        riskLevel, 
        minTvl, 
        maxTvl, 
        minApy, 
        maxApy,
        sortBy = "tvl",
        sortOrder = "desc"
      } = req.query;

      let protocols = await storage.getProtocols();

      // Search filter (name, symbol, or contract address)
      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        protocols = protocols.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.symbol.toLowerCase().includes(searchLower) ||
          p.contractAddress.toLowerCase().includes(searchLower)
        );
      }

      // Risk level filter
      if (riskLevel && typeof riskLevel === "string") {
        protocols = protocols.filter(p => p.riskLevel === riskLevel);
      }

      // TVL range filter
      if (minTvl && typeof minTvl === "string") {
        const minTvlNum = parseFloat(minTvl);
        protocols = protocols.filter(p => parseFloat(p.tvl) >= minTvlNum);
      }
      if (maxTvl && typeof maxTvl === "string") {
        const maxTvlNum = parseFloat(maxTvl);
        protocols = protocols.filter(p => parseFloat(p.tvl) <= maxTvlNum);
      }

      // APY range filter
      if (minApy && typeof minApy === "string") {
        const minApyNum = parseFloat(minApy);
        protocols = protocols.filter(p => p.apy && parseFloat(p.apy) >= minApyNum);
      }
      if (maxApy && typeof maxApy === "string") {
        const maxApyNum = parseFloat(maxApy);
        protocols = protocols.filter(p => p.apy && parseFloat(p.apy) <= maxApyNum);
      }

      // Sorting
      if (sortBy && typeof sortBy === "string") {
        protocols.sort((a, b) => {
          let aVal: any, bVal: any;
          
          switch (sortBy) {
            case "tvl":
              aVal = parseFloat(a.tvl);
              bVal = parseFloat(b.tvl);
              break;
            case "riskScore":
              aVal = a.riskScore;
              bVal = b.riskScore;
              break;
            case "trustIndex":
              aVal = a.trustIndex;
              bVal = b.trustIndex;
              break;
            case "apy":
              aVal = a.apy ? parseFloat(a.apy) : 0;
              bVal = b.apy ? parseFloat(b.apy) : 0;
              break;
            case "name":
              aVal = a.name.toLowerCase();
              bVal = b.name.toLowerCase();
              break;
            default:
              aVal = parseFloat(a.tvl);
              bVal = parseFloat(b.tvl);
          }

          if (sortOrder === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      res.json(protocols);
    } catch (error) {
      console.error("Error fetching protocols:", error);
      res.status(500).json({ error: "Failed to fetch protocols" });
    }
  });

  // GET /api/ai-insights - Get AI insights for connected wallet
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const walletAddress = req.query.wallet as string;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const insights = await storage.getAiInsights(walletAddress);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  // GET /api/risk-timeline - Historical risk scores for charts
  app.get("/api/risk-timeline", async (req, res) => {
    try {
      const timeline = await storage.getRiskTimeline();
      const protocols = await storage.getProtocols();
      
      if (timeline.length === 0) {
        // Return empty array if no timeline data
        return res.json([]);
      }
      
      // Create a map of protocol IDs to symbols
      const protocolMap = new Map<string, string>();
      protocols.forEach(p => protocolMap.set(p.id, p.symbol));
      
      // Group by ISO timestamp (for sorting) and pivot by protocol symbol
      interface TimelineDataPoint {
        timestamp: string;
        isoTime: string;
        [key: string]: string | number;
      }
      
      const timelineByTimestamp = new Map<string, TimelineDataPoint>();
      
      timeline.forEach(entry => {
        const symbol = protocolMap.get(entry.protocolId);
        if (!symbol) return;
        
        const date = new Date(entry.timestamp);
        const isoTime = date.toISOString();
        const displayTime = date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        if (!timelineByTimestamp.has(isoTime)) {
          timelineByTimestamp.set(isoTime, {
            timestamp: displayTime,
            isoTime: isoTime,
          });
        }
        
        const dataPoint = timelineByTimestamp.get(isoTime)!;
        dataPoint[symbol] = entry.riskScore;
      });
      
      // Convert map to array and sort chronologically by ISO timestamp
      const chartData = Array.from(timelineByTimestamp.values())
        .sort((a, b) => new Date(a.isoTime).getTime() - new Date(b.isoTime).getTime());
      
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching risk timeline:", error);
      res.status(500).json({ error: "Failed to fetch risk timeline" });
    }
  });

  // GET /api/positions - Get user's DeFi positions
  app.get("/api/positions", async (req, res) => {
    try {
      const walletAddress = req.query.wallet as string;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const positions = await storage.getUserPositions(walletAddress);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ error: "Failed to fetch positions" });
    }
  });

  // GET /api/alerts - Get active risk alerts based on real protocol data
  app.get("/api/alerts", async (req, res) => {
    try {
      const walletAddress = req.query.wallet as string;
      
      // Get protocols with high risk scores (>70) as alerts
      const protocols = await storage.getProtocols();
      const highRiskProtocols = protocols.filter(p => p.riskScore > 70);
      
      const alerts = highRiskProtocols.map(protocol => ({
        id: `alert-${protocol.id}`,
        type: "high_risk" as const,
        severity: protocol.riskScore > 85 ? "critical" as const : "warning" as const,
        title: `High Risk Detected: ${protocol.name}`,
        message: `${protocol.symbol} shows elevated risk score of ${protocol.riskScore}/100. Consider reviewing your position.`,
        timestamp: new Date().toISOString(),
        protocolId: protocol.id,
      }));
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // POST /api/analyze-position - Trigger AI analysis for wallet
  app.post("/api/analyze-position", async (req, res) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      // Get user's positions
      const positions = await storage.getUserPositions(walletAddress);

      if (positions.length === 0) {
        return res.status(404).json({ error: "No positions found for this wallet" });
      }

      // Analyze positions with Gemini AI
      const insight = await analyzeUserPositions({
        walletAddress,
        positions: positions.map(p => ({
          poolName: p.poolName,
          amount: p.amount,
          apy: p.apy || undefined,
          riskLevel: p.riskLevel,
        })),
      });

      // Store the insight
      const created = await storage.createAiInsight({
        walletAddress,
        insightType: "analysis",
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        recommendations: insight.recommendations,
      });

      res.json(created);
    } catch (error) {
      console.error("Error analyzing position:", error);
      res.status(500).json({ error: "Failed to analyze position" });
    }
  });

  // POST /api/analyze-protocol - Analyze a specific protocol with AI
  app.post("/api/analyze-protocol", async (req, res) => {
    try {
      const { protocolId } = req.body;

      if (!protocolId) {
        return res.status(400).json({ error: "Protocol ID required" });
      }

      const protocol = await storage.getProtocol(protocolId);
      if (!protocol) {
        return res.status(404).json({ error: "Protocol not found" });
      }

      // Analyze with Gemini AI
      const analysis = await analyzeProtocolRisk({
        protocolName: protocol.name,
        tvl: protocol.tvl,
        apy: protocol.apy || undefined,
        contractAddress: protocol.contractAddress,
      });

      // Update protocol with new analysis
      await storage.updateProtocol(protocolId, {
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        trustIndex: analysis.trustIndex,
      });

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing protocol:", error);
      res.status(500).json({ error: "Failed to analyze protocol" });
    }
  });

  // POST /api/explain-risk - Get detailed AI explanation for protocol risk score (XAI)
  app.post("/api/explain-risk", async (req, res) => {
    try {
      const { protocolId } = req.body;

      if (!protocolId) {
        return res.status(400).json({ error: "Protocol ID required" });
      }

      const protocol = await storage.getProtocol(protocolId);
      if (!protocol) {
        return res.status(404).json({ error: "Protocol not found" });
      }

      // Generate detailed explanation with Gemini AI
      const explanation = await explainRiskDecision({
        protocolName: protocol.name,
        symbol: protocol.symbol,
        riskScore: protocol.riskScore,
        riskLevel: protocol.riskLevel,
        tvl: protocol.tvl,
        apy: protocol.apy,
        trustIndex: protocol.trustIndex,
        confidence: protocol.confidence,
      });

      res.json(explanation);
    } catch (error) {
      console.error("Error explaining risk decision:", error);
      res.status(500).json({ error: "Failed to explain risk decision" });
    }
  });

  // POST /api/rebalance-position - Initiate position rebalancing
  app.post("/api/rebalance-position", async (req, res) => {
    try {
      const { positionId } = req.body;

      if (!positionId) {
        return res.status(400).json({ error: "Position ID required" });
      }

      const position = await storage.getUserPosition(positionId);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }

      // Get protocol data for rebalancing analysis
      const protocol = await storage.getProtocol(position.protocolId);
      if (!protocol) {
        return res.status(404).json({ error: "Associated protocol not found" });
      }

      // In a real implementation, this would:
      // 1. Analyze current position vs optimal allocation
      // 2. Calculate transaction costs
      // 3. Execute blockchain transactions for rebalancing
      // 4. Update position amounts in database
      
      // For now, we'll simulate the rebalancing process
      const rebalanceMessage = protocol.riskLevel === 'high' 
        ? `Reducing exposure in ${protocol.name} due to high risk. Consider moving ${(parseFloat(position.amount) * 0.3).toFixed(4)} tokens to lower-risk protocols.`
        : protocol.riskLevel === 'medium'
        ? `Optimizing position in ${protocol.name}. Suggested reallocation to maintain balanced risk profile.`
        : `Maintaining position in ${protocol.name}. Current allocation is optimal for low-risk strategy.`;

      res.json({
        success: true,
        message: rebalanceMessage,
        positionId,
        action: protocol.riskLevel === 'high' ? 'reduce' : 'maintain',
      });
    } catch (error) {
      console.error("Error rebalancing position:", error);
      res.status(500).json({ error: "Failed to rebalance position" });
    }
  });

  // GET /api/portfolio-history - Get portfolio value history over time
  app.get("/api/portfolio-history", async (req, res) => {
    try {
      const walletAddress = req.query.wallet as string;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const history = await storage.getPortfolioHistory(walletAddress, days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching portfolio history:", error);
      res.status(500).json({ error: "Failed to fetch portfolio history" });
    }
  });

  // GET /api/transaction-history - Get transaction history for wallet
  app.get("/api/transaction-history", async (req, res) => {
    try {
      const walletAddress = req.query.wallet as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const transactions = await storage.getTransactionHistory(walletAddress, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      res.status(500).json({ error: "Failed to fetch transaction history" });
    }
  });

  // POST /api/record-transaction - Record a new transaction
  app.post("/api/record-transaction", async (req, res) => {
    try {
      const { insertTransactionHistorySchema } = await import("@shared/schema");
      
      // Validate request body with Zod schema
      const validatedData = insertTransactionHistorySchema.parse(req.body);

      const transaction = await storage.recordTransaction(validatedData);
      res.json(transaction);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid transaction data", 
          details: error.errors 
        });
      }
      console.error("Error recording transaction:", error);
      res.status(500).json({ error: "Failed to record transaction" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for real-time updates
  initializeWebSocket(httpServer);

  return httpServer;
}
