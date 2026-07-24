export type RandomKeywordArea =
  | 'misc'
  | 'background'
  | 'character';

export type RandomKeywordFormat =
  | 'hierarchical'
  | 'phrase'
  | 'mixed';

export interface RandomKeywordPoolData {
  id: string;
  area: RandomKeywordArea;
  label: string;
  format: RandomKeywordFormat;
  keywords: readonly string[];
}

export interface RandomKeywordInvalidEncodingEntry {
  sourceFile: string;
  poolId: string;
  poolLabel: string;
  originalValue: string;
  reason: 'invalid-encoding';
}

export interface RandomKeywordDuplicateAuditEntry {
  sourceFile: string;
  poolId: string;
  poolLabel: string;
  originalCount: number;
  uniqueCount: number;
  removedCount: number;
}
