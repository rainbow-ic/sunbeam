## DexFactory

`DexFactory` is a factory class responsible for creating instances of `DexService` based on the specified decentralized exchange (DEX) type.

### Features

-   **DEX Service Creation**: Creates and returns an instance of `DexService` for the specified DEX type.
-   **Supports Multiple DEX Types**: Currently supports `ICPSwap` with potential for future expansion.

### Usage

To use `DexFactory`, you need to call the static `create` method with the appropriate parameters. Below is an example of how to use `DexFactory`:

```typescript
import { DexFactory } from "./DexFactory";
import { SupportedDEX } from "../constant";
import { HttpAgent } from "@dfinity/agent";

// Create an instance of HttpAgent
const agent = new HttpAgent();

// Create a DexService for ICPSwap
const dexService = DexFactory.create({
    dex: SupportedDEX.ICPSwap,
    initArgs: {
        agent: agent,
    },
});
```

## SwapPoolFactory

`SwapPoolFactory` is a factory class responsible for creating instances of `SwapPoolService` based on the specified decentralized exchange (DEX) type.

### Features

-   **Swap Pool Service Creation**: Creates and returns an instance of `SwapPoolService` for the specified DEX type.
-   **Supports Multiple DEX Types**: Currently supports `ICPSwap` with potential for future expansion.

### Usage

To use `SwapPoolFactory`, you need to call the static `create` method with the appropriate parameters. Below is an example of how to use `SwapPoolFactory`:

```typescript
import { SwapPoolFactory } from "./SwapPoolFactory";
import { SupportedDEX } from "../constant";
import { HttpAgent } from "@dfinity/agent";

// Create an instance of HttpAgent
const agent = new HttpAgent();

// Create a SwapPoolService for ICPSwap
const swapPoolService = SwapPoolFactory.create({
    dex: SupportedDEX.ICPSwap,
    initArgs: {
        agent: agent,
        id: "<pool canister id>",
    },
});
```
