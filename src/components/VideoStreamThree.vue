<script setup>
import { defineProps, ref } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useVideoStream } from "../lib";

const props = defineProps({ src: String });
const { videoRef, status, width, height } = useVideoStream(props.src);

const playerRef = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(playerRef);

const muted = ref(true);
</script>

<template>
  <div ref="playerRef" style="position: relative">
    <video
      ref="videoRef"
      autoplay
      loop
      :muted="muted"
      style="
        opacity: 0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -100000;
        pointer-events: none;
      "
      crossorigin="anonymous"
      playsinline
    />
    <div class="video-stream-three">
      <Three>
        <ThreeVideoStream :video="videoRef" />
        <!-- <Threedots /> -->
      </Three>
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
            >Turn on sound&ensp;</small
          >
          <icon-mute v-if="!muted" @click="muted = !muted" />
          <icon-unmute v-if="muted" @click="muted = !muted" />
          &emsp;
          <icon-fullscreen v-if="!isFullscreen" @click="enter" />
          <icon-unfullscreen v-if="isFullscreen" @click="exit" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
.video-stream-three {
  position: relative;
  aspect-ratio: 16 / 9;
}
.video-stream-three canvas {
  width: 100% !important;
  height: 100% !important;
}
.video-stream-three .mute {
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: white;
}
</style>
