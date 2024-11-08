//@ts-check
import { computed, isRef, ref } from "vue";

import {
  createMessage,
  messagesWithUsers,
  useChatTextarea,
  useScrollToBottom,
  ws,
} from "./";
import { userName } from "./users";

export const useChat = (channel, sendtype, receivetype) => {
  const chatChannel = isRef(channel) ? channel : ref(channel);
  const chatSendType = isRef(sendtype) ? sendtype : ref(sendtype);
  const chatReceiveType = isRef(receivetype) ? receivetype : ref(receivetype);

  const chats = computed(() =>
    messagesWithUsers.value.filter(
      (m) =>
        m.type === (chatReceiveType.value || "CHAT") &&
        m.channel === chatChannel.value
    )
  );

  const newMessage = ref("");

  const onNewMessage = () => {
    if (newMessage.value) {
      const outgoingMessage = createMessage({
        type: chatSendType.value || "CHAT",
        channel: chatChannel.value,
        userName: userName.value,
        value: newMessage.value,
        store: true,
      });
      ws.send(outgoingMessage);
      newMessage.value = "";
    }
  };

  const textareaRef = useChatTextarea(onNewMessage);
  const scrollRef = useScrollToBottom();

  return {
    chats,
    newMessage,
    onNewMessage,
    scrollRef,
    textareaRef,
  };
};
