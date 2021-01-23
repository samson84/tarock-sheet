import {
  GameScorePerPlayer,
  getAllPlayers,
  getPlayersScores,
  sumPlayerScores,
} from "./gameList";
import { PLAYER_TYPE } from "./player";
import { gameFixture } from "./test_data/fixtures";
import sortBy from "lodash/fp/sortBy";

const sorter = sortBy([]);

export default describe("gameList", () => {
  describe("getPlayerScore", () => {
    it("should return empty object if no players given", () => {
      const game = gameFixture({
        declarers: [],
        opponents: [],
        scores: {
          [PLAYER_TYPE.DECLARER]: null,
          [PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const expected = {};

      const current = getPlayersScores(game);

      expect(current).toEqual(expected);
    });
    it("should return the players scores", () => {
      const game = gameFixture({
        declarers: ["Tamas", "Csaba"],
        opponents: ["Akos", "Attila"],
        scores: {
          [PLAYER_TYPE.DECLARER]: 16,
          [PLAYER_TYPE.OPPONENT]: -16,
        },
      });
      const expected = {
        Tamas: 16,
        Csaba: 16,
        Akos: -16,
        Attila: -16,
      };

      const current = getPlayersScores(game);

      expect(current).toEqual(expected);
    });
  });
  describe("getAllPLayers", () => {
    it("should return [], if empty gameSocreList given", () => {
      const gameScoreList: GameScorePerPlayer[] = [];
      const expected: string[] = [];

      const current = getAllPlayers(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return all players, order not fixed", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 16,
          Attila: 16,
          Akos: -16,
          Andre: -16,
        },
        {
          Csaba: 10,
          Attila: 10,
          Dani: -10, // missing from the previous
          Tamas: -10, // missing from the previous
        },
      ];
      const expected: string[] = [
        "Csaba",
        "Attila",
        "Akos",
        "Andre",
        "Dani",
        "Tamas",
      ];

      const current = getAllPlayers(gameScoreList);

      expect(sorter(current)).toEqual(sorter(expected));
    });
  });
  describe("sumPlayerScores", () => {
    it("should return {} if gameScoreList empty", () => {
      const gameScoreList: GameScorePerPlayer[] = [];
      const expected: GameScorePerPlayer = {};

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, one item", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 10,
        Andre: 10,
        Dani: -10,
        Tamas: -10,
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, identical players", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Tamas: 16,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: 6,
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is new", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Akos: 16, // not exists in prev
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
        Akos: 16, // not exists in prev
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is new", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Akos: 16, // not exists in next
        },
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
        Akos: 16, // not exists in next
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, not exists in second", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Akos: null, // not exists in next
        },
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
        Akos: 0, // not exists in next
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, not exists in first", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Akos: null, // not exists in prev
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
        Akos: 0, // not exists in prev
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, exists in first", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Tamas: null,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, exists in second", () => {
      const gameScoreList: GameScorePerPlayer[] = [
        {
          Csaba: 16,
          Andre: -16,
          Dani: -16,
          Tamas: null,
        },
        {
          Csaba: 10,
          Andre: 10,
          Dani: -10,
          Tamas: -10,
        },
      ];
      const expected: GameScorePerPlayer = {
        Csaba: 26,
        Andre: -6,
        Dani: -26,
        Tamas: -10,
      };

      const current = sumPlayerScores(gameScoreList);

      expect(current).toEqual(expected);
    });
  });
});
