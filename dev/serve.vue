<script lang="ts">
import { defineComponent } from 'vue';
import Vue3ImageSlim from '@/vue3-image-slim.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3ImageSlim
  }
});
</script>

<template>
  <div id="app">
    <vue3-image-slim />
  </div>
</template>
