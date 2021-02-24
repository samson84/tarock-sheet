import { createId, Id } from "../lib/util";
import * as Score from "./Score";

export enum TYPE {
  DECLARER = "DECLARER",
  OPPONENT = "OPPONENT",
}
export interface Props {
  id: Id;
  name: string;
  baseScore: number;
  sessionScore: Score.Props;
  gameScore: Score.Props;
  type: TYPE | null;
}
export const create = (): Props => ({
  id: createId(),
  name: "",
  baseScore: 100,
  sessionScore: null,
  gameScore: null,
  type: null,
});

export type UpdateProps = Partial<Omit<Props, "id">>;
export const update = (updates: UpdateProps) => (player: Props): Props => ({
  ...player,
  ...updates,
});

export const getOppositeType = (playerType: TYPE): TYPE =>
  playerType === TYPE.DECLARER ? TYPE.OPPONENT : TYPE.DECLARER;

type TypeColor = "primary" | "secondary" | "default";
export const getTypeColor = (playerType: TYPE | null): TypeColor => {
  const mapper = new Map<TYPE | null, TypeColor>([
    [TYPE.DECLARER, "primary"],
    [TYPE.OPPONENT, "secondary"],
    [null, "default"],
  ]);
  return mapper.get(playerType) || "default";
};

export const rotateTypeWithNull = (playerType: TYPE | null): TYPE | null => {
  const mapper = new Map([
    [TYPE.DECLARER, TYPE.OPPONENT],
    [TYPE.OPPONENT, null],
    [null, TYPE.DECLARER],
  ]);
  return mapper.get(playerType) || null;
};
