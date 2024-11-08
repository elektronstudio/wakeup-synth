<script setup>
import { emitter, showMessages, plausible } from "../lib";
const onClick = () => {
  if (showMessages.value) {
    emitter.emit("USERS_OFF");
  } else {
    plausible.trackEvent("user_circlechat");
    emitter.emit("USERS_ON");
  }
};
</script>

<template>
  <button-plain
    :style="{ animation: showMessages ? '' : 'scale-xl 1s infinite' }"
    @click="onClick"
  >
    <icon-close v-if="showMessages" />
    <icon-circles v-if="!showMessages" />
  </button-plain>
</template>
