import { describe, expect, it } from 'vitest';
import { appListData } from '~/data/app-list.data';
import { randomKeywordUiCategoriesData } from '~/data/random-keywords/random-keyword-ui-categories.data';
import { generateRandomKeywords } from '~/utils/random-keyword-generator';

describe('random keyword generator', () => {
  it('전체에서는 대분류를 먼저 선택한다', () => {
    const results = generateRandomKeywords('all', 1, () => 0);

    expect(results).toHaveLength(1);
    expect(results[0]?.categoryId).toBe('nature-environment');
  });

  it('선택한 대분류에서 중복 없이 요청 수만큼 생성한다', () => {
    const results = generateRandomKeywords('nature-environment', 5, () => 0);

    expect(results).toHaveLength(5);
    expect(new Set(results.map((result) => result.id)).size).toBe(5);
  });

  it('전체에서도 세부 테마를 지정해 생성할 수 있다', () => {
    const results = generateRandomKeywords('all', 1, () => 0, 'health-diseases');

    expect(results[0]?.themeId).toBe('health-diseases');
  });

  it('전체와 여덟 개 대분류를 등록한다', () => {
    expect(randomKeywordUiCategoriesData.map((category) => category.id)).toEqual([
      'all',
      'nature-environment',
      'objects-materials',
      'culture-faith-mythology',
      'health-diseases',
      'abstract-state-abilities',
      'people-characters',
      'fantasy-beings',
      'modifiers',
    ]);
  });

  it('랜덤 키워드 생성기 앱을 등록한다', () => {
    expect(appListData.some((app) => (
      app.url === '/random-keyword-generator'
    ))).toBe(true);
  });
});
