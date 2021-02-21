import * as gameModel from "../models/gameModel";
import * as playerModel from "../models/playerModel";
import { Score } from "../models/scoreModel";
import assignWith from "lodash/fp/assignWith";
import { isEqual } from "lodash";

const getScore = (players: playerModel.PlayerList) => (
  game: gameModel.Game
): [Score, Score] => {
  const [
    numberOfDeclarers,
    numberOfOpponents,
  ] = playerModel.getPlayerNumberByType(players);
  const opponentsGameScore =
    game.playerTypeScores[playerModel.PLAYER_TYPE.OPPONENT];
  const declarersGameScore =
    game.playerTypeScores[playerModel.PLAYER_TYPE.DECLARER];
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

export const getCurrentScoreForPlayers = (game: gameModel.Game) => (
  players: playerModel.PlayerList
): playerModel.PlayerList => {
  return players.map(
    (player: playerModel.Player): playerModel.Player => {
      const [declarersScore, opponentsScore] = getScore(players)(game);
      const score = {
        [playerModel.PLAYER_TYPE.OPPONENT]: opponentsScore,
        [playerModel.PLAYER_TYPE.DECLARER]: declarersScore,
      };
      return {
        ...player,
        gameScore: player.type === null ? null : score[player.type],
      };
    }
  );
};

export const isReadyForSave = (players: playerModel.PlayerList) => (
  game: gameModel.Game
): boolean => {
  const numbers = playerModel.getPlayerNumberByType(players);
  const playerNumberValid =
    isEqual(numbers, [1, 3]) ||
    isEqual(numbers, [2, 2]) ||
    isEqual(numbers, [3, 1]);
  const gameScoreValid =
    game.playerTypeScores[playerModel.PLAYER_TYPE.DECLARER] !== null &&
    game.playerTypeScores[playerModel.PLAYER_TYPE.OPPONENT] !== null;
  return playerNumberValid && gameScoreValid;
};

const defined = (value: any): boolean =>
  Boolean(value !== undefined && value !== null);

const scoreSumAssigner = (
  gameScore: number | undefined,
  player: playerModel.Player
) => {
  const left = defined(gameScore) ? gameScore : 0;
  const right = defined(player.gameScore) ? player.gameScore : 0;
  return (left as number) + (right as number);
};

export type PlayerScores = { [key: string]: number };

export const sumPlayerScores = (
  playerListObjects: playerModel.PlayerListObject[]
): PlayerScores => {
  return playerListObjects.reduce(
    (scores, playerListObject) =>
      assignWith(scoreSumAssigner)(scores, playerListObject),
    {} as PlayerScores
  );
};

export const assignScoresToPlayers = (players: playerModel.PlayerList) => (
  sessionScores: PlayerScores
): playerModel.PlayerList =>
  players.map((player) =>
    sessionScores[player.id] === undefined
      ? player
      : playerModel.update({ sessionScore: sessionScores[player.id] })(player)
  );
