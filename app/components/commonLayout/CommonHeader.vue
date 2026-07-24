<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { cva } from 'class-variance-authority';

import { appConfig } from '~/config/app.config';
import { appListData } from '~/data/app-list.data';
import { buildAppNavigation, findAppByPath, resolvePageMeta } from '~/utils/app-shell';
import { cn } from '~/utils/cn';

const props = defineProps<{ class?: string }>();

const route = useRoute();
const appItems = buildAppNavigation(appListData);
const activeApp = computed(() => findAppByPath(route.path, appItems));
const pageMeta = computed(() => resolvePageMeta(route.path, appItems.length, activeApp.value?.name));

const cssVariants = cva(
  [
    'sticky top-0 z-10 shrink-0 border-b border-black-200 bg-black-100/90 backdrop-blur-sm',
  ],
  {
    variants: {},
    compoundVariants: [
    ],
    defaultVariants: {},
  },
);
</script>

<template>
  <header
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 p-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-2 border border-black-200 bg-white p-2 text-black-900 transition-colors hover:border-blue-500 hover:text-blue-500"
      >
        <span class="flex size-8 items-center justify-center rounded-2 bg-blue-500 text-white">
          <img
            src="/images/nihilncunia-logo.svg"
            alt=""
            class="size-5 brightness-0 invert">
        </span>
        <span class="text-sm font-700">{{ appConfig.site.title }}</span>
      </NuxtLink>

      <div class="min-w-0 flex-1 px-2 text-center">
        <p class="truncate text-md font-700 text-black-900">
          {{ pageMeta.title }}
        </p>
      </div>

      <NuxtLink
        to="/apps"
        class="flex items-center gap-2 rounded-2 border border-black-200 bg-white p-2 text-sm font-600 text-black-700 transition-colors hover:border-blue-500 hover:text-blue-500"
      >
        <Icon
          icon="solar:widget-4-bold"
          class="size-5" />
        <span class="hidden md:inline">앱 목록</span>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>

</style>
