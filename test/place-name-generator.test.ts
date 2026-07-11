import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { generatePlaceNames, objectParticle, subjectParticle } from '../app/utils/place-name-generator';

describe('subjectParticle', () => {
  it('returns the correct particle by final consonant', () => {
    expect(subjectParticle('왕')).toBe('이');
    expect(subjectParticle('마녀')).toBe('가');
  });
});

describe('objectParticle', () => {
  it('returns the correct object particle by final consonant', () => {
    expect(objectParticle('빛')).toBe('을');
    expect(objectParticle('안개')).toBe('를');
  });
});

describe('generatePlaceNames', () => {
  it('does not import runtime data from references', () => {
    const filePath = resolve(process.cwd(), 'app/utils/place-name-generator.ts');
    const source = readFileSync(filePath, 'utf8');

    expect(source.includes('references/')).toBe(false);
    expect(source.includes('references\\')).toBe(false);
  });

  it('returns the requested number of place names', () => {
    expect(generatePlaceNames(1)).toHaveLength(1);
    expect(generatePlaceNames(5)).toHaveLength(5);
    expect(generatePlaceNames(10)).toHaveLength(10);
  });

  it('returns non-empty strings for every result', () => {
    const results = generatePlaceNames(10);

    expect(results.every((name) => typeof name === 'string' && name.trim().length > 0)).toBe(true);
  });
});
