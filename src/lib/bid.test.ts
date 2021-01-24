import {
  BID_TYPE,
  canSilent,
  CARD_SHAPE_VARIANT,
  getBid,
  getBidScore,
  hasVariant,
  getAllBidsByGorup,
  SMALLEST_VARIANT,
} from "./bid";

export default describe("bid", () => {
  describe("getBid", () => {
    it("should get a bid from bid type", () => {
      const bidType = BID_TYPE.FOUR_KING;
      const expected = {
        score: 2,
        silent: true,
        type: BID_TYPE.FOUR_KING,
      };
      const current = getBid(bidType);
      expect(current).toEqual(expected);
    });
  });
  describe("canSilent", () => {
    it("should return an existing silent possibility", () => {
      const bid = getBid(BID_TYPE.ULTI);
      const expected = true;
      const current = canSilent(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if the Bid does not have silent possibility", () => {
      const bid = getBid(BID_TYPE.KING_ULTI);
      const expected = false;
      const current = canSilent(bid);
      expect(current).toEqual(expected);
    });
  });
  describe("hasVariant", () => {
    it("should return true, if the variant valid for the bid", () => {
      const bid = getBid(BID_TYPE.KING_ULTI);
      const variant = CARD_SHAPE_VARIANT.CLUB;
      const expected = true;
      const current = hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if the variant is not for the bid", () => {
      const bid = getBid(BID_TYPE.KING_ULTI);
      const variant = SMALLEST_VARIANT.PAGAT;
      const expected = false;
      const current = hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if no variants for the bid", () => {
      const bid = getBid(BID_TYPE.PARTY);
      const variant = SMALLEST_VARIANT.PAGAT;
      const expected = false;
      const current = hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
  });
  describe("getBidScore", () => {
    it("should get a party independent bid score", () => {
      const bid = getBid(BID_TYPE.CENTRUM);
      const partyScore = 2;
      const expected = 10; // Centrum's score is 10 always
      const current = getBidScore(partyScore)(bid);
      expect(current).toEqual(expected);
    });
    it("should get a party dependent bid score", () => {
      const bid = getBid(BID_TYPE.VOLAT);
      const partyScore = 2;
      const expected = 12; // Volat's score is party score * 6
      const current = getBidScore(partyScore)(bid);
      expect(current).toEqual(expected);
    });
  });
});
