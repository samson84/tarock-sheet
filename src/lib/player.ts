export enum PLAYER_TYPE {
  DECLARER = "DECLARER",
  OPPONENT = "OPPONENT",
}
export type Player = string;

export const getAnotherPlayerType = (playerType: PLAYER_TYPE): PLAYER_TYPE =>
  playerType === PLAYER_TYPE.DECLARER
    ? PLAYER_TYPE.OPPONENT
    : PLAYER_TYPE.DECLARER;

export interface PlayerListItem {
  player: Player;
  playerType: PLAYER_TYPE | null;
}
export type PlayerList = PlayerListItem[];
export const createPlayerList = (
  players: Player[],
  declarers: Player[],
  opponents: Player[]
): PlayerList => {
  return players.map((player) => ({
    player,
    playerType: opponents.includes(player)
      ? PLAYER_TYPE.OPPONENT
      : declarers.includes(player)
      ? PLAYER_TYPE.DECLARER
      : null,
  }));
};

type PlayerTypeColor = "primary" | "secondary" | "default";
export const getPlayerTypeColor = (
  playerType: PLAYER_TYPE | null
): PlayerTypeColor => {
  const mapper = new Map<PLAYER_TYPE | null, PlayerTypeColor>([
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
