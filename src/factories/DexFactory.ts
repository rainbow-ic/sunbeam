import { DexService } from "../services/DexService";
import { ICPSwap } from "../services/ICPSwap";
import { ICPSWAP_NODE_INDEX_CANISTER, SupportedDEX } from "../constant";
import { HttpAgent } from "@dfinity/agent";

export class DexFactory {
    static create({
        dex,
        initArgs,
    }: {
        dex: SupportedDEX;
        initArgs: {
            agent: HttpAgent;
        };
    }): DexService {
        switch (dex) {
            case SupportedDEX.ICPSwap:
                return new DexService(
                    new ICPSwap({
                        agent: initArgs.agent,
                        id: ICPSWAP_NODE_INDEX_CANISTER,
                    }),
                );
            case SupportedDEX.Sonic:
                throw new Error("Method not implemented.");
            default:
                throw new Error("Unsupported DEX");
        }
    }
}
