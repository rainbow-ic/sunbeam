import { Actor } from "@dfinity/agent";
import { ISwapPool } from "../types/ISwap";
import {
    DepositArgs,
    SwapArgs as ICSSwapArgs,
    PoolMetadata as ICSPoolMetadata,
} from "../types/actors/icswap/icpswapPool";
import { parseOptionResponse, validateCaller } from "../utils";
import { Token } from "@alpaca-icp/token-adapter";
import { TokenStandard } from "../types";
import { Principal } from "@dfinity/principal";
import { CanisterWrapper, CanisterWrapperInitArgs } from "../types/CanisterWrapper";
import { icsPool } from "../types/actors";

type IcpswapPoolActor = icsPool._SERVICE;

export class ICPSwapPool extends CanisterWrapper implements ISwapPool {
    private actor: IcpswapPoolActor;

    constructor({ id, agent }: CanisterWrapperInitArgs) {
        super({ id, agent });
        this.actor = Actor.createActor(icsPool.idlFactory, {
            agent,
            canisterId: id,
        });
    }
    async quote(args: ICSSwapArgs): Promise<bigint> {
        const res = await this.actor.quote(args);
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

    async swap(args: ICSSwapArgs): Promise<bigint> {
        const caller = await this.agent.getPrincipal();
        validateCaller(caller);

        // GET TOKEN INFO
        const res = await this.actor.metadata();
        const metadata = parseOptionResponse(res);
        const { token0, token1 } = metadata;

        let tokenSwapInstance: Token;
        let fee: bigint;
        let tokenAddress: string;
        let tokenStandard: TokenStandard;

        if (args.zeroForOne) {
            tokenSwapInstance = new Token({
                canisterId: token0.address,
                tokenStandard: token0.standard as TokenStandard,
                agent: this.agent,
            });
            fee = await tokenSwapInstance.getFee();
            tokenAddress = token0.address;
            tokenStandard = token0.standard as TokenStandard;
        } else {
            tokenSwapInstance = new Token({
                canisterId: token1.address,
                tokenStandard: token1.standard as TokenStandard,
                agent: this.agent,
            });
            fee = await tokenSwapInstance.getFee();
            tokenAddress = token1.address;
            tokenStandard = token1.standard as TokenStandard;
        }

        // DEPOSIT TO POOL
        if (tokenStandard !== "ICRC1") {
            await tokenSwapInstance.approve({
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
                amount: BigInt(Math.floor(Number(args.amountIn) + Number(fee))),
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
            amount: BigInt(args.amountIn),
            token: tokenAddress,
        });

        // SWAP
        // doc: https://github.com/ICPSwap-Labs/docs/blob/main/02.SwapPool/Swap/01.Getting_a_Quote.md
        const quoteResult = await this.quote({
            amountIn: args.amountIn,
            zeroForOne: args.zeroForOne,
            amountOutMinimum: args.amountOutMinimum,
        });

        console.log("quoteResult", quoteResult);

        const swapResult = await this.actor.swap({
            amountIn: args.amountIn,
            zeroForOne: args.zeroForOne,
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
