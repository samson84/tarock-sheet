import * as Player from "./Player";

export type Props = Player.Props[];
export const add = (playerList: Props) => (player: Player.Props): Props => {
  return [...playerList, player];
};

export const remove = (playerList: Props) => (player: Player.Props): Props =>
  playerList.filter(({ id }) => id !== player.id);

export const update = (playerList: Props) => (updated: Player.Props): Props =>
  playerList.map((player) => (player.id === updated.id ? updated : player));

export const countByType = (players: Props): [number, number] => {
  const [declarersNumber, opponentsNumber] = players.reduce(
    ([declarersNumber, opponentsNumber], player) => {
      if (player.type === Player.TYPE.OPPONENT) {
        return [declarersNumber, opponentsNumber + 1];
      } else if (player.type === Player.TYPE.DECLARER) {
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
  players.map((player) => Player.update({ type: null })(player));

export const clearSessionScore = (players: Props): Props =>
  players.map((player) => Player.update({ sessionScore: null })(player));

export const filterByInGame = (players: Props): Props =>
  players.filter((player) => player.type !== null);

export type PlayerMap = { [key: string]: Player.Props };
export const mapToObjectById = (playerList: Props): PlayerMap => {
  return playerList.reduce((playerListObject, player) => {
    playerListObject[player.id as string] = player;
    return playerListObject;
  }, {} as PlayerMap);
};
