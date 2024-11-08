<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  episode: { type: Object },
});
</script>

<template>
  <vertical>
    <h2 v-html="episode.title" />
    <p v-html="episode['content:encoded']" />
    <audio controls :src="episode?.enclosure.url" />
  </vertical>
</template>
