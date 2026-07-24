<script setup lang="ts">
defineProps<{
  aside?: boolean
}>();
</script>

<template>
  <main class="mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-stretch gap-2 overflow-hidden p-2">
    <aside v-if="aside" />
    <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <slot />
    </div>
  </main>
</template>

<style scoped>

</style>
