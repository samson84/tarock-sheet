import { Game } from "../models/gameModel";
import {
  PlayerList,
  PlayerScore,
  PLAYER_TYPE,
  getPlayerNumberByType,
  PlayerListObject,
  Player,
  updatePlayer,
} from "./player";
import assignWith from "lodash/fp/assignWith";
import { isEqual } from "lodash";

const getScore = (players: PlayerList) => (
  game: Game
): [PlayerScore, PlayerScore] => {
  const [numberOfDeclarers, numberOfOpponents] = getPlayerNumberByType(players);
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

export const getCurrentScoreForPlayers = (game: Game) => (
  players: PlayerList
): PlayerList => {
  return players.map((player) => {
    const [declarersScore, opponentsScore] = getScore(players)(game);
    const score = {
      [PLAYER_TYPE.OPPONENT]: opponentsScore,
      [PLAYER_TYPE.DECLARER]: declarersScore,
    };
    return {
      ...player,
      currentScore: player.type === null ? null : score[player.type],
    };
  });
};

export const isReadyForSave = (players: PlayerList) => (
  game: Game
): boolean => {
  const numbers = getPlayerNumberByType(players);
  const playerNumberValid =
    isEqual(numbers, [1, 3]) ||
    isEqual(numbers, [2, 2]) ||
    isEqual(numbers, [3, 1]);
  const gameScoreValid =
    game.scores[PLAYER_TYPE.DECLARER] !== null &&
    game.scores[PLAYER_TYPE.OPPONENT] !== null;
  return playerNumberValid && gameScoreValid;
};

const defined = (value: any): boolean =>
  Boolean(value !== undefined && value !== null);

const scoreSumAssigner = (score: number | undefined, player: Player) => {
  const left = defined(score) ? score : 0;
  const right = defined(player.currentScore) ? player.currentScore : 0;
  return (left as number) + (right as number);
};

export type PlayerScores = { [key: string]: number };

export const sumPlayerScores = (
  playerListObjects: PlayerListObject[]
): PlayerScores => {
  return playerListObjects.reduce(
    (scores, playerListObject) =>
      assignWith(scoreSumAssigner)(scores, playerListObject),
    {} as PlayerScores
  );
};

export const assignScoresToPlayers = (players: PlayerList) => (
  scores: PlayerScores
): PlayerList =>
  players.map((player) =>
    scores[player.id] === undefined
      ? player
      : updatePlayer({ score: scores[player.id] })(player)
  );
