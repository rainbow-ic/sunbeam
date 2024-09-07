## DexService

`DexService` is a service class that provides an interface for interacting with different decentralized exchanges (DEX) through a strategy pattern. It delegates the actual implementation of DEX operations to the strategy provided during instantiation.

### Features

-   **Strategy Pattern**: Uses a strategy pattern to support multiple DEX implementations.
-   **Token Listing**: Provides a method to list tokens available on the DEX.

### Usage

To use `DexService`, you need to instantiate it with a specific DEX strategy that implements the `IDex` interface. Below is an example of how to use `DexService`:
