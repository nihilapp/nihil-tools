<script setup lang="ts">
import MonsterRollTable from '~/components/monsterRollTable/MonsterRollTable.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '몬스터 롤 테이블',
  url: '/apps/monster-roll-table',
});
</script>

<template>
  <MonsterRollTable />
</template>
