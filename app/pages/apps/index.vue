<script setup lang="ts">
import AppsIndex from '~/components/views/AppsIndex.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '앱 목록',
  url: '/apps',
  description: 'TRPG 진행과 창작에 활용할 수 있는 니힐의 도구상자 앱을 한눈에 살펴봅니다.',
  keywords: '앱 목록, TRPG 유틸리티, 창작 도구',
});
</script>

<template>
  <AppsIndex />
</template>

<style scoped>

</style>
