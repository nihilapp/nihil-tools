<script setup lang="ts">
import AppDetail from '~/components/views/AppDetail.vue';
import { useSetMeta } from '~/composables/useSetMeta';
import { appListData } from '~/data/app-list.data';
import { buildAppNavigation, findAppById } from '~/utils/app-shell';

const route = useRoute();
const appItems = buildAppNavigation(appListData);
const app = computed(() => findAppById(String(route.params.id ?? ''), appItems));

if (!app.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '앱을 찾을 수 없습니다.',
  });
}

useSetMeta({
  title: app.value.name,
  url: `/apps/${app.value.id}`,
  description: app.value.description,
  keywords: '장소 이름 생성기, 판타지 지명',
});
</script>

<template>
  <AppDetail />
</template>

<style scoped>

</style>
