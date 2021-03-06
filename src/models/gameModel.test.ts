import { contractFixture } from "../lib/test_data/fixtures";
import * as playerModel from "./playerModel";
import * as gameModel from "./gameModel";
import * as contractModel from "./contractModel";
import { BID_TYPE, SMALLEST_VARIANT } from "../lib/bid";
import { gameFixture } from "../lib/test_data/fixtures";

export default describe("game", () => {
  describe("createGame", () => {
    it("should create a game with default values", () => {
      const expected = gameFixture();

      const current = gameModel.create();

      expect(current).toEqual(expected);
    });
    it("should create a game with props", () => {
      const props = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.SOLO,
        called_tarock: gameModel.CALLED_TAROCK.XVIII,
      };
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.SOLO,
        called_tarock: gameModel.CALLED_TAROCK.XVIII,
      });

      const current = gameModel.create(props);

      expect(current).toEqual(expected);
    });
  });

  describe("updateGame", () => {
    it("should update the game", () => {
      const game = gameFixture({
        partyScoreType: null,
        partyBaseScore: 1,
        called_tarock: null,
      });
      const updates = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
        called_tarock: gameModel.CALLED_TAROCK.XX,
      };
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
        called_tarock: gameModel.CALLED_TAROCK.XX,
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and a game score, if the partyScoreType changes.", () => {
      const updates = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -4,
          [playerModel.PLAYER_TYPE.OPPONENT]: 4,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 12, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -12,
          [playerModel.PLAYER_TYPE.OPPONENT]: 12,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and the game score, if the partyBaseScore changes.", () => {
      const updates = {
        partyBaseScore: 2,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -4,
          [playerModel.PLAYER_TYPE.OPPONENT]: 4,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE, // score 1
        partyBaseScore: 2, // multiplier
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 8, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts and the game score, if the partyBaseScore and partyScoreType changes.", () => {
      const updates = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
        partyBaseScore: 2,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -4,
          [playerModel.PLAYER_TYPE.OPPONENT]: 4,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score 2
        partyBaseScore: 2, // multiplier
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 16, // double party 4 times the party score
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -16,
          [playerModel.PLAYER_TYPE.OPPONENT]: 16,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyScoreType changes", () => {
      const updates = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyBaseScore changes", () => {
      const updates = {
        partyBaseScore: 2,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE, // party score is 1
        partyBaseScore: 2,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party, partyBaseScore and partyScoreType changes", () => {
      const updates = {
        partyBaseScore: 2,
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        partyBaseScore: 1,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            isWonByTaker: true,
            contra: 4,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // party score is 2
        partyBaseScore: 2,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -8,
          [playerModel.PLAYER_TYPE.OPPONENT]: 8,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the game score, if the partyScoreType changes.", () => {
      const updates = {
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 1,
            isWonByTaker: true,
            contra: 1,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.OPPONENT]: 1,
          [playerModel.PLAYER_TYPE.DECLARER]: -1,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 3,
            contra: 1,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.OPPONENT]: 3,
          [playerModel.PLAYER_TYPE.DECLARER]: -3,
        },
      });
      const current = gameModel.update(updates)(game);
      expect(current).toEqual(expected);
    });
  });

  describe("addContract", () => {
    it("should add a contract", () => {
      const contract = contractModel.create({
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.DECLARER,
      });
      const game = gameFixture({
        contracts: [],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 2, // party's bid base score is the partyscore
          }),
        ],
      });

      const current = gameModel.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should add a second contract", () => {
      const contract = contractModel.create({
        bidType: BID_TYPE.FOUR_KING,
        taker: playerModel.PLAYER_TYPE.OPPONENT,
        partyScore: 2,
      });
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
          }),
        ],
      });

      const current = gameModel.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should caluclate contracts party score to null, if partyScoreType is not given to the game", () => {
      const contract = contractModel.create({
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.DECLARER,
      });
      const game = gameFixture({
        contracts: [],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: null,
          }),
        ],
      });

      const current = gameModel.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should calculate game score if, contact is won", () => {
      const contract = contractModel.create({
        bidType: BID_TYPE.PARTY,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        partyScore: 1,
        isWonByTaker: true,
      });
      const game = gameFixture({
        contracts: [],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: null,
          [playerModel.PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO, // score = 2
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            isWonByTaker: true,
            bidBaseScore: 2,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 2,
          [playerModel.PLAYER_TYPE.OPPONENT]: -2,
        },
      });
      const current = gameModel.addContract(game)(contract);

      expect(current).toEqual(expected);
    });
  });

  describe("removeContract", () => {
    it("should remove a contract by index", () => {
      const index = 1;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
          // This contract will be removed below
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = gameModel.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
    it("should not remove anything if the index does not exists", () => {
      const index = 4;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: playerModel.PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = gameModel.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
    it("should calculate the game score, contract is won", () => {
      const index = 1;
      const game = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 2,
            isWonByTaker: true,
          }),
          // This contract will be removed below
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 1,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 3,
          [playerModel.PLAYER_TYPE.OPPONENT]: -3,
        },
      });
      const expected = gameFixture({
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 2,
          [playerModel.PLAYER_TYPE.OPPONENT]: -2,
        },
      });

      const current = gameModel.removeContractAt(game)(index);

      expect(current).toEqual(expected);
    });
  });
  describe("updateGameContract", () => {
    it("should update the game contract", () => {
      const updated = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        isSilent: true,
      });
      const index = 0;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            isSilent: false,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            isSilent: true,
          }),
        ],
      });

      const current = gameModel.updateGameContractAt(game)(index)(updated);

      expect(current).toEqual(expected);
    });
    it("should re calculate if the updated contract is won and valid", () => {
      const updated = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        bidBaseScore: 2,
        contra: 2,
        taker: playerModel.PLAYER_TYPE.DECLARER,
        isWonByTaker: true,
      });
      const index = 0;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 1,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 2,
          [playerModel.PLAYER_TYPE.OPPONENT]: -2,
        },
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 2,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            isWonByTaker: true,
          }),
        ],
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 4,
          [playerModel.PLAYER_TYPE.OPPONENT]: -4,
        },
      });
      const current = gameModel.updateGameContractAt(game)(index)(updated);
      expect(current).toEqual(expected);
    });
  });
  describe("calculateGame", () => {
    it("should return null, null if no contracts given", () => {
      const game = gameFixture({
        contracts: [],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: null,
        [playerModel.PLAYER_TYPE.OPPONENT]: null,
      };

      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should return null, null if the contract is not won / loose", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: null,
        [playerModel.PLAYER_TYPE.OPPONENT]: null,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should get the score for the opponents and the declarers too.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: 8, // centrum - party
        [playerModel.PLAYER_TYPE.OPPONENT]: -8,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate multiple score per player type", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: 10 + 10 - 2 - 2 * 2, // centrum, ulti, -four king, -contra trull
        [playerModel.PLAYER_TYPE.OPPONENT]: -14,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if a contract is by a declarer lost.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, -four king, -contra trull
        [playerModel.PLAYER_TYPE.OPPONENT]: 26,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if the first contract / player type still not won / lost.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: -10 + 25 - 2 * 2 - 4, // (?) centrum, - ulti, + furry, four king (?), - contra trull, - catch the pagat
        [playerModel.PLAYER_TYPE.OPPONENT]: -7,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should calculate the correct score, event if the second contract / player type is won / lost", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: -10 + 25 - 2 - 4, // centrum, (?) ulti, + furry, - four king, (?) contra trull, - catch the pagat
        [playerModel.PLAYER_TYPE.OPPONENT]: -9,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });

    it("should calculate the correct score, event if the last contract / player type is not won / lost", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            isSilent: false,
            isWonByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: playerModel.PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            isSilent: false,
            isWonByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: playerModel.PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            isSilent: false,
            isWonByTaker: null,
          }),
        ],
        partyScoreType: gameModel.PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [playerModel.PLAYER_TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, (?) furry, - four king, - contra trull, (?) catch the pagat
        [playerModel.PLAYER_TYPE.OPPONENT]: 26,
      };
      const current = gameModel.calculatePlayerTypeScores(game);
      expect(current).toEqual(expected);
    });
  });
});
