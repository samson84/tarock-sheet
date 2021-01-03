export enum PLAYER_TYPE {
  DECLARER = "DECLARER",
  OPPONENT = "OPPONENT",
}
export type Player = string;

export const getAnotherPlayerType = (playerType: PLAYER_TYPE): PLAYER_TYPE =>
  playerType === PLAYER_TYPE.DECLARER
    ? PLAYER_TYPE.OPPONENT
    : PLAYER_TYPE.DECLARER;
