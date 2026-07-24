<script setup lang="ts">
import MonsterRollTable from '~/components/monsterRollTable/MonsterRollTable.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '몬스터 롤 테이블',
  url: '/apps/monster-roll-table',
  description: '유형과 난이도를 조합해 세션에 사용할 몬스터 발상과 전투 소재를 생성합니다.',
  keywords: '몬스터 생성, CR, TRPG 몬스터',
});
</script>

<template>
  <MonsterRollTable />
</template>
