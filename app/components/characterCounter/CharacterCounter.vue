<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { computed, ref } from 'vue';

import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { countCharacters } from '~/utils/character-counter';
import { cn } from '~/utils/cn';

const cssVariants = cva(
  [
    'flex h-full min-h-0 flex-col gap-3 overflow-hidden',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

const counterCssVariants = cva(
  [
    'flex min-w-0 flex-1 items-end justify-between gap-3 rounded-2 border border-hairline bg-surface px-4 py-3',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

const textareaCssVariants = cva(
  [
    'h-full min-h-80 w-full resize-none rounded-2 border border-hairline bg-surface p-4 text-base leading-7 text-ink outline-none',
    'placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-focus/20',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

const text = ref('');
const characterCounts = computed(() => countCharacters(text.value));
</script>

<template>
  <UiPanelDivider
    direction="column"
    gap="sm"
    :class="cn([
      cssVariants({}),
    ])"
  >
    <UiPanel
      :width="0"
      background="surface"
    >
      <header>
        <h1 class="font-700 text-ink">글자 수 체크</h1>
        <p class="mt-1 text-sm text-ink-muted">
          텍스트를 입력하면 공백 포함·미포함 글자 수를 실시간으로 계산합니다.
        </p>
      </header>

      <div class="mt-4 flex flex-col gap-2 sm:flex-row">
        <div
          data-testid="count-with-whitespace"
          :class="cn([
            counterCssVariants({}),
          ])"
        >
          <span class="text-sm font-600 text-ink-muted">공백 포함</span>
          <p class="shrink-0 text-right text-2xl font-700 text-ink">
            {{ characterCounts.withWhitespace.toLocaleString() }}<span class="ml-1 text-sm font-600 text-ink-muted">자</span>
          </p>
        </div>

        <div
          data-testid="count-without-whitespace"
          :class="cn([
            counterCssVariants({}),
          ])"
        >
          <span class="text-sm font-600 text-ink-muted">공백 미포함</span>
          <p class="shrink-0 text-right text-2xl font-700 text-ink">
            {{ characterCounts.withoutWhitespace.toLocaleString() }}<span class="ml-1 text-sm font-600 text-ink-muted">자</span>
          </p>
        </div>
      </div>
    </UiPanel>

    <UiPanel
      class="min-h-0 flex-1"
      background="surface"
    >
      <label class="flex h-full min-h-0 flex-col gap-2">
        <span class="text-sm font-600 text-ink">텍스트</span>
        <textarea
          v-model="text"
          data-testid="character-counter-input"
          placeholder="글자 수를 확인할 텍스트를 입력하세요."
          :class="cn([
            textareaCssVariants({}),
          ])"
        />
      </label>
    </UiPanel>
  </UiPanelDivider>
</template>
