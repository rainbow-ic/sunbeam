import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export type AddLiquiditAmountsResult = { Ok: AddLiquidityAmountsReply } | { Err: string };
export interface AddLiquidityAmountsReply {
    add_lp_token_amount: bigint;
    amount_0: bigint;
    amount_1: bigint;
    symbol_0: string;
    symbol_1: string;
    chain_0: string;
    chain_1: string;
    symbol: string;
    fee_0: bigint;
    fee_1: bigint;
}
export interface AddLiquidityArgs {
    token_0: string;
    token_1: string;
    amount_0: bigint;
    amount_1: bigint;
    tx_id_0: [] | [TxId];
    tx_id_1: [] | [TxId];
}
export type AddLiquidityAsyncResult = { Ok: bigint } | { Err: string };
export interface AddLiquidityReply {
    ts: bigint;
    request_id: bigint;
    status: string;
    tx_id: bigint;
    add_lp_token_amount: bigint;
    amount_0: bigint;
    amount_1: bigint;
    claim_ids: BigUint64Array | bigint[];
    symbol_0: string;
    symbol_1: string;
    tx_ids: Array<TxIdReply>;
    chain_0: string;
    chain_1: string;
    symbol: string;
}
export type AddLiquidityResult = { Ok: AddLiquidityReply } | { Err: string };
export interface AddPoolArgs {
    token_0: string;
    token_1: string;
    amount_0: bigint;
    amount_1: bigint;
    tx_id_0: [] | [TxId];
    tx_id_1: [] | [TxId];
    lp_fee_bps: [] | [number];
    on_kong: [] | [boolean];
}
export interface AddPoolReply {
    ts: bigint;
    request_id: bigint;
    status: string;
    tx_id: bigint;
    lp_token_symbol: string;
    balance: bigint;
    add_lp_token_amount: bigint;
    amount_0: bigint;
    amount_1: bigint;
    claim_ids: BigUint64Array | bigint[];
    symbol_0: string;
    symbol_1: string;
    tx_ids: Array<TxIdReply>;
    chain_0: string;
    chain_1: string;
    lp_token_supply: bigint;
    symbol: string;
    lp_fee_bps: number;
    on_kong: boolean;
}
export type AddPoolResult = { Ok: AddPoolReply } | { Err: string };
export interface AddTokenArgs {
    token: string;
    on_kong: [] | [boolean];
}
export type AddTokenReply = { IC: ICTokenReply };
export type AddTokenResult = { Ok: AddTokenReply } | { Err: string };
export interface BalancesReply {
    ts: bigint;
    usd_balance: number;
    balance: number;
    name: string;
    amount_0: number;
    amount_1: number;
    usd_amount_0: number;
    usd_amount_1: number;
    symbol: string;
}
export interface ICTokenReply {
    fee: bigint;
    decimals: number;
    token: string;
    token_id: number;
    chain: string;
    name: string;
    canister_id: string;
    icrc1: boolean;
    icrc2: boolean;
    icrc3: boolean;
    pool_symbol: string;
    symbol: string;
    on_kong: boolean;
}
export interface ICTxIdReply {
    block_id: bigint;
    chain: string;
    canister_id: string;
    symbol: string;
}
export interface LPTokenReply {
    fee: bigint;
    decimals: number;
    token: string;
    token_id: number;
    chain: string;
    name: string;
    address: string;
    pool_symbol: string;
    total_supply: bigint;
    symbol: string;
    on_kong: boolean;
}
export interface MessagesReply {
    ts: bigint;
    title: string;
    message: string;
    message_id: bigint;
}
export type MessagesResult = { Ok: Array<MessagesReply> } | { Err: string };
export interface PoolsReply {
    lp_token_symbol: string;
    balance: bigint;
    total_lp_fee: bigint;
    name: string;
    lp_fee_0: bigint;
    lp_fee_1: bigint;
    balance_0: bigint;
    balance_1: bigint;
    rolling_24h_volume: bigint;
    rolling_24h_apy: number;
    address_0: string;
    address_1: string;
    rolling_24h_num_swaps: bigint;
    symbol_0: string;
    symbol_1: string;
    total_volume: bigint;
    pool_id: number;
    price: number;
    chain_0: string;
    chain_1: string;
    lp_token_supply: bigint;
    symbol: string;
    rolling_24h_lp_fee: bigint;
    lp_fee_bps: number;
    on_kong: boolean;
}
export type PoolsResult = { Ok: Array<PoolsReply> } | { Err: string };
export interface RemoveLiquidityAmountsReply {
    lp_fee_0: bigint;
    lp_fee_1: bigint;
    amount_0: bigint;
    amount_1: bigint;
    symbol_0: string;
    symbol_1: string;
    chain_0: string;
    chain_1: string;
    remove_lp_token_amount: bigint;
    symbol: string;
}
export type RemoveLiquidityAmountsResult =
    | {
          Ok: RemoveLiquidityAmountsReply;
      }
    | { Err: string };
