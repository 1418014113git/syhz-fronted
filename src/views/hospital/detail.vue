<template>
  <div class="Detail">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card>
      <el-row class="row">
        <span style="font-weight: bold;font-size: 30px; padding-left: 30px;">{{detailData.HXM}}</span>
        <!-- <el-button type="text" @click="toList" style="float: right;">返回</el-button> -->
      </el-row>
      <el-row class="row">
        <el-col :span="8" :pull="0"><span class="title">机构类型：</span><span class="content">{{detailData.JGBJ}}</span></el-col>
        <el-col :span="8"><span class="title">机构名称：</span><span class="content">{{detailData.JGMC}}</span></el-col>
        <el-col :span="8"><span class="title">地址：</span><span class="content">{{detailData.DZ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">联系方式：</span><span class="content">{{detailData.DHHM}}</span></el-col>
        <el-col :span="8"><span class="title">法人代表：</span><span class="content">{{detailData.FRDB}}</span></el-col>
        <el-col :span="5"><span class="title">单位电子邮箱：</span><span class="content">{{detailData.EMAIL}}</span></el-col>

      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">单位负责人：</span><span class="content">{{detailData.DWFZR}}</span></el-col>
        <el-col :span="8"><span class="title">单位成立时间：</span><span class="content">{{detailData.CLSJ}}</span></el-col>
        <el-col :span="5"><span class="title">单位网站域名：</span><span class="content">{{detailData.WEB}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">行政区划：</span><span class="content">{{detailData.XZQH}}</span></el-col>
        <el-col :span="8"><span class="title">所在村委会名称：</span><span class="content">{{detailData.SZCWHMC}}</span></el-col>
         <el-col :span="5"><span class="title">邮政编码：</span><span class="content">{{detailData.YZBM}}</span></el-col>
      </el-row>
      <div style="height: 100px;"></div>
    </el-card>

  </div>
</template>

<script>
  import {
    getDetailById
  } from '@/api/hospital/hospital'
  export default {
    name: 'Detail',
    data() {
      return {
        bh: '',
        detailData: {}
      }
    },
    methods: {
      getDetail() {
        getDetailById({
          id: this.bh
        }).then((res) => {
          if (res.code === '000000' && res.data) {
            this.detailData = res.data
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/hospital/list/'
        })
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.bh = this.$route.params.id
        this.getDetail()
      }
    }
  }
</script>

<style scoped>
  .Detail {
    width: 90%;
    margin: 0 auto 20px auto;
  }
  .Detail .row {
    padding: 15px 0;
    border-bottom: 1px dashed #e8e8e8;
  }
  .Detail .row span{
    display: inline-block;
  }
  .Detail .title {
    text-align: right;
    width: 160px;
    /* color: #303133; */
  }
  .Detail .content {
    /* color: #606266; */
  }

</style>
