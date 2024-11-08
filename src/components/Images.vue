<script setup>
import { ref, computed, defineProps } from "vue";
import { useImages, users, plausible } from "../lib";

const props = defineProps({ channel: String });

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      return user;
    })
    .sort((a, b) => a.userId.localeCompare(b.userId))
);

const { onStart, onStop, videoRef, canvasRef, sendImageMessages } = useImages(
  props.channel
);

const emptyImage =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//Z";

const usersWithImages = computed(() =>
  updatedUsers.value.filter(
    (user) => user.value.image && user.value.image !== emptyImage
  )
);

const started = ref(false);
</script>

<template>
  <vertical>
    Please allow access to your camera to be a public audience member in our
    venue.
    <button-medium
      v-show="!started"
      @click="
        () => {
          onStart();
          started = !started;
          plausible.trackEvent('user_image');
        }
      "
      >Start my camera</button-medium
    >
    <button-medium
      v-show="started"
      @click="
        () => {
          onStop();
          started = !started;
        }
      "
      >Stop my camera</button-medium
    >
    <p />
    <ImageGrid v-if="started" class="grid-gap: 2px;">
      <img
        v-for="(user, i) in usersWithImages"
        :src="user.value.image"
        :key="i"
        style="display: block; width: 100%; height: auto"
      />
    </ImageGrid>
    <div>
      <video
        ref="videoRef"
        autoplay
        playsinline
        style="
          opacity: 0;
          pointer-events: none;
          width: 0px;
          height: 0px;
          line-height: 0;
        "
      />
      <canvas ref="canvasRef" style="display: none" />
    </div>
  </vertical>
</template>
