import { describe, expect, it } from 'vitest';
import { randomKeywordsAuditData } from '~/data/random-keywords/random-keywords-audit.data';
import { randomKeywordsCatalogData } from '~/data/random-keywords/random-keywords-catalog.data';

describe('random keyword data', () => {
  it('registers only the keyword pools still awaiting renewal', () => {
    expect(randomKeywordsCatalogData).toHaveLength(0);
    expect(new Set(randomKeywordsCatalogData.map((pool) => pool.id)).size).toBe(0);
  });

  it('keeps invalid encoding entries in the audit record only', () => {
    expect(randomKeywordsAuditData.invalidEncodingEntries).toHaveLength(0);

    for (const pool of randomKeywordsCatalogData) {
      expect(pool.keywords.some((keyword) => keyword.includes('�'))).toBe(false);
    }
  });

  it('removes duplicates within each keyword pool', () => {
    for (const pool of randomKeywordsCatalogData) {
      expect(new Set(pool.keywords).size).toBe(pool.keywords.length);
    }

    expect(
      randomKeywordsAuditData.duplicateEntries.reduce(
        (count, entry) => count + entry.removedCount,
        0,
      ),
    ).toBe(0);
    expect(
      randomKeywordsCatalogData.reduce(
        (count, pool) => count + pool.keywords.length,
        0,
      ),
    ).toBe(0);
  });
});
