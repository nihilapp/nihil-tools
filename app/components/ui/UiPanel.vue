<script setup lang="ts">
import { computed } from 'vue';
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

type UiPanelRole = 'div' | 'main' | 'aside' | 'article' | 'section';

const props = withDefaults(defineProps<{
  background?: 'surface' | 'soft' | 'transparent'
  border?: 'default' | 'none' | 'primary'
  class?: string
  padding?: 'none' | 'sm' | 'md'
  role?: UiPanelRole
  width?: number
}>(), {
  background: 'surface',
  border: 'default',
  class: '',
  padding: 'md',
  role: 'div',
});

const cssVariants = cva(
  [
    'min-w-0 rounded-2 text-ink',
  ],
  {
    variants: {
      background: {
        surface: 'bg-surface',
        soft: 'bg-canvas-soft',
        transparent: 'bg-transparent',
      },
      border: {
        default: 'border border-hairline',
        none: 'border-0',
        primary: 'border border-primary',
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
      background: 'surface',
      border: 'default',
      padding: 'md',
    },
  },
);

const flexStyle = computed(() => ({
  flex: `${props.width ?? 1} 1 0%`,
}));
</script>

<template>
  <component
    :is="props.role"
    :style="flexStyle"
    :class="cn([
      cssVariants({
        background: props.background,
        border: props.border,
        padding: props.padding,
      }),
      props.class,
    ])"
  >
    <slot />
  </component>
</template>
