import { v1, v4, v6, v7 } from 'uuid';

export type UuidVersion = 'v1' | 'v4' | 'v6' | 'v7';

export interface UuidVersionOption {
  label: string;
  value: UuidVersion;
}

export const uuidVersionOptions: UuidVersionOption[] = [
  {
    label: 'UUID v1',
    value: 'v1',
  },
  {
    label: 'UUID v4',
    value: 'v4',
  },
  {
    label: 'UUID v6',
    value: 'v6',
  },
  {
    label: 'UUID v7',
    value: 'v7',
  },
];

const uuidGenerators: Record<UuidVersion, () => string> = {
  v1,
  v4,
  v6,
  v7,
};

export function generateUuids(
  uuidVersion: UuidVersion,
  count: number,
) {
  return Array.from(
    {
      length: count,
    },
    () => uuidGenerators[uuidVersion](),
  );
}
