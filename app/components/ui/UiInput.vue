<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const props = defineProps<{
  class?: string
  error?: string
  label?: string
  modelValue?: string
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const cssVariants = cva(
  [
    'w-full rounded-2 border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-focus/20',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

function onUpdateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <label class="flex flex-col gap-1 text-sm font-600 text-ink">
    <span v-if="props.label">{{ props.label }}</span>
    <input
      :value="props.modelValue"
      :aria-invalid="props.error ? 'true' : undefined"
      :class="cn([
        cssVariants({}),
        props.class,
      ])"
      @input="onUpdateValue"
    >
    <span
      v-if="props.error"
      class="text-sm text-danger">{{ props.error }}</span>
  </label>
</template>
