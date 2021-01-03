import { BID_TYPE } from "./bid";
import {
  calculateContract,
  Contract,
  ContractWithIndex,
  filterByPartyLike,
  findMaxAbsScore,
  groupByPlayerType,
  updateBidBaseScore,
  updateContract,
  withIndices,
} from "./contract";
import { getAnotherPlayerType, Player, PLAYER_TYPE } from "./player";
import flow from "lodash/fp/flow";

export interface Game {
  contracts: Contract[];
  declarers: Player[];
  opponents: Player[];
  partyScoreType: PARTY_SCORE_TYPE | null;
  called_tarock: CalledTarockType | null;
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
  called_tarock: props.called_tarock || null,
});

export interface UpdateGameProps {
  partyScoreType?: PARTY_SCORE_TYPE;
  called_tarock?: CalledTarockType | null;
}
export const updateGame = (updates: UpdateGameProps) => (game: Game): Game => {
  const contracts =
    updates.partyScoreType === undefined
      ? game.contracts
      : game.contracts.map(
          updateBidBaseScore(PARTY_SCORE[updates.partyScoreType])
        );

  return {
    ...game,
    contracts: [...contracts],
    ...updates,
  };
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

export const addContract = (game: Game) => (contract: Contract): Game => ({
  ...game,
  contracts: [...game.contracts, contract],
});

export const removeContract = (game: Game) => (index: number): Game => ({
  ...game,
  contracts: game.contracts.filter((_, i) => i !== index),
});

export const updateGameContract = (game: Game) => (index: number) => (
  updated: Contract
): Game => ({
  ...game,
  contracts: game.contracts.map((contract, i) =>
    i === index ? { ...updated } : contract
  ),
});

type ValidationRule = (game: Game) => Contract[];
const handleKlopiczky: ValidationRule = (game) =>
  game.contracts.map((contract) =>
    updateContract({
      validInFinalScore:
        game.partyScoreType === PARTY_SCORE_TYPE.KLOPICZKY
          ? contract.bidType === BID_TYPE.KLOPICZKY
          : contract.bidType !== BID_TYPE.KLOPICZKY,
    })(contract)
  );

const handlePartyLike: ValidationRule = (game) => {
  const partyLike = flow(withIndices, filterByPartyLike)(game.contracts);

  const byTakerType = groupByPlayerType(partyLike);
  const opponents = byTakerType[PLAYER_TYPE.OPPONENT] as ContractWithIndex[];
  const declarers = byTakerType[PLAYER_TYPE.DECLARER] as ContractWithIndex[];
  if (opponents.length < 2 && declarers.length < 2) {
    return game.contracts;
  }
  const updateValidInFinalScore = (
    contracts: ContractWithIndex[]
  ): ContractWithIndex[] => {
    const [maxScore, maxIndex] = findMaxAbsScore(contracts);
    if (maxScore === null) {
      return [];
    }
    return contracts.map(([contract, index]) => [
      updateContract({ validInFinalScore: index === maxIndex })(contract),
      index,
    ]);
  };
  const updates = [
    ...updateValidInFinalScore(opponents),
    ...updateValidInFinalScore(declarers),
  ];
  const flip = (contracts: [unknown, unknown][]) =>
    contracts.map(([a, b]) => [b, a]);
  const updateMapper = flow(flip, Object.fromEntries)(updates);
  return game.contracts.map((contract, index) => {
    return updateMapper[index] === undefined ? contract : updateMapper[index];
  });
};

const VALIDATION_RULES: ValidationRule[] = [handleKlopiczky, handlePartyLike];
export const updateValidations = (game: Game): Game => {
  // if the game is klopiczky it has higher prioriy than a party game,
  // otherwise it is reversed
  if (game.partyScoreType === PARTY_SCORE_TYPE.KLOPICZKY) {
    game.contracts = handlePartyLike(game);
    game.contracts = handleKlopiczky(game);
  } else {
    game.contracts = handleKlopiczky(game);
    game.contracts = handlePartyLike(game);
  }
  return { ...game };
};

type PlayerScore = number | null;
export interface GameScore {
  [PLAYER_TYPE.DECLARER]: PlayerScore;
  [PLAYER_TYPE.OPPONENT]: PlayerScore;
}
export const calculateGame = (game: Game): GameScore => {
  return game.contracts.reduce(
    (partyScore, contract) => {
      if (!contract.validInFinalScore) {
        return partyScore;
      }
      const score = calculateContract(contract);
      if (score === null) {
        return partyScore;
      }

      const addScore = (prevScore: PlayerScore, score: PlayerScore): PlayerScore => {
        if (prevScore === null) {return score}
        else {
          return score === null ? prevScore : score + prevScore
        }
      }

      const taker = contract.taker;
      const another = getAnotherPlayerType(taker);

      return {
        ...partyScore,
        [taker]: addScore(partyScore[taker], score),
        [another]: addScore(partyScore[another], score === null ? null: score * -1) 
      };
    },
    {
      [PLAYER_TYPE.DECLARER]: null,
      [PLAYER_TYPE.OPPONENT]: null,
    }
  );
};
