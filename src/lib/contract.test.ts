import { getBid, BID_TYPE, CARD_SHAPE_VARIANT, SMALLEST_VARIANT } from "./bid";
import { PLAYER_TYPE } from "./player";

import { createContract, contraContract, updateContract } from "./contract";

export const contractFixture = (props = {}) => {
  return {
    bid: getBid(BID_TYPE.FOUR_KING),
    contra: 1,
    silent: false,
    winner: null,
    taker: PLAYER_TYPE.DECLARER,
    bidVariant: null,
    ...props,
  };
};

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.DECLARER;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.DECLARER,
      });
      const current = createContract({ bid, taker });
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.OPPONENT;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = createContract({ bid, taker });
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.OPPONENT;
      const silent = true;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
      });
      const current = createContract({ bid, taker, silent });
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const bid = getBid(BID_TYPE.PARTY);
      const taker = PLAYER_TYPE.OPPONENT;
      const silent = true;
      const expected = "PARTY can not be silent.";
      const current = () => createContract({ bid, taker, silent });
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const bid = getBid(BID_TYPE.KING_ULTI);
      const taker = PLAYER_TYPE.OPPONENT;
      const bidVariant = CARD_SHAPE_VARIANT.CLUB;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = createContract({ bid, taker, bidVariant });
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const bid = getBid(BID_TYPE.KING_ULTI);
      const taker = PLAYER_TYPE.OPPONENT;
      const bidVariant = SMALLEST_VARIANT.EAGLE;
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => createContract({ bid, taker, bidVariant });
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const bid = getBid(BID_TYPE.PARTY);
      const taker = PLAYER_TYPE.OPPONENT;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = createContract({ bid, taker });
      expect(current).toEqual(expected);
    });
  });
  describe("updateContract", () => {
    it("should update the taker", () => {
      const contract = contractFixture({
        taker: PLAYER_TYPE.OPPONENT,
      });
      const updates = {
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        taker: PLAYER_TYPE.DECLARER,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update the winner", () => {
      const contract = contractFixture({
        winner: null,
      });
      const updates = {
        winner: PLAYER_TYPE.OPPONENT,
      };
      const expected = contractFixture({
        winner: PLAYER_TYPE.OPPONENT,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update silent prop", () => {
      const contract = contractFixture({
        silent: false,
      });
      const updates = {
        silent: true,
      };
      const expected = contractFixture({
        silent: true,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const contract = contractFixture({
        bid: getBid(BID_TYPE.PARTY),
        silent: false,
      });
      const updates = {
        silent: true,
      };
      const expected = "PARTY can not be silent";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the bidVariant prop", () => {
      const contract = contractFixture({
        bid: getBid(BID_TYPE.KING_ULTI),
        bidVariant: null,
      });
      const updates = {
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      };
      const expected = contractFixture({
        bid: getBid(BID_TYPE.KING_ULTI),
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = contractFixture({
        bid: getBid(BID_TYPE.KING_ULTI),
        bidVariant: CARD_SHAPE_VARIANT.DIAMOND,
      });
      const updates = {
        bidVariant: SMALLEST_VARIANT.EAGLE,
      };
      const expected = "KING_ULTI does not have EAGLE variant";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should throw if the bid does not have variant", () => {
      const contract = contractFixture({
        bid: getBid(BID_TYPE.PARTY),
        bidVariant: null,
      });
      const updates = {
        bidVariant: SMALLEST_VARIANT.PAGAT,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
  });

  describe("contraContract", () => {
    it("should contra a Contract", () => {
      const contract = contractFixture({
        contra: 1,
      });
      const expected = contractFixture({
        contra: 2,
      });
      const current = contraContract(contract);
      expect(current).toEqual(expected);
    });
    it("should double contra a Contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const contract = contractFixture({
        contra: 1,
      });
      const expected = contractFixture({
        contra: 4,
      });
      const doubled = contraContract(contract);
      const current = contraContract(doubled);
      expect(current).toEqual(expected);
    });
  });
});