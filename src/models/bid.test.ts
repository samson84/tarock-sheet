import * as Bid from "./Bid";

export default describe("bid", () => {
  describe("getBid", () => {
    it("should get a bid from bid type", () => {
      const bidType = Bid.TYPE.FOUR_KING;
      const expected: Bid.Props = {
        bidBaseScore: 2,
        canSilent: true,
        type: Bid.TYPE.FOUR_KING,
      };
      const current = Bid.getByType(bidType);
      expect(current).toEqual(expected);
    });
  });
  describe("canSilent", () => {
    it("should return an existing silent possibility", () => {
      const bid = Bid.getByType(Bid.TYPE.ULTI);
      const expected = true;
      const current = Bid.canSilent(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if the Bid does not have silent possibility", () => {
      const bid = Bid.getByType(Bid.TYPE.KING_ULTI);
      const expected = false;
      const current = Bid.canSilent(bid);
      expect(current).toEqual(expected);
    });
  });
  describe("hasVariant", () => {
    it("should return true, if the variant valid for the bid", () => {
      const bid = Bid.getByType(Bid.TYPE.KING_ULTI);
      const variant = Bid.CARD_SUIT_VARIANT.CLUB;
      const expected = true;
      const current = Bid.hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if the variant is not for the bid", () => {
      const bid = Bid.getByType(Bid.TYPE.KING_ULTI);
      const variant = Bid.SMALLEST_VARIANT.PAGAT;
      const expected = false;
      const current = Bid.hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
    it("should return false, if no variants for the bid", () => {
      const bid = Bid.getByType(Bid.TYPE.PARTY);
      const variant = Bid.SMALLEST_VARIANT.PAGAT;
      const expected = false;
      const current = Bid.hasVariant(variant)(bid);
      expect(current).toEqual(expected);
    });
  });
  describe("getBidScore", () => {
    it("should get a party independent bid score", () => {
      const bid = Bid.getByType(Bid.TYPE.CENTRUM);
      const partyScore = 2;
      const expected = 10; // Centrum's score is 10 always
      const current = Bid.calculateScore(partyScore)(bid);
      expect(current).toEqual(expected);
    });
    it("should get a party dependent bid score", () => {
      const bid = Bid.getByType(Bid.TYPE.VOLAT);
      const partyScore = 2;
      const expected = 12; // Volat's score is party score * 6
      const current = Bid.calculateScore(partyScore)(bid);
      expect(current).toEqual(expected);
    });
  });
});
