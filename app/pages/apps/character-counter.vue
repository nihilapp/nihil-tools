<script setup lang="ts">
import CharacterCounter from '~/components/characterCounter/CharacterCounter.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '글자 수 체크',
  url: '/apps/character-counter',
  description: '공백 포함·미포함 글자 수를 실시간으로 확인합니다.',
  keywords: '글자 수, 글자 수 체크, 문자 수, 공백 포함, 공백 미포함',
});
</script>

<template>
  <CharacterCounter />
</template>
