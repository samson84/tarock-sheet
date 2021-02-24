import * as GameSession from "./GameSession";
import * as playerModel from "./playerModel";
import * as playerListModel from "./playerListModel";
import { GameFixture, PlayerFixture } from "./test_data/fixtures";

export default describe("gameScoreList", () => {
  describe("sumPlayerScores", () => {
    it("should return {} if gameScoreList empty", () => {
      const playerListObjectList: playerListModel.PlayerListObject[] = [];
      const expected: GameSession.GameSessionScore = {};
      const current = GameSession.calculateGameSessionScores(
        playerListObjectList
      );
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, one item", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [game1];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 10,
        "player-2-id": 10,
        "player-3-id": -10,
        "player-4-id": -10,
      };
      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, identical players", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: 16,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": 6,
      };

      const current = GameSession.calculateGameSessionScores(playerListObjects);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is new", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-5-id-new",
            name: "Akos",
            gameScore: 16,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
        "player-5-id-new": 16,
      };

      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is new", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-4-id-only-in-game1",
            name: "Akos",
            gameScore: 16,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-5-id-new-player",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": 16,
        "player-5-id-new-player": -10,
      };

      const current = GameSession.calculateGameSessionScores(playerListObjects);

      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, not exists in second", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-4-id-only-in-game1",
            name: "Akos",
            gameScore: null,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-5-id-only-in-game2",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": 0,
        "player-5-id-only-in-game2": -10,
      };

      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, not exists in first", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id-only-in-game1",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-5-id-only-in-game2",
            name: "Akos",
            gameScore: null,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id-only-in-game1": -10,
        "player-5-id-only-in-game2": 0,
      };
      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, second scores player is null, exists in first", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: null,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
      };
      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
    it("should return sum of player scores, multiple item, first scores player is null, exists in second", () => {
      const game1: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: 10,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -10,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: null,
          }),
        ]
      );
      const game2: playerListModel.PlayerListObject = playerListModel.mapToObjectById(
        [
          PlayerFixture({
            id: "player-1-id",
            name: "Csaba",
            gameScore: 16,
          }),
          PlayerFixture({
            id: "player-2-id",
            name: "Andre",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-3-id",
            name: "Dani",
            gameScore: -16,
          }),
          PlayerFixture({
            id: "player-4-id",
            name: "Tamas",
            gameScore: -10,
          }),
        ]
      );
      const playerListObjects: playerListModel.PlayerListObject[] = [
        game1,
        game2,
      ];
      const expected: GameSession.GameSessionScore = {
        "player-1-id": 26,
        "player-2-id": -6,
        "player-3-id": -26,
        "player-4-id": -10,
      };

      const current = GameSession.calculateGameSessionScores(playerListObjects);
      expect(current).toEqual(expected);
    });
  });
  describe("getCurrentScoreForPlayers", () => {
    it("should return empty object if no players given", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: null,
          [playerModel.PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const players: playerListModel.PlayerList = [];
      const expected: playerListModel.PlayerList = [];

      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 2-2", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 16,
          [playerModel.PLAYER_TYPE.OPPONENT]: -16,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: 16,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: 16,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: -16,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: -16,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 3 declarers win, 1 opponent loose.", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: -18,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 3 opponents win, 1 declarer loose", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -6,
          [playerModel.PLAYER_TYPE.OPPONENT]: 6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: 6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: -18,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];

      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 1 opponents win, 3 declarer loose", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: -6,
          [playerModel.PLAYER_TYPE.OPPONENT]: 6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: 18,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
      ];

      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should return the players scores, 1 declarers win, 3 opponents loose", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: 18,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null if no 4 players", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: 20,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: 40,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign nulls, if not 2-2 or 1-3 the declarer-opponent type players", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null, if the game's declarare score is null", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: null,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: 20,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: 30,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: 40,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null, if the game's opponent score is null", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: null,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: 10,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: 20,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: 30,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: 40,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const players = [player1, player2, player3, player4];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: null,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
    it("should assign null to the null type players (not playing in the current game)", () => {
      const game = GameFixture({
        playerTypeScores: {
          [playerModel.PLAYER_TYPE.DECLARER]: 6,
          [playerModel.PLAYER_TYPE.OPPONENT]: -6,
        },
      });
      const player1 = PlayerFixture({
        name: "Tamas",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player2 = PlayerFixture({
        name: "Csaba",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player3 = PlayerFixture({
        name: "Akos",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const player4 = PlayerFixture({
        name: "Attila",
        gameScore: null,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const player5 = PlayerFixture({
        name: "Laci",
        gameScore: null,
        type: null,
      });
      const players = [player1, player2, player3, player4, player5];
      const expected = [
        PlayerFixture({
          id: player1.id,
          name: "Tamas",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player2.id,
          name: "Csaba",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player3.id,
          name: "Akos",
          gameScore: -6,
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: player4.id,
          name: "Attila",
          gameScore: 18,
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          id: player5.id,
          name: "Laci",
          gameScore: null,
          type: null,
        }),
      ];
      const current = GameSession.mapGameScoreToPlayers(game)(players);

      expect(current).toEqual(expected);
    });
  });
});
