<script setup lang="ts">
import RandomKeywordGenerator from '~/components/randomKeywordGenerator/RandomKeywordGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '랜덤 키워드 생성기',
  url: '/apps/random-keyword-generator',
});
</script>

<template>
  <RandomKeywordGenerator />
</template>
