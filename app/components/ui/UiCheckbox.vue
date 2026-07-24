<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

const props = withDefaults(defineProps<{
  class?: string
  disabled?: boolean
  label: string
  modelValue?: boolean
}>(), {
  class: '',
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const cssVariants = cva(
  [
    'size-4 rounded-1 border border-hairline text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

function onUpdateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    :class="cn([
      'flex items-center gap-2 text-sm text-ink',
      props.disabled && 'cursor-not-allowed text-ink-muted',
    ])"
  >
    <input
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      :class="cn([
        cssVariants({}),
        props.class,
      ])"
      @change="onUpdateValue"
    >
    <span>{{ props.label }}</span>
  </label>
</template>
