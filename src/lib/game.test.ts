import { contractFixture } from "./test_data/fixtures";
import { PLAYER_TYPE } from "./player";
import {
  createGame,
  addPlayer,
  removePlayer,
  addContract,
  PARTY_SCORE_TYPE,
  CALLED_TAROCK,
  updateGame,
  removeContract,
  updateGameContract,
  Game,
  updateValidations,
  calculateGame,
} from "./game";
import { createContract } from "./contract";
import { BID_TYPE, SMALLEST_VARIANT } from "./bid";

const gameFixture = (props: Partial<Game> = {}): Game => ({
  contracts: [],
  declarers: [],
  opponents: [],
  partyScoreType: null,
  called_tarock: null,
  ...props,
  scores: props.scores
    ? { ...props.scores }
    : {
        [PLAYER_TYPE.DECLARER]: null,
        [PLAYER_TYPE.OPPONENT]: null,
      },
});

export default describe("game", () => {
  describe("createGame", () => {
    it("should create a game with default values", () => {
      const expected = gameFixture();

      const current = createGame();

      expect(current).toEqual(expected);
    });
    it("should create a game with props", () => {
      const props = {
        partyScoreType: PARTY_SCORE_TYPE.SOLO,
        called_tarock: CALLED_TAROCK.XVIII,
      };
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.SOLO,
        called_tarock: CALLED_TAROCK.XVIII,
      });

      const current = createGame(props);

      expect(current).toEqual(expected);
    });
  });

  describe("addPlayer", () => {
    it("should add a declarer", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Csaba"],
        opponents: ["Laci"],
      });
      const expected = gameFixture({
        declarers: ["Csaba", "Tomi"],
        opponents: ["Laci"],
      });

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
    it("should not duplicate the declarer", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Tomi", "Csaba"],
        opponents: ["Laci"],
      });
      const expected = gameFixture({
        declarers: ["Tomi", "Csaba"],
        opponents: ["Laci"],
      });

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
    it("should add an opponent", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba"],
      });
      const expected = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
      });

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should not duplicate the opponent", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci"],
        opponents: ["Tomi", "Csaba"],
      });
      const expected = gameFixture({
        declarers: ["Laci"],
        opponents: ["Tomi", "Csaba"],
      });

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should remove existing declarer when adding an opponent", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
      });
      const expected = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
      });

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should remove existing opponent when adding a declarer", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
      });
      const expected = gameFixture({
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
      });

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
  });

  describe("removePlayer", () => {
    it("should remove the player from the declarers", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
      });
      const expected = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba"],
      });

      const current = removePlayer(player)(game);

      expect(current).toEqual(expected);
    });
    it("should remove the player from the opponents", () => {
      const player = "Tomi";
      const game = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
      });
      const expected = gameFixture({
        declarers: ["Laci"],
        opponents: ["Csaba"],
      });

      const current = removePlayer(player)(game);

      expect(current).toEqual(expected);
    });
  });

  describe("updateGame", () => {
    it("should update the game", () => {
      const game = gameFixture({
        partyScoreType: null,
        called_tarock: null,
      });
      const updates = {
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
        called_tarock: CALLED_TAROCK.XX,
      };
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
        called_tarock: CALLED_TAROCK.XX,
      });
      const current = updateGame(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts, if the party score changes", () => {
      const updates = {
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
          }),
        ],
      });
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 12, // double party 4 times the party score
          }),
        ],
      });
      const current = updateGame(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should keep the contracts bidBaseScore, when the contract independent from the party", () => {
      const updates = {
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            winByTaker: true,
            contra: 4,
          }),
        ],
      });
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2, // trull PARTY_SCORE is independent
            contra: 4,
            winByTaker: true,
          }),
        ],
      });
      const current = updateGame(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the game score, if party value changes", () => {
      const updates = {
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE,
      };
      const game = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 1,
            winByTaker: true,
            contra: 1,
            validInFinalScore: true,
          }),
        ],
        scores: {
          [PLAYER_TYPE.OPPONENT]: 1,
          [PLAYER_TYPE.DECLARER]: -1,
        },
      });
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_ONE, // party score is 3
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 3,
            contra: 1,
            winByTaker: true,
            validInFinalScore: true,
          }),
        ],
        scores: {
          [PLAYER_TYPE.OPPONENT]: 3,
          [PLAYER_TYPE.DECLARER]: -3,
        },
      });
      const current = updateGame(updates)(game);
      expect(current).toEqual(expected);
    });
  });

  describe("addContract", () => {
    it("should add a contract", () => {
      const contract = createContract({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: 2,
      });
      const game = gameFixture({
        contracts: [],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should add a second contract", () => {
      const contract = createContract({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: 2,
      });
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
          }),
        ],
      });

      const current = addContract(game)(contract);

      expect(current).toEqual(expected);
    });
    it("should calculate game score if, contact is won and valid", () => {
      const contract = createContract({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: 1,
        validInFinalScore: true,
        winByTaker: true
      });
      const game = gameFixture({
        contracts: [],
        scores: {
          [PLAYER_TYPE.DECLARER]: null,
          [PLAYER_TYPE.OPPONENT]: null
        }
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
            validInFinalScore: true,
            winByTaker: true,
            bidBaseScore: 1
          }),
        ],
        scores: {
          [PLAYER_TYPE.DECLARER]: 1,
          [PLAYER_TYPE.OPPONENT]: -1
        }
      });
      const current = addContract(game)(contract);

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
            taker: PLAYER_TYPE.DECLARER,
          }),
          // This contract will be removed below
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = removeContract(game)(index);

      expect(current).toEqual(expected);
    });
    it("should not remove anything if the index does not exists", () => {
      const index = 4;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = removeContract(game)(index);

      expect(current).toEqual(expected);
    });
    it("should calculate the game score, contract is won and valid", () => {
      const index = 1;
      const game = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 2,
            winByTaker: true,
            validInFinalScore: true
          }),
          // This contract will be removed below
          contractFixture({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 1,
            winByTaker: true,
            validInFinalScore: true
          }),
        ],
        scores: {
          [PLAYER_TYPE.DECLARER]: 3,
          [PLAYER_TYPE.OPPONENT]: -3
        }
      });
      const expected = gameFixture({
        partyScoreType: PARTY_SCORE_TYPE.TOOK_THREE,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            taker: PLAYER_TYPE.DECLARER,
            winByTaker: true,
            validInFinalScore: true
          }),
        ],
        scores: {
          [PLAYER_TYPE.DECLARER]: 2,
          [PLAYER_TYPE.OPPONENT]: -2
        }
      });

      const current = removeContract(game)(index);

      expect(current).toEqual(expected);
    })
  });
  describe("updateGameContract", () => {
    it("should update the game contract", () => {
      const updated = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        silent: true,
      });
      const index = 0;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            silent: false,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            silent: true,
          }),
        ],
      });

      const current = updateGameContract(game)(index)(updated);

      expect(current).toEqual(expected);
    });
    it("should re calculate if the updated contract is won and valid", () => {
      const updated = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        bidBaseScore: 2,
        contra: 2,
        taker: PLAYER_TYPE.DECLARER,
        winByTaker: true,
        validInFinalScore: true
      });
      const index = 0;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 1,
            taker: PLAYER_TYPE.DECLARER,
            winByTaker: true,
            validInFinalScore: true
          })
        ],
        scores: {
          [PLAYER_TYPE.DECLARER]: 2,
          [PLAYER_TYPE.OPPONENT]: -2
        }
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            bidBaseScore: 2,
            contra: 2,
            taker: PLAYER_TYPE.DECLARER,
            winByTaker: true,
            validInFinalScore: true
          }),
        ],
        scores: {
          [PLAYER_TYPE.DECLARER]: 4,
          [PLAYER_TYPE.OPPONENT]: -4
        }
      });
      const current = updateGameContract(game)(index)(updated);
      expect(current).toEqual(expected);
    })
  });
  describe("calculateGame", () => {
    it("should return null, null if no contracts given", () => {
      const game = gameFixture({
        contracts: [],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: null,
        [PLAYER_TYPE.OPPONENT]: null,
      };

      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should return null, null if the contracts are not valid", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: null,
        [PLAYER_TYPE.OPPONENT]: null,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should return null, null if the contract is not won / loose", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: null,
        [PLAYER_TYPE.OPPONENT]: null,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should get the score for the opponents and the declarers too.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: 8, // centrum - party
        [PLAYER_TYPE.OPPONENT]: -8,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate multiple score per player type", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: 10 + 10 - 2 - 2 * 2, // centrum, ulti, -four king, -contra trull
        [PLAYER_TYPE.OPPONENT]: -14,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if a contract is by a declarer lost.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, -four king, -contra trull
        [PLAYER_TYPE.OPPONENT]: 26,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, even if the first contract / player type still not won / lost.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 + 25 - 2 * 2 - 4, // (?) centrum, - ulti, + furry, four king (?), - contra trull, - catch the pagat
        [PLAYER_TYPE.OPPONENT]: -7,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, event if the first contract / player type is not valid in final score", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 + 25 - 2 * 2 - 4, // (?) centrum, - ulti, + furry, four king (?), - contra trull, - catch the pagat
        [PLAYER_TYPE.OPPONENT]: -7,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, event if the second contract / player type is not valid in final score", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 + 25 - 2 - 4, // centrum, (?) ulti, + furry, - four king, (?) contra trull, - catch the pagat
        [PLAYER_TYPE.OPPONENT]: -9,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, event if the second contract / player type is won / lost", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 + 25 - 2 - 4, // centrum, (?) ulti, + furry, - four king, (?) contra trull, - catch the pagat
        [PLAYER_TYPE.OPPONENT]: -9,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, event if the last contract / player type is not valid in the final score.", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: false,
            winByTaker: true,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, (?) furry, - four king, - contra trull, (?) catch the pagat
        [PLAYER_TYPE.OPPONENT]: 26,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
    it("should calculate the correct score, event if the last contract / player type is not won / lost", () => {
      const game = gameFixture({
        contracts: [
          contractFixture({
            bidType: BID_TYPE.CENTRUM,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.ULTI,
            bidVariant: SMALLEST_VARIANT.PAGAT,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 10,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: false,
          }),
          contractFixture({
            bidType: BID_TYPE.FURRY,
            taker: PLAYER_TYPE.DECLARER,
            bidBaseScore: 25,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
          contractFixture({
            bidType: BID_TYPE.FOUR_KING,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 2,
            contra: 2,
            silent: false,
            validInFinalScore: true,
            winByTaker: true,
          }),
          contractFixture({
            bidType: BID_TYPE.CATCH_THE_PAGAT,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4,
            contra: 1,
            silent: false,
            validInFinalScore: true,
            winByTaker: null,
          }),
        ],
        partyScoreType: PARTY_SCORE_TYPE.TOOK_TWO,
      });
      const expected = {
        [PLAYER_TYPE.DECLARER]: -10 - 10 - 2 - 2 * 2, // - centrum, - ulti, (?) furry, - four king, - contra trull, (?) catch the pagat
        [PLAYER_TYPE.OPPONENT]: 26,
      };
      const current = calculateGame(game);
      expect(current).toEqual(expected);
    });
  });
});
