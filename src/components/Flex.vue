<template>
  <div class="flex"><slot /></div>
</template>

<style>
.flex {
  display: inline-grid;
  gap: 8px;
  grid-auto-flow: column;
  align-items: center;
}
</style>
