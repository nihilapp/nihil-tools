import { describe, expect, it } from 'vitest';
import { randomKeywordsCatalogData } from '~/data/random-keywords/random-keywords-catalog.data';
import { renewalKeywordsCatalogData } from '~/data/random-keywords/renewal/renewal-keywords-catalog.data';

describe('renewal modifier keywords', () => {
  it('moves modifiers into explicit usage themes without removing keywords', () => {
    expect(randomKeywordsCatalogData.map((pool) => pool.id)).not.toContain(
      'misc-modifiers',
    );

    const modifierThemes = renewalKeywordsCatalogData.filter((theme) => (
      theme.sourcePoolIds.includes('misc-modifiers')
    ));

    expect(modifierThemes).toHaveLength(8);
    expect(modifierThemes.reduce(
      (count, theme) => count + theme.sourceKeywordCount,
      0,
    )).toBe(2_950);
  });
});
