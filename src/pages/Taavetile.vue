<script setup>
import { strapiPrivateEvent } from "../lib";

const src =
  "https://elektron-live.babahhcdn.com/bb1150-le/x_live_1_c1.smil/playlist.m3u8";

const streamkey = "x_live_1_c1";
const slug = "taavetile";

const event = strapiPrivateEvent(slug);
</script>

<template>
  <horizontal
    :style="{
      '--cols': event && event.chat === false ? '1fr 0' : '3.5fr 350px',
      gap: 0,
    }"
  >
    <div style="padding: 48px">
      <!-- <VideoStreamVine :src="src" :streamkey="streamkey" /> -->
      <VideoStream :src="src" :streamkey="streamkey" />
      <vertical>
        <div style="height: 32px" />
        <h1
          :style="{
            fontSize: '60px',
            lineHeight: '1.2em',
            paddingRight: event && event.chat === false ? '10vw' : '',
          }"
          v-html="event?.title"
        />
        <controls
          v-if="event.controls"
          :channel="slug"
          :controls="event.controls"
        />
        <vertical v-html="event?.description_estonian" />
        <h3 v-if="event?.description_estonian && event?.description_english">
          In English
        </h3>
        <vertical v-html="event?.description_english" />
      </vertical>
    </div>
    <div>
      <event-panel
        v-if="event.chat"
        title="Chat"
        style="background: var(--bglighter); position: sticky; top: 0"
      >
        <chat :channel="slug" />
      </event-panel>
    </div>
    <!-- <users /> -->
    <layout>
      <template #top-left>
        <back-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <!-- <users-button /> -->
      </template>
    </layout>
  </horizontal>
</template>
