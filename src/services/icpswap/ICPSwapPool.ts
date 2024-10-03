import { Actor } from "@dfinity/agent";
import { HttpAgent } from "@dfinity/agent";
import { IPool, PoolData, Token as IToken } from "../../types/ISwap";
import {
    DepositArgs,
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "../../types/actors/icswap/icpswapPool";
import { parseResultResponse, validateCaller } from "../../utils";
import { TokenStandard, icswap } from "../../types";
import { Principal } from "@dfinity/principal";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { icsPool } from "../../types/actors";
import { Token } from "@alpaca-icp/token-adapter";
import { PublicPoolOverView } from "../../types/actors/icswap/icpswapNodeIndex";
import { LPInfo } from "../../types/ICPSwap";

type IcpswapPoolActor = icsPool._SERVICE;

export class ICPSwapPool extends CanisterWrapper implements IPool {
    private actor: IcpswapPoolActor;
    private poolData: PublicPoolOverView;

    constructor({ agent, poolData }: { agent: HttpAgent; poolData: PublicPoolOverView }) {
        super({ id: poolData.pool, agent });
        this.actor = Actor.createActor(icsPool.idlFactory, {
            agent,
            canisterId: poolData.pool,
        });
        this.poolData = poolData;
    }

    getPoolDetail(): PublicPoolOverView {
        return this.poolData;
    }

    getPoolData(): PoolData {
        const data = this.poolData;
        const [token1, token2] = this.getTokens();
        return {
            address: data.pool,
            token1,
            token2,
        };
    }

    isForToken(token: IToken): boolean {
        const addr = token.address;
        if (this.poolData.token0Id === addr) return true;
        if (this.poolData.token1Id === addr) return true;
        return false;
    }

    isZeroForOne(token: IToken): boolean {
        const addr = token.address;
        if (this.poolData.token0Id === addr) return true;
        if (this.poolData.token1Id === addr) return false;
        throw new Error("token not in pool");
    }

    getTokens(): [IToken, IToken] {
        const data = this.poolData;
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
    async getLPInfo(): Promise<LPInfo> {
        const tokenInPool = await this.actor.getTokenAmountState();
        const tokenAmountState = parseResultResponse(tokenInPool);
        return tokenAmountState;
    }

    private toIcpSwapArgs(args: icswap.SwapInput): ICSSwapArgs {
        const amountIn = args.amountIn.toString();
        const amountOutMinimum = (args.amoundOutMinimum || 0).toString();

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
    async quote(args: icswap.SwapInput): Promise<bigint> {
        const res = await this.actor.quote(this.toIcpSwapArgs(args));
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

    async swap(args: icswap.SwapInput): Promise<bigint> {
        const caller = await this.agent.getPrincipal();
        validateCaller(caller);

        const swapArgs = this.toIcpSwapArgs(args);

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
