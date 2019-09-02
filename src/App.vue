<template>
  <div id="app">
      <navigation>
        <router-view></router-view>
      </navigation>
    <lg-preview></lg-preview>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
@import '../src/styles/font.css';
</style>
