import { computed, ref, watch } from "vue";
import { useStorage, whenever } from "@vueuse/core";
import ky from "ky";

import { config, uniqueCollection } from "./";

export const fienta = ky.extend({
  prefixUrl: config.fientaUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("Authorization", `Bearer ${config.fientaToken}`);
      },
    ],
  },
});

// const useFienta = (event, code = null) => {
//   const code = isRef(code) ? code : ref(code);

//   const tickets = useStorage("elektron_data", []);

//   const hasLocalTicket = computed(() =>
//     tickets.value?.find((ticket) => ticket.code === code.value)
//   );

//   const tickedChecked = ref(false)

//   watch(event, () => {

//   })
// };

export const tickets = useStorage("elektron_data", []);

const checkLocalTicketWithoutCode = (event) => {
  const ticket = tickets.value?.find(
    (ticket) =>
      ticket.fientaid == event.value.fientaid ||
      ticket.fientaid == event.value.page?.fientaid
  );
  return ticket;
};

const checkLocalTicket = (code, event) => {
  return tickets.value?.find(
    (ticket) =>
      ticket.code == code.value &&
      (ticket.fientaid == event.value.fientaid ||
        ticket.fientaid == event.value.page?.fientaid)
  );
};

const storeLocalTicket = (code, fientaid) => {
  tickets.value = uniqueCollection(
    [
      ...tickets.value,
      {
        code: code.value,
        fientaid,
      },
    ],
    "code"
  );
};

const checkRemoteTicket = (code, event) =>
  fienta
    .get(`tickets/${code.value}`)
    .json()
    .then((res) => {
      if (
        res?.ticket?.event_id == event.value.fientaid ||
        res?.ticket?.event_id == event.value?.page.fientaid
      ) {
        // @TODO do not pass fientaid when there is no res.ticket?
        return {
          remoteStatus: res?.ticket?.status,
          fientaid: res?.ticket?.event_id,
        };
      } else {
        return { remoteStatus: "REMOTE_CHECK_ERROR" };
      }
    });

const useTicket = async (code) => {
  await fienta
    .put(`tickets/${code.value}`, { json: { status: "USED" } })
    .json();
};

export const unUseTicket = async (code) => {
  await fienta
    .put(`tickets/${code.value}`, { json: { status: "UNUSED" } })
    .json();
};

const statuses = {
  UNCHECKED: "",
  CHECKED: "",
  USED: "This ticket has been used already.",
  ERROR: "Ticket checking failed, please try again.",
};

export const checkTicket = (code, event) => {
  const status = ref("UNCHECKED");

  whenever(event, () => {
    if (checkLocalTicketWithoutCode(event)) {
      status.value = "CHECKED";
    }
  });

  watch(
    code,
    () => {
      if (!code.value && event.value) {
        if (checkLocalTicketWithoutCode(event)) {
          status.value = "CHECKED";
        }
      } else if (code.value && event.value) {
        if (checkLocalTicket(code, event)) {
          status.value = "CHECKED";
        } else {
          checkRemoteTicket(code, event)
            .then(({ remoteStatus, fientaid }) => {
              if (fientaid) {
                storeLocalTicket(code, fientaid);
                status.value = "CHECKED";
              }
              // if (remoteStatus === "UNUSED") {
              //   useTicket(code)
              //     .then((_) => {
              //       storeLocalTicket(code, fientaid);
              //       status.value = "CHECKED";
              //     })
              //     .catch((e) => (status.value = "ERROR"));
              // }
              // if (remoteStatus === "USED") {
              //   status.value = "USED";
              // }
              // @TODO Handle REFUND_REQUESTED ?
            })
            .catch((e) => (status.value = "ERROR"));
        }
      }
    },
    { immediate: true }
  );
  const statusMessage = computed(() => statuses[status.value]);
  return { status, statusMessage };
};
