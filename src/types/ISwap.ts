import * as icpswap from "./ICPSwap";
import * as kongswap from "./KongSwap";

/**
 * Represents a token with properties from multiple sources.
 *
 * @typedef {Object} Token
 * @property {string} address - The address of the token.
 * @property {string} [name] - The name of the token (icpswap).
 * @property {string} [symbol] - The symbol of the token (icpswap).
 * @property {string} [chain] - The chain of the token (kongswap).
 */
export type Token = {
    /**
     * The address of the token.
     * @type {string}
     */
    address: string;

    /**
     * The name of the token.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to the token's name.
     */
    name?: string;

    /**
     * The symbol of the token.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to the token's symbol.
     */
    symbol?: string;

    /**
     * The chain of the token.
     *
     * @type {string}
     *
     * @source kongswap - Corresponds to the token's chain.
     */
    chain?: string;
};

export type PoolData = {
    address: string;
    token1: Token;
    token2: Token;
};

export type SwapInput = {
    tokenIn: Token;
    amountIn: bigint;
    amountOut: bigint;
    slippage: number;
};

export type SwapResponse = bigint;

export type QuoteInput = {
    tokenIn: Token;
    amountIn: bigint;
    slippage: number;
};

export type QuoteResponse = bigint;

export type GetMetadataResponse = icpswap.PoolMetadata | kongswap.PoolMetadata | null;

export type GetLPInfoResponse = LPInfo | null;

/**
 * Represents the information about a liquidity pool (LP).
 *
 * @typedef {Object} LPInfo
 * @property {string} token1Address - The address of the first token in the liquidity pool.
 * @property {string} token2Address - The address of the second token in the liquidity pool.
 * @property {number} price - The price of the liquidity pool.
 */
export type LPInfo = {
    /**
     * The address of the first token in the liquidity pool.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `token0Id`
     * @source kongswap - Corresponds to PoolReply `address_0`
     */
    token1Address: string;

    /**
     * The address of the second token in the liquidity pool.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `token1Id`
     * @source kongswap - Corresponds to PoolReply `address_1`
     */
    token2Address: string;

    /**
     * The symbol of the first token in the liquidity pool.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `token0Symbol`
     * @source kongswap - Corresponds to PoolReply `symbol_0`
     */
    token1Symbol: string;

    /**
     * The symbol of the second token in the liquidity pool.
     *
     * @type {string}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `token1Symbol`
     * @source kongswap - Corresponds to PoolReply `symbol_1`
     */
    token2Symbol: string;

    /**
     * The balance of the first token in the liquidity pool.
     *
     * @type {bigint}
     *
     * @source icpswap - Corresponds to `token0Amount`
     * @source kongswap - Corresponds to `balance_0`
     */
    token1Balance: bigint;

    /**
     * The balance of the second token in the liquidity pool.
     *
     * @type {bigint}
     *
     * @source icpswap - Corresponds to `token1Amount`
     * @source kongswap - Corresponds to `balance_1`
     */
    token2Balance: bigint;

    /**
     * The liquidity pool fee for the first token.
     *
     * @type {bigint}
     *
     * @source icpswap - Corresponds to `swapFee0Repurchase`
     * @source kongswap - Corresponds to `lp_fee_0`
     */
    lpFeeToken1: bigint;

    /**
     * The liquidity pool fee for the second token.
     *
     * @type {bigint}
     *
     * @source icpswap - Corresponds to `swapFee1Repurchase`
     * @source kongswap - Corresponds to `lp_fee_1`
     */
    lpFeeToken2: bigint;

    /**
     * The fee of the liquidity pool.
     *
     * @type {number}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `feeTier` (e.g., 300 is 0.3%)
     * @source kongswap - Corresponds to PoolReply `lp_fee_bps` (e.g., 30 is 0.3%)
     */
    lpFee: number;

    /**
     * The price of the liquidity pool.
     * @type {number}
     *
     * @source icpswap - Corresponds to PublicPoolOverView `sqrtPrice`
     * @source kongswap - Corresponds to PoolReply `price`
     */
    price: number;
};
export type ListPoolInput = Token;

export type GetPoolInput = Token;

export interface IPool {
    swap(args: SwapInput): Promise<SwapResponse>;
    quote(args: QuoteInput): Promise<QuoteResponse>;
    getMetadata(): Promise<GetMetadataResponse>;
    getPoolData(): PoolData;
    isForToken(token: Token): boolean;
    getTokens(): [Token, Token];
    getLPInfo(): Promise<GetLPInfoResponse>;
}

export interface IDex {
    listTokens(): Promise<Token[]>;
    listPools(token1?: ListPoolInput, token2?: ListPoolInput): Promise<IPool[]>;
    getPool(token1: GetPoolInput, token2: GetPoolInput): Promise<IPool>;
}
