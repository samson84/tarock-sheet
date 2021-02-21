import { BID_TYPE, CARD_SHAPE_VARIANT, SMALLEST_VARIANT } from "../lib/bid";
import * as playerModel from "./playerModel";

import * as contractModel from "./contractModel";
import * as gameModel from "./gameModel";

import { contractFixture } from "../lib/test_data/fixtures";

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.CENTRUM,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
        taker: playerModel.PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.CENTRUM,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        bidBaseScore: 10,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.FOUR_KING,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        bidBaseScore: 2,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
    it("should create a contract with party score dependent bid", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.VOLAT,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.VOLAT,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        bidBaseScore: 12,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.FOUR_KING,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        isSilent: true,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        isSilent: true,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        isSilent: true,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "PARTY can not be silent.";
      const current = () => contractModel.create(props);
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.KING_ULTI,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        bidBaseScore: 15,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.KING_ULTI,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        bidVariant: SMALLEST_VARIANT.EAGLE,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => contractModel.create(props);
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const props: contractModel.CreateContractProps = {
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const current = contractModel.create(props);
      expect(current).toEqual(expected);
    });
  });
  describe("updateContract", () => {
    it("should update the taker", () => {
      const contract = contractFixture({
        taker: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const updates: contractModel.UpdateContractProps = {
        taker: playerModel.PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        taker: playerModel.PLAYER_TYPE.DECLARER,
      });
      const current = contractModel.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update the winner", () => {
      const contract = contractFixture({
        isWonByTaker: null,
      });
      const updates: contractModel.UpdateContractProps = {
        isWonByTaker: true,
      };
      const expected = contractFixture({
        isWonByTaker: true,
      });
      const current = contractModel.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update silent prop", () => {
      const contract = contractFixture({
        isSilent: false,
      });
      const updates: contractModel.UpdateContractProps = {
        isSilent: true,
      };
      const expected = contractFixture({
        isSilent: true,
      });
      const current = contractModel.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        isSilent: false,
      });
      const updates: contractModel.UpdateContractProps = {
        isSilent: true,
      };
      const expected = "PARTY can not be silent";
      const current = () => contractModel.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the bidVariant prop", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: null,
      });
      const updates: contractModel.UpdateContractProps = {
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = contractModel.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.DIAMOND,
      });
      const updates: contractModel.UpdateContractProps = {
        bidVariant: SMALLEST_VARIANT.EAGLE,
      };
      const expected = "KING_ULTI does not have EAGLE variant";
      const current = () => contractModel.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should throw if the bid does not have variant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        bidVariant: null,
      });
      const updates: contractModel.UpdateContractProps = {
        bidVariant: SMALLEST_VARIANT.PAGAT,
        isWonByTaker: false,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => contractModel.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the contra", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: contractModel.UpdateContractProps = {
        contra: 4,
      };
      const expected = contractFixture({
        contra: 4,
      });
      const current = contractModel.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("sould throw if the contra is not the power of two", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: contractModel.UpdateContractProps = {
        contra: 5,
      };
      const expected = "Contra must be power of two, but 5 given.";
      const current = () => contractModel.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("sould throw if the contra is less than one.", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: contractModel.UpdateContractProps = {
        contra: 0.5,
      };
      const expected = "Contra must be greater than 1, but 0.5 given.";
      const current = () => contractModel.update(updates)(contract);
      expect(current).toThrow(expected);
    });
  });
  describe("calculateContract", () => {
    it("should return null if no winner", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 1,
        isWonByTaker: null,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = null;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("shouls return the base score if it is won by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: true,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = 20;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the minus score if it is lose by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: false,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = -20;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent.", () => {
      const contract = contractModel.create({
        bidType: BID_TYPE.ULTI, // bse score is 10
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: true,
        isWonByTaker: true,
        partyScore: 1,
      });
      const expected = 5;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent, contra > 1", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: true,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: true,
      });
      const expected = 5;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score negative if silent, contra > 1, and loose", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: false,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isSilent: true,
      });
      const expected = -5;

      const current = contractModel.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
  });
});
