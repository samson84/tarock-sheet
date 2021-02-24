import * as playerModel from "./playerModel";
import { expectPlayer, PlayerFixture } from "./test_data/fixtures";

export default describe("Player", () => {
  describe("createPlayer", () => {
    it("should create a player", () => {
      const expected = PlayerFixture({
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
      const player = PlayerFixture({
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
      const expected = PlayerFixture({
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
});
