<script setup>
import { config } from "../lib";
</script>

<template>
  <div class="strapi-social">
    <a v-if="config.youtubeUrl" :href="config.youtubeUrl" target="_blank">
      <icon-youtube />
    </a>
    <a v-if="config.instagramUrl" :href="config.instagramUrl" target="_blank">
      <icon-instagram />
    </a>
    <a v-if="config.emailUrl" :href="config.emailUrl" target="_blank">
      <icon-email />
    </a>
    <a v-if="config.twitterUrl" :href="config.twitterUrl" target="_blank">
      <icon-twitter />
    </a>
    <a v-if="config.facebookUrl" :href="config.facebookUrl" target="_blank">
      <icon-facebook />
    </a>
  </div>
</template>

<style scoped>
.strapi-social {
  display: flex;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  gap: var(--gap-1);
  flex-wrap: wrap;
}
@media (max-width: 800px) {
  .strapi-social {
    grid-auto-rows: auto;
  }
}
.strapi-social > a {
  display: grid;
  color: var(--fg);
  width: var(--w-5);
  height: var(--h-5);
  border-radius: 10000px;
}
.strapi-social > a > svg {
  transform: scale(0.7);
}
</style>
