import {
    LPTokenReply,
    PoolsReply,
    SwapAmountsReply,
    SwapReply,
} from "./actors/kongswap/kongBackend";
import { Token as GeneralToken } from "./ISwap";

export type Token = GeneralToken & {
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

export type SwapInput = {
    tokenIn: string;
    amountIn: bigint;
    tokenOut: string;
    amountOut: bigint;
    slippage: number;
};

export type QuoteInput = {
    tokenIn: string;
    amountIn: bigint;
    tokenOut: string;
};

export type ListPoolsInput = Pick<Token, "address" | "chain">;
export type GetPoolInput = Pick<Token, "address" | "chain">;
export type SwapResponse = SwapReply;
export type QuoteResponse = SwapAmountsReply;
export type KongSwapLPToken = LPTokenReply;
export type PoolMetadata = PoolsReply;
