import * as Game from "./Game";
import * as Player from "./Player";
import * as PlayerList from "./PlayerList";
import * as scoreModel from "./Score";
import assignWith from "lodash/fp/assignWith";
import { isEqual } from "lodash";

const calculateScoreByPlayerType = (players: PlayerList.Props) => (
  game: Game.Props
): [scoreModel.Props, scoreModel.Props] => {
  const [numberOfDeclarers, numberOfOpponents] = PlayerList.countByType(
    players
  );
  const opponentsGameScore = game.playerTypeScores[Player.TYPE.OPPONENT];
  const declarersGameScore = game.playerTypeScores[Player.TYPE.DECLARER];
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
  players: PlayerList.Props
): PlayerList.Props => {
  return players.map(
    (player: Player.Props): Player.Props => {
      const [declarersScore, opponentsScore] = calculateScoreByPlayerType(
        players
      )(game);
      const score = {
        [Player.TYPE.OPPONENT]: opponentsScore,
        [Player.TYPE.DECLARER]: declarersScore,
      };
      return {
        ...player,
        gameScore: player.type === null ? null : score[player.type],
      };
    }
  );
};

export const isReadyForSave = (players: PlayerList.Props) => (
  game: Game.Props
): boolean => {
  const numbers = PlayerList.countByType(players);
  const playerNumberValid =
    isEqual(numbers, [1, 3]) ||
    isEqual(numbers, [2, 2]) ||
    isEqual(numbers, [3, 1]);
  const gameScoreValid =
    game.playerTypeScores[Player.TYPE.DECLARER] !== null &&
    game.playerTypeScores[Player.TYPE.OPPONENT] !== null;
  return playerNumberValid && gameScoreValid;
};

const defined = (value: any): boolean =>
  Boolean(value !== undefined && value !== null);

const scoreSumAssigner = (
  gameScore: number | undefined,
  player: Player.Props
) => {
  const left = defined(gameScore) ? gameScore : 0;
  const right = defined(player.gameScore) ? player.gameScore : 0;
  return (left as number) + (right as number);
};

export type GameSessionScore = { [key: string]: number };

export const calculateGameSessionScores = (
  playerListObjects: PlayerList.PlayerMap[]
): GameSessionScore => {
  return playerListObjects.reduce(
    (scores, playerListObject) =>
      assignWith(scoreSumAssigner)(scores, playerListObject),
    {} as GameSessionScore
  );
};

export const mapGameSessionScoresToPlayers = (players: PlayerList.Props) => (
  sessionScores: GameSessionScore
): PlayerList.Props =>
  players.map((player) =>
    sessionScores[player.id] === undefined
      ? player
      : Player.update({ sessionScore: sessionScores[player.id] })(player)
  );
