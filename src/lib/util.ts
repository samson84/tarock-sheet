import { v4 as v4uuid } from "uuid";

const makeFirstLetterCapital = (word: string): string => {
  if (word.length < 1) {
    return word;
  }
  const [first, ...rest] = word.split("");
  return `${first.toUpperCase()}${rest.join("").toLowerCase()}`;
};

export const upperCaseToWords = (upperCased: string): string => {
  return upperCased.split("_").map(makeFirstLetterCapital).join(" ");
};

export type Id = string;
export const createId = (): Id => v4uuid();
