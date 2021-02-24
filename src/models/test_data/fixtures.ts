import * as Bid from "../Bid";
import * as Player from "../Player";
import * as Contract from "../Contract";
import * as Game from "../Game";
import { createId } from "../../lib/util";

export const ContractFixture = (
  props: Partial<Contract.Props> = {}
): Contract.Props => {
  return {
    bidType: Bid.TYPE.FOUR_KING,
    contra: 1,
    isSilent: false,
    isWonByTaker: null,
    taker: Player.TYPE.DECLARER,
    bidVariant: null,
    bidBaseScore: 2,
    ...props,
  };
};

export const GameFixture = (props: Partial<Game.Props> = {}): Game.Props => ({
  contracts: [],
  partyScoreType: null,
  partyBaseScore: 1,
  calledTarock: null,
  ...props,
  playerTypeScores: props.playerTypeScores
    ? { ...props.playerTypeScores }
    : {
        [Player.TYPE.DECLARER]: null,
        [Player.TYPE.OPPONENT]: null,
      },
});

export const PlayerFixture = (
  props: Partial<Player.Props> = {}
): Player.Props => ({
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
  current: Player.Props,
  expected: Player.Props
): void => {
  // 6c519e5f-0c23-4c92-befe-b01941f0044d
  const { id, ...currentRest } = current;
  const { id: _, ...expectedRest } = expected;

  expect(id).toMatch(MATCH_UUID_V4);
  expect(currentRest).toEqual(expectedRest);
};
