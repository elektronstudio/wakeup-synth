<script setup>
import { defineProps } from "vue";
defineProps({
  muted: { type: Boolean },
  isFullscreen: { type: Boolean },
  enter: { type: Function },
  exit: { type: Function },
});
</script>

<template>
  <transition name="fade">
    <div
      style="
        position: absolute;
        right: clamp(5px, 2vw, 24px);
        bottom: clamp(5px, 2vw, 24px);
        color: white;
        display: flex;
        align-items: center;
      "
    >
      <small v-if="muted" @click="muted = !muted" style="cursor: pointer"
        >Unmute&ensp;</small
      >
      <icon-mute v-if="!muted" @click="muted = !muted" />
      <icon-unmute v-if="muted" @click="muted = !muted" />
      &emsp;
      <icon-fullscreen v-if="!isFullscreen" @click="enter" />
      <icon-unfullscreen v-if="isFullscreen" @click="exit" />
    </div>
  </transition>
</template>
