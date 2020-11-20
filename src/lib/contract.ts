import { PLAYER_TYPE } from "./player";
import { Bid } from "./bid";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bid: Bid;
  contra: ContraMultiplier;
  win: PLAYER_TYPE | null;
  take: PLAYER_TYPE;
}

export const createContract = (bid: Bid, taker: PLAYER_TYPE): Contract => ({
  bid,
  contra: 1,
  win: null,
  take: taker,
});

export const winContract = (winner: PLAYER_TYPE) => (contract: Contract): Contract => ({
  ...contract,
  win: winner
})

export const contraContract = (contract: Contract) : Contract => ({
  ...contract,
  contra: contract.contra * 2
})