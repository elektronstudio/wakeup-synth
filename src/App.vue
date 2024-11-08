<script setup>
import { EWindowBorder } from "elektro";
import {
  loadEvents,
  loadMessages,
  loadPages,
  refreshUser,
  refreshUsers,
  plausible,
  getStrapi,
} from "./lib";

//loadEvents();
//loadPages();
loadMessages();
refreshUser();
refreshUsers();
plausible.enableAutoPageviews();
</script>

<template>
  <div class="App">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
    <EWindowBorder />
  </div>
</template>

<style>
.App {
  min-height: 100vh;
}
</style>
