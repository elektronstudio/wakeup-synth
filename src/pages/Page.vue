<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { ETitle, ENav } from "elektro";
import { strapiPages, config } from "../lib";

const { params } = toRefs(useRoute());
const page = computed(() =>
  (strapiPages.value || []).find((p) => p.slug === params.value.page_slug)
);
</script>
<template>
  <div>
    <!-- <ENav :navItems="config.navItems" /> -->
    <horizontal style="padding: 48px; --cols: 1fr 5fr 1fr">
      <div />
      <vertical>
        <ETitle size="lg" v-html="page?.title" />
        <EContent v-html="page?.description_estonian" />
        <EContent v-html="page?.description_english" />
      </vertical>
      <users />
      <layout>
        <template #top-left
          ><back-button style="transform: translateY(0px)"
        /></template>
        <template #bottom-left>
          <theme-button />
        </template>
      </layout>
    </horizontal>
  </div>
</template>
