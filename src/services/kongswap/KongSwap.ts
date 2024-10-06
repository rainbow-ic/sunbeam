import { Actor, HttpAgent } from "@dfinity/agent";
import { IDex, IPool, kongswap, Token } from "../../types";
import { kongBackend } from "../../types/actors";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { parseResultResponse } from "../../utils";
import { KONGSWAP_BACKEND_TEST_CANISTER } from "../../constant";
import { KongSwapPool } from "./KongSwapPool";
import { PoolInfo } from "../../types/KongSwap";

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
    async listPools(token1?: Token, token2?: Token): Promise<IPool[]> {
        let tokensRes;

        // searching for pool of token 1
        if (token1) {
            tokensRes = await this.actor.pools([token1.address]);
        } else tokensRes = await this.actor.pools(["all"]);

        const result = parseResultResponse(tokensRes);
        let pools = result.pools;

        // filter out if token2 is provided
        // Kong swap is not support for pair searching
        if (token1 && token2) {
            pools = result.pools.filter((pool) => {
                if (
                    (pool.address_0 === token1.address && pool.address_1 === token2.address) ||
                    (pool.address_0 === token2.address && pool.address_1 === token1.address)
                ) {
                    return pool;
                }
            });
        }

        if (pools.length === 0) {
            return [];
        }

        const poolsObj = pools.map((pool) => {
            const poolInfo = {
                ...pool,
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
                poolInfo: poolInfo,
                agent: this.agent,
            });
        });

        return poolsObj;
    }

    async getPool(token1: Token, token2: Token): Promise<IPool> {
        if (token1.address === token2.address) {
            throw new Error("Tokens must be different");
        }
        if (!token1.chain || !token2.chain) {
            throw new Error("Chain must be provided");
        }

        const poolAddress = `${token1.chain}.${token1.address}_${token2.chain}.${token2.address}`;

        const poolsRes = await this.actor.pools([poolAddress]);
        const result = parseResultResponse(poolsRes);

        if (result.pools.length === 0) {
            throw new Error("Pool not found");
        }

        const poolReply = result.pools[0];

        const poolInfo: PoolInfo = {
            ...poolReply,
            address: poolAddress,
            token1,
            token2,
        };

        return Promise.resolve(new KongSwapPool({ poolInfo, agent: this.agent }));
    }
}
