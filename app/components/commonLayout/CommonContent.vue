<script setup lang="ts">
defineProps<{
  aside?: boolean
}>();
</script>

<template>
  <div class="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-6xl flex-1 items-start gap-2 p-2">
    <aside v-if="aside" />
    <main class="flex min-w-0 flex-1 flex-col gap-2">
      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>
