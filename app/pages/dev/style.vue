<script setup lang="ts">
import DevStyleCatalog from '~/components/views/DevStyleCatalog.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '개발용 스타일 카탈로그',
  url: '/dev/style',
  description: '니힐의 도구상자 UI 구성요소와 스타일을 확인하는 개발용 카탈로그입니다.',
  keywords: 'UI 카탈로그, 개발 도구',
  robots: 'noindex, nofollow',
});
</script>

<template>
  <DevStyleCatalog />
</template>
