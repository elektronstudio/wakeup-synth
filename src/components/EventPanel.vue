<script setup>
import { defineProps } from "vue";
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
});
</script>

<template>
  <div class="event-panel">
    <div class="header">
      <h3 name="title">{{ title }}</h3>
      <small style="opacity: 0.8" name="subtitle">{{ subtitle }}</small>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.event-panel {
  padding: 64px 32px 32px 32px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}
.event-panel .header {
  display: flex;
  justify-content: space-between;
}
</style>
