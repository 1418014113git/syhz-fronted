<template>
<div>
  <img src="@/assets/icon/back.png"  class="goBacks" @click="toList">   <!--返回-->
   <div class="XsDetail">
    <el-card v-loading="loading">
      <el-row class="row">
        <span style="font-weight: bold;font-size: 30px; padding-left: 30px;">{{detailData.HXM}}</span>
        <!-- <el-button type="text" @click="toList" style="float: right;">返回</el-button> -->
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">出生医学证明编号：</span><span class="content">{{detailData.CSYYZMBH}}</span></el-col>
        <el-col :span="8"><span class="title">新生儿性别：</span><span class="content">{{detailData.HXB}}</span></el-col>
        <el-col :span="8"><span class="title">签发类型：</span><span class="content">{{detailData.QFXL}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">出生日期：</span><span class="content">{{detailData.HCSRQ}}</span></el-col>
        <el-col :span="5"><span class="title">出生孕周：</span><span class="content">{{detailData.HXZ}}</span></el-col>
        <el-col :span="5"><span class="title">出生体重：</span><span class="content">{{detailData.HTZ}}</span></el-col>
        <el-col :span="5"><span class="title">出生身长：</span><span class="content">{{detailData.HSC}}</span></el-col>
      </el-row>
      <el-row class="row">

        <el-col :span="12"><span class="title">出生地点：</span><span class="content">{{detailData.HCSDD}}</span></el-col>
        <el-col :span="12"><span class="title">医疗机构名称：</span><span class="content">{{detailData.YLJG}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12"><span class="title">签发日期：</span><span class="content">{{detailData.QFRQ}}</span></el-col>
        <el-col :span="12"><span class="title">签发机构名称：</span><span class="content">{{detailData.QFJG}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6"><span class="title">母亲姓名：</span><span class="content">{{detailData.MXM}}</span></el-col>
        <el-col :span="6"><span class="title">母亲年龄：</span><span class="content">{{detailData.MNL}}</span></el-col>
        <el-col :span="6"><span class="title">母亲国籍：</span><span class="content">{{detailData.MGJ}}</span></el-col>
        <el-col :span="6"><span class="title">母亲民族：</span><span class="content">{{detailData.MMZ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6"><span class="title">父亲姓名：</span><span class="content">{{detailData.FXM}}</span></el-col>
        <el-col :span="6"><span class="title">父亲年龄：</span><span class="content">{{detailData.FNL}}</span></el-col>
        <el-col :span="6"><span class="title">父亲国籍：</span><span class="content">{{detailData.FGJ}}</span></el-col>
        <el-col :span="6"><span class="title">父亲民族：</span><span class="content">{{detailData.FMZ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12"><span class="title">母亲有效身证件类型：</span><span class="content">{{detailData.MZJLX}}</span></el-col>
        <el-col :span="12"><span class="title">母亲有效身证件号码：</span><span class="content">{{detailData.MZJHM}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="20"><span class="title">母亲住址：</span><span class="content">{{detailData.MZZ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12"><span class="title">父亲有效身证件类型：</span><span class="content">{{detailData.FZJLX}}</span></el-col>
        <el-col :span="12"><span class="title">父亲有效身证件号码：</span><span class="content">{{detailData.FZJHM}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="20"><span class="title">父亲住址：</span><span class="content">{{detailData.FZZ}}</span></el-col>
      </el-row>
      <el-row class="row" v-if="detailData.YCSZBH">
        <el-col :span="12"><span class="title">原出生证明编号：</span><span class="content">{{detailData.YCSZBH}}</span></el-col>
      </el-row>
      <el-row class="row" v-if="detailData.ZFRQ">
        <el-col :span="8"><span class="title">作废日期：</span><span class="content">{{detailData.ZFRQ}}</span></el-col>
        <el-col :span="8"><span class="title">作废原因：</span><span class="content">{{detailData.ZZFYY}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12"><span class="title">数据来源：</span>
          <span class="content" v-if="detailData.SYH_SJLY === 0">食药环侦</span>
          <span class="content" v-if="detailData.SYH_SJLY === 1">警综</span>
        </el-col>
      </el-row>
      <div style="height: 100px;"></div>
    </el-card>
  </div>
</div>
</template>

<script>
  import {
    getWjwXs
  } from '@/api/xsrcs'
  export default {
    name: 'XsDetail',
    data() {
      return {
        bh: '',
        detailData: {},
        loading: false
      }
    },
    methods: {
      getDetail() {
        this.loading = true
        getWjwXs({
          id: this.bh
        }).then((res) => {
          this.loading = false
          if (res.code === '000000' && res.data) {
            this.detailData = res.data
          }
        }).catch(() => {
          this.loading = false
        })
      },
      toList() {
        this.$router.push({
          path: '/wjw/xs/'
        })
      }
    },
    // mounted() {
    //   if (this.$route.params.id) {
    //     this.bh = this.$route.params.id
    //     this.getDetail()
    //   }
    // }
    activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.detailData = {}
      if (this.$route.params.id) {
        this.bh = this.$route.params.id
        this.getDetail()
      }
    }
  }
</script>

<style scoped>
.XsDetail {
	width: 90%;
	margin: 38px auto 20px auto;
}
.XsDetail .row {
	padding: 15px 0;
	border-bottom: 1px dashed #e8e8e8;
}
.XsDetail .row span {
	display: inline-block;
}
.XsDetail .title {
	text-align: right;
	width: 160px;
	/* color: #bbbbbb; */
}
.goBacks {
  float: right;
  margin: -40px 90px 0 0;
  cursor: pointer;
}
</style>
