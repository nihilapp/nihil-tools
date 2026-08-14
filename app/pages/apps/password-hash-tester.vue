<script setup lang="ts">
import PasswordHashTester from '~/components/passwordHashTester/PasswordHashTester.vue';
import { useSetMeta } from '~/composables/useSetMeta';

useSetMeta({
  title: '비밀번호 해시 테스트',
  url: '/apps/password-hash-tester',
  description: '문자열을 여러 해시 방식으로 변환하고 기존 해시와 비교합니다.',
  keywords: '비밀번호 해시, bcrypt, argon2id, SHA-256, 해시 비교',
});
</script>

<template>
  <PasswordHashTester />
</template>
