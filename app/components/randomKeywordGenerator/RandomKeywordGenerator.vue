<script setup lang="ts">
import { cva } from 'class-variance-authority';

import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { randomKeywordUiCategoriesData } from '~/data/random-keywords/random-keyword-ui-categories.data';
import type { RandomKeywordGenerationCount, RandomKeywordResult } from '~/types/random-keyword-generator';
import { generateRandomKeywords, getRandomKeywordThemes } from '~/utils/random-keyword-generator';
import { cn } from '~/utils/cn';

const cssVariants = cva([
  'flex h-full min-h-0 flex-col gap-3 overflow-hidden',
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

function onOpenBackgroundStory() {
  window.location.assign('/apps/random-keyword-generator/background-story');
}

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
  <UiPanelDivider
    direction="column"
    gap="sm"
    :class="cn([cssVariants({})])"
  >
    <UiPanel
      :width="0"
      background="surface">
      <header class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-sm text-black-600">
            카테고리를 고르고 필요한 수만큼 키워드를 뽑습니다.
          </p>
        </div>

        <UiButton
          data-testid="background-story-link"
          variant="secondary"
          @click="onOpenBackgroundStory"
        >
          캐릭터 배경 스토리
        </UiButton>
      </header>

      <div class="mt-3 flex flex-wrap gap-2">
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

      <div class="mt-3 flex flex-wrap gap-2 border-t border-hairline pt-3">
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

      <div class="mt-3 flex flex-wrap items-center gap-2">
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
    </UiPanel>

    <UiPanel
      class="min-h-0 overflow-hidden"
      background="surface">
      <div
        v-if="results.length > 0"
        class="h-full overflow-y-auto"
      >
        <ul class="flex flex-col gap-2">
          <li
            v-for="result in results"
            :key="result.id"
            class="rounded-2 border border-hairline bg-surface p-3"
          >
            <p class="text-xs text-black-500">
              {{ result.categoryLabel }} · {{ result.themeLabel }}
            </p>
            <p class="mt-1 text-lg font-700 text-black-900">
              {{ result.keyword }}
            </p>
          </li>
        </ul>
      </div>

      <div
        v-else
        class="flex min-h-48 items-center justify-center text-sm text-black-500"
      >
        키워드 뽑기를 누르면 결과가 표시됩니다.
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
