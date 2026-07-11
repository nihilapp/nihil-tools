<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const props = defineProps<{ class?: string, title?: string, description?: string }>();
const cssVariants = cva([
  'flex flex-col gap-3',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});
</script>

<template>
  <section :class="cn([cssVariants({}), props.class])">
    <header
      v-if="props.title || props.description || $slots['header-actions']"
      class="flex flex-wrap items-start justify-between gap-2">
      <div
        v-if="props.title || props.description"
        class="min-w-0">
        <h2
          v-if="props.title"
          class="text-lg font-700 text-ink">{{ props.title }}</h2>
        <p
          v-if="props.description"
          class="mt-1 text-sm text-ink-muted">{{ props.description }}</p>
      </div>
      <slot name="header-actions" />
    </header>
    <slot />
    <footer v-if="$slots.footer"><slot name="footer" /></footer>
  </section>
</template>
