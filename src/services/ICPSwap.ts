import { Actor } from "@dfinity/agent";
import { ISwap } from "../types/ISwap";

export class ICPSwap implements ISwap {
  private actor: Actor;

  constructor(actor: Actor) {
    this.actor = actor;
  }
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
