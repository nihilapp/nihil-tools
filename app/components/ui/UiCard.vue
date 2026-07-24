<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

const props = withDefaults(defineProps<{
  class?: string
  padding?: 'none' | 'sm' | 'md'
  variant?: 'default' | 'soft' | 'outlined'
}>(), {
  class: '',
  padding: 'md',
  variant: 'default',
});

const cssVariants = cva(
  [
    'rounded-2 border border-hairline text-ink shadow-surface',
  ],
  {
    variants: {
      padding: {
        none: '',
        sm: 'p-2',
        md: 'p-3',
      },
      variant: {
        default: 'bg-surface',
        soft: 'bg-canvas-soft',
        outlined: 'bg-transparent shadow-none',
      },
    },
    compoundVariants: [
    ],
    defaultVariants: {
      padding: 'md',
      variant: 'default',
    },
  },
);
</script>

<template>
  <div
    :class="cn([
      cssVariants({
        padding: props.padding,
        variant: props.variant,
      }),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>
