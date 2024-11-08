//@ts-check
import { watch } from "vue";
import { useCssVar, useStorage } from "@vueuse/core";

const themeVars = {
  bgdark: useCssVar("--bgdark"),
  bg: useCssVar("--bg"),
  bglight: useCssVar("--bglight"),
  bglighter: useCssVar("--bglighter"),
  fg: useCssVar("--fg"),
  fgdark: useCssVar("--fgdark"),
  ticket: useCssVar("--ticket"),
  overlay: useCssVar("--overlay"),
  accent: useCssVar("--accent"),
};

const themeValues = [
  {
    bgdark: "#000",
    bg: "#111",
    bglight: "#222",
    bglighter: "#333",
    fg: "#fff",
    fgdark: "#555",
    ticket: "#ffc107",
    accent: "#6c3ec1",
    overlay: "hsla(0,0%,0%,0.95)",
  },
  {
    bgdark: "#ddd",
    bg: "#fff",
    bglight: "#eee",
    bglighter: "#ddd",
    fg: "#111",
    fgdark: "#ccc",
    accent: "#6c3ec1",
    ticket: "#f0b400",
    overlay: "hsla(0,0%,100%,0.95)",
  },
];

export const activeTheme = useStorage("elektron_theme", 0);

watch(
  activeTheme,
  () =>
    Object.entries(themeValues[activeTheme.value]).forEach(([key, value]) => {
      themeVars[key].value = value;
    }),
  { immediate: true }
);

export const toggleTheme = () => (activeTheme.value = 1 - activeTheme.value);
