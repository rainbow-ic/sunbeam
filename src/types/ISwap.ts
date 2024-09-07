import {
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "./actors/icswap/icpswapPool";
import {
    PublicTokenOverview as ICSTokenData,
    PublicPoolOverView as ICSPoolData,
} from "./actors/icswap/icpswapNodeIndex";

export type QuoteResult = bigint;
export interface ISwapPool {
    swap(args: ICSSwapArgs): Promise<bigint>;
    quote(args: ICSSwapArgs): Promise<bigint>;
    getMetadata(): Promise<ICSPoolMetadata>;
}

export interface IDex {
    listTokens(): Promise<ICSTokenData[]>;
    listPools(): Promise<ICSPoolData[]>;
    getPoolsForToken(tokenPID: string): Promise<ICSPoolData[]>;
}
