import { computed } from "vue";
import {
  compareDesc,
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatDistanceStrict,
} from "date-fns";

import { useNow } from "@vueuse/core";

import { sentencecase } from "./";

const { now } = useNow({ options: 1000 });

//const now = ref(new Date());

export const timezoneShortname = (date) => {
  let dateString = date + "",
    tz =
      dateString.match(/\(([^\)]+)\)$/) ||
      dateString.match(/([A-Z]+) [\d]{4}$/);

  if (tz) {
    tz = tz[1].match(/[A-Z]/g).join("");
  }

  if (!tz && /(GMT\W*\d{4})/.test(dateString)) {
    return RegExp.$1;
  }

  return tz;
};

export const createDate = (dateStr, timeStr = "00:00", tz = "+03:00") =>
  new Date(`${dateStr}T${timeStr}:00.000${tz}`);

const isDatetime = (str) => String(str).match(/:/g);

export const formatDate = (str, fromTime = true) => {
  if (fromTime) {
    return `${format(new Date(str), "d. MMMM y HH:mm")} ${timezoneShortname(
      now.value
    )}`;
  } else {
    return format(new Date(str), "d. MMM y");
  }
};

export const sortEvents = (a, b) =>
  compareDesc(new Date(b.start_at), new Date(a.start_at));

const dateRangeUrgency = (fromDatetime, toDatetime) =>
  computed(() => {
    const soonMinutes = 3 * 60;
    const started = differenceInMinutes(fromDatetime, now.value);
    const ended = differenceInMinutes(toDatetime, now.value);
    if (started < 0 && ended >= 0) {
      return "now";
    } else if (started >= 0 && started <= soonMinutes) {
      return "soon";
    } else if (started >= 0 && started > soonMinutes) {
      return "future";
    } else {
      return "past";
    }
  });

export const getDiff = (event) => {
  const { fromdate, fromtime, todate, totime } = event;

  const fromDate = fromdate;
  const fromTime = fromtime.trim() ? fromtime : "00:00";
  const toDate = todate.trim() ? todate : fromDate;
  const toTime = totime.trim() ? totime : "24:00";

  const fromDatetime = createDate(
    fromDate,
    fromTime,
    event.tz === "CEST" ? "+02:00" : "+03:00"
  );
  const formattedFromDatetime = formatDate(fromDatetime);

  const toDatetime = createDate(
    toDate,
    toTime,
    event.tz === "CEST" ? "+02:00" : "+03:00"
  );

  const formattedToDatetime = formatDate(toDatetime);

  const formatDistance = (datetime, urgency = null) =>
    computed(() => {
      // @TODO support start and end times
      const distance = sentencecase(
        formatDistanceStrict(datetime, now.value, {
          roundingMethod: "ceil",
          addSuffix: true,
        })
      );
      return urgency.value === "now" ? `Started ${distance}` : distance;
    });

  const urgency = dateRangeUrgency(fromDatetime, toDatetime);

  const formattedDistance = formatDistance(fromDatetime, urgency);

  return {
    fromDatetime,
    toDatetime,
    formattedFromDatetime,
    formattedToDatetime,
    urgency,
    formattedDistance,
  };
};