export interface RemoveLiquidityArgs {
    token_0: string;
    token_1: string;
    remove_lp_token_amount: bigint;
}
export type RemoveLiquidityAsyncResult = { Ok: bigint } | { Err: string };
export interface RemoveLiquidityReply {
    ts: bigint;
    request_id: bigint;
    status: string;
    tx_id: bigint;
    lp_fee_0: bigint;
    lp_fee_1: bigint;
    amount_0: bigint;
    amount_1: bigint;
    claim_ids: BigUint64Array | bigint[];
    symbol_0: string;
    symbol_1: string;
    tx_ids: Array<TxIdReply>;
    chain_0: string;
    chain_1: string;
    remove_lp_token_amount: bigint;
    symbol: string;
}
export type RemoveLiquidityResult = { Ok: RemoveLiquidityReply } | { Err: string };
export type RequestReply =
    | { AddLiquidity: AddLiquidityReply }
    | { Swap: SwapReply }
    | { AddPool: AddPoolReply }
    | { RemoveLiquidity: RemoveLiquidityReply }
    | { Pending: null };
export type RequestRequest =
    | { AddLiquidity: AddLiquidityArgs }
    | { Swap: SwapArgs }
    | { AddPool: AddPoolArgs }
    | { RemoveLiquidity: RemoveLiquidityArgs };
