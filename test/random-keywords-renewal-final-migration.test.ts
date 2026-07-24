import { describe, expect, it } from 'vitest';
import { randomKeywordsCatalogData } from '~/data/random-keywords/random-keywords-catalog.data';
import { renewalKeywordsCatalogData } from '~/data/random-keywords/renewal/renewal-keywords-catalog.data';

describe('final renewal keyword migration', () => {
  it('moves every remaining legacy pool into renewal themes without data loss', () => {
    expect(randomKeywordsCatalogData).toHaveLength(0);

    const finalThemes = renewalKeywordsCatalogData.filter((theme) => (
      theme.sourcePoolIds.some((id) => [
        'misc-religion',
        'misc-fantasy-creatures',
        'character-monsters',
        'character-social-statuses',
        'character-races',
        'character-archetypes',
      ].includes(id))
    ));

    expect(finalThemes.reduce(
      (count, theme) => count + theme.sourceKeywordCount,
      0,
    )).toBe(5_326);
  });
});
