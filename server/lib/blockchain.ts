import { createPublicClient, http, parseAbi, formatUnits, type Address } from "viem";
import { somniaTestnet } from "../../client/src/lib/chains";

// Create Viem client for Somnia Testnet
export const somniaClient = createPublicClient({
  chain: somniaTestnet,
  transport: http("https://dream-rpc.somnia.network/"),
});

// Standard ERC20 ABI for token queries
const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
]);

// Uniswap V2 Pair ABI for liquidity pool queries
const PAIR_ABI = parseAbi([
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function totalSupply() view returns (uint256)",
]);

// Uniswap V2 Factory ABI for discovering pools
const FACTORY_ABI = parseAbi([
  "function allPairsLength() view returns (uint256)",
  "function allPairs(uint256) view returns (address)",
  "function getPair(address tokenA, address tokenB) view returns (address pair)",
]);

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface LiquidityPool {
  pairAddress: Address;
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: bigint;
  reserve1: bigint;
  tvl: string; // USD value (calculated off-chain or from oracle)
  apy: string; // Annual Percentage Yield
}

/**
 * Fetch token information from blockchain
 */
export async function getTokenInfo(tokenAddress: Address): Promise<TokenInfo> {
  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      somniaClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      }),
      somniaClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      somniaClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
      somniaClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      }),
    ]);

    return {
      address: tokenAddress,
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      totalSupply: totalSupply as bigint,
    };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    throw error;
  }
}

/**
 * Fetch liquidity pool data from Uniswap V2 style pair contract
 */
export async function getLiquidityPoolData(pairAddress: Address): Promise<Partial<LiquidityPool>> {
  try {
    const [token0Address, token1Address, reservesData] = await Promise.all([
      somniaClient.readContract({
        address: pairAddress,
        abi: PAIR_ABI,
        functionName: "token0",
      }) as Promise<Address>,
      somniaClient.readContract({
        address: pairAddress,
        abi: PAIR_ABI,
        functionName: "token1",
      }) as Promise<Address>,
      somniaClient.readContract({
        address: pairAddress,
        abi: PAIR_ABI,
        functionName: "getReserves",
      }),
    ]);
    
    // Extract reserves from tuple
    const reserves = reservesData as readonly [bigint, bigint, number];
    const reserve0 = reserves[0];
    const reserve1 = reserves[1];

    const [token0, token1] = await Promise.all([
      getTokenInfo(token0Address),
      getTokenInfo(token1Address),
    ]);

    return {
      pairAddress,
      token0,
      token1,
      reserve0,
      reserve1,
    };
  } catch (error) {
    console.error(`Error fetching pool data for ${pairAddress}:`, error);
    throw error;
  }
}

/**
 * Discover all liquidity pools from a Uniswap V2 style factory
 */
export async function discoverPools(factoryAddress: Address, limit: number = 10): Promise<Address[]> {
  try {
    const pairCount = await somniaClient.readContract({
      address: factoryAddress,
      abi: FACTORY_ABI,
      functionName: "allPairsLength",
    }) as bigint;

    const totalPairs = Number(pairCount);
    const maxPairs = Math.min(totalPairs, limit);
    const pairAddresses: Address[] = [];

    for (let i = 0; i < maxPairs; i++) {
      const pairAddress = await somniaClient.readContract({
        address: factoryAddress,
        abi: FACTORY_ABI,
        functionName: "allPairs",
        args: [BigInt(i)],
      }) as Address;
      pairAddresses.push(pairAddress);
    }

    return pairAddresses;
  } catch (error) {
    console.error(`Error discovering pools from factory ${factoryAddress}:`, error);
    return [];
  }
}

/**
 * Get user's token balance
 */
export async function getUserTokenBalance(
  tokenAddress: Address,
  userAddress: Address
): Promise<bigint> {
  try {
    const balance = await somniaClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [userAddress],
    }) as bigint;
    return balance;
  } catch (error) {
    console.error(`Error fetching balance for ${userAddress}:`, error);
    return BigInt(0);
  }
}

/**
 * Get current block number
 */
export async function getCurrentBlock(): Promise<bigint> {
  const blockNumber = await somniaClient.getBlockNumber();
  return blockNumber;
}

/**
 * Monitor blockchain for new blocks
 */
export function watchBlocks(callback: (blockNumber: bigint) => void) {
  return somniaClient.watchBlockNumber({
    onBlockNumber: callback,
    pollingInterval: 12000, // 12 seconds
  });
}

/**
 * Calculate TVL for a liquidity pool (simplified - assumes equal value in both tokens)
 * In production, you'd integrate with a price oracle
 */
export function estimateTVL(reserve0: bigint, reserve1: bigint, decimals0: number, decimals1: number): string {
  // Simplified calculation - assumes 1:1 pricing
  const reserve0Formatted = parseFloat(formatUnits(reserve0, decimals0));
  const reserve1Formatted = parseFloat(formatUnits(reserve1, decimals1));
  
  // Rough estimate: average the reserves and double it
  const tvl = (reserve0Formatted + reserve1Formatted);
  return tvl.toFixed(2);
}

/**
 * Official Somnia Testnet Infrastructure Addresses
 */
export const SOMNIA_CONTRACTS = {
  multicallV3: "0x841b8199E6d3Db3C6f264f6C2bd8848b3cA64223" as Address,
  entryPointV07: "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as Address,
  factory: "0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb" as Address,
};

/**
 * Known DEX Factory addresses on Somnia Testnet
 * Update these as real DEXes are deployed
 */
export const KNOWN_FACTORIES = {
  // Official Somnia Factory (supports Uniswap V2-style pools)
  somniaFactory: "0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb" as Address,
  // Add more DEX factories here as they deploy
};

/**
 * Scan Somnia blockchain for DeFi protocols
 */
export async function scanSomniaProtocols(): Promise<LiquidityPool[]> {
  const pools: LiquidityPool[] = [];
  
  // Scan known factories
  for (const [name, factoryAddress] of Object.entries(KNOWN_FACTORIES)) {
    if (!factoryAddress) continue;
    console.log(`Scanning ${name} factory at ${factoryAddress}...`);
    const pairAddresses = await discoverPools(factoryAddress, 5);
    
    for (const pairAddress of pairAddresses) {
      try {
        const poolData = await getLiquidityPoolData(pairAddress);
        if (poolData.token0 && poolData.token1 && poolData.reserve0 && poolData.reserve1) {
          const tvl = estimateTVL(
            poolData.reserve0,
            poolData.reserve1,
            poolData.token0.decimals,
            poolData.token1.decimals
          );
          
          pools.push({
            ...poolData as LiquidityPool,
            tvl,
            apy: "0", // Would integrate with yield aggregator
          });
        }
      } catch (error) {
        console.error(`Error processing pool ${pairAddress}:`, error);
      }
    }
  }
  
  return pools;
}
