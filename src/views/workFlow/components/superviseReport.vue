<template>
  <div class="superviseReport">
    <el-row class="row">
      <el-col :span="4" class="title">上报人员：</el-col>
      <el-col :span="4" class="cont">{{detail.createUserName}}</el-col>
      <el-col :span="4" class="title">上报部门：</el-col>
      <el-col :span="10" class="cont">{{detail.createDeptName}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">结案报告标题：</el-col>
      <el-col :span="4" class="cont">
        {{detail.title}}
      </el-col>
      <el-col :span="4" class="title">上报时间：</el-col>
      <el-col :span="10" class="cont">{{detail.createTime}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">结案报告：</el-col>
      <el-col :span="18" class="cont" v-html="detail.content"></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'superviseReport',
    props: [
      'detail'
    ],
    components: {},
    data() {
      return {
        imgs: []
      }
    },
    methods: {
      downFile(path) {
        window.open(path)
      }
    },
    mounted() {
    },
    watch: {
      detail(val) {
        // if (this.detail.attachement) {
        //   this.imgs = JSON.parse(this.detail.attachement)
        // }
      }
    }
  }
</script>

<style scoped>
  .superviseReport .row {
    margin: 1px 10px;
  }

  .superviseReport .title {
    text-align: right;
    color: #fff;
    padding: 10px 0;

  }

  .superviseReport .cont {
    color: #fff;
    padding: 10px 0 10px 10px;
    word-break: break-all;
  }

  .superviseReport .img {
    margin: 10px;
    vertical-align: top;
    display: inline-block;
    width: 100px;
    height: 120px;
    cursor: pointer;
  }

  .superviseReport .img_file {
    width: 100px;
    height: 120px;
    padding: 3px;
    border: 1px solid #cccccc;
  }
</style>
