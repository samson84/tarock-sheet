import * as playerModel from "./playerModel";
import * as scoreModel from "./Score";
import * as Bid from "./Bid";
import flow from "lodash/fp/flow";
import * as gameModel from "./gameModel";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type ContraMultiplier = number;
export interface Contract {
  bidType: Bid.TYPE;
  bidBaseScore: number | null;
  bidVariant: Bid.Variant | null;
  contra: ContraMultiplier;
  isWonByTaker: boolean | null;
  taker: playerModel.PLAYER_TYPE;
  isSilent: boolean;
}

const validate = (contract: Contract): void | undefined => {
  const { isSilent, bidType, bidVariant, contra } = contract;
  const bid = Bid.getByType(bidType);
  if (isSilent && !Bid.canSilent(bid)) {
    throw new Error(`${bid.type} can not be silent.`);
  }
  if (bidVariant && !Bid.hasVariant(bidVariant)(bid)) {
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
  bidType: Bid.TYPE;
  partyScore?: gameModel.PartyScoreValue | null;
  taker: playerModel.PLAYER_TYPE;
  isSilent?: boolean;
  bidVariant?: Bid.Variant | null;
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
        ? flow(Bid.getByType, Bid.calculateScore(partyScore))(bidType)
        : null,
  };
  validate(contract);
  return contract;
};

export const updateBidBaseScore = (partyScore: number) => (
  contract: Contract
): Contract => ({
  ...contract,
  bidBaseScore: flow(
    Bid.getByType,
    Bid.calculateScore(partyScore)
  )(contract.bidType),
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

export const calculateContractScore = (
  contract: Contract
): scoreModel.Props => {
  const { isWonByTaker, bidBaseScore, contra, isSilent: silent } = contract;
  if (isWonByTaker === null || bidBaseScore === null) {
    return null;
  }
  const multiplier = silent ? 0.5 : contra;
  const sign = isWonByTaker ? 1 : -1;
  return sign * bidBaseScore * multiplier;
};
