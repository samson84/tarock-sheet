import _ from "lodash/fp";

export interface Bid {
  type: BID_TYPE;
  score: number | ((party: number) => number);
  variants?: string[];
  silent?: boolean;
}

export enum BID_TYPE {
  PARTY,
  TRULL,
  FOUR_KING,
  CATCH_THE_MAYOR,
  ULTI,
  UHU,
  DOUBLE_PARTY,
  VOLAT,
  PHEASANT,
  EIGHT_TAROCK,
  NINE_TAROCK,
  FURRY,
  CENTRUM,
  SMALL_BIRD,
  LARGE_BIRD,
  CSUZIMA,
  KING_ULTI,
  KING_UHU,
}

const BIDS: Bid[] = [
  { type: BID_TYPE.PARTY, score: (party: number) => party },
  { type: BID_TYPE.TRULL, score: 2 },
  { type: BID_TYPE.FOUR_KING, score: 2, silent: true },
  { type: BID_TYPE.CATCH_THE_MAYOR, score: 42, silent: true },
  {
    type: BID_TYPE.ULTI,
    score: 10,
    variants: ["Pagat", "Eagle"],
    silent: true,
  },
  { type: BID_TYPE.UHU, score: 15, variants: ["Pagat", "Eagle"] },
  {
    type: BID_TYPE.DOUBLE_PARTY,
    score: (party: number) => party * 2,
    silent: true,
  },
  { type: BID_TYPE.VOLAT, score: (party: number) => party * 6, silent: true },
  { type: BID_TYPE.PHEASANT, score: 50, variants: ["Pagat", "Eagle"] },
  { type: BID_TYPE.EIGHT_TAROCK, score: 1 },
  { type: BID_TYPE.NINE_TAROCK, score: 2 },
  {
    type: BID_TYPE.FURRY,
    score: 25,
    variants: ["Heart", "Club", "Diamond", "Spade"],
  },
  { type: BID_TYPE.CENTRUM, score: 10 },
  { type: BID_TYPE.SMALL_BIRD, score: 15 },
  { type: BID_TYPE.LARGE_BIRD, score: 20 },
  {
    type: BID_TYPE.KING_ULTI,
    score: 15,
    variants: ["Heart", "Club", "Diamond", "Spade"],
  },
  {
    type: BID_TYPE.KING_UHU,
    score: 20,
    variants: ["Heart", "Club", "Diamond", "Spade"],
  },
  { type: BID_TYPE.CSUZIMA, score: 4 },
];

const bidGetter = () => {
  const bidHash = _.keyBy<Bid>(b => b.type)(BIDS)
  return (bidType: BID_TYPE): Bid => bidHash[bidType]
};

export const getBid: ReturnType<typeof bidGetter> = bidGetter()

