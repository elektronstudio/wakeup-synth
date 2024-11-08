<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { strapiPrivateEvent, parseStreamkey } from "../lib";

const route = useRoute();

const event = strapiPrivateEvent(route.params.event_slug);
const stream = computed(() => {
  return parseStreamkey(event.value?.streamkey);
});

const activeStream = ref(0);
</script>

<template>
  <horizontal
    :style="{
      '--cols': event && event.chat === false ? '1fr 0' : '3.5fr 350px',
      gap: 0,
    }"
  >
    <div style="padding: 48px">
      <video-stream
        v-for="(src, i) in stream.streamurls"
        v-show="i === activeStream"
        :key="i"
        :src="src"
        :streamkey="stream.streamkeys[i]"
        style="width: 100%"
      />
      <vertical>
        <div
          v-if="stream.streamurls && stream.streamurls.length > 1"
          style="display: flex; gap: 8px; margin-top: 24px"
        >
          <button-medium
            v-for="(_, i) in stream.streamurls"
            :key="i"
            @click="activeStream = i"
            :style="{ background: activeStream === i ? '#333' : '' }"
          >
            Camera {{ i + 1 }}
          </button-medium>
        </div>
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
          :channel="route.params.event_slug"
          :controls="event.controls"
          :private="true"
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
        <chat :channel="route.params.event_slug" />
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
