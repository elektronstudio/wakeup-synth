//@ts-check
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

export const useWindow = () => {
  const { width, height } = useWindowSize();
  const centerX = computed(() => width.value / 2);
  const centerY = computed(() => height.value / 2);
  return { width, height, centerX, centerY };
};
