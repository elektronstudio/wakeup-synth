<script setup>
import { defineProps, computed } from "vue";
import { ETitle } from "elektro";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
  image: { type: Boolean, default: false },
});

const eventRoute = computed(
  () => `/${props.festival.slug}/${props.event.slug}`
);

const imageUrl = computed(() => {
  return props.image && props.event?.images.length
    ? props.event.images[0].formats.small.url
    : "";
});
</script>

<template>
  <vertical
    style="gap: 4px"
    :style="{ opacity: event?.urgency === 'past' ? 1 : 1 }"
  >
    <router-link v-if="imageUrl" :to="eventRoute">
      <img
        :src="imageUrl"
        style="border-radius: 2px; object-fit: cover; aspect-ratio: 3/2"
      />
    </router-link>
    <div style="height: 8px" />
    <router-link :to="eventRoute">
      <badge v-if="event.urgency === 'now'">live</badge>
      <ETitle v-html="event.title" />
    </router-link>
    <event-data :festival="festival" :event="event" />
  </vertical>
</template>
