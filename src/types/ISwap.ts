import * as icpswap from "./ICPSwap";
import * as kongswap from "./KongSwap";
export type Quote = {
    amountIn: bigint;
    amoutnOut: bigint;
    tokenIn: Token;
    tokenOut: Token;
};

export type Token = {
    address: string;
    // icpswap props
    name?: string;
    symbol?: string;
    // kongswap props
    chain?: string;
};

export type PoolData = {
    address: string;
    token1: Token;
    token2: Token;
};

export type SwapInput = {
    tokenIn: Token;
    amountIn: bigint;
    amountOut: bigint;
    slippage: number;
};

export type SwapResponse = bigint;

export type QuoteInput = Omit<SwapInput, "amountOut">;

export type QuoteResponse = bigint;

export type GetMetadataResponse = icpswap.PoolMetadata | kongswap.PoolMetadata | null;

export type GetLPInfoResponse = icpswap.LPInfo | null;

export type ListPoolInput = Token;

export type GetPoolInput = Token;

export interface IPool {
    swap(args: SwapInput): Promise<SwapResponse>;
    quote(args: QuoteInput): Promise<QuoteResponse>;
    getMetadata(): Promise<GetMetadataResponse>;
    getPoolData(): PoolData;
    isForToken(token: Token): boolean;
    getTokens(): [Token, Token];
    getLPInfo(): Promise<GetLPInfoResponse>;
}

export interface IDex {
    listTokens(): Promise<Token[]>;
    listPools(token1?: ListPoolInput, token2?: ListPoolInput): Promise<IPool[]>;
    getPool(token1: GetPoolInput, token2: GetPoolInput): Promise<IPool>;
}
