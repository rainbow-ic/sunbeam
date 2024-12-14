import { Actor, Agent } from "@dfinity/agent";
import { GetPoolInput, icswap, IDex, IPool, ListPoolInput, Transaction } from "../../types";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { icsIndexNode } from "../../types/actors";
import { actors } from "../../types";
import { ICPSwapPool } from "./ICPSwapPool";
import { ICPSWAP_NODE_INDEX_CANISTER } from "../../constant";
type IndexNodeActor = icsIndexNode._SERVICE;

type PublicTokenOverview = actors.icsIndexNode.PublicTokenOverview;

export class ICPSwap extends CanisterWrapper implements IDex {
    private actor: IndexNodeActor;

    constructor({ agent, address }: { agent: Agent; address?: string }) {
        const id = address ?? ICPSWAP_NODE_INDEX_CANISTER;
        super({ id, agent });
        this.actor = Actor.createActor(icsIndexNode.idlFactory, {
            agent,
            canisterId: id,
        });
    }
    getTransactions(): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }

    async listTokens(): Promise<icswap.Token[]> {
        const tokenData: PublicTokenOverview[] = await this.actor.getAllTokens();
        const tokens: icswap.Token[] = tokenData.map((data) => data);
        return tokens;
    }

    async listPools(token1?: ListPoolInput, token2?: ListPoolInput): Promise<ICPSwapPool[]> {
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
                    poolInfo: poolData,
                    //TODO: fix later to Agent
                    agent: this.agent,
                }),
        );
        if (token2) {
            return pools.filter((pool) => pool.isForToken(token2));
        } else {
            return pools;
        }
    }

    async getPoolByAddress(address: string): Promise<IPool | null> {
        const poolData = (await this.actor.getAllPools()).filter((pool) => pool.pool === address);

        if (poolData.length === 0) return null;

        return new ICPSwapPool({
            agent: this.agent,
            poolInfo: poolData[0],
        });
    }

    async getPool(token1: GetPoolInput, token2: GetPoolInput): Promise<ICPSwapPool | null> {
        // TODO: move imnplementation to shared code
        const pools = await this.listPools(token1, token2);
        if (pools.length === 0) return null;

        // TODO?: add option to pick a pool if multiple exist for the selected tokens
        if (pools.length > 1) throw new Error("multiple pools found for this pair");
        return pools[0];
    }
}
