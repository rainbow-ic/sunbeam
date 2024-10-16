import * as icpswap from "../ICPSwap";
import * as kongswap from "../KongSwap";
import { LPInfo } from "./LPInfo";

export type SwapResponse = bigint;
export type QuoteResponse = bigint;
export type GetMetadataResponse = icpswap.PoolMetadata | kongswap.PoolMetadata | null;
export type PoolInfoResponse = icpswap.PoolInfo | kongswap.PoolInfo | kongswap.NonLPPool | null;
export type GetLPInfoResponse = LPInfo | null;
