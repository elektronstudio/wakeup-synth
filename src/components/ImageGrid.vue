<script setup>
import { defineProps, useSlots, ref, computed, watch } from "vue";

const props = defineProps({
  ratio: {
    default: 1,
  },
});

const slots = useSlots();

const count = ref(1);

watch(
  () => slots.default(),
  (slots) => {
    count.value = slots[0].children ? slots[0].children.length : 0;
  },
  { immediate: true }
);
// https://stackoverflow.com/a/51956837
const columns = computed(() => {
  const a = Math.min(
    count.value + 1,
    Math.round(Math.sqrt(props.ratio * count.value + 1))
  );
  return Math.max(2, a);
});
</script>

<template>
  <div
    style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: max-content;
      gap: 0px;
    "
    :style="{
      gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
    }"
  >
    <slot />
  </div>
</template>
