import { ISwapPool } from "../types";
import {
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "../types/actors/icswap/icpswapPool";
import { ICSLPInfo } from "../types/ICPSwap";
export class SwapPoolService {
    private strategy: ISwapPool;

    constructor(strategy: ISwapPool) {
        this.strategy = strategy;
    }

    swap(args: ICSSwapArgs): Promise<bigint> {
        return this.strategy.swap(args);
    }
    quote(args: ICSSwapArgs): Promise<bigint> {
        return this.strategy.quote(args);
    }
    getMetadata(): Promise<ICSPoolMetadata> {
        return this.strategy.getMetadata();
    }

    getLPInfo(): Promise<ICSLPInfo> {
        return this.strategy.getLPInfo();
    }
}
