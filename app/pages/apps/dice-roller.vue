<script setup lang="ts">
import DiceRoller from '~/components/diceRoller/DiceRoller.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '주사위 굴리기',
  url: '/apps/dice-roller',
});
</script>

<template>
  <DiceRoller />
</template>
