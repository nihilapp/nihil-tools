import { validate, version } from 'uuid';
import { describe, expect, it } from 'vitest';

import { generateUuids, uuidVersionOptions } from '~/utils/uuid-generator';

describe('generateUuids', () => {
  it.each([
    1,
    5,
    10,
  ])('creates the requested number of UUIDs', (count) => {
    const uuids = generateUuids('v7', count);

    expect(uuids).toHaveLength(count);
    expect(new Set(uuids)).toHaveLength(count);
  });

  it.each([
    [
      'v1',
      1,
    ],
    [
      'v4',
      4,
    ],
    [
      'v6',
      6,
    ],
    [
      'v7',
      7,
    ],
  ] as const)('creates valid UUID %s values', (uuidVersion, expectedVersion) => {
    const [
      uuid,
    ] = generateUuids(uuidVersion, 1);

    expect(validate(uuid)).toBe(true);
    expect(version(uuid)).toBe(expectedVersion);
  });
});

describe('uuidVersionOptions', () => {
  it('provides every supported UUID version in order', () => {
    expect(uuidVersionOptions.map((option) => option.value)).toEqual([
      'v1',
      'v4',
      'v6',
      'v7',
    ]);
  });
});
