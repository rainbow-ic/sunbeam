import { Actor } from "@dfinity/agent";
import { IDex } from "../../types/ISwap";
import { CanisterWrapper, CanisterWrapperInitArgs } from "../../types/CanisterWrapper";
import { icsIndexNode } from "../../types/actors";
import {
    PublicTokenOverview as ICSTokenData,
    PublicPoolOverView as ICSPoolData,
} from "../../types/actors/icswap/icpswapNodeIndex";
type IndexNodeActor = icsIndexNode._SERVICE;

export class ICPSwap extends CanisterWrapper implements IDex {
    private actor: IndexNodeActor;

    constructor({ id, agent }: CanisterWrapperInitArgs) {
        super({ id, agent });
        this.actor = Actor.createActor(icsIndexNode.idlFactory, {
            agent,
            canisterId: id,
        });
    }

    async listTokens(): Promise<ICSTokenData[]> {
        return await this.actor.getAllTokens();
    }

    async listPools(): Promise<ICSPoolData[]> {
        return await this.actor.getAllPools();
    }

    async getPoolsForToken(tokenPID: string): Promise<ICSPoolData[]> {
        return await this.actor.getPoolsForToken(tokenPID);
    }
}
