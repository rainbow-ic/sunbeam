import {
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "./actors/icswap/icpswapPool";
import {
    PublicTokenOverview as ICSTokenData,
    PublicPoolOverView as ICSPoolData,
} from "./actors/icswap/icpswapNodeIndex";
import { ICSLPInfo } from "./ICPSwap";

export type QuoteResult = bigint;
export interface ISwapPool {
    swap(args: ICSSwapArgs): Promise<bigint>;
    quote(args: ICSSwapArgs): Promise<bigint>;
    getMetadata(): Promise<ICSPoolMetadata>;
    getLPInfo(): Promise<ICSLPInfo>;
}

export interface IDex {
    listTokens(): Promise<ICSTokenData[]>;
    listPools(): Promise<ICSPoolData[]>;
    getPoolsForToken(tokenPID: string): Promise<ICSPoolData[]>;
}
