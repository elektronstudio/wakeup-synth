<script setup>
import { ref, onMounted, onBeforeUpdate, provide } from "vue";
import { useRafFn } from "@vueuse/core";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CircleGeometry,
  MeshNormalMaterial,
  Mesh,
  Group,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { deg2rad, range } from "../lib";

const el = ref(null);
const width = 640;
const height = 360;

const interacting = ref(false);

const scene = new Scene();
provide("scene", scene);

const camera = new PerspectiveCamera(75, width / height, 1, 1100);
camera.position.z = 0.000001;

const renderer = new WebGLRenderer();
renderer.setSize(width, height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = true;

controls.addEventListener("start", () => (interacting.value = true));
controls.addEventListener("end", () => (interacting.value = false));

const update = () => {
  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  el.value.append(renderer.domElement);
});

useRafFn(update);
</script>

<template>
  <div ref="el" :style="{ cursor: interacting ? 'grabbing' : 'grab' }">
    <slot />
  </div>
</template>
