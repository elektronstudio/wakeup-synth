//@ts-check
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { differenceInSeconds } from "date-fns";
import { merge } from "lodash";
import { useStorage } from "@vueuse/core";
import {
  adjectives,
  animals,
  any,
  config,
  createMessage,
  pol2car,
  random,
  randomId,
  safeJsonParse,
  ws,
} from "../lib";

const initialUserId = randomId();
const initialUserName = `${any(adjectives)} ${any(animals)}`;

export const userId = useStorage("elektron_user_id", initialUserId);
export const userName = useStorage("elektron_user_name", initialUserName);
export const userAbout = useStorage("elektron_user_about", "");

const randomPosition = pol2car(random(0, 360), random(0, 100));

export const userData = useStorage("elektron_user_data", {
  userX: randomPosition.x,
  userY: randomPosition.y,
});

export const onUserNameChange = () => {
  const newName = window.prompt("Enter your name", userName.value);
  if (newName) {
    userName.value = newName;
  }
};

export const refreshUser = () =>
  watch(
    [userName, userAbout],
    () => {
      const outgoingMessage = createMessage({
        type: "USER",
        userId: userId.value,
        value: { userName: userName.value, userAbout: userAbout.value },
      });
      ws.send(outgoingMessage);
    },
    { immediate: true }
  );

export const users = ref([]);

export const updatedUsers = computed(() =>
  users.value.map((user) => {
    user.updatedSince = differenceInSeconds(
      new Date(),
      new Date(user.datetime)
    );
    return user;
  })
);

export const refreshUsers = () => {
  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message?.type === "USER") {
      const index = users.value
        .reverse()
        .findIndex((u) => message.userId === u.userId);
      if (index > -1) {
        users.value[index] = merge(users.value[index], message);
      } else {
        users.value = [...users.value, message];
      }
    }
  });

  const interval = ref(null);

  onMounted(() => {
    const outgoingMessage = createMessage({
      type: "USER",
      value: { userName: userName.value },
    });
    ws.send(outgoingMessage);

    if (!interval.value) {
      interval.value = setInterval(() => {
        const outgoingMessage = createMessage({
          type: "USER",
          value: {},
        });
        ws.send(outgoingMessage);
      }, config.userUpdateRate);
    }
  });

  onUnmounted(() => clearInterval(interval.value));
};

export const showMessages = ref(false);
