import { BID_TYPE } from "../bid";
import { PLAYER_TYPE } from "../player";
import { Contract } from "../contract";
import { Game } from "../game";

export const contractFixture = (props: Partial<Contract> = {}): Contract => {
  return {
    bidType: BID_TYPE.FOUR_KING,
    contra: 1,
    silent: false,
    winByTaker: null,
    taker: PLAYER_TYPE.DECLARER,
    bidVariant: null,
    bidBaseScore: 2,
    ...props,
  };
};

export const gameFixture = (props: Partial<Game> = {}): Game => ({
  contracts: [],
  declarers: [],
  opponents: [],
  partyScoreType: null,
  partyBaseScore: 1,
  called_tarock: null,
  ...props,
  scores: props.scores
    ? { ...props.scores }
    : {
        [PLAYER_TYPE.DECLARER]: null,
        [PLAYER_TYPE.OPPONENT]: null,
      },
});
