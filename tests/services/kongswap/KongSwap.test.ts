// mock of txs
const txsMock = jest.fn();
const tokenMock = jest.fn();

const createActorMock = () => {
    return { txs: txsMock, tokens: tokenMock };
};
// mock module
jest.mock("@dfinity/agent", () => ({
    Actor: {
        createActor: createActorMock,
    },
}));

const parseResultResponseMock = jest.fn();

jest.mock("../../../src/utils", () => ({
    parseResultResponse: parseResultResponseMock,
}));

import { describe } from "@jest/globals";
import { KongSwap, KONGSWAP_BACKEND_CANISTER } from "../../../src";
// import { KongSwap, KONGSWAP_BACKEND_CANISTER } from "../../src";
import { Agent } from "@dfinity/agent";
import { TxsReply, TxsResult } from "../../../src/types/actors/kongswap/kongBackend";
// import { TxsResult } from "../../src/types/actors/kongswap/kongBackend";

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
        const replyArray: Array<TxsReply> = [
            {
                RemoveLiquidity: {
                    ts: BigInt(Date.now()),
                    request_id: BigInt(1),
                    status: "completed",
                    tx_id: BigInt(1),
                    transfer_ids: [],
                    claim_ids: [BigInt(1), BigInt(2)],
                    lp_fee_0: BigInt(10),
                    lp_fee_1: BigInt(20),
                    amount_0: BigInt(1000),
                    amount_1: BigInt(2000),
                    symbol_0: "TOKEN_A",
                    symbol_1: "TOKEN_B",
                    chain_0: "chainA",
                    chain_1: "chainB",
                    remove_lp_token_amount: BigInt(500),
                    symbol: "symbol value",
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
                AddPool: {
                    ts: BigInt(Date.now()),
                    request_id: BigInt(3),
                    status: "completed",
                    tx_id: BigInt(3),
                    transfer_ids: [],
                    claim_ids: [BigInt(5), BigInt(6)],
                    amount_0: BigInt(1000),
                    amount_1: BigInt(2000),
                    symbol_0: "TOKEN_E",
                    symbol_1: "TOKEN_F",
                    chain_0: "chainC",
                    chain_1: "chainD",
                    add_lp_token_amount: BigInt(500),
                    symbol: "symbol_value",
                    lp_token_symbol: "LP_TOKEN",
                    balance: BigInt(10000),
                    lp_token_supply: BigInt(50000),
                    lp_fee_bps: 30,
                    on_kong: true,
                },
            },
            {
                AddLiquidity: {
                    ts: BigInt(Date.now()),
                    request_id: BigInt(3),
                    status: "completed",
                    tx_id: BigInt(3),
                    transfer_ids: [],
                    claim_ids: [BigInt(5), BigInt(6)],
                    amount_0: BigInt(1000),
                    amount_1: BigInt(2000),
                    symbol_0: "TOKEN_E",
                    symbol_1: "TOKEN_F",
                    chain_0: "chainC",
                    chain_1: "chainD",
                    add_lp_token_amount: BigInt(500),
                    symbol: "symbol_value",
                },
            },
        ];
        const txsResultMocked: TxsResult = {
            Ok: replyArray,
        };
        txsMock.mockResolvedValue(txsResultMocked);
        parseResultResponseMock.mockReturnValue(replyArray);

        // Act
        const result = await kongswapInstance.getTransactions();

        // Assert
        expect(result).toHaveLength(4);
        expect(result[0].type).toBe("REMOVE_LIQUIDITY");
        expect(result[1].type).toBe("SWAP");
        expect(result[2].type).toBe("CREATE_POOL");
        expect(result[3].type).toBe("ADD_LIQUIDITY");
    });

    it("should get transactions and filter invalid property", async () => {
        const arrayWithInvalidTransaction = [
            {
                InvalidProperty: {
                    ts: BigInt(Date.now()),
                    request_id: BigInt(1),
                    status: "completed",
                    tx_id: BigInt(1),
                    transfer_ids: [],
                    claim_ids: [BigInt(1), BigInt(2)],
                    lp_fee_0: BigInt(10),
                    lp_fee_1: BigInt(20),
                    amount_0: BigInt(1000),
                    amount_1: BigInt(2000),
                    symbol_0: "TOKEN_A",
                    symbol_1: "TOKEN_B",
                    chain_0: "chainA",
                    chain_1: "chainB",
                    remove_lp_token_amount: BigInt(500),
                    symbol: "symbol value",
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
        ] as unknown as TxsReply[];

        const txsResultMocked: TxsResult = {
            Ok: arrayWithInvalidTransaction,
        };

        txsMock.mockResolvedValue(txsResultMocked);
        parseResultResponseMock.mockReturnValue(arrayWithInvalidTransaction);

        const result = await kongswapInstance.getTransactions();

        expect(result).toHaveLength(2);
    });

    it("should throw error when get transactions failed", async () => {
        const txsResultMocked: TxsResult = {
            Err: "Error getting transaction",
        };

        const tsxErrorMocked = new Error(JSON.stringify(txsResultMocked));

        txsMock.mockResolvedValue(txsResultMocked);
        parseResultResponseMock.mockImplementation(() => {
            throw tsxErrorMocked;
        });

        const result = kongswapInstance.getTransactions();

        expect(result).rejects.toThrow(tsxErrorMocked);
    });

    it("should get tokens successfully", async () => {
        const tokenArray = [
            {
                IC: {
                    fee: BigInt(100),
                    decimals: 18,
                    token: "ExampleToken",
                    token_id: 1,
                    chain: "ExampleChain",
                    name: "Example Token",
                    canister_id: "example-canister-id",
                    icrc1: true,
                    icrc2: false,
                    icrc3: true,
                    pool_symbol: "EXMPL",
                    symbol: "EXM",
                    on_kong: true,
                },
            },
            {
                IC: {
                    fee: BigInt(200),
                    decimals: 8,
                    token: "AnotherToken",
                    token_id: 2,
                    chain: "AnotherChain",
                    name: "Another Token",
                    canister_id: "another-canister-id",
                    icrc1: false,
                    icrc2: true,
                    icrc3: false,
                    pool_symbol: "ANOTH",
                    symbol: "ANT",
                    on_kong: false,
                },
            },
        ];

        const tokensResultMock = {
            Ok: tokenArray,
        };

        tokenMock.mockResolvedValue(tokensResultMock);
        parseResultResponseMock.mockReturnValue(tokenArray);

        const result = await kongswapInstance.listTokens();

        expect(result).toHaveLength(2);
    });

    it("should get tokens and filter invalid property", async () => {
        const tokenArray = [
            {
                IC: {
                    fee: BigInt(100),
                    decimals: 18,
                    token: "ExampleToken",
                    token_id: 1,
                    chain: "ExampleChain",
                    name: "Example Token",
                    canister_id: "example-canister-id",
                    icrc1: true,
                    icrc2: false,
                    icrc3: true,
                    pool_symbol: "EXMPL",
                    symbol: "EXM",
                    on_kong: true,
                },
            },
            {
                LP: {
                    fee: BigInt(200),
                    decimals: 8,
                    token: "AnotherToken",
                    token_id: 2,
                    chain: "AnotherChain",
                    name: "Another Token",
                    canister_id: "another-canister-id",
                    icrc1: false,
                    icrc2: true,
                    icrc3: false,
                    pool_symbol: "ANOTH",
                    symbol: "ANT",
                    on_kong: false,
                },
            },
        ];

        const tokensResultMock = {
            Ok: tokenArray,
        };

        tokenMock.mockResolvedValue(tokensResultMock);
        parseResultResponseMock.mockReturnValue(tokenArray);

        const result = await kongswapInstance.listTokens();

        expect(tokenMock).toHaveBeenCalledWith(["all"]);
        expect(result).toHaveLength(1);
        expect(result[0].token_id).toEqual(1);
    });

    it("should throw error when get tokens failed", async () => {
        const tokenResultMock = {
            Err: "Error getting token",
        };

        const tokenErrorMocked = new Error(JSON.stringify(tokenResultMock));

        tokenMock.mockResolvedValue(tokenResultMock);
        parseResultResponseMock.mockImplementation(() => {
            throw tokenErrorMocked;
        });

        const result = kongswapInstance.listTokens();

        expect(result).rejects.toThrow(tokenErrorMocked);
    });
});
