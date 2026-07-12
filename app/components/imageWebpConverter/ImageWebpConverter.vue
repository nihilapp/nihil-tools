<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { cva } from 'class-variance-authority';
import { computed, onBeforeUnmount, ref } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import { defaultImageWebpQuality } from '~/data/image-webp-converter.data';
import type { ImageWebpConversionItem } from '~/data/image-webp-converter.types';
import {
  convertImageFileToWebp,
  formatFileSize,
  getSavedPercent,
  getWebpOutputName,
  isConvertibleImageFile,
} from '~/utils/image-webp-converter';
import { cn } from '~/utils/cn';

const cssVariants = cva([
  'flex h-full min-h-0 flex-col gap-3 overflow-y-auto',
], {
  variants: {},
  compoundVariants: [
  ],
  defaultVariants: {},
});

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const items = ref<ImageWebpConversionItem[]>([
]);
const quality = ref(defaultImageWebpQuality);

const completedItems = computed(() => items.value.filter((item) => item.status === 'done'));
const convertibleCount = computed(() => items.value.filter((item) => item.status === 'pending' || item.status === 'error').length);
const hasItems = computed(() => items.value.length > 0);
const isConverting = computed(() => items.value.some((item) => item.status === 'converting'));
const totalOutputSize = computed(() => completedItems.value.reduce((sum, item) => sum + (item.outputBlob?.size ?? 0), 0));
const totalSourceSize = computed(() => items.value.reduce((sum, item) => sum + item.sourceFile.size, 0));
const totalSavedPercent = computed(() => getSavedPercent(totalSourceSize.value, totalOutputSize.value));

function createItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function revokeItemUrls(item: ImageWebpConversionItem) {
  URL.revokeObjectURL(item.sourceUrl);

  if (item.outputUrl) {
    URL.revokeObjectURL(item.outputUrl);
  }
}

function onAddFiles(fileList: FileList | File[]) {
  const nextItems = Array.from(fileList)
    .filter(isConvertibleImageFile)
    .map((sourceFile): ImageWebpConversionItem => ({
      errorMessage: null,
      id: createItemId(),
      outputBlob: null,
      outputName: getWebpOutputName(sourceFile.name),
      outputUrl: null,
      sourceFile,
      sourceUrl: URL.createObjectURL(sourceFile),
      status: 'pending',
    }));

  items.value.push(...nextItems);
}

function onChangeFileInput(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    onAddFiles(target.files);
  }

  target.value = '';
}

function onDropFiles(event: DragEvent) {
  isDragging.value = false;

  if (event.dataTransfer?.files) {
    onAddFiles(event.dataTransfer.files);
  }
}

function onOpenFileInput() {
  fileInput.value?.click();
}

function onUpdateQuality(event: Event) {
  quality.value = Number((event.target as HTMLInputElement).value);
}

async function onConvertItem(item: ImageWebpConversionItem) {
  item.status = 'converting';
  item.errorMessage = null;

  try {
    const outputBlob = await convertImageFileToWebp(item.sourceFile, quality.value);

    if (item.outputUrl) {
      URL.revokeObjectURL(item.outputUrl);
    }

    item.outputBlob = outputBlob;
    item.outputUrl = URL.createObjectURL(outputBlob);
    item.status = 'done';
  }
  catch (error) {
    item.status = 'error';
    item.errorMessage = error instanceof Error
      ? error.message
      : '변환 중 오류가 발생했습니다.';
  }
}

async function onConvertAll() {
  const targets = items.value.filter((item) => item.status === 'pending' || item.status === 'error');

  for (const item of targets) {
    await onConvertItem(item);
  }
}

function onDownloadItem(item: ImageWebpConversionItem) {
  if (!item.outputUrl) {
    return;
  }

  const anchor = document.createElement('a');

  anchor.href = item.outputUrl;
  anchor.download = item.outputName;
  anchor.click();
}

function onDownloadAll() {
  completedItems.value.forEach(onDownloadItem);
}

function onRemoveItem(item: ImageWebpConversionItem) {
  revokeItemUrls(item);
  items.value = items.value.filter((currentItem) => currentItem.id !== item.id);
}

function onClearAll() {
  items.value.forEach(revokeItemUrls);
  items.value = [];
}

onBeforeUnmount(() => {
  items.value.forEach(revokeItemUrls);
});
</script>

