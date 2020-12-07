import { Contract } from "./contract";
import { Player, PLAYER_TYPE } from "./player";

export interface Game {
  contracts: Contract[];
  declarers: Player[];
  opponents: Player[];
  party_score: PartyScoreValue;
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

export type PartyScoreType =
  | "KLOPICZKY"
  | "TOOK_THREE"
  | "TOOK_TWO"
  | "TOOK_ONE"
  | "SOLO";
export type PartyScoreValue = 0 | 1 | 2 | 3 | 4;

export const PARTY_SCORE: { [K in PartyScoreType]: PartyScoreValue } = {
  TOOK_THREE: 1,
  TOOK_TWO: 2,
  TOOK_ONE: 3,
  SOLO: 4,
  KLOPICZKY: 0
};

interface CreateGameProps {
  party_score?: PartyScoreValue;
  called_tarock?: CalledTarockType;
}
export const createGame = (props: CreateGameProps = {}): Game => ({
  contracts: [],
  declarers: [],
  opponents: [],
  party_score:
    props.party_score === undefined
      ? PARTY_SCORE.TOOK_THREE
      : props.party_score,
  called_tarock: props.called_tarock || null,
  ...props,
});

export interface UpdateGameProps {
  party_score?: PartyScoreValue;
  called_tarock?: CalledTarockType | null;
}
export const updateGame = (updates: UpdateGameProps) => (game: Game): Game => ({
  ...game,
  ...updates,
});

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

export const addContract = (contract: Contract) => (game: Game): Game => ({
  ...game,
  contracts: [...game.contracts, contract],
});

export const removeContract = (index: number) => (game: Game): Game => ({
  ...game,
  contracts: game.contracts.filter((_, i) => i !== index),
});
