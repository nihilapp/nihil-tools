<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { computed, ref } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import UiTextarea from '~/components/ui/UiTextarea.vue';
import { defaultArgon2MemoryCost, defaultArgon2Parallelism, defaultArgon2TimeCost, defaultBcryptCost, legacyHashWarning, passwordHashAlgorithmOptions } from '~/data/password-hash-tester.data';
import type { CompareResult, HashResult, PasswordHashAlgorithm } from '~/types/password-hash-tester';
import { cn } from '~/utils/cn';

const cssVariants = cva([
  'flex h-full min-h-0 gap-2 overflow-hidden',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});

const inputCssVariants = cva([
  'w-full rounded-2 border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-focus/20',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});

const hashAlgorithm = ref<PasswordHashAlgorithm>('md5');
const hashValue = ref('');
const bcryptCost = ref(defaultBcryptCost);
const argon2MemoryCost = ref(defaultArgon2MemoryCost);
const argon2TimeCost = ref(defaultArgon2TimeCost);
const argon2Parallelism = ref(defaultArgon2Parallelism);
const hashError = ref('');
const hashResult = ref<HashResult | null>(null);
const isHashing = ref(false);
const compareAlgorithm = ref<PasswordHashAlgorithm>('md5');
const compareValue = ref('');
const compareHash = ref('');
const compareError = ref('');
const compareResult = ref<CompareResult | null>(null);
const isComparing = ref(false);
const isHashValueVisible = ref(false);

const fixedHashOptions = computed(() => passwordHashAlgorithmOptions.filter((option) => option.group === 'fixed'));
const passwordHashOptions = computed(() => passwordHashAlgorithmOptions.filter((option) => option.group === 'password'));
const isLegacyHash = computed(() => hashAlgorithm.value === 'md5' || hashAlgorithm.value === 'sha1');
const hashSummary = computed(() => hashResult.value?.settings.map((setting) => `${setting.label} ${setting.value}`).join(' · ') ?? '');

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message
    ? error.message
    : fallback;
}

function getCompareAlgorithm() {
  if (/^\$2[aby]\$/.test(compareHash.value)) {
    return 'bcrypt' as const;
  }

  if (compareHash.value.startsWith('$argon2id$')) {
    return 'argon2id' as const;
  }

  return compareAlgorithm.value;
}

async function onSubmitHash() {
  hashError.value = '';
  hashResult.value = null;
  isHashing.value = true;

  const body: Record<string, number | PasswordHashAlgorithm | string> = {
    algorithm: hashAlgorithm.value,
    value: hashValue.value,
  };

  if (hashAlgorithm.value === 'bcrypt') {
    body.bcryptCost = bcryptCost.value;
  }

  if (hashAlgorithm.value === 'argon2id') {
    body.argon2MemoryCost = argon2MemoryCost.value;
    body.argon2Parallelism = argon2Parallelism.value;
    body.argon2TimeCost = argon2TimeCost.value;
  }

  try {
    hashResult.value = await $fetch<HashResult>('/api/password-hash/hash', {
      body,
      method: 'POST',
    });
  }
  catch (error) {
    hashError.value = getErrorMessage(error, '해시를 생성하지 못했습니다.');
  }
  finally {
    isHashing.value = false;
  }
}

async function onSubmitCompare() {
  compareError.value = '';
  compareResult.value = null;
  isComparing.value = true;

  try {
    compareResult.value = await $fetch<CompareResult>('/api/password-hash/compare', {
      body: {
        algorithm: getCompareAlgorithm(),
        hash: compareHash.value,
        value: compareValue.value,
      },
      method: 'POST',
    });
  }
  catch (error) {
    compareError.value = getErrorMessage(error, '해시를 비교하지 못했습니다.');
  }
  finally {
    isComparing.value = false;
  }
}

