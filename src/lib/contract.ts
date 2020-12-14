import { PLAYER_TYPE } from "./player";
import {
  BidVariant,
  BID_TYPE,
  canSilent,
  hasVariant,
  getBid,
  getBidScore,
} from "./bid";
import flow from "lodash/fp/flow";
import { PartyScoreValue } from "./game";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bidType: BID_TYPE;
  bidBaseScore: number;
  bidVariant: BidVariant | null;
  contra: ContraMultiplier;
  winByTaker: boolean | null;
  taker: PLAYER_TYPE;
  silent: boolean;
}

const validateContract = (contract: Contract): void | undefined => {
  const { silent, bidType, bidVariant, contra } = contract;
  const bid = getBid(bidType);
  if (silent && !canSilent(bid)) {
    throw new Error(`${bid.type} can not be silent.`);
  }
  if (bidVariant && !hasVariant(bidVariant)(bid)) {
    throw new Error(`${bid.type} does not have ${bidVariant} variant.`);
  }
  const isPowerOfTwo = Math.log2(contra) % 1 === 0;
  if (!isPowerOfTwo) {
    throw new Error(`Contra must be power of two, but ${contra} given.`);
  }
  if (contra < 1) {
    throw new Error(`Contra must be greater than 1, but ${contra} given.`);
  }
};

export interface CreateContractProps {
  bidType: BID_TYPE;
  partyScore: PartyScoreValue;
  taker: PLAYER_TYPE;
  silent?: boolean;
  bidVariant?: BidVariant | null;
}
export const createContract = ({
  bidType,
  taker,
  partyScore,
  silent = false,
  bidVariant = null,
}: CreateContractProps): Contract => {
  const contract = {
    bidType,
    bidVariant,
    contra: 1,
    silent,
    winByTaker: null,
    taker,
    bidBaseScore: flow(getBid, getBidScore(partyScore))(bidType),
  };
  validateContract(contract);
  return contract;
};

export const updatebidBaseScore = (partyScore: PartyScoreValue) => (
  contract: Contract
): Contract => ({
  ...contract,
  bidBaseScore: flow(getBid, getBidScore(partyScore))(contract.bidType)
});

export type UpdateContractProps = Partial<
  Pick<Contract, "taker" | "winByTaker" | "silent" | "bidVariant" | "contra">
>;
export const updateContract = (updates: UpdateContractProps) => (
  contract: Contract
): Contract => {
  const updated = { ...contract, ...updates };
  validateContract(updated);
  return updated;
};
