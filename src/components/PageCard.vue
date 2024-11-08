<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  page: { type: Object },
});

const pageRoute = computed(() => `/page/${props.page.slug}`);
</script>

<template>
  <router-link :to="pageRoute">
    <vertical>
      <h2 v-html="page.title" />
    </vertical>
  </router-link>
</template>
