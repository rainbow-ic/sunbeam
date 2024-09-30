import {
    LPTokenReply,
    PoolsReply,
    SwapAmountsReply,
    SwapReply,
} from "./actors/kongswap/kongBackend";
import { Token } from "./ISwap";

export type KongSwapToken = Token & {
    fee: bigint;
    decimals: number;
    token: string;
    token_id: number;
    chain: string;
    canister_id: string;
    icrc1: boolean;
    icrc2: boolean;
    icrc3: boolean;
    pool_symbol: string;
    on_kong: boolean;
};

export type SwapArgs = {
    tokenIn: string;
    amountIn: bigint;
    tokenOut: string;
    amountOut: bigint;
    slippage: number;
};

export type QuoteArgs = {
    tokenIn: string;
    amountIn: bigint;
    tokenOut: string;
};
export type SwapResponse = SwapReply;
export type QuoteResponse = SwapAmountsReply;
export type KongSwapLPToken = LPTokenReply;
export type PoolMetadata = PoolsReply;
export type ListPoolToken = {
    address: string;
    chain: string;
};
