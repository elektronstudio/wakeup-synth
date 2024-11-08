<template>
  <div>
    <slot style="clamp(1.5rem, 5vw, 3rem)" />
    <div class="layout-top">
      <flex><slot name="top-left" /></flex>
      <flex><slot name="top-center" /></flex>
      <flex><slot name="top-right" /></flex>
    </div>
    <div class="layout-bottom">
      <flex><slot name="bottom-left" /></flex>
      <flex><slot name="bottom-center" /></flex>
      <flex><slot name="bottom-right" /></flex>
    </div>
  </div>
</template>

<style>
.layout-top {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.layout-bottom {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.layout-top > *,
.layout-bottom > * {
  min-width: 32px;
}
</style>
