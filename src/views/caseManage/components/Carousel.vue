<template>
  <el-carousel :interval="5000" trigger="click" indicator-position="outside">
    <el-carousel-item v-for="(n, nindex) in data" :key="nindex">
      <ul class="case_carousel_ul">
        <li v-for="(data,index) in carouselData" :key="index" v-if="split * nindex <= index && index < n * split" class="case_carousel_li">
          <span class="img">
            <img :src="data.img" width="100" height="100"/>
            <p>申请协查</p>
          </span>
          <span class="content">
            <p>{{ data.name }}</p>
            <p>{{ data.idCard }}</p>
            <p>{{ data.state }}</p>
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
        data: 0,
        carouselData: [
          { id: '1', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: '' },
          { id: '2', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: '' },
          { id: '3', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: '' },
          { id: '4', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: '' },
          { id: '5', name: '内蒙古公司', idCard: '678675198909083452', state: '已加入黑名单', remark: '3条违法记录', img: '' }
        ]
      }
    },
    props: {
      split: {
        type: Number,
        default: 2
      }
    },
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
  }
  .case_carousel_ul .case_carousel_li{
    list-style: none;
    display: inline-block;
    float: left;
    background-color: #f1f1f1;
    margin-left: 18px;
    padding: 10px 15px;
  }
  .case_carousel_ul .case_carousel_li:first-child{
    margin-left: 0;
  }
  .case_carousel_ul .case_carousel_li span{
    float: left;
  }
  .case_carousel_ul .case_carousel_li span.btn{
    float: right;
  }
  .case_carousel_ul .case_carousel_li span.img{
    margin-right: 10px;
  }
  .case_carousel_ul .case_carousel_li span.content p{
    height: 30px;
    line-height: 30px;
  }
  .b_color_F56C6C{
    background-color: #F56C6C;
  }
  .b_color_409EFF{
    background-color: #409EFF;
  }
  .f_color_E6A23C{
    color: #E6A23C;
  }
</style>
