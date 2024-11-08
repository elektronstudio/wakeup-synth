<template>
  <div class="button-small"><slot /></div>
</template>

<style>
.button-small {
  display: inline-grid;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  padding: 0 16px;
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  font-weight: bold;
  height: 24px;
  background: none;
  outline: none;
  text-decoration: none;
  line-height: 0;
  cursor: pointer;
  border: 2px solid var(--fg);
  background: var(--bg);
  color: var(--fg);
}
.button-mediumsmall:hover {
  background: var(--bglighter);
}
</style>
