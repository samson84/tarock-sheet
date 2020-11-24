import { PLAYER_TYPE } from "./player";
import { Bid, BidVariant, canSilent, hasVariant } from "./bid";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bid: Bid;
  bidVariant: BidVariant | null;
  contra: ContraMultiplier;
  winner: PLAYER_TYPE | null;
  taker: PLAYER_TYPE;
  silent: boolean;
}

const validateContract = (contract: Contract): void | undefined => {
  const { silent, bid, bidVariant } = contract;
  if (silent && !canSilent(bid)) {
    throw new Error(`${bid.type} can not be silent.`);
  }
  if (bidVariant && !hasVariant(bidVariant)(bid)) {
    throw new Error(`${bid.type} does not have ${bidVariant} variant.`);
  }
};

type CreateContractProps = {
  bid: Bid;
  taker: PLAYER_TYPE;
  silent?: boolean;
  bidVariant?: BidVariant | null;
};
export const createContract = ({
  bid,
  taker,
  silent = false,
  bidVariant = null,
}: CreateContractProps): Contract => {
  const contract = {
    bid,
    bidVariant,
    contra: 1,
    silent,
    winner: null,
    taker,
  };
  validateContract(contract);
  return contract;
};

type UpdateContractProps = {
  bid?: Bid;
  taker?: PLAYER_TYPE;
  winner?: PLAYER_TYPE;
  silent?: boolean;
  bidVariant?: BidVariant;
};
export const updateContract = (updates: UpdateContractProps) => (
  contract: Contract
) => {
  const updated = { ...contract, ...updates };
  validateContract(updated);
  return updated;
};

export const contraContract = (contract: Contract): Contract => ({
  ...contract,
  contra: contract.contra * 2,
});
