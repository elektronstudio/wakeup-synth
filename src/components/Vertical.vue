<template>
  <div class="vertical">
    <slot />
  </div>
</template>

<style>
.vertical {
  display: grid;
  gap: 16px;
  grid-auto-rows: min-content;
}
.vertical > * {
  justify-self: flex-start;
}
</style>
