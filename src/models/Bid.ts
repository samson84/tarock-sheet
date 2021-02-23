import groupBy from "lodash/fp/groupBy";
import sortBy from "lodash/fp/sortBy";

export interface Props extends Data {
  type: TYPE;
}

interface Data {
  bidBaseScore: number | ((party: number) => number);
  group?: GroupType;
  variants?: Variant[];
  canSilent?: boolean;
  isWinByDefault?: boolean;
  isNotWinIfSilent?: boolean;
  isDenyContra?: boolean;
}

export enum TYPE {
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

export type GroupType =
  | "PARTY_LIKE"
  | "ULTI_LIKE"
  | "CENTRUM_LIKE"
  | "CATCHES"
  | "OTHERS";
const BID_GROUPS: { [K in GroupType]: { weight: number } } = {
  PARTY_LIKE: { weight: 10 },
  ULTI_LIKE: { weight: 20 },
  CENTRUM_LIKE: { weight: 30 },
  CATCHES: { weight: 40 },
  OTHERS: { weight: 50 },
};
export const getGroupsOrderedByWeight = () =>
  sortBy((g) => BID_GROUPS[g as GroupType].weight, Object.keys(BID_GROUPS));

export enum SMALLEST_VARIANT {
  PAGAT = "PAGAT",
  EAGLE = "EAGLE",
}

export enum CARD_SUIT_VARIANT {
  HEART = "HEART",
  SPADE = "SPADE",
  CLUB = "CLUB",
  DIAMOND = "DIAMOND",
}

const SMALLEST_VARIANTS = [SMALLEST_VARIANT.PAGAT, SMALLEST_VARIANT.EAGLE];
const CARD_SUIT_VARIANTS = [
  CARD_SUIT_VARIANT.CLUB,
  CARD_SUIT_VARIANT.DIAMOND,
  CARD_SUIT_VARIANT.HEART,
  CARD_SUIT_VARIANT.SPADE,
];

export type Variant = SMALLEST_VARIANT | CARD_SUIT_VARIANT;

const BIDS: { [key in TYPE]: Data } = {
  [TYPE.PARTY]: {
    bidBaseScore: (party: number) => party,
    group: "PARTY_LIKE",
  },
  [TYPE.TRULL]: { bidBaseScore: 2, canSilent: true },
  [TYPE.FOUR_KING]: { bidBaseScore: 2, canSilent: true },
  [TYPE.CATCH_THE_MAYOR]: {
    bidBaseScore: 42,
    canSilent: true,
    group: "CATCHES",
  },
  [TYPE.CATCH_THE_PAGAT]: { bidBaseScore: 4, group: "CATCHES" },
  [TYPE.ULTI]: {
    bidBaseScore: 10,
    variants: [...SMALLEST_VARIANTS],
    canSilent: true,
    group: "ULTI_LIKE",
    isNotWinIfSilent: true,
  },
  [TYPE.UHU]: {
    bidBaseScore: 15,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.DOUBLE_PARTY]: {
    bidBaseScore: (party: number) => party * 4,
    canSilent: true,
    group: "PARTY_LIKE",
  },
  [TYPE.VOLAT]: {
    bidBaseScore: (party: number) => party * 6,
    canSilent: true,
    group: "PARTY_LIKE",
  },
  [TYPE.PHEASANT]: {
    bidBaseScore: 20,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.PHEASANT_IN_2ND]: {
    bidBaseScore: 20,
    variants: [...SMALLEST_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.EIGHT_TAROCK]: {
    bidBaseScore: 1,
    isWinByDefault: true,
    isDenyContra: true,
  },
  [TYPE.NINE_TAROCK]: {
    bidBaseScore: 2,
    isWinByDefault: true,
    isDenyContra: true,
  },
  [TYPE.FURRY]: {
    bidBaseScore: 25,
    variants: [...CARD_SUIT_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.CENTRUM]: { bidBaseScore: 10, group: "CENTRUM_LIKE" },
  [TYPE.SMALL_BIRD]: { bidBaseScore: 10, group: "CENTRUM_LIKE" },
  [TYPE.LARGE_BIRD]: { bidBaseScore: 10, group: "CENTRUM_LIKE" },
  [TYPE.KING_ULTI]: {
    bidBaseScore: 15,
    variants: [...CARD_SUIT_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.KING_UHU]: {
    bidBaseScore: 20,
    variants: [...CARD_SUIT_VARIANTS],
    group: "ULTI_LIKE",
  },
  [TYPE.CSUZIMA]: { bidBaseScore: 4 },
  [TYPE.KLOPICZKY]: {
    bidBaseScore: 3,
    isWinByDefault: true,
    isDenyContra: true,
  },
};

export const getByType = (type: TYPE): Props => ({ type, ...BIDS[type] });

export const getAll = (): Props[] =>
  Object.keys(TYPE).map((b: TYPE) => getByType(b));

export type ByGroup = { [K in GroupType]: Props[] };
export const getAllByGroup = (): ByGroup => {
  const bids = getAll();
  return groupBy((bid) => bid.group || "OTHERS", bids) as ByGroup;
};

export const canSilent = (bid: Props): boolean => bid?.canSilent === true;

export const calculateScore = (partyScore: number) => (bid: Props): number =>
  typeof bid.bidBaseScore === "function"
    ? bid.bidBaseScore(partyScore)
    : bid.bidBaseScore;

export const hasVariant = (variant: Variant) => (bid: Props): boolean => {
  const variants = bid?.variants || [];
  return variants.includes(variant);
};
