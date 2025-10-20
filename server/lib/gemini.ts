import { GoogleGenAI } from "@google/genai";

// Gemini AI integration for DeFi risk analysis
// Using blueprint: javascript_gemini

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface RiskAnalysisRequest {
  protocolName: string;
  tvl: string;
  apy?: string;
  contractAddress: string;
  liquidityChanges?: string;
}

interface RiskAnalysisResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  trustIndex: number;
  analysis: string;
  recommendations: string;
}

export async function analyzeProtocolRisk(
  protocol: RiskAnalysisRequest
): Promise<RiskAnalysisResult> {
  try {
    const systemPrompt = `You are an expert DeFi security analyst specializing in risk assessment. 
Analyze the provided DeFi protocol data and provide a comprehensive risk assessment.
Consider factors like TVL stability, APY sustainability, contract age, and liquidity patterns.

Respond with JSON in this exact format:
{
  "riskScore": number (0-100, where 0 is safest and 100 is most risky),
  "riskLevel": "low" | "medium" | "high",
  "confidence": number (0-100, your confidence in this assessment),
  "trustIndex": number (0-100, overall trust score for this protocol),
  "analysis": "string (2-3 sentences explaining the risk factors)",
  "recommendations": "string (specific actionable recommendation)"
}`;

    const prompt = `Analyze this DeFi protocol:
Name: ${protocol.protocolName}
Total Value Locked (TVL): $${protocol.tvl}
${protocol.apy ? `APY: ${protocol.apy}%` : ""}
Contract Address: ${protocol.contractAddress}
${protocol.liquidityChanges ? `Recent Liquidity Changes: ${protocol.liquidityChanges}` : ""}

Provide a thorough risk assessment.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            riskScore: { type: "number" },
            riskLevel: { type: "string", enum: ["low", "medium", "high"] },
            confidence: { type: "number" },
            trustIndex: { type: "number" },
            analysis: { type: "string" },
            recommendations: { type: "string" },
          },
          required: ["riskScore", "riskLevel", "confidence", "trustIndex", "analysis", "recommendations"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const result: RiskAnalysisResult = JSON.parse(rawJson);
    return result;
  } catch (error) {
    console.error("Error analyzing protocol risk:", error);
    // Fallback to simulated analysis if API fails
    return generateFallbackAnalysis(protocol);
  }
}

interface PositionAnalysisRequest {
  walletAddress: string;
  positions: Array<{
    poolName: string;
    amount: string;
    apy?: string;
    riskLevel: string;
  }>;
}

interface PositionInsight {
  title: string;
  description: string;
  recommendations: string;
  severity: "info" | "warning" | "critical";
}

export async function analyzeUserPositions(
  data: PositionAnalysisRequest
): Promise<PositionInsight> {
  try {
    const systemPrompt = `You are a DeFi portfolio advisor. Analyze the user's DeFi positions and provide actionable insights.
Focus on risk diversification, yield optimization, and potential threats.

Respond with JSON in this format:
{
  "title": "string (catchy, concise insight title)",
  "description": "string (2-3 sentences explaining the portfolio analysis)",
  "recommendations": "string (specific actionable advice)",
  "severity": "info" | "warning" | "critical"
}`;

    const prompt = `Analyze this DeFi portfolio:
Wallet: ${data.walletAddress}
Positions: ${JSON.stringify(data.positions, null, 2)}

Provide strategic insights and recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            recommendations: { type: "string" },
            severity: { type: "string", enum: ["info", "warning", "critical"] },
          },
          required: ["title", "description", "recommendations", "severity"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error analyzing user positions:", error);
    return generateFallbackPositionInsight(data);
  }
}

// Fallback functions for when AI API is unavailable
function generateFallbackAnalysis(protocol: RiskAnalysisRequest): RiskAnalysisResult {
  const tvl = parseFloat(protocol.tvl);
  const apy = protocol.apy ? parseFloat(protocol.apy) : 0;

  // Simple heuristic-based analysis
  let riskScore = 30;
  if (tvl < 1000000) riskScore += 20;
  if (apy > 50) riskScore += 25;
  if (apy > 100) riskScore += 15;

  const riskLevel = riskScore < 40 ? "low" : riskScore < 70 ? "medium" : "high";
  const trustIndex = Math.max(0, 100 - riskScore);

  return {
    riskScore,
    riskLevel,
    confidence: 75,
    trustIndex,
    analysis: `Based on TVL of $${protocol.tvl} and ${apy}% APY, this protocol shows ${riskLevel} risk characteristics. ${
      tvl < 1000000 ? "Lower TVL indicates less liquidity depth." : "Healthy TVL suggests good liquidity."
    }`,
    recommendations: riskLevel === "high" 
      ? "Consider reducing exposure or diversifying to lower-risk pools."
      : "Maintain current position with regular monitoring.",
  };
}

