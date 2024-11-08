<script setup lang="ts">
import {
  Player,
  Hls,
  DefaultUi,
  Scrim,
  Controls,
  ControlSpacer,
  MuteControl,
  VolumeControl,
  SettingsControl,
  PipControl,
  FullscreenControl,
} from "@vime/vue-next";
import "@vime/core/themes/default.css";
const src =
  "https://le21.babahhcdn.com/bb1150-le/x_live_1_c1.smil/playlist.m3u8";
//
</script>

<template>
  <Player muted autoplay playsinline>
    <Hls autoPiP>
      <source :data-src="src" type="application/x-mpegURL" />
    </Hls>
    <DefaultUi noControls>
      <Scrim />
      <Controls pin="bottomRight">
        <ControlSpacer />
        <VolumeControl />
        <SettingsControl />
        <PipControl />
        <FullscreenControl />
      </Controls>
    </DefaultUi>
  </Player>
</template>
