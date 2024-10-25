// mock of txs
const txsMock = jest.fn();
const createActorMock = () => {
    return { txs: txsMock };
};
// mock module
jest.mock("@dfinity/agent", () => ({
    Actor: {
        createActor: createActorMock,
    },
}));

const parseResultResponseMock = jest.fn();

jest.mock("../../src/utils", () => ({
    parseResultResponse: parseResultResponseMock,
}));

import { describe } from "@jest/globals";
import { KongSwap, KONGSWAP_BACKEND_CANISTER } from "../../../src";
import { Agent } from "@dfinity/agent";
import { TxsResult } from "../../../src/types/actors/kongswap/kongBackend";

const address = KONGSWAP_BACKEND_CANISTER;
const agent = {} as unknown as Agent;

const kongswapInstance = new KongSwap({
    agent,
    address,
});

describe("KongSwap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should get transactions successfully", async () => {
        // Arrange
        const swapReplyArray = [
            {
                Swap: {
                    ts: BigInt(Date.now()),
                    txs: [],
                    request_id: BigInt(1),
                    status: "completed",
                    tx_id: BigInt(1),
                    transfer_ids: [],
                    receive_chain: "chainA",
                    mid_price: 1.5,
                    pay_amount: BigInt(1000),
                    receive_amount: BigInt(1500),
                    claim_ids: [BigInt(1), BigInt(2)],
                    pay_symbol: "TOKEN_A",
                    receive_symbol: "TOKEN_B",
                    price: 1.5,
                    pay_chain: "chainA",
                    slippage: 0.01,
                },
            },
            {
                Swap: {
                    ts: BigInt(Date.now()),
                    txs: [],
                    request_id: BigInt(2),
                    status: "completed",
                    tx_id: BigInt(2),
                    transfer_ids: [],
                    receive_chain: "chainB",
                    mid_price: 2.0,
                    pay_amount: BigInt(2000),
                    receive_amount: BigInt(4000),
                    claim_ids: [BigInt(3), BigInt(4)],
                    pay_symbol: "TOKEN_C",
                    receive_symbol: "TOKEN_D",
                    price: 2.0,
                    pay_chain: "chainB",
                    slippage: 0.02,
                },
            },
            {
                Swap: {
                    ts: BigInt(Date.now()),
                    txs: [],
                    request_id: BigInt(3),
                    status: "completed",
                    tx_id: BigInt(3),
                    transfer_ids: [],
                    receive_chain: "chainC",
                    mid_price: 3.0,
                    pay_amount: BigInt(3000),
                    receive_amount: BigInt(9000),
                    claim_ids: [BigInt(5), BigInt(6)],
                    pay_symbol: "TOKEN_E",
                    receive_symbol: "TOKEN_F",
                    price: 3.0,
                    pay_chain: "chainC",
                    slippage: 0.03,
                },
            },
        ];
        const txsResultMocked: TxsResult = {
            Ok: swapReplyArray,
        };
        txsMock.mockResolvedValue(txsResultMocked);
        parseResultResponseMock.mockReturnValue(swapReplyArray);

        // Act
        const result = await kongswapInstance.getTransactions();

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0].type).toBe("SWAP");
        expect(result[1].type).toBe("SWAP");
        expect(result[2].type).toBe("SWAP");
    });
});
