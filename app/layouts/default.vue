<script setup lang="ts">

import CommonContent from '~/components/commonLayout/CommonContent.vue';
import CommonFooter from '~/components/commonLayout/CommonFooter.vue';
import CommonHeader from '~/components/commonLayout/CommonHeader.vue';
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-black-100 text-black-900">
    <CommonHeader />
    <CommonContent>
      <slot />
    </CommonContent>
    <CommonFooter />
  </div>
</template>

<style scoped>

</style>
