const makeFirstLetterCapital = (word: string): string => {
  if (word.length < 1) {
    return word
  }
  const [first, ...rest] = word.split("")
  return `${first.toUpperCase()}${rest.join("").toLowerCase()}`
}

export const upperCaseToWords = (upperCased: string): string => {
  return upperCased
    .split("_")
    .map(makeFirstLetterCapital)
    .join(" ")
}
