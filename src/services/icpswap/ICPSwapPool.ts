import { Actor, Agent } from "@dfinity/agent";
import {
    IPool,
    Token as IToken,
    QuoteInput,
    SwapInput,
    SwapResponse,
    GetLPInfoResponse,
} from "../../types/ISwap";
import {
    DepositArgs,
    PoolMetadata as ICSPoolMetadata,
} from "../../types/actors/icswap/icpswapPool";
import { parseResultResponse, validateCaller } from "../../utils";
import { TokenStandard, icswap } from "../../types";
import { Principal } from "@dfinity/principal";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { icsPool } from "../../types/actors";
import { Token } from "@alpaca-icp/token-adapter";
import { PoolInfo } from "../../types/ICPSwap";

type IcpswapPoolActor = icsPool._SERVICE;

export class ICPSwapPool extends CanisterWrapper implements IPool {
    private actor: IcpswapPoolActor;
    private poolInfo: PoolInfo;

    constructor({ agent, poolInfo }: { agent: Agent; poolInfo: PoolInfo }) {
        super({ id: poolInfo.pool, agent });
        this.actor = Actor.createActor(icsPool.idlFactory, {
            agent,
            canisterId: poolInfo.pool,
        });
        this.poolInfo = poolInfo;
    }
    getPoolInfo(): PoolInfo {
        return this.poolInfo;
    }

    isForToken(token: IToken): boolean {
        const addr = token.address;
        if (this.poolInfo.token0Id === addr) return true;
        if (this.poolInfo.token1Id === addr) return true;
        return false;
    }

    isZeroForOne(token: IToken): boolean {
        const addr = token.address;
        if (this.poolInfo.token0Id === addr) return true;
        if (this.poolInfo.token1Id === addr) return false;
        throw new Error("token not in pool");
    }

    getTokens(): [IToken, IToken] {
        const data = this.poolInfo;
        const token1 = {
            symbol: data.token0Symbol,
            name: data.token0Symbol,
            address: data.token0Id,
            standard: data.token0Standard,
        };
        const token2 = {
            symbol: data.token1Symbol,
            name: data.token1Symbol,
            address: data.token1Id,
            standard: data.token1Standard,
        };
        return [token1, token2];
    }
    async getLPInfo(): Promise<GetLPInfoResponse> {
        const tokenInPool = await this.actor.getTokenAmountState();
        const tokenAmountState = parseResultResponse(tokenInPool);

        return {
            token1Address: this.poolInfo.token0Id,
            token2Address: this.poolInfo.token1Id,
            token1Symbol: this.poolInfo.token0Symbol,
            token2Symbol: this.poolInfo.token1Symbol,
            token1Balance: tokenAmountState.token0Amount,
            token2Balance: tokenAmountState.token1Amount,
            lpFeeToken1: tokenAmountState.swapFee0Repurchase,
            lpFeeToken2: tokenAmountState.swapFee1Repurchase,
            lpFee: Number(this.poolInfo.feeTier),
            price: this.poolInfo.sqrtPrice,
        };
    }

    private toSwapArgs(args: SwapInput | QuoteInput): icswap.SwapInput {
        const amountIn = args.amountIn.toString();
        const amountOutMinimum = (args.slippage || 0).toString();

        const [token1, token2] = this.getTokens();
        const addrIn = args.tokenIn.address;
        if (addrIn !== token1.address && addrIn !== token2.address) {
            throw new Error("invalid arguments: token address does not match tokens in pool");
        }
        const zeroForOne = args.tokenIn.address === token1.address;

        return {
            amountIn,
            zeroForOne,
            amountOutMinimum,
        };
    }
    async quote(args: QuoteInput): Promise<bigint> {
        const res = await this.actor.quote(this.toSwapArgs(args));
        const quote = parseResultResponse(res);
        return quote;
    }

    async depositFrom(args: DepositArgs): Promise<bigint> {
        const res = await this.actor.depositFrom(args);
        const depositResult = parseResultResponse(res);
        return depositResult;
    }

    async getMetadata(): Promise<ICSPoolMetadata> {
        const res = await this.actor.metadata();
        const metadata = parseResultResponse(res);
        return metadata;
    }

    async swap(args: SwapInput): Promise<SwapResponse> {
        const caller = await this.agent.getPrincipal();
        validateCaller(caller);

        const swapArgs = this.toSwapArgs(args);

        // GET TOKEN INFO
        const { token0: meta1, token1: meta2 } = await this.getMetadata();

        let tokenSwapInstance: Token;
        let fee: bigint;
        let tokenAddress: string;
        let tokenStandard: TokenStandard;

        if (swapArgs.zeroForOne) {
            tokenSwapInstance = new Token({
                canisterId: meta1.address,
                tokenStandard: meta1.standard as TokenStandard,
                agent: this.agent,
            });
            fee = await tokenSwapInstance.getFee();
            tokenAddress = meta1.address;
            tokenStandard = meta1.standard as TokenStandard;
        } else {
            tokenSwapInstance = new Token({
                canisterId: meta2.address,
                tokenStandard: meta2.standard as TokenStandard,
                // TODO: fix later with Agent
                agent: this.agent,
            });
            fee = await tokenSwapInstance.getFee();
            tokenAddress = meta2.address;
            tokenStandard = meta2.standard as TokenStandard;
        }

        // DEPOSIT TO POOL
        if (tokenStandard !== "ICRC1") {
            await tokenSwapInstance.approve({
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
                amount: BigInt(Math.floor(Number(swapArgs.amountIn) + Number(fee))),
                expected_allowance: [],
                expires_at: [],
                spender: {
                    owner: Principal.fromText(this.id),
                    subaccount: [],
                },
            });
        }
        await this.depositFrom({
            fee,
            amount: BigInt(swapArgs.amountIn),
            token: tokenAddress,
        });

        // SWAP
        // doc: https://github.com/ICPSwap-Labs/docs/blob/main/02.SwapPool/Swap/01.Getting_a_Quote.md
        const quoteResult = await this.actor.quote({
            amountIn: swapArgs.amountIn,
            zeroForOne: swapArgs.zeroForOne,
            amountOutMinimum: swapArgs.amountOutMinimum,
        });

        console.log("quoteResult", quoteResult);

        const swapResult = await this.actor.swap({
            amountIn: swapArgs.amountIn,
            zeroForOne: swapArgs.zeroForOne,
            amountOutMinimum: quoteResult.toString(),
        });

        const result = parseResultResponse(swapResult);

        return result;
    }
}
