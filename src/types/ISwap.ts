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
};

export type PoolData = {
    address: string;
    token1: Token;
    token2: Token;
};

export type SwapInput = icpswap.SwapInput | kongswap.SwapInput;

export type SwapResponse = bigint | kongswap.SwapResponse;

export type QuoteInput = icpswap.QuoteInput | kongswap.QuoteInput;

export type QuoteResponse = bigint | kongswap.QuoteResponse;

export type GetMetadataResponse = icpswap.PoolMetadata | kongswap.PoolMetadata | null;

export type GetLPInfoResponse = icpswap.LPInfo | null;

export type ListPoolInput = icpswap.ListPoolsInput | kongswap.ListPoolsInput;

export type GetPoolInput = icpswap.GetPoolInput | kongswap.GetPoolInput;

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
    listTokens(): Promise<Token[] | kongswap.Token[]>;
    listPools(token1?: ListPoolInput, token2?: ListPoolInput): Promise<IPool[]>;
    getPool(token1: GetPoolInput, token2: GetPoolInput): Promise<IPool>;
}