async function onCopyHash() {
  if (!hashResult.value || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(hashResult.value.hash);
}
</script>

<template>
  <UiPanelDivider
    data-testid="hash-tester-layout"
    direction="row"
    gap="sm"
    :class="cn([
      cssVariants({}),
      'max-md:flex-col',
    ])"
  >
    <UiPanel
      class="flex min-h-0 flex-col overflow-hidden"
      background="surface"
    >
      <div class="flex items-center justify-between gap-2">
        <div>
          <h1 class="font-700 text-ink">Hash</h1>
          <p class="mt-1 text-sm text-ink-muted">문자열을 선택한 방식으로 변환합니다.</p>
        </div>
        <span class="rounded-2 bg-canvas-soft px-2 py-1 text-xs font-700 text-ink-muted">저장하지 않음</span>
      </div>

      <div
        data-testid="hash-panel-content"
        class="min-h-0 flex-1 overflow-y-auto pr-1"
      >
        <form
          data-testid="hash-form"
          class="mt-3 grid gap-3"
          @submit.prevent="onSubmitHash"
        >
          <label
            data-testid="hash-value"
            class="flex flex-col gap-1 text-sm font-600 text-ink"
          >
            <span>문자열</span>
            <div class="flex gap-2">
              <input
                v-model="hashValue"
                :type="isHashValueVisible ? 'text' : 'password'"
                :class="cn([
                  inputCssVariants({}),
                ])"
              >
              <UiButton
                type="button"
                variant="secondary"
                @click="isHashValueVisible = !isHashValueVisible"
              >{{ isHashValueVisible ? '숨기기' : '표시' }}</UiButton>
            </div>
          </label>

          <label
            data-testid="hash-algorithm"
            class="flex flex-col gap-1 text-sm font-600 text-ink"
          >
            <span>해시 방식</span>
            <select
              v-model="hashAlgorithm"
              :class="cn([
                inputCssVariants({}),
              ])"
            >
              <optgroup label="고정 해시">
                <option
                  v-for="option in fixedHashOptions"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </optgroup>
              <optgroup label="비밀번호 해시">
                <option
                  v-for="option in passwordHashOptions"
                  :key="option.value"
                  :value="option.value"
                >{{ option.label }}</option>
              </optgroup>
            </select>
          </label>

          <p
            v-if="isLegacyHash"
            class="text-sm text-danger"
          >{{ legacyHashWarning }}</p>

          <label
            v-if="hashAlgorithm === 'bcrypt'"
            data-testid="bcrypt-cost"
            class="flex flex-col gap-1 text-sm font-600 text-ink"
          >
            <span>비용</span>
            <input
              v-model.number="bcryptCost"
              min="4"
              max="15"
              type="number"
              :class="cn([
                inputCssVariants({}),
              ])"
            >
          </label>

          <div
            v-if="hashAlgorithm === 'argon2id'"
            class="grid gap-3 sm:grid-cols-3"
          >
            <label
              data-testid="argon2-memory-cost"
              class="flex flex-col gap-1 text-sm font-600 text-ink"
            >
              <span>메모리 (KiB)</span>
              <input
                v-model.number="argon2MemoryCost"
                min="8192"
                max="65536"
                type="number"
                :class="cn([
                  inputCssVariants({}),
                ])"
              >
            </label>
            <label class="flex flex-col gap-1 text-sm font-600 text-ink">
              <span>반복</span>
              <input
                v-model.number="argon2TimeCost"
                min="1"
                max="10"
                type="number"
                :class="cn([
                  inputCssVariants({}),
                ])"
              >
            </label>
            <label class="flex flex-col gap-1 text-sm font-600 text-ink">
              <span>병렬성</span>
              <input
                v-model.number="argon2Parallelism"
                min="1"
                max="4"
                type="number"
                :class="cn([
                  inputCssVariants({}),
                ])"
              >
            </label>
          </div>

          <p
            v-if="hashError"
            class="text-sm text-danger"
          >{{ hashError }}</p>
          <UiButton
            data-testid="hash-submit"
            type="submit"
            variant="primary"
            :loading="isHashing"
          >해시 생성</UiButton>
        </form>

        <div
          v-if="hashResult"
          class="mt-3 border-t border-hairline pt-3"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-700 text-ink">결과</p>
            <UiButton
              size="sm"
              @click="onCopyHash"
            >복사</UiButton>
          </div>
          <textarea
            data-testid="hash-result"
            :value="hashResult.hash"
            readonly
            rows="3"
            :class="cn([
              inputCssVariants({}),
              'mt-2 resize-y font-mono',
            ])"
          />
          <p
            v-if="hashSummary"
            class="mt-1 text-xs text-ink-muted"
          >{{ hashSummary }}</p>
        </div>
      </div>
    </UiPanel>

    <UiPanel
      class="flex min-h-0 flex-col overflow-hidden"
      background="surface"
    >
      <div>
        <h2 class="font-700 text-ink">Compare</h2>
        <p class="mt-1 text-sm text-ink-muted">원문 문자열과 해시의 일치 여부를 확인합니다.</p>
      </div>

      <div
        data-testid="compare-panel-content"
        class="min-h-0 flex-1 overflow-y-auto pr-1"
      >
        <form
          data-testid="compare-form"
          class="mt-3 grid gap-3"
          @submit.prevent="onSubmitCompare"
        >
          <UiTextarea
            v-model="compareValue"
            data-testid="compare-value"
            label="원문 문자열"
            :rows="2"
          />
          <UiTextarea
            v-model="compareHash"
            data-testid="compare-hash"
            label="비교할 해시"
            :rows="3"
          />
          <label class="flex flex-col gap-1 text-sm font-600 text-ink">
            <span>고정 해시 방식</span>
            <select
              v-model="compareAlgorithm"
              :class="cn([
                inputCssVariants({}),
              ])"
            >
              <option
                v-for="option in fixedHashOptions"
                :key="option.value"
                :value="option.value"
              >{{ option.label }}</option>
            </select>
            <span class="text-xs font-400 text-ink-muted">bcrypt와 argon2id는 해시 문자열 형식으로 자동 감지합니다.</span>
          </label>
          <p
            v-if="compareError"
            class="text-sm text-danger"
          >{{ compareError }}</p>
          <UiButton
            data-testid="compare-submit"
            type="submit"
            variant="primary"
            :loading="isComparing"
          >비교하기</UiButton>
        </form>

        <p
          v-if="compareResult"
          data-testid="compare-result"
          :class="cn([
            'mt-3 rounded-2 px-3 py-2 text-sm font-700',
            compareResult.matched
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger',
          ])"
        >{{ compareResult.matched ? '일치' : '불일치' }}</p>
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
