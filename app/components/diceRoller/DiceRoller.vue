<script setup lang="ts">
import { rollDiceExpression } from '@nihilapp/diceroll-v3';
import { cva } from 'class-variance-authority';
import { computed, ref } from 'vue';

import DiceRollerResult from '~/components/diceRoller/DiceRollerResult.vue';
import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { diceRollPresetData } from '~/data/dice-roller-presets.data';
import type { DiceRollHistoryItem } from '~/data/dice-roller.types';
import { cn } from '~/utils/cn';
import { buildPresetDiceExpression, createDiceRollHistoryItem } from '~/utils/dice-roller';

type DiceRollTab = 'preset' | 'custom';

const cssVariants = cva([
  'flex h-full min-h-0 flex-col gap-2 overflow-hidden',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});

const activeTab = ref<DiceRollTab>('preset');
const customError = ref('');
const customExpression = ref('');
const customHistory = ref<DiceRollHistoryItem[]>([
]);
const presetCount = ref(1);
const presetError = ref('');
const presetHistory = ref<DiceRollHistoryItem[]>([
]);
const presetId = ref('d20');

const selectedPreset = computed(() => diceRollPresetData.find((preset) => preset.id === presetId.value) ?? diceRollPresetData[0]!);
const activeHistory = computed(() => activeTab.value === 'preset'
  ? presetHistory.value
  : customHistory.value);
const isPresetCountDisabled = computed(() => !selectedPreset.value.supportsCount);

function onSelectTab(tab: DiceRollTab) {
  activeTab.value = tab;
}

function onUpdatePresetCount(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);

  presetCount.value = Number.isFinite(value) && value >= 1
    ? Math.floor(value)
    : 1;
}

function onUpdatePresetId(event: Event) {
  presetId.value = (event.target as HTMLSelectElement).value;
  presetError.value = '';

  if (!selectedPreset.value.supportsCount) {
    presetCount.value = 1;
  }
}

function onUpdateCustomExpression(event: Event) {
  customExpression.value = (event.target as HTMLInputElement).value;
  customError.value = '';
}

function onRollPreset() {
  const expression = buildPresetDiceExpression(selectedPreset.value, presetCount.value);

  try {
    presetHistory.value.unshift(createDiceRollHistoryItem(expression, rollDiceExpression(expression)));
    presetError.value = '';
  }
  catch (error) {
    presetError.value = error instanceof Error
      ? error.message
      : '주사위를 굴리지 못했습니다.';
  }
}

function onRollCustom() {
  const expression = customExpression.value.trim();

  if (!expression) {
    customError.value = '주사위식을 입력해 주세요.';
    return;
  }

  try {
    customHistory.value.unshift(createDiceRollHistoryItem(expression, rollDiceExpression(expression)));
    customError.value = '';
  }
  catch (error) {
    customError.value = error instanceof Error
      ? error.message
      : '주사위를 굴리지 못했습니다.';
  }
}

function onResetDice() {
  if (activeTab.value === 'preset') {
    presetCount.value = 1;
    presetError.value = '';
    presetHistory.value = [
    ];
    presetId.value = 'd20';
    return;
  }

  customError.value = '';
  customExpression.value = '';
  customHistory.value = [
  ];
}
</script>

<template>
  <UiPanelDivider
    direction="column"
    gap="sm"
    :class="cn([
      cssVariants({}),
    ])"
  >
    <UiPanel
      :width="0"
      background="surface">
      <div class="flex gap-1 border-b border-hairline">
        <button
          type="button"
          :class="activeTab === 'preset' ? 'border-primary text-primary' : 'border-transparent text-ink-muted'"
          class="border-b-2 px-3 py-2 text-sm font-700"
          @click="onSelectTab('preset')">프리셋</button>
        <button
          data-testid="custom-tab"
          type="button"
          :class="activeTab === 'custom' ? 'border-primary text-primary' : 'border-transparent text-ink-muted'"
          class="border-b-2 px-3 py-2 text-sm font-700"
          @click="onSelectTab('custom')">커스텀</button>
      </div>

      <form
        v-if="activeTab === 'preset'"
        class="mt-3 flex flex-wrap items-end gap-2"
        @submit.prevent="onRollPreset">
        <label class="flex min-w-20 flex-1 flex-col gap-1 text-sm font-600 text-ink">개수
          <input
            data-testid="preset-count"
            :value="presetCount"
            :disabled="isPresetCountDisabled"
            min="1"
            type="number"
            class="min-h-10 rounded-2 border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            @input="onUpdatePresetCount">
        </label>
        <label class="flex min-w-28 flex-1 flex-col gap-1 text-sm font-600 text-ink">주사위
          <select
            data-testid="preset-select"
            :value="presetId"
            class="min-h-10 rounded-2 border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            @change="onUpdatePresetId"><option
            v-for="preset in diceRollPresetData"
            :key="preset.id"
            :value="preset.id">{{ preset.label }}</option></select>
        </label>
        <UiButton
          data-testid="preset-reset"
          variant="secondary"
          @click="onResetDice">초기화</UiButton>
        <UiButton
          data-testid="preset-roll"
          type="submit"
          variant="primary">굴리기</UiButton>
        <p
          v-if="presetError"
          class="basis-full text-sm text-danger">{{ presetError }}</p>
      </form>

      <form
        v-else
        class="mt-3 flex flex-wrap items-end gap-2"
        @submit.prevent="onRollCustom">
        <label class="flex min-w-0 flex-1 flex-col gap-1 text-sm font-600 text-ink">주사위식
          <input
            data-testid="custom-expression"
            :value="customExpression"
            placeholder="예: d20+5"
            class="min-h-10 rounded-2 border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            @input="onUpdateCustomExpression">
        </label>
        <UiButton
          data-testid="custom-reset"
          variant="secondary"
          @click="onResetDice">초기화</UiButton>
        <UiButton
          data-testid="custom-roll"
          type="submit"
          variant="primary">굴리기</UiButton>
        <p
          v-if="customError"
          data-testid="custom-error"
          class="basis-full text-sm text-danger">{{ customError }}</p>
      </form>

    </UiPanel>

    <UiPanel
      class="min-h-0 overflow-hidden"
      background="surface">
      <div
        v-if="activeHistory.length > 0"
        class="h-full overflow-y-auto">
        <div class="flex flex-col gap-2"><DiceRollerResult
          v-for="item in activeHistory"
          :key="item.id"
          :item="item" /></div>
      </div>
      <p
        v-else
        class="flex h-full items-center justify-center text-sm text-ink-muted">굴린 결과가 여기에 표시됩니다.</p>
    </UiPanel>
  </UiPanelDivider>
</template>
