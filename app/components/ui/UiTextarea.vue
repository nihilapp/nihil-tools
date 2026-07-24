<script setup lang="ts">
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/cn';

const props = withDefaults(defineProps<{
  class?: string
  disabled?: boolean
  error?: string
  label?: string
  modelValue?: string
  placeholder?: string
  rows?: number
}>(), {
  class: '',
  modelValue: '',
  placeholder: '',
  rows: 4,
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const cssVariants = cva(
  [
    'w-full resize-y rounded-2 border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      invalid: {
        true: 'border-danger focus:border-danger focus:ring-danger/20',
        false: '',
      },
    },
    compoundVariants: [
    ],
    defaultVariants: {
      invalid: false,
    },
  },
);

function onUpdateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <label class="flex flex-col gap-1 text-sm font-600 text-ink">
    <span v-if="props.label">{{ props.label }}</span>
    <textarea
      :value="props.modelValue"
      :rows="props.rows"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :aria-invalid="props.error ? 'true' : undefined"
      :class="cn([
        cssVariants({
          invalid: Boolean(props.error),
        }),
        props.class,
      ])"
      @input="onUpdateValue"
    />
    <span
      v-if="props.error"
      class="text-sm text-danger"
    >{{ props.error }}</span>
  </label>
</template>
