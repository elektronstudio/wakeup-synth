import "./app.css";
import "elektro/style.css";

import { createApp, defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import { getStrapi } from "./lib";

const components = import.meta.glob("./components/*.vue");
const routes = [
  {
    path: "/",
    component: () => import(`./pages/Synth.vue`),
  },
  {
    path: "/admin",
    component: () => import(`./pages/Admin.vue`),
  },
  {
    path: "/synth",
    component: () => import(`./pages/Synth.vue`),
  },
  {
    path: "/fienta",
    component: () => import(`./pages/Fienta.vue`),
  },
  {
    path: "/signal",
    component: () => import(`./pages/Signal.vue`),
  },
  {
    path: "/stream/:streamkey",
    component: () => import(`./pages/Stream.vue`),
  },
  {
    path: "/private/:event_slug",
    component: () => import(`./pages/Private.vue`),
  },
  {
    path: "/page/:page_slug",
    component: () => import(`./pages/Page.vue`),
  },
  {
    path: "/:festival_slug/:event_slug",
    component: () => import(`./pages/Event.vue`),
  },
  {
    path: "/:festival_slug",
    component: () => import(`./pages/Festival.vue`),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from) => {
  getStrapi();
  return true;
});
const app = createApp(App);

app.use(router);

Object.entries(components).forEach(([path, component]) => {
  const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
  app.component(name, defineAsyncComponent(component));
});

app.mount("#app");
