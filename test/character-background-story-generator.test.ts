import { describe, expect, it } from 'vitest';
import { generateCharacterBackgroundStory } from '~/utils/character-background-story-generator';

describe('character background story generator', () => {
  it.each([
    'common',
    'real-world',
    'fantasy',
  ] as const)('%s 모드에서 결과 문장 하나를 만든다', (mode) => {
    const result = generateCharacterBackgroundStory(mode, () => 0);

    expect(result.sentence).toBe(`${result.purpose}를 위해 ${result.origin}에서 온 ${result.person}`);
    expect(result.sentence).not.toHaveLength(0);
  });

  it('판타지 모드에서는 종족과 직업을 함께 사용한다', () => {
    const result = generateCharacterBackgroundStory('fantasy', () => 0);

    expect(result.person.split(' ')).toHaveLength(2);
  });
});
