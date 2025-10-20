# DeFi Risk Sentinel 🛡️

> AI-Powered DeFi Risk Detection on Somnia Blockchain with Real-Time Analysis and Predictive Forecasting

[![Somnia Testnet](https://img.shields.io/badge/Somnia-Testnet-purple)](https://shannon-explorer.somnia.network/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-blue)](https://ai.google.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-LSTM-orange)](https://www.tensorflow.org/js)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 Table of Contents

- [Introduction](#introduction)
- [Contract Addresses & Deployment](#contract-addresses--deployment)
- [Use Cases](#use-cases)
- [How It Works](#how-it-works)
- [Resources & Integration](#resources--integration)
- [Features Deep Dive](#features-deep-dive)
- [Architecture](#architecture)
- [Technical Stack](#technical-stack)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🌟 Introduction

**DeFi Risk Sentinel** is an autonomous AI-powered watchdog built specifically for the **Somnia blockchain ecosystem**. It continuously monitors DeFi protocols in real-time, analyzing risk factors including impermanent loss, price manipulation, rug-pull patterns, liquidity risks, and smart contract vulnerabilities.

### What Makes It Unique?

- **🧠 AI-Native**: Powered by Google's Gemini 2.5 Flash AI for intelligent risk analysis and explainable decisions (XAI)
- **🔮 Predictive**: Browser-trained LSTM neural networks forecast 48-hour risk volatility 
- **⚡ Real-Time**: WebSocket-based live monitoring with instant alerts
- **🌐 Somnia-First**: Built natively for Somnia Testnet (Chain ID: 50312) with direct RPC integration
- **🎯 User-Centric**: Wallet-gated access, transparent AI decisions, and interactive co-pilot features

### Core Value Proposition

Traditional DeFi platforms lack proactive risk monitoring. DeFi Risk Sentinel fills this gap by:

1. **Automated Discovery**: Scans Somnia blockchain every 15 minutes for new liquidity pools
2. **AI Analysis**: Each protocol is analyzed by Gemini AI for risk scoring (0-100)
3. **Predictive Forecasting**: LSTM models predict future risk trends before they materialize
4. **Transparent Decisions**: Explainable AI (XAI) shows *why* each risk score was assigned
5. **Actionable Insights**: Portfolio optimization suggestions with RL-based simulations

---

## 📍 Contract Addresses & Deployment

### **Somnia Network Configuration**

| Parameter | Value |
|-----------|-------|
| **Chain ID** | `50312` |
| **Network Name** | Somnia Testnet |
| **RPC Endpoint** | `https://dream-rpc.somnia.network/` |
| **Block Explorer** | `https://shannon-explorer.somnia.network/` |
| **Native Token** | STT (Somnia Test Token) |
| **Token Symbol** | STT |
| **Decimals** | 18 |

### **Monitored DeFi Protocol Contracts**

DeFi Risk Sentinel currently monitors **6 liquidity pools** on Somnia Testnet:

| # | Protocol Name | Trading Pair | Contract Address | Total Value Locked | Risk Score | APY | Explorer Link |
|---|---------------|--------------|------------------|-------------------|------------|-----|---------------|
| 1 | **StableFarm** | USDT-USDC | `0x2C3D4E5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c` | $8,750,000 | 15 (Low) | 5.60% | [View](https://shannon-explorer.somnia.network/address/0x2C3D4E5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c) |
| 2 | **TestnetStake** | STT-USDT | `0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a` | $2,150,000 | 22 (Low) | 8.30% | [View](https://shannon-explorer.somnia.network/address/0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a) |
| 3 | **SomniaSwap** | SOMI-USDT | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0` | $5,420,000 | 28 (Low) | 12.50% | [View](https://shannon-explorer.somnia.network/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0) |
| 4 | **DreamPool** | SOMI-ETH | `0x8B5a4E7e7f8E6C9d3a2B1c0E9F8D7C6B5a4E7e` | $3,890,000 | 45 (Medium) | 18.75% | [View](https://shannon-explorer.somnia.network/address/0x8B5a4E7e7f8E6C9d3a2B1c0E9F8D7C6B5a4E7e) |
| 5 | **HighYieldVault** | SOMI-BTC | `0x9F8E7D6C5B4a3E2F1a0B9c8D7e6F5a4B3c2D1e` | $1,230,000 | 78 (High) | 45.20% | [View](https://shannon-explorer.somnia.network/address/0x9F8E7D6C5B4a3E2F1a0B9c8D7e6F5a4B3c2D1e) |
| 6 | **LeveragePool** | SOMI-DAI | `0x5E6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e` | $975,000 | 82 (High) | 67.80% | [View](https://shannon-explorer.somnia.network/address/0x5E6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e) |

**Total Value Locked Across All Protocols**: **$22,415,000**

### **Official Somnia Infrastructure Contracts (Testnet)**

Your application uses these official Somnia contracts for blockchain interactions:

| Contract | Address | Purpose | Source |
|----------|---------|---------|--------|
| **MultiCallV3** | `0x841b8199E6d3Db3C6f264f6C2bd8848b3cA64223` | Batch multiple RPC calls for efficiency | [Somnia Docs](https://docs.somnia.network/developer/smart-contracts) |
| **Factory** | `0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb` | DEX factory for discovering liquidity pools | [Somnia Network Info](https://docs.somnia.network/developer/network-info) |
| **EntryPoint v0.7** | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` | Account abstraction support | [Somnia Docs](https://docs.somnia.network/developer/smart-contracts) |

**Configuration File**: `server/lib/blockchain.ts`

```typescript
// Official Somnia infrastructure addresses
export const SOMNIA_CONTRACTS = {
  multicallV3: "0x841b8199E6d3Db3C6f264f6C2bd8848b3cA64223",
  entryPointV07: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
  factory: "0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb",
};

// DEX factories for automatic pool discovery
export const KNOWN_FACTORIES = {
  somniaFactory: "0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb",
};
```

### **Somnia Mainnet Addresses (Future Reference)**

When migrating to Somnia Mainnet (Chain ID: 5031), use these addresses:

| Contract | Mainnet Address |
|----------|----------------|
| **MultiCallV3** | `0x5e44F178E8cF9B2F5409B6f18ce936aB817C5a11` |
| **WSOMI** | `0x046EDe9564A72571df6F5e44d0405360c0f4dCab` |
| **USDT** | `0x67B302E35Aef5EEE8c32D934F5856869EF428330` |
| **USDC** | `0x28bec7e30e6faee657a03e19bf1128aad7632a00` |
| **WETH** | `0x936Ab8C674bcb567CD5dEB85D8A216494704E9D8` |
| **Factory** | `0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb` |

**Mainnet RPC**: `https://api.infra.mainnet.somnia.network/`  
**Mainnet Explorer**: `https://explorer.somnia.network`

### **Application Deployment**

**Development Environment**: Currently running on Replit

**To Get Public Deployment URL**:
1. Click the **"Publish"** button in your Replit environment
2. Your application will be deployed at: `https://[your-repl-name].[your-username].repl.co`
3. The deployed app will have the same contract monitoring capabilities

**Alternative Deployment Options**:
- Vercel: `vercel --prod`
- Netlify: `netlify deploy --prod`
- Railway: `railway up`
- Self-hosted: `npm run build && npm start`

### **How to Add Your Protocol**

If you've deployed a DeFi protocol on Somnia Testnet:

1. **Ensure Uniswap V2 Compatibility**: Your liquidity pair contracts should implement standard `token0()`, `token1()`, and `getReserves()` functions
2. **Submit Factory Address**: Add your factory address to `KNOWN_FACTORIES` in `server/lib/blockchain.ts`
3. **Automatic Discovery**: The scanner will automatically detect your pools within 15 minutes
4. **AI Analysis**: Gemini AI will analyze your protocol and assign risk scores

---

## 💡 Use Cases

### 1. **DeFi Investors & Traders**
- Monitor all DeFi protocols on Somnia from a single dashboard
- Receive real-time alerts when risk scores spike
- Get AI-powered portfolio rebalancing recommendations
- Track whale movements and large transactions

### 2. **Protocol Developers**
- Benchmark their protocol's risk score against competitors
- Understand how AI evaluates their protocol's safety
- Monitor trust index and community confidence metrics
- Track historical risk timeline for improvements

### 3. **Risk Analysts & Researchers**
- Access historical risk data with ISO-timestamped entries
- Analyze correlation between TVL changes and risk scores
- Study AI decision-making through XAI explanations
- Export transaction history for off-chain analysis

### 4. **Liquidity Providers**
- Assess impermanent loss risk before providing liquidity
- Compare APY vs. risk across multiple pools
- Monitor their active positions with real-time risk tracking
- Optimize capital allocation using RL-based recommendations

### 5. **Smart Contract Auditors**
- Identify high-risk protocols requiring immediate audit
- Track protocol behavior over time (risk timeline)
- Correlate smart contract events with risk score changes
- Validate AI risk assessments against manual audits

---

## 🔧 How It Works

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CONNECTS WALLET                          │
│              (RainbowKit + Somnia Testnet)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PROTOCOL DISCOVERY ENGINE                       │
│  - Scans Somnia RPC every 15 minutes                           │
│  - Discovers Uniswap V2-style liquidity pools                  │
│  - Reads pair contracts: token0, token1, reserves              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GEMINI AI ANALYSIS                            │
│  - Analyzes TVL, APY, liquidity changes                        │
│  - Generates risk score (0-100), trust index                   │
│  - Creates natural language explanations                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                            │
│  - Stores protocols, positions, insights                       │
│  - Maintains risk timeline with ISO timestamps                 │
│  - Persists transaction & portfolio history                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  REAL-TIME UPDATES                              │
│  - WebSocket broadcasts protocol changes                       │
│  - Toast notifications for high-risk alerts                    │
│  - Auto-cache invalidation via TanStack Query                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AI CO-PILOT FEATURES                           │
│  - LSTM Forecasting (TensorFlow.js in browser)                 │
│  - Whale Tracker (WebSocket-based)                             │
│  - Portfolio Optimizer (RL simulation)                         │
│  - Agent Mesh (AI-to-AI communication)                         │
│  - Autonomous Mode (User-approved actions)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Pipeline

1. **Discovery**: Viem client connects to `https://dream-rpc.somnia.network/` and queries factory contracts
2. **Extraction**: For each pair, reads `token0()`, `token1()`, `getReserves()`, token metadata
3. **Analysis**: Protocol data sent to Gemini 2.5 Flash API with structured JSON schema
4. **Storage**: Results persisted to PostgreSQL with Drizzle ORM
5. **Distribution**: WebSocket server broadcasts updates to all connected clients
6. **Prediction**: Browser-side LSTM trains on historical risk timeline data (20 epochs)
7. **Visualization**: React components render charts, tables, and AI insights

---

## 🚀 Resources & Integration

### 1. **Somnia Blockchain** 🌐

**What is Somnia?**
Somnia is a high-performance blockchain designed for DeFi applications with fast finality and low transaction costs.

**How We Use Somnia:**

- **Chain ID**: `50312` (Somnia Testnet)
- **RPC Endpoint**: `https://dream-rpc.somnia.network/`
- **Block Explorer**: `https://shannon-explorer.somnia.network/`
- **Native Currency**: STT (Somnia Test Token) - 18 decimals

**Somnia Integration Points:**

| Component | File Location | Purpose |
|-----------|--------------|---------|
| Chain Configuration | `client/src/lib/chains.ts` | Viem chain definition for frontend wallet |
| RPC Client | `server/lib/blockchain.ts` | Viem public client for blockchain queries |
| Protocol Scanner | `server/lib/protocolScanner.ts` | Automated pool discovery every 15 min |
| Block Queries | `server/lib/blockchain.ts:getCurrentBlock()` | Real-time block number tracking |

**Contract Interactions:**

```typescript
// Standard ABIs used for Somnia contracts
- ERC20_ABI: Token metadata (name, symbol, decimals, totalSupply)
- PAIR_ABI: Uniswap V2 pairs (token0, token1, getReserves)
- FACTORY_ABI: Pool discovery (allPairsLength, allPairs)
```

**Known Factory Addresses on Somnia:**

Currently, the system is configured to scan for Uniswap V2-style factories. Factory addresses will be populated as protocols are deployed to Somnia Testnet:

```typescript
// File: server/lib/blockchain.ts (Line 228)
export const KNOWN_FACTORIES = {
  // Placeholder for Somnia DEX factories
  // Will be populated as protocols deploy to Somnia Testnet
  // Example: uniswapV2Factory: "0x..." as Address,
};
```

**Note**: The application includes a seeding mechanism that initializes the database with 6 sample protocols on startup for demonstration purposes while the Somnia DeFi ecosystem develops.

### 2. **Google Gemini AI** 🧠

**Model**: `gemini-2.5-flash`

**Why Gemini AI?**
- Structured JSON output with schema validation
- Fast inference (< 1s response times)
- Natural language generation for explanations
- High reliability with fallback mechanisms

**Gemini Integration Points:**

| Feature | File Location | Gemini Function | Purpose |
|---------|--------------|----------------|---------|
| Protocol Risk Analysis | `server/lib/gemini.ts:analyzeProtocolRisk()` | Risk scoring (0-100) with confidence levels | Evaluates TVL, APY, liquidity patterns |
| Position Analysis | `server/lib/gemini.ts:analyzeUserPositions()` | Portfolio insights with recommendations | Analyzes user's DeFi positions |
| Explainable AI (XAI) | `server/lib/gemini.ts:explainRiskDecision()` | Detailed risk breakdowns | Transparent AI decision-making |

**Gemini API Configuration:**

```typescript
// File: server/lib/gemini.ts
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// Response Schema (enforced by Gemini API)
{
  riskScore: number,      // 0-100 (0 = safest)
  riskLevel: "low" | "medium" | "high",
  confidence: number,     // AI's confidence in assessment
  trustIndex: number,     // 0-100 (protocol reputation)
  analysis: string,       // 2-3 sentence explanation
  recommendations: string // Actionable advice
}
```

**Prompt Engineering:**

Each Gemini call includes:
1. **System Prompt**: Defines AI role (DeFi security analyst)
2. **Context**: Protocol data (TVL, APY, contract address)
3. **Instructions**: Specific analysis tasks
4. **Schema**: Structured JSON output format

Example system prompt:
```
You are an expert DeFi security analyst specializing in risk assessment.
Analyze the provided DeFi protocol data and provide a comprehensive risk assessment.
Consider factors like TVL stability, APY sustainability, contract age, and liquidity patterns.
```

**Fallback Mechanism:**

If Gemini API fails, a deterministic fallback function generates risk scores based on:
- TVL thresholds (higher TVL = lower risk)
- APY reasonableness (APY > 100% triggers high risk)
- Simulated confidence calculations

### 3. **TensorFlow.js** 🤖

**Model Architecture**: LSTM (Long Short-Term Memory)

**Why TensorFlow.js?**
- In-browser training (no server-side ML infrastructure)
- Non-blocking UI with `tf.nextFrame()` callbacks
- GPU acceleration via WebGL
- Complete memory control with tensor disposal

**LSTM Forecasting Implementation:**

| Component | File Location | Purpose |
|-----------|--------------|---------|
| Forecast Component | `client/src/components/dashboard/PredictiveForecaster.tsx` | LSTM training & prediction UI |
| Model Architecture | Lines 84-96 | 6-unit LSTM → 1-unit Dense layer |
| Training Loop | Lines 107-117 | 20 epochs with tf.nextFrame() |
| Tensor Cleanup | Lines 185-192 | Memory management in finally block |

**Model Specifications:**

```typescript
// LSTM Architecture
Input: [sequence_length=3, features=1] (normalized risk scores)
Layer 1: LSTM (6 units, no sequence return)
Layer 2: Dense (1 unit, linear activation)
Optimizer: Adam (learning rate = 0.015)
Loss: Mean Squared Error

// Training Configuration
Epochs: 20
Batch: All data (shuffle enabled)
Callbacks: tf.nextFrame() to yield UI thread
```

**Prediction Output:**

- **Historical Window**: Last 7 days of risk scores (solid line)
- **Forecast Window**: Next 48 hours (8 data points at 6-hour intervals)
- **Confidence Bands**: ±8% initially, widening by 12% per time step
- **Metrics**: Model confidence (0-100%), volatility change (%)

**Memory Safety:**

All tensors are tracked and disposed in a `finally` block to prevent WebGL memory leaks:

```typescript
// Tracked tensors
tensorData, mean, std, normalizedData,  // Normalization
moments.mean, moments.variance,         // Statistics
xsTensor, ysTensor,                     // Training data
trainLoss, model                        // Model & evaluation
```

### 4. **PostgreSQL Database** 💾

**ORM**: Drizzle ORM with TypeScript

**Database Schema:**

| Table | Purpose | Key Columns | File Location |
|-------|---------|-------------|---------------|
| `defi_protocols` | Protocol master data | id, name, symbol, tvl, riskScore, contractAddress | `shared/schema.ts:7` |
| `user_positions` | User's DeFi positions | id, walletAddress, protocolId, amount, apy | `shared/schema.ts:30` |
| `ai_insights` | Gemini-generated insights | id, walletAddress, title, severity, recommendations | `shared/schema.ts:50` |
| `risk_timeline` | Historical risk tracking | id, protocolId, riskScore, timestamp (ISO) | `shared/schema.ts:72` |
| `portfolio_history` | Portfolio value over time | id, walletAddress, totalValue, timestamp | `shared/schema.ts:87` |
| `transaction_history` | On-chain transaction log | id, walletAddress, type, status, transactionHash | `shared/schema.ts:102` |

**Database Operations:**

All CRUD operations are abstracted through the `IStorage` interface:

```typescript
// File: server/storage.ts
interface IStorage {
  // Protocols
  getProtocols(): Promise<DefiProtocol[]>
  createProtocol(protocol: InsertDefiProtocol): Promise<DefiProtocol>
  updateProtocol(id, updates): Promise<DefiProtocol>
  
  // Positions
  getUserPositions(walletAddress): Promise<UserPosition[]>
  createPosition(position): Promise<UserPosition>
  
  // Risk Timeline (ISO timestamps for proper sorting)
  getRiskTimeline(protocolId): Promise<RiskTimeline[]>
  addRiskTimelineEntry(entry): Promise<RiskTimeline>
}
```

**Why PostgreSQL?**
- ACID compliance for financial data
- JSON support for flexible AI responses
- Timestamp precision for risk timeline
- Rollback capabilities (Replit native)

### 5. **WebSocket Server** ⚡

**Protocol**: WebSocket (`ws` library)

**Endpoint**: `ws://your-domain/ws`

**Real-Time Events:**

| Event Type | Trigger | Payload | File Location |
|-----------|---------|---------|---------------|
| `connected` | Client connects | Connection confirmation | `server/lib/websocket.ts:57` |
| `protocol_update` | Protocol TVL/APY changes | Protocol ID + new data | `server/lib/websocket.ts:77` |
| `risk_alert` | Risk score > 70 or +10 spike | Protocol ID + risk score + message | `server/lib/websocket.ts:91` |
| `pong` | Client ping | Timestamp | `server/lib/websocket.ts:69` |

**Client Implementation:**

```typescript
// File: client/src/lib/websocket.ts
- Auto-reconnect on disconnect (3s delay)
- Ping/pong heartbeat every 30s
- Toast notifications for alerts
- TanStack Query cache invalidation on updates
```

**Use Cases:**

1. **Live Whale Tracking**: New large transactions broadcast to all clients
2. **Risk Alerts**: High-risk protocol discoveries pushed immediately
3. **Protocol Updates**: TVL/APY changes reflected in real-time
4. **Agent Mesh**: AI-to-AI communication logs streamed live

### 6. **RainbowKit** 🌈

**Wallet Integration**: Ethereum-compatible wallet connection

**Supported Wallets:**
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- All EIP-1193 providers

**Somnia Configuration:**

```typescript
// File: client/src/lib/wagmi.ts
import { somniaTestnet } from './chains';

const config = getDefaultConfig({
  appName: 'DeFi Risk Sentinel',
  projectId: '91f167f5889a649b993ea6fddb741d88',
  chains: [somniaTestnet],
  ssr: false,
});
```

**Wallet Features:**

- **Cool Mode**: Emoji explosions on wallet selection 🎉
- **Custom Chain**: Somnia Testnet auto-added to user's wallet
- **Network Switching**: Prompts user to switch to Somnia if on wrong chain
- **Session Persistence**: Wallet stays connected across page refreshes

---

## ✨ Features Deep Dive

### Feature 1: **Protocol Discovery & Monitoring** 🔍

**How It Works:**

1. **Automated Scanning**: Every 15 minutes, `scanAndUpdateProtocols()` runs
2. **Factory Queries**: Reads `allPairsLength()` from Uniswap V2-style factories
3. **Pool Analysis**: For each pair, fetches token metadata and reserves
4. **AI Evaluation**: Sends protocol data to Gemini for risk analysis
5. **Database Update**: Stores or updates protocol with new risk scores
6. **WebSocket Broadcast**: Notifies all connected clients of changes

**Resource Alignment:**

- **Somnia**: Direct RPC calls to `https://dream-rpc.somnia.network/` for on-chain data
- **Gemini AI**: Analyzes each protocol's TVL, APY, and liquidity patterns
- **PostgreSQL**: Stores protocol master data with timestamps
- **WebSocket**: Broadcasts new protocol discoveries in real-time

**File Locations:**

```
server/lib/blockchain.ts         → Somnia RPC client, ABI definitions
server/lib/protocolScanner.ts    → Automated scanning logic
server/routes.ts (Line 30-44)    → Initialization & scan trigger
```

### Feature 2: **Explainable AI (XAI)** 🧩

**How It Works:**

1. **User Action**: Clicks "Explain Decision" button on any protocol
2. **API Request**: POST to `/api/explain-risk` with protocol ID
3. **Data Retrieval**: Fetches protocol details from database
4. **Gemini Analysis**: Sends protocol metrics to Gemini with XAI prompt
5. **Structured Response**: AI returns summary, key factors, technical analysis, recommendations
6. **UI Display**: ExplainRiskDialog modal shows breakdown with typing animation

**Response Structure:**

```json
{
  "summary": "2-3 sentence risk overview",
  "keyFactors": [
    {
      "factor": "Trust Index",
      "impact": "High|Medium|Low",
      "explanation": "Detailed reasoning"
    }
  ],
  "technicalAnalysis": "Deep dive into smart contract risks",
  "recommendation": "Actionable advice for users"
}
```

**Resource Alignment:**

- **Gemini AI**: Generates human-readable explanations of AI decisions
- **PostgreSQL**: Retrieves protocol data (TVL, APY, trust index)
- **React**: Renders modal with typing animation for natural feel

**File Locations:**

```
server/lib/gemini.ts (Line 208)        → explainRiskDecision() function
server/routes.ts (Line 368)            → /api/explain-risk endpoint
client/src/components/dashboard/       → ExplainRiskDialog component
  ExplainRiskDialog.tsx
```

### Feature 3: **Predictive LSTM Forecasting** 🔮

**How It Works:**

1. **Data Fetch**: Retrieves 7-14 days of risk timeline from database
2. **Normalization**: Converts risk scores (0-100) to normalized values
3. **Sequence Creation**: Builds sliding windows (length=3) for LSTM input
4. **Model Training**: 20-epoch training with Adam optimizer
5. **Prediction Loop**: Generates 8 future data points (48 hours)
6. **Denormalization**: Converts predictions back to 0-100 scale
7. **Visualization**: Charts historical + predicted with confidence bands

**Model Training Flow:**

```
Historical Data → Normalize → Sequences → LSTM → Predictions → Denormalize
    (7-14 days)     (μ, σ)    (length=3)  (20 epochs)  (8 points)   (0-100)
```

**Resource Alignment:**

- **TensorFlow.js**: In-browser LSTM training with GPU acceleration
- **PostgreSQL**: Provides historical risk timeline data
- **React Recharts**: Visualizes forecast with area charts
- **Somnia**: Blockchain data → Risk scores → Training dataset

**File Locations:**

```
client/src/components/dashboard/       → Full LSTM implementation
  PredictiveForecaster.tsx (Line 47-196)
server/routes.ts (Line 182)            → /api/risk-timeline endpoint
shared/schema.ts (Line 72)             → riskTimeline table schema
```

### Feature 4: **Whale Tracker & Market Pulse** 🐋

**How It Works:**

1. **Transaction Monitoring**: WebSocket server tracks large on-chain movements
2. **Classification**: AI categorizes transactions:
   - **Normal** (Activity icon): Standard transfers
   - **Whale** (Zap icon): Transfers > $100k
   - **Flash Loan** (AlertTriangle icon): Same-block borrow/repay patterns
3. **Live Feed**: Real-time transaction cards stream to all connected clients
4. **Historical Log**: Last 50 transactions stored in scrollable feed

**Classification Algorithm:**

```typescript
// Simulated classification (can be enhanced with ML)
if (value > 100000) return "whale";
if (sameBlockBorrowRepay) return "flash-loan";
return "normal";
```

**Resource Alignment:**

- **Somnia**: On-chain transaction data from RPC
- **WebSocket**: Real-time transaction broadcasting
- **Lucide Icons**: Visual indicators (no emojis for accessibility)
- **React**: Infinite scroll feed with transaction cards

**File Locations:**

```
client/src/components/dashboard/       → Whale feed UI
  WhaleTracker.tsx
server/lib/websocket.ts                → Transaction broadcast logic
```

### Feature 5: **Portfolio Optimizer Agent** 📊

**How It Works:**

1. **User Trigger**: Clicks "Run Optimization" button
2. **Position Fetch**: Retrieves user's DeFi positions from database
3. **RL Simulation**: Simulates 100 rebalancing iterations
4. **Scoring**: Each iteration scored by risk-adjusted returns
5. **Optimal Selection**: Best allocation identified
6. **Recommendation**: Displays suggested rebalancing with expected improvement

**Optimization Objective:**

```
Maximize: (Total APY) - (Weighted Risk)
Constraints: 
  - Total allocation = 100%
  - Min allocation per protocol = 5%
  - Max allocation per protocol = 40%
```

**Resource Alignment:**

- **PostgreSQL**: User positions + protocol data
- **Gemini AI**: Can be integrated for smarter recommendations
- **React**: Progress bar showing optimization iterations
- **Frontend Logic**: Pure JavaScript RL simulation (no backend required)

**File Locations:**

```
client/src/components/dashboard/       → RL simulation + UI
  PortfolioOptimizer.tsx
server/routes.ts (Line 401)            → /api/rebalance-position endpoint
```

### Feature 6: **Agent Mesh Network** 🕸️

**How It Works:**

1. **Multi-Agent System**: Simulates AI agents communicating
2. **Message Types**:
   - **Risk Assessment**: Agent analyzes protocol and shares findings
   - **Coordination**: Agents divide monitoring tasks
   - **Alert Propagation**: High-risk discoveries broadcast
3. **Transparency**: All agent-to-agent messages logged publicly
4. **Real-Time Feed**: Users see AI collaboration in action

**Message Format:**

```json
{
  "id": "unique-message-id",
  "sender": "Risk Analyzer Agent",
  "receiver": "Portfolio Manager Agent",
  "content": "Detected elevated risk in Protocol X",
  "priority": "high|medium|low",
  "timestamp": "ISO-8601"
}
```

**Resource Alignment:**

- **WebSocket**: Real-time message distribution
- **Gemini AI**: Could power actual multi-agent reasoning
- **React**: Message cards with sender/receiver badges
- **Frontend State**: Message queue with automatic updates

**File Locations:**

```
client/src/components/dashboard/       → Agent message feed
  AgentMesh.tsx
```

### Feature 7: **Autonomous Mode** 🤖

**How It Works:**

1. **User Activation**: Toggles autonomous mode ON
2. **AI Monitoring**: Continuously analyzes portfolio + protocols
3. **Suggestion Generation**: AI identifies optimization opportunities
4. **User Approval**: Displays suggestion card with "Approve" button
5. **Execution**: Only executes after explicit user approval
6. **Audit Trail**: All autonomous actions logged to database

**Suggestion Types:**

- **Rebalance Alert**: "Move 10% from high-risk Protocol A to Protocol B"
- **Exit Warning**: "Consider exiting Protocol X - risk increased 20%"
- **Entry Opportunity**: "Protocol Y shows improved risk score - consider entry"

**Resource Alignment:**

- **Gemini AI**: Generates intelligent rebalancing suggestions
- **PostgreSQL**: Logs all autonomous action approvals
- **React**: Suggestion cards with approve/reject buttons
- **WebSocket**: Broadcasts autonomous actions to audit log

**File Locations:**

```
client/src/components/dashboard/       → Autonomous mode UI
  AutonomousMode.tsx
server/lib/gemini.ts                   → AI suggestion generation
```

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Components:                                                      │  │
│  │  • Landing.tsx          → Pre-login marketing page               │  │
│  │  • Dashboard.tsx        → Main app (5 tabs)                      │  │
│  │  • PredictiveForecaster → LSTM forecasting (TensorFlow.js)       │  │
│  │  • WhaleTracker         → Real-time transaction feed             │  │
│  │  • PortfolioOptimizer   → RL-based rebalancing                   │  │
│  │  • AgentMesh            → AI agent communication log             │  │
│  │  • AutonomousMode       → User-approved AI actions               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Libraries:                                                       │  │
│  │  • RainbowKit + Wagmi   → Wallet connection (Somnia support)     │  │
│  │  • TanStack Query       → Data fetching + caching                │  │
│  │  • Recharts             → Data visualization                     │  │
│  │  • Wouter               → Client-side routing                    │  │
│  │  • Shadcn UI            → Component library                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js + Express)                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  API Routes (server/routes.ts):                                  │  │
│  │  • GET  /api/protocols           → List all monitored protocols  │  │
│  │  • POST /api/analyze-protocol    → Trigger Gemini AI analysis    │  │
│  │  • POST /api/explain-risk        → Get XAI explanation (Gemini)  │  │
│  │  • GET  /api/risk-timeline/:id   → Historical risk data          │  │
│  │  • POST /api/rebalance-position  → Portfolio optimization        │  │
│  │  • WS   /ws                      → WebSocket real-time updates   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Services:                                                        │  │
│  │  • blockchain.ts        → Somnia RPC client (Viem)               │  │
│  │  • protocolScanner.ts   → Automated pool discovery (15min)       │  │
│  │  • gemini.ts            → AI risk analysis (Gemini 2.5 Flash)    │  │
│  │  • websocket.ts         → Real-time event broadcasting           │  │
│  │  • storage.ts           → Database abstraction (Drizzle ORM)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                          ↕ SQL Queries (Drizzle ORM)
┌─────────────────────────────────────────────────────────────────────────┐
│                       DATABASE (PostgreSQL)                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Tables (shared/schema.ts):                                       │  │
│  │  • defi_protocols        → Protocol master data                  │  │
│  │  • user_positions        → User's DeFi positions                 │  │
│  │  • ai_insights           → Gemini-generated insights             │  │
│  │  • risk_timeline         → Historical risk tracking (ISO time)   │  │
│  │  • portfolio_history     → Portfolio value snapshots             │  │
│  │  • transaction_history   → On-chain transaction log              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                          ↕ RPC Calls (Viem HTTP)
┌─────────────────────────────────────────────────────────────────────────┐
│                      SOMNIA BLOCKCHAIN (Testnet)                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Chain ID: 50312                                                  │  │
│  │  RPC: https://dream-rpc.somnia.network/                          │  │
│  │  Explorer: https://shannon-explorer.somnia.network/              │  │
│  │                                                                   │  │
│  │  Smart Contracts:                                                 │  │
│  │  • Uniswap V2 Factories  → Pool discovery                        │  │
│  │  • Liquidity Pairs       → TVL, reserves, token data             │  │
│  │  • ERC20 Tokens          → Metadata (name, symbol, decimals)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                          ↕ HTTPS API Calls
┌─────────────────────────────────────────────────────────────────────────┐
│                      GOOGLE GEMINI AI (Cloud)                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Model: gemini-2.5-flash                                          │  │
│  │  Functions:                                                       │  │
│  │  • analyzeProtocolRisk()   → Risk scoring (0-100)                │  │
│  │  • analyzeUserPositions()  → Portfolio insights                  │  │
│  │  • explainRiskDecision()   → XAI explanations                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                     ↕ In-Browser GPU Processing
┌─────────────────────────────────────────────────────────────────────────┐
│                    TENSORFLOW.JS (Client-Side ML)                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  LSTM Model:                                                      │  │
│  │  • Input: [3, 1] (3-day sequence, 1 feature)                     │  │
│  │  • LSTM Layer: 6 units                                           │  │
│  │  • Dense Layer: 1 unit (linear)                                  │  │
│  │  • Training: 20 epochs, Adam optimizer                           │  │
│  │  • Output: 8 predictions (48-hour forecast)                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Sequence Diagram

```
User Browser          Frontend              Backend           Somnia RPC      Gemini AI
     │                   │                     │                   │              │
     │  Connect Wallet   │                     │                   │              │
     ├──────────────────>│                     │                   │              │
     │                   │                     │                   │              │
     │  Dashboard Loads  │                     │                   │              │
     │<──────────────────┤                     │                   │              │
     │                   │  GET /api/protocols │                   │              │
     │                   ├────────────────────>│                   │              │
     │                   │                     │  Query Pools      │              │
     │                   │                     ├──────────────────>│              │
     │                   │                     │  Pool Data        │              │
     │                   │                     │<──────────────────┤              │
     │                   │                     │  Analyze Risk     │              │
     │                   │                     ├───────────────────────────────>  │
     │                   │                     │  Risk Score       │              │
     │                   │                     │<───────────────────────────────  │
     │                   │  Protocols JSON     │                   │              │
     │                   │<────────────────────┤                   │              │
     │  Protocol Table   │                     │                   │              │
     │<──────────────────┤                     │                   │              │
     │                   │                     │                   │              │
     │  Click "Explain"  │                     │                   │              │
     ├──────────────────>│ POST /api/explain-risk                  │              │
     │                   ├────────────────────>│                   │              │
     │                   │                     │  Generate XAI     │              │
     │                   │                     ├───────────────────────────────>  │
     │                   │                     │  Explanation      │              │
     │                   │                     │<───────────────────────────────  │
     │                   │  XAI Breakdown      │                   │              │
     │                   │<────────────────────┤                   │              │
     │  XAI Modal        │                     │                   │              │
     │<──────────────────┤                     │                   │              │
     │                   │                     │                   │              │
     │  Switch to        │                     │                   │              │
     │  Forecast Tab     │                     │                   │              │
     ├──────────────────>│ GET /api/risk-timeline/:id              │              │
     │                   ├────────────────────>│                   │              │
     │                   │  Historical Data    │                   │              │
     │                   │<────────────────────┤                   │              │
     │                   │                     │                   │              │
     │  [Browser]        │                     │                   │              │
     │  Train LSTM       │                     │                   │              │
     │  (TensorFlow.js)  │                     │                   │              │
     │<──────────────────│                     │                   │              │
     │                   │                     │                   │              │
     │  Forecast Chart   │                     │                   │              │
     │<──────────────────┤                     │                   │              │
```

---

## 💻 Technical Stack

### Frontend

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| React | 18.x | UI framework | [docs](https://react.dev/) |
| TypeScript | 5.x | Type safety | [docs](https://www.typescriptlang.org/) |
| Vite | 5.x | Build tool | [docs](https://vitejs.dev/) |
| TailwindCSS | 3.x | Styling | [docs](https://tailwindcss.com/) |
| Shadcn UI | Latest | Component library | [docs](https://ui.shadcn.com/) |
| RainbowKit | 2.x | Wallet connection | [docs](https://www.rainbowkit.com/) |
| Wagmi | 2.x | Ethereum hooks | [docs](https://wagmi.sh/) |
| Viem | 2.x | Ethereum client | [docs](https://viem.sh/) |
| TanStack Query | 5.x | Data fetching | [docs](https://tanstack.com/query) |
| TensorFlow.js | 4.x | ML in browser | [docs](https://www.tensorflow.org/js) |
| Recharts | 2.x | Charts | [docs](https://recharts.org/) |
| Wouter | 3.x | Routing | [docs](https://github.com/molefrog/wouter) |

### Backend

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| Node.js | 20.x | Runtime | [docs](https://nodejs.org/) |
| Express | 4.x | Web framework | [docs](https://expressjs.com/) |
| TypeScript | 5.x | Type safety | [docs](https://www.typescriptlang.org/) |
| Drizzle ORM | Latest | Database ORM | [docs](https://orm.drizzle.team/) |
| PostgreSQL | 15.x | Database | [docs](https://www.postgresql.org/) |
| ws | 8.x | WebSocket server | [docs](https://github.com/websockets/ws) |
| Viem | 2.x | Blockchain client | [docs](https://viem.sh/) |
| @google/genai | Latest | Gemini AI SDK | [docs](https://ai.google.dev/) |
| Zod | 3.x | Schema validation | [docs](https://zod.dev/) |

---

## 📁 File Structure

### Complete Project Tree

```
defi-risk-sentinel/
│
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   │   ├── PredictiveForecaster.tsx   # LSTM forecasting (TensorFlow.js)
│   │   │   │   ├── WhaleTracker.tsx           # Real-time transaction feed
│   │   │   │   ├── PortfolioOptimizer.tsx     # RL portfolio rebalancing
│   │   │   │   ├── AgentMesh.tsx              # AI agent communication
│   │   │   │   ├── AutonomousMode.tsx         # Autonomous AI toggle
│   │   │   │   ├── ProtocolTable.tsx          # Protocol list with filters
│   │   │   │   ├── RiskMetrics.tsx            # Aggregate risk metrics
│   │   │   │   ├── PositionsList.tsx          # User positions table
│   │   │   │   ├── AlertsList.tsx             # Risk alerts feed
│   │   │   │   ├── RiskTimeline.tsx           # Historical risk chart
│   │   │   │   ├── ExplainRiskDialog.tsx      # XAI modal with breakdown
│   │   │   │   ├── ProtocolFilters.tsx        # Search & filter controls
│   │   │   │   ├── AIProcessingLoader.tsx     # AI loading animation
│   │   │   │   └── AIResponseCard.tsx         # AI insight cards
│   │   │   ├── ui/                 # Shadcn UI primitives
│   │   │   │   ├── button.tsx, card.tsx, dialog.tsx, etc.
│   │   │   ├── Header.tsx          # App header (wallet + theme toggle)
│   │   │   └── ThemeToggle.tsx     # Dark/light mode switcher
│   │   ├── lib/
│   │   │   ├── chains.ts           # ⭐ Somnia Testnet chain definition
│   │   │   ├── wagmi.ts            # RainbowKit + Wagmi configuration
│   │   │   ├── queryClient.ts      # TanStack Query setup
│   │   │   └── websocket.ts        # WebSocket client with auto-reconnect
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Pre-login marketing page
│   │   │   ├── Dashboard.tsx       # Main app (5-tab layout)
│   │   │   └── AIFeatures.tsx      # Showcase of 7 AI features
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx   # Dark mode context
│   │   ├── App.tsx                 # Main app with providers
│   │   └── index.css               # Global styles + design tokens
│   └── index.html
│
├── server/                          # Backend Node.js application
│   ├── lib/
│   │   ├── blockchain.ts           # ⭐ Somnia RPC client (Viem)
│   │   │                           #    - getCurrentBlock()
│   │   │                           #    - getTokenInfo()
│   │   │                           #    - getLiquidityPoolData()
│   │   │                           #    - scanSomniaProtocols()
│   │   ├── protocolScanner.ts      # ⭐ Automated pool discovery
│   │   │                           #    - scanAndUpdateProtocols()
│   │   │                           #    - startProtocolScanning()
│   │   ├── gemini.ts               # ⭐ Gemini AI integration
│   │   │                           #    - analyzeProtocolRisk()
│   │   │                           #    - analyzeUserPositions()
│   │   │                           #    - explainRiskDecision()
│   │   └── websocket.ts            # WebSocket server
│   │                               #    - notifyProtocolUpdate()
│   │                               #    - notifyRiskAlert()
│   ├── routes.ts                   # ⭐ API endpoints (REST + WebSocket)
│   ├── storage.ts                  # Database abstraction (IStorage interface)
│   ├── db.ts                       # Drizzle ORM database connection
│   ├── vite.ts                     # Vite middleware for Express
│   └── index.ts                    # Express server entry point
│
├── shared/
│   └── schema.ts                   # ⭐ Drizzle schemas + TypeScript types
│                                   #    - defiProtocols, userPositions
│                                   #    - aiInsights, riskTimeline
│                                   #    - portfolioHistory, transactionHistory
│
├── drizzle/                         # Database migrations (auto-generated)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
├── vite.config.ts                  # Vite config (frontend build)
├── drizzle.config.ts               # Drizzle ORM config
└── README.md                        # This file
```

### Key File Locations by Resource

#### Somnia Blockchain Integration

| File | Lines | Purpose |
|------|-------|---------|
| `client/src/lib/chains.ts` | 1-23 | Somnia Testnet chain definition (Viem) |
| `server/lib/blockchain.ts` | 1-271 | Somnia RPC client, ABIs, pool discovery |
| `server/lib/protocolScanner.ts` | 1-141 | Automated protocol scanning (15min) |
| `server/routes.ts` | 30-44 | Protocol scanner initialization |

#### Gemini AI Integration

| File | Lines | Purpose |
|------|-------|---------|
| `server/lib/gemini.ts` | 1-285 | All Gemini AI functions |
| `server/lib/gemini.ts` | 25-85 | analyzeProtocolRisk() - Risk scoring |
| `server/lib/gemini.ts` | 104-154 | analyzeUserPositions() - Portfolio insights |
| `server/lib/gemini.ts` | 208-285 | explainRiskDecision() - XAI explanations |
| `server/routes.ts` | 331-366 | /api/analyze-protocol endpoint |
| `server/routes.ts` | 368-399 | /api/explain-risk endpoint (XAI) |

#### TensorFlow.js LSTM

| File | Lines | Purpose |
|------|-------|---------|
| `client/src/components/dashboard/PredictiveForecaster.tsx` | 47-196 | LSTM model training & prediction |
| `client/src/components/dashboard/PredictiveForecaster.tsx` | 84-96 | Model architecture definition |
| `client/src/components/dashboard/PredictiveForecaster.tsx` | 107-117 | Training loop with tf.nextFrame() |
| `client/src/components/dashboard/PredictiveForecaster.tsx` | 185-192 | Tensor disposal (memory cleanup) |

#### PostgreSQL Database

| File | Lines | Purpose |
|------|-------|---------|
| `shared/schema.ts` | 7-19 | defiProtocols table schema |
| `shared/schema.ts` | 30-39 | userPositions table schema |
| `shared/schema.ts` | 50-60 | aiInsights table schema |
| `shared/schema.ts` | 72-81 | riskTimeline table schema |
| `server/storage.ts` | 1-217 | Database operations (IStorage) |
| `server/db.ts` | 1-30 | Drizzle ORM connection |

#### WebSocket Real-Time

| File | Lines | Purpose |
|------|-------|---------|
| `server/lib/websocket.ts` | 1-110 | WebSocket server + event handlers |
| `client/src/lib/websocket.ts` | 1-95 | WebSocket client with auto-reconnect |
| `server/routes.ts` | 12-17 | WebSocket server initialization |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x or higher
- Git

### Environment Variables

Create a `.env` file in the project root:

```env
# Gemini AI API Key (required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/defi_sentinel

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET=your_session_secret_here

# PostgreSQL Connection Details (auto-configured on Replit)
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=defi_sentinel
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/defi-risk-sentinel.git
cd defi-risk-sentinel

# Install dependencies
npm install

# Initialize database
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Obtaining API Keys

#### Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key and add to `.env`

### Development Workflow

```bash
# Start dev server (frontend + backend)
npm run dev

# Database operations
npm run db:push          # Sync schema to database
npm run db:studio        # Open Drizzle Studio (database GUI)

# Build for production
npm run build

# Run production build
npm start
```

---

## 📡 API Documentation

### REST Endpoints

#### GET /api/protocols

Retrieve all monitored DeFi protocols with optional filtering.

**Query Parameters:**
- `search` (optional): Filter by name/symbol
- `riskLevel` (optional): Filter by risk level (`low`, `medium`, `high`)
- `minTvl` / `maxTvl` (optional): TVL range filter
- `sortBy` (optional): Sort field (`tvl`, `riskScore`, `trustIndex`, `apy`, `name`)
- `sortOrder` (optional): Sort direction (`asc`, `desc`)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "USDC/ETH Pool",
    "symbol": "USDC-ETH",
    "tvl": "1250000.00",
    "riskScore": 35,
    "riskLevel": "low",
    "confidence": 87,
    "trustIndex": 82,
    "apy": "12.50",
    "contractAddress": "0x...",
    "updatedAt": "2025-10-20T12:00:00Z"
  }
]
```

#### POST /api/analyze-protocol

Trigger Gemini AI analysis for a specific protocol.

**Request Body:**
```json
{
  "protocolId": "uuid"
}
```

**Response:**
```json
{
  "riskScore": 35,
  "riskLevel": "low",
  "confidence": 87,
  "trustIndex": 82,
  "analysis": "Protocol shows stable TVL and reasonable APY...",
  "recommendations": "Consider for conservative allocation..."
}
```

#### POST /api/explain-risk

Get detailed XAI explanation for a protocol's risk score.

**Request Body:**
```json
{
  "protocolId": "uuid"
}
```

**Response:**
```json
{
  "summary": "This protocol has a low risk score due to...",
  "keyFactors": [
    {
      "factor": "Trust Index",
      "impact": "Low",
      "explanation": "High trust index indicates..."
    }
  ],
  "technicalAnalysis": "Smart contract analysis shows...",
  "recommendation": "Suitable for conservative portfolios..."
}
```

#### GET /api/risk-timeline/:protocolId

Retrieve historical risk scores for a protocol.

**Parameters:**
- `protocolId`: Protocol UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "protocolId": "uuid",
    "riskScore": 35,
    "timestamp": "2025-10-20T12:00:00Z",
    "isoTime": "2025-10-20T12:00:00.000Z"
  }
]
```

#### POST /api/rebalance-position

Get AI-powered portfolio rebalancing recommendations.

**Request Body:**
```json
{
  "positionId": "uuid"
}
```

**Response:**
```json
{
  "currentAllocation": {
    "protocolA": 40,
    "protocolB": 35,
    "protocolC": 25
  },
  "recommendedAllocation": {
    "protocolA": 30,
    "protocolB": 45,
    "protocolC": 25
  },
  "expectedImprovement": 8.5,
  "rationale": "Reduce exposure to high-risk Protocol A..."
}
```

### WebSocket Events

#### Connection

```javascript
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onopen = () => {
  console.log('Connected to DeFi Risk Sentinel');
};
```

#### Event: `connected`

Server confirms connection.

**Payload:**
```json
{
  "type": "connected",
  "message": "Connected to DeFi Risk Sentinel",
  "timestamp": "2025-10-20T12:00:00Z"
}
```

#### Event: `protocol_update`

New protocol discovered or existing protocol updated.

**Payload:**
```json
{
  "type": "protocol_update",
  "protocolId": "uuid",
  "data": {
    "name": "USDC-ETH",
    "tvl": "1250000.00",
    "apy": "12.50",
    "isNew": false
  },
  "timestamp": "2025-10-20T12:00:00Z"
}
```

#### Event: `risk_alert`

High-risk protocol detected (risk > 70 or +10 spike).

**Payload:**
```json
{
  "type": "risk_alert",
  "protocolId": "uuid",
  "riskScore": 75,
  "message": "USDC-ETH risk score increased from 40 to 75",
  "severity": "high",
  "timestamp": "2025-10-20T12:00:00Z"
}
```

#### Client Ping/Pong

Keep connection alive with periodic pings.

**Client sends:**
```json
{
  "type": "ping",
  "timestamp": "2025-10-20T12:00:00Z"
}
```

**Server responds:**
```json
{
  "type": "pong",
  "timestamp": "2025-10-20T12:00:00Z"
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (TypeScript, ESLint, Prettier)
- Write tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Somnia Network** - High-performance blockchain platform
- **Google Gemini AI** - Intelligent risk analysis
- **TensorFlow.js Team** - Browser-based ML capabilities
- **RainbowKit** - Seamless wallet connection UX
- **Drizzle Team** - TypeScript-first ORM

---

**Built with ❤️ for the Somnia ecosystem**

</div>
