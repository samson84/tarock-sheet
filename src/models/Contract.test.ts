import * as Bid from "./Bid";
import * as Player from "./Player";

import * as Contract from "./Contract";
import * as Game from "./Game";

import { ContractFixture } from "./test_data/fixtures";

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.CENTRUM,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
        taker: Player.TYPE.DECLARER,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.CENTRUM,
        taker: Player.TYPE.DECLARER,
        bidBaseScore: 10,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.FOUR_KING,
        taker: Player.TYPE.OPPONENT,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.FOUR_KING,
        taker: Player.TYPE.OPPONENT,
        bidBaseScore: 2,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
    it("should create a contract with party score dependent bid", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.VOLAT,
        taker: Player.TYPE.DECLARER,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.VOLAT,
        taker: Player.TYPE.DECLARER,
        bidBaseScore: 12,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.FOUR_KING,
        taker: Player.TYPE.OPPONENT,
        isSilent: true,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.FOUR_KING,
        taker: Player.TYPE.OPPONENT,
        isSilent: true,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.OPPONENT,
        isSilent: true,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "PARTY can not be silent.";
      const current = () => Contract.create(props);
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.KING_ULTI,
        taker: Player.TYPE.OPPONENT,
        bidVariant: Bid.CARD_SUIT_VARIANT.CLUB,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.KING_ULTI,
        taker: Player.TYPE.OPPONENT,
        bidVariant: Bid.CARD_SUIT_VARIANT.CLUB,
        bidBaseScore: 15,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.KING_ULTI,
        taker: Player.TYPE.OPPONENT,
        bidVariant: Bid.SMALLEST_VARIANT.EAGLE,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => Contract.create(props);
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const props: Contract.CreateProps = {
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.OPPONENT,
        partyScore: Game.PARTY_SCORE.TOOK_TWO,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.OPPONENT,
      });
      const current = Contract.create(props);
      expect(current).toEqual(expected);
    });
  });
  describe("updateContract", () => {
    it("should update the taker", () => {
      const contract = ContractFixture({
        taker: Player.TYPE.OPPONENT,
      });
      const updates: Contract.UpdateProps = {
        taker: Player.TYPE.DECLARER,
      };
      const expected = ContractFixture({
        taker: Player.TYPE.DECLARER,
      });
      const current = Contract.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update the winner", () => {
      const contract = ContractFixture({
        isWonByTaker: null,
      });
      const updates: Contract.UpdateProps = {
        isWonByTaker: true,
      };
      const expected = ContractFixture({
        isWonByTaker: true,
      });
      const current = Contract.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update silent prop", () => {
      const contract = ContractFixture({
        isSilent: false,
      });
      const updates: Contract.UpdateProps = {
        isSilent: true,
      };
      const expected = ContractFixture({
        isSilent: true,
      });
      const current = Contract.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.PARTY,
        isSilent: false,
      });
      const updates: Contract.UpdateProps = {
        isSilent: true,
      };
      const expected = "PARTY can not be silent";
      const current = () => Contract.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the bidVariant prop", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.KING_ULTI,
        bidVariant: null,
      });
      const updates: Contract.UpdateProps = {
        bidVariant: Bid.CARD_SUIT_VARIANT.CLUB,
      };
      const expected = ContractFixture({
        bidType: Bid.TYPE.KING_ULTI,
        bidVariant: Bid.CARD_SUIT_VARIANT.CLUB,
      });
      const current = Contract.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.KING_ULTI,
        bidVariant: Bid.CARD_SUIT_VARIANT.DIAMOND,
      });
      const updates: Contract.UpdateProps = {
        bidVariant: Bid.SMALLEST_VARIANT.EAGLE,
      };
      const expected = "KING_ULTI does not have EAGLE variant";
      const current = () => Contract.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should throw if the bid does not have variant", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.PARTY,
        bidVariant: null,
      });
      const updates: Contract.UpdateProps = {
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        isWonByTaker: false,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => Contract.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the contra", () => {
      const contract = ContractFixture({
        contra: 2,
      });
      const updates: Contract.UpdateProps = {
        contra: 4,
      };
      const expected = ContractFixture({
        contra: 4,
      });
      const current = Contract.update(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("sould throw if the contra is not the power of two", () => {
      const contract = ContractFixture({
        contra: 2,
      });
      const updates: Contract.UpdateProps = {
        contra: 5,
      };
      const expected = "Contra must be power of two, but 5 given.";
      const current = () => Contract.update(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("sould throw if the contra is less than one.", () => {
      const contract = ContractFixture({
        contra: 2,
      });
      const updates: Contract.UpdateProps = {
        contra: 0.5,
      };
      const expected = "Contra must be greater than 1, but 0.5 given.";
      const current = () => Contract.update(updates)(contract);
      expect(current).toThrow(expected);
    });
  });
  describe("calculateContract", () => {
    it("should return null if no winner", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        contra: 1,
        isWonByTaker: null,
        taker: Player.TYPE.DECLARER,
        isSilent: false,
      });
      const expected = null;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("shouls return the base score if it is won by the taker", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: true,
        taker: Player.TYPE.DECLARER,
        isSilent: false,
      });
      const expected = 20;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the minus score if it is lose by the taker", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        contra: 2,
        isWonByTaker: false,
        taker: Player.TYPE.DECLARER,
        isSilent: false,
      });
      const expected = -20;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent.", () => {
      const contract = Contract.create({
        bidType: Bid.TYPE.ULTI, // bse score is 10
        taker: Player.TYPE.DECLARER,
        isSilent: true,
        isWonByTaker: true,
        partyScore: 1,
      });
      const expected = 5;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent, contra > 1", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: true,
        taker: Player.TYPE.DECLARER,
        isSilent: true,
      });
      const expected = 5;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score negative if silent, contra > 1, and loose", () => {
      const contract = ContractFixture({
        bidType: Bid.TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
        contra: 16,
        isWonByTaker: false,
        taker: Player.TYPE.DECLARER,
        isSilent: true,
      });
      const expected = -5;

      const current = Contract.calculateContractScore(contract);
      expect(current).toEqual(expected);
    });
  });
});
