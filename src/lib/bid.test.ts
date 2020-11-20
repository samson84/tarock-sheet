import {
  BID_TYPE,
  getBid
} from "./bid";

export default describe("scorer", () => {

  describe("getBid", () => {
    it("should get a bid from bid type", () => {
      const bidType = BID_TYPE.FOUR_KING;
      const expected = {
        type: BID_TYPE.FOUR_KING,
        score: 2,
        silent: true,
      };
      const current = getBid(bidType);
      expect(current).toEqual(expected);
    });
  });
});
