import { BID_TYPE } from "../bid";
import { PLAYER_TYPE } from "../player";
import { Contract } from "../contract"

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
