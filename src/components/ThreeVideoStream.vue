<script setup>
import { inject, defineProps } from "vue";
import { SphereGeometry, MeshBasicMaterial, Mesh, VideoTexture } from "three";
import { deg2rad } from "../lib";

const props = defineProps(["video"]);

const scene = inject("scene");

const geometry = new SphereGeometry(100, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
// to avoid x-flipping of the video texture
geometry.scale(-1, 1, 1);

const texture = new VideoTexture(props.video);
const material = new MeshBasicMaterial({
  map: texture,
});

const mesh = new Mesh(geometry, material);
mesh.rotation.y = deg2rad(-90);
scene.add(mesh);
</script>

<template><slot /></template>
