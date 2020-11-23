import { BID_TYPE, getBid } from "./bid";

export default describe("bid", () => {
  describe("getBid", () => {
    it("should get a bid from bid type", () => {
      const bidType = BID_TYPE.FOUR_KING;
      const expected = {
        score: 2,
        silent: true,
        type: BID_TYPE.FOUR_KING
      };
      const current = getBid(bidType);
      expect(current).toEqual(expected);
    });
  });
});
