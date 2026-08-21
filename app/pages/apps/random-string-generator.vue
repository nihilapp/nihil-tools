<script setup lang="ts">
import RandomStringGenerator from '~/components/randomStringGenerator/RandomStringGenerator.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '랜덤 문자열 생성기',
  url: '/apps/random-string-generator',
  description: '길이와 문자 범위를 지정해 랜덤 문자열을 생성합니다.',
  keywords: '랜덤 문자열, 문자열 생성기, 비밀번호 문자열, 난수',
});
</script>

<template>
  <RandomStringGenerator />
</template>
