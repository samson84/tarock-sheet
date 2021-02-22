import * as playerListModel from "./playerListModel";
import * as playerModel from "./playerModel";
import { playerFixture } from "../lib/test_data/fixtures";

export default describe("playerListModel", () => {
  describe("add", () => {
    it("should add a player to the empty player list", () => {
      const playerList: playerListModel.PlayerList = [];
      const player = playerFixture({
        name: "Csaba",
      });
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.add(playerList)(player);

      expect(current).toEqual(expected);
    });
    it("should add a second player to the the player list", () => {
      const player1 = playerFixture({
        name: "Csaba",
      });
      const player2 = playerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player1];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás" }),
      ];

      const current = playerListModel.add(playerList)(player2);

      expect(current).toEqual(expected);
    });
  });
  describe("remove", () => {
    it("remove the player", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const removedPlayer = playerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player, removedPlayer];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.remove(playerList)(removedPlayer);

      expect(current).toEqual(expected);
    });
    it("should keep the original list, if the player don't exists.", () => {
      const player = playerFixture({
        name: "Csaba",
      });
      const wontRemovedPlayer = playerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player];
      const expected = [playerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.remove(playerList)(wontRemovedPlayer);

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
      const playerList: playerListModel.PlayerList = [player, willBeUpdated];
      const expected = [
        playerFixture({ id: player.id, name: "Csaba" }),
        playerFixture({ id: updated.id, name: "Tamás", gameScore: 80 }),
      ];

      const current = playerListModel.update(playerList)(updated);

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
      const playerList: playerListModel.PlayerList = [player1, player2];
      const expected = [
        playerFixture({ id: player1.id, name: "Csaba" }),
        playerFixture({ id: player2.id, name: "Tamás", gameScore: 50 }),
      ];

      const current = playerListModel.update(playerList)(wontUpdated);

      expect(current).toEqual(expected);
    });
  });
  describe("getPlayerTypeByNumber", () => {
    it("should return 0, 0 if empty player list is given", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected = [0, 0];

      const current = playerListModel.countByType(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the correct number of declarers and opponents", () => {
      const playerList: playerListModel.PlayerList = [
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

      const current = playerListModel.countByType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("clearPlayersType", () => {
    it("should return the empty list, if the empty player list given", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected: playerListModel.PlayerList = [];

      const current = playerListModel.clearPlayersType(playerList);

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

      const current = playerListModel.clearPlayersType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("filterPlayersInGame", () => {
    it("should return empty list if the player list is empty", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected: playerListModel.PlayerList = [];

      const current = playerListModel.filterPlayersInGame(playerList);

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

      const current = playerListModel.filterPlayersInGame(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("createPlayerListObject", () => {
    it("should return an empty opject, if empty list given", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected = {};

      const current = playerListModel.createPlayerListObject(playerList);

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

      const current = playerListModel.createPlayerListObject(playerList);

      expect(current).toEqual(expected);
    });
  });
});
