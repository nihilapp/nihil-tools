<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

import type { UiOption } from '~/types/ui.types';

const props = withDefaults(defineProps<{
  class?: string
  disabled?: boolean
  label?: string
  modelValue?: string
  options: UiOption[]
}>(), {
  class: '',
  label: '',
  modelValue: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const cssVariants = cva(
  [
    'size-4 border border-hairline text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50',
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
  <fieldset
    :class="cn([
      'flex flex-col gap-2',
      props.class,
    ])"
    :disabled="props.disabled"
  >
    <legend
      v-if="props.label"
      class="mb-1 text-sm font-600 text-ink"
    >{{ props.label }}</legend>
    <label
      v-for="option in props.options"
      :key="option.value"
      :class="cn([
        'flex items-center gap-2 text-sm text-ink',
        (props.disabled || option.disabled) && 'cursor-not-allowed text-ink-muted',
      ])"
    >
      <input
        type="radio"
        :value="option.value"
        :checked="props.modelValue === option.value"
        :disabled="props.disabled || option.disabled"
        :class="cssVariants({})"
        @change="onUpdateValue"
      >
      <span>{{ option.label }}</span>
    </label>
  </fieldset>
</template>
