<template>
  <el-carousel :interval="5000" trigger="click" indicator-position="outside" class="cal">
    <el-carousel-item v-for="(n, nindex) in data" :key="nindex">
      <ul class="case_carousel_ul">
        <li v-for="(data,index) in carouselData" :key="index" v-if="split * nindex <= index && index < n * split" class="case_carousel_li">
          <span class="img">
            <img :src="data.img" width="100" height="100"/>
            <p><a class="btn">申请协查</a></p>
          </span>
          <span class="content">
            <p>{{ data.name }}</p>
            <p>{{ data.idCard }}</p>
            <p class="f_color_red">{{ data.state }}</p>
            <p>{{ data.remark }}</p>
          </span>
        </li>
      </ul>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
  export default {
    name: 'Carousel',
    data() {
      return {
        data: 0
      }
    },
    props: [
      'carouselData',
      'split'
    ],
    methods: {
      getLen() {
        const s = parseInt(this.carouselData.length / this.split)
        const y = this.carouselData.length % this.split === 0 ? 0 : 1
        this.data = s + y
      }
    },
    mounted() {
      this.getLen()
    }
  }
</script>

<style scoped>
  .case_carousel_ul, .case_carousel_ul p{
    padding: 0;
    margin: 0;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
  }
  .case_carousel_ul .case_carousel_li{
    list-style: none;
    display: inline-block;
    float: left;
    background-color: #fbfbfb;
    margin-left: 18px;
    padding: 10px 15px;
  }
  .case_carousel_ul .case_carousel_li:first-child{
    margin-left: 0;
  }
  .case_carousel_ul .case_carousel_li span{
    float: left;
  }
  .case_carousel_ul .case_carousel_li span.img{
    margin-right: 10px;
  }
  .case_carousel_ul .case_carousel_li span.content p{
    height: 30px;
    line-height: 30px;
    text-align: left;
  }
  .f_color_red{
    color: #f12b36;
  }
  .btn{
    color: #1b75ba;
  }
  .btn:before{
    content: '\270e';
  }
</style>
