import {
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "./actors/icswap/icpswapPool";
import { PublicTokenOverview as ICSTokenData } from "./actors/icswap/icpswapNodeIndex";

export type QuoteResult = bigint;
export interface ISwapPool {
    swap(args: ICSSwapArgs): Promise<bigint>;
    quote(args: ICSSwapArgs): Promise<bigint>;
    getMetadata(): Promise<ICSPoolMetadata>;
}

export interface IDex {
    listTokens(): Promise<ICSTokenData[]>;
}
