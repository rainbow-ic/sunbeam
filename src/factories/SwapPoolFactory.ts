import { CanisterWrapperInitArgs } from "../types/CanisterWrapper";
import { ICPSwapPool, SwapPoolService } from "../services";
import { SupportedDEX } from "../constant";

export type SwapFactoryInitArgs = CanisterWrapperInitArgs;

export class SwapPoolFactory {
    static create({
        dex,
        initArgs,
    }: {
        dex: SupportedDEX;
        initArgs: SwapFactoryInitArgs;
    }): SwapPoolService {
        switch (dex) {
            case SupportedDEX.ICPSwap:
                return new SwapPoolService(new ICPSwapPool(initArgs));
            case SupportedDEX.Sonic:
                throw new Error("Method not implemented.");
            default:
                throw new Error("Unsupported DEX");
        }
    }
}
