<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

import type { UiSurfaceVariant } from '../../types/ui.types';

const props = withDefaults(defineProps<{
  class?: string
  variant?: UiSurfaceVariant
  padding?: 'none' | 'sm' | 'md'
}>(), {
  variant: 'default',
  padding: 'md',
});

const cssVariants = cva(
  [
    'rounded-2 border border-hairline text-ink shadow-surface',
  ],
  {
    variants: {
      variant: {
        default: 'bg-surface',
        soft: 'bg-canvas-soft',
        outlined: 'bg-transparent shadow-none',
      },
      padding: {
        none: '',
        sm: 'p-2',
        md: 'p-3',
      },
    },
    compoundVariants: [
    ],
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);
</script>

<template>
  <div
    :class="cn([
      cssVariants({
        variant: props.variant,
        padding: props.padding,
      }),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>
