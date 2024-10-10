import {
    Token,
    QuoteInput,
    SwapInput,
    GetMetadataResponse,
    PoolInfoResponse,
    QuoteResponse,
    SwapResponse,
    GetLPInfoResponse,
} from "../shared";

export interface IPool {
    swap(args: SwapInput): Promise<SwapResponse>;
    quote(args: QuoteInput): Promise<QuoteResponse>;
    getMetadata(): Promise<GetMetadataResponse>;
    isForToken(token: Token): boolean;
    getTokens(): [Token, Token];
    /**
     * This method return the pool info from the private props, the type is based on the dex
     */
    getPoolInfo(): PoolInfoResponse;
    /**
     * This method return the general LP info
     */
    getLPInfo(): Promise<GetLPInfoResponse>;
}
