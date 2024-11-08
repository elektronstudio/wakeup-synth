<script setup>
import { defineProps } from "vue";

defineProps({
  src: {
    default: "",
  },
  muted: {
    default: true,
  },
});
</script>

<template>
  <audio :src="src" :muted="muted" autoplay loop preload />
</template>
