import { getBid, BID_TYPE } from "./bid";
import { PLAYER_TYPE } from "./player";

import { createContract, winContract, contraContract } from "./contract";

export default describe('contract', () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.DECLARER;
      const expected = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.DECLARER,
      };
      const current = createContract(bid, taker);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const taker = PLAYER_TYPE.OPPONENT;
      const expected = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const current = createContract(bid, taker);
      expect(current).toEqual(expected);
    });
  });
  describe("winContract", () => {
    it("should win by a declarer", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const winner = PLAYER_TYPE.DECLARER;
      const contract = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const expected = {
        bid: bid,
        contra: 1,
        win: PLAYER_TYPE.DECLARER,
        take: PLAYER_TYPE.OPPONENT,
      };
      const current = winContract(winner)(contract);
      expect(current).toEqual(expected);
    });
    it("should win by an opponent", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const winner = PLAYER_TYPE.OPPONENT;
      const contract = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const expected = {
        bid: bid,
        contra: 1,
        win: PLAYER_TYPE.OPPONENT,
        take: PLAYER_TYPE.OPPONENT,
      };
      const current = winContract(winner)(contract);
      expect(current).toEqual(expected);
    });
  });
  describe("contraContract", () => {
    it("should contra a Contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const contract = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const expected = {
        bid: bid,
        contra: 2,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const current = contraContract(contract);
      expect(current).toEqual(expected);      
    })
    it("should double contra a Contract", () => {
      const bid = getBid(BID_TYPE.FOUR_KING);
      const contract = {
        bid: bid,
        contra: 1,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const expected = {
        bid: bid,
        contra: 4,
        win: null,
        take: PLAYER_TYPE.OPPONENT,
      };
      const doubled = contraContract(contract);
      const current = contraContract(doubled);
      expect(current).toEqual(expected);      
    })
  });

})