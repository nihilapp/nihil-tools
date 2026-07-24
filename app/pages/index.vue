<script setup lang="ts">
import { useSetMeta } from '~/composables/useSetMeta';
import { resolveDefaultEntryPath } from '~/utils/app-shell';

useSetMeta({
  title: '니힐의 도구상자',
  url: '/',
  description: 'TRPG 진행과 창작을 돕는 주사위, 롤 테이블, 랜덤 생성 도구를 모은 니힐의 도구상자입니다.',
  keywords: 'TRPG 도구, 창작 도구, 테이블탑 RPG',
});

await navigateTo(resolveDefaultEntryPath(), {
  redirectCode: 302,
  replace: true,
});
</script>

<template>
  <div />
</template>

<style scoped>

</style>
