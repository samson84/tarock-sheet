import { contractFixture } from "./contract.test";
import { PLAYER_TYPE } from "./player";
import {
  createGame,
  addPlayer,
  removePlayer,
  addContract,
  PARTY_SCORE,
  CALLED_TAROCK,
  updateGame,
  removeContract,
} from "./game";
import { createContract } from "./contract";
import { BID_TYPE, getBid } from "./bid";

const gameFixture = (props = {}) => ({
  contracts: [],
  declarers: [],
  opponents: [],
  party_score: PARTY_SCORE.TOOK_THREE,
  called_tarock: null,
  ...props,
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
        party_score: PARTY_SCORE.SOLO,
        called_tarock: CALLED_TAROCK.XVIII
      }
      const expected = gameFixture({
        party_score: PARTY_SCORE.SOLO,
        called_tarock: CALLED_TAROCK.XVIII
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
        party_score: null,
        called_tarock: null,
      });
      const updates = {
        party_score: PARTY_SCORE.TOOK_TWO,
        called_tarock: CALLED_TAROCK.XX,
      };
      const expected = gameFixture({
        party_score: PARTY_SCORE.TOOK_TWO,
        called_tarock: CALLED_TAROCK.XX,
      });
      const current = updateGame(updates)(game);
      expect(current).toEqual(expected);
    });
    it("should recalculate the party score based contracts, if the party score changes", () => {
      const updates = {
        party_score: PARTY_SCORE.TOOK_ONE
      }
      const game = gameFixture({
        party_score: PARTY_SCORE.TOOK_TWO,
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 4
          })
        ]
      })
      const expected = gameFixture({
        party_score: PARTY_SCORE.TOOK_ONE, // party score is 3
        contracts: [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: PLAYER_TYPE.OPPONENT,
            bidBaseScore: 6 // double party doubles the party score
          })
        ]
      })
      const current = updateGame(updates)(game)
      expect(current).toEqual(expected)
    })
  });

  describe("addContract", () => {
    it("should add a contract", () => {
      const contract = createContract({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: 2
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
        partyScore: 2
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
  });

  describe("removeContract", () => {
    it("should remove a contract by index", () => {
      const index = 1;
      const game = gameFixture({
        contracts: [
          contractFixture({
            bid: getBid(BID_TYPE.PARTY),
            taker: PLAYER_TYPE.DECLARER,
          }),
          // This contract will be removed below
          contractFixture({
            bid: getBid(BID_TYPE.FOUR_KING),
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.ULTI),
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bid: getBid(BID_TYPE.PARTY),
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.ULTI),
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
            bid: getBid(BID_TYPE.PARTY),
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.FOUR_KING),
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.ULTI),
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });
      const expected = gameFixture({
        contracts: [
          contractFixture({
            bid: getBid(BID_TYPE.PARTY),
            taker: PLAYER_TYPE.DECLARER,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.FOUR_KING),
            taker: PLAYER_TYPE.OPPONENT,
          }),
          contractFixture({
            bid: getBid(BID_TYPE.ULTI),
            taker: PLAYER_TYPE.DECLARER,
          }),
        ],
      });

      const current = removeContract(game)(index);

      expect(current).toEqual(expected);
    });
  });
});
