<template>
<!-- 接警处详情 -->
  <div class="ReceivePolice">
    <div class="row bt">
      接处警
    </div>
    <div class="pdlf">
      <el-form ref="form" :model="detail" label-width="130px" size="small" label-position="left">
        <el-row>
          <el-col :span="12" class="prt">
            <el-form-item label="报警形式">
              <span>{{detail.BJXS_NAME}}</span>
            </el-form-item>
            <el-form-item label="报警人">
              <span>{{detail.BJR}}</span>
            </el-form-item>
            <el-form-item label="出生日期">
              <span v-if="detail.BJRCSRQ">{{formatTime(detail.BJRCSRQ)}}</span>
            </el-form-item>
            <el-form-item label="国籍">
              <span>{{detail.BJRGJ_NAME}}</span>
            </el-form-item>
            <el-form-item label="户籍地">
              <span :title="detail.BJRHJD">{{detail.BJRHJD}}</span>
            </el-form-item>
            <el-form-item label="是否涉及手机">
              <span>{{detail.WPBH}}</span>
            </el-form-item>
            <el-form-item label="接警人电话">
              <span>{{detail.JJRDH}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接警时间">
              <span v-if="detail.JJSJ">{{formatTime(detail.JJSJ)}}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{detail.BJRXB_NAME}}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{detail.BJRLXDH}}</span>
            </el-form-item>
            <el-form-item label="单位">
              <span :title="detail.BJRDW">{{detail.BJRDW}}</span>
            </el-form-item>
            <el-form-item label="住址">
              <span :title="detail.BJRZZ">{{detail.BJRZZ}}</span>
            </el-form-item>
            <el-form-item label="接警人">
              <span>{{detail.JJR_NAME}}</span>
            </el-form-item>
            <el-form-item label="管辖地">
              <span>{{detail.GXD_NAME}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警内容">
              <span>{{detail.BJNR}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="row bt">
      处警信息
    </div>
    <div class="pdlf">
      <el-form ref="form" :model="detail" label-width="130px" size="small" label-position="left">
        <el-row>
          <el-col :span="12" class="prt">
            <el-form-item label="处警类别">
              <span>{{detail.CJLB_NAME}}</span>
            </el-form-item>
            <el-form-item label="发生地点">
              <span>{{detail.FSDD}}</span>
            </el-form-item>
            <el-form-item label="出警人">
              <span>{{detail.CZHR_NAME}}</span>
            </el-form-item>
            <el-form-item label="处警结果">
              <span>{{detail.CJJG_NAME}}</span>
            </el-form-item>
            <el-form-item label="发生场所">
              <span :title="detail.FSCS_NAME">{{detail.FSCS_NAME}}</span>
            </el-form-item>
            <el-form-item label="发生起始时间">
              <span v-if="detail.FSSJSX">{{formatTime(detail.FSSJSX)}}</span>
            </el-form-item>
            <el-form-item label="出动警力数">
              <span>{{detail.CDJLS}}</span>
            </el-form-item>
            <el-form-item label="出动船只数">
              <span>{{detail.CDCZS}}</span>
            </el-form-item>
            <el-form-item label="挽回损失金额">
              <span>{{detail.WHSSJE}}</span>
            </el-form-item>
            <el-form-item label="救助伤员数">
              <span>{{detail.JZSYS}}</span>
            </el-form-item>
            <el-form-item label="解救儿童数">
              <span>{{detail.JJETS}}</span>
            </el-form-item>
            <el-form-item label="人员死亡数">
              <span>{{detail.RYSWS}}</span>
            </el-form-item>
            <el-form-item label="逃跑人犯数">
              <span>{{detail.TPRFS}}</span>
            </el-form-item>
            <el-form-item label="处警情况">
              <span>{{detail.CJXQ}}</span>
            </el-form-item>
            <el-form-item label="值班领导">
              <span>{{detail.ZBLD_NAME}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否涉外">
              <span>{{detail.SFSW_NAME}}</span>
            </el-form-item>
            <el-form-item label="出警时间">
              <span v-if="detail.CJSJ">{{formatTime(detail.CJSJ)}}</span>
            </el-form-item>
            <el-form-item label="出警单位">
              <span>{{detail.CZHDW_NAME}}</span>
            </el-form-item>
            <el-form-item label="警情名称">
              <span>{{detail.XZ_JQMC}}</span>
            </el-form-item>
            <el-form-item label="到达时间">
              <span v-if="detail.DDXCSJ">{{formatTime(detail.DDXCSJ)}}</span>
            </el-form-item>
            <el-form-item label="发生终止时间">
              <span v-if="detail.FSSJXX">{{formatTime(detail.FSSJXX)}}</span>
            </el-form-item>
            <el-form-item label="出动机动车数">
              <span>{{detail.CDJDCS}}</span>
            </el-form-item>
            <el-form-item label="直接经济损失">
              <span>{{detail.ZJJJSSJE}}</span>
            </el-form-item>
            <el-form-item label="救助群众数">
              <span>{{detail.JZQZS}}</span>
            </el-form-item>
            <el-form-item label="解救妇女数">
              <span>{{detail.JJFNS}}</span>
            </el-form-item>
            <el-form-item label="解救人质数">
              <span>{{detail.JJRZS}}</span>
            </el-form-item>
            <el-form-item label="人员受伤数">
              <span>{{detail.RYSSS}}</span>
            </el-form-item>
            <el-form-item label="留置审查人数">
              <span>{{detail.LZSCRS}}</span>
            </el-form-item>
            <el-form-item label="损失情况">
              <span>{{detail.SSQK}}</span>
            </el-form-item>
            <el-form-item label="审批日期">
              <span v-if="detail.LDPSRQ">{{formatTime(detail.LDPSRQ)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="补充处理结果">
              <span>{{detail.BCCLJG}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['jjcInfo'],
  data() {
    return {
      detail: {},
      AJBH: ''
    }
  },
  methods: {
    formatTime(time) {
      return this.$handlerDateTime(time)
    }
  },
  mounted() {
    if (this.jjcInfo.AJBH) {
      this.detail = this.jjcInfo
    }
  },
  watch: {
    jjcInfo(val) {
      if (val.AJBH) {
        this.detail = val
      }
    }
  }
}
</script>

<style scoped>
.ReceivePolice .row {
  padding: 10px 0;
}
.ReceivePolice .bt {
  font-size: 17px;
  color: #bce8fc;
  font-weight: bold;
  border-bottom: 1px solid #00a0e9;
}
.pdlf {
  padding: 12px 0 0 20px;
}
</style>
