export interface RandomStringCharacterRangeSelection {
  lowercase: boolean;
  number: boolean;
  special: boolean;
  uppercase: boolean;
}

export const randomStringCharacterRanges = {
  uppercase: {
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    label: '영문 대문자',
  },
  lowercase: {
    characters: 'abcdefghijklmnopqrstuvwxyz',
    label: '영문 소문자',
  },
  number: {
    characters: '0123456789',
    label: '숫자',
  },
  special: {
    characters: '?~!@#$%^&*_-=+',
    label: '특수문자',
  },
} as const;

export function generateRandomString(
  length: number,
  selection: RandomStringCharacterRangeSelection,
  random: () => number = Math.random,
) {
  const characters = Object.entries(selection)
    .filter((entry) => entry[1])
    .map((entry) => randomStringCharacterRanges[entry[0] as keyof typeof randomStringCharacterRanges].characters)
    .join('');

  if (!characters || length <= 0) {
    return '';
  }

  return Array.from(
    {
      length,
    },
    () => characters[Math.floor(random() * characters.length)],
  ).join('');
}
