import { Game } from "./game";
import { Player, PlayerScore, PLAYER_TYPE } from "./player";
import fromPairs from "lodash/fp/fromPairs";
import assignWith from "lodash/assignWith";

export type GameScorePerPlayer = { [keyof: string]: PlayerScore };
export const getPlayersScores = (game: Game): GameScorePerPlayer => {
  const opponents = game.opponents.map((p) => [
    p,
    game.scores[PLAYER_TYPE.OPPONENT] || null,
  ]);
  const declarers = game.declarers.map((p) => [
    p,
    game.scores[PLAYER_TYPE.DECLARER] || null,
  ]);
  return {
    ...fromPairs(opponents),
    ...fromPairs(declarers),
  };
};

const defined = (value: any): boolean => value !== undefined && value !== null;

const scoreAssigner = (value1: number | undefined | null, value2: number | undefined | null): number => {
  value1 = defined(value1) ? value1 : 0;
  value2 = defined(value2) ? value2 : 0;

  return (value1 as number) + (value2 as number);
}


export const sumPlayerScores = (
  gameScoreList: GameScorePerPlayer[]
): GameScorePerPlayer => assignWith({}, ...gameScoreList, scoreAssigner);

export const getAllPlayers = (
  gameScoreList: GameScorePerPlayer[]
): Player[] => {
  const players = gameScoreList.reduce((players, gameScorePerPlayer) => {
    Object.keys(gameScorePerPlayer).forEach((p) => players.add(p));
    return players;
  }, new Set<Player>());
  return [...players.values()];
};
