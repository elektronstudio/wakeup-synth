<script setup>
import { ref, computed, watchEffect } from "vue";
import { ETitle, EContent } from "elektro";
import Parser from "rss-parser/dist/rss-parser.js";

import { strapiFestivals } from "../lib";

const slug = "signal";

const festival = computed(() =>
  (strapiFestivals.value || []).find((f) => f.slug === slug)
);

const imageUrl = computed(() => {
  return festival.value?.images[0]
    ? festival.value.images[0].formats.small.url
    : "";
});

let feed = ref(null);

const rssUrl =
  "https://api.allorigins.win/get?url=https://elektronsignal.captivate.fm/rssfeed";
let parser = new Parser();

fetch(rssUrl)
  .then((res) => res.json())
  .then((rss) => {
    parser.parseString(rss.contents).then((f) => (feed.value = f));
  });
</script>
<template>
  <horizontal style="--cols: 1fr 1fr; gap: 0">
    <vertical style="padding: var(--p-8); border: 1px solid var(--gray-500)">
      <ETitle size="lg" v-html="festival?.title" />
      <div style="display: flex; gap: var(--gap-2)">
        <a
          style="transform: translateY(-3px)"
          href="https://elektronsignal.captivate.fm/spotify"
          target="_blank"
        >
          <icon-spotify style="color: white; width: 32px; height: 32px"
        /></a>
        <a href="https://elektronsignal.captivate.fm/apple" target="_blank">
          <icon-applepodcasts style="color: white; width: 24px; height: 24px"
        /></a>
        <a href="hhttps://elektronsignal.captivate.fm/google" target="_blank">
          <icon-googlepodcasts style="color: white; width: 24px; height: 24px"
        /></a>
        <a href="https://elektronsignal.captivate.fm/rssfeed" target="_blank">
          <icon-rss style="color: white; width: 24px; height: 24px" />
        </a>
      </div>
      <EContent v-html="festival?.description_estonian" />
      <EContent v-html="festival?.description_english" />
    </vertical>
    <vertical
      style="padding: var(--p-8); border: 1px solid var(--gray-500; gap: 24px; transform: translateX(-1px)"
      v-if="feed?.items"
    >
      <ETitle style="opacity: 0.5">Latest episodes</ETitle>
      <vertical style="gap: 32px">
        <episode-card
          v-for="(episode, i) in feed?.items"
          :key="i"
          :episode="episode"
      /></vertical>
    </vertical>
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
