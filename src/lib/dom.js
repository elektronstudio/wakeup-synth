import {
  nextTick,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import { when } from '@vueuse/core';

export const useChatTextarea = (callback = () => {}) => {
  const textareaRef = ref(null);

  const onKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      callback();
      textareaRef.value.style.height = "auto";
    }
  };

  const onInput = (e) => {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  };

  when(textareaRef)
    .toBeTruthy()
    .then(() => {
      if (textareaRef.value) {
        //textareaRef.value.focus();
        textareaRef.value.addEventListener("keydown", onKeydown);
        // @TODO Run when event exists
        onInput();
        textareaRef.value.addEventListener("input", onInput);
      }
    });

  onUnmounted(() => {
    if (textareaRef.value) {
      textareaRef.value.removeEventListener("keydown", onKeydown);
      textareaRef.value.removeEventListener("input", onInput);
    }
  });

  return textareaRef;
};

export const useAboutTextarea = (visible) => {
  const textareaRef = ref(null);

  watch(
    [() => textareaRef.value, () => visible.value],
    () => {
      if (textareaRef.value && visible.value) {
        nextTick(() => {
          textareaRef.value.focus();
          textareaRef.value.select();
        });
      }
    },
    { immediate: true }
  );

  return textareaRef;
};

export const useScrollToBottom = () => {
  const scrollRef = ref(null);
  let observer = null;
  when(scrollRef)
    .toBeTruthy()
    .then(() => {
      observer = new MutationObserver(() => {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      });
      observer.observe(scrollRef.value, { childList: true });
    });
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return scrollRef;
};
