import { scanSomniaProtocols, getCurrentBlock, type LiquidityPool } from "./blockchain";
import { storage } from "../storage";
import { analyzeProtocolRisk } from "./gemini";
import type { InsertDefiProtocol } from "@shared/schema";
import { notifyProtocolUpdate, notifyRiskAlert } from "./websocket";

/**
 * Scan Somnia blockchain for new DeFi protocols and update database
 */
export async function scanAndUpdateProtocols(): Promise<void> {
  try {
    console.log("Starting Somnia blockchain scan for DeFi protocols...");
    
    // Get current block for logging
    const currentBlock = await getCurrentBlock();
    console.log(`Current Somnia block: ${currentBlock}`);
    
    // Scan blockchain for liquidity pools
    const pools = await scanSomniaProtocols();
    
    if (pools.length === 0) {
      console.log("⚠️  No DeFi protocols found on Somnia Testnet yet. Scanner will retry in 15 minutes.");
      return;
    }
    
    console.log(`Found ${pools.length} liquidity pools on Somnia`);
    
    // Process each pool
    for (const pool of pools) {
      const poolSymbol = `${pool.token0.symbol}-${pool.token1.symbol}`;
      const poolName = `${pool.token0.name}/${pool.token1.name} Pool`;
      
      // Check if protocol already exists
      const existing = await storage.getProtocols();
      const existingProtocol = existing.find(p => p.contractAddress === pool.pairAddress);
      
      if (existingProtocol) {
        // Update existing protocol with fresh blockchain data
        const oldRiskScore = existingProtocol.riskScore;
        await storage.updateProtocol(existingProtocol.id, {
          tvl: pool.tvl,
          apy: pool.apy,
        });
        console.log(`Updated protocol: ${poolSymbol}`);
        
        // Save risk timeline entry for historical tracking
        await storage.addRiskTimelineEntry({
          protocolId: existingProtocol.id,
          riskScore: existingProtocol.riskScore,
          timestamp: new Date(),
        });
        
        // Notify WebSocket clients of protocol update
        notifyProtocolUpdate(existingProtocol.id, {
          name: poolSymbol,
          tvl: pool.tvl,
          apy: pool.apy,
        });
        
        // Check if risk increased significantly
        const newProtocol = await storage.getProtocol(existingProtocol.id);
        if (newProtocol && newProtocol.riskScore > oldRiskScore + 10) {
          notifyRiskAlert(
            existingProtocol.id,
            newProtocol.riskScore,
            `${poolSymbol} risk score increased from ${oldRiskScore} to ${newProtocol.riskScore}`
          );
        }
      } else {
        // Analyze new protocol with Gemini AI
        const analysis = await analyzeProtocolRisk({
          protocolName: poolName,
          tvl: pool.tvl,
          apy: pool.apy,
          contractAddress: pool.pairAddress,
        });
        
        // Create new protocol in database
        const newProtocol: InsertDefiProtocol = {
          name: poolName,
          symbol: poolSymbol,
          tvl: pool.tvl,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
          confidence: analysis.confidence,
          trustIndex: analysis.trustIndex,
          apy: pool.apy || null,
          contractAddress: pool.pairAddress,
        };
        
        const created = await storage.createProtocol(newProtocol);
        console.log(`Added new protocol: ${poolSymbol}`);
        
        // Save initial risk timeline entry for new protocol
        await storage.addRiskTimelineEntry({
          protocolId: created.id,
          riskScore: analysis.riskScore,
          timestamp: new Date(),
        });
        
        // Notify WebSocket clients of new protocol
        notifyProtocolUpdate(created.id, {
          name: poolSymbol,
          isNew: true,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
        });
        
        // Send alert if new protocol is high risk
        if (analysis.riskScore > 70) {
          notifyRiskAlert(
            created.id,
            analysis.riskScore,
            `New high-risk protocol detected: ${poolSymbol} (Risk: ${analysis.riskScore}/100)`
          );
        }
      }
    }
    
    console.log("Protocol scan completed successfully");
  } catch (error) {
    console.error("Error scanning Somnia protocols:", error);
  }
}

/**
 * Schedule periodic blockchain scans
 */
export function startProtocolScanning(intervalMinutes: number = 15): NodeJS.Timeout {
  console.log(`Starting automated protocol scanning every ${intervalMinutes} minutes`);
  
  // Run initial scan
  scanAndUpdateProtocols();
  
  // Schedule periodic scans
  return setInterval(
    () => scanAndUpdateProtocols(),
    intervalMinutes * 60 * 1000
  );
}
