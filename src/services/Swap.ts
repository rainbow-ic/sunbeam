import { ISwapStrategy, QuoteResult } from "../types";
import { SwapArgs as ICSSwapArgs } from "../types/actors/icpswap";
import { ICPSwap, ICPSwapInitArgs } from "./ICPSwap";

export class Swap {
    private strategy: ISwapStrategy;

    constructor(strategy: ISwapStrategy) {
        this.strategy = strategy;
    }

    async quote(args: ICSSwapArgs): Promise<QuoteResult> {
        return this.strategy.quote(args);
    }

    swap(): void {
        this.strategy.swap();
    }

    listTokens(): void {
        this.strategy.listTokens();
    }

    getLPInfo?(): void {
        this.strategy.getLPInfo?.();
    }

    addLP?(): void {
        this.strategy.addLP?.();
    }
}

export enum SupportedDEX {
    ICPSwap,
    Sonic,
}

export type SwapFactoryInitArgs = ICPSwapInitArgs;

export class SwapFactory {
    static create({
        supportedDEX,
        initArgs,
    }: {
        supportedDEX: SupportedDEX;
        initArgs: SwapFactoryInitArgs;
    }): Swap {
        switch (supportedDEX) {
            case SupportedDEX.ICPSwap:
                return new Swap(new ICPSwap(initArgs));
            case SupportedDEX.Sonic:
                throw new Error("Method not implemented.");
            default:
                throw new Error("Unsupported DEX");
        }
    }
}
