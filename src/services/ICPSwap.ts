import { Actor, HttpAgent } from "@dfinity/agent";
import { IDex, IPool, Token } from "../types/ISwap";
import { CanisterWrapper, CanisterWrapperInitArgs } from "../types/CanisterWrapper";
import { icsIndexNode } from "../types/actors";
import {
    PublicTokenOverview as ICSTokenData,
    PublicPoolOverView as ICSPoolData,
    PublicTokenOverview,
} from "../types/actors/icswap/icpswapNodeIndex";
import { Pool } from "./DexService";
import { ICPSwapPool } from "./ICPSwapPool";
import { ICPSWAP_NODE_INDEX_CANISTER } from "../constant";
type IndexNodeActor = icsIndexNode._SERVICE;

export class ICPSwap extends CanisterWrapper implements IDex {
    private actor: IndexNodeActor;

    constructor({ agent, address }: { agent: HttpAgent; address?: string }) {
        const id = address ?? ICPSWAP_NODE_INDEX_CANISTER;
        super({ id, agent });
        this.actor = Actor.createActor(icsIndexNode.idlFactory, {
            agent,
            canisterId: id,
        });
    }

    async listTokens(): Promise<Token[]> {
        const tokenData: PublicTokenOverview[] = await this.actor.getAllTokens();
        const tokens: Token[] = tokenData.map((data) => data);
        return tokens;
    }

    async listPools(token1?: Token, token2?: Token): Promise<IPool[]> {
        let poolData = [];
        if (token2 && !token1) return await this.listPools(token2);
        if (token1) {
            poolData = await this.actor.getPoolsForToken(token1.address);
        } else {
            poolData = await this.actor.getAllPools();
        }

        const pools = poolData.map(
            (poolData) =>
                new ICPSwapPool({
                    poolData: poolData,
                    agent: this.agent,
                }),
        );
        if (token2) {
            return pools.filter((pool) => pool.isForToken(token2));
        } else {
            return pools;
        }
    }

    async getPool(token1: Token, token2: Token): Promise<IPool> {
        // TODO: move imnplementation to shared code
        const pools: IPool[] = await this.listPools(token1, token2);
        if (pools.length === 0) throw new Error("no matching pool found");

        // TODO?: add option to pick a pool if multiple exist for the selected tokens
        if (pools.length > 1) throw new Error("multiple pools found for this pair");
        return pools[0];
    }
}