export interface RequestsReply {
    ts: bigint;
    request_id: bigint;
    request: RequestRequest;
    statuses: Array<string>;
    reply: RequestReply;
}
export type RequestsResult = { Ok: Array<RequestsReply> } | { Err: string };
export interface SendArgs {
    token: string;
    to_address: string;
    amount: bigint;
}
export interface SendReply {
    ts: bigint;
    request_id: bigint;
    status: string;
    tx_id: bigint;
    chain: string;
    to_address: string;
    amount: bigint;
    symbol: string;
}
export type SendResult = { OK: SendReply } | { Err: string };
export interface SwapAmountsReply {
    txs: Array<SwapAmountsTxReply>;
    receive_chain: string;
    mid_price: number;
    pay_amount: bigint;
    receive_amount: bigint;
    pay_symbol: string;
    receive_symbol: string;
    price: number;
    pay_chain: string;
    slippage: number;
}
export type SwapAmountsResult = { Ok: SwapAmountsReply } | { Err: string };
export interface SwapAmountsTxReply {
    receive_chain: string;
    pay_amount: bigint;
    receive_amount: bigint;
    pay_symbol: string;
    receive_symbol: string;
    pool_symbol: string;
    price: number;
    pay_chain: string;
    lp_fee: bigint;
    gas_fee: bigint;
}
export interface SwapArgs {
    receive_token: string;
    max_slippage: [] | [number];
    pay_amount: bigint;
    referred_by: [] | [string];
    receive_amount: [] | [bigint];
    receive_address: [] | [string];
    pay_token: string;
    pay_tx_id: [] | [TxId];
}
export type SwapAsyncResult = { Ok: bigint } | { Err: string };
export interface SwapReply {
    ts: bigint;
    txs: Array<SwapTxReply>;
    request_id: bigint;
    status: string;
    tx_id: bigint;
    receive_chain: string;
    mid_price: number;
    pay_amount: bigint;
    receive_amount: bigint;
    claim_ids: BigUint64Array | bigint[];
    pay_symbol: string;
    receive_symbol: string;
    tx_ids: Array<TxIdReply>;
    price: number;
    pay_chain: string;
    slippage: number;
}
export type SwapResult = { Ok: SwapReply } | { Err: string };
export interface SwapTxReply {
    ts: bigint;
    receive_chain: string;
    pay_amount: bigint;
    receive_amount: bigint;
    pay_symbol: string;
    receive_symbol: string;
    pool_symbol: string;
    price: number;
    pay_chain: string;
    lp_fee: bigint;
    gas_fee: bigint;
}
export type TokenReply = { IC: ICTokenReply } | { LP: LPTokenReply };
export type TokensResult = { Ok: Array<TokenReply> } | { Err: string };
export type TxId = { BlockId: bigint } | { TransactionId: string };
export type TxIdReply = { IC: ICTxIdReply };
export type TxsReply =
    | { AddLiquidity: AddLiquidityReply }
    | { Swap: SwapReply }
    | { AddPool: AddPoolReply }
    | { RemoveLiquidity: RemoveLiquidityReply };
export type TxsResult = { Ok: Array<TxsReply> } | { Err: string };
export type UserBalancesReply = { LP: BalancesReply };
export type UserBalancesResult = { Ok: Array<UserBalancesReply> } | { Err: string };
export interface UserReply {
    user_name: string;
    fee_level_expires_at: [] | [bigint];
    referred_by: [] | [string];
    user_id: number;
    fee_level: number;
    principal_id: string;
    referred_by_expires_at: [] | [bigint];
    campaign1_flags: Array<boolean>;
    my_referral_code: string;
}
export type UserResult = { Ok: UserReply } | { Err: string };
export interface _SERVICE {
    add_liquidity: ActorMethod<[AddLiquidityArgs], AddLiquidityResult>;
    add_liquidity_amounts: ActorMethod<[string, bigint, string], AddLiquiditAmountsResult>;
    add_liquidity_async: ActorMethod<[AddLiquidityArgs], AddLiquidityAsyncResult>;
    add_pool: ActorMethod<[AddPoolArgs], AddPoolResult>;
    add_token: ActorMethod<[AddTokenArgs], AddTokenResult>;
    get_user: ActorMethod<[], UserResult>;
    icrc1_name: ActorMethod<[], string>;
    messages: ActorMethod<[[] | [bigint]], MessagesResult>;
    pools: ActorMethod<[[] | [string]], PoolsResult>;
    remove_liquidity: ActorMethod<[RemoveLiquidityArgs], RemoveLiquidityResult>;
    remove_liquidity_amounts: ActorMethod<[string, string, bigint], RemoveLiquidityAmountsResult>;
    remove_liquidity_async: ActorMethod<[RemoveLiquidityArgs], RemoveLiquidityAsyncResult>;
    requests: ActorMethod<[[] | [bigint]], RequestsResult>;
    send: ActorMethod<[SendArgs], SendResult>;
    swap: ActorMethod<[SwapArgs], SwapResult>;
    swap_amounts: ActorMethod<[string, bigint, string], SwapAmountsResult>;
    swap_async: ActorMethod<[SwapArgs], SwapAsyncResult>;
    tokens: ActorMethod<[[] | [string]], TokensResult>;
    txs: ActorMethod<[[] | [boolean]], TxsResult>;
    user_balances: ActorMethod<[[] | [string]], UserBalancesResult>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
