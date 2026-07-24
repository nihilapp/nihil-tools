import { randomKeywordUiCategoriesData } from '~/data/random-keywords/random-keyword-ui-categories.data';
import { renewalKeywordsCatalogData } from '~/data/random-keywords/renewal/renewal-keywords-catalog.data';
import type { RandomKeywordGenerationCount, RandomKeywordResult, RandomKeywordUiCategoryData } from '~/types/random-keyword-generator';

interface KeywordCandidate {
  themeId: string;
  themeLabel: string;
  keyword: string;
}

const themeMetadataKeys = new Set([
  'id',
  'label',
  'sourcePoolIds',
  'sourceKeywordCount',
]);

function extractKeywordStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [
      value,
    ];
  }

  if (!Array.isArray(value)) {
    return [
    ];
  }

  return value.flatMap((item) => extractKeywordStrings(item));
}

function getKeywordCandidates(themeIds: readonly string[]): KeywordCandidate[] {
  return renewalKeywordsCatalogData
    .filter((theme) => themeIds.includes(theme.id))
    .flatMap((theme) => {
      const themeValues = theme as Record<string, unknown>;

      return Object.entries(themeValues)
        .filter(([
          key,
        ]) => !themeMetadataKeys.has(key))
        .flatMap(([
          , value,
        ]) => extractKeywordStrings(value))
        .map((keyword) => ({
          'themeId': theme.id,
          'themeLabel': theme.label,
          keyword,
        }));
    });
}

function pickOne<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function getCategory(categoryId: string): RandomKeywordUiCategoryData {
  return randomKeywordUiCategoriesData.find((category) => category.id === categoryId) ??
    randomKeywordUiCategoriesData[0]!;
}

function createResult(
  category: RandomKeywordUiCategoryData,
  candidate: KeywordCandidate,
): RandomKeywordResult {
  return {
    'id': `${candidate.themeId}:${candidate.keyword}`,
    'categoryId': category.id,
    'categoryLabel': category.label,
    'themeId': candidate.themeId,
    'themeLabel': candidate.themeLabel,
    'keyword': candidate.keyword.split('/').at(-1)!,
  };
}

export function getRandomKeywordThemes(categoryId: string) {
  const category = getCategory(categoryId);

  if (category.id === 'all') {
    return renewalKeywordsCatalogData;
  }

  return renewalKeywordsCatalogData.filter((theme) => category.themeIds.includes(theme.id));
}

export function generateRandomKeywords(
  categoryId: string,
  count: RandomKeywordGenerationCount,
  random: () => number = Math.random,
  themeId?: string,
): RandomKeywordResult[] {
  const selectedCategory = getCategory(categoryId);
  const selectableCategories = selectedCategory.id === 'all'
    ? randomKeywordUiCategoriesData.filter((category) => category.id !== 'all')
    : [
      selectedCategory,
    ];
  const results: RandomKeywordResult[] = [
  ];
  const usedResultIds = new Set<string>();

  while (results.length < count) {
    const category = themeId
      ? selectableCategories.find((item) => item.themeIds.includes(themeId))
      : pickOne(selectableCategories, random);

    if (!category) {
      break;
    }

    const candidates = getKeywordCandidates(themeId
      ? [
        themeId,
      ]
      : category.themeIds).filter((candidate) => (
      !usedResultIds.has(`${candidate.themeId}:${candidate.keyword}`)
    ));

    if (candidates.length === 0) {
      break;
    }

    const candidate = pickOne(candidates, random);
    const result = createResult(category, candidate);

    usedResultIds.add(result.id);
    results.push(result);
  }

  return results;
}
