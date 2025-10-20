import {
  defiProtocols,
  userPositions,
  aiInsights,
  riskTimeline,
  portfolioHistory,
  transactionHistory,
  type DefiProtocol,
  type InsertDefiProtocol,
  type UserPosition,
  type InsertUserPosition,
  type AiInsight,
  type InsertAiInsight,
  type RiskTimeline,
  type InsertRiskTimeline,
  type PortfolioHistory,
  type InsertPortfolioHistory,
  type TransactionHistory,
  type InsertTransactionHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte } from "drizzle-orm";

export interface IStorage {
  // DeFi Protocols
  getProtocols(): Promise<DefiProtocol[]>;
  getProtocol(id: string): Promise<DefiProtocol | undefined>;
  createProtocol(protocol: InsertDefiProtocol): Promise<DefiProtocol>;
  updateProtocol(id: string, protocol: Partial<InsertDefiProtocol>): Promise<DefiProtocol | undefined>;

  // User Positions
  getUserPositions(walletAddress: string): Promise<UserPosition[]>;
  getUserPosition(id: string): Promise<UserPosition | undefined>;
  createPosition(position: InsertUserPosition): Promise<UserPosition>;
  deletePosition(id: string): Promise<boolean>;

  // AI Insights
  getAiInsights(walletAddress: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;

  // Risk Timeline
  getRiskTimeline(protocolId?: string): Promise<RiskTimeline[]>;
  addRiskTimelineEntry(entry: InsertRiskTimeline): Promise<RiskTimeline>;

  // Portfolio History
  getPortfolioHistory(walletAddress: string, days?: number): Promise<PortfolioHistory[]>;
  recordPortfolioSnapshot(snapshot: InsertPortfolioHistory): Promise<PortfolioHistory>;

  // Transaction History
  getTransactionHistory(walletAddress: string, limit?: number): Promise<TransactionHistory[]>;
  recordTransaction(transaction: InsertTransactionHistory): Promise<TransactionHistory>;
  updateTransactionStatus(transactionHash: string, status: string, blockNumber?: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // DeFi Protocols
  async getProtocols(): Promise<DefiProtocol[]> {
    return await db.select().from(defiProtocols);
  }

  async getProtocol(id: string): Promise<DefiProtocol | undefined> {
    const [protocol] = await db.select().from(defiProtocols).where(eq(defiProtocols.id, id));
    return protocol || undefined;
  }

  async createProtocol(insertProtocol: InsertDefiProtocol): Promise<DefiProtocol> {
    const [protocol] = await db
      .insert(defiProtocols)
      .values(insertProtocol)
      .returning();
    return protocol;
  }

  async updateProtocol(
    id: string,
    updates: Partial<InsertDefiProtocol>
  ): Promise<DefiProtocol | undefined> {
    const [updated] = await db
      .update(defiProtocols)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(defiProtocols.id, id))
      .returning();
    return updated || undefined;
  }

  // User Positions
  async getUserPositions(walletAddress: string): Promise<UserPosition[]> {
    return await db
      .select()
      .from(userPositions)
      .where(eq(userPositions.walletAddress, walletAddress.toLowerCase()));
  }

  async getUserPosition(id: string): Promise<UserPosition | undefined> {
    const [position] = await db
      .select()
      .from(userPositions)
      .where(eq(userPositions.id, id));
    return position || undefined;
  }

  async createPosition(insertPosition: InsertUserPosition): Promise<UserPosition> {
    const [position] = await db
      .insert(userPositions)
      .values({
        ...insertPosition,
        walletAddress: insertPosition.walletAddress.toLowerCase(),
      })
      .returning();
    return position;
  }

  async deletePosition(id: string): Promise<boolean> {
    const result = await db
      .delete(userPositions)
      .where(eq(userPositions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // AI Insights
  async getAiInsights(walletAddress: string): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.walletAddress, walletAddress.toLowerCase()))
      .orderBy(desc(aiInsights.createdAt));
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const [insight] = await db
      .insert(aiInsights)
      .values({
        ...insertInsight,
        walletAddress: insertInsight.walletAddress.toLowerCase(),
      })
      .returning();
    return insight;
  }

  // Risk Timeline
  async getRiskTimeline(protocolId?: string): Promise<RiskTimeline[]> {
    if (protocolId) {
      return await db
        .select()
        .from(riskTimeline)
        .where(eq(riskTimeline.protocolId, protocolId));
    }
    return await db.select().from(riskTimeline);
  }

  async addRiskTimelineEntry(insertEntry: InsertRiskTimeline): Promise<RiskTimeline> {
    const [entry] = await db
      .insert(riskTimeline)
      .values(insertEntry)
      .returning();
    return entry;
  }

  // Portfolio History
  async getPortfolioHistory(walletAddress: string, days: number = 30): Promise<PortfolioHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db
      .select()
      .from(portfolioHistory)
      .where(
        and(
          eq(portfolioHistory.walletAddress, walletAddress.toLowerCase()),
          gte(portfolioHistory.timestamp, cutoffDate)
        )
      )
      .orderBy(portfolioHistory.timestamp);
  }

  async recordPortfolioSnapshot(insertSnapshot: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const [snapshot] = await db
      .insert(portfolioHistory)
      .values({
        ...insertSnapshot,
        walletAddress: insertSnapshot.walletAddress.toLowerCase(),
      })
      .returning();
    return snapshot;
  }

  // Transaction History
  async getTransactionHistory(walletAddress: string, limit: number = 50): Promise<TransactionHistory[]> {
    return await db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.walletAddress, walletAddress.toLowerCase()))
      .orderBy(desc(transactionHistory.timestamp))
      .limit(limit);
  }

  async recordTransaction(insertTransaction: InsertTransactionHistory): Promise<TransactionHistory> {
    const [transaction] = await db
      .insert(transactionHistory)
      .values({
        ...insertTransaction,
        walletAddress: insertTransaction.walletAddress.toLowerCase(),
      })
      .returning();
    return transaction;
  }

  async updateTransactionStatus(transactionHash: string, status: string, blockNumber?: number): Promise<void> {
    await db
      .update(transactionHistory)
      .set({ status, blockNumber })
      .where(eq(transactionHistory.transactionHash, transactionHash));
  }
}

export const storage = new DatabaseStorage();
