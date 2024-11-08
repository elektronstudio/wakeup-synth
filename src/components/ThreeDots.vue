<script setup>
import { inject } from "vue";
import { CircleGeometry, MeshNormalMaterial, Mesh, Group } from "three";
import { range, deg2rad } from "../lib";

const scene = inject("scene");

range(0, 360, 90).forEach((angle) => {
  const geometry = new CircleGeometry(5, 16);
  const material = new MeshNormalMaterial();
  const cube = new Mesh(geometry, material);
  cube.position.z = -99;
  const group = new Group();
  group.add(cube);
  group.rotation.y = deg2rad(angle);
  scene.add(group);
});
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template></template>
