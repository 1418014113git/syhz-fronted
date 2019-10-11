<template>
  <div class="Anjian">
    <!-- <jobholder-statistics></jobholder-statistics> -->
    <p class="node1"><span class="textShadow">破获案件</span>
      <!-- <span class="numStyle" v-for="(item,index) in changeData(ajlistData.zhrs)" :key="index">{{item}}</span> -->
      <span class="numStyle" v-for="(item,index) in changeData(0)" :key="index">{{item}}</span>
    </p>
    <p class="node2"><span class="textShadow">逮捕人数</span>
      <span class="numStyle" v-for="(item,index) in changeData(0)" :key="index">{{item}}</span>
      <!-- <span class="numStyle" v-for="(item,index) in changeData(ajlistData.dbrs)" :key="index">{{item}}</span> -->
    </p>
    <p class="node3"><span class="textShadow">起诉人数</span>
      <span class="numStyle" v-for="(item,index) in changeData(0)" :key="index">{{item}}</span>
      <!-- <span class="numStyle" v-for="(item,index) in changeData(ajlistData.dbrs)" :key="index">{{item}}</span> -->
    </p>
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
    changeData(data) { // 查询从业人员数
      var datas = []
      var springData = data.toString()
      datas = springData.split('')
      return datas
    }

  },
  mounted() {

  }
}
</script>
<style rel="stylesheet/scss" lang="scss"  scoped>
.Anjian {
  width: 100%;
  height: 100%;
  background: url("/static/image/portal_newImg/map.png") no-repeat;
  background-size: 37%;
  background-position: 70% center;
  margin: 0 auto;
  color: #fff;
  text-shadow: 0 0 1px #fff;
  p {
    width: 30%;
    position: absolute;
    text-align: right;
    font-size: 16px;
  }
  .node1 {
    left: -10px;
    top: 16%;
    padding-right: 4px;
  }
  .node2 {
    left: -10px;
    top: 32%;
    padding-right: 4px;
  }
  .node3 {
    left: -10px;
    top: 48%;
    padding-right: 4px;
  }
  .node4 {
    right: -2px;
    bottom: 35%;
    text-align: left;
  }
  .num {
    font-size: 20px;
    letter-spacing: 4px;
    color: #eab247;
  }
  .textShadow {
    text-shadow: 0 0 5px #fff;
  }
   .numStyle{
     display: inline-block;
     padding: 2px 4px;
     background-image: linear-gradient(0deg,rgba(88, 177, 252, 0.5) 0%,rgba(88, 177, 252, 0.5)100%);
     border-radius: 4px;
    //  border: solid 1px rgba(0, 160, 233, 0.6);
      border: solid 2px #21e8ff;
     margin-left: 7px;
   }
}
@media only screen and (max-width: 1367px) {
  .Anjian {
    background-size: 30%;
    .numStyle{
      padding: 0 3px;
    }
  }
}
@media screen and (min-width: 1368px) and (max-width: 1599px) {
  .Anjian {
    background-size: 33%;
  }
}
@media screen and (min-width: 1920px) {
  .Anjian {
    background-size: 31%;
    // .node1 {
    //   left: 10px;
    //   top: 20.5%;
    // }
    // .node2 {
    //   left: 10px;
    //   bottom: 21.6%;
    // }
    // .node3 {
    //   right: 23px;
    //   top: 8%;
    // }
  }
}
</style>
