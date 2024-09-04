import { HttpAgent } from "@dfinity/agent";
import { SupportedDEX, SwapFactory } from "./services";

const canisterId = "xmiu5-jqaaa-aaaag-qbz7q-cai";

const main = async () => {
    try {
        const agent = new HttpAgent({ host: "https://ic0.app" });

        const swapService = SwapFactory.create({
            supportedDEX: SupportedDEX.ICPSwap,
            initArgs: {
                canisterId,
                agent,
            },
        });

        const quote = await swapService.quote({
            amountIn: "10000000",
            zeroForOne: true,
            amountOutMinimum: "0",
        });

        console.log("[quote]", quote);
    } catch (error) {
        console.error(error);
    }
};

main();
