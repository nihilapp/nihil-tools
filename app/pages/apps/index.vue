<script setup lang="ts">
import { Icon } from '@iconify/vue';

import { appListData } from '~/data/app-list.data';
import { useSetMeta } from '~/composables/useSetMeta';
import { buildAppNavigation } from '~/utils/app-shell';

const appItems = buildAppNavigation(appListData);

useSetMeta({
  title: '앱 목록',
  url: '/apps',
});
</script>

<template>
  <section class="space-y-2">
    <div class="rounded-2 border border-black-200 bg-white p-2">
      <h1 class="text-h4 font-700 text-black-900">
        앱 목록
      </h1>
      <p class="mt-2 text-sm text-black-600">
        총 {{ appItems.length }}개의 앱이 등록되어 있습니다.
      </p>
    </div>

    <div class="grid gap-2 md:grid-cols-2">
      <NuxtLink
        v-for="app in appItems"
        :key="app.id"
        :to="app.detailPath"
        class="group rounded-2 border border-black-200 bg-white p-2 transition-colors hover:border-blue-500"
      >
        <div class="flex items-start gap-2">
          <div class="flex size-10 items-center justify-center rounded-2 bg-blue-50 text-blue-500">
            <Icon
              :icon="app.icon"
              class="size-6" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <h2 class="truncate text-md font-700 text-black-900 group-hover:text-blue-500">
                {{ app.name }}
              </h2>
              <span class="rounded-2 border border-black-200 p-2 text-xs text-black-500">
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
  </section>
</template>

<style scoped>

</style>
