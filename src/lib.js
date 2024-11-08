import { createApp } from "vue";

export * from "vue";
export * from "./lib/index.js";

import "./app.css";

const components = import.meta.globEager("./components/*.vue");

export const createElektronApp = (appComponent = {}) => {
  const app = createApp(appComponent);
  Object.entries(components).forEach(([path, component]) => {
    const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
    app.component(name, component.default);
  });
  return app;
};
