<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { ref } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiCheckbox from '~/components/ui/UiCheckbox.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { cn } from '~/utils/cn';
import { generateRandomString, randomStringCharacterRanges, type RandomStringCharacterRangeSelection } from '~/utils/random-string-generator';

const cssVariants = cva(
  [
    'flex h-full min-h-0 flex-col gap-3 overflow-hidden',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);

const inputCssVariants = cva(
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

const length = ref(16);
const selection = ref<RandomStringCharacterRangeSelection>({
  lowercase: true,
  number: true,
  special: false,
  uppercase: true,
});
const generatedStrings = ref<string[]>([
]);
const errorMessage = ref('');
const copyMessage = ref('');
const characterRanges = Object.entries(randomStringCharacterRanges).map(([
  id,
  range,
]) => ({
  id: id as keyof RandomStringCharacterRangeSelection,
  ...range,
}));

function onGenerateString() {
  errorMessage.value = '';
  copyMessage.value = '';

  if (!Number.isInteger(length.value) || length.value < 1) {
    errorMessage.value = '길이는 1 이상의 정수로 입력하세요.';
    return;
  }

  if (!Object.values(selection.value).some(Boolean)) {
    errorMessage.value = '하나 이상의 문자 범위를 선택하세요.';
    return;
  }

  generatedStrings.value = [
    generateRandomString(
      length.value,
      selection.value,
    ),
    ...generatedStrings.value,
  ];
}

function onResetStrings() {
  errorMessage.value = '';
  copyMessage.value = '';
  generatedStrings.value = [
  ];
}

async function onCopyString(value: string) {
  copyMessage.value = '';

  if (!navigator.clipboard) {
    errorMessage.value = '클립보드를 사용할 수 없습니다.';
    return;
  }

  await navigator.clipboard.writeText(value);
  copyMessage.value = '복사되었습니다.';
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
      background="surface"
    >
      <header>
        <h1 class="font-700 text-ink">랜덤 문자열 생성기</h1>
        <p class="mt-1 text-sm text-ink-muted">
          길이와 포함할 문자 범위를 설정해 문자열을 생성합니다.
        </p>
      </header>

      <div class="mt-3 grid gap-3">
        <label
          data-testid="string-length"
          class="flex max-w-48 flex-col gap-1 text-sm font-600 text-ink"
        >
          <span>길이</span>
          <input
            v-model.number="length"
            min="1"
            type="number"
            :class="cn([
              inputCssVariants({}),
            ])"
          >
        </label>

        <fieldset class="grid gap-2">
          <legend class="text-sm font-600 text-ink">포함할 문자</legend>
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <UiCheckbox
              v-for="range in characterRanges"
              :key="range.id"
              v-model="selection[range.id]"
              data-testid="character-range"
              :label="range.label"
            />
          </div>
        </fieldset>

        <p
          v-if="errorMessage"
          class="text-sm text-danger"
        >
          {{ errorMessage }}
        </p>

        <p
          v-if="copyMessage"
          class="text-sm text-success"
        >
          {{ copyMessage }}
        </p>

        <div class="flex flex-wrap gap-2">
          <UiButton
            data-testid="reset-string"
            variant="secondary"
            @click="onResetStrings"
          >
            초기화
          </UiButton>
          <UiButton
            data-testid="generate-string"
            variant="primary"
            @click="onGenerateString"
          >
            생성하기
          </UiButton>
        </div>
      </div>
    </UiPanel>

    <UiPanel
      class="min-h-0 overflow-hidden"
      background="surface"
    >
      <div
        v-if="generatedStrings.length > 0"
        class="h-full overflow-y-auto"
      >
        <ul class="flex flex-col gap-2">
          <li
            v-for="(generatedString, generatedStringIndex) in generatedStrings"
            :key="`${generatedStringIndex}-${generatedString}`"
            class="flex items-start justify-between gap-3 rounded-2 border border-hairline bg-surface p-3"
          >
            <p
              data-testid="generated-string-value"
              class="min-w-0 flex-1 break-all font-mono text-sm font-700 text-ink"
            >
              {{ generatedString }}
            </p>
            <UiButton
              data-testid="copy-string"
              size="sm"
              @click="onCopyString(generatedString)"
            >
              복사
            </UiButton>
          </li>
        </ul>
      </div>

      <div
        v-else
        class="flex min-h-48 items-center justify-center text-sm text-ink-muted"
      >
        생성하기를 누르면 문자열이 표시됩니다.
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
