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

type TypeColor = "primary" | "secondary" | "default";
export const getTypeColor = (playerType: PLAYER_TYPE | null): TypeColor => {
  const mapper = new Map<PLAYER_TYPE | null, TypeColor>([
    [PLAYER_TYPE.DECLARER, "primary"],
    [PLAYER_TYPE.OPPONENT, "secondary"],
    [null, "default"],
  ]);
  return mapper.get(playerType) || "default";
};

export const rotateTypeWithNull = (
  playerType: PLAYER_TYPE | null
): PLAYER_TYPE | null => {
  const mapper = new Map([
    [PLAYER_TYPE.DECLARER, PLAYER_TYPE.OPPONENT],
    [PLAYER_TYPE.OPPONENT, null],
    [null, PLAYER_TYPE.DECLARER],
  ]);
  return mapper.get(playerType) || null;
};
