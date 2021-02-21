import { createId, Id } from "../lib/util";
import { Score } from "./scoreModel";

export enum PLAYER_TYPE {
  DECLARER = "DECLARER",
  OPPONENT = "OPPONENT",
}
export interface Player {
  id: Id;
  name: string;
  baseScore: number;
  sessionScore: Score;
  gameScore: Score;
  type: PLAYER_TYPE | null;
}
export const create = (): Player => ({
  id: createId(),
  name: "",
  baseScore: 100,
  sessionScore: null,
  gameScore: null,
  type: null,
});

export type UpdatePlayerProps = Partial<Omit<Player, "id">>;
export const update = (updates: UpdatePlayerProps) => (
  player: Player
): Player => ({
  ...player,
  ...updates,
});

export const getOppositeType = (playerType: PLAYER_TYPE): PLAYER_TYPE =>
  playerType === PLAYER_TYPE.DECLARER
    ? PLAYER_TYPE.OPPONENT
    : PLAYER_TYPE.DECLARER;

export type PlayerList = Player[];
export const addPlayer = (player: Player) => (
  playerList: PlayerList
): PlayerList => {
  return [...playerList, player];
};

export const removePlayer = (player: Player) => (
  playerList: PlayerList
): PlayerList => playerList.filter(({ id }) => id !== player.id);

export const updatePlayerAt = (updated: Player) => (
  playerList: PlayerList
): PlayerList =>
  playerList.map((player) => (player.id === updated.id ? updated : player));

type TypeColor = "primary" | "secondary" | "default";
export const getTypeColor = (playerType: PLAYER_TYPE | null): TypeColor => {
  const mapper = new Map<PLAYER_TYPE | null, TypeColor>([
    [PLAYER_TYPE.DECLARER, "primary"],
    [PLAYER_TYPE.OPPONENT, "secondary"],
    [null, "default"],
  ]);
  return mapper.get(playerType) || "default";
};

export const rotatePlayerTypeWithNull = (
  playerType: PLAYER_TYPE | null
): PLAYER_TYPE | null => {
  const mapper = new Map([
    [PLAYER_TYPE.DECLARER, PLAYER_TYPE.OPPONENT],
    [PLAYER_TYPE.OPPONENT, null],
    [null, PLAYER_TYPE.DECLARER],
  ]);
  return mapper.get(playerType) || null;
};

export const getPlayerNumberByType = (
  players: PlayerList
): [number, number] => {
  const [declarersNumber, opponentsNumber] = players.reduce(
    ([declarersNumber, opponentsNumber], player) => {
      if (player.type === PLAYER_TYPE.OPPONENT) {
        return [declarersNumber, opponentsNumber + 1];
      } else if (player.type === PLAYER_TYPE.DECLARER) {
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
  players.map((player) => update({ type: null })(player));

export const resetPlayerScore = (players: PlayerList): PlayerList =>
  players.map((player) => update({ sessionScore: null })(player));

export const filterPlayersInGame = (players: PlayerList): PlayerList =>
  players.filter((player) => player.type !== null);

export type PlayerListObject = { [key: string]: Player };
export const createPlayerListObject = (
  playerList: PlayerList
): PlayerListObject => {
  return playerList.reduce((playerListObject, player) => {
    playerListObject[player.id as string] = player;
    return playerListObject;
  }, {} as PlayerListObject);
};
