import {
  getCurrentScoreForPlayers,
  PlayerScores,
  sumPlayerScores,
} from "./gameScoreList";
import {
  createPlayerListObject,
  PlayerListObject,
  PLAYER_TYPE,
  PlayerList,
} from "./player";
import { gameFixture, playerFixture } from "./test_data/fixtures";

export default describe("gameScoreList", () => {
  describe("sumPlayerScores", () => {
    it("should return {} if gameScoreList empty", () => {
      const playerListObjectList: PlayerListObject[] = [];
      const expected: PlayerScores = {};
      const current = sumPlayerScores(playerListObjectList);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, one item", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1];
      const expected: PlayerScores = {
        "player-1-id": 10,
        "player-2-id": 10,
        "player-3-id": -10,
        "player-4-id": -10,
      };
      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, identical players", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: 16,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": 6,
      };

      const current = sumPlayerScores(playerListObjects);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is new", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-5-id-new",
          name: "Akos",
          currentScore: 16,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
        "player-5-id-new": 16,
      };

      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is new", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-4-id-only-in-game1",
          name: "Akos",
          currentScore: 16,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-5-id-new-player",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": 16,
        "player-5-id-new-player": -10,
      };

      const current = sumPlayerScores(playerListObjects);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, not exists in second", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-4-id-only-in-game1",
          name: "Akos",
          currentScore: null,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-5-id-only-in-game2",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": 0,
        "player-5-id-only-in-game2": -10,
      };

      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, not exists in first", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id-only-in-game1",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-5-id-only-in-game2",
          name: "Akos",
          currentScore: null,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": -10,
        "player-5-id-only-in-game2": 0,
      };
      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, exists in first", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: null,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
      };
      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, exists in second", () => {
      const game1: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: 10,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -10,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: null,
        }),
      ]);
      const game2: PlayerListObject = createPlayerListObject([
        playerFixture({
          id: "player-1-id",
          name: "Csaba",
          currentScore: 16,
        }),
        playerFixture({
          id: "player-2-id",
          name: "Andre",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-3-id",
          name: "Dani",
          currentScore: -16,
        }),
        playerFixture({
          id: "player-4-id",
          name: "Tamas",
          currentScore: -10,
        }),
      ]);
      const playerListObjects: PlayerListObject[] = [game1, game2];
      const expected: PlayerScores = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
      };

      const current = sumPlayerScores(playerListObjects);
      expect(current).toEqual(expected);
    });
  });
  describe("getCurrentScoreForPlayers", () => {
    it("should return empty object if no players given", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: null,
          [PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const players: PlayerList = [];
      const expected: PlayerList = [];

      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 2-2", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 16,
          [PLAYER_TYPE.OPPONENT]: -16,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: 16,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: 16,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: -16,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: -16,
          type: PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 3 declarers win, 1 opponent loose.", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: 6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: 6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: 6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: -18,
          type: PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 3 opponents win, 1 declarer loose", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: -6,
          [PLAYER_TYPE.OPPONENT]: 6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: 6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: 6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: 6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: -18,
          type: PLAYER_TYPE.DECLARER,
        }),
      ];

      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 1 opponents win, 3 declarer loose", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: -6,
          [PLAYER_TYPE.OPPONENT]: 6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: -6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: -6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: -6,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: 18,
          type: PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 1 declarers win, 3 opponents loose", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: 18,
          type: PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null if no 4 players", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: 20,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: 40,
        type: PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: null,
          type: PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign nulls, if not 2-2 or 1-3 the declarer-opponent type players", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null, if the game's declarare score is null", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: null,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: 20,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: 30,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: 40,
        type: PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: null,
          type: PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null, if the game's opponent score is null", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: 10,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: 20,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: 30,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: 40,
        type: PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: null,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: null,
          type: PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null to the null type players (not playing in the current game)", () => {
      const game = gameFixture({
        scores: {
          [PLAYER_TYPE.DECLARER]: 6,
          [PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = playerFixture({
        name: "Tamas",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player2 = playerFixture({
        name: "Csaba",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player3 = playerFixture({
        name: "Akos",
        currentScore: null,
        type: PLAYER_TYPE.OPPONENT,
      });
      const player4 = playerFixture({
        name: "Attila",
        currentScore: null,
        type: PLAYER_TYPE.DECLARER,
      });
      const player5 = playerFixture({
        name: "Laci",
        currentScore: null,
        type: null,
      });
      const players = [player1, player2, player3, player4, player5];
      const expected = [
        playerFixture({
          id: player1.id,
          name: "Tamas",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player2.id,
          name: "Csaba",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player3.id,
          name: "Akos",
          currentScore: -6,
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: player4.id,
          name: "Attila",
          currentScore: 18,
          type: PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          id: player5.id,
          name: "Laci",
          currentScore: null,
          type: null,
        }),
      ];
      const current = getCurrentScoreForPlayers(game)(players);

      expect(current).toEqual(expected);
    });
  });
});
