<template>
  <div class="supervise">
    <el-row class="row">
      <el-col :span="4" class="title">申请人：</el-col>
      <el-col :span="4" class="cont">{{detail.apply_person_name}}</el-col>
      <el-col :span="4" class="title">申请部门：</el-col>
      <el-col :span="10" class="cont">{{detail.apply_dept_name}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">督办级别：</el-col>
      <el-col :span="4" class="cont">
        {{formatText(detail.supervise_level)}}
      </el-col>
      <el-col :span="4" class="title">发起时间：</el-col>
      <el-col :span="10" class="cont">{{detail.create_time}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">申请内容：</el-col>
      <el-col :span="18" class="cont">{{detail.supervise_desc}}</el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getDBLevelText
  } from '@/utils/codetotext'
  export default {
    name: 'supervise',
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
      },
      formatText(level) {
        return getDBLevelText(level)
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
  .supervise .row {
    margin: 1px 10px;
  }

  .supervise .title {
    text-align: right;
    color: #fff;
    padding: 10px 0;

  }

  .supervise .cont {
    color: #fff;
    padding: 10px 0 10px 10px;
    word-break: break-all;
  }

  .supervise .img {
    margin: 10px;
    vertical-align: top;
    display: inline-block;
    width: 100px;
    height: 120px;
    cursor: pointer;
  }

  .supervise .img_file {
    width: 100px;
    height: 120px;
    padding: 3px;
    border: 1px solid #cccccc;
  }
</style>
