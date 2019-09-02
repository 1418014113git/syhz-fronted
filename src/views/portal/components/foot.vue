<template>
<div class="footer">
  <div class="footerText">
    <p>
      <span>版权所有：</span>
      <img src="/static/image/portal_newImg/bqsy.png" alt="">
      <span>&nbsp;陕西省公安厅环食药侦总队</span>
    </p>
    <p>
      <span>技术支持：</span>
      <img src="/static/image/portal_newImg/jszc.png" alt="">
      <span>&nbsp;西安未来国际信息股份有限公司</span>
    </p>
  </div>
</div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {}
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 .footer{
    width: 100%;
    height: 60px;
    background: url('/static/image/portal_newImg/footbg.png') no-repeat center center;
    background-size: 97% 17px;
    // position: absolute;
    // left: 0;
    // bottom: 0;
    display: flex;
    .footerText {
      width: 45%;
      height: 60px;
      line-height: 60px;
      margin: 0 auto;
      text-align:center;
      display: flex;
      justify-content: space-around;
      color: #bce8fc;
      text-shadow:0 0 5px #fff;
      img{
        width: 26px;
      }
    }
  }
</style>
