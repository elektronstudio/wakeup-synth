<script setup>
import { useAdmin, superuser, toBeUpdated, updated } from "../lib";
const { sendUpdate, beforeUpdate, runUpdate, runPostUpdate } = useAdmin();
</script>

<template>
  <button-medium
    style="--fg: red"
    v-if="superuser && !toBeUpdated && !updated"
    @click="sendUpdate"
  >
    Superuser: Send update
  </button-medium>
  <button-medium v-if="toBeUpdated" @click="runUpdate" style="--fg: orange"
    >The site is has new version. Click to run the update</button-medium
  >
  <button-medium v-if="updated" @click="runPostUpdate" style="--fg: orange">
    🌼 Update was successful, click to close
  </button-medium>
</template>
