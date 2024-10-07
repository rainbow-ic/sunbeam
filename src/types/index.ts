import { HttpAgent } from "@dfinity/agent";
import { Signer } from "@slide-computer/signer";
import { SignerAgent } from "@slide-computer/signer-agent";

export * from "./ISwap";
export * as actors from "./actors";
export * as kongswap from "./KongSwap";
export * as icswap from "./ICPSwap";
export type TokenStandard = "DIP20" | "ICRC1" | "EXT" | "ICRC2" | "ICP";

export type Agent = SignerAgent<Signer> | HttpAgent;
