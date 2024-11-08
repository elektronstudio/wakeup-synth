import {
  computed,
  onMounted,
  ref,
} from 'vue';

import {
  createMessage,
  fit,
  safeJsonParse,
  userId,
  useSetInterval,
  ws,
} from './';

const imageWidth = 100;
const imageHeight = 100;
const imageQuality = 0.8;
const imageUpdateFrequency = 1000;

export const useImages = (channel) => {
  const videoRef = ref(null);
  const canvasRef = ref(null);
  const context = ref(null);
  const image = ref(null);
  const images = ref({});
  const imagesLength = computed(() => Object.entries(images.value).length);
  const videoStarted = ref(false);

  onMounted(() => {
    if (videoRef.value && canvasRef.value) {
      context.value = canvasRef.value.getContext("2d");
      videoRef.value.addEventListener("loadedmetadata", ({ srcElement }) => {
        canvasRef.value.width = imageWidth;
        canvasRef.value.height = imageHeight;
      });
    }
  });

  const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { frameRate: 1000 / imageUpdateFrequency } })
        .then((stream) => (videoRef.value.srcObject = stream))
        .catch((e) => console.log(e));
    }
  };

  const stopVideo = () => {
    videoRef.value.srcObject.getTracks().forEach((track) => track.stop());
    delete images.value[userId.value];
  };

  ws.addEventListener("message", ({ data }) => {
    const incomingMessage = safeJsonParse(data);
    if (
      incomingMessage &&
      incomingMessage.channel === channel &&
      incomingMessage.type === "IMAGE"
    ) {
      images.value[incomingMessage.userId] = incomingMessage;
    }
  });

  const sendImageMessage = () => {
    const { x, y, width, height } = fit(
      imageWidth,
      imageHeight,
      videoRef.value.videoWidth,
      videoRef.value.videoHeight
    );
    context.value.drawImage(videoRef.value, x, y, width, height);

    const buffer = new Uint32Array(
      context.value.getImageData(
        0,
        0,
        canvasRef.value.width,
        canvasRef.value.width
      ).data.buffer
    );

    const outgoingMessage = createMessage({
      channel,
      type: "USER",
      value: { image: canvasRef.value.toDataURL("image/jpeg", imageQuality) },
    });
    if (buffer.some((color) => color !== 0)) {
      ws.send(outgoingMessage);
    }
  };

  const images2 = computed(() =>
    Object.values(images.value).sort((a, b) => a.userId > b.userId)
  );

  const sendImageMessages = () => {
    // @TODO images2.count
    useSetInterval(sendImageMessage, imageUpdateFrequency);
  };

  const onStart = () => {
    startVideo();
    sendImageMessages();
    videoStarted.value = true;
  };

  const onStop = () => {
    stopVideo();
    videoStarted.value = false;
    window.removeEventListener("beforeunload", onStop);
  };

  window.addEventListener("beforeunload", onStop);

  return {
    videoRef,
    canvasRef,
    sendImageMessage,
    image,
    images,
    imagesLength,
    videoStarted,
    onStart,
    onStop,
    images2,
    sendImageMessages,
  };
};
