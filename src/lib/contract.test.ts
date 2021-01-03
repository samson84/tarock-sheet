import { BID_TYPE, CARD_SHAPE_VARIANT, SMALLEST_VARIANT } from "./bid";
import { PLAYER_TYPE } from "./player";

import {
  calculateContract,
  createContract,
  updateContract,
  withIndices,
  filterByPartyLike,
  ContractWithIndex,
  Contract,
  MaxScoreWithIndex,
  findMaxAbsScore,
  groupByPlayerType,
} from "./contract";
import { PARTY_SCORE } from "./game";

import { contractFixture } from "./test_data/fixtures";

export default describe("contract", () => {
  describe("createContract", () => {
    it("should create a declarer contract", () => {
      const props = {
        bidType: BID_TYPE.CENTRUM,
        partyScore: PARTY_SCORE.TOOK_TWO,
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.CENTRUM,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 10,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should create an opponent contract", () => {
      const props = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        bidBaseScore: 2,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should create a contract with party score dependent bid", () => {
      const props = {
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.VOLAT,
        taker: PLAYER_TYPE.DECLARER,
        bidBaseScore: 12,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should set contract to silent", () => {
      const props = {
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.FOUR_KING,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const props = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        silent: true,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = "PARTY can not be silent.";
      const current = () => createContract(props);
      expect(current).toThrow(expected);
    });
    it("should set contract's Bid variant", () => {
      const props = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
        bidBaseScore: 15,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("should throw contract's Bid variant is invalid", () => {
      const props = {
        bidType: BID_TYPE.KING_ULTI,
        taker: PLAYER_TYPE.OPPONENT,
        bidVariant: SMALLEST_VARIANT.EAGLE,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = "KING_ULTI does not have EAGLE variant.";

      const current = () => createContract(props);
      expect(current).toThrow(expected);
    });
    it("should create a non variant non silent bid's contract", () => {
      const props = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: PARTY_SCORE.TOOK_TWO,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
    it("it should add valid in final score", () => {
      const props = {
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        partyScore: PARTY_SCORE.TOOK_TWO,
        validInFinalScore: true,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.PARTY,
        taker: PLAYER_TYPE.OPPONENT,
        validInFinalScore: true,
      });
      const current = createContract(props);
      expect(current).toEqual(expected);
    });
  });
  describe("updateContract", () => {
    it("should update the taker", () => {
      const contract = contractFixture({
        taker: PLAYER_TYPE.OPPONENT,
      });
      const updates = {
        taker: PLAYER_TYPE.DECLARER,
      };
      const expected = contractFixture({
        taker: PLAYER_TYPE.DECLARER,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update the winner", () => {
      const contract = contractFixture({
        winByTaker: null,
      });
      const updates = {
        winByTaker: true,
      };
      const expected = contractFixture({
        winByTaker: true,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should update silent prop", () => {
      const contract = contractFixture({
        silent: false,
      });
      const updates = {
        silent: true,
      };
      const expected = contractFixture({
        silent: true,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid can not be silent", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        silent: false,
      });
      const updates = {
        silent: true,
      };
      const expected = "PARTY can not be silent";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the bidVariant prop", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: null,
      });
      const updates = {
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      };
      const expected = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.CLUB,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("should throw if the bid has invalid bidVariant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.KING_ULTI,
        bidVariant: CARD_SHAPE_VARIANT.DIAMOND,
      });
      const updates = {
        bidVariant: SMALLEST_VARIANT.EAGLE,
      };
      const expected = "KING_ULTI does not have EAGLE variant";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should throw if the bid does not have variant", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.PARTY,
        bidVariant: null,
      });
      const updates = {
        bidVariant: SMALLEST_VARIANT.PAGAT,
        winByTaker: false,
      };
      const expected = "PARTY does not have PAGAT variant";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update the contra", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 4,
      };
      const expected = contractFixture({
        contra: 4,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
    it("sould throw if the contra is not the power of two", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 5,
      };
      const expected = "Contra must be power of two, but 5 given.";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("sould throw if the contra is less than one.", () => {
      const contract = contractFixture({
        contra: 2,
      });
      const updates = {
        contra: 0.5,
      };
      const expected = "Contra must be greater than 1, but 0.5 given.";
      const current = () => updateContract(updates)(contract);
      expect(current).toThrow(expected);
    });
    it("should update vaild in final score", () => {
      const contract = contractFixture({
        validInFinalScore: false,
      });
      const updates = {
        validInFinalScore: true,
      };
      const expected = contractFixture({
        validInFinalScore: true,
      });
      const current = updateContract(updates)(contract);
      expect(current).toEqual(expected);
    });
  });
  describe("calculateContract", () => {
    it("should return null if no winner", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 1,
        winByTaker: null,
        taker: PLAYER_TYPE.DECLARER,
        silent: false,
      });
      const expected = null;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
    it("shouls return the base score if it is won by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        winByTaker: true,
        taker: PLAYER_TYPE.DECLARER,
        silent: false,
      });
      const expected = 20;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
    it("should return the minus score if it is lose by the taker", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 2,
        winByTaker: false,
        taker: PLAYER_TYPE.DECLARER,
        silent: false,
      });
      const expected = -20;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent.", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 1,
        winByTaker: true,
        taker: PLAYER_TYPE.DECLARER,
        silent: true,
      });
      const expected = 5;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score if silent, contra > 1", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        winByTaker: true,
        taker: PLAYER_TYPE.DECLARER,
        silent: true,
      });
      const expected = 5;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
    it("should return the half base score negative if silent, contra > 1, and loose", () => {
      const contract = contractFixture({
        bidType: BID_TYPE.ULTI,
        bidBaseScore: 10,
        bidVariant: SMALLEST_VARIANT.PAGAT,
        contra: 16,
        winByTaker: false,
        taker: PLAYER_TYPE.DECLARER,
        silent: true,
      });
      const expected = -5;

      const current = calculateContract(contract);
      expect(current).toEqual(expected);
    });
  });
  describe("withIndices", () => {
    it("should map the indexes", () => {
      const contract1 = contractFixture({ bidType: BID_TYPE.ULTI });
      const contract2 = contractFixture({ bidType: BID_TYPE.KING_ULTI });
      const contracts = [contract1, contract2];
      const expected = [
        [contract1, 0],
        [contract2, 1],
      ];

      const current = withIndices(contracts);
      expect(current).toEqual(expected);
    });
    it("should return an empty array, if empty array given", () => {
      const contracts: Contract[] = [];
      const expected: ContractWithIndex[] = [];

      const current = withIndices(contracts);
      expect(current).toEqual(expected);
    });
  });
  describe("filterByPartyLike", () => {
    it("should filter party like bids", () => {
      const contracts: ContractWithIndex[] = [
        [contractFixture({ bidType: BID_TYPE.ULTI }), 0],
        [contractFixture({ bidType: BID_TYPE.PARTY }), 1],
        [contractFixture({ bidType: BID_TYPE.DOUBLE_PARTY }), 2],
        [contractFixture({ bidType: BID_TYPE.VOLAT }), 3],
        [contractFixture({ bidType: BID_TYPE.FOUR_KING }), 4],
        [contractFixture({ bidType: BID_TYPE.TRULL }), 5],
      ];
      const expected: ContractWithIndex[] = [
        [contractFixture({ bidType: BID_TYPE.PARTY }), 1],
        [contractFixture({ bidType: BID_TYPE.DOUBLE_PARTY }), 2],
        [contractFixture({ bidType: BID_TYPE.VOLAT }), 3],
      ];
      const current = filterByPartyLike(contracts);
      expect(current).toEqual(expected);
    });
  });
  describe("findLargestScore", () => {
    it("should return [null, -1] if empty array given", () => {
      const contracts: ContractWithIndex[] = [];
      const expected: MaxScoreWithIndex = [null, -1];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return [null, -1] if the contract still not won by anybody.", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 1,
            winByTaker: null,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
      ];
      const expected: MaxScoreWithIndex = [null, -1];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    }),
      it("should return [null, -1] if bidBaseScore of is null in the only contract in the list", () => {
        const contracts: ContractWithIndex[] = [
          [
            contractFixture({
              bidType: BID_TYPE.PARTY,
              bidBaseScore: null,
              winByTaker: true,
              taker: PLAYER_TYPE.DECLARER,
              silent: false,
              contra: 1,
            }),
            0,
          ],
        ];
        const expected: MaxScoreWithIndex = [null, -1];

        const current = findMaxAbsScore(contracts);
        expect(current).toEqual(expected);
      });
    it("should return [null, -1] if all contracts are not won / no bidBaseScore given", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: null,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 2,
            winByTaker: null,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          1,
        ],
      ];
      const expected: MaxScoreWithIndex = [null, -1];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return the score, index of a won, bidBaseScore given contract", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 4,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
      ];
      const expected: MaxScoreWithIndex = [4, 0];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return the score, index of a largest bid (all won)", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 4,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            bidBaseScore: 16,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          1,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.VOLAT,
            bidBaseScore: 24,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          2,
        ],
      ];
      const expected: MaxScoreWithIndex = [24, 2];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return the score, index of a largest lost bid (all lost)", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 4,
            winByTaker: false,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            bidBaseScore: 16,
            winByTaker: false,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          1,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.VOLAT,
            bidBaseScore: 24,
            winByTaker: false,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          2,
        ],
      ];
      const expected: MaxScoreWithIndex = [-24, 2];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return the largest abs score, even it it is lost", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 4,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            bidBaseScore: 16,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          1,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.VOLAT,
            bidBaseScore: 24,
            winByTaker: false,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          2,
        ],
      ];
      const expected: MaxScoreWithIndex = [-24, 2];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
    it("should return double party as a largest, if volat is silent.", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.PARTY,
            bidBaseScore: 4,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            bidBaseScore: 16,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: false,
            contra: 1,
          }),
          1,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.VOLAT,
            bidBaseScore: 24,
            winByTaker: true,
            taker: PLAYER_TYPE.DECLARER,
            silent: true,
            contra: 1,
          }),
          2,
        ],
      ];
      const expected: MaxScoreWithIndex = [16, 1];

      const current = findMaxAbsScore(contracts);
      expect(current).toEqual(expected);
    });
  });
  describe("groupByPlayerType", () => {
    it("shuld return empty arrays when the contract array is empty", () => {
      const contracts: ContractWithIndex[] = [];
      const expected = {
        [PLAYER_TYPE.DECLARER]: [],
        [PLAYER_TYPE.OPPONENT]: [],
      };

      const current = groupByPlayerType(contracts);
      expect(current).toEqual(expected);
    });
    it("should group by players", () => {
      const contracts: ContractWithIndex[] = [
        [
          contractFixture({
            bidType: BID_TYPE.TRULL,
            taker: PLAYER_TYPE.OPPONENT,
          }),
          0,
        ],
        [
          contractFixture({
            bidType: BID_TYPE.DOUBLE_PARTY,
            taker: PLAYER_TYPE.DECLARER,
          }),
          1,
        ],
      ];
      const expected = {
        [PLAYER_TYPE.DECLARER]: [
          [
            contractFixture({
              bidType: BID_TYPE.DOUBLE_PARTY,
              taker: PLAYER_TYPE.DECLARER,
            }),
            1,
          ],  
        ],
        [PLAYER_TYPE.OPPONENT]: [
          [
            contractFixture({
              bidType: BID_TYPE.TRULL,
              taker: PLAYER_TYPE.OPPONENT,
            }),
            0,
          ],  
        ],
      };

      const current = groupByPlayerType(contracts);
      expect(current).toEqual(expected);
    });
  });
});
