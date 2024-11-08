//@ts-check
import { computed, isRef, ref } from "vue";

import { tryOnUnmounted } from "@vueuse/core";

export function debounce(fn, timeout) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), timeout);
  };
}

export const replace = (str, obj) =>
  str.replace(/\${(.*?)}/g, (_, v) => obj[v]);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

export const any = (arr) => shuffle(arr)[0];

export const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

export const uniqueCollection = (arr, key) => {
  const result = [];
  const map = new Map();
  for (const item of arr.reverse()) {
    if (!map.has(item[key])) {
      map.set(item[key], true);
      result.push(item);
    }
  }
  return result.reverse();
};

export const randomId = (length = 16) => {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  return shuffle(letters).slice(0, length).join("");
};

export const wsToUrl = (ws) =>
  ws.replace("ws://", "http://").replace("wss://", "https://");

export const scale = (value, start1, stop1, start2, stop2) => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

// https://github.com/fregante/intrinsic-scale/blob/master/index.js
export const fit = (parentWidth, parentHeight, childWidth, childHeight) => {
  const doRatio = childWidth / childHeight;
  const cRatio = parentWidth / parentHeight;
  let width = parentWidth;
  let height = parentHeight;

  if (doRatio < cRatio) {
    height = width / doRatio;
  } else {
    width = height * doRatio;
  }

  return {
    x: (parentWidth - width) / 2,
    y: (parentHeight - height) / 2,
    width,
    height,
  };
};

export const useSetInterval = (
  callback,
  timeout,
  every = 1,
  condition = true
) => {
  let a = 0;
  const interval = ref(null);
  interval.value = setInterval(() => {
    const n = isRef(every) ? every.value : every;
    a = a >= n - 1 ? 0 : a + 1;
    const cond = isRef(condition) ? condition.value : condition;
    if (a === 0 && cond) {
      callback();
    }
  }, timeout);
  tryOnUnmounted(() => {
    if (interval.value) {
      clearInterval(interval.value);
    }
  });
  return interval;
};

export const range = (from, to, step = 1) => {
  const length = Math.floor((to - from) / step) + 1;
  return Array.from({ length }).map((_, i) => from + i * step);
};

// @ts-ignore
export const unique = (arr) => [...new Set(arr)];

// https://gist.github.com/iperelivskiy/4110988
export const hash = (s) => {
  for (var i = 0, h = 0xdeadbeef; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
  return (h ^ (h >>> 16)) >>> 0;
};

export const titlecase = (str) =>
  str
    .split(" ")
    .map(([h, ...t]) => h.toUpperCase() + t.join("").toLowerCase())
    .join(" ");

export const sentencecase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const deg2rad = (deg) => (deg * Math.PI) / 180;

export const rad2deg = (rad) => (rad * 180) / Math.PI;

export const pol2car = (a, r) => {
  return {
    x: Math.cos((a - 90) * (Math.PI / 180)) * r,
    y: Math.sin((a - 90) * (Math.PI / 180)) * r,
  };
};

export const car2pol = (x, y) => {
  return {
    a: Math.atan2(y, x) * (180 / Math.PI),
    r: Math.sqrt(x * x + y * y),
  };
};

export const random = (from = 0, to = 1) => from + Math.random() * (to - from);

export const randomint = (from = 0, to = 1) => Math.floor(random(from, to));

export const isNumber = (value) => typeof value === "number" && isFinite(value);

export const distance = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

export const split = (str = "", separator = ",") =>
  str
    .split(separator)
    .map((s) => s.trim())
    .filter((s) => s);
