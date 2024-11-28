# Sunbeam SDK

Sunbeam SDK is a TypeScript library for interacting with decentralized exchanges (DEXs) on the Internet Computer (IC) blockchain. It provides a unified interface for interacting with different DEXs like KongSwap and ICPSwap.

## Features

-   List tokens and pools
-   Get pool information
-   Prepare and execute swaps
-   Retrieve transaction history

## Installation

To install the Sunbeam SDK, use npm or yarn:

```bash
npm i @rainbow-ic/sunbeam
```

## Table of Contents

-   [Sunbeam SDK](#sunbeam-sdk)
    -   [Features](#features)
    -   [Installation](#installation)
    -   [Table of Contents](#table-of-contents)
    -   [Usage](#usage)
        -   [Importing the SDK](#importing-the-sdk)
        -   [Initializing a DEX](#initializing-a-dex)
            -   [KongSwap](#kongswap)
            -   [ICPSwap](#icpswap)
        -   [Listing Tokens](#listing-tokens)
            -   [KongSwap](#kongswap-1)
            -   [ICPSwap](#icpswap-1)
        -   [Listing Pools](#listing-pools)
            -   [KongSwap](#kongswap-2)
            -   [ICPSwap](#icpswap-2)
        -   [Getting Pool Information](#getting-pool-information)
            -   [KongSwap](#kongswap-3)
            -   [ICPSwap](#icpswap-3)
        -   [Preparing and Executing a Swap](#preparing-and-executing-a-swap)
            -   [KongSwap](#kongswap-4)
            -   [ICPSwap](#icpswap-4)
        -   [Getting Transaction History](#getting-transaction-history)
            -   [KongSwap](#kongswap-5)
            -   [ICPSwap](#icpswap-5)
    -   [Contributing](#contributing)
    -   [License](#license)

## Usage

### Importing the SDK

```typescript
import { KongSwap, ICPSwap } from "sunbeam-sdk";
```

### Initializing a DEX

#### KongSwap

```typescript
import { HttpAgent } from "@dfinity/agent";
import { KongSwap } from "sunbeam-sdk";

const agent = new HttpAgent({ host: "https://ic0.app" });
const kongSwap = new KongSwap({ agent, address: "your-kongswap-canister-id" });
```

#### ICPSwap

```typescript
import { HttpAgent } from "@dfinity/agent";
import { ICPSwap } from "sunbeam-sdk";

const agent = new HttpAgent({ host: "https://ic0.app" });
const icpSwap = new ICPSwap({ agent });
```

### Listing Tokens

#### KongSwap

```typescript
const tokens = await kongSwap.listTokens();
console.log(tokens);
```

#### ICPSwap

```typescript
const tokens = await icpSwap.listTokens();
console.log(tokens);
```

### Listing Pools

#### KongSwap

```typescript
const pools = await kongSwap.listPools();
console.log(pools);
```

#### ICPSwap

```typescript
const pools = await icpSwap.listPools();
console.log(pools);
```

### Getting Pool Information

#### KongSwap

```typescript
const pool = await kongSwap.getPoolByAddress("pool-address");
if (pool) {
    const poolInfo = pool.getPoolInfo();
    console.log(poolInfo);
}
```

#### ICPSwap

```typescript
const pool = await icpSwap.getPoolByAddress("pool-address");
if (pool) {
    const poolInfo = pool.getPoolInfo();
    console.log(poolInfo);
}
```

### Preparing and Executing a Swap

#### KongSwap

```typescript
const pool = await kongSwap.getPoolByAddress("pool-address");
if (pool) {
    const swapInput = {
        tokenIn: { address: "token-in-address", amountIn: 1000 },
        tokenOut: { address: "token-out-address", amountOut: 900 },
        slippage: 0.5,
    };

    const preparedSwap = await pool.prepareSwap(swapInput);
    console.log(preparedSwap);

    const swapResult = await pool.swap(swapInput);
    console.log(swapResult);
}
```

#### ICPSwap

```typescript
const pool = await icpSwap.getPoolByAddress("pool-address");
if (pool) {
    const swapInput = {
        tokenIn: { address: "token-in-address", amountIn: 1000 },
        tokenOut: { address: "token-out-address", amountOut: 900 },
        slippage: 0.5,
    };

    const preparedSwap = await pool.prepareSwap(swapInput);
    console.log(preparedSwap);

    const swapResult = await pool.swap(swapInput);
    console.log(swapResult);
}
```

### Getting Transaction History

#### KongSwap

```typescript
const transactions = await kongSwap.getTransactions();
console.log(transactions);
```

#### ICPSwap

```typescript
const transactions = await icpSwap.getTransactions();
console.log(transactions);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

```

This README provides an overview of the Sunbeam SDK, including installation instructions, usage examples, and information on contributing and licensing.
```
