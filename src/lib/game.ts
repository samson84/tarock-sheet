import {
  calculateContract,
  Contract,
  updateBidBaseScore,
  createContract,
} from "./contract";
import {
  getAnotherPlayerType,
  Player,
  PLAYER_TYPE,
  PlayerScore,
} from "./player";
import isEqual from "lodash/fp/isEqual";

type GameScore = {
  [PLAYER_TYPE.DECLARER]: PlayerScore;
  [PLAYER_TYPE.OPPONENT]: PlayerScore;
};
export interface Game {
  contracts: Contract[];
  declarers: Player[];
  opponents: Player[];
  partyScoreType: PARTY_SCORE_TYPE | null;
  partyBaseScore: number;
  called_tarock: CalledTarockType | null;
  scores: GameScore;
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

export const isPartyLike = (partyScoreType: PARTY_SCORE_TYPE): boolean =>
  [
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
export const createGame = (props: CreateGameProps = {}): Game => ({
  contracts: [],
  declarers: [],
  opponents: [],
  partyScoreType: props.partyScoreType || null,
  partyBaseScore: 1,
  called_tarock: props.called_tarock || null,
  scores: {
    [PLAYER_TYPE.DECLARER]: null,
    [PLAYER_TYPE.OPPONENT]: null,
  },
});

const updateGameWithScores = (game: Game): Game => {
  const scores = calculateGame(game);

  return {
    ...game,
    scores: { ...scores },
  };
};

export interface UpdateGameProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  called_tarock?: CalledTarockType | null;
  partyBaseScore?: number;
}
export const updateGame = (updates: UpdateGameProps) => (game: Game): Game => {
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
      : game.contracts.map(updateBidBaseScore(partyScore));

  return updateGameWithScores({
    ...game,
    contracts: [...contracts],
    ...updates,
  });
};

export const validatePlayersInGame = (game: Game): boolean => {
  const numberOfPlayers = [game.declarers.length, game.opponents.length];
  const comparer = isEqual(numberOfPlayers);
  return comparer([1, 3]) || comparer([2, 2]) || comparer([3, 1]);
};

export const addPlayer = (player: Player, type: PLAYER_TYPE) => (
  game: Game
): Game => {
  const key = type === PLAYER_TYPE.DECLARER ? "declarers" : "opponents";

  const otherKey = type === PLAYER_TYPE.OPPONENT ? "declarers" : "opponents";

  if (game[key].includes(player)) {
    return { ...game };
  }

  return {
    ...game,
    [key]: [...game[key], player],
    [otherKey]: game[otherKey].filter((p) => p !== player),
  };
};

export const removePlayer = (player: Player) => (game: Game): Game => ({
  ...game,
  opponents: game.opponents.filter((p) => p !== player),
  declarers: game.declarers.filter((p) => p !== player),
});

export const addContractFlipped = (contract: Contract) => (game: Game): Game =>
  addContract(game)(contract);

export const addContract = (game: Game) => (contract: Contract): Game => {
  const partyScore = game?.partyScoreType
    ? PARTY_SCORE[game?.partyScoreType]
    : null;
  const updatedContract = createContract({ ...contract, partyScore });
  return updateGameWithScores({
    ...game,
    contracts: [...game.contracts, updatedContract],
  });
};

export const removeContract = (game: Game) => (index: number): Game => {
  return updateGameWithScores({
    ...game,
    contracts: game.contracts.filter((_, i) => i !== index),
  });
};

export const removeAllContract = (game: Game): Game => ({
  ...game,
  contracts: [],
});

export const updateGameContract = (game: Game) => (index: number) => (
  updated: Contract
): Game => {
  return updateGameWithScores({
    ...game,
    contracts: game.contracts.map((contract, i) =>
      i === index ? { ...updated } : contract
    ),
  });
};

export const calculateGame = (game: Game): GameScore => {
  return game.contracts.reduce(
    (partyScore, contract) => {
      const score = calculateContract(contract);
      if (score === null) {
        return partyScore;
      }

      const addScore = (
        prevScore: PlayerScore,
        score: PlayerScore
      ): PlayerScore => {
        if (prevScore === null) {
          return score;
        } else {
          return score === null ? prevScore : score + prevScore;
        }
      };

      const taker = contract.taker;
      const another = getAnotherPlayerType(taker);

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
      [PLAYER_TYPE.DECLARER]: null,
      [PLAYER_TYPE.OPPONENT]: null,
    }
  );
};
