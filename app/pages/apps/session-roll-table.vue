<script setup lang="ts">
import SessionRollTable from '~/components/sessionRollTable/SessionRollTable.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '세션 롤 테이블',
  url: '/apps/session-roll-table',
});
</script>

<template>
  <SessionRollTable />
</template>
