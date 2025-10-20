import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// DeFi Protocol Risk Data
export const defiProtocols = pgTable("defi_protocols", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  tvl: decimal("tvl", { precision: 20, scale: 2 }).notNull(),
  riskScore: integer("risk_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // "low" | "medium" | "high"
  confidence: integer("confidence").notNull(), // 0-100
  trustIndex: integer("trust_index").notNull(), // 0-100
  apy: decimal("apy", { precision: 10, scale: 2 }),
  contractAddress: text("contract_address").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDefiProtocolSchema = createInsertSchema(defiProtocols).omit({
  id: true,
  updatedAt: true,
});

export type InsertDefiProtocol = z.infer<typeof insertDefiProtocolSchema>;
export type DefiProtocol = typeof defiProtocols.$inferSelect;

// User DeFi Positions
export const userPositions = pgTable("user_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  protocolId: text("protocol_id").notNull(),
  poolName: text("pool_name").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  apy: decimal("apy", { precision: 10, scale: 2 }),
  riskLevel: text("risk_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserPositionSchema = createInsertSchema(userPositions).omit({
  id: true,
  createdAt: true,
});

export type InsertUserPosition = z.infer<typeof insertUserPositionSchema>;
export type UserPosition = typeof userPositions.$inferSelect;

// AI Insights & Analysis
export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  protocolId: text("protocol_id"),
  insightType: text("insight_type").notNull(), // "risk_alert" | "recommendation" | "analysis"
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // "info" | "warning" | "critical"
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

// Risk Timeline History
export const riskTimeline = pgTable("risk_timeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  protocolId: text("protocol_id").notNull(),
  riskScore: integer("risk_score").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertRiskTimelineSchema = createInsertSchema(riskTimeline).omit({
  id: true,
});

export type InsertRiskTimeline = z.infer<typeof insertRiskTimelineSchema>;
export type RiskTimeline = typeof riskTimeline.$inferSelect;

// TypeScript-only types for frontend use
export interface RiskMetrics {
  totalValue: string;
  avgRiskScore: number;
  protocolsMonitored: number;
  activeAlerts: number;
}

export interface ChartDataPoint {
  timestamp: string;
  [key: string]: string | number; // Dynamic keys for different protocols
}

export interface AiRecommendation {
  action: "hold" | "rebalance" | "withdraw";
  reason: string;
  confidence: number;
  suggestedPool?: string;
  potentialRiskReduction?: number;
}

// Portfolio History - Track portfolio value over time
export const portfolioHistory = pgTable("portfolio_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 2 }).notNull(),
  riskScore: integer("risk_score").notNull(), // Portfolio-wide risk score
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertPortfolioHistorySchema = createInsertSchema(portfolioHistory).omit({
  id: true,
});

export type InsertPortfolioHistory = z.infer<typeof insertPortfolioHistorySchema>;
export type PortfolioHistory = typeof portfolioHistory.$inferSelect;

// Transaction History - Track all DeFi transactions
export const transactionHistory = pgTable("transaction_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  transactionHash: text("transaction_hash").notNull().unique(),
  transactionType: text("transaction_type").notNull(), // "deposit" | "withdraw" | "swap" | "rebalance"
  protocolId: text("protocol_id").notNull(),
  poolName: text("pool_name").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  status: text("status").notNull(), // "pending" | "confirmed" | "failed"
  blockNumber: integer("block_number"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTransactionHistorySchema = createInsertSchema(transactionHistory).omit({
  id: true,
});

export type InsertTransactionHistory = z.infer<typeof insertTransactionHistorySchema>;
export type TransactionHistory = typeof transactionHistory.$inferSelect;
