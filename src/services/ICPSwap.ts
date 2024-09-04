import { Actor, HttpAgent } from "@dfinity/agent";
import { IcpswapPool } from "../types/actors";
import { ISwapStrategy } from "../types/ISwap";
import { SwapArgs } from "../types/actors/icpswap";
import { parseOptionResponse } from "../utils";

export type ICPSwapInitArgs = {
    canisterId: string;
    agent: HttpAgent;
};

type IcpswapPoolActor = IcpswapPool.default;

export class ICPSwap implements ISwapStrategy {
    private actor: IcpswapPoolActor;

    constructor({ canisterId, agent }: ICPSwapInitArgs) {
        this.actor = Actor.createActor(IcpswapPool.idlFactory, {
            agent,
            canisterId,
        });
    }
    async quote(args: SwapArgs): Promise<bigint> {
        const result = await this.actor.quote(args);
        const quote = parseOptionResponse(result);
        return quote;
    }
    swap(): void {
        throw new Error("Method not implemented.");
    }
    listTokens(): void {
        throw new Error("Method not implemented.");
    }
    getLPInfo?(): void {
        throw new Error("Method not implemented.");
    }
    addLP?(): void {
        throw new Error("Method not implemented.");
    }
}
