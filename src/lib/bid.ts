export interface Bid extends BidData {
  type: BID_TYPE;
}

interface BidData {
  score: number | ((party: number) => number);
  variants?: BidVariant[];
  silent?: boolean;
}

export enum BID_TYPE {
  PARTY = "PARTY",
  TRULL = "TRULL",
  FOUR_KING = "FOUR_KING",
  CATCH_THE_MAYOR = "CATCH_THE_MAYOR",
  CATCH_THE_PAGAT = "CATCH_THE_PAGAT",
  ULTI = "ULTI",
  UHU = "UHU",
  DOUBLE_PARTY = "DOUBLE_PARTY",
  VOLAT = "VOLAT",
  PHEASANT = "PHEASANT",
  EIGHT_TAROCK = "EIGHT_TAROCK",
  NINE_TAROCK = "NINE_TAROCK",
  FURRY = "FURRY",
  CENTRUM = "CENTRUM",
  SMALL_BIRD = "SMALL_BIRD",
  LARGE_BIRD = "LARGE_BIRD",
  CSUZIMA = "CSUZIMA",
  KING_ULTI = "KING_ULTI",
  KING_UHU = "KING_UHU",
  KLOPICZKY = "KLOPICZKY",
}

export enum SMALLEST_VARIANT {
  PAGAT = "PAGAT",
  EAGLE = "EAGLE",
}

export enum CARD_SHAPE_VARIANT {
  HEART = "HEART",
  SPADE = "SPADE",
  CLUB = "CLUB",
  DIAMOND = "DIAMOND",
}

const SMALLEST_VARIANTS = [SMALLEST_VARIANT.PAGAT, SMALLEST_VARIANT.EAGLE];
const CARD_SHAPE_VARIANTS = [
  CARD_SHAPE_VARIANT.CLUB,
  CARD_SHAPE_VARIANT.DIAMOND,
  CARD_SHAPE_VARIANT.HEART,
  CARD_SHAPE_VARIANT.SPADE,
];

export type BidVariant = SMALLEST_VARIANT | CARD_SHAPE_VARIANT;

const BIDS: { [key in BID_TYPE]: BidData } = {
  [BID_TYPE.PARTY]: { score: (party: number) => party },
  [BID_TYPE.TRULL]: { score: 2, silent: true },
  [BID_TYPE.FOUR_KING]: { score: 2, silent: true },
  [BID_TYPE.CATCH_THE_MAYOR]: { score: 42, silent: true },
  [BID_TYPE.CATCH_THE_PAGAT]: { score: 4 },
  [BID_TYPE.ULTI]: {
    score: 10,
    variants: [...SMALLEST_VARIANTS],
    silent: true,
  },
  [BID_TYPE.UHU]: { score: 15, variants: [...SMALLEST_VARIANTS] },
  [BID_TYPE.DOUBLE_PARTY]: {
    score: (party: number) => party * 2,
    silent: true,
  },
  [BID_TYPE.VOLAT]: { score: (party: number) => party * 6, silent: true },
  [BID_TYPE.PHEASANT]: { score: 50, variants: [...SMALLEST_VARIANTS] },
  [BID_TYPE.EIGHT_TAROCK]: { score: 1 },
  [BID_TYPE.NINE_TAROCK]: { score: 2 },
  [BID_TYPE.FURRY]: {
    score: 25,
    variants: [...CARD_SHAPE_VARIANTS],
  },
  [BID_TYPE.CENTRUM]: { score: 10 },
  [BID_TYPE.SMALL_BIRD]: { score: 15 },
  [BID_TYPE.LARGE_BIRD]: { score: 20 },
  [BID_TYPE.KING_ULTI]: {
    score: 15,
    variants: [...CARD_SHAPE_VARIANTS],
  },
  [BID_TYPE.KING_UHU]: {
    score: 20,
    variants: [...CARD_SHAPE_VARIANTS],
  },
  [BID_TYPE.CSUZIMA]: { score: 4 },
  [BID_TYPE.KLOPICZKY]: { score: 3 },
};

export const getBid = (type: BID_TYPE): Bid => ({ type, ...BIDS[type] });
export const getAllBids = (): Bid[] =>
  Object.keys(BID_TYPE).map((b: BID_TYPE) => getBid(b));
export const canSilent = (bid: Bid): boolean => bid?.silent === true;
export const getBidScore = (partyScore: number) => (bid: Bid): number =>
  typeof bid.score === "function" ? bid.score(partyScore) : bid.score;
export const hasVariant = (variant: BidVariant) => (bid: Bid): boolean => {
  const variants = bid?.variants || [];
  return variants.includes(variant);
};
