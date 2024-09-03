export interface ISwap {
  quote(): void;
  swap(): void;
  listTokens(): void;
  getLPInfo?(): void;
  addLP?(): void;
}
