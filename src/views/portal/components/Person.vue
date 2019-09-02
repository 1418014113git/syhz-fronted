<template>
  <div class="Anjian">
    <jobholder-statistics></jobholder-statistics>
    <p class="node1"><span class="textShadow">抓获人数 :</span><span class="num">&nbsp;{{ajlistData.zhrs}}</span><span class="textShadow">人</span></p>
    <p class="node2"><span class="textShadow">刑事拘留 :</span><span class="num">&nbsp;{{ajlistData.xsjl}}</span><span class="textShadow">人</span></p>
    <p class="node3"><span class="textShadow">逮捕 :</span><span class="num">&nbsp;{{ajlistData.dbrs}}</span><span class="textShadow">人</span></p>
    <p class="node4"><span class="textShadow">取保候审 :</span><span class="num">&nbsp;{{ajlistData.qbhs}}</span><span class="textShadow">人</span></p>
  </div>
</template>
<script>
import JobholderStatistics from './jobholderStatistics'
export default {
  props: ['ajlistData'],
  data() {
    return {

    }
  },
  components: {
    JobholderStatistics
  },
  methods: {

  },
  mounted() {

  }
}
</script>
<style rel="stylesheet/scss" lang="scss"  scoped>
.Anjian{
  width: 100%;
  height: 100%;
  background: url('/static/image/portal_newImg/person.png') no-repeat center bottom;
  background-size: 35%;
  margin: 0 auto;
  color: #fff;
  p{
    width: 30%;
    position: absolute;
  }
  .node1{
    left: 17px;
    top: 25%;
    text-align: right;
    padding-right: 4px;
  }
  .node2{
    left:14px;
    bottom: 19.5%;
    text-align: right;
    padding-right: 4px;
  }
  .node3{
    right: 13px;
    top: 13%;
    text-align: left;
    padding-left: 4px;
  }
  .node4{
    right: 16px;
    bottom: 32.5%;
    text-align: left;
  }
  .num{
    font-size: 20px;
    letter-spacing: 4px;
    color: #eab247;
  }
  .textShadow{
    text-shadow: 0 0 5px #fff;
  }
}
@media only screen and (max-width: 1367px) {
  .Anjian{
    font-size: 12px;
    background-size: 46%;
    p{
      width: 30%;
    }
    .num{
      font-size: 15px;
      letter-spacing: 1px;
    }
    .node1{
      left: -14px;
      top: 33.8%;
    }
    .node2{
      left:-14px;
      bottom: 18%;
    }
    .node3{
      right: -15px;
      top: 23%;
    }
    .node4{
      right: -14px;
      bottom: 30%;
    }
  }
}
</style>
