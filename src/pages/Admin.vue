<script setup lang="ts">
//@ts-nocheck
import { toRefs, computed, ref } from "vue";
import { format } from "date-fns";
import { useStorage } from "@vueuse/core";
import { line } from "d3-shape";
import { scaleTime, scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { add } from "date-fns";
import { interpolatePlasma } from "d3-scale-chromatic";

import { messages, ws, safeJsonParse, unique } from "../lib";

function downloadCSV(data, filename) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += [
    Object.keys(data[0]).join(","),
    ...data.map((item) =>
      Object.values(item)
        .map((i) => `"${i}"`)
        .join(",")
    ),
  ]
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");

  const encodedData = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedData);
  link.setAttribute("download", filename);
  link.click();
}

function downloadJSON(data, filename) {
  let jsonContent = "data:application/json;charset=utf-8,";
  jsonContent += JSON.stringify(data, null, 2);
  const encodedData = encodeURI(jsonContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedData);
  link.setAttribute("download", filename);
  link.click();
}

const channel = useStorage("LAB_CHANNEL", "");
const types = ref("DATA_1");

const captureId = ref(null);

const captured = useStorage("elektron_captured", []);

const selectedCaptureId = ref(null);

const selectedCaptures = computed(() => {
  if (selectedCaptureId.value) {
    return captured.value.filter(
      (c) => c.captureId === selectedCaptureId.value
    );
  }
  return [];
});

const formatCaptureName = (date) => format(date, "dd_MM_y__HH_mm_ss");

const onStart = () => {
  captureId.value = formatCaptureName(new Date());
  selectedCaptureId.value = captureId.value;
};

const onEnd = () => {
  captureId.value = null;
};

const onDownloadCsv = () => {
  if (selectedCaptureId.value) {
    downloadCSV(selectedCaptures.value, `${selectedCaptureId.value}.csv`);
  }
};

const onDownloadJSON = () => {
  if (selectedCaptureId.value) {
    downloadJSON(selectedCaptures.value, `${selectedCaptureId.value}.json`);
  }
};

const isCapture = (m) =>
  m.channel === channel.value &&
  types.value
    .split(",")
    .map((t) => t.trim())
    .includes(m.type);

const captureIds = computed(() =>
  unique(captured.value.map((c) => c.captureId)).filter((c) => {
    if (captureId.value) {
      return c !== captureId.value;
    }
    return true;
  })
);

ws.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  if (isCapture(message) && captureId.value) {
    captured.value = [
      ...captured.value,
      { ...message, captureId: captureId.value },
    ];
  }
});

const width = 500;
const height = 100;
const p = 5;

// const data = ref([
//   { value: -2, userId: "a12", datetime: add(new Date(), { seconds: 1 }) },
//   { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 10 }) },
//   { value: 421, userId: "a12", datetime: add(new Date(), { seconds: 40 }) },
//   { value: 1000, userId: "ffa", datetime: add(new Date(), { seconds: 1 }) },
//   { value: 212, userId: "ffa", datetime: add(new Date(), { seconds: 10 }) },
//   { value: 21, userId: "ffa", datetime: add(new Date(), { seconds: 40 }) },
// ]);

const xDomain = computed(() =>
  extent(selectedCaptures.value, (d) => new Date(d.datetime))
);
const yDomain = computed(() =>
  extent(selectedCaptures.value, (d) => d.value).reverse()
);
const userIds = computed(() => extent(selectedCaptures.value, (d) => d.userId));

const x = computed(() =>
  scaleTime()
    .domain(xDomain.value)
    .range([p, width - p])
);

const y = computed(() =>
  scaleLinear()
    .domain(yDomain.value)
    .range([p, height - p])
);

const color = (userId) =>
  interpolatePlasma(
    scaleOrdinal().domain(userIds.value).range([0.2, 0.8])(userId)
  );

const d = line()
  .x((d) => x.value(new Date(d.datetime)))
  .y((d) => y.value(d.value));

const showLogs = ref(false);
</script>
<template>
  <div>
    <horizontal style="--cols: 1fr 2fr">
      <vertical style="padding: 32px">
        <h3>Start new capture</h3>
        <div>
          <div>Slug</div>
          <input type="text" v-model="channel" />
        </div>

        <div>
          <div>Types,comma,separated</div>
          <input type="text" v-model="types" />
        </div>

        <p v-if="!captureId">Capture OFF</p>
        <p v-if="captureId" style="color: red">Capture ON</p>

        <button-big v-if="!captureId" @click="onStart">
          ● Start capture
        </button-big>
        <button-big v-if="captureId" @click="onEnd">◼ Stop capture</button-big>

        <div
          v-if="captureId"
          class="captureCard"
          @click="selectedCaptureId = captureId"
          :style="{
            background: selectedCaptureId === captureId ? '#444' : '#222',
          }"
        >
          {{ captureId }}.csv
        </div>

        <br />
        <h3>Previous captures</h3>

        <div
          v-for="id in captureIds.sort().reverse()"
          class="captureCard"
          :key="id"
          @click="selectedCaptureId = id"
          :style="{ background: selectedCaptureId === id ? '#444' : '#222' }"
        >
          {{ id }}.csv
        </div>
      </vertical>
      <vertical style="padding: 32px">
        <div style="display: flex; gap: 16px">
          <h2 v-if="selectedCaptureId">{{ selectedCaptureId }}.csv</h2>
          <button-medium v-if="selectedCaptureId" @click="onDownloadCsv">
            Download CSV
          </button-medium>
          <button-medium v-if="selectedCaptureId" @click="onDownloadJSON">
            Download JSON
          </button-medium>
        </div>
        <br />
        <div v-if="captureId && !selectedCaptures.length">
          Waiting for data...
        </div>
        <svg :width="width" :height="height">
          <path
            v-for="(userId, i) in userIds"
            :key="i"
            :d="d(selectedCaptures.filter((f) => f.userId === userId))"
            :stroke="color(userId)"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <br />
        <div
          v-for="c in selectedCaptures"
          :key="c.id"
          style="font-family: monospace; font-size: 0.8em"
        >
          <span :style="{ color: color(c.userId) }">●</span>&emsp;<span
            style="opacity: 0.5"
            >{{ c.datetime }} {{ c.userId }} {{ c.userName }}
          </span>
          {{ c.value }}
        </div>
        <button-medium
          v-if="!showLogs && selectedCaptureId"
          @click="showLogs = true"
        >
          Show logs
        </button-medium>
        <pre v-if="showLogs" style="font-size: 0.8em">{{
          selectedCaptures
        }}</pre>
      </vertical>
    </horizontal>
    <layout>
      <template #top-left> </template>
      <template #top-right> </template>
      <template #bottom-left> </template>
    </layout>
  </div>
</template>

<style scoped>
.captureCard {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
}
</style>
