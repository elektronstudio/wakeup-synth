<script setup>
import { defineProps, computed, toRefs } from "vue";
import { useStorage, useTimeAgo } from "@vueuse/core";
import { format } from "date-fns";
import { useTicket, timezoneShortname } from "../lib";

const formatDate = (str) =>
  `${format(new Date(str), "d. MMMM y HH:mm")} ${timezoneShortname(
    new Date()
  )}`;

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
});

const startedAt = props.event?.start_at
  ? useTimeAgo(new Date(props.event?.start_at))
  : "";

const tickets = useStorage("elektron_data", []);

const hasLocalTicket = computed(() =>
  tickets.value?.find(
    (ticket) =>
      (props.festival?.fienta_id &&
        ticket.fientaid == props.festival.fienta_id) ||
      (props.event?.fienta_id && ticket.fientaid == props.event.fienta_id)
  )
);

const needsTicket = computed(
  () => props.festival?.fienta_url || props.event?.fienta_url
);

const { festival, event } = toRefs(props);
const { status } = useTicket(festival, event);
</script>

<template>
  <vertical v-if="festival && event" style="gap: 4px">
    <flex
      v-if="status !== 'FREE'"
      style="gap: 12px; font-size: 0.9em"
      :style="{
        color:
          event.urgency === 'past'
            ? 'var(--fgdark)'
            : status === 'HAS_FESTIVAL_TICKET' || status === 'HAS_EVENT_TICKET'
            ? '#2ECC40'
            : 'var(--ticket)',
      }"
    >
      <icon-ticket />
      <div v-if="status === 'HAS_FESTIVAL_TICKET'">You have a ticket</div>
      <div v-if="status === 'HAS_EVENT_TICKET'">You have a ticket</div>
      <a
        v-if="status === 'REQUIRES_TICKET' && festival?.fienta_url"
        :href="festival?.fienta_url"
        target="_black"
      >
        Get a ticket from Fienta
      </a>
      <a
        v-if="status === 'REQUIRES_TICKET' && event?.fienta_url"
        :href="event?.fienta_url"
        target="_black"
      >
        Get a ticket from Fienta
      </a>
    </flex>
    <flex style="opacity: 0.5; font-size: 0.85em">
      {{ startedAt }}
      {{ formatDate(event.start_at) }} →
      {{ formatDate(event.end_at) }}
    </flex>
    <ButtonMedium
      style="margin-top: 8px"
      v-if="status === 'HAS_FESTIVAL_TICKET' || status === 'HAS_EVENT_TICKET'"
    >
      Go to event →
    </ButtonMedium>
  </vertical>
</template>
