import { IDex, IPool, PoolData, Token, Transaction } from "../types";

export class Pool {
    private data: PoolData;
    constructor(data: PoolData) {
        this.data = data;
    }

    hasToken(token: Token): boolean {
        if (token.address === this.data.token1.address) return true;
        if (token.address === this.data.token2.address) return true;
        return false;
    }

    async swap(): Promise<Transaction> {
        throw "not implemented";
    }
}

export type TokenFilter = (token: Token) => boolean;

export class DexService {
    private strategy: IDex;

    constructor(strategy: IDex) {
        this.strategy = strategy;
    }

    async getTokens(filter?: TokenFilter): Promise<Token[]> {
        const all: Token[] = await this.strategy.listTokens();
        if (!filter) return all;
        return all.filter(filter);
    }

    async listPools(token1?: Token, token2?: Token): Promise<IPool[]> {
        return this.strategy.listPools(token1, token2);
    }

    // Additional functions that are the same for all DEXes

    async getPool(token1: Token, token2: Token): Promise<IPool> {
        const pools: IPool[] = await this.listPools(token1, token2);
        if (pools.length === 0) throw new Error("no matching pool found");

        // TODO?: add option to pick a pool if multiple exist for the selected tokens
        if (pools.length > 1) throw new Error("multiple pools found for this pair");
        return pools[0];
    }
}
