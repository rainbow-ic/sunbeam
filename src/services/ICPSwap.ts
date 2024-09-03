import { ISwap } from "../types/ISwap";

export class ICPSwap implements ISwap {
  quote(): void {
    throw new Error("Method not implemented.");
  }
  swap(): void {
    throw new Error("Method not implemented.");
  }
  listTokens(): void {
    throw new Error("Method not implemented.");
  }
  getLPInfo?(): void {
    throw new Error("Method not implemented.");
  }
  addLP?(): void {
    throw new Error("Method not implemented.");
  }
}
