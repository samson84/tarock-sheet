import * as playerModel from "./playerModel";
import { expectPlayer, playerFixture } from "../lib/test_data/fixtures";

export default describe("Player", () => {
  describe("createPlayer", () => {
    it("should create a player", () => {
      const expected = playerFixture({
        id: "notCheckedId",
        name: "",
        baseScore: 100,
        sessionScore: null,
        gameScore: null,
        type: null,
      });
      const current = playerModel.create();
      expectPlayer(current, expected);
    });
  });
  describe("updatePlayer", () => {
    it("should update the player", () => {
      const player = playerFixture({
        name: "someName",
        baseScore: 80,
        sessionScore: 70,
        gameScore: 120,
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const updates: playerModel.UpdatePlayerProps = {
        name: "Some other name",
        baseScore: 50,
        sessionScore: 60,
        gameScore: 90,
        type: playerModel.PLAYER_TYPE.DECLARER,
      };
      const expected = playerFixture({
        id: player.id,
        name: "Some other name",
        baseScore: 50,
        sessionScore: 60,
        gameScore: 90,
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const current = playerModel.update(updates)(player);

      expect(current).toEqual(expected);
    });
  });
  describe("addPlayer", () => {
    it("should add a player to the empty player list", () => {
      const playerList: playerModel.PlayerList = [];
      const player = playerFixture({
        name: "Csaba",
      });
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerModel.addPlayer(player)(playerList);

      expect(current).toEqual(expected);
    });
    it("should add a second player to the the player list", () => {
      const player1 = playerFixture({
        name: "Csaba",
      });
      const player2 = playerFixture({
        name: "Tamás",
      });
      const playerList: playerModel.PlayerList = [player1];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás" }),
      ];

      const current = playerModel.addPlayer(player2)(playerList);

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
      const playerList: playerModel.PlayerList = [player, removedPlayer];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerModel.removePlayer(removedPlayer)(playerList);

      expect(current).toEqual(expected);
    });
    it("should keep the original list, if the player don't exists.", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const wontRemovedPlayer = playerFixture({
        name: "Tamás",
      });
      const playerList: playerModel.PlayerList = [player];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerModel.removePlayer(wontRemovedPlayer)(playerList);

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
        gameScore: 50,
      });
      const updated = playerFixture({
        id: willBeUpdated.id,
        name: "Tamás",
        gameScore: 80,
      });
      const playerList: playerModel.PlayerList = [player, willBeUpdated];
      const expected = [
        playerFixture({ id: player.id, name: "Csaba" }),
        playerFixture({ id: updated.id, name: "Tamás", gameScore: 80 }),
      ];

      const current = playerModel.updatePlayerAt(updated)(playerList);

      expect(current).toEqual(expected);
    });
    it("should keep the original player list, if the player not exists in it by id", () => {
      const player1 = playerFixture({
        name: "Csaba",
      });
      const player2 = playerFixture({
        name: "Tamás",
        gameScore: 50,
      });
      const wontUpdated = playerFixture({
        id: "nonExistent",
        name: "André",
        gameScore: 80,
      });
      const playerList: playerModel.PlayerList = [player1, player2];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás", gameScore: 50 }),
      ];

      const current = playerModel.updatePlayerAt(wontUpdated)(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("getAnotherPlayerType", () => {
    it("should get the declarer player type, if opponent given", () => {
      const playerType = playerModel.PLAYER_TYPE.OPPONENT;
      const expected = playerModel.PLAYER_TYPE.DECLARER;

      const current = playerModel.getOppositeType(playerType);

      expect(current).toEqual(expected);
    });
    it("should get the opponent player type, if declarer given", () => {
      const playerType = playerModel.PLAYER_TYPE.DECLARER;
      const expected = playerModel.PLAYER_TYPE.OPPONENT;

      const current = playerModel.getOppositeType(playerType);

      expect(current).toEqual(expected);
    });
  });
  describe("rotatePlayerTypeWithNull", () => {
    it("should get opponent, if the player type is declarer", () => {
      const playerType = playerModel.PLAYER_TYPE.DECLARER;
      const expected = playerModel.PLAYER_TYPE.OPPONENT;

      const current = playerModel.rotateTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
    it("should get null, if the player type is opponent", () => {
      const playerType = playerModel.PLAYER_TYPE.OPPONENT;
      const expected = null;

      const current = playerModel.rotateTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
    it("should get declarer, if the player type is null", () => {
      const playerType = null;
      const expected = playerModel.PLAYER_TYPE.DECLARER;

      const current = playerModel.rotateTypeWithNull(playerType);

      expect(current).toEqual(expected);
    });
  });
  describe("getPlayerTypeByNumber", () => {
    it("should return 0, 0 if empty player list is given", () => {
      const playerList: playerModel.PlayerList = [];
      const expected = [0, 0];

      const current = playerModel.getPlayerNumberByType(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the correct number of declarers and opponents", () => {
      const playerList: playerModel.PlayerList = [
        playerFixture({
          name: "opponent 1",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          name: "opponent 2",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          name: "declarer 1",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          name: "declarer 2",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        playerFixture({
          name: "declarer 3",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        playerFixture({ name: "non playing", type: null }),
      ];
      const expected = [3, 2]; // declarer numbers, opponents number

      const current = playerModel.getPlayerNumberByType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("clearPlayersType", () => {
    it("should return the empty list, if the empty player list given", () => {
      const playerList: playerModel.PlayerList = [];
      const expected: playerModel.PlayerList = [];

      const current = playerModel.clearPlayersType(playerList);

      expect(current).toEqual(expected);
    });
    it("should set the player's type property to null", () => {
      const opponent = playerFixture({
        name: "opponent",
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const declarer = playerFixture({
        name: "declarer",
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const notPlaying = playerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        playerFixture({ id: opponent.id, name: "opponent", type: null }),
        playerFixture({ id: declarer.id, name: "declarer", type: null }),
        playerFixture({ id: notPlaying.id, name: "non playing", type: null }),
      ];

      const current = playerModel.clearPlayersType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("filterPlayersInGame", () => {
    it("should return empty list if the player list is empty", () => {
      const playerList: playerModel.PlayerList = [];
      const expected: playerModel.PlayerList = [];

      const current = playerModel.filterPlayersInGame(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the opponent and declarer players, but not null type players", () => {
      const opponent = playerFixture({
        name: "opponent",
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const declarer = playerFixture({
        name: "declarer",
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const notPlaying = playerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        playerFixture({
          id: opponent.id,
          name: "opponent",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        playerFixture({
          id: declarer.id,
          name: "declarer",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];

      const current = playerModel.filterPlayersInGame(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("createPlayerListObject", () => {
    it("should return an empty opject, if empty list given", () => {
      const playerList: playerModel.PlayerList = [];
      const expected = {};

      const current = playerModel.createPlayerListObject(playerList);

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

      const current = playerModel.createPlayerListObject(playerList);

      expect(current).toEqual(expected);
    });
  });
});
