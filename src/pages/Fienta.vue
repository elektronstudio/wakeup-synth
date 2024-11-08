<script setup>
import { ref } from "vue";
import { whenever } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useRouteQuery } from "@vueuse/router";
import { EButton } from "elektro";
import {
  tickets,
  getStrapi,
  strapi,
  fienta,
  uniqueCollection,
  config,
  strapiFestivals,
  strapiEvents,
} from "../lib";

const router = useRouter();
const code = useRouteQuery("code");
const showForm = ref(false);

if (!code.value) {
  showForm.value = true;
}

const getLocalTicket = (code) => {
  const ticket = tickets.value?.find((ticket) => ticket.code == code);
  return ticket;
};

const getEventOrFestivalRoute = async (fienta_id) => {
  // @TODO Consider to use
  // await until(strapiFestivals).toBeTruthy();

  const events = await strapi.get("events?_limit=-1").json();
  const festivals = await strapi.get("festivals?_limit=-1").json();

  const ticketEvent = events.find(
    (e) => e.fienta_id && e.fienta_id == fienta_id
  );
  const ticketFestival = festivals.find(
    (f) => f.fienta_id && f.fienta_id == fienta_id
  );
  if (ticketEvent) {
    return `/${ticketEvent.festival.slug}/${ticketEvent.slug}`;
  } else if (ticketFestival) {
    return `/${ticketFestival.slug}`;
  } else {
    return null;
  }
};

const storeLocalTicket = (code, fienta_id) => {
  tickets.value = uniqueCollection(
    [
      ...tickets.value,
      {
        code: code,
        fientaid: fienta_id,
      },
    ],
    "code"
  );
};

const getRemoteTicket = (code) =>
  fienta
    .get(`tickets/${code}`)
    .json()
    .then((res) => {
      return {
        fienta_status: res?.ticket?.status,
        fienta_id: res?.ticket?.event_id,
      };
    });

whenever(
  code,
  async () => {
    showForm.value = false;
    const localTicket = getLocalTicket(code.value);
    if (localTicket) {
      // We use "fientaid" for backward compatibility
      const route = await getEventOrFestivalRoute(localTicket.fientaid);
      if (route) {
        router.push(route);
      } else {
        showForm.value = true;
      }
    } else {
      try {
        const remoteTicket = await getRemoteTicket(code.value);
        if (remoteTicket) {
          const route = await getEventOrFestivalRoute(remoteTicket.fienta_id);
          if (route) {
            storeLocalTicket(code.value, remoteTicket.fienta_id);
            router.push(route);
          } else {
            showForm.value = true;
          }
        }
      } catch (error) {
        showForm.value = true;
      }
    }
  },
  { immediate: true }
);

const manualCode = ref("");
const submitCode = () => {
  if (manualCode.value) {
    code.value = manualCode.value;
  }
};
</script>
<template>
  <div>
    <overlay v-if="!showForm">
      <h1>Validating ticket...</h1>
    </overlay>
    <overlay v-if="showForm">
      <img style="height: 96px" src="/favicon.svg" />
      <div />
      <h1>
        Somehow we can not validate your ticket.<br />But let's try to get you
        in!
      </h1>
      <div />
      <p>
        There is a <b>ticket code</b> in your ticket email,<br />just below the
        "Sisene üritusele / Enter event" blue button
      </p>
      <div />
      <input
        class="chat"
        v-model="manualCode"
        placeholder="Enter ticket code"
        style="width: 200px; height: auto; font-family: var(--font-mono)"
      />
      <EButton @click="submitCode">Submit ticket code</EButton>
      <div />
      <a
        v-if="config.fientaPublicUrl"
        :href="config.fientaPublicUrl"
        target="_blank"
        style="text-decoration: underline; opacity: 0.5"
      >
        No tickets yet? Get them here
      </a>
      <div />
      <p v-if="config.phoneUrl || config.emailUrl">
        <span style="opacity: 0.5">Having problems? Contact us at</span>
        &nbsp;
        <a v-if="config.phoneUrl" :href="config.phoneUrl">{{
          config.phoneUrl.replace("tel:", "")
        }}</a>
        or
        <a v-if="config.emailUrl" :href="config.emailUrl">{{
          config.emailUrl.replace("mailto://", "")
        }}</a>
      </p>
    </overlay>
    <layout>
      <template #top-left>
        <back-button v-if="showForm" />
      </template>
    </layout>
  </div>
</template>
