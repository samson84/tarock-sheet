import * as playerModel from "./playerModel";

export type PlayerList = playerModel.Player[];
export const add = (playerList: PlayerList) => (
  player: playerModel.Player
): PlayerList => {
  return [...playerList, player];
};

export const remove = (playerList: PlayerList) => (
  player: playerModel.Player
): PlayerList => playerList.filter(({ id }) => id !== player.id);

export const updatePlayerAt = (updated: playerModel.Player) => (
  playerList: PlayerList
): PlayerList =>
  playerList.map((player) => (player.id === updated.id ? updated : player));

export const getPlayerNumberByType = (
  players: PlayerList
): [number, number] => {
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

export const clearPlayersType = (players: PlayerList): PlayerList =>
  players.map((player) => playerModel.update({ type: null })(player));

export const resetPlayerScore = (players: PlayerList): PlayerList =>
  players.map((player) => playerModel.update({ sessionScore: null })(player));

export const filterPlayersInGame = (players: PlayerList): PlayerList =>
  players.filter((player) => player.type !== null);

export type PlayerListObject = { [key: string]: playerModel.Player };
export const createPlayerListObject = (
  playerList: PlayerList
): PlayerListObject => {
  return playerList.reduce((playerListObject, player) => {
    playerListObject[player.id as string] = player;
    return playerListObject;
  }, {} as PlayerListObject);
};
