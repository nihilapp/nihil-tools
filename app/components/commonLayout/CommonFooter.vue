<script setup lang="ts">
const startYear = 2026;
const nowYear = new Date().getFullYear();

const year = startYear < nowYear
  ? `${startYear}-${nowYear}`
  : startYear;
</script>

<template>
  <footer class="shrink-0 border-t border-black-200 bg-black-100">
    <div class="mx-auto w-full max-w-6xl p-2 text-sm text-black-700">
      <small class="inline-flex rounded-2 border border-black-200 bg-white p-2">
        NIHILncunia © {{ year }}
      </small>
    </div>
  </footer>
</template>

<style scoped>

</style>
