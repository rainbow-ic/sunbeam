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
import { KongSwap, ICPSwap } from "@rainbow-ic/sunbeam";
```

### Initializing a DEX

#### KongSwap

```typescript
import { HttpAgent } from "@dfinity/agent";
import { KongSwap } from "@rainbow-ic/sunbeam";

const agent = new HttpAgent({ host: "https://ic0.app" });
const kongSwap = new KongSwap({ agent });
```

#### ICPSwap

```typescript
import { HttpAgent } from "@dfinity/agent";
import { ICPSwap } from "@rainbow-ic/sunbeam";

const agent = new HttpAgent({ host: "https://ic0.app" });
const icpSwap = new ICPSwap({ agent });
```

### Listing Tokens

#### KongSwap

https://github.com/rainbow-ic/sunbeam-example/blob/main/src/list_pool_and_token.ts#L8

#### ICPSwap

https://github.com/rainbow-ic/sunbeam-example/blob/main/src/list_pool_and_token.ts#L8

### Listing Pools

#### KongSwap

https://github.com/rainbow-ic/sunbeam-example/blob/main/src/list_pool_and_token.ts#L29

#### ICPSwap

https://github.com/rainbow-ic/sunbeam-example/blob/main/src/list_pool_and_token.ts#L54

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

[code example](https://github.com/rainbow-ic/sunbeam-example/blob/main/src/kong-swap.ts#L126)

#### ICPSwap

[code example](https://github.com/rainbow-ic/sunbeam-example/blob/main/src/swap-test.ts#L62)

### Getting Transaction History

#### KongSwap

```typescript
const transactions = await kongSwap.getTransactions();
console.log(transactions);
```

#### ICPSwap

This is not implement yet

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

```

This README provides an overview of the including installation instructions, usage examples, and information on contributing and licensing.
```
