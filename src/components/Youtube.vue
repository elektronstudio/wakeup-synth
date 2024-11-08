<script setup>
import { defineProps } from "vue";
import "@justinribeiro/lite-youtube";

import { replaceYoutube } from "../lib";

defineProps({
  src: { type: String },
});
</script>
<template>
  <div v-html="replaceYoutube(src)" />
</template>
