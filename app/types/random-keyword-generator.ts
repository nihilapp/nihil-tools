export type RandomKeywordGenerationCount = 1 | 5 | 10;

export interface RandomKeywordUiCategoryData {
  id: string;
  label: string;
  themeIds: readonly string[];
}

export interface RandomKeywordResult {
  id: string;
  categoryId: string;
  categoryLabel: string;
  themeId: string;
  themeLabel: string;
  keyword: string;
}
