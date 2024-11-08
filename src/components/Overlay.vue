<template>
  <div class="overlay">
    <div>
      <slot />
    </div>
  </div>
</template>

<style>
.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--overlay);
  padding: 24px;
}
.overlay > div {
  display: grid;
  gap: 16px;
  text-align: center;
  justify-content: center;
}
.overlay > div > * {
  justify-self: center;
}
</style>
