import { Token } from "./ISwap";

export type ICSLPInfo = {
    swapFee0Repurchase: bigint;
    token0Amount: bigint;
    swapFeeReceiver: string;
    token1Amount: bigint;
    swapFee1Repurchase: bigint;
};

export type ICSToken = Token & {
    standard: string;
    id?: bigint;
    volumeUSD1d?: number;
    volumeUSD7d?: number;
    totalVolumeUSD?: number;
    volumeUSD?: number;
    feesUSD?: number;
    priceUSDChange?: number;
    txCount?: bigint;
    priceUSD?: number;
};
