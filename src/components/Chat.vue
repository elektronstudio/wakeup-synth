<script setup>
import { defineProps, toRefs } from "vue";
import { useChat, userName, onUserNameChange } from "../lib";
import { EButton } from "elektro";
const props = defineProps({
  channel: { type: String },
  sendtype: { type: String, default: "CHAT" },
  receivetype: { type: String, default: "CHAT" },
});

const { channel, sendtype, receivetype } = toRefs(props);

const { chats, newMessage, onNewMessage, scrollRef, textareaRef } = useChat(
  channel,
  sendtype,
  receivetype
);
</script>

<template>
  <vertical class="chat">
    <div class="chat-cards" ref="scrollRef">
      <chat-card v-for="(chat, i) in chats" :key="i" :chat="chat" />
    </div>
    <div
      style="font-size: 0.8em; line-height: 1.5em; transform: translateY(6px)"
    >
      <span style="opacity: 0.5">Your name is {{ userName }}</span>
      &ensp;
      <span @click="onUserNameChange" style="cursor: pointer">Change</span>
    </div>
    <textarea
      style="
        width: 100%;
        font-family: var(--font-mono);
        font-size: 14px;
        background: var(--bg);
        border: 2px solid var(--fg);
        outline: none;
        padding: var(--p-2);
        border-radius: 2px;
      "
      ref="textareaRef"
      v-model="newMessage"
      placeholder="Write a chat message here"
    ></textarea>
    <EButton size="sm" @click="onNewMessage">Send chat message</EButton>
  </vertical>
</template>

<style>
.chat {
  grid-template-rows: 1fr auto auto;
  height: 80vh;
}
.chat-cards {
  display: grid;
  grid-auto-rows: min-content;
  gap: 8px;
  overflow: auto;
  opacity: 0.8;
}
</style>
