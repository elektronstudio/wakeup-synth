<script setup>
import { formatMarkdown } from "../lib";
defineProps({ chat: { type: Object } });
</script>

<template>
  <vertical style="gap: 4px">
    <smaller style="opacity: 0.5">
      {{ chat.userName }}
    </smaller>
    <small
      style="
        border: 1px solid var(--fgdark);
        border-radius: 2px;
        padding: 8px 12px;
        font-family: var(--font-mono);
      "
      v-html="formatMarkdown(chat.value)"
    />
  </vertical>
</template>
