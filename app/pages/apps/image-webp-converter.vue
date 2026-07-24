<script setup lang="ts">
import ImageWebpConverter from '~/components/imageWebpConverter/ImageWebpConverter.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '이미지 WebP 변환',
  url: '/apps/image-webp-converter',
  description: 'PNG와 JPG 이미지를 브라우저에서 WebP 형식으로 일괄 변환합니다.',
  keywords: 'WebP 변환, 이미지 변환, PNG 변환, JPG 변환',
});
</script>

<template>
  <ImageWebpConverter />
</template>
