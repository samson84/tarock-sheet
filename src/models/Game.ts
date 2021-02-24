import * as Contract from "./Contract";
import * as Player from "./Player";
import * as Score from "./Score";

type PlayerTypeScore = {
  [Player.TYPE.DECLARER]: Score.Props;
  [Player.TYPE.OPPONENT]: Score.Props;
};
export interface Props {
  contracts: Contract.Props[];
  partyScoreType: PARTY_SCORE_TYPE | null;
  partyBaseScore: number;
  calledTarock: CalledTarockType | null;
  playerTypeScores: PlayerTypeScore;
}

type CalledTarockType =
  | "XX"
  | "XIX"
  | "XVIII"
  | "XVII"
  | "XVI"
  | "XV"
  | "XIV"
  | "XIII"
  | "XII";

export const CALLED_TAROCK: { [K in CalledTarockType]: CalledTarockType } = {
  XX: "XX",
  XIX: "XIX",
  XVIII: "XVIII",
  XVII: "XVII",
  XVI: "XVI",
  XV: "XV",
  XIV: "XIV",
  XIII: "XIII",
  XII: "XII",
};

export enum PARTY_SCORE_TYPE {
  KLOPICZKY = "KLOPICZKY",
  TOOK_THREE = "TOOK_THREE",
  TOOK_TWO = "TOOK_TWO",
  TOOK_ONE = "TOOK_ONE",
  SOLO = "SOLO",
}
export type PartyScoreValue = 0 | 1 | 2 | 3 | 4;

export const isPartyLike = (partyScoreType: PARTY_SCORE_TYPE | null): boolean =>
  partyScoreType === null
    ? false
    : [
        PARTY_SCORE_TYPE.TOOK_THREE,
        PARTY_SCORE_TYPE.TOOK_TWO,
        PARTY_SCORE_TYPE.TOOK_ONE,
        PARTY_SCORE_TYPE.SOLO,
      ].includes(partyScoreType);

export const PARTY_SCORE: { [K in PARTY_SCORE_TYPE]: PartyScoreValue } = {
  [PARTY_SCORE_TYPE.TOOK_THREE]: 1,
  [PARTY_SCORE_TYPE.TOOK_TWO]: 2,
  [PARTY_SCORE_TYPE.TOOK_ONE]: 3,
  [PARTY_SCORE_TYPE.SOLO]: 4,
  [PARTY_SCORE_TYPE.KLOPICZKY]: 0,
};

interface CreateProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  called_tarock?: CalledTarockType;
}
export const create = (props: CreateProps = {}): Props => ({
  contracts: [],
  partyScoreType: props.partyScoreType || null,
  partyBaseScore: 1,
  calledTarock: props.called_tarock || null,
  playerTypeScores: {
    [Player.TYPE.DECLARER]: null,
    [Player.TYPE.OPPONENT]: null,
  },
});

const updateGameWithPlayerTypeScores = (game: Props): Props => {
  const scores = calculatePlayerTypeScores(game);

  return {
    ...game,
    playerTypeScores: { ...scores },
  };
};

export interface UpdateProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  calledTarock?: CalledTarockType | null;
  partyBaseScore?: number;
}
export const update = (updates: UpdateProps) => (game: Props): Props => {
  const partyScoreType =
    updates.partyScoreType === undefined
      ? game.partyScoreType
      : updates.partyScoreType;
  const partyBaseScore =
    updates.partyBaseScore === undefined
      ? game.partyBaseScore
      : updates.partyBaseScore;
  const partyScore =
    partyScoreType === null
      ? null
      : PARTY_SCORE[partyScoreType] * partyBaseScore;
  const contracts =
    partyScore === null
      ? game.contracts
      : game.contracts.map(Contract.updateBidBaseScore(partyScore));

  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: [...contracts],
    ...updates,
  });
};

export const addContractFlipped = (contract: Contract.Props) => (
  game: Props
): Props => addContract(game)(contract);

export const addContract = (game: Props) => (
  contract: Contract.Props
): Props => {
  const partyScore = game?.partyScoreType
    ? PARTY_SCORE[game?.partyScoreType]
    : null;
  const updatedContract = Contract.create({ ...contract, partyScore });
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: [...game.contracts, updatedContract],
  });
};

export const removeContractAt = (game: Props) => (index: number): Props => {
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: game.contracts.filter((_, i) => i !== index),
  });
};

export const removeAllContracts = (game: Props): Props => ({
  ...game,
  contracts: [],
});

export const updateGameContractAt = (game: Props) => (index: number) => (
  updated: Contract.Props
): Props => {
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: game.contracts.map((contract, i) =>
      i === index ? { ...updated } : contract
    ),
  });
};

export const calculatePlayerTypeScores = (game: Props): PlayerTypeScore => {
  return game.contracts.reduce(
    (partyScore, contract) => {
      const score = Contract.calculateContractScore(contract);
      if (score === null) {
        return partyScore;
      }

      const addScore = (
        prevScore: Score.Props,
        score: Score.Props
      ): Score.Props => {
        if (prevScore === null) {
          return score;
        } else {
          return score === null ? prevScore : score + prevScore;
        }
      };

      const taker = contract.taker;
      const another = Player.getOppositeType(taker);

      return {
        ...partyScore,
        [taker]: addScore(partyScore[taker], score),
        [another]: addScore(
          partyScore[another],
          score === null ? null : score * -1
        ),
      };
    },
    {
      [Player.TYPE.DECLARER]: null,
      [Player.TYPE.OPPONENT]: null,
    }
  );
};
