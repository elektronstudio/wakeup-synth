<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage, whenever } from "@vueuse/core";
import { ETitle, EContent } from "elektro";
import {
  strapiFestivals,
  strapiEvents,
  filterUpcomingEvents,
  filterPastEvents,
  useTicket,
  parseStreamkey,
} from "../lib";

const route = useRoute();

const festival = computed(() =>
  (strapiFestivals.value || []).find(
    (f) => f.slug === route.params.festival_slug
  )
);
const event = computed(() =>
  (strapiEvents.value || []).find((e) => e.slug === route.params.event_slug)
);
const stream = computed(() => {
  return parseStreamkey(event.value?.streamkey);
});

const festivalRoute = computed(() => `/${festival.value?.slug}`);

const { status } = useTicket(festival, event);

const hasTicketOrFree = computed(() =>
  ["HAS_FESTIVAL_TICKET", "HAS_EVENT_TICKET", "FREE"].includes(status.value)
);

const imageUrl = computed(() => {
  return event.value?.images.length
    ? event.value.images[0].formats.small.url
    : "";
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
    <vertical style="padding: var(--gap-6); padding-left: var(--gap-12)">
      <div v-if="hasTicketOrFree" style="width: 100%">
        <component
          v-for="(src, i) in stream.streamurls"
          v-show="i === activeStream"
          :key="i"
          :is="event?.is_360 ? 'video-stream-three' : 'video-stream'"
          :src="src"
          :streamkey="stream.streamkeys[0]"
        />
      </div>
      <div v-if="hasTicketOrFree" />
      <div
        v-if="stream.streamurls && stream.streamurls.length > 1"
        style="display: flex; gap: 8px"
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
      <ETitle size="lg" v-html="event?.title" />
      <event-data :festival="festival" :event="event" />
      <controls
        v-if="event?.controls"
        :channel="route.params.event_slug"
        :controls="event?.controls"
      />
      <div />
      <horizontal
        :style="{
          '--cols':
            event && event.chat === false
              ? '3fr 2fr'
              : festival && festival.slug === 'other'
              ? '1fr'
              : '1fr 1fr',
        }"
      >
        <vertical>
          <img
            v-if="imageUrl && event?.urgency !== 'past'"
            :src="imageUrl"
            style="
              margin-top: 8px;
              border-radius: 2px;
              object-fit: cover;
              aspect-ratio: 16/9;
            "
          />
          <EContent v-html="event?.description_estonian" />
          <!-- <div style="height: 16px" /> -->
          <ETitle
            style="opacity: 0.5"
            v-if="event?.description_estonian && event?.description_english"
          >
            In English
          </ETitle>
          <EContent v-html="event?.description_english" />
        </vertical>
        <vertical v-if="festival?.events && festival.slug !== 'other'">
          <ETitle
            style="opacity: 0.5"
            v-if="festival?.events.filter(filterUpcomingEvents).length"
          >
            Upcoming events
          </ETitle>
          <event-card
            v-for="(event, i) in festival?.events.filter(filterUpcomingEvents)"
            :key="i"
            :festival="festival"
            :event="event"
          />
          <div style="height: 32px" />
          <ETitle
            style="opacity: 0.5"
            v-if="festival?.events.filter(filterPastEvents).length"
          >
            Past events
          </ETitle>
          <event-card
            v-for="(event, i) in festival?.events.filter(filterPastEvents)"
            :key="i"
            :festival="festival"
            :event="event"
          />
        </vertical>
      </horizontal>
    </vertical>
    <div v-if="event && event.chat !== false">
      <event-panel
        :title="hasTicketOrFree ? 'Chat' : ''"
        style="
          position: sticky;
          top: 0;
          height: 100vh;
          border-left: 1px solid var(--gray-500);
        "
      >
        <chat v-if="hasTicketOrFree" :channel="route.params.event_slug" />
      </event-panel>
    </div>
    <!-- <users /> -->
    <layout>
      <template #top-left>
        <back-button :to="festivalRoute" />
      </template>
      <template #top-right> </template>
      <template #bottom-left>
        <theme-button />
      </template>
    </layout>
  </horizontal>
</template>
