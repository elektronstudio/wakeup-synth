import { ref } from 'vue';

import { intervalToDuration } from 'date-fns';

export const useCountdown = (initialDate) => {
  const duration = ref([]);

  const formatDuration = (duration) => {
    const durationMap = {
      months: "m",
      days: "d",
      hours: "h",
      minutes: "m",
      seconds: "s",
    };
    const formattedDuration = Object.entries(duration)
      .map(([key, value]) =>
        durationMap[key] ? `${value}${durationMap[key]}` : null
      )
      .filter((value) => value);
    return formattedDuration;
  };

  const updateDuration = () =>
    (duration.value = formatDuration(
      intervalToDuration({
        start: new Date(initialDate),
        end: new Date(),
      })
    ));

  updateDuration();
  setInterval(updateDuration, 1000);

  return duration;
};
