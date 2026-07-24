<script setup lang="ts">
import SessionRollTable from '~/components/sessionRollTable/SessionRollTable.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '세션 롤 테이블',
  url: '/apps/session-roll-table',
  description: '세션의 주제와 상황, 의뢰 소재를 무작위로 생성해 TRPG 준비를 돕습니다.',
  keywords: '세션 생성, 게임 마스터, TRPG 롤 테이블',
});
</script>

<template>
  <SessionRollTable />
</template>
