<script setup lang="ts">
import { cva } from 'class-variance-authority';

import type { DiceBlockRollDetail } from '@nihilapp/diceroll-v3';

import type { DiceRollHistoryItem } from '~/data/dice-roller.types';
import { cn } from '~/utils/cn';

const props = defineProps<{
  class?: string
  item: DiceRollHistoryItem
}>();

const cssVariants = cva([
  'flex flex-col gap-2 rounded-2 border border-hairline bg-surface p-3',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});

function getDetailValues(detail: DiceBlockRollDetail): Array<number> {
  const result = detail.rollResult;

  if ('rolls' in result) {
    return result.rolls.map((roll) => roll.result);
  }

  if ('all' in result) {
    return result.all.map((roll) => roll.result);
  }

  if ('dice' in result) {
    return result.dice;
  }

  if ('result' in result) {
    return [
      result.result,
    ];
  }

  return [
  ];
}
</script>

<template>
  <article
    :class="cn([
      cssVariants({}),
      props.class,
    ])">
    <div
      v-for="result in props.item.results"
      :key="result.expression"
      class="flex flex-col gap-2 border-b border-hairline pb-2 last:border-b-0 last:pb-0"
    >
      <div class="flex items-baseline justify-between gap-2">
        <code class="min-w-0 truncate text-sm font-700 text-ink">{{ result.expression }}</code>
        <strong class="shrink-0 text-h4 text-primary">{{ result.total }}</strong>
      </div>

      <div
        v-for="detail in result.rollDetails"
        :key="detail.block"
        class="flex flex-wrap items-center gap-1 text-sm text-ink-muted"
      >
        <span class="font-600 text-ink">{{ detail.block }}</span>
        <span v-if="getDetailValues(detail).length > 0">{{ getDetailValues(detail).join(', ') }}</span>
        <span v-if="detail.contribution !== result.total">= {{ detail.contribution }}</span>
      </div>

      <p
        v-if="result.modifiers.length > 0"
        class="text-sm text-ink-muted"
      >
        보정치 {{ result.modifiers.map((modifier) => `${modifier.sign}${modifier.value}`).join(' ') }}
      </p>
    </div>
  </article>
</template>
