import { PLAYER_TYPE } from "../lib/player";
import {
  BidVariant,
  BID_TYPE,
  canSilent,
  hasVariant,
  getBid,
  getBidScore,
} from "../lib/bid";
import flow from "lodash/fp/flow";
import pick from "lodash/fp/pick";
import isEqual from "lodash/fp/isEqual";
import groupBy from "lodash/fp/groupBy";
import * as gameModel from "./gameModel";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bidType: BID_TYPE;
  bidBaseScore: number | null;
  bidVariant: BidVariant | null;
  contra: ContraMultiplier;
  isWonByTaker: boolean | null;
  taker: PLAYER_TYPE;
  isSilent: boolean;
}

const validate = (contract: Contract): void | undefined => {
  const { isSilent, bidType, bidVariant, contra } = contract;
  const bid = getBid(bidType);
  if (isSilent && !canSilent(bid)) {
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
  partyScore?: gameModel.PartyScoreValue | null;
  taker: PLAYER_TYPE;
  isSilent?: boolean;
  bidVariant?: BidVariant | null;
  isWonByTaker?: boolean | null;
}
export const create = ({
  bidType,
  taker,
  partyScore = null,
  isSilent = false,
  bidVariant = null,
  isWonByTaker = null,
}: CreateContractProps): Contract => {
  const contract = {
    bidType,
    bidVariant,
    contra: 1,
    isSilent,
    isWonByTaker,
    taker,
    bidBaseScore:
      partyScore !== null
        ? flow(getBid, getBidScore(partyScore))(bidType)
        : null,
  };
  validate(contract);
  return contract;
};

export const updateBidBaseScore = (partyScore: number) => (
  contract: Contract
): Contract => ({
  ...contract,
  bidBaseScore: flow(getBid, getBidScore(partyScore))(contract.bidType),
});

export type UpdateContractProps = Partial<
  Pick<
    Contract,
    "taker" | "isWonByTaker" | "isSilent" | "bidVariant" | "contra"
  >
>;
export const update = (updates: UpdateContractProps) => (
  contract: Contract
): Contract => {
  const updated = { ...contract, ...updates };
  validate(updated);
  return updated;
};

export type ContractScore = number | null;
export const calculateContractScore = (contract: Contract): ContractScore => {
  const { isWonByTaker, bidBaseScore, contra, isSilent: silent } = contract;
  if (isWonByTaker === null || bidBaseScore === null) {
    return null;
  }
  const multiplier = silent ? 0.5 : contra;
  const sign = isWonByTaker ? 1 : -1;
  return sign * bidBaseScore * multiplier;
};

export type ContractWithIndex = [Contract, number];
export const withIndices = (contracts: Contract[]): ContractWithIndex[] =>
  contracts.map((contract, index) => [contract, index]);

const PARTY_LIKE_BIDS = [BID_TYPE.PARTY, BID_TYPE.DOUBLE_PARTY, BID_TYPE.VOLAT];
export const filterByPartyLike = (
  contracts: ContractWithIndex[]
): ContractWithIndex[] =>
  contracts.filter(([contract, _]) =>
    PARTY_LIKE_BIDS.includes(contract.bidType)
  );

export const filterByProps = (props: Partial<Contract>) => (
  contracts: ContractWithIndex[]
): ContractWithIndex[] => {
  return contracts.filter(([contract, _]) =>
    flow(pick(Object.keys(props)), isEqual(props))(contract)
  );
};

export const groupByPlayerType = (contracts: ContractWithIndex[]) => {
  const groupped = groupBy(([contract]) => contract.taker)(contracts);
  return {
    [PLAYER_TYPE.DECLARER]: groupped[PLAYER_TYPE.DECLARER] || [],
    [PLAYER_TYPE.OPPONENT]: groupped[PLAYER_TYPE.OPPONENT] || [],
  };
};
