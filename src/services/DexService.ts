import { IDex } from "../types";
export class DexService {
    private strategy: IDex;

    constructor(strategy: IDex) {
        this.strategy = strategy;
    }

    async listTokens() {
        return await this.strategy.listTokens();
    }

    async listPools() {
        return await this.strategy.listPools();
    }

    async getPoolsForToken(tokenPID: string) {
        return await this.strategy.getPoolsForToken(tokenPID);
    }
}
