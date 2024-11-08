<template>
  <h1 class="desktop">eˉl<br />ek<br />tr<br />on</h1>
  <h1 class="mobile">eˉ</h1>
</template>

<style scoped>
.desktop {
  display: block;
  font-size: 100px;
  line-height: 0.75em;
  font-weight: 700;
}
.mobile {
  display: none;
  font-size: 220px;
  line-height: 0.8em;
  text-align: center;
}

@media (max-width: 800px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
}
</style>
