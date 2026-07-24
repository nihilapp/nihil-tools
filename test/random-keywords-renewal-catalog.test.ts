import { describe, expect, it } from 'vitest';
import { randomKeywordsAuditData } from '~/data/random-keywords/random-keywords-audit.data';
import { randomKeywordsCatalogData } from '~/data/random-keywords/random-keywords-catalog.data';
import { renewalKeywordsAuditData } from '~/data/random-keywords/renewal/renewal-keywords-audit.data';
import { renewalKeywordsCatalogData } from '~/data/random-keywords/renewal/renewal-keywords-catalog.data';

describe('renewal keyword catalog', () => {
  it('moves the unambiguous themes out of the legacy analysis catalog', () => {
    expect(randomKeywordsCatalogData).toHaveLength(0);
    expect(renewalKeywordsCatalogData).toHaveLength(61);
    expect(
      renewalKeywordsCatalogData.flatMap((theme) => theme.sourcePoolIds),
    ).toHaveLength(66);
    expect(
      renewalKeywordsCatalogData.reduce(
        (count, theme) => count + theme.sourceKeywordCount,
        0,
      ),
    ).toBe(23_559);
  });

  it('moves audit records with their renewed source pools', () => {
    expect(randomKeywordsAuditData.invalidEncodingEntries).toHaveLength(0);
    expect(renewalKeywordsAuditData.invalidEncodingEntries).toHaveLength(6);

    expect(
      randomKeywordsAuditData.duplicateEntries.reduce(
        (count, entry) => count + entry.removedCount,
        0,
      ),
    ).toBe(0);
    expect(
      renewalKeywordsAuditData.duplicateEntries.reduce(
        (count, entry) => count + entry.removedCount,
        0,
      ),
    ).toBe(147);
  });
});
