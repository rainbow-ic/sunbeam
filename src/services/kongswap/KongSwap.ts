import { Actor, Agent } from "@dfinity/agent";
import {
    AddLiquidityTransaction,
    CreatePoolTransaction,
    IDex,
    IPool,
    kongswap,
    RemoveLiquidityTransaction,
    SwapTransaction,
    Token,
    Transaction,
    TransactionSource,
    TransactionType,
} from "../../types";
import { kongBackend } from "../../types/actors";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { parseResultResponse } from "../../utils";
import { KongSwapPool } from "./KongSwapPool";
import { PoolInfo } from "../../types/KongSwap";
import { PoolsResult } from "../../types/actors/kongswap/kongBackend";

type KongSwapActor = kongBackend._SERVICE;

export class KongSwap extends CanisterWrapper implements IDex {
    private actor: KongSwapActor;

    constructor({ agent, address }: { agent: Agent; address: string }) {
        const id = address;
        super({ id, agent });
        this.actor = Actor.createActor(kongBackend.idlFactory, {
            agent,
            canisterId: id,
        });
    }
    async getTransactions(): Promise<Transaction[]> {
        const txsResult = await this.actor.txs([]);
        const txs = parseResultResponse(txsResult);

        const transactions = txs
            .map((tx): Transaction | null => {
                let parsedTx: Transaction | undefined = undefined;

                if ("AddLiquidity" in tx) {
                    parsedTx = {
                        ts: tx.AddLiquidity.ts,
                        id: tx.AddLiquidity.tx_id.toString(),
                        raw: tx.AddLiquidity,
                        token1: tx.AddLiquidity.symbol_0,
                        token2: tx.AddLiquidity.symbol_1,
                        amount1: tx.AddLiquidity.amount_0,
                        amount2: tx.AddLiquidity.amount_1,
                        source: TransactionSource.KONGSWAP,
                        type: TransactionType.ADD_LIQUIDITY,
                    } as AddLiquidityTransaction;
                } else if ("AddPool" in tx) {
                    parsedTx = {
                        ts: tx.AddPool.ts,
                        id: tx.AddPool.tx_id.toString(),
                        raw: tx.AddPool,
                        token1: tx.AddPool.symbol_0,
                        token2: tx.AddPool.symbol_1,
                        amount1: tx.AddPool.amount_0,
                        amount2: tx.AddPool.amount_1,
                        source: TransactionSource.KONGSWAP,
                        type: TransactionType.CREATE_POOL,
                    } as CreatePoolTransaction;
                } else if ("RemoveLiquidity" in tx) {
                    parsedTx = {
                        ts: tx.RemoveLiquidity.ts,
                        id: tx.RemoveLiquidity.tx_id.toString(),
                        raw: tx.RemoveLiquidity,
                        token1: tx.RemoveLiquidity.symbol_0,
                        token2: tx.RemoveLiquidity.symbol_1,
                        amount1: tx.RemoveLiquidity.amount_0,
                        amount2: tx.RemoveLiquidity.amount_1,
                        source: TransactionSource.KONGSWAP,
                        type: TransactionType.REMOVE_LIQUIDITY,
                    } as RemoveLiquidityTransaction;
                } else if ("Swap" in tx) {
                    parsedTx = {
                        ts: tx.Swap.ts,
                        id: tx.Swap.tx_id.toString(),
                        raw: tx.Swap,
                        tokenIn: tx.Swap.pay_symbol,
                        tokenOut: tx.Swap.receive_symbol,
                        amountIn: tx.Swap.pay_amount,
                        amountOut: tx.Swap.receive_amount,
                        slippage: tx.Swap.slippage,
                        source: TransactionSource.KONGSWAP,
                        type: TransactionType.SWAP,
                    } as SwapTransaction;
                }

                if (parsedTx == undefined) {
                    return null;
                }

                return parsedTx;
            })
            .filter((tx) => tx !== null);

        return transactions;
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
    /**
     * @description Kongswap can swap any token to any token so token1 and token2 will not
     */
    async listPools(token1?: Token, token2?: Token): Promise<IPool[]> {
        let tokensRes: PoolsResult = undefined;

        // searching for pool of token 1
        if (token1) {
            tokensRes = await this.actor.pools([token1.address]);
        } else tokensRes = await this.actor.pools(["all"]);

        const result = parseResultResponse(tokensRes);
        let pools = result.pools;

        // filter out if token2 is provided
        // Kong swap is not support for pair searching
        if (token1 && token2) {
            pools = pools.filter((pool) => {
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
                    chain: pool.chain_0,
                },
                token2: {
                    symbol: pool.symbol_1,
                    name: pool.address_1,
                    address: `${pool.chain_1}.${pool.address_1}`,
                    chain: pool.chain_1,
                },
            };
            return new KongSwapPool({
                poolInfo: poolInfo,
                agent: this.agent,
                address: this.id,
            });
        });

        return poolsObj;
    }
    async getPool(token1: Token, token2: Token): Promise<KongSwapPool | null> {
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

        return new KongSwapPool({ poolInfo, agent: this.agent, address: this.id });
    }
    async getPoolByAddress(address: string): Promise<KongSwapPool | null> {
        const poolsRes = await this.actor.pools([address]);
        const result = parseResultResponse(poolsRes);

        if (result.pools.length === 0) {
            throw new Error("Pool not found");
        }

        const poolReply = result.pools[0];
        const poolInfo: PoolInfo = {
            ...poolReply,
            address: address,
            token1: {
                symbol: poolReply.symbol_0,
                name: poolReply.address_0,
                address: poolReply.address_0,
                chain: poolReply.chain_0,
            },
            token2: {
                symbol: poolReply.symbol_1,
                name: poolReply.address_1,
                address: poolReply.address_1,
                chain: poolReply.chain_1,
            },
        };

        return new KongSwapPool({
            poolInfo,
            agent: this.agent,
            address: this.id,
        });
    }
}
