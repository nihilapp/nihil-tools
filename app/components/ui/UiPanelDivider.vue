<script setup lang="ts">
import { computed } from 'vue';
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

const props = withDefaults(defineProps<{
  class?: string
  direction?: 'row' | 'column'
  gap?: 'none' | 'sm' | 'md'
  width?: number
}>(), {
  class: '',
  direction: 'row',
  gap: 'md',
});

const cssVariants = cva(
  [
    'flex min-w-0',
  ],
  {
    variants: {
      direction: {
        row: 'flex-row',
        column: 'flex-col',
      },
      gap: {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-3',
      },
    },
    compoundVariants: [
    ],
    defaultVariants: {
      direction: 'row',
      gap: 'md',
    },
  },
);

const flexStyle = computed(() => ({
  flex: `${props.width ?? 1} 1 0%`,
}));
</script>

<template>
  <div
    :style="flexStyle"
    :class="cn([
      cssVariants({
        direction: props.direction,
        gap: props.gap,
      }),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>
