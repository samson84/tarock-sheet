import { PLAYER_TYPE } from "./player";
import { BidVariant, BID_TYPE, canSilent, hasVariant, getBid } from "./bid";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bidType: BID_TYPE;
  bidVariant: BidVariant | null;
  contra: ContraMultiplier;
  winner: PLAYER_TYPE | null;
  taker: PLAYER_TYPE;
  silent: boolean;
}

const validateContract = (contract: Contract): void | undefined => {
  const { silent, bidType, bidVariant } = contract;
  const bid = getBid(bidType);
  if (silent && !canSilent(bid)) {
    throw new Error(`${bid.type} can not be silent.`);
  }
  if (bidVariant && !hasVariant(bidVariant)(bid)) {
    throw new Error(`${bid.type} does not have ${bidVariant} variant.`);
  }
};

interface CreateContractProps {
  bidType: BID_TYPE;
  taker: PLAYER_TYPE;
  silent?: boolean;
  bidVariant?: BidVariant | null;
};
export const createContract = ({
  bidType,
  taker,
  silent = false,
  bidVariant = null,
}: CreateContractProps): Contract => {
  const contract = {
    bidType,
    bidVariant,
    contra: 1,
    silent,
    winner: null,
    taker,
  };
  validateContract(contract);
  return contract;
};

interface UpdateContractProps {
  bidType?: BID_TYPE;
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
