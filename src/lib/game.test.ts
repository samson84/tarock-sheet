import { PLAYER_TYPE } from './player'

import { createGame, addPlayer, removePlayer, addContract } from "./game";

export default describe("game", () => {
  describe("createGame", () => {
    it("should create a game", () => {
      const expected = {
        contracts: [],
        declarers: [],
        opponents: [],
        party_score: null,
      };

      const current = createGame();

      expect(current).toEqual(expected);
    });
  });
  describe("addPlayer", () => {
    it("should add a declarer", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Csaba"],
        opponents: ["Laci"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Csaba", "Tomi"],
        opponents: ["Laci"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
    it("should not duplicate the declarer", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Tomi", "Csaba"],
        opponents: ["Laci"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Tomi", "Csaba"],
        opponents: ["Laci"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
    it("should add an opponent", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should not duplicate the opponent", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Tomi", "Csaba"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Tomi", "Csaba"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should remove existing declarer when adding an opponent", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.OPPONENT)(game);

      expect(current).toEqual(expected);
    });
    it("should remove existing opponent when adding a declarer", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
        party_score: null,
      };

      const current = addPlayer(player, PLAYER_TYPE.DECLARER)(game);

      expect(current).toEqual(expected);
    });
  });
  describe("removePlayer", () => {
    it("should remove the player from the declarers", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci", "Tomi"],
        opponents: ["Csaba"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba"],
        party_score: null,
      };

      const current = removePlayer(player)(game);

      expect(current).toEqual(expected);
    });
    it("should remove the player from the opponents", () => {
      const player = "Tomi";
      const game = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba", "Tomi"],
        party_score: null,
      };
      const expected = {
        contracts: [],
        declarers: ["Laci"],
        opponents: ["Csaba"],
        party_score: null,
      };

      const current = removePlayer(player)(game);

      expect(current).toEqual(expected);
    });
  });
})