import { describe, expect, it } from 'vitest';

import { comparePasswordHash,
  compareHashResponse,
  createPasswordHash,
  createHashResponse,
  detectPasswordHashAlgorithm } from '~~/server/utils/password-hash-tester';

describe('password hash tester', () => {
  it('creates the known SHA-256 hash for hello', async () => {
    await expect(createPasswordHash({
      algorithm: 'sha256',
      value: 'hello',
    })).resolves.toEqual({
      algorithm: 'sha256',
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      settings: [
      ],
    });
  });

  it('identifies password hash formats', () => {
    expect(detectPasswordHashAlgorithm('$2b$12$abcdefghijklmnopqrstuu9Yd6Q0XAYtqSvGQqGl06hMBhCNXZ5FlAGu')).toBe('bcrypt');
    expect(detectPasswordHashAlgorithm('$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA')).toBe('argon2id');
    expect(detectPasswordHashAlgorithm('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).toBeNull();
  });

  it('rejects an empty source value', async () => {
    await expect(createPasswordHash({
      algorithm: 'sha256',
      value: '',
    })).rejects.toThrow('문자열을 입력해 주세요.');
  });

  it('returns a mismatch for another source value', async () => {
    const result = await comparePasswordHash({
      algorithm: 'sha256',
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      value: 'other',
    });

    expect(result).toEqual({
      algorithm: 'sha256',
      matched: false,
    });
  });

  it('creates distinct bcrypt hashes that both match the source', async () => {
    const first = await createPasswordHash({
      algorithm: 'bcrypt',
      bcryptCost: 4,
      value: 'hello',
    });
    const second = await createPasswordHash({
      algorithm: 'bcrypt',
      bcryptCost: 4,
      value: 'hello',
    });

    expect(first.hash).not.toBe(second.hash);
    await expect(comparePasswordHash({
      algorithm: 'bcrypt',
      hash: first.hash,
      value: 'hello',
    })).resolves.toEqual({
      algorithm: 'bcrypt',
      matched: true,
    });
  });

  it('creates argon2id hashes that reject a different source value', async () => {
    const result = await createPasswordHash({
      algorithm: 'argon2id',
      argon2MemoryCost: 8_192,
      argon2Parallelism: 1,
      argon2TimeCost: 1,
      value: 'hello',
    });

    await expect(comparePasswordHash({
      algorithm: 'argon2id',
      hash: result.hash,
      value: 'other',
    })).resolves.toEqual({
      algorithm: 'argon2id',
      matched: false,
    });
  });

  it('creates a hash response without returning the source value', async () => {
    await expect(createHashResponse({
      algorithm: 'sha256',
      value: 'hello',
    })).resolves.toEqual({
      algorithm: 'sha256',
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      settings: [
      ],
    });
  });

  it('compares a parsed request body', async () => {
    await expect(compareHashResponse({
      algorithm: 'sha256',
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      value: 'hello',
    })).resolves.toEqual({
      algorithm: 'sha256',
      matched: true,
    });
  });

  it('rejects an invalid request body shape', async () => {
    await expect(createHashResponse({
      algorithm: 'sha256',
    })).rejects.toThrow('요청 형식이 올바르지 않습니다.');
  });
});
