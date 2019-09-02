<template>
  <div class="CaseTrait">
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">选择时机 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.XZSJ_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">选择处所 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.XZCS_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">选择对象 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.XZDX_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">选择物品 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.XZWP_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">作案手段 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.ZASD_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">作案特点 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.ZATD_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">作案工具 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.ZAGJ_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">销赃方式 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.XZFS_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">贩运方式 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.JD_FYFS_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">藏毒方式 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.JD_CDFS_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">专长 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.XZ_ZC_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">活动地区 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.XZ_LCDQFW}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">作案规律 :</el-col>
      <el-col :span="22" style="padding-left: 10px;">{{ajInfo.ZAGL}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">受理单位 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.SLDW_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">操作单位 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.CZDW_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">受理人 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{ajInfo.SLR_NAME}}&nbsp;</el-col>
    </el-row>
    <el-row style="margin:15px">
      <el-col :span="2" style="text-align: right">操作人 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{ajInfo.CZR_NAME}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">受理日期 :</el-col>
      <el-col :span="4" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.SLSJ)}}&nbsp;</el-col>
      <el-col :span="4" style="text-align: right">操作日期 :</el-col>
      <el-col :span="6" style="padding-left: 10px;">{{$handlerDateTime(ajInfo.CZSJ)}}&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'CaseTrait',
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
