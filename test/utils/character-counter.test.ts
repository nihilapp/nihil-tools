import { describe, expect, it } from 'vitest';

import { countCharacters } from '~/utils/character-counter';

describe('countCharacters', () => {
  it('counts characters with whitespace', () => {
    expect(countCharacters('가 나\n다').withWhitespace).toBe(5);
  });

  it('counts characters without spaces, tabs, and line breaks', () => {
    expect(countCharacters('가 나\n다\t라').withoutWhitespace).toBe(4);
  });

  it('counts a Unicode code point such as emoji as one character', () => {
    expect(countCharacters('A🙂B')).toEqual({
      withWhitespace: 3,
      withoutWhitespace: 3,
    });
  });
});
