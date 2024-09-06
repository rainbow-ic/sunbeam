import { IDex } from "../types";
export class DexService {
    private strategy: IDex;

    constructor(strategy: IDex) {
        this.strategy = strategy;
    }

    async listTokens() {
        return await this.strategy.listTokens();
    }
}
