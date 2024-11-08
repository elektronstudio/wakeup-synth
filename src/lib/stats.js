import { ref } from "vue";
import { ws, safeJsonParse } from ".";

export const stats = ref([]);

ws.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  if (message.type === "STATS") {
    stats.value = message.value;
  }
});
