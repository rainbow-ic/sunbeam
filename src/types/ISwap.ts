import { PoolMetadata as ICSPoolMetadata } from "./actors/icswap/icpswapPool";
import { ICSLPInfo } from "./ICPSwap";
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
    standard: string;

    // TODO: should this be always included or make it optional
    // additional info
    id?: bigint;
    volumeUSD1d?: number;
    volumeUSD7d?: number;
    totalVolumeUSD?: number;
    volumeUSD?: number;
    feesUSD?: number;
    priceUSDChange?: number;
    txCount?: bigint;
    priceUSD?: number;
};

export type PoolData = {
    address: string;
    token1: Token;
    token2: Token;
};

export type Transaction = {
    id: string;
};

export type SwapArgs = {
    tokenIn: Token;
    amountIn: bigint;
    amoundOutMinimum?: bigint;
};

export interface IPool {
    swap(args: SwapArgs): Promise<bigint>;
    quote(args: SwapArgs): Promise<bigint>;
    getMetadata(): Promise<ICSPoolMetadata>;
    getPoolData(): PoolData;
    isForToken(token: Token): boolean;
    getTokens(): [Token, Token];
    getLPInfo(): Promise<ICSLPInfo>;
}

export interface IDex {
    listTokens(): Promise<Token[]>;
    listPools(token1?: Token, token2?: Token): Promise<IPool[]>;
    getPool(token1: Token, token2: Token): Promise<IPool>;
}
