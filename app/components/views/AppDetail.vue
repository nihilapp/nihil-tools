<script setup lang="ts">
import { Icon } from '@iconify/vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { appListData } from '~/data/app-list.data';
import { buildAppNavigation, findAppById } from '~/utils/app-shell';
import { generatePlaceNames, type PlaceNameGenerationCount } from '~/utils/place-name-generator';

const route = useRoute();
const appItems = buildAppNavigation(appListData);
const app = computed(() => findAppById(String(route.params.id ?? ''), appItems));
const generationCount = ref<PlaceNameGenerationCount>(5);
const generatedNames = ref<string[]>([
]);
const generationCountOptions: PlaceNameGenerationCount[] = [
  1,
  5,
  10,
];
const isPlaceNameGenerator = computed(() => app.value?.id === 'place-name-generator');

function onGenerate() {
  generatedNames.value = [
    generatePlaceNames(generationCount.value),
    ...generatedNames.value,
  ].flat();
}

function onResetPlaceNames() {
  generatedNames.value = [
  ];
}
</script>

<template>
  <UiPanelDivider
    v-if="app"
    class="flex h-full min-h-0 flex-col overflow-hidden"
    direction="column"
    gap="sm"
  >
    <template v-if="isPlaceNameGenerator">
      <UiPanel
        :width="0"
        background="surface">
        <p class="text-sm text-ink-muted">
          필요한 수만큼 장소 이름을 생성합니다.
        </p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <UiButton
            v-for="countOption in generationCountOptions"
            :key="countOption"
            :variant="generationCount === countOption ? 'primary' : 'secondary'"
            @click="generationCount = countOption"
          >
            {{ countOption }}개
          </UiButton>
          <UiButton
            variant="secondary"
            @click="onResetPlaceNames"
          >
            초기화
          </UiButton>
          <UiButton
            variant="primary"
            @click="onGenerate"
          >
            생성하기
          </UiButton>
        </div>
      </UiPanel>

      <UiPanel
        class="min-h-0 overflow-hidden"
        background="surface">
        <div
          v-if="generatedNames.length > 0"
          class="h-full overflow-y-auto"
        >
          <ul class="flex flex-col gap-2">
            <li
              v-for="(name, nameIndex) in generatedNames"
              :key="`${nameIndex}-${name}`"
              class="rounded-2 border border-hairline bg-surface p-2 text-sm font-700 text-ink"
            >
              {{ name }}
            </li>
          </ul>
        </div>

        <div
          v-else
          class="flex h-full items-center justify-center text-sm text-ink-muted"
        >
          생성하기를 누르면 이름이 여기에 표시됩니다.
        </div>
      </UiPanel>
    </template>

    <UiPanel
      v-else
      background="surface"
      :width="0">
      <div class="flex items-start gap-2">
        <div class="flex size-12 items-center justify-center rounded-2 bg-primary/10 text-primary">
          <Icon
            :icon="app.icon"
            class="size-7"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm text-ink-muted">
            {{ app.description }}
          </p>
        </div>
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
