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

interface RollValue {
  isCritical: boolean
  isDropped: boolean
  isFumble: boolean
  result: number
}

function getDetailValues(detail: DiceBlockRollDetail): RollValue[] {
  const result = detail.rollResult;

  if ('rolls' in result) {
    return result.rolls.map((roll) => ({
      ...roll,
      isDropped: false,
    }));
  }

  if ('all' in result) {
    return result.all.map((roll) => ({
      ...roll,
      isDropped: result.dropped.some((dropped) => dropped === roll || (
        dropped.isCritical === roll.isCritical &&
        dropped.isFumble === roll.isFumble &&
        dropped.result === roll.result
      )),
    }));
  }

  if ('dice' in result) {
    return result.dice.map((value) => ({
      isCritical: false,
      isDropped: false,
      isFumble: false,
      result: value,
    }));
  }

  if ('result' in result) {
    return [
      {
        ...result,
        isDropped: false,
      },
    ];
  }

  return [
  ];
}
</script>

<template>
  <div
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
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
        <span
          v-if="getDetailValues(detail).length > 0"
          class="flex flex-wrap gap-1"
        >
          <span
            v-for="value in getDetailValues(detail)"
            :key="`${detail.block}-${value.result}`"
            :data-testid="`roll-value-${value.result}`"
            :class="cn([
              value.isDropped
                ? 'font-700 text-ink-muted line-through'
                : value.isFumble
                  ? 'font-700 text-danger'
                  : value.isCritical
                    ? 'font-700 text-success'
                    : '',
            ])"
          >{{ value.result }}</span>
        </span>
        <span v-if="detail.contribution !== result.total">= {{ detail.contribution }}</span>
      </div>

      <p
        v-if="result.modifiers.length > 0"
        class="text-sm text-ink-muted"
      >
        보정치 {{ result.modifiers.map((modifier) => `${modifier.sign}${modifier.value}`).join(' ') }}
      </p>
    </div>
  </div>
</template>
