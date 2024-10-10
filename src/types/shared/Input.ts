import { Token } from "./Token";

export type SwapInput = {
    tokenIn: Token;
    amountIn: bigint;
    amountOut: bigint;
    slippage: number;
};

export type QuoteInput = {
    tokenIn: Token;
    amountIn: bigint;
    slippage: number;
};

export type ListPoolInput = Token;

export type GetPoolInput = Token;
