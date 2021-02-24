import * as playerModel from "./playerModel";

export type Props = playerModel.Player[];
export const add = (playerList: Props) => (
  player: playerModel.Player
): Props => {
  return [...playerList, player];
};

export const remove = (playerList: Props) => (
  player: playerModel.Player
): Props => playerList.filter(({ id }) => id !== player.id);

export const update = (playerList: Props) => (
  updated: playerModel.Player
): Props =>
  playerList.map((player) => (player.id === updated.id ? updated : player));

export const countByType = (players: Props): [number, number] => {
  const [declarersNumber, opponentsNumber] = players.reduce(
    ([declarersNumber, opponentsNumber], player) => {
      if (player.type === playerModel.PLAYER_TYPE.OPPONENT) {
        return [declarersNumber, opponentsNumber + 1];
      } else if (player.type === playerModel.PLAYER_TYPE.DECLARER) {
        return [declarersNumber + 1, opponentsNumber];
      } else {
        return [declarersNumber, opponentsNumber];
      }
    },
    [0, 0]
  );
  return [declarersNumber, opponentsNumber];
};

export const clearType = (players: Props): Props =>
  players.map((player) => playerModel.update({ type: null })(player));

export const clearSessionScore = (players: Props): Props =>
  players.map((player) => playerModel.update({ sessionScore: null })(player));

export const filterByInGame = (players: Props): Props =>
  players.filter((player) => player.type !== null);

export type PlayerMap = { [key: string]: playerModel.Player };
export const mapToObjectById = (playerList: Props): PlayerMap => {
  return playerList.reduce((playerListObject, player) => {
    playerListObject[player.id as string] = player;
    return playerListObject;
  }, {} as PlayerMap);
};
