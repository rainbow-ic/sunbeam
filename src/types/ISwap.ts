import { SwapArgs } from "./actors/icpswap";

export type QuoteResult = bigint;
export interface ISwapStrategy {
    quote(args: SwapArgs): Promise<QuoteResult>;
    swap(): void;
    listTokens(): void;
    getLPInfo?(): void;
    addLP?(): void;
}
