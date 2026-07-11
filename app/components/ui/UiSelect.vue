<script setup lang="ts">
import { cva } from 'class-variance-authority'; import { cn } from '../../utils/cn'; import type { UiOption } from '../../types/ui.types';
const props = defineProps<{ modelValue?: string, options: UiOption[], label?: string, class?: string }>(); const emit = defineEmits<{ 'update:modelValue': [value: string] }>(); const cssVariants = cva([
  'w-full rounded-2 border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
}); function onUpdateValue(event: Event) { emit('update:modelValue', (event.target as HTMLSelectElement).value); }
</script>
<template><label class="flex flex-col gap-1 text-sm font-600 text-ink"><span v-if="props.label">{{ props.label }}</span><select
  :value="props.modelValue"
  :class="cn([cssVariants({}), props.class])"
  @change="onUpdateValue"><option
  v-for="option in props.options"
  :key="option.value"
  :value="option.value"
  :disabled="option.disabled">{{ option.label }}</option></select></label></template>
