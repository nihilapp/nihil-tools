<script setup lang="ts">
import DiceRoller from '~/components/diceRoller/DiceRoller.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '주사위 굴리기',
  url: '/apps/dice-roller',
  description: 'D20을 비롯한 TRPG 주사위를 굴리고 식 입력 결과를 바로 확인합니다.',
  keywords: 'D20, 주사위 굴리기, TRPG 주사위',
});
</script>

<template>
  <DiceRoller />
</template>
