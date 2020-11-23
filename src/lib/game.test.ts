import { PLAYER_TYPE } from "./player";

import { createGame, addPlayer, removePlayer, addContract } from "./game";

const gameFixture = (main = {}, props = {}) => ({
  contracts: [],
  declarers: [],
  opponents: [],
  ...main,
  props: {
    party_score: null,
    called_card: null,
    ...props,
  },
});

export default describe("game", () => {
  describe("createGame", () => {
    it("should create a game", () => {
      const expected = gameFixture();

      const current = createGame();

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
});
