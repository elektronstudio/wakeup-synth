import {
  isRef,
  onMounted,
  onUnmounted,
  ref,
  watch,
  computed,
  unref,
} from "vue";

import { debug, replace, config, split } from ".";

import Hls from "hls.js";

export const useVideoStream = (src) => {
  const retryDelay = 3000;

  const videoRef = ref(null);
  const videoSrc = isRef(src) ? src : ref(src);

  const status = ref("nodata");
  const width = ref(640);
  const height = ref(360);

  let hls = null;
  let timeout = null;

  watch(
    [videoRef, videoSrc],
    () => {
      if (videoRef.value) {
        if (videoRef.value.canPlayType("application/vnd.apple.mpegURL")) {
          playSafariHls();
        } else {
          if (Hls.isSupported()) {
            playHls();
          }
        }
      }
    },
    { immediate: true }
  );

  const playSafariHls = () => {
    videoRef.value.src = videoSrc.value;

    let prevEnd = 0;
    setInterval(() => {
      if (videoRef.value.seekable.length >= 1) {
        const currentEnd = videoRef.value.seekable.end(0);
        //console.log(prevEnd, currentEnd);
        if (prevEnd === currentEnd) {
          videoRef.value.src = videoSrc.value;
          videoRef.value.play();
        }
        prevEnd = currentEnd;
      }
    }, 10000);

    // setInterval(() => {
    //   videoRef.value.src = videoSrc.value;
    // }, 2000);

    /*
    timeout = setInterval(() => {
      videoRef.value.src = src;
    }, retryDelay);

    videoRef.value.addEventListener("loadeddata", (e) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });

    videoRef.value.addEventListener("waiting", (e) => {
      status.value = "loading";
      timeout = setInterval(() => {
        videoRef.value.src = videoSrc.value;
      }, retryDelay);
    });
    */
  };

  const playHls = () => {
    hls = new Hls({
      debug: debug.value,
      manifestLoadingRetryDelay: retryDelay,
      manifestLoadingMaxRetry: Infinity,
      xhrSetup: function (xhr) {
        xhr.addEventListener("error", (e) => {
          hls.loadSource(videoSrc.value);
          hls.startLoad();
          if (videoRef.value) {
            videoRef.value.play();
          }
        });
      },
    });

    hls.attachMedia(videoRef.value);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(videoSrc.value);
      hls.startLoad();
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      hls.recoverMediaError();
      if (data.type !== Hls.ErrorTypes.MEDIA_ERROR) {
        hls.startLoad();
      }
    });

    let prevEnd = 0;
    setInterval(() => {
      if (videoRef.value.seekable.length >= 1) {
        const currentEnd = videoRef.value.seekable.end(0);
        //console.log(prevEnd, currentEnd);
        if (prevEnd === currentEnd) {
          hls.loadSource(videoSrc.value);
          hls.startLoad();
          if (videoRef.value) {
            videoRef.value.play();
          }
        }
        prevEnd = currentEnd;
      }
    }, 10000);
  };

  onMounted(() => {
    const statuses =
      "abort canplay canplaythrough durationchange emptied encrypted ended interruptbegin interruptend loadeddata loadedmetadata loadstart mozaudioavailable pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      );

    statuses.forEach((s) => {
      videoRef.value.addEventListener(s, (e) => {
        //console.log(s.toUpperCase());
      });
    });

    videoRef.value.addEventListener("loadeddata", (e) => {
      status.value = "loading";
      width.value =
        videoRef.value?.videoWidth > 0 ? videoRef.value?.videoWidth : -1;
      height.value =
        videoRef.value?.videoHeight > 0 ? videoRef.value?.videoHeight : -1;
    });

    videoRef.value.addEventListener("playing", (e) => {
      status.value = "playing";
      width.value =
        videoRef.value?.videoWidth > 0 ? videoRef.value?.videoWidth : -1;
      height.value =
        videoRef.value?.videoHeight > 0 ? videoRef.value?.videoHeight : -1;
    });

    // videoRef.value.addEventListener("emptied", (e) => {
    //   status.value = "nodata";
    // });

    videoRef.value.addEventListener("ended", (e) => {
      status.value = "nodata";
    });
  });

  onUnmounted(() => {
    if (hls) {
      hls.destroy();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  return { videoRef, status, width, height };
};

const formatStreamkey = (streamkey = "") => {
  return streamkey === config.streamTranscodeKeyIn
    ? config.streamTranscodeKeyOut
    : streamkey;
};

export const formatStreamUrl = (streamkey = "") => {
  if (streamkey.endsWith("m3u8")) {
    return streamkey;
  } else if (streamkey === config.streamTranscodeKeyIn) {
    return replace(config.streamTranscodeUrl, {
      streamkey: config.streamTranscodeKeyOut,
    });
  } else {
    return replace(config.streamUrl, { streamkey });
  }
};

export const parseStreamkey = (streamkey = "") => {
  const streamkeys = split(streamkey);
  const streamurls = streamkeys.map(formatStreamUrl);
  return { streamkeys: streamkeys.map(formatStreamkey), streamurls };
};
