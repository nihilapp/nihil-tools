export interface CharacterCountResult {
  withWhitespace: number;
  withoutWhitespace: number;
}

export function countCharacters(text: string): CharacterCountResult {
  const characters = Array.from(text);

  return {
    withWhitespace: characters.length,
    withoutWhitespace: characters.filter((character) => !/\s/u.test(character)).length,
  };
}
