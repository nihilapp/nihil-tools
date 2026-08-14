export type FixedHashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export type PasswordHashAlgorithm = FixedHashAlgorithm | 'bcrypt' | 'argon2id';

export interface HashRequest {
  algorithm: PasswordHashAlgorithm
  value: string
  bcryptCost?: number
  argon2MemoryCost?: number
  argon2TimeCost?: number
  argon2Parallelism?: number
}

export interface CompareRequest {
  algorithm: PasswordHashAlgorithm
  hash: string
  value: string
}

export interface HashSetting {
  label: string
  value: string
}

export interface HashResult {
  algorithm: PasswordHashAlgorithm
  hash: string
  settings: HashSetting[]
}

export interface CompareResult {
  algorithm: PasswordHashAlgorithm
  matched: boolean
}
