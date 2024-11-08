<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() =>
  props.festival?.slug ? `/${props.festival.slug}` : ""
);

const bgImageStyle = computed(() => {
  if (props.festival.slug === "experiment") {
    const i = props.festival.images;
    console.log(i[0].url);
  }
  const image =
    props.festival?.images?.[0]?.formats?.small?.url ??
    props.festival?.images?.[0]?.url ??
    "";
  return props.festival?.images[0]
    ? {
        backgroundImage: `url(${image})`,
      }
    : null;
});
</script>

<template>
  <router-link
    :to="festivalRoute"
    class="strapi-festival"
    style="background-size: cover; width: 100%; border-radius2"
    :style="bgImageStyle"
  >
    <h2 :style="{ opacity: bgImageStyle ? 0 : 1 }" v-html="festival?.title" />
  </router-link>
</template>

<style scoped>
.strapi-festival {
  display: grid;
  background: var(--bglight);
  min-width: 280px;
  max-width: 280px;
  height: 280px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: var(--rounded-lg);
  padding: 16px;
}
@media (max-width: 800px) {
  .strapi-festival {
    width: 100% !important;
    height: auto;
    min-width: 100%;
    max-width: 100%;
    aspect-ratio: 1;
  }
}
.strapi-festival > * {
  width: 100%;
}
</style>
