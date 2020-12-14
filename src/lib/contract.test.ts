import { BID_TYPE, CARD_SHAPE_VARIANT, SMALLEST_VARIANT } from "./bid";
import { PLAYER_TYPE } from "./player";

import { createContract, updateContract } from "./contract";
import { PARTY_SCORE } from "./game";

import { contractFixture } from "./test_data/fixtures";

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const props = {
        bidType: BID_TYPE.CENTRUM,
        partyScore: PARTY_SCORE.TOOK_TWO,
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.CENTRUM,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 10,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const props = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        bidBaseScore: 2,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should create a contract with party score dependent bid", () => {
      const props = {
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 12,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const props = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const props = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = "PARTY can not be silent.";
      const current = () => createContract(props);
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const props = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        bidBaseScore: 15,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const props = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: SMALLEST_VARIANT.EAGLE,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => createContract(props);
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const props = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = createContract(props);
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
        winByTaker: null,
      });
      const updates = {
        winByTaker: true,
      };
      const expected = contractFixture({
        winByTaker: true,
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
        bidType: BID_TYPE.PARTY,
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
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: null,
      });
      const updates = {
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
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
        bidType: BID_TYPE.PARTY,
        bidVariant: null,
      });
      const updates = {
        bidVariant: SMALLEST_VARIANT.PAGAT,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the contra", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 4,
      };
      const expected = contractFixture({
        contra: 4,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("sould throw if the contra is not the power of two", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 5,
      };
      const expected = "Contra must be power of two, but 5 given.";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("sould throw if the contra is less than one.", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 0.5,
      };
      const expected = "Contra must be greater than 1, but 0.5 given.";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
  });
});
