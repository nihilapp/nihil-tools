<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { ref } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import UiRadioGroup from '~/components/ui/UiRadioGroup.vue';
import { generateUuids, uuidVersionOptions, type UuidVersion } from '~/utils/uuid-generator';
import { cn } from '~/utils/cn';

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

const uuidVersion = ref<UuidVersion>('v7');
const generationCount = ref<1 | 5 | 10>(1);
const generatedUuids = ref<string[]>([
]);
const errorMessage = ref('');
const copyMessage = ref('');
const generationCountOptions: Array<1 | 5 | 10> = [
  1,
  5,
  10,
];

function onSelectGenerationCount(count: 1 | 5 | 10) {
  generationCount.value = count;
}

function onGenerateUuids() {
  errorMessage.value = '';
  copyMessage.value = '';
  generatedUuids.value = [
    ...generateUuids(
      uuidVersion.value,
      generationCount.value,
    ),
    ...generatedUuids.value,
  ];
}

function onResetUuids() {
  errorMessage.value = '';
  copyMessage.value = '';
  generatedUuids.value = [
  ];
}

async function onCopyUuid(uuid: string) {
  copyMessage.value = '';

  if (!navigator.clipboard) {
    errorMessage.value = '클립보드를 사용할 수 없습니다.';
    return;
  }

  await navigator.clipboard.writeText(uuid);
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
        <h1 class="font-700 text-ink">UUID 생성기</h1>
        <p class="mt-1 text-sm text-ink-muted">
          UUID 버전과 생성 개수를 선택해 UUID를 생성합니다.
        </p>
      </header>

      <div class="mt-3 grid gap-3">
        <UiRadioGroup
          v-model="uuidVersion"
          data-testid="uuid-version"
          label="UUID 버전"
          :options="uuidVersionOptions"
        />

        <fieldset class="grid gap-2">
          <legend class="text-sm font-600 text-ink">생성 개수</legend>
          <div class="flex flex-wrap gap-2">
            <UiButton
              v-for="countOption in generationCountOptions"
              :key="countOption"
              :data-testid="`uuid-count-${countOption}`"
              :variant="generationCount === countOption ? 'primary' : 'secondary'"
              @click="onSelectGenerationCount(countOption)"
            >
              {{ countOption }}개
            </UiButton>
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
            data-testid="reset-uuid"
            variant="secondary"
            @click="onResetUuids"
          >
            초기화
          </UiButton>
          <UiButton
            data-testid="generate-uuid"
            variant="primary"
            @click="onGenerateUuids"
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
        v-if="generatedUuids.length > 0"
        class="h-full overflow-y-auto"
      >
        <ul class="flex flex-col gap-2">
          <li
            v-for="(uuid, uuidIndex) in generatedUuids"
            :key="`${uuidIndex}-${uuid}`"
            class="flex items-start justify-between gap-3 rounded-2 border border-hairline bg-surface p-3"
          >
            <p
              data-testid="generated-uuid-value"
              class="min-w-0 flex-1 break-all font-mono text-sm font-700 text-ink"
            >
              {{ uuid }}
            </p>
            <UiButton
              data-testid="copy-uuid"
              size="sm"
              @click="onCopyUuid(uuid)"
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
        생성하기를 누르면 UUID가 표시됩니다.
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
