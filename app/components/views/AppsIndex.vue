<script setup lang="ts">
import { Icon } from '@iconify/vue';

import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { appListData } from '~/data/app-list.data';
import { buildAppNavigation } from '~/utils/app-shell';

const appItems = buildAppNavigation(appListData);
</script>

<template>
  <UiPanelDivider
    direction="column"
    gap="sm"
    class="h-full min-h-0 flex-1 overflow-hidden">
    <UiPanel
      :width="0"
      background="surface">
      <h1 class="text-h4 font-700 text-black-900">
        앱 목록
      </h1>
      <p class="mt-2 text-sm text-black-600">
        총 {{ appItems.length }}개의 앱이 등록되어 있습니다.
      </p>
    </UiPanel>

    <UiPanel
      class="min-h-0 overflow-hidden"
      background="surface">
      <div class="h-full overflow-y-auto">
        <div class="grid gap-2 md:grid-cols-2">
          <NuxtLink
            v-for="app in appItems"
            :key="app.id"
            :to="app.detailPath"
            class="group rounded-2 border border-hairline bg-surface p-2 transition-colors hover:border-primary"
          >
            <div class="flex items-start gap-2">
              <div class="flex size-10 items-center justify-center rounded-2 bg-primary/10 text-primary">
                <Icon
                  :icon="app.icon"
                  class="size-6"
                />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h2 class="truncate text-md font-700 text-black-900 group-hover:text-primary">
                    {{ app.name }}
                  </h2>
                  <span class="rounded-2 border border-hairline p-2 text-xs text-ink-muted">
                    열기
                  </span>
                </div>
                <p class="mt-2 text-sm text-black-600">
                  {{ app.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
