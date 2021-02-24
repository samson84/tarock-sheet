import * as playerListModel from "./playerListModel";
import * as playerModel from "./playerModel";
import { PlayerFixture } from "./test_data/fixtures";

export default describe("playerListModel", () => {
  describe("add", () => {
    it("should add a player to the empty player list", () => {
      const playerList: playerListModel.PlayerList = [];
      const player = PlayerFixture({
        name: "Csaba",
      });
      const expected = [PlayerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.add(playerList)(player);

      expect(current).toEqual(expected);
    });
    it("should add a second player to the the player list", () => {
      const player1 = PlayerFixture({
        name: "Csaba",
      });
      const player2 = PlayerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player1];
      const expected = [
        PlayerFixture({ id: player1.id, name: "Csaba" }),
        PlayerFixture({ id: player2.id, name: "Tamás" }),
      ];

      const current = playerListModel.add(playerList)(player2);

      expect(current).toEqual(expected);
    });
  });
  describe("remove", () => {
    it("remove the player", () => {
      const player = PlayerFixture({
        name: "Csaba",
      });
      const removedPlayer = PlayerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player, removedPlayer];
      const expected = [PlayerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.remove(playerList)(removedPlayer);

      expect(current).toEqual(expected);
    });
    it("should keep the original list, if the player don't exists.", () => {
      const player = PlayerFixture({
        name: "Csaba",
      });
      const wontRemovedPlayer = PlayerFixture({
        name: "Tamás",
      });
      const playerList: playerListModel.PlayerList = [player];
      const expected = [PlayerFixture({ id: player.id, name: "Csaba" })];

      const current = playerListModel.remove(playerList)(wontRemovedPlayer);

      expect(current).toEqual(expected);
    });
  });
  describe("udpatedPlayerAt", () => {
    it("should update player", () => {
      const player = PlayerFixture({
        name: "Csaba",
      });
      const willBeUpdated = PlayerFixture({
        name: "Tamás",
        gameScore: 50,
      });
      const updated = PlayerFixture({
        id: willBeUpdated.id,
        name: "Tamás",
        gameScore: 80,
      });
      const playerList: playerListModel.PlayerList = [player, willBeUpdated];
      const expected = [
        PlayerFixture({ id: player.id, name: "Csaba" }),
        PlayerFixture({ id: updated.id, name: "Tamás", gameScore: 80 }),
      ];

      const current = playerListModel.update(playerList)(updated);

      expect(current).toEqual(expected);
    });
    it("should keep the original player list, if the player not exists in it by id", () => {
      const player1 = PlayerFixture({
        name: "Csaba",
      });
      const player2 = PlayerFixture({
        name: "Tamás",
        gameScore: 50,
      });
      const wontUpdated = PlayerFixture({
        id: "nonExistent",
        name: "André",
        gameScore: 80,
      });
      const playerList: playerListModel.PlayerList = [player1, player2];
      const expected = [
        PlayerFixture({ id: player1.id, name: "Csaba" }),
        PlayerFixture({ id: player2.id, name: "Tamás", gameScore: 50 }),
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
        PlayerFixture({
          name: "opponent 1",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          name: "opponent 2",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          name: "declarer 1",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          name: "declarer 2",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({
          name: "declarer 3",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
        PlayerFixture({ name: "non playing", type: null }),
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

      const current = playerListModel.clearType(playerList);

      expect(current).toEqual(expected);
    });
    it("should set the player's type property to null", () => {
      const opponent = PlayerFixture({
        name: "opponent",
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const declarer = PlayerFixture({
        name: "declarer",
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const notPlaying = PlayerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        PlayerFixture({ id: opponent.id, name: "opponent", type: null }),
        PlayerFixture({ id: declarer.id, name: "declarer", type: null }),
        PlayerFixture({ id: notPlaying.id, name: "non playing", type: null }),
      ];

      const current = playerListModel.clearType(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("filterPlayersInGame", () => {
    it("should return empty list if the player list is empty", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected: playerListModel.PlayerList = [];

      const current = playerListModel.filterByInGame(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the opponent and declarer players, but not null type players", () => {
      const opponent = PlayerFixture({
        name: "opponent",
        type: playerModel.PLAYER_TYPE.OPPONENT,
      });
      const declarer = PlayerFixture({
        name: "declarer",
        type: playerModel.PLAYER_TYPE.DECLARER,
      });
      const notPlaying = PlayerFixture({ name: "non playing", type: null });
      const playerList = [opponent, declarer, notPlaying];
      const expected = [
        PlayerFixture({
          id: opponent.id,
          name: "opponent",
          type: playerModel.PLAYER_TYPE.OPPONENT,
        }),
        PlayerFixture({
          id: declarer.id,
          name: "declarer",
          type: playerModel.PLAYER_TYPE.DECLARER,
        }),
      ];

      const current = playerListModel.filterByInGame(playerList);

      expect(current).toEqual(expected);
    });
  });
  describe("createPlayerListObject", () => {
    it("should return an empty opject, if empty list given", () => {
      const playerList: playerListModel.PlayerList = [];
      const expected = {};

      const current = playerListModel.mapToObjectById(playerList);

      expect(current).toEqual(expected);
    });
    it("should return the player list as object, the keys should be the player's ids", () => {
      const player1 = PlayerFixture({ name: "Csaba" });
      const player2 = PlayerFixture({ name: "Attila" });
      const playerList = [player1, player2];
      const expected = {
        [player1.id]: PlayerFixture({ id: player1.id, name: "Csaba" }),
        [player2.id]: PlayerFixture({ id: player2.id, name: "Attila" }),
      };

      const current = playerListModel.mapToObjectById(playerList);

      expect(current).toEqual(expected);
    });
  });
});
