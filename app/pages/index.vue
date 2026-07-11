<script setup lang="ts">
import { resolveDefaultEntryPath } from '../utils/app-shell';

await navigateTo(resolveDefaultEntryPath(), {
  redirectCode: 302,
  replace: true,
});
</script>

<template>
  <div />
</template>

<style scoped>

</style>
