export const config = {
  streamUrl: import.meta.env.VITE_STREAM_URL || "",
  streamTranscodeUrl: import.meta.env.VITE_STREAM_TRANSCODE_URL || "",
  streamTranscodeKeyIn: import.meta.env.VITE_STREAM_TRANSCODE_KEY_IN || "",
  streamTranscodeKeyOut: import.meta.env.VITE_STREAM_TRANSCODE_KEY_OUT || "",
  eventsUrl1: import.meta.env.VITE_EVENTS_URL_1 || "",
  eventsUrl2: import.meta.env.VITE_EVENTS_URL_2 || "",
  eventsUrl3: import.meta.env.VITE_EVENTS_URL_3 || "",
  eventsUrl4: import.meta.env.VITE_EVENTS_URL_4 || "",
  pagesUrl: import.meta.env.VITE_PAGES_URL || "",
  wsUrl: import.meta.env.VITE_WS_URL || "",
  messagesUrl: import.meta.env.VITE_MESSAGES_URL || "",
  corsUrl: import.meta.env.VITE_CORS_URL || "${url}",
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL || "",
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || "",
  twitterUrl: import.meta.env.VITE_TWITTER_URL || "",
  youtubeUrl: import.meta.env.VITE_YOUTUBE_URL || "",
  emailUrl: import.meta.env.VITE_EMAIL_URL || "",
  phoneUrl: import.meta.env.VITE_PHONE_URL || "",
  newFeatures: import.meta.env.VITE_NEW_FEATURES === "true" || false,
  fientaUrl: import.meta.env.VITE_FIENTA_URL || "",
  fientaPublicUrl: import.meta.env.VITE_FIENTA_PUBLIC_URL || "",
  fientaTicketUrl: import.meta.env.VITE_FIENTA_TICKET_URL || "",
  fientaToken: import.meta.env.VITE_FIENTA_TOKEN || "",
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || "localhost",
  strapiUrl: import.meta.env.VITE_STRAPI_URL || "",
  // @TODO:remove these two
  theme: import.meta.env.VITE_THEME || 0,
  userUpdateRate: 10 * 30 * 1000, // was 30 * 1000
  userUpdatedSinceLimit: 10 * 30 * 1000, // was 30 * 1000
  messageDelay: 150, // was 50
  navItems: [
    {
      name: "eˉlektron",
      path: "",
    },
    {
      name: "Lavastused",
      path: "",
    },
    {
      name: "Festivalid",
      path: "",
    },
    {
      name: "Projektid",
      path: "",
    },
    {
      name: "Kava",
      path: "",
    },
    {
      name: "Meist",
      path: "",
    },
    {
      name: "En",
      path: "",
    },
    {
      name: "Live",
      path: "",
    },
  ],
};
