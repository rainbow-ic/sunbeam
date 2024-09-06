import { CanisterWrapperInitArgs } from "../types/CanisterWrapper";
import { DexService } from "../services/DexService";
import { ICPSwap } from "../services/ICPSwap";
import { SupportedDEX } from "../constant";

export type DexFactoryInitArgs = CanisterWrapperInitArgs;

export class DexFactory {
    static create({
        dex,
        initArgs,
    }: {
        dex: SupportedDEX;
        initArgs: DexFactoryInitArgs;
    }): DexService {
        switch (dex) {
            case SupportedDEX.ICPSwap:
                return new DexService(new ICPSwap(initArgs));
            case SupportedDEX.Sonic:
                throw new Error("Method not implemented.");
            default:
                throw new Error("Unsupported DEX");
        }
    }
}
