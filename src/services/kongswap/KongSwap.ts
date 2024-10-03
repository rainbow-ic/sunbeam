import { Actor, HttpAgent } from "@dfinity/agent";
import { IDex, IPool, kongswap } from "../../types";
import { kongBackend } from "../../types/actors";
import { PublicPoolOverView } from "../../types/actors/icswap/icpswapNodeIndex";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { parseResultResponse } from "../../utils";
import { KONGSWAP_BACKEND_TEST_CANISTER } from "../../constant";
import { KongSwapPool } from "./KongSwapPool";

type KongSwapActor = kongBackend._SERVICE;

export class KongSwap extends CanisterWrapper implements IDex {
    private actor: KongSwapActor;

    constructor({ agent, address }: { agent: HttpAgent; address?: string }) {
        const id = address ?? KONGSWAP_BACKEND_TEST_CANISTER;
        super({ id, agent });
        this.actor = Actor.createActor(kongBackend.idlFactory, {
            agent,
            canisterId: id,
        });
    }
    async listTokens(): Promise<kongswap.Token[]> {
        const tokensRes = await this.actor.tokens(["all"]);
        const result = parseResultResponse(tokensRes);
        const response = result
            .map((data) => {
                if ("IC" in data) {
                    return {
                        symbol: data.IC.symbol,
                        name: data.IC.name,
                        address: data.IC.canister_id,
                        fee: data.IC.fee,
                        decimals: data.IC.decimals,
                        token: data.IC.token,
                        token_id: data.IC.token_id,
                        chain: data.IC.chain,
                        canister_id: data.IC.canister_id,
                        icrc1: data.IC.icrc1,
                        icrc2: data.IC.icrc2,
                        icrc3: data.IC.icrc3,
                        pool_symbol: data.IC.pool_symbol,
                        on_kong: data.IC.on_kong,
                    };
                }
                return null;
            })
            .filter((data) => data !== null) as kongswap.Token[];
        return response;
    }

    async getToken(tokenId: string): Promise<kongswap.Token | null> {
        const tokensRes = await this.actor.tokens([tokenId]);
        const result = parseResultResponse(tokensRes);
        const response = result
            .map((data) => {
                if ("IC" in data) {
                    return {
                        symbol: data.IC.symbol,
                        name: data.IC.name,
                        address: data.IC.canister_id,
                        fee: data.IC.fee,
                        decimals: data.IC.decimals,
                        token: data.IC.token,
                        token_id: data.IC.token_id,
                        chain: data.IC.chain,
                        canister_id: data.IC.canister_id,
                        icrc1: data.IC.icrc1,
                        icrc2: data.IC.icrc2,
                        icrc3: data.IC.icrc3,
                        pool_symbol: data.IC.pool_symbol,
                        on_kong: data.IC.on_kong,
                    };
                }
                return null;
            })
            .filter((data) => data !== null) as kongswap.Token[];
        if (response.length === 0) {
            return null;
        }
        return response[0];
    }
    async listPools(
        token1?: kongswap.ListPoolsInput,
        token2?: kongswap.ListPoolsInput,
    ): Promise<IPool[]> {
        let tokensRes;

        // searching for pool of token 1
        if (token1) {
            tokensRes = await this.actor.pools([token1.address]);
        } else tokensRes = await this.actor.pools(["all"]);

        let result = parseResultResponse(tokensRes);

        // filter out if token2 is provided
        // Kong swap is not support for pair searching
        if (token1 && token2) {
            result = result.filter((pool) => {
                if (
                    (pool.address_0 === token1.address && pool.address_1 === token2.address) ||
                    (pool.address_0 === token2.address && pool.address_1 === token1.address)
                ) {
                    return pool;
                }
            });
        }

        if (result.length === 0) {
            return [];
        }

        console.log(result);

        const pools = result.map((pool) => {
            const poolData = {
                address: `${pool.chain_0}.${pool.address_0}_${pool.chain_1}.${pool.address_1}`,
                token1: {
                    symbol: pool.symbol_0,
                    name: pool.address_0,
                    address: `${pool.chain_0}.${pool.address_0}`,
                },
                token2: {
                    symbol: pool.symbol_1,
                    name: pool.address_1,
                    address: `${pool.chain_1}.${pool.address_1}`,
                },
            };
            return new KongSwapPool({
                poolData,
                agent: this.agent,
            });
        });

        return pools;
    }
    getPool(token1: kongswap.GetPoolInput, token2: kongswap.GetPoolInput): Promise<IPool> {
        throw new Error("Method not implemented.");
    }

    getPoolsForToken(tokenPID: string): Promise<PublicPoolOverView[]> {
        throw new Error("Method not implemented.");
    }
}