function generateFallbackPositionInsight(data: PositionAnalysisRequest): PositionInsight {
  const highRiskCount = data.positions.filter(p => p.riskLevel === "high").length;
  const totalPositions = data.positions.length;

  if (highRiskCount > totalPositions / 2) {
    return {
      title: "High-Risk Concentration Detected",
      description: "Your portfolio has significant exposure to high-risk pools. This increases vulnerability to volatility and potential exploits.",
      recommendations: "Consider rebalancing 30-40% of high-risk positions into medium or low-risk pools to improve risk-adjusted returns.",
      severity: "warning",
    };
  }

  return {
    title: "Portfolio Health Looks Good",
    description: "Your DeFi positions show reasonable risk diversification. Current allocation balances yield potential with safety considerations.",
    recommendations: "Continue monitoring protocol risk scores and adjust if any pool's risk level increases significantly.",
    severity: "info",
  };
}

/**
 * Generate detailed explanation for protocol risk score (XAI - Explainable AI)
 */
export async function explainRiskDecision(params: {
  protocolName: string;
  symbol: string;
  riskScore: number;
  riskLevel: string;
  tvl: string;
  apy: string | null;
  trustIndex: number;
  confidence: number;
}): Promise<{
  summary: string;
  keyFactors: Array<{ factor: string; impact: string; explanation: string }>;
  technicalAnalysis: string;
  recommendation: string;
}> {
  try {
    const prompt = `You are a DeFi security analyst. Explain in detail why the protocol "${params.protocolName}" (${params.symbol}) has a risk score of ${params.riskScore}/100.

Protocol Data:
- TVL: $${params.tvl}
- APY: ${params.apy || 'N/A'}%
- Trust Index: ${params.trustIndex}/100
- AI Confidence: ${params.confidence}%
- Risk Level: ${params.riskLevel}

Provide a detailed breakdown in JSON format with these fields:
- summary: A 2-3 sentence overview of the risk assessment
- keyFactors: Array of 3-4 key risk factors, each with factor name, impact level (High/Medium/Low), and detailed explanation
- technicalAnalysis: Detailed technical analysis including any red flags or positive signals
- recommendation: Specific actionable recommendation for users

Be specific, technical, and actionable. Focus on real DeFi risk factors like liquidity risk, smart contract risk, impermanent loss, and market volatility.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);
    return result;
  } catch (error) {
    console.error("Error generating risk explanation:", error);
    
    // Fallback response
    return {
      summary: `${params.protocolName} shows ${params.riskLevel} risk with a score of ${params.riskScore}/100 based on TVL, APY, and trust metrics analysis.`,
      keyFactors: [
        {
          factor: "Trust Index",
          impact: params.trustIndex > 70 ? "Low" : params.trustIndex > 40 ? "Medium" : "High",
          explanation: `Trust index of ${params.trustIndex}/100 ${params.trustIndex > 70 ? 'indicates strong community confidence and protocol maturity' : 'suggests elevated caution warranted'}.`
        },
        {
          factor: "TVL Analysis",
          impact: parseFloat(params.tvl) > 1000000 ? "Low" : "Medium",
          explanation: `TVL of $${params.tvl} ${parseFloat(params.tvl) > 1000000 ? 'provides solid liquidity depth' : 'indicates limited liquidity which may increase slippage risk'}.`
        },
        {
          factor: "APY Sustainability",
          impact: params.apy && parseFloat(params.apy) > 50 ? "High" : "Medium",
          explanation: params.apy 
            ? `${parseFloat(params.apy) > 50 ? 'Extremely high' : 'Moderate'} APY of ${params.apy}% ${parseFloat(params.apy) > 50 ? 'may signal unsustainable yield or higher risk exposure' : 'appears reasonable for current market conditions'}.`
            : 'APY data not available for comprehensive analysis.'
        }
      ],
      technicalAnalysis: `The protocol demonstrates ${params.riskLevel} risk characteristics based on quantitative analysis. ${params.confidence > 85 ? 'High confidence in this assessment due to sufficient data points.' : 'Moderate confidence - consider gathering more data points.'} ${params.riskScore > 70 ? 'Multiple risk factors warrant careful position sizing.' : 'Risk profile acceptable for diversified portfolios.'}`,
      recommendation: params.riskScore > 70 
        ? "Exercise caution. Consider reducing exposure to 5-10% of portfolio max, or wait for risk metrics to improve before entering."
        : params.riskScore > 40
        ? "Monitor closely. Acceptable for diversified portfolios with active risk management. Set stop-loss at 15-20% below entry."
        : "Low risk profile suitable for conservative DeFi strategies. Consider as core portfolio holding with regular rebalancing."
    };
  }
}

export async function generateRiskExplanation(riskScore: number, protocol: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Explain in 1-2 sentences why a DeFi protocol named "${protocol}" might have a risk score of ${riskScore}/100. Be specific and educational.`,
    });

    return response.text || `Risk score of ${riskScore}/100 indicates ${riskScore > 70 ? 'elevated' : riskScore > 40 ? 'moderate' : 'low'} risk levels for this protocol.`;
  } catch (error) {
    return `Risk score of ${riskScore}/100 indicates ${riskScore > 70 ? 'elevated' : riskScore > 40 ? 'moderate' : 'low'} risk levels for this protocol.`;
  }
}
