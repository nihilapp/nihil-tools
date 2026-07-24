import { describe, expect, it } from 'vitest';
import { characterBackgroundStoryCommonData } from '~/data/random-keywords/renewal/character-background-story-common.data';
import { characterBackgroundStoryFantasyData } from '~/data/random-keywords/renewal/character-background-story-fantasy.data';
import { characterBackgroundStoryRealWorldData } from '~/data/random-keywords/renewal/character-background-story-real-world.data';

describe('renewal character background story data', () => {
  it('keeps common origins separate from fantasy and real-world material', () => {
    expect(characterBackgroundStoryCommonData.origins).toHaveLength(100);
    expect(characterBackgroundStoryCommonData.origins).toContain('어딘가의 성지');

    expect(characterBackgroundStoryFantasyData.goals).toHaveLength(510);
    expect(characterBackgroundStoryFantasyData.originModifiers).toHaveLength(339);
    expect(characterBackgroundStoryFantasyData.originLocations).toHaveLength(492);

    expect(characterBackgroundStoryRealWorldData.goals).toHaveLength(519);
    expect(characterBackgroundStoryRealWorldData.origins).toHaveLength(175);
  });

  it('does not duplicate entries within a renewal pool', () => {
    const pools = [
      characterBackgroundStoryCommonData.origins,
      characterBackgroundStoryFantasyData.goals,
      characterBackgroundStoryFantasyData.originModifiers,
      characterBackgroundStoryFantasyData.originLocations,
      characterBackgroundStoryRealWorldData.goals,
      characterBackgroundStoryRealWorldData.origins,
    ];

    for (const pool of pools) {
      expect(new Set(pool).size).toBe(pool.length);
    }
  });
});
