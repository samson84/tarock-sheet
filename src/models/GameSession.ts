import * as Game from "./Game";
import * as playerModel from "./playerModel";
import * as playerListModel from "./playerListModel";
import * as scoreModel from "./Score";
import assignWith from "lodash/fp/assignWith";
import { isEqual } from "lodash";

const calculateScoreByPlayerType = (players: playerListModel.PlayerList) => (
  game: Game.Props
): [scoreModel.Props, scoreModel.Props] => {
  const [numberOfDeclarers, numberOfOpponents] = playerListModel.countByType(
    players
  );
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

export const mapGameScoreToPlayers = (game: Game.Props) => (
  players: playerListModel.PlayerList
): playerListModel.PlayerList => {
  return players.map(
    (player: playerModel.Player): playerModel.Player => {
      const [declarersScore, opponentsScore] = calculateScoreByPlayerType(
        players
      )(game);
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

export const isReadyForSave = (players: playerListModel.PlayerList) => (
  game: Game.Props
): boolean => {
  const numbers = playerListModel.countByType(players);
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

export type GameSessionScore = { [key: string]: number };

export const calculateGameSessionScores = (
  playerListObjects: playerListModel.PlayerListObject[]
): GameSessionScore => {
  return playerListObjects.reduce(
    (scores, playerListObject) =>
      assignWith(scoreSumAssigner)(scores, playerListObject),
    {} as GameSessionScore
  );
};

export const mapGameSessionScoresToPlayers = (
  players: playerListModel.PlayerList
) => (sessionScores: GameSessionScore): playerListModel.PlayerList =>
  players.map((player) =>
    sessionScores[player.id] === undefined
      ? player
      : playerModel.update({ sessionScore: sessionScores[player.id] })(player)
  );
