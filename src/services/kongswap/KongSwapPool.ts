import { Actor, HttpAgent } from "@dfinity/agent";
import {
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
import { LPInfo } from "../../types/ICPSwap";
import { KONGSWAP_BACKEND_TEST_CANISTER } from "../../constant";
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
        const id = address ?? KONGSWAP_BACKEND_TEST_CANISTER;
        super({ id, agent });

        //validate pool data token
        if (!poolData.token1.chain || !poolData.token2.chain) {
            throw new Error("Invalid pool data");
        }

        this.actor = Actor.createActor(kongBackend.idlFactory, {
            agent,
            canisterId: id,
        });
        this.poolData = poolData;
    }

    private toSwapArgs(args: SwapInput): kongswap.SwapInput {
        const [token1, token2] = this.getTokens();

        if (args.tokenIn.address !== token1.address && args.tokenIn.address !== token2.address) {
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

        return res.receive_amount;
    }

    async getMaxSlippage(args: QuoteInput): Promise<number> {
        const [token1, token2] = this.getTokens();

        if (args.tokenIn.address !== token1.address && args.tokenIn.address !== token2.address) {
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

        if (args.tokenIn.address !== token1.address && args.tokenIn.address !== token2.address) {
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
    async getLPInfo(): Promise<LPInfo> {
        throw new Error("Method not implemented.");
    }
}
