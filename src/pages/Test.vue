<script setup lang="ts">
import { ref, computed } from "vue";
import { parseStreamkey } from "../lib";
const bla = ref("bla1,bla2");
const stream = computed(() => parseStreamkey(bla.value));
</script>

<template>
  <div>
    <input v-model="bla" />
    <div>{{ stream }}</div>
  </div>
</template>
