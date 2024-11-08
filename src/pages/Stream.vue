<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { parseStreamkey } from "../lib";

const route = useRoute();
const stream = computed(() => parseStreamkey(route.params.streamkey));
const activeStream = ref(0);
</script>

<template>
  <horizontal style="--cols: 3.5fr 300px; gap: 0">
    <div style="padding: 48px">
      <video-stream
        v-for="(src, i) in stream.streamurls"
        v-show="i === activeStream"
        :key="i"
        :src="src"
        :streamkey="stream.streamkeys[i]"
        style="width: 100%"
      />
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
    </div>
    <div>
      <event-panel
        title="Chat"
        style="background: var(--bglighter); position: sticky; top: 0"
      >
        <chat :channel="stream.streamkeys[0]" />
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
