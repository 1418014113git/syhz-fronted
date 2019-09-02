<template>
  <div class="YyDetail">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card>
      <el-row class="row">
        <span style="font-weight: bold;font-size: 30px; padding-left: 30px;">{{detailData.HZ_XM}}</span>
        <!-- <el-button type="text" @click="toList" style="float: right;">返回</el-button> -->
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">医院编号：</span><span class="content">{{detailData.YYBH}}</span></el-col>
        <el-col :span="8"><span class="title">患者姓名：</span><span class="content">{{detailData.HZ_XM}}</span></el-col>
        <el-col :span="8"><span class="title">患者姓名汉语拼音：</span><span class="content">{{detailData.HZ_XMHYPY}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">患者性别：</span><span class="content">{{detailData.HZ_XB}}</span></el-col>
        <el-col :span="8"><span class="title">患者常用证件名称：</span><span class="content">{{detailData.HZ_CYZJMC}}</span></el-col>
        <el-col :span="8"><span class="title">患者证件号码：</span><span class="content">{{detailData.HZ_ZJHM}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">患者出生日期：</span><span class="content">{{detailData.HZ_CSRQ}}</span></el-col>
        <el-col :span="8"><span class="title">患者联系电话：</span><span class="content">{{detailData.HZ_LXDH}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="18"><span class="title">患者现住址：</span><span class="content">{{detailData.HZ_XZZ_DZMC}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">联系人姓名：</span><span class="content">{{detailData.LXR_XM}}</span></el-col>
        <el-col :span="8"><span class="title">联系人姓名汉语拼音：</span><span class="content">{{detailData.LXR_XMHYPY}}</span></el-col>
        <el-col :span="8"><span class="title">联系人常用证件名称：</span><span class="content">{{detailData.LXR_CYZJMC}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">联系人证件号码：</span><span class="content">{{detailData.LXR_ZJHM}}</span></el-col>
        <el-col :span="8"><span class="title">联系人联系电话：</span><span class="content">{{detailData.LXR_LXDH}}</span></el-col>
        <el-col :span="8"><span class="title">联系人与患者关系：</span><span class="content">{{detailData.LXR_YHZGX_JYQK}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="18"><span class="title">联系人现住址：</span><span class="content">{{detailData.LXR_XZZ_DZMC}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="18"><span class="title">医院单位名称：</span><span class="content">{{detailData.YY_DWMC}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">血型：</span><span class="content">{{detailData.XX}}</span></el-col>
        <el-col :span="8"><span class="title">住院日期：</span><span class="content">{{detailData.ZYRQ}}</span></el-col>
        <el-col :span="8"><span class="title">出院日期：</span><span class="content">{{detailData.CYRQ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24"><span class="title">住院原因：</span><span class="content">{{detailData.ZYYY_JYQK}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24"><span class="title">备注：</span><span class="content">{{detailData.BZ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">导入外键批次号：</span><span class="content">{{detailData.DRFK}}</span></el-col>
        <el-col :span="8"><span class="title">导入时间：</span><span class="content">{{detailData.DRSJ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24"><span class="title">导入主题描述：</span><span class="content">{{detailData.DRZTMS}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">登记时间：</span><span class="content">{{detailData.DJSJ}}</span></el-col>
        <el-col :span="8"><span class="title">登记单位公安机关名称：</span><span class="content">{{detailData.DJDW_GAJGJGDM}}</span></el-col>
        <el-col :span="8"><span class="title">登记人姓名：</span><span class="content">{{detailData.DJR_XM}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">登记人公民身份号码：</span><span class="content">{{detailData.DJR_GMSFHM}}</span></el-col>
        <el-col :span="8"><span class="title">登记人联系电话：</span><span class="content">{{detailData.DJR_LXDH}}</span></el-col>
        <el-col :span="8"><span class="title">信息来源区划：</span><span class="content">{{detailData.XXLYXZQH}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">登记人联系电话：</span><span class="content">{{detailData.DJR_LXDH}}</span></el-col>
        <el-col :span="8"><span class="title">信息来源区划：</span><span class="content">{{detailData.XXLYXZQH}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8"><span class="title">首次信息入库时间：</span><span class="content">{{detailData.SC_XXRKSJ}}</span></el-col>
        <el-col :span="8"><span class="title">信息入库时间：</span><span class="content">{{detailData.XXRKSJ}}</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="6"><span class="title">数据来源：</span>
          <span class="content" v-if="detailData.SYH_SJLY === 0">食药环侦</span>
          <span class="content" v-if="detailData.SYH_SJLY === 1">警综</span>
        </el-col>
      </el-row>
      <div style="height: 100px;"></div>
    </el-card>

  </div>
</template>

<script>
  import {
    getWjwYy
  } from '@/api/xsrcs'
  export default {
    name: 'YyDetail',
    data() {
      return {
        bh: '',
        detailData: {}
      }
    },
    methods: {
      getDetail() {
        getWjwYy({
          id: this.bh
        }).then((res) => {
          if (res.code === '000000' && res.data) {
            this.detailData = res.data
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/wjw/yy/'
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
  .YyDetail {
    width: 90%;
    margin: 20px auto;
  }
  .YyDetail .row {
    padding: 15px 0;
    border-bottom: 1px dashed #00a0e9;
  }
  .YyDetail .row span{
    display: inline-block;
  }
  .YyDetail .title {
    text-align: right;
    width: 160px;
    color: #fff;
  }
  .YyDetail .content {
    color: #fff;
  }

</style>
