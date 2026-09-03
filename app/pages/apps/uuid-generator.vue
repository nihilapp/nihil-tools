<script setup lang="ts">
import UuidGenerator from '~/components/uuidGenerator/UuidGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: 'UUID 생성기',
  url: '/apps/uuid-generator',
  description: 'UUID 버전과 생성 개수를 지정해 UUID를 생성합니다.',
  keywords: 'UUID, UUID 생성기, UUID v4, UUID v7, 식별자',
});
</script>

<template>
  <UuidGenerator />
</template>
