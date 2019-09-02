<!--首页右侧在线帮助浮层-->
<template>
  <div class="right-wrap">
    <div class="right-fixed">
      <div @click="clickHovList">
        <p class="help">在线帮助</p>
      </div>
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    clickHovList() {
      this.$router.push({ path: '/learn/index' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/vars.scss';
.right-wrap{
  position: fixed;
  top:50%;
  right: 0;
  z-index: 999;
  .right-fixed {
    width: 38px;
    background: $color-primary;
    color: #fff;
    text-align: center;
    font-size: 16px;
    border-radius: 3px;
    cursor: pointer;
    div{
      padding: 4px 0;
      &:hover{
        color: #00a0e9
      }
    }
  }
  .help {
    width: 16px;
    margin: 0 auto;
    line-height: 24px;
  }
}
</style>
