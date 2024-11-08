import { computed, ref } from "vue";

import ReconnectingWebsocket from "reconnecting-websocket";

import {
  config,
  randomId,
  safeJsonParse,
  uniqueCollection,
  userId,
  users,
} from "./";

// Websocket

//@ts-check
export const ws = new ReconnectingWebsocket(config.wsUrl);

// Create message

export const createMessage = (message) => {
  return JSON.stringify({
    id: randomId(),
    datetime: new Date().toISOString(),
    userId: userId.value,
    channel: "",
    type: "",
    value: "",
    ...message,
  });
};

export const messages = ref([]);

export const loadMessages = () => {
  fetch(config.messagesUrl)
    .then((res) => res.json())
    .then(
      (loadedMessages) =>
        (messages.value = uniqueCollection(
          [...loadedMessages, ...messages.value],
          "id"
        ))
    );

  // @TODO: Remove duplicates

  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    //if (message?.store === true) {
    messages.value = [...messages.value, message];
    //}
  });
};

export const messagesWithUsers = computed(() => {
  const usersEntries = users.value
    .map((user) => {
      if (user.value?.userName) {
        return [user.userId, user.value.userName];
      } else {
        return null;
      }
    })
    .filter((user) => user);
  const usersMap = Object.fromEntries(usersEntries);
  return messages.value.map((message) => {
    if (usersMap[message.userId]) {
      message.userName = usersMap[message.userId];
    }
    return message;
  });
});
