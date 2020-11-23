import { getBid, BID_TYPE } from "./bid";
import { PLAYER_TYPE } from "./player";

import { createContract, winContract, contraContract } from "./contract";

const contractFixture = (props = {}) => {
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
        silent: false,
      });
      const current = createContract(bid, taker);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.OPPONENT;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
        silent: false,
      });
      const current = createContract(bid, taker);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.OPPONENT;
      const expected = contractFixture({
        bid: bid,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = createContract(bid, taker);
      expect(current).toEqual(expected);
    })
  });
  describe("winContract", () => {
    it("should win by a declarer", () => {
      const winner = PLAYER_TYPE.DECLARER;
      const contract = contractFixture({
        taker: PLAYER_TYPE.OPPONENT,
      });
      const expected = contractFixture({
        winner: PLAYER_TYPE.DECLARER,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = winContract(winner)(contract);
      expect(current).toEqual(expected);
    });
    it("should win by an opponent", () => {
      const winner = PLAYER_TYPE.OPPONENT;
      const contract = contractFixture({
        taker: PLAYER_TYPE.OPPONENT,
      });
      const expected = contractFixture({
        winner: PLAYER_TYPE.OPPONENT,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = winContract(winner)(contract);
      expect(current).toEqual(expected);
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
