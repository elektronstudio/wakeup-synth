<template>
  <div class="button-big"><slot /></div>
</template>

<style>
.button-big {
  display: inline-grid;
  place-items: center;
  border-radius: 100px;
  padding: 0 32px;
  font-family: "Nunito Sans", sans-serif;
  font-size: 16px;
  line-height: 1.25;
  font-weight: bold;
  height: 48px;
  background: none;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid var(--fg);
  background: var(--bg);
  color: var(--fg);
  text-align: center;
}
@media (max-width: 800px) {
  .button-big {
    height: auto;
    padding: 16px 24px;
  }
}
</style>
