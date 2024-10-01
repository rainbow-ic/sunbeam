import { Actor, HttpAgent } from "@dfinity/agent";
import { IPool, kongswap, PoolData, Token } from "../../types";
import { kongBackend } from "../../types/actors";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { ICSLPInfo } from "../../types/ICPSwap";
import { KONGSWAP_BACKEND_CANISTER } from "../../constant";
import { parseResultResponse } from "../../utils";

type KongSwapActor = kongBackend._SERVICE;

export class KongSwapPool extends CanisterWrapper implements IPool {
    private actor: KongSwapActor;
    private poolData: PoolData;

    constructor({
        agent,
        address,
        poolData,
    }: {
        agent: HttpAgent;
        address?: string;
        poolData: PoolData;
    }) {
        const id = address ?? KONGSWAP_BACKEND_CANISTER;
        super({ id, agent });
        this.actor = Actor.createActor(kongBackend.idlFactory, {
            agent,
            canisterId: id,
        });
        this.poolData = poolData;
    }
    async swap(args: kongswap.SwapArgs): Promise<kongswap.SwapResponse> {
        console.log("Swapping", args);
        const swapResult = await this.actor.swap({
            pay_token: args.tokenIn,
            pay_amount: args.amountIn,
            receive_token: args.tokenOut,
            receive_amount: [args.amountOut],
            max_slippage: [args.slippage],
            referred_by: [],
            receive_address: [],
            pay_tx_id: [],
        });
        const res = parseResultResponse(swapResult);
        return res;
    }
    async quote(args: kongswap.QuoteArgs): Promise<kongswap.QuoteResponse> {
        const swapAmountResult = await this.actor.swap_amounts(
            args.tokenIn,
            args.amountIn,
            args.tokenOut,
        );
        const res = parseResultResponse(swapAmountResult);

        return res;
    }
    async getMetadata(): Promise<kongswap.PoolMetadata> {
        console.log("Getting pool metadata", this.poolData.address);
        const poolsResponse = await this.actor.pools([this.poolData.address]);
        const poolMetadata = parseResultResponse(poolsResponse);

        if (poolMetadata.length === 0) {
            throw new Error("Pool not found");
        }

        return poolMetadata[0];
    }
    getPoolData(): PoolData {
        return this.poolData;
    }
    isForToken(token: Token): boolean {
        if (token.address === this.poolData.token1.address) return true;
        if (token.address === this.poolData.token2.address) return true;
        return false;
    }
    getTokens(): [Token, Token] {
        return [this.poolData.token1, this.poolData.token2];
    }
    async getLPInfo(): Promise<ICSLPInfo> {
        throw new Error("Method not implemented.");
    }
}
