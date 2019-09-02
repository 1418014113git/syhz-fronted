<template>
  <div class="ReceivePolice">
    <div class="row bt">
      接处警
    </div>
    <div>
      <el-row class="row">
        <el-col class="title" :span="4">报警形式：</el-col>
        <el-col :span="6"><span>{{detail.BJXS_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">接警时间：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.JJSJ)}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">报警人：</el-col>
        <el-col :span="6"><span>{{detail.BJR}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">性别：</el-col>
        <el-col :span="6"><span>{{detail.BJRXB_NAME}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">出生日期：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.BJRCSRQ)}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">联系电话：</el-col>
        <el-col :span="6"><span>{{detail.BJRLXDH}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">国籍：</el-col>
        <el-col :span="6"><span>{{detail.BJRGJ_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">单位：</el-col>
        <el-col :span="6"><span>{{detail.BJRDW}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">户籍地：</el-col>
        <el-col :span="6"><span>{{detail.BJRHJD}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">住址：</el-col>
        <el-col :span="6"><span>{{detail.BJRZZ}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">是否涉及手机：</el-col>
        <el-col :span="6"><span>{{detail.WPBH}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">接警人：</el-col>
        <el-col :span="6"><span>{{detail.JJR_NAME}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">接警人电话：</el-col>
        <el-col :span="6"><span>{{detail.JJRDH}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">管辖地：</el-col>
        <el-col :span="6"><span>{{detail.GXD_NAME}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">报警内容：</el-col>
        <el-col :span="20"><span>{{detail.BJNR}}&nbsp;</span></el-col>
      </el-row>
    </div>
    <div class="row bt">
      处警信息
    </div>
    <div>
      <el-row class="row">
        <el-col class="title" :span="4">处警类别：</el-col>
        <el-col :span="6"><span>{{detail.CJLB_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">是否涉外：</el-col>
        <el-col :span="6"><span>{{detail.SFSW_NAME}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">发生地点：</el-col>
        <el-col :span="6"><span>{{detail.FSDD}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">出警时间：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.CJSJ)}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">出警人：</el-col>
        <el-col :span="6"><span>{{detail.CZHR}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">出警单位：</el-col>
        <el-col :span="6"><span>{{detail.CZHDW_NAME}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">处警结果：</el-col>
        <el-col :span="6"><span>{{detail.CJJG_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">警情名称：</el-col>
        <el-col :span="6"><span>{{detail.XZ_JQMC}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">发生场所：</el-col>
        <el-col :span="6"><span>{{detail.FSCS_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">到达时间：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.DDXCSJ)}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">发生起始时间：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.FSSJSX)}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">发生终止时间：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.FSSJXX)}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">出动警力数：</el-col>
        <el-col :span="6"><span>{{detail.CDJLS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">出动机动车数：</el-col>
        <el-col :span="6"><span>{{detail.CDJDCS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">出动船只数：</el-col>
        <el-col :span="6"><span>{{detail.CDCZS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">直接经济损失：</el-col>
        <el-col :span="6"><span>{{detail.ZJJJSSJE}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">挽回损失金额：</el-col>
        <el-col :span="6"><span>{{detail.WHSSJE}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">救助群众数：</el-col>
        <el-col :span="6"><span>{{detail.JZQZS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">救助伤员数：</el-col>
        <el-col :span="6"><span>{{detail.JZSYS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">解救妇女数：</el-col>
        <el-col :span="6"><span>{{detail.JJFNS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">解救儿童数：</el-col>
        <el-col :span="6"><span>{{detail.JJETS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">解救人质数：</el-col>
        <el-col :span="6"><span>{{detail.JJRZS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">人员死亡数：</el-col>
        <el-col :span="6"><span>{{detail.RYSWS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">人员受伤数：</el-col>
        <el-col :span="6"><span>{{detail.RYSSS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">逃跑人犯数：</el-col>
        <el-col :span="6"><span>{{detail.TPRFS}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">留置审查人数：</el-col>
        <el-col :span="6"><span>{{detail.LZSCRS}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">处警情况：</el-col>
        <el-col :span="20"><span>{{detail.CJXQ}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">损失情况：</el-col>
        <el-col :span="20"><span>{{detail.SSQK}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">补充处理结果：</el-col>
        <el-col :span="20"><span>{{detail.BCCLJG}}&nbsp;</span></el-col>
      </el-row>
      <el-row class="row">
        <el-col class="title" :span="4">值班领导：</el-col>
        <el-col :span="6"><span>{{detail.ZBLD_NAME}}&nbsp;</span></el-col>
        <el-col class="title" :span="4">审批日期：</el-col>
        <el-col :span="6"><span>{{formatTime(detail.LDPSRQ)}}&nbsp;</span></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {
    getAJDETAILRECEIVE
  } from '@/api/caseManage'

  export default {
    name: 'ReceivePolice',
    props: ['ajbh'],
    data() {
      return {
        detail: {
        },
        AJBH: ''
      }
    },
    methods: {
      formatTime(time) {
        return this.$handlerDateTime(time)
      },
      getDetail() {
        getAJDETAILRECEIVE({
          AJBH: this.AJBH
        }).then((res) => {
          if (res.code === '000000' && res.data.length > 0) {
            if (res.data[0]) {
              this.detail = res.data[0]
              this.$emit('receive', 1)
            }
          }
        })
      }
    },
    mounted() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
        this.getDetail()
      }
    },
    watch: {
      ajbh(val) {
        this.AJBH = val
        this.getDetail()
      }
    }
  }
</script>

<style scoped>
  .ReceivePolice .title {
    text-align: right;
  }

  .ReceivePolice .row {
    padding: 10px 0;
  }
  .ReceivePolice .bt {
    font-size: 16px;
    font-weight: bold;
    padding-left: 5%;
  }
</style>
