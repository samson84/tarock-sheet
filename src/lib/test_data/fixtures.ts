import { BID_TYPE } from "../bid";
import * as playerModel from "../../models/playerModel";
import * as contractModel from "../../models/contractModel";
import * as gameModel from "../../models/gameModel";
import { createId } from "../util";

export const contractFixture = (
  props: Partial<contractModel.Contract> = {}
): contractModel.Contract => {
  return {
    bidType: BID_TYPE.FOUR_KING,
    contra: 1,
    isSilent: false,
    isWonByTaker: null,
    taker: playerModel.PLAYER_TYPE.DECLARER,
    bidVariant: null,
    bidBaseScore: 2,
    ...props,
  };
};

export const gameFixture = (
  props: Partial<gameModel.Game> = {}
): gameModel.Game => ({
  contracts: [],
  partyScoreType: null,
  partyBaseScore: 1,
  called_tarock: null,
  ...props,
  playerTypeScores: props.playerTypeScores
    ? { ...props.playerTypeScores }
    : {
        [playerModel.PLAYER_TYPE.DECLARER]: null,
        [playerModel.PLAYER_TYPE.OPPONENT]: null,
      },
});

export const playerFixture = (
  props: Partial<playerModel.Player> = {}
): playerModel.Player => ({
  id: props.id || createId(),
  name: "",
  baseScore: 100,
  sessionScore: null,
  gameScore: null,
  type: null,
  ...props,
});

const MATCH_UUID_V4 = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

export const expectPlayer = (
  current: playerModel.Player,
  expected: playerModel.Player
): void => {
  // 6c519e5f-0c23-4c92-befe-b01941f0044d
  const { id, ...currentRest } = current;
  const { id: _, ...expectedRest } = expected;

  expect(id).toMatch(MATCH_UUID_V4);
  expect(currentRest).toEqual(expectedRest);
};
