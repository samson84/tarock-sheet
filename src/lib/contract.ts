import { PLAYER_TYPE } from "./player";
import { Bid, BidVariant } from "./bid";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bid: Bid;
  bidVariant: BidVariant | null,
  contra: ContraMultiplier;
  winner: PLAYER_TYPE | null;
  taker: PLAYER_TYPE;
  silent: boolean;
}

export const createContract = (
  bid: Bid,
  taker: PLAYER_TYPE,
  silent?: boolean,
  bidVariant?: BidVariant
): Contract => ({
  bid,
  bidVariant: bidVariant || null,
  contra: 1,
  silent: silent || false,
  winner: null,
  taker: taker,
});

export const winContract = (winner: PLAYER_TYPE) => (
  contract: Contract
): Contract => ({
  ...contract,
  winner: winner,
});

export const contraContract = (contract: Contract): Contract => ({
  ...contract,
  contra: contract.contra * 2,
});
