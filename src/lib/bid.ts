import groupBy from "lodash/fp/groupBy";
import sortBy from "lodash/fp/sortBy";

export interface Bid extends BidData {
  type: BID_TYPE;
}

interface BidData {
  score: number | ((party: number) => number);
  group?: BidGroupType;
  variants?: BidVariant[];
  silent?: boolean;
  winByDefault?: boolean;
  notWinIfSilent?: boolean;
  denyContra?: boolean;
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
  PHEASANT_IN_2ND = "PHEASANT_IN_2ND",
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

export type BidGroupType =
  | "PARTY_LIKE"
  | "ULTI_LIKE"
  | "CENTRUM_LIKE"
  | "CATCHES"
  | "OTHERS";
const BID_GROUPS: { [K in BidGroupType]: { weight: number } } = {
  PARTY_LIKE: { weight: 10 },
  ULTI_LIKE: { weight: 20 },
  CENTRUM_LIKE: { weight: 30 },
  CATCHES: { weight: 40 },
  OTHERS: { weight: 50 },
};
export const bidGroupNamesByWeight = () =>
  sortBy((g) => BID_GROUPS[g as BidGroupType].weight, Object.keys(BID_GROUPS));

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
  [BID_TYPE.PARTY]: { score: (party: number) => party, group: "PARTY_LIKE" },
  [BID_TYPE.TRULL]: { score: 2, silent: true },
  [BID_TYPE.FOUR_KING]: { score: 2, silent: true },
  [BID_TYPE.CATCH_THE_MAYOR]: { score: 42, silent: true, group: "CATCHES" },
  [BID_TYPE.CATCH_THE_PAGAT]: { score: 4, group: "CATCHES" },
  [BID_TYPE.ULTI]: {
    score: 10,
    variants: [...SMALLEST_VARIANTS],
    silent: true,
    group: "ULTI_LIKE",
    notWinIfSilent: true,
  },
  [BID_TYPE.UHU]: {
    score: 15,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.DOUBLE_PARTY]: {
    score: (party: number) => party * 4,
    silent: true,
    group: "PARTY_LIKE",
  },
  [BID_TYPE.VOLAT]: {
    score: (party: number) => party * 6,
    silent: true,
    group: "PARTY_LIKE",
  },
  [BID_TYPE.PHEASANT]: {
    score: 20,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.PHEASANT_IN_2ND]: {
    score: 20,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.EIGHT_TAROCK]: { score: 1, winByDefault: true, denyContra: true },
  [BID_TYPE.NINE_TAROCK]: { score: 2, winByDefault: true, denyContra: true },
  [BID_TYPE.FURRY]: {
    score: 25,
    variants: [...CARD_SHAPE_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.CENTRUM]: { score: 10, group: "CENTRUM_LIKE" },
  [BID_TYPE.SMALL_BIRD]: { score: 10, group: "CENTRUM_LIKE" },
  [BID_TYPE.LARGE_BIRD]: { score: 10, group: "CENTRUM_LIKE" },
  [BID_TYPE.KING_ULTI]: {
    score: 15,
    variants: [...CARD_SHAPE_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.KING_UHU]: {
    score: 20,
    variants: [...CARD_SHAPE_VARIANTS],
    group: "ULTI_LIKE",
  },
  [BID_TYPE.CSUZIMA]: { score: 4 },
  [BID_TYPE.KLOPICZKY]: { score: 3, winByDefault: true, denyContra: true },
};

export const getBid = (type: BID_TYPE): Bid => ({ type, ...BIDS[type] });

export const getAllBids = (): Bid[] =>
  Object.keys(BID_TYPE).map((b: BID_TYPE) => getBid(b));

export type BidsByGroup = { [K in BidGroupType]: Bid[] };
export const getAllBidsByGorup = (): BidsByGroup => {
  const bids = getAllBids();
  return groupBy((bid) => bid.group || "OTHERS", bids) as BidsByGroup;
};

export const canSilent = (bid: Bid): boolean => bid?.silent === true;

export const getBidScore = (partyScore: number) => (bid: Bid): number =>
  typeof bid.score === "function" ? bid.score(partyScore) : bid.score;

export const hasVariant = (variant: BidVariant) => (bid: Bid): boolean => {
  const variants = bid?.variants || [];
  return variants.includes(variant);
};
