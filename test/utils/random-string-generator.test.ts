import { describe, expect, it } from 'vitest';

import { generateRandomString, randomStringCharacterRanges } from '~/utils/random-string-generator';

describe('generateRandomString', () => {
  it('generates the requested length from every selected character range', () => {
    const result = generateRandomString(
      8,
      {
        lowercase: true,
        number: true,
        special: true,
        uppercase: true,
      },
      () => 0,
    );

    expect(result).toBe('aaaaaaaa');
  });

  it('uses only the selected character range', () => {
    const result = generateRandomString(
      4,
      {
        lowercase: false,
        number: true,
        special: false,
        uppercase: false,
      },
      () => 0.999,
    );

    expect(result).toBe('9999');
  });

  it('returns an empty string when no character range is selected', () => {
    const result = generateRandomString(
      16,
      {
        lowercase: false,
        number: false,
        special: false,
        uppercase: false,
      },
    );

    expect(result).toBe('');
  });
});

describe('randomStringCharacterRanges', () => {
  it('keeps the agreed special characters available as a selectable range', () => {
    expect(randomStringCharacterRanges.special.characters).toBe('?~!@#$%^&*_-=+');
  });
});
