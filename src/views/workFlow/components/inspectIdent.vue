<template>
  <div class="localAssist">
    <el-row class="row">
      <el-col :span="4" class="title">主送机构：</el-col>
      <el-col :span="19" class="cont">{{detail.organizationName}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">案件：</el-col>
      <el-col :span="10" class="cont">{{detail.caseName}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">送检人：</el-col>
      <el-col :span="4" class="cont">{{detail.copyPerson}}</el-col>
      <el-col :span="3" class="title">送检单位：</el-col>
      <el-col :span="6" class="cont">{{detail.applyDeptName}}</el-col>
      <el-col :span="2" class="title">联系电话：</el-col>
      <el-col :span="2" class="cont">{{detail.copyPersonPhone}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">公安厅联系人：</el-col>
      <el-col :span="4" class="cont">{{detail.cellPersonName}}</el-col>
      <el-col :span="3" class="title">联络电话：</el-col>
      <el-col :span="6" class="cont">{{detail.cellPersonPhone}}</el-col>
      <el-col :span="2" class="title">有效期：</el-col>
      <el-col :span="2" class="cont">{{detail.dayNum}} 天</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">检材名称：</el-col>
      <el-col :span="10" class="cont">{{detail.checkName}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">送检要求：</el-col>
      <el-col :span="18" class="cont">{{detail.checkReason}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="title">附件：</el-col>
      <el-col :span="18" class="cont">
        <div v-for="(item,index) in imgs" :key="index">
          <el-button type="text" v-if="item.name.indexOf('.jpg')>0||item.name.indexOf('.png')>0||item.name.indexOf('.gif')>0"
                     v-preview="item.path" preview-title-enable="true" preview-nav-enable="true">{{item.name}}</el-button>
          <el-button type="text" v-else @click="downFile(item.path)">{{item.name}}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getAssistLevelText
  } from '@/utils/codetotext'
  export default {
    name: 'localAssist',
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
      formatType(assistType) {
        return getAssistLevelText(assistType)
      }
    },
    mounted() {
    },
    watch: {
      detail(val) {
        if (val.attachment) {
          this.imgs = JSON.parse(this.detail.attachment)
        }
      }
    }
  }
</script>

<style scoped>
  .localAssist .row {
    margin: 1px 10px;
  }

  .localAssist .title {
    text-align: right;
    color: #FFFFFF;
    padding: 10px 0;

  }

  .localAssist .cont {
    color: #FFFFFF;
    padding: 10px 0 10px 10px;
  }

</style>
