<script setup lang="ts">
import CharacterBackgroundStoryGenerator from '~/components/characterBackgroundStoryGenerator/CharacterBackgroundStoryGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '캐릭터 배경 스토리 생성기',
  url: '/apps/random-keyword-generator/background-story',
  description: '출신지와 목적, 인물을 조합해 캐릭터의 배경 스토리를 한 문장으로 생성합니다.',
  keywords: '캐릭터 생성, 배경 스토리, TRPG 캐릭터',
});
</script>

<template>
  <CharacterBackgroundStoryGenerator />
</template>
