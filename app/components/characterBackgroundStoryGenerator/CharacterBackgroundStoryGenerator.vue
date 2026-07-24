<script setup lang="ts">
import { cva } from 'class-variance-authority';

import type { CharacterBackgroundStoryMode, CharacterBackgroundStoryResult } from '~/types/character-background-story-generator';
import { generateCharacterBackgroundStory } from '~/utils/character-background-story-generator';
import { cn } from '~/utils/cn';

const cssVariants = cva([
  'flex min-h-0 flex-col gap-3',
], {
  variants: {},
  compoundVariants: [

  ],
  defaultVariants: {},
});

const activeMode = ref<CharacterBackgroundStoryMode>('common');
const result = ref<CharacterBackgroundStoryResult | null>(null);
const modeItems: Array<{ id: CharacterBackgroundStoryMode, label: string }> = [
  {
    'id': 'common',
    'label': '공용',
  },
  {
    'id': 'real-world',
    'label': '현실',
  },
  {
    'id': 'fantasy',
    'label': '판타지',
  },
];

function onSelectMode(mode: CharacterBackgroundStoryMode) {
  activeMode.value = mode;
  result.value = null;
}

function onGenerateBackgroundStory() {
  result.value = generateCharacterBackgroundStory(activeMode.value);
}
</script>

<template>
  <section :class="cn([cssVariants({})])">
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 class="text-h4 font-700 text-black-900">
          캐릭터 배경 스토리
        </h1>
        <p class="mt-1 text-sm text-black-600">
          목적, 출신지, 인물을 조합해 배경 문장 하나를 만듭니다.
        </p>
      </div>

      <NuxtLink
        to="/apps/random-keyword-generator"
        class="rounded-2 border border-black-200 bg-white px-3 py-2 text-sm font-700 text-black-700 transition-colors hover:border-blue-500 hover:text-blue-500"
      >
        일반 키워드
      </NuxtLink>
    </header>

    <div class="flex flex-wrap gap-2">
      <UiButton
        v-for="modeItem in modeItems"
        :key="modeItem.id"
        :variant="activeMode === modeItem.id ? 'primary' : 'secondary'"
        @click="onSelectMode(modeItem.id)"
      >
        {{ modeItem.label }}
      </UiButton>

      <UiButton
        variant="outline"
        @click="onGenerateBackgroundStory"
      >
        배경 생성
      </UiButton>
    </div>

    <article class="rounded-2 border border-black-200 bg-white p-3">
      <template v-if="result">
        <p class="text-xs font-700 text-blue-500">
          {{ modeItems.find((modeItem) => modeItem.id === result?.mode)?.label }} 배경
        </p>
        <p class="mt-2 text-xl font-700 leading-relaxed text-black-900">
          {{ result.sentence }}
        </p>
        <dl class="mt-4 grid gap-2 border-t border-black-200 pt-3 text-sm md:grid-cols-3">
          <div>
            <dt class="text-black-500">
              목적
            </dt>
            <dd class="mt-1 font-700 text-black-800">
              {{ result.purpose }}
            </dd>
          </div>
          <div>
            <dt class="text-black-500">
              출신지
            </dt>
            <dd class="mt-1 font-700 text-black-800">
              {{ result.origin }}
            </dd>
          </div>
          <div>
            <dt class="text-black-500">
              인물
            </dt>
            <dd class="mt-1 font-700 text-black-800">
              {{ result.person }}
            </dd>
          </div>
        </dl>
      </template>

      <div
        v-else
        class="flex min-h-48 items-center justify-center rounded-2 border border-dashed border-black-200 bg-black-50 p-3 text-sm text-black-500"
      >
        배경 생성을 누르면 문장 하나가 표시됩니다.
      </div>
    </article>
  </section>
</template>
