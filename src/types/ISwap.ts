import { PoolMetadata as ICSPoolMetadata } from "./actors/icswap/icpswapPool";
import { ICSLPInfo, ICSToken } from "./ICPSwap";
import * as kongswap from "./KongSwap";
export type Quote = {
    amountIn: bigint;
    amoutnOut: bigint;
    tokenIn: Token;
    tokenOut: Token;
};

export type Token = {
    symbol: string;
    name: string;
    address: string;
};

export type PoolData = {
    address: string;
    token1: Token;
    token2: Token;
};

export type SwapArgs = {
    tokenIn: Token;
    amountIn: bigint;
    amoundOutMinimum?: bigint;
};

export type ListPoolToken = Token | kongswap.ListPoolToken;

export interface IPool {
    swap(args: SwapArgs | kongswap.SwapArgs): Promise<bigint | kongswap.SwapResponse>;
    quote(args: SwapArgs | kongswap.QuoteArgs): Promise<bigint | kongswap.QuoteResponse>;
    getMetadata(): Promise<ICSPoolMetadata | kongswap.PoolMetadata | null>;
    getPoolData(): PoolData;
    isForToken(token: Token): boolean;
    getTokens(): [Token, Token];
    getLPInfo(): Promise<ICSLPInfo>;
}

export interface IDex {
    listTokens(): Promise<ICSToken[] | kongswap.KongSwapToken[]>;
    listPools(token1?: ListPoolToken, token2?: ListPoolToken): Promise<IPool[]>;
    getPool(token1: ListPoolToken, token2: ListPoolToken): Promise<IPool>;
}
