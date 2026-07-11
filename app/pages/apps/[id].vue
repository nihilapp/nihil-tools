<script setup lang="ts">
import { Icon } from '@iconify/vue';

import { appListData } from '../../data/app-list.data';
import { buildAppNavigation, findAppById } from '../../utils/app-shell';
import { generatePlaceNames, type PlaceNameGenerationCount } from '../../utils/place-name-generator';

type GeneratedBatch = Array<string>;

const route = useRoute();
const appItems = buildAppNavigation(appListData);
const app = computed(() => findAppById(String(route.params.id ?? ''), appItems));
const generationCount = ref<PlaceNameGenerationCount>(5);
const generatedBatches = ref<Array<GeneratedBatch>>(new Array<GeneratedBatch>());
const generationCountOptions: PlaceNameGenerationCount[] = [
  1,
  5,
  10,
];
const isPlaceNameGenerator = computed(() => app.value?.id === 'place-name-generator');

if (!app.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '앱을 찾을 수 없습니다.',
  });
}

function handleGenerate() {
  const nextBatch = generatePlaceNames(generationCount.value);

  generatedBatches.value = [
    nextBatch,
    ...generatedBatches.value,
  ];
}
</script>

<template>
  <section
    v-if="app"
    class="flex h-full min-h-0 flex-col gap-2"
  >
    <template v-if="isPlaceNameGenerator">
      <article class="rounded-2 border border-black-200 bg-white p-2">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="countOption in generationCountOptions"
            :key="countOption"
            type="button"
            :class="[
              'rounded-2 border p-2 text-sm font-700 transition-colors',
              generationCount === countOption
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-black-200 bg-white text-black-700 hover:border-blue-500 hover:text-blue-500',
            ]"
            @click="generationCount = countOption"
          >
            {{ countOption }}개
          </button>

          <button
            type="button"
            class="rounded-2 bg-blue-500 p-2 text-sm font-700 text-white"
            @click="handleGenerate"
          >
            생성하기
          </button>
        </div>
      </article>

      <article class="min-h-0 flex-1 overflow-hidden rounded-2 border border-black-200 bg-white p-2">
        <div
          v-if="generatedBatches.length > 0"
          class="h-full overflow-y-auto"
        >
          <div class="flex flex-col gap-2">
            <div
              v-for="(batch, batchIndex) in generatedBatches"
              :key="`${batchIndex}-${batch.join('-')}`"
              :class="[
                'rounded-2 border bg-black-50 p-2',
                batchIndex === 0
                  ? 'border-blue-500'
                  : 'border-black-200',
              ]"
            >
              <ul class="flex flex-col gap-2">
                <li
                  v-for="name in batch"
                  :key="name"
                  class="rounded-2 border border-black-200 bg-white p-2 text-sm font-700 text-black-900"
                >
                  {{ name }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex h-full items-center justify-center rounded-2 border border-dashed border-black-200 bg-black-50 p-2 text-sm text-black-500"
        >
          생성하기를 누르면 이름이 여기에 표시됩니다.
        </div>
      </article>
    </template>

    <article
      v-else
      class="rounded-2 border border-black-200 bg-white p-2"
    >
      <div class="flex items-start gap-2">
        <div class="flex size-12 items-center justify-center rounded-2 bg-blue-50 text-blue-500">
          <Icon :icon="app.icon" class="size-7" />
        </div>

        <div class="min-w-0 flex-1">
          <h1 class="text-h4 font-700 text-black-900">
            {{ app.name }}
          </h1>
          <p class="mt-2 text-sm text-black-600">
            {{ app.description }}
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>

</style>