<template>
  <section
    :class="cn([
      cssVariants({}),
    ])">
    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div
        :class="cn([
          'flex min-h-60 flex-col items-center justify-center rounded-2 border border-dashed p-4 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-hairline bg-canvas-soft hover:border-primary',
        ])"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDropFiles">
        <input
          ref="fileInput"
          data-testid="image-file-input"
          type="file"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          multiple
          class="hidden"
          @change="onChangeFileInput">
        <div class="flex size-12 items-center justify-center rounded-2 bg-primary/10 text-primary">
          <Icon
            icon="material-symbols:image-search"
            class="size-7" />
        </div>
        <h1 class="mt-3 text-lg font-700 text-ink">
          PNG 또는 JPG 파일을 놓으세요
        </h1>
        <p class="mt-1 text-sm text-ink-muted">
          여러 파일을 한 번에 변환하며, 파일은 브라우저 밖으로 전송되지 않습니다.
        </p>
        <UiButton
          class="mt-4"
          variant="primary"
          @click="onOpenFileInput">
          파일 선택
        </UiButton>
      </div>

      <aside class="rounded-2 border border-hairline bg-surface p-3 shadow-surface">
        <div class="flex items-center justify-between">
          <h2 class="font-700 text-ink">
            변환 옵션
          </h2>
          <span class="text-sm font-700 text-primary">
            {{ Math.round(quality * 100) }}%
          </span>
        </div>
        <input
          :value="quality"
          min="0.4"
          max="1"
          step="0.05"
          type="range"
          class="mt-3 w-full accent-primary"
          @input="onUpdateQuality">
        <div class="flex justify-between text-xs text-ink-muted">
          <span>작은 용량</span>
          <span>높은 품질</span>
        </div>
        <dl class="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div class="rounded-2 bg-canvas-soft p-2">
            <dt class="text-ink-muted">파일</dt>
            <dd class="mt-1 font-700 text-ink">{{ items.length }}개</dd>
          </div>
          <div class="rounded-2 bg-canvas-soft p-2">
            <dt class="text-ink-muted">완료</dt>
            <dd class="mt-1 font-700 text-ink">{{ completedItems.length }}개</dd>
          </div>
          <div class="rounded-2 bg-canvas-soft p-2">
            <dt class="text-ink-muted">원본</dt>
            <dd class="mt-1 font-700 text-ink">{{ formatFileSize(totalSourceSize) }}</dd>
          </div>
          <div class="rounded-2 bg-canvas-soft p-2">
            <dt class="text-ink-muted">절감</dt>
            <dd class="mt-1 font-700 text-ink">{{ totalSavedPercent }}%</dd>
          </div>
        </dl>
        <UiButton
          data-testid="convert-all"
          class="mt-4 w-full"
          variant="primary"
          :disabled="!hasItems || convertibleCount === 0 || isConverting"
          @click="onConvertAll">
          {{ isConverting ? '변환 중...' : 'WebP로 변환' }}
        </UiButton>
        <UiButton
          v-if="completedItems.length > 0"
          class="mt-2 w-full"
          @click="onDownloadAll">
          완료 파일 모두 다운로드
        </UiButton>
        <UiButton
          v-if="hasItems"
          class="mt-2 w-full"
          variant="danger"
          @click="onClearAll">
          목록 비우기
        </UiButton>
      </aside>
    </div>

    <section
      v-if="hasItems"
      class="overflow-hidden rounded-2 border border-hairline bg-surface shadow-surface">
      <header class="flex items-center justify-between border-b border-hairline px-3 py-2">
        <h2 class="font-700 text-ink">
          변환 목록
        </h2>
        <span class="text-sm text-ink-muted">
          {{ completedItems.length }} / {{ items.length }}
        </span>
      </header>
      <ul class="divide-y divide-hairline">
        <li
          v-for="item in items"
          :key="item.id"
          data-testid="queue-item"
          class="flex items-center gap-3 p-3">
          <img
            :src="item.sourceUrl"
            :alt="item.sourceFile.name"
            class="size-12 rounded-2 border border-hairline object-contain">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-700 text-ink">
              {{ item.sourceFile.name }}
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ formatFileSize(item.sourceFile.size) }}
              <template v-if="item.outputBlob">
                → {{ formatFileSize(item.outputBlob.size) }} · {{ getSavedPercent(item.sourceFile.size, item.outputBlob.size) }}% 절감
              </template>
            </p>
            <p
              v-if="item.errorMessage"
              class="mt-1 text-xs text-danger">
              {{ item.errorMessage }}
            </p>
          </div>
          <span
            :class="cn([
              'rounded-2 px-2 py-1 text-xs font-700',
              item.status === 'done'
                ? 'bg-success/10 text-success'
                : item.status === 'error'
                  ? 'bg-danger/10 text-danger'
                  : item.status === 'converting'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-canvas-soft text-ink-muted',
            ])">
            {{
              item.status === 'done'
                ? '완료'
                : item.status === 'error'
                  ? '오류'
                  : item.status === 'converting'
                    ? '변환 중'
                    : '대기'
            }}
          </span>
          <button
            v-if="item.outputUrl"
            type="button"
            class="rounded-2 p-2 text-primary hover:bg-primary/10"
            title="다운로드"
            @click="onDownloadItem(item)">
            <Icon
              icon="material-symbols:download"
              class="size-5" />
          </button>
          <button
            type="button"
            class="rounded-2 p-2 text-ink-muted hover:bg-danger/10 hover:text-danger"
            title="삭제"
            @click="onRemoveItem(item)">
            <Icon
              icon="material-symbols:close"
              class="size-5" />
          </button>
        </li>
      </ul>
    </section>
  </section>
</template>
