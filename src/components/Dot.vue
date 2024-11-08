<script setup>
import { defineProps } from "vue";

defineProps({ color: { type: String, default: "black" } });
</script>

<template>
  <svg width="28" height="28">
    <circle cx="14" cy="13" r="13" :fill="color" />
  </svg>
</template>
