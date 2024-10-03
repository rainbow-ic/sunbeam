import { PoolMetadata as ActorPoolMetadata } from "./actors/icswap/icpswapPool";
import { Token as GeneralToken } from "./ISwap";

export type LPInfo = {
    swapFee0Repurchase: bigint;
    token0Amount: bigint;
    swapFeeReceiver: string;
    token1Amount: bigint;
    swapFee1Repurchase: bigint;
};

export type Token = GeneralToken & {
    standard: string;
    id?: bigint;
    volumeUSD1d?: number;
    volumeUSD7d?: number;
    totalVolumeUSD?: number;
    volumeUSD?: number;
    feesUSD?: number;
    priceUSDChange?: number;
    txCount?: bigint;
    priceUSD?: number;
    symbol: string;
    name: string;
};

export type PoolMetadata = ActorPoolMetadata;

export type SwapInput = {
    tokenIn: Token;
    amountIn: bigint;
    amoundOutMinimum: bigint;
};

export type QuoteInput = SwapInput;

export type ListPoolsInput = Pick<Token, "address" | "symbol" | "name">;

export type GetPoolInput = Pick<Token, "address" | "symbol" | "name">;

export type SwapResponse = bigint;

export type QuoteResponse = bigint;
