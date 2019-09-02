<template>
  <div class="CaseBaseInfo">
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">案件类别1 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.AJLB1_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">案件类别2 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.AJLB2_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">报案人 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.BARXM}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">发案时间 :</el-col>
      <el-col :span="12" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.FASJSX)}}&nbsp;至&nbsp;{{$handlerDateTime(ajInfo.FASJXX)}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">是否单位作案 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.SFDWZA_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">是否有现场 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.SFYXC_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">犯罪主体类型 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.FZZTLX_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">发案单位名称 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.FADWMC}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">作案人数 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.ZARS}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">抓获人员数 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.ZHRYS}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">案件集团人数 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.JTRS}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">作案原因 :</el-col>
      <el-col :span="22" style="padding-left: 10px;">{{ajInfo.ZAYY_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">简要案情 :</el-col>
      <el-col :span="22" style="padding-left: 10px;">{{ajInfo.JYAQ}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:35px 15px 15px">
      <el-col :span="2" style="text-align: right">受理单位 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.SLDW_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">受理人 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.SLR_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">受理时间 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.SLSJ)}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">处置单位 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.CZDW_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">处置人名称 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.CZR_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">处置时间 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.CZSJ)}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">案情综述 :</el-col>
      <el-col :span="22" style="padding-left: 10px;">{{ajInfo.AQZS}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:35px 15px 15px">
      <el-col :span="2" style="text-align: right">破案单位 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.PADW_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">破案类型 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.PALX_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">破案方式 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.PAFS_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">破案日期 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.PARQ}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">破案时间段 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.PASJD}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">破案简况 :</el-col>
      <el-col :span="22" style="padding-left: 10px;">{{ajInfo.PAJK}}&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'CaseBaseInfo',
    props: ['info'],
    data() {
      return {
        ajInfo: {}
      }
    },
    methods: {},
    mounted() {
      if (this.info) {
        this.ajInfo = this.info
      }
    },
    watch: {
      info(val) {
        if (val) {
          this.ajInfo = val
        }
      }
    }
  }
</script>

<style scoped>

</style>
