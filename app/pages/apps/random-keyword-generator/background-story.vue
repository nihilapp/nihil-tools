<script setup lang="ts">
import CharacterBackgroundStoryGenerator from '~/components/characterBackgroundStoryGenerator/CharacterBackgroundStoryGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '캐릭터 배경 스토리',
  url: '/apps/random-keyword-generator/background-story',
});
</script>

<template>
  <CharacterBackgroundStoryGenerator />
</template>
