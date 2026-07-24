<script setup lang="ts">
import RandomKeywordGenerator from '~/components/randomKeywordGenerator/RandomKeywordGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

const route = useRoute();
const isBackgroundStoryRoute = computed(() => route.path === '/apps/random-keyword-generator/background-story');

useSetMeta({
  title: '랜덤 키워드 생성기',
  url: '/apps/random-keyword-generator',
  description: '카테고리별 랜덤 키워드를 뽑아 캐릭터와 세계관 창작의 발상을 넓힙니다.',
  keywords: '랜덤 키워드, 세계관 창작, 캐릭터 창작',
});
</script>

<template>
  <NuxtPage v-if="isBackgroundStoryRoute" />
  <RandomKeywordGenerator v-else />
</template>
