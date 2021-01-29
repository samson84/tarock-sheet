import { Game } from "./game";
import { Player, PlayerScore, PLAYER_TYPE } from "./player";
import fromPairs from "lodash/fp/fromPairs";
import assignWith from "lodash/assignWith";
import mapValues from "lodash/fp/mapValues";

const scorer = (game: Game): [PlayerScore, PlayerScore] => {
  const numberOfOpponents = game.opponents.length;
  const numberOfDeclarers = game.declarers.length;
  const opponentsGameScore = game.scores[PLAYER_TYPE.OPPONENT];
  const declarersGameScore = game.scores[PLAYER_TYPE.DECLARER];
  if (opponentsGameScore === null || declarersGameScore === null) {
    return [null, null];
  }
  if (numberOfOpponents === 2 && numberOfDeclarers === 2) {
    return [declarersGameScore, opponentsGameScore];
  }
  if (numberOfOpponents === 3 && numberOfDeclarers === 1) {
    return [declarersGameScore * 3, opponentsGameScore];
  }
  if (numberOfOpponents === 1 && numberOfDeclarers === 3) {
    return [declarersGameScore, opponentsGameScore * 3];
  }
  return [null, null];
};

export type GameScorePerPlayer = { [keyof: string]: PlayerScore };
export const getPlayersScores = (game: Game): GameScorePerPlayer => {
  const [declarerPlayersScore, opponentPlayersScore] = scorer(game);
  const opponents = game.opponents.map((p) => [p, opponentPlayersScore]);
  const declarers = game.declarers.map((p) => [p, declarerPlayersScore]);
  return {
    ...fromPairs(opponents),
    ...fromPairs(declarers),
  };
};

const defined = (value: any): boolean => value !== undefined && value !== null;

const scoreAssigner = (
  value1: number | undefined | null,
  value2: number | undefined | null
): number => {
  value1 = defined(value1) ? value1 : 0;
  value2 = defined(value2) ? value2 : 0;

  return (value1 as number) + (value2 as number);
};

const baseScoreAdder = (baseScore: number) => (score: number | null) => {
  score = defined(score) ? score : 0;
  return (score as number) + baseScore;
};

export const addBaseScore = (baseScore: number) => (
  sumPlayersScore: GameScorePerPlayer
): GameScorePerPlayer => mapValues(baseScoreAdder(baseScore))(sumPlayersScore);

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
