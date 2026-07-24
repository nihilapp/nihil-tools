<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { randomKeywordUiCategoriesData } from '~/data/random-keywords/random-keyword-ui-categories.data';
import type { RandomKeywordGenerationCount, RandomKeywordResult } from '~/types/random-keyword-generator';
import { generateRandomKeywords, getRandomKeywordThemes } from '~/utils/random-keyword-generator';
import { cn } from '~/utils/cn';

const cssVariants = cva([
  'flex min-h-0 flex-col gap-3',
], {
  variants: {},
  compoundVariants: [

  ],
  defaultVariants: {},
});

const activeCategoryId = ref('all');
const activeThemeId = ref('all');
const generationCount = ref<RandomKeywordGenerationCount>(1);
const results = ref<RandomKeywordResult[]>([
]);
const generationCountOptions: RandomKeywordGenerationCount[] = [
  1,
  5,
  10,
];

const activeThemes = computed(() => getRandomKeywordThemes(activeCategoryId.value));

function onSelectCategory(categoryId: string) {
  activeCategoryId.value = categoryId;
  activeThemeId.value = 'all';
  results.value = [
  ];
}

function onSelectTheme(themeId: string) {
  activeThemeId.value = themeId;
  results.value = [
  ];
}

function onSelectGenerationCount(count: RandomKeywordGenerationCount) {
  generationCount.value = count;
}

function onGenerateKeywords() {
  results.value = generateRandomKeywords(
    activeCategoryId.value,
    generationCount.value,
    Math.random,
    activeThemeId.value === 'all'
      ? undefined
      : activeThemeId.value,
  );
}
</script>

<template>
  <section :class="cn([cssVariants({})])">
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 class="text-h4 font-700 text-black-900">
          랜덤 키워드 생성기
        </h1>
        <p class="mt-1 text-sm text-black-600">
          카테고리를 고르고 필요한 수만큼 키워드를 뽑습니다.
        </p>
      </div>

      <NuxtLink
        to="/apps/random-keyword-generator/background-story"
        class="rounded-2 border border-black-200 bg-white px-3 py-2 text-sm font-700 text-black-700 transition-colors hover:border-blue-500 hover:text-blue-500"
      >
        캐릭터 배경 스토리
      </NuxtLink>
    </header>

    <div class="flex flex-wrap gap-2">
      <UiButton
        v-for="category in randomKeywordUiCategoriesData"
        :key="category.id"
        :variant="activeCategoryId === category.id ? 'primary' : 'secondary'"
        size="sm"
        @click="onSelectCategory(category.id)"
      >
        {{ category.label }}
      </UiButton>
    </div>

    <div class="flex flex-wrap gap-2 border-y border-black-200 py-3">
      <UiButton
        :variant="activeThemeId === 'all' ? 'outline' : 'ghost'"
        size="sm"
        @click="onSelectTheme('all')"
      >
        전체
      </UiButton>

      <UiButton
        v-for="theme in activeThemes"
        :key="theme.id"
        :variant="activeThemeId === theme.id ? 'outline' : 'ghost'"
        size="sm"
        @click="onSelectTheme(theme.id)"
      >
        {{ theme.label }}
      </UiButton>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UiButton
        v-for="countOption in generationCountOptions"
        :key="countOption"
        :variant="generationCount === countOption ? 'primary' : 'secondary'"
        @click="onSelectGenerationCount(countOption)"
      >
        {{ countOption }}개
      </UiButton>

      <UiButton
        variant="outline"
        @click="onGenerateKeywords"
      >
        키워드 뽑기
      </UiButton>
    </div>

    <div class="min-h-0 flex-1 rounded-2 border border-black-200 bg-white p-3">
      <ul
        v-if="results.length > 0"
        class="flex flex-col gap-2"
      >
        <li
          v-for="result in results"
          :key="result.id"
          class="rounded-2 border border-black-200 bg-black-50 p-3"
        >
          <p class="text-xs text-black-500">
            {{ result.categoryLabel }} · {{ result.themeLabel }}
          </p>
          <p class="mt-1 text-lg font-700 text-black-900">
            {{ result.keyword }}
          </p>
        </li>
      </ul>

      <div
        v-else
        class="flex min-h-48 items-center justify-center rounded-2 border border-dashed border-black-200 bg-black-50 p-3 text-sm text-black-500"
      >
        키워드 뽑기를 누르면 결과가 표시됩니다.
      </div>
    </div>
  </section>
</template>
