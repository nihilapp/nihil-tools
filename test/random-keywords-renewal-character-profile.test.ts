import { describe, expect, it } from 'vitest';
import { randomKeywordsCatalogData } from '~/data/random-keywords/random-keywords-catalog.data';
import { renewalCharacterProfileAuditData } from '~/data/random-keywords/renewal/renewal-character-profile-audit.data';
import { renewalKeywordsCatalogData } from '~/data/random-keywords/renewal/renewal-keywords-catalog.data';

describe('renewal character profile keywords', () => {
  it('moves personality and character-trait pools into explicit character themes', () => {
    expect(randomKeywordsCatalogData.map((pool) => pool.id)).not.toContain(
      'character-personalities',
    );
    expect(randomKeywordsCatalogData.map((pool) => pool.id)).not.toContain(
      'character-traits',
    );

    const characterThemes = renewalKeywordsCatalogData.filter((theme) => (
      theme.sourcePoolIds.includes('character-personalities') ||
      theme.sourcePoolIds.includes('character-traits')
    ));

    expect(characterThemes).toHaveLength(18);
    expect(characterThemes.reduce(
      (count, theme) => count + theme.sourceKeywordCount,
      0,
    )).toBe(2_248);
  });

  it('keeps cross-theme duplicates for review instead of deleting semantic data', () => {
    expect(renewalCharacterProfileAuditData.actualRemovedKeywords).toHaveLength(0);
    expect(
      renewalCharacterProfileAuditData.exactPersonalityPsychologyOverlaps,
    ).toHaveLength(81);
    expect(
      renewalCharacterProfileAuditData.crossCategoryTraitOverlaps,
    ).toHaveLength(24);
  });
});
