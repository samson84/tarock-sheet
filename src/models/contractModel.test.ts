import { BID_TYPE, CARD_SHAPE_VARIANT, SMALLEST_VARIANT } from "../lib/bid";
import { PLAYER_TYPE } from "../lib/player";

import {
  calculateContractScore,
  create,
  update,
  ContractWithIndex,
  UpdateContractProps,
  CreateContractProps,
} from "./contractModel";
import * as gameModel from "./gameModel";

import { contractFixture } from "../lib/test_data/fixtures";

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.CENTRUM,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.CENTRUM,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 10,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        bidBaseScore: 2,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
    it("should create a contract with party score dependent bid", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 12,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        isSilent: true,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        isSilent: true,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        isSilent: true,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "PARTY can not be silent.";
      const current = () => create(props);
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        bidBaseScore: 15,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: SMALLEST_VARIANT.EAGLE,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => create(props);
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const props: CreateContractProps = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: gameModel.PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = create(props);
      expect(current).toEqual(expected);
    });
  });
  describe("updateContract", () => {
    it("should update the taker", () => {
      const contract = contractFixture({
        taker: PLAYER_TYPE.OPPONENT,
      });
      const updates: UpdateContractProps = {
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        taker: PLAYER_TYPE.DECLARER,
      });
      const current = update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update the winner", () => {
      const contract = contractFixture({
        isWonByTaker: null,
      });
      const updates: UpdateContractProps = {
        isWonByTaker: true,
      };
      const expected = contractFixture({
        isWonByTaker: true,
      });
      const current = update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update silent prop", () => {
      const contract = contractFixture({
        isSilent: false,
      });
      const updates: UpdateContractProps = {
        isSilent: true,
      };
      const expected = contractFixture({
        isSilent: true,
      });
      const current = update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        isSilent: false,
      });
      const updates: UpdateContractProps = {
        isSilent: true,
      };
      const expected = "PARTY can not be silent";
      const current = () => update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the bidVariant prop", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: null,
      });
      const updates: UpdateContractProps = {
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.DIAMOND,
      });
      const updates: UpdateContractProps = {
        bidVariant: SMALLEST_VARIANT.EAGLE,
      };
      const expected = "KING_ULTI does not have EAGLE variant";
      const current = () => update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should throw if the bid does not have variant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        bidVariant: null,
      });
      const updates: UpdateContractProps = {
        bidVariant: SMALLEST_VARIANT.PAGAT,
        isWonByTaker: false,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the contra", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: UpdateContractProps = {
        contra: 4,
      };
      const expected = contractFixture({
        contra: 4,
      });
      const current = update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("sould throw if the contra is not the power of two", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: UpdateContractProps = {
        contra: 5,
      };
      const expected = "Contra must be power of two, but 5 given.";
      const current = () => update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("sould throw if the contra is less than one.", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates: UpdateContractProps = {
        contra: 0.5,
      };
      const expected = "Contra must be greater than 1, but 0.5 given.";
      const current = () => update(updates)(contract);
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
        taker: PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = null;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("shouls return the base score if it is won by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: true,
        taker: PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = 20;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the minus score if it is lose by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: false,
        taker: PLAYER_TYPE.DECLARER,
        isSilent: false,
      });
      const expected = -20;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent.", () => {
      const contract = create({
        bidType: BID_TYPE.ULTI, // bse score is 10
        taker: PLAYER_TYPE.DECLARER,
        isSilent: true,
        isWonByTaker: true,
        partyScore: 1,
      });
      const expected = 5;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent, contra > 1", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: true,
        taker: PLAYER_TYPE.DECLARER,
        isSilent: true,
      });
      const expected = 5;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score negative if silent, contra > 1, and loose", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: false,
        taker: PLAYER_TYPE.DECLARER,
        isSilent: true,
      });
      const expected = -5;

      const current = calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
  });
});
