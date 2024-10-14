import { Actor, Agent } from "@dfinity/agent";
import {
    GetLPInfoResponse,
    IPool,
    kongswap,
    PoolData,
    QuoteInput,
    QuoteResponse,
    SwapInput,
    SwapResponse,
    Token,
} from "../../types";
import { kongBackend } from "../../types/actors";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { parseResultResponse } from "../../utils";

type KongSwapActor = kongBackend._SERVICE;

/**
 * KongSwap is a class that interacts with the KongSwap backend canister.
 *
 * @param agent
 * The HttpAgent used to interact with the backend canister.
 * @param address (optional)
 * The canister address of the backend canister.
 * @param poolData - The pool data of the pool.
 * Token of the pool must be provided with `chain` property.
 * @returns An instance of KongSwap.
 *
 */
export class KongSwapNonLPPool extends CanisterWrapper implements IPool {
    private actor: KongSwapActor;
    private poolInfo: kongswap.NonLPPool;
    constructor({
        agent,
        address,
        poolInfo,
    }: {
        agent: Agent;
        address: string;
        poolInfo: kongswap.NonLPPool;
    }) {
        const id = address;
        super({ id, agent });

        this.actor = Actor.createActor(kongBackend.idlFactory, {
            agent,
            canisterId: id,
        });
        this.poolInfo = poolInfo;
    }
    getPoolInfo(): kongswap.NonLPPool {
        return this.poolInfo;
    }

    private toSwapArgs(args: SwapInput): kongswap.SwapInput {
        const [token1, token2] = this.getTokens();

        if (this.isForToken(args.tokenIn)) {
            throw new Error("Invalid token");
        }

        const tokenIn = args.tokenIn.address === token1.address ? token1 : token2;
        const tokenOut = args.tokenIn.address === token1.address ? token2 : token1;

        const tokenInWithChain = `${tokenIn.chain}.${tokenIn.address}`;
        const tokenOutWithChain = `${tokenOut.chain}.${tokenOut.address}`;

        return {
            tokenIn: tokenInWithChain,
            amountIn: args.amountIn,
            tokenOut: tokenOutWithChain,
            amountOut: args.amountOut,
            slippage: args.slippage,
        };
    }

    async swap(args: SwapInput): Promise<SwapResponse> {
        const kongswapArgs = this.toSwapArgs(args);

        const swapResult = await this.actor.swap({
            pay_token: kongswapArgs.tokenIn,
            pay_amount: kongswapArgs.amountIn,
            receive_token: kongswapArgs.tokenOut,
            receive_amount: [kongswapArgs.amountOut],
            max_slippage: [kongswapArgs.slippage],
            referred_by: [],
            receive_address: [],
            pay_tx_id: [],
        });
        const res = parseResultResponse(swapResult);

        if (res.status !== "Success") {
            throw new Error("Swap failed " + res);
        }

        return res.receive_amount;
    }

    async getMaxSlippage(args: QuoteInput): Promise<number> {
        const [token1, token2] = this.getTokens();

        if (this.isForToken(args.tokenIn)) {
            throw new Error("Invalid token");
        }

        const tokenIn = args.tokenIn.address === token1.address ? token1 : token2;
        const tokenOut = args.tokenIn.address === token1.address ? token2 : token1;

        const tokenInWithChain = `${tokenIn.chain}.${tokenIn.address}`;
        const tokenOutWithChain = `${tokenOut.chain}.${tokenOut.address}`;

        const swapAmountResult = await this.actor.swap_amounts(
            tokenInWithChain,
            args.amountIn,
            tokenOutWithChain,
        );
        const res = parseResultResponse(swapAmountResult);

        return res.slippage;
    }

    async quote(args: QuoteInput): Promise<QuoteResponse> {
        const [token1, token2] = this.getTokens();

        if (this.isForToken(args.tokenIn)) {
            throw new Error("Invalid token");
        }

        const tokenIn = args.tokenIn.address === token1.address ? token1 : token2;
        const tokenOut = args.tokenIn.address === token1.address ? token2 : token1;

        const tokenInWithChain = `${tokenIn.chain}.${tokenIn.address}`;
        const tokenOutWithChain = `${tokenOut.chain}.${tokenOut.address}`;

        const swapAmountResult = await this.actor.swap_amounts(
            tokenInWithChain,
            args.amountIn,
            tokenOutWithChain,
        );
        const res = parseResultResponse(swapAmountResult);

        return res.receive_amount;
    }
    async getMetadata(): Promise<kongswap.PoolMetadata> {
        const poolsResponse = await this.actor.pools([this.poolInfo.address]);
        const poolMetadata = parseResultResponse(poolsResponse);

        if (poolMetadata.pools.length === 0) {
            throw new Error("Pool not found");
        }

        return poolMetadata.pools[0];
    }
    getPoolData(): PoolData {
        return this.poolInfo;
    }
    isForToken(token: Token): boolean {
        if (token.address === this.poolInfo.token1.address) return true;
        if (token.address === this.poolInfo.token2.address) return true;
        return false;
    }
    getTokens(): [Token, Token] {
        return [this.poolInfo.token1, this.poolInfo.token2];
    }
    async getLPInfo(): Promise<GetLPInfoResponse> {
        throw new Error("This pair is not a LP pair");
    }
}
