import type { PasswordHashAlgorithm } from '~/types/password-hash-tester';

export interface PasswordHashAlgorithmOption {
  group: 'fixed' | 'password'
  label: string
  value: PasswordHashAlgorithm
}

export const passwordHashAlgorithmOptions: PasswordHashAlgorithmOption[] = [
  {
    group: 'fixed',
    label: 'MD5',
    value: 'md5',
  },
  {
    group: 'fixed',
    label: 'SHA-1',
    value: 'sha1',
  },
  {
    group: 'fixed',
    label: 'SHA-256',
    value: 'sha256',
  },
  {
    group: 'fixed',
    label: 'SHA-512',
    value: 'sha512',
  },
  {
    group: 'password',
    label: 'bcrypt',
    value: 'bcrypt',
  },
  {
    group: 'password',
    label: 'argon2id',
    value: 'argon2id',
  },
];

export const legacyHashWarning = 'MD5와 SHA-1은 레거시 방식입니다. 비밀번호 저장에 사용하지 마세요.';

export const defaultBcryptCost = 12;
export const minBcryptCost = 4;
export const maxBcryptCost = 15;

export const defaultArgon2MemoryCost = 19_456;
export const defaultArgon2TimeCost = 2;
export const defaultArgon2Parallelism = 1;
export const minArgon2MemoryCost = 8_192;
export const maxArgon2MemoryCost = 65_536;
export const minArgon2TimeCost = 1;
export const maxArgon2TimeCost = 10;
export const minArgon2Parallelism = 1;
export const maxArgon2Parallelism = 4;
