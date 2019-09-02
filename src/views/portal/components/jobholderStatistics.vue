<template>
<div class="personStatistic">
  <p class="cyTotal">
    <span class="text">从业人员</span>
    <span class="numStyle" v-for="(item,index) in data1" :key="index">{{item}}</span>
  </p>
  <p class="hcTotal">
    <span class="text">核查人数</span>
    <span class="numStyle" v-for="(item,index) in data2" :key="index" >{{item}}</span>
  </p>
</div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        data1: [], // 从业人员数
        data2: [] // 核查人员数
      }
    },
    methods: {
      init() { // 查询从业人员数
        this.$query('personphonecount', {}).then((response) => {
          if (response.data !== null) {
            this.changeData(response.data[0].toCount, 0)
            this.changeData(response.data[0].phoneCount, 1)
          }
        })
      },
      changeData(data, type) { // 查询从业人员数
        var springData = data.toString()
        if (type === 0) {
          this.data1 = springData.split('')
        } else {
          this.data2 = springData.split('')
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 .personStatistic{
  //  max-width: 75%;
   margin: 0 auto;
   color: #fff;
   text-shadow: 0 0 5px #fff;
   overflow: hidden;
   .text{
     margin-right: 5px;
   }
   .cyTotal,.hcTotal{
     float: left;
     margin-left: 100px;
   }
   .numStyle{
     display: inline-block;
     padding: 2px 5px;
     background-image: linear-gradient(0deg,rgba(88, 177, 252, 0.6) 0%,rgba(255, 255, 255, 0)100%);
     border-radius: 4px;
     border: solid 1px rgba(0, 160, 233, 0.6);
     margin-right: 3px;
   }
  }
  @media only screen and (max-width: 1367px) {
    .personStatistic{
      .numStyle{
        padding: 0 4px;
        margin-right: 2px;
      }
      .cyTotal,.hcTotal{
        margin-left: 30px;
      }
    }
  }
</style>
