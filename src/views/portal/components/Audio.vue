<template>
  <div class="cardTop">
    <div class="leftarea">
      <img class="audio" src="@/assets/portal_images/audio.png" alt="">
      <span class="audiotext">呼和浩特三氯氰胺案件</span>
    </div>
    <img class="input" src="@/assets/portal_images/portal_input.png" alt="">
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
.cardTop{
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -40px;
  .leftarea{
    padding-left: 4px;
    .audio{
      width: 19px;
      height: 16px;
    }
    .audiotext{
      font-size: 14px;
      color: #444c63;
    }
  }
  .input{
    width: 260px;
    height: 31px;
  }
}
</style>
