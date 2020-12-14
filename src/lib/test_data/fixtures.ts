import { BID_TYPE } from "../bid";
import { PLAYER_TYPE } from "../player";

export const contractFixture = (props = {}) => {
  return {
    bidType: BID_TYPE.FOUR_KING,
    contra: 1,
    silent: false,
    winner: null,
    taker: PLAYER_TYPE.DECLARER,
    bidVariant: null,
    bidBaseScore: 2,
    ...props,
  };
};
