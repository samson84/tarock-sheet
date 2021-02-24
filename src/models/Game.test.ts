import { ContractFixture } from "./test_data/fixtures";
import * as Player from "./Player";
import * as Game from "./Game";
import * as Contract from "./Contract";
import * as Bid from "./Bid";
import { GameFixture } from "./test_data/fixtures";

export default describe("game", () => {
  describe("createGame", () => {
    it("should create a game with default values", () => {
      const expected = GameFixture();

      const current = Game.create();

      expect(current).toEqual(expected);
    });
    it("should create a game with props", () => {
      const props = {
        partyScoreType: Game.PARTY_SCORE_TYPE.SOLO,
        called_tarock: Game.CALLED_TAROCK.XVIII,
      };
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.SOLO,
        called_tarock: Game.CALLED_TAROCK.XVIII,
      });

      const current = Game.create(props);

      expect(current).toEqual(expected);
    });
  });

  describe("updateGame", () => {
    it("should update the game", () => {
      const game = GameFixture({
        partyScoreType: null,
        partyBaseScore: 1,
        called_tarock: null,
      });
      const updates = {
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
        called_tarock: Game.CALLED_TAROCK.XX,
      };
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
        called_tarock: Game.CALLED_TAROCK.XX,
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and a game score, if the partyScoreType changes.", () => {
      const updates = {
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -4,
          [Player.TYPE.OPPONENT]: 4,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 12, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -12,
          [Player.TYPE.OPPONENT]: 12,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and the game score, if the partyBaseScore changes.", () => {
      const updates = {
        partyBaseScore: 2,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -4,
          [Player.TYPE.OPPONENT]: 4,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE, // score 1
        partyBaseScore: 2, // multiplier
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 8, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and the game score, if the partyBaseScore and partyScoreType changes.", () => {
      const updates = {
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -4,
          [Player.TYPE.OPPONENT]: 4,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score 2
        partyBaseScore: 2, // multiplier
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.DOUBLE_PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 16, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -16,
          [Player.TYPE.OPPONENT]: 16,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyScoreType changes", () => {
      const updates = {
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyBaseScore changes", () => {
      const updates = {
        partyBaseScore: 2,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE, // party score is 1
        partyBaseScore: 2,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyBaseScore and partyScoreType changes", () => {
      const updates = {
        partyBaseScore: 2,
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // party score is 2
        partyBaseScore: 2,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: -8,
          [Player.TYPE.OPPONENT]: 8,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the game score, if the partyScoreType changes.", () => {
      const updates = {
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 1,
            isWonByTaker: true,
            contra: 1,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.OPPONENT]: 1,
          [Player.TYPE.DECLARER]: -1,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 3,
            contra: 1,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.OPPONENT]: 3,
          [Player.TYPE.DECLARER]: -3,
        },
      });
      const current = Game.update(updates)(game);
      expect(current).toEqual(expected);
    });
  });

  describe("addContract", () => {
    it("should add a contract", () => {
      const contract = Contract.create({
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.DECLARER,
      });
      const game = GameFixture({
        contracts: [],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 2, // party's bid base score is the partyscore
          }),
        ],
      });

      const current = Game.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should add a second contract", () => {
      const contract = Contract.create({
        bidType: Bid.TYPE.FOUR_KING,
        taker: Player.TYPE.OPPONENT,
        partyScore: 2,
      });
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
        ],
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
          }),
        ],
      });

      const current = Game.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should caluclate contracts party score to null, if partyScoreType is not given to the game", () => {
      const contract = Contract.create({
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.DECLARER,
      });
      const game = GameFixture({
        contracts: [],
      });
      const expected = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: null,
          }),
        ],
      });

      const current = Game.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should calculate game score if, contact is won", () => {
      const contract = Contract.create({
        bidType: Bid.TYPE.PARTY,
        taker: Player.TYPE.DECLARER,
        partyScore: 1,
        isWonByTaker: true,
      });
      const game = GameFixture({
        contracts: [],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        playerTypeScores: {
          [Player.TYPE.DECLARER]: null,
          [Player.TYPE.OPPONENT]: null,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
            isWonByTaker: true,
            bidBaseScore: 2,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: 2,
          [Player.TYPE.OPPONENT]: -2,
        },
      });
      const current = Game.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
  });

  describe("removeContract", () => {
    it("should remove a contract by index", () => {
      const index = 1;
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
          // This contract will be removed below
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            taker: Player.TYPE.DECLARER,
          }),
        ],
      });
      const expected = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            taker: Player.TYPE.DECLARER,
          }),
        ],
      });

      const current = Game.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
    it("should not remove anything if the index does not exists", () => {
      const index = 4;
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            taker: Player.TYPE.DECLARER,
          }),
        ],
      });
      const expected = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            taker: Player.TYPE.DECLARER,
          }),
        ],
      });

      const current = Game.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
    it("should calculate the game score, contract is won", () => {
      const index = 1;
      const game = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 2,
            isWonByTaker: true,
          }),
          // This contract will be removed below
          ContractFixture({
            bidType: Bid.TYPE.PARTY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 1,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: 3,
          [Player.TYPE.OPPONENT]: -3,
        },
      });
      const expected = GameFixture({
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            bidBaseScore: 2,
            taker: Player.TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: 2,
          [Player.TYPE.OPPONENT]: -2,
        },
      });

      const current = Game.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
  });
  describe("updateGameContract", () => {
    it("should update the game contract", () => {
      const updated = ContractFixture({
        bidType: Bid.TYPE.FOUR_KING,
        isSilent: true,
      });
      const index = 0;
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            isSilent: false,
          }),
        ],
      });
      const expected = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            isSilent: true,
          }),
        ],
      });

      const current = Game.updateGameContractAt(game)(index)(updated);

      expect(current).toEqual(expected);
    });
    it("should re calculate if the updated contract is won and valid", () => {
      const updated = ContractFixture({
        bidType: Bid.TYPE.FOUR_KING,
        bidBaseScore: 2,
        contra: 2,
        taker: Player.TYPE.DECLARER,
        isWonByTaker: true,
      });
      const index = 0;
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 1,
            taker: Player.TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: 2,
          [Player.TYPE.OPPONENT]: -2,
        },
      });
      const expected = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 2,
            taker: Player.TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [Player.TYPE.DECLARER]: 4,
          [Player.TYPE.OPPONENT]: -4,
        },
      });
      const current = Game.updateGameContractAt(game)(index)(updated);
      expect(current).toEqual(expected);
    });
  });
  describe("calculateGame", () => {
    it("should return null, null if no contracts given", () => {
      const game = GameFixture({
        contracts: [],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: null,
        [Player.TYPE.OPPONENT]: null,
      };

      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should return null, null if the contract is not won / loose", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: null,
        [Player.TYPE.OPPONENT]: null,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should get the score for the opponents and the declarers too.", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: 8, // centrum - party
        [Player.TYPE.OPPONENT]: -8,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate multiple score per player type", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: 10 + 10 - 2 - 2 * 2, // centrum, ulti, -four king, -contra trull
        [Player.TYPE.OPPONENT]: -14,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if a contract is by a declarer lost.", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, -four king, -contra trull
        [Player.TYPE.OPPONENT]: 26,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if the first contract / player type still not won / lost.", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FURRY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.CATCH_THE_PAGAT,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: -10 + 25 - 2 * 2 - 4, // (?) centrum, - ulti, + furry, four king (?), - contra trull, - catch the pagat
        [Player.TYPE.OPPONENT]: -7,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should calculate the correct score, event if the second contract / player type is won / lost", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FURRY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.CATCH_THE_PAGAT,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: -10 + 25 - 2 - 4, // centrum, (?) ulti, + furry, - four king, (?) contra trull, - catch the pagat
        [Player.TYPE.OPPONENT]: -9,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should calculate the correct score, event if the last contract / player type is not won / lost", () => {
      const game = GameFixture({
        contracts: [
          ContractFixture({
            bidType: Bid.TYPE.CENTRUM,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.ULTI,
            bidVariant: Bid.SMALLEST_VARIANT.PAGAT,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FURRY,
            taker: Player.TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          ContractFixture({
            bidType: Bid.TYPE.FOUR_KING,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.TRULL,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
          ContractFixture({
            bidType: Bid.TYPE.CATCH_THE_PAGAT,
            taker: Player.TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
        ],
        partyScoreType: Game.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [Player.TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, (?) furry, - four king, - contra trull, (?) catch the pagat
        [Player.TYPE.OPPONENT]: 26,
      };
      const current = Game.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
  });
});
