import { createHash, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import type { HashOptions } from 'argon2';
import bcrypt from 'bcryptjs';

import { defaultArgon2MemoryCost,
  defaultArgon2Parallelism,
  defaultArgon2TimeCost,
  defaultBcryptCost,
  maxArgon2MemoryCost,
  maxArgon2Parallelism,
  maxArgon2TimeCost,
  maxBcryptCost,
  minArgon2MemoryCost,
  minArgon2Parallelism,
  minArgon2TimeCost,
  minBcryptCost } from '~/data/password-hash-tester.data';
import type { CompareRequest,
  CompareResult,
  FixedHashAlgorithm,
  HashRequest,
  HashResult,
  PasswordHashAlgorithm } from '~/types/password-hash-tester';

function assertHashValue(value: string) {
  if (!value) {
    throw new Error('문자열을 입력해 주세요.');
  }
}

function isFixedHashAlgorithm(algorithm: PasswordHashAlgorithm): algorithm is FixedHashAlgorithm {
  return algorithm === 'md5' ||
    algorithm === 'sha1' ||
    algorithm === 'sha256' ||
    algorithm === 'sha512';
}

function createFixedHash(algorithm: FixedHashAlgorithm, value: string) {
  return createHash(algorithm)
    .update(value, 'utf8')
    .digest('hex');
}

function isSameHash(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  return leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer);
}

function getIntegerInRange(value: number | undefined, defaultValue: number, min: number, max: number, label: string) {
  const nextValue = value ?? defaultValue;

  if (!Number.isInteger(nextValue) || nextValue < min || nextValue > max) {
    throw new Error(`${label}은(는) ${min}부터 ${max} 사이의 정수여야 합니다.`);
  }

  return nextValue;
}

function getBcryptCost(value: number | undefined) {
  return getIntegerInRange(value, defaultBcryptCost, minBcryptCost, maxBcryptCost, 'bcrypt 비용');
}

function getArgon2Options(request: HashRequest): HashOptions {
  return {
    memoryCost: getIntegerInRange(request.argon2MemoryCost, defaultArgon2MemoryCost, minArgon2MemoryCost, maxArgon2MemoryCost, 'argon2id 메모리'),
    parallelism: getIntegerInRange(request.argon2Parallelism, defaultArgon2Parallelism, minArgon2Parallelism, maxArgon2Parallelism, 'argon2id 병렬성'),
    timeCost: getIntegerInRange(request.argon2TimeCost, defaultArgon2TimeCost, minArgon2TimeCost, maxArgon2TimeCost, 'argon2id 반복 횟수'),
    type: argon2.argon2id,
  };
}

function isBcryptHash(hash: string) {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash);
}

function isArgon2idHash(hash: string) {
  return hash.startsWith('$argon2id$');
}

function isPasswordHashAlgorithm(value: unknown): value is PasswordHashAlgorithm {
  return value === 'md5' ||
    value === 'sha1' ||
    value === 'sha256' ||
    value === 'sha512' ||
    value === 'bcrypt' ||
    value === 'argon2id';
}

function isOptionalNumber(value: unknown) {
  return value === undefined || typeof value === 'number';
}

function getRequestRecord(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('요청 형식이 올바르지 않습니다.');
  }

  return body as Record<string, unknown>;
}

function parseHashRequest(body: unknown): HashRequest {
  const request = getRequestRecord(body);

  if (!isPasswordHashAlgorithm(request.algorithm) ||
    typeof request.value !== 'string' ||
    !isOptionalNumber(request.bcryptCost) ||
    !isOptionalNumber(request.argon2MemoryCost) ||
    !isOptionalNumber(request.argon2TimeCost) ||
    !isOptionalNumber(request.argon2Parallelism)) {
    throw new Error('요청 형식이 올바르지 않습니다.');
  }

  return {
    algorithm: request.algorithm,
    argon2MemoryCost: request.argon2MemoryCost,
    argon2Parallelism: request.argon2Parallelism,
    argon2TimeCost: request.argon2TimeCost,
    bcryptCost: request.bcryptCost,
    value: request.value,
  };
}

function parseCompareRequest(body: unknown): CompareRequest {
  const request = getRequestRecord(body);

  if (!isPasswordHashAlgorithm(request.algorithm) ||
    typeof request.hash !== 'string' ||
    typeof request.value !== 'string') {
    throw new Error('요청 형식이 올바르지 않습니다.');
  }

  return {
    algorithm: request.algorithm,
    hash: request.hash,
    value: request.value,
  };
}

export function detectPasswordHashAlgorithm(hash: string): 'bcrypt' | 'argon2id' | null {
  if (/^\$2[aby]\$/.test(hash)) {
    return 'bcrypt';
  }

  if (hash.startsWith('$argon2id$')) {
    return 'argon2id';
  }

  return null;
}

export async function createPasswordHash(request: HashRequest): Promise<HashResult> {
  assertHashValue(request.value);

  if (isFixedHashAlgorithm(request.algorithm)) {
    return {
      algorithm: request.algorithm,
      hash: createFixedHash(request.algorithm, request.value),
      settings: [
      ],
    };
  }

  if (request.algorithm === 'bcrypt') {
    const bcryptCost = getBcryptCost(request.bcryptCost);

    return {
      algorithm: request.algorithm,
      hash: await bcrypt.hash(request.value, bcryptCost),
      settings: [
        {
          label: '비용',
          value: String(bcryptCost),
        },
      ],
    };
  }

  const options = getArgon2Options(request);

  return {
    algorithm: request.algorithm,
    hash: await argon2.hash(request.value, options),
    settings: [
      {
        label: '메모리',
        value: `${options.memoryCost} KiB`,
      },
      {
        label: '반복',
        value: String(options.timeCost),
      },
      {
        label: '병렬성',
        value: String(options.parallelism),
      },
    ],
  };
}

export async function comparePasswordHash(request: CompareRequest): Promise<CompareResult> {
  assertHashValue(request.value);

  if (!request.hash) {
    throw new Error('비교할 해시 문자열을 입력해 주세요.');
  }

  if (isFixedHashAlgorithm(request.algorithm)) {
    return {
      algorithm: request.algorithm,
      matched: isSameHash(createFixedHash(request.algorithm, request.value), request.hash),
    };
  }

  if (request.algorithm === 'bcrypt') {
    if (!isBcryptHash(request.hash)) {
      throw new Error('해시 형식이 올바르지 않습니다.');
    }

    return {
      algorithm: request.algorithm,
      matched: await bcrypt.compare(request.value, request.hash),
    };
  }

  if (!isArgon2idHash(request.hash)) {
    throw new Error('해시 형식이 올바르지 않습니다.');
  }

  try {
    return {
      algorithm: request.algorithm,
      matched: await argon2.verify(request.hash, request.value),
    };
  }
  catch {
    throw new Error('해시 형식이 올바르지 않습니다.');
  }

}

export async function createHashResponse(body: unknown) {
  return createPasswordHash(parseHashRequest(body));
}

export async function compareHashResponse(body: unknown) {
  return comparePasswordHash(parseCompareRequest(body));
}
