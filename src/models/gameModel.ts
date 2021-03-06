import * as contractModel from "./contractModel";
import * as playerModel from "./playerModel";
import { Score } from "./scoreModel";

type PlayerTypeScore = {
  [playerModel.PLAYER_TYPE.DECLARER]: Score;
  [playerModel.PLAYER_TYPE.OPPONENT]: Score;
};
export interface Game {
  contracts: contractModel.Contract[];
  partyScoreType: PARTY_SCORE_TYPE | null;
  partyBaseScore: number;
  called_tarock: CalledTarockType | null;
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

interface CreateGameProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  called_tarock?: CalledTarockType;
}
export const create = (props: CreateGameProps = {}): Game => ({
  contracts: [],
  partyScoreType: props.partyScoreType || null,
  partyBaseScore: 1,
  called_tarock: props.called_tarock || null,
  playerTypeScores: {
    [playerModel.PLAYER_TYPE.DECLARER]: null,
    [playerModel.PLAYER_TYPE.OPPONENT]: null,
  },
});

const updateGameWithPlayerTypeScores = (game: Game): Game => {
  const scores = calculatePlayerTypeScores(game);

  return {
    ...game,
    playerTypeScores: { ...scores },
  };
};

export interface UpdateGameProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  called_tarock?: CalledTarockType | null;
  partyBaseScore?: number;
}
export const update = (updates: UpdateGameProps) => (game: Game): Game => {
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
      : game.contracts.map(contractModel.updateBidBaseScore(partyScore));

  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: [...contracts],
    ...updates,
  });
};

export const addContractFlipped = (contract: contractModel.Contract) => (
  game: Game
): Game => addContract(game)(contract);

export const addContract = (game: Game) => (
  contract: contractModel.Contract
): Game => {
  const partyScore = game?.partyScoreType
    ? PARTY_SCORE[game?.partyScoreType]
    : null;
  const updatedContract = contractModel.create({ ...contract, partyScore });
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: [...game.contracts, updatedContract],
  });
};

export const removeContractAt = (game: Game) => (index: number): Game => {
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: game.contracts.filter((_, i) => i !== index),
  });
};

export const removeAllContracts = (game: Game): Game => ({
  ...game,
  contracts: [],
});

export const updateGameContractAt = (game: Game) => (index: number) => (
  updated: contractModel.Contract
): Game => {
  return updateGameWithPlayerTypeScores({
    ...game,
    contracts: game.contracts.map((contract, i) =>
      i === index ? { ...updated } : contract
    ),
  });
};

export const calculatePlayerTypeScores = (game: Game): PlayerTypeScore => {
  return game.contracts.reduce(
    (partyScore, contract) => {
      const score = contractModel.calculateContractScore(contract);
      if (score === null) {
        return partyScore;
      }

      const addScore = (prevScore: Score, score: Score): Score => {
        if (prevScore === null) {
          return score;
        } else {
          return score === null ? prevScore : score + prevScore;
        }
      };

      const taker = contract.taker;
      const another = playerModel.getOppositeType(taker);

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
      [playerModel.PLAYER_TYPE.DECLARER]: null,
      [playerModel.PLAYER_TYPE.OPPONENT]: null,
    }
  );
};
