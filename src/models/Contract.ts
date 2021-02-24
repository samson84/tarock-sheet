import * as Player from "./Player";
import * as Score from "./Score";
import * as Bid from "./Bid";
import flow from "lodash/fp/flow";
import * as Game from "./Game";

const CONTRA_NAMES = ["None", "Contra", "Recontra", "Subcontra", "Mortcontra"];

type Multiplier = number;
export interface Props {
  bidType: Bid.TYPE;
  contractBaseScore: number | null;
  bidVariant: Bid.Variant | null;
  contra: Multiplier;
  isWonByTaker: boolean | null;
  taker: Player.TYPE;
  isSilent: boolean;
}

const validate = (contract: Props): void | undefined => {
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

export interface CreateProps {
  bidType: Bid.TYPE;
  partyScore?: Game.PartyScoreValue | null;
  taker: Player.TYPE;
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
}: CreateProps): Props => {
  const contract = {
    bidType,
    bidVariant,
    contra: 1,
    isSilent,
    isWonByTaker,
    taker,
    contractBaseScore:
      partyScore !== null
        ? flow(Bid.getByType, Bid.calculateScore(partyScore))(bidType)
        : null,
  };
  validate(contract);
  return contract;
};

export const updateContractBaseScore = (partyScore: number) => (
  contract: Props
): Props => ({
  ...contract,
  contractBaseScore: flow(
    Bid.getByType,
    Bid.calculateScore(partyScore)
  )(contract.bidType),
});

export type UpdateProps = Partial<
  Pick<Props, "taker" | "isWonByTaker" | "isSilent" | "bidVariant" | "contra">
>;
export const update = (updates: UpdateProps) => (contract: Props): Props => {
  const updated = { ...contract, ...updates };
  validate(updated);
  return updated;
};

export const calculateContractScore = (contract: Props): Score.Props => {
  const {
    isWonByTaker,
    contractBaseScore,
    contra,
    isSilent: silent,
  } = contract;
  if (isWonByTaker === null || contractBaseScore === null) {
    return null;
  }
  const multiplier = silent ? 0.5 : contra;
  const sign = isWonByTaker ? 1 : -1;
  return sign * contractBaseScore * multiplier;
};
