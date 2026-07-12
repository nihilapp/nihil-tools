<script setup lang="ts">
import ImageWebpConverter from '~/components/imageWebpConverter/ImageWebpConverter.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '이미지 WebP 변환',
  url: '/apps/image-webp-converter',
});
</script>

<template>
  <ImageWebpConverter />
</template>
