import {
    AddLiquidityReply,
    AddPoolReply,
    PoolReply,
    RemoveLiquidityReply,
    SwapReply,
} from "./actors/kongswap/kongBackend";
import { Token as GeneralToken, PoolData } from "./shared";

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

export type PoolMetadata = PoolReply;

export type PoolInfo = PoolReply & PoolData;

export type Transaction = AddLiquidityReply | SwapReply | AddPoolReply | RemoveLiquidityReply;
