<template>
  <el-col :span="colSpan">
    <el-card class="cont-card">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <Carousel v-if="content == 'Carousel'" :split="split"></Carousel>
    </el-card>
  </el-col>

</template>

<script>
  import Carousel from './Carousel'
  export default {
    components: {
      Carousel
    },
    name: 'Card',
    props: {
      colSpan: {
        type: Number,
        default: 8
      },
      split: {
        type: Number,
        default: 2
      },
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .cont-card {
    margin: 2px;
  }
</style>
