//@ts-check
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage } from "@vueuse/core";

import { createMessage, safeJsonParse, ws, emitter } from "../lib";

export const superuser = ref(false);
export const admin = ref(false);
export const debug = ref(false);

export const toBeUpdated = ref(false);
export const updated = useStorage("elektron_updated", false);

export const useAdmin = () => {
  const route = useRoute();
  watch(
    () => route.query,
    () => {
      superuser.value = route.query.hasOwnProperty("superuser"); // @TODO use superuser key
      // Currently admin is unused
      admin.value = route.query.hasOwnProperty("admin"); // @TODO use admin key
      debug.value = route.query.hasOwnProperty("debug"); // @TODO use admin key
    },
    { immediate: true }
  );

  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message.type === "UPDATE") {
      toBeUpdated.value = true;
    }
  });

  const sendUpdate = () => {
    const outgoingMessage = createMessage({
      type: "UPDATE",
    });
    ws.send(outgoingMessage);
  };

  const runUpdate = () => {
    toBeUpdated.value = false;
    updated.value = true;
    location.reload();
  };

  const runPostUpdate = () => {
    updated.value = null;
    emitter.emit("unmute");
  };

  return { sendUpdate, runUpdate, runPostUpdate };
};
