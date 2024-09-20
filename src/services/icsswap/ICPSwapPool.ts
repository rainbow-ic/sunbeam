import { Actor } from "@dfinity/agent";
import { HttpAgent } from "@dfinity/agent";
import { IPool, PoolData, Token as IToken, SwapArgs } from "../../types/ISwap";
import {
    DepositArgs,
    PoolMetadata as ICSPoolMetadata,
} from "../../types/actors/icswap/icpswapPool";
import { parseOptionResponse, validateCaller } from "../../utils";
import { TokenStandard } from "../../types";
import { Principal } from "@dfinity/principal";
import { CanisterWrapper } from "../../types/CanisterWrapper";
import { icsPool } from "../../types/actors";
import { Token } from "@alpaca-icp/token-adapter";
import { PublicPoolOverView } from "../../types/actors/icswap/icpswapNodeIndex";

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

    async quote(args: SwapArgs): Promise<bigint> {
        const zeroForOne = this.isZeroForOne(args.tokenIn);
        const icsArgs = args.toICSSwapArgs(zeroForOne);
        const res = await this.actor.quote(icsArgs);
        const quote = parseOptionResponse(res);
        return quote;
    }

    async depositFrom(args: DepositArgs): Promise<bigint> {
        const res = await this.actor.depositFrom(args);
        const depositResult = parseOptionResponse(res);
        return depositResult;
    }

    async getMetadata(): Promise<ICSPoolMetadata> {
        const res = await this.actor.metadata();
        const metadata = parseOptionResponse(res);
        return metadata;
    }

    async swap(args: SwapArgs): Promise<bigint> {
        const zeroForOne = this.isZeroForOne(args.tokenIn);
        const icsArgs = args.toICSSwapArgs(zeroForOne);

        const caller = await this.agent.getPrincipal();
        validateCaller(caller);

        // GET TOKEN INFO
        const { token0: meta1, token1: meta2 } = await this.getMetadata();

        let tokenSwapInstance: Token;
        let fee: bigint;
        let tokenAddress: string;
        let tokenStandard: TokenStandard;

        if (icsArgs.zeroForOne) {
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
                amount: BigInt(Math.floor(Number(icsArgs.amountIn) + Number(fee))),
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
            amount: BigInt(icsArgs.amountIn),
            token: tokenAddress,
        });

        // SWAP
        // doc: https://github.com/ICPSwap-Labs/docs/blob/main/02.SwapPool/Swap/01.Getting_a_Quote.md
        const quoteResult = await this.actor.quote({
            amountIn: icsArgs.amountIn,
            zeroForOne: icsArgs.zeroForOne,
            amountOutMinimum: icsArgs.amountOutMinimum,
        });

        console.log("quoteResult", quoteResult);

        const swapResult = await this.actor.swap({
            amountIn: icsArgs.amountIn,
            zeroForOne: icsArgs.zeroForOne,
            amountOutMinimum: quoteResult.toString(),
        });

        const result = parseOptionResponse(swapResult);

        return result;
    }
    // getLPInfo?(): void {
    //     throw new Error("Method not implemented.");
    // }
    // addLP?(): void {
    //     throw new Error("Method not implemented.");
    // }
}