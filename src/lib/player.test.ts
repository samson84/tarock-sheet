import { clear } from "console";
import {
  addPlayer,
  clearPlayersType,
  createPlayer,
  createPlayerListObject,
  filterPlayersInGame,
  getAnotherPlayerType,
  getPlayerNumberByType,
  PlayerList,
  PlayerListObject,
  PLAYER_TYPE,
  removePlayer,
  rotatePlayerTypeWithNull,
  updatePlayer,
  updatePlayerAt,
} from "./player";
import { expectPlayer, playerFixture } from "./test_data/fixtures";

export default describe("Player", () => {
  describe("createPlayer", () => {
    it("should create a player", () => {
      const expected = playerFixture({
        id: "notCheckedId",
        name: "",
        baseScore: 100,
        score: null,
        currentScore: null,
        type: null,
      });
      const current = createPlayer();
      expectPlayer(current, expected);
    });
  });
  describe("updatePlayer", () => {
    it("should update the player", () => {
      const player = playerFixture({
        name: "someName",
        baseScore: 80,
        score: 70,
        currentScore: 120,
        type: PLAYER_TYPE.OPPONENT,
      });
      const updates = {
        name: "Some other name",
        baseScore: 50,
        score: 60,
        currentScore: 90,
        type: PLAYER_TYPE.DECLARER,
      };
      const expected = playerFixture({
        id: player.id,
        name: "Some other name",
        baseScore: 50,
        score: 60,
        currentScore: 90,
        type: PLAYER_TYPE.DECLARER,
      });
      const current = updatePlayer(updates)(player);

      expect(current).toEqual(expected);
    });
  });
  describe("addPlayer", () => {
    it("should add a player to the empty player list", () => {
      const playerList: PlayerList = [];
      const player = playerFixture({
        name: "Csaba",
      });
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = addPlayer(player)(playerList);

      expect(current).toEqual(expected);
    });
    it("should add a second player to the the player list", () => {
      const player1 = playerFixture({
        name: "Csaba",
      });
      const player2 = playerFixture({
        name: "Tamás",
      });
      const playerList: PlayerList = [player1];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás" }),
      ];

      const current = addPlayer(player2)(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("removePlayer", () => {
    it("remove the player", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const removedPlayer = playerFixture({
        name: "Tamás",
      });
      const playerList: PlayerList = [player, removedPlayer];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = removePlayer(removedPlayer)(playerList);

      expect(current).toEqual(expected);
    });
    it("should keep the original list, if the player don't exists.", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const wontRemovedPlayer = playerFixture({
        name: "Tamás",
      });
      const playerList: PlayerList = [player];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = removePlayer(wontRemovedPlayer)(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("udpatedPlayerAt", () => {
    it("should update player", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const willBeUpdated = playerFixture({
        name: "Tamás",
        currentScore: 50,
      });
      const updated = playerFixture({
        id: willBeUpdated.id,
        name: "Tamás",
        currentScore: 80,
      });
      const playerList: PlayerList = [player, willBeUpdated];
      const expected = [
        playerFixture({ id: player.id, name: "Csaba" }),
        playerFixture({ id: updated.id, name: "Tamás", currentScore: 80 }),
      ];

      const current = updatePlayerAt(updated)(playerList);

      expect(current).toEqual(expected);
    });
    it("should keep the original player list, if the player not exists in it by id", () => {
      const player1 = playerFixture({
        name: "Csaba",
      });
      const player2 = playerFixture({
        name: "Tamás",
        currentScore: 50,
      });
      const wontUpdated = playerFixture({
        id: "nonExistent",
        name: "André",
        currentScore: 80,
      });
      const playerList: PlayerList = [player1, player2];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás", currentScore: 50 }),
      ];

      const current = updatePlayerAt(wontUpdated)(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("getAnotherPlayerType", () => {
    it("should get the declarer player type, if opponent given", () => {
      const playerType = PLAYER_TYPE.OPPONENT;
      const expected = PLAYER_TYPE.DECLARER;

      const current = getAnotherPlayerType(playerType);

      expect(current).toEqual(expected);
    });
    it("should get the opponent player type, if declarer given", () => {
      const playerType = PLAYER_TYPE.DECLARER;
      const expected = PLAYER_TYPE.OPPONENT;

      const current = getAnotherPlayerType(playerType);

      expect(current).toEqual(expected);
    });
  });
  describe("rotatePlayerTypeWithNull", () => {
    it("should get opponent, if the player type is declarer", () => {
      const playerType = PLAYER_TYPE.DECLARER;
      const expected = PLAYER_TYPE.OPPONENT;

      const current = rotatePlayerTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
    it("should get null, if the player type is opponent", () => {
      const playerType = PLAYER_TYPE.OPPONENT;
      const expected = null;

      const current = rotatePlayerTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
    it("should get declarer, if the player type is null", () => {
      const playerType = null;
      const expected = PLAYER_TYPE.DECLARER;

      const current = rotatePlayerTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
  });
  describe("getPlayerTypeByNumber", () => {
    it("should return 0, 0 if empty player list is given", () => {
      const playerList: PlayerList = [];
      const expected = [0, 0];

      const current = getPlayerNumberByType(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the correct number of declarers and opponents", () => {
      const playerList: PlayerList = [
        playerFixture({ name: "opponent 1", type: PLAYER_TYPE.OPPONENT }),
        playerFixture({ name: "opponent 2", type: PLAYER_TYPE.OPPONENT }),
        playerFixture({ name: "declarer 1", type: PLAYER_TYPE.DECLARER }),
        playerFixture({ name: "declarer 2", type: PLAYER_TYPE.DECLARER }),
        playerFixture({ name: "declarer 3", type: PLAYER_TYPE.DECLARER }),
        playerFixture({ name: "non playing", type: null }),
      ];
      const expected = [3, 2]; // declarer numbers, opponents number

      const current = getPlayerNumberByType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("clearPlayersType", () => {
    it("should return the empty list, if the empty player list given", () => {
      const playerList: PlayerList = [];
      const expected: PlayerList = [];

      const current = clearPlayersType(playerList);

      expect(current).toEqual(expected);
    });
    it("should set the player's type property to null", () => {
      const opponent = playerFixture({
        name: "opponent",
        type: PLAYER_TYPE.OPPONENT,
      });
      const declarer = playerFixture({
        name: "declarer",
        type: PLAYER_TYPE.DECLARER,
      });
      const notPlaying = playerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        playerFixture({ id: opponent.id, name: "opponent", type: null }),
        playerFixture({ id: declarer.id, name: "declarer", type: null }),
        playerFixture({ id: notPlaying.id, name: "non playing", type: null }),
      ];

      const current = clearPlayersType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("filterPlayersInGame", () => {
    it("should return empty list if the player list is empty", () => {
      const playerList: PlayerList = [];
      const expected: PlayerList = [];

      const current = filterPlayersInGame(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the opponent and declarer players, but not null type players", () => {
      const opponent = playerFixture({
        name: "opponent",
        type: PLAYER_TYPE.OPPONENT,
      });
      const declarer = playerFixture({
        name: "declarer",
        type: PLAYER_TYPE.DECLARER,
      });
      const notPlaying = playerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        playerFixture({
          id: opponent.id,
          name: "opponent",
          type: PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: declarer.id,
          name: "declarer",
          type: PLAYER_TYPE.DECLARER,
        }),
      ];

      const current = filterPlayersInGame(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("createPlayerListObject", () => {
    it("should return an empty opject, if empty list given", () => {
      const playerList: PlayerList = [];
      const expected = {};

      const current = createPlayerListObject(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the player list as object, the keys should be the player's ids", () => {
      const player1 = playerFixture({ name: "Csaba" });
      const player2 = playerFixture({ name: "Attila" });
      const playerList = [player1, player2];
      const expected = {
        [player1.id]: playerFixture({ id: player1.id, name: "Csaba" }),
        [player2.id]: playerFixture({ id: player2.id, name: "Attila" }),
      };

      const current = createPlayerListObject(playerList);

      expect(current).toEqual(expected);
    });
  });
});