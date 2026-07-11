<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const props = withDefaults(defineProps<{
  class?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  class: '',
  variant: 'secondary',
  size: 'md',
  type: 'button',
});

const cssVariants = cva([
  'inline-flex items-center justify-center gap-2 rounded-2 font-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
], {
  variants: {
    variant: {
      primary: 'bg-primary text-on-primary hover:bg-primary-active',
      secondary: 'border border-hairline bg-surface text-ink hover:bg-canvas-soft',
      outline: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
      ghost: 'bg-transparent text-ink hover:bg-canvas-soft',
      danger: 'bg-danger text-on-primary hover:bg-danger/90',
    },
    size: {
      sm: 'min-h-8 px-2 py-1 text-sm',
      md: 'min-h-10 px-3 py-2 text-sm',
    },
  },
  compoundVariants: [
  ],
  defaultVariants: {
    variant: 'secondary',
    size: 'md',
  },
});
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading || undefined"
    :class="cn([cssVariants({ variant: props.variant, size: props.size }), props.class])">
    <slot />
  </button>
</template>
