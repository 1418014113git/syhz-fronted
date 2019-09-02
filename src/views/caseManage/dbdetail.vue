<template>
  <div class="db_detail">
    <el-card class="db_card">
      <div>
        <el-row style="padding-bottom: 16px;">
          <el-button type="primary" size="mini" v-if="Number(dbInfo.status) >= 5 && $isViewBtn('100810') && showSign" @click="doStateDb(0)" v-loading.fullscreen.lock="doStateLoading">签收</el-button>
          <el-button type="primary" size="mini" @click="doStateDb(1)" v-if="!endReport && Number(dbInfo.status) >5 && Number(dbInfo.status) < 7 && $isViewBtn('100817') && dbInfo.apply_dept_id === String(curDept.id)">上传结案报告</el-button>
          <el-button type="primary" size="mini" @click="showCbDia" v-if="Number(dbInfo.status) >5 && Number(dbInfo.status) < 7 && $isViewBtn('100812') && dbInfo.supervise_exam_dept_id === String(curDept.id)">下发催办</el-button>
          <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
        </el-row>
        <el-card class="db_card" v-loading="basicLoading">
          <div slot="header" class="clearfix">
            <span class="card_title">基本信息</span>
            <!-- <el-button type="primary" size="small"  @click="goBack"  style="float:right;">返回</el-button> -->
          </div>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">督办名称：</el-col>
            <el-col :span="21">{{ dbInfo.db_name}}</el-col>
          </el-row>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">案件名称：</el-col>
            <el-col :span="10">
              <span class="ajbh-color" @click="toAjDetail()">{{ caseInfo.AJMC }}</span>&nbsp;
            </el-col>
            <el-col :span="3" class="col_title">督办级别：</el-col>
            <el-col :span="3">{{formatterLevel(dbInfo.supervise_level)}}&nbsp;</el-col>
            <el-col :span="2" class="col_title">督办状态：</el-col>
            <el-col :span="3">{{filterStateText(dbInfo.status)}}&nbsp;</el-col>
          </el-row>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">申请部门：</el-col>
            <el-col :span="10">{{dbInfo.apply_dept_name}}&nbsp;</el-col>
            <el-col :span="3" class="col_title">申请人：</el-col>
            <el-col :span="3">{{dbInfo.apply_person_name}}&nbsp;</el-col>
            <el-col :span="2" class="col_title">申请时间：</el-col>
            <el-col :span="3">{{dbInfo.create_time}}&nbsp;</el-col>
          </el-row>
          <el-row class="col_row">
            <!--<el-col :span="3" class="col_title">督办部门：</el-col>-->
            <!--<el-col :span="8">{{dbInfo.supervise_dept}}&nbsp;</el-col>-->
            <el-col :span="3" class="col_title">督办负责人：</el-col>
            <el-col :span="10">{{dbInfo.supervise_person}}&nbsp;</el-col>
            <el-col :span="3" class="col_title">负责人联系电话：</el-col>
            <el-col :span="8">{{dbInfo.person_liable_phone}}&nbsp;</el-col>
          </el-row>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">申请原因：</el-col>
            <el-col :span="20">
              {{dbInfo.supervise_desc}}
              &nbsp;</el-col>
          </el-row>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">开始时间：</el-col>
            <el-col :span="7">{{dbInfo.start_date}}&nbsp;</el-col>
            <el-col :span="3" class="col_title">截止时间：</el-col>
            <el-col :span="4">{{dbInfo.end_date}}&nbsp;</el-col>
          </el-row>
          <el-row class="col_row">
            <el-col :span="3" class="col_title">审核部门：</el-col>
            <el-col :span="8">{{dbInfo.supervise_exam_dept}}&nbsp;</el-col>
          </el-row>
        </el-card>
        <el-card class="db_card">
          <div slot="header" class="clearfix">
            <span class="card_title">案件督办审核信息</span>
          </div>
          <div>
            <examine-list :id="dbInfo.id" type="0003"></examine-list>
          </div>
        </el-card>
        <el-card class="db_card" v-if="report.id">
          <div slot="header" class="clearfix">
            <span class="card_title">结案报告</span>
          </div>
          <div>
            <end-tab-info :reportData="report" :curDeptId="curDept.id"></end-tab-info>
          </div>
        </el-card>
        <el-card class="db_card" v-if="report.id">
          <div slot="header" class="clearfix">
            <span class="card_title">督办评价</span>
          </div>
          <div>
            <report-exam-list :id="report.id" :comment="report.comment"></report-exam-list>
          </div>
        </el-card>
        <el-card class="db_card">
          <div slot="header" class="clearfix">
            <span class="card_title">催办信息</span>
          </div>
          <div>
            <urge-tab-info :dbInfoData="dbInfo" :depts="deptArray" ref="urgeChild" v-on:reTimeList="getLastData"></urge-tab-info>
          </div>
        </el-card>
        <el-card class="db_card">
          <div slot="header" class="clearfix">
            <span class="card_title">最新进展</span>
          </div>
          <div style="max-height: 600px; padding-bottom: 50px; overflow-y: auto">
            <time-line-small :caseId="db_id" :type="3" ref="childGetList" style="width: 90%;"></time-line-small>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import timeLineSmall from '../common/timeLineSmall'
import {
  getAJJBXXSYHID
} from '@/api/caseManage'
import {
  getSupervise, getSuperviseReport
} from '@/api/supervise'
import {
  updBusinessSignDB, getBisSignOne
} from '@/api/workSignList'
import {
  getConcernCase, concernCase, cancelConcern
} from '@/api/common'
import {
  getDBLevelText, getAssistStatusText
} from '@/utils/codetotext'
import DBTabInfo from './components/DBTabInfo'
import DBUrgeTabInfo from './components/DBUrgeTabInfo'
import DBEndTabInfo from './components/DBEndTabInfo'
import DBReportExamList from './components/DBReportExamList'
import ExamineList from '../common/ExamineList'

export default {
  name: 'casedb',
  components: {
    'assist-info-tab': DBTabInfo,
    'urge-tab-info': DBUrgeTabInfo,
    'examine-list': ExamineList,
    'end-tab-info': DBEndTabInfo,
    'report-exam-list': DBReportExamList,
    'time-line-small': timeLineSmall
  },
  data() {
    return {
      isConcern: false,
      curUserId: '',
      caseId: '',
      db_id: '',
      bsId: '',
      doStateLoading: false,
      caseInfo: {},
      report: {},
      dbInfo: {},
      curUser: {},
      curDept: {},
      showSign: false,
      deptArray: [],
      endReport: false,
      basicLoading: false // 基本信息loading
    }
  },
  methods: {
    formatterLevel(level) {
      return getDBLevelText(level)
    },
    filterStateText(state) {
      return getAssistStatusText(state)
    },
    ajBaseInfo(id) {
      if (id) {
        getAJJBXXSYHID({ id: id }).then((response) => {
          const data = response.data
          this.caseId = data.id
          this.caseInfo = {
            AJMC: data.AJMC,
            AJBH: data.AJBH,
            AJZT: data.AJZT,
            SAJZ: data.SAJZ,
            AJXZ_NAME: data.AJXZ_NAME,
            AJLB_NAME: data.AJLB_NAME,
            AJZT_NAME: data.AJZT_NAME,
            LARQ: data.LARQ
          }
          this.getConcern()
        })
      }
    },
    detailData() {
      this.basicLoading = true
      const para = {
        id: this.db_id
      }
      getSupervise(para).then((response) => {
        if (response.code === '000000' && response.data) {
          this.basicLoading = false
          const data = response.data
          // this.dbInfo = {
          //   id: this.db_id,
          //   fqr: data.apply_person_name,
          //   fqbm: data.apply_dept_name,
          //   fqsj: data.start_date,
          //   jssj: data.end_date,
          //   dbjb: data.supervise_level,
          //   dbzt: data.status,
          //   dbms: data.supervise_desc,
          //   qszt: data.sign_state,
          //   dbend: data.end_supervise_desc
          // }
          this.dbInfo = response.data
          // if (data.supervise_dept_id && data.supervise_dept) {
          //   const ids = data.supervise_dept_id.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')
          //   const names = data.supervise_dept.split(',')
          //   const array = []
          //   for (let i = 0; i < ids.length; i++) {
          //     array.push({
          //       id: ids[i], name: names[i]
          //     })
          //   }
          //   this.deptArray = array
          // }
          this.deptArray = [{
            id: data.apply_dept_id, name: data.apply_dept_name
          }]
          this.ajBaseInfo(data.case_id)
          if (Number(data.status) >= 5) {
            this.getBisSign(this.db_id)
          }
        }
      }).catch(() => {
        this.basicLoading = false
      })
    },
    doStateDb(type) {
      const req = { id: this.db_id }
      let msg = ''
      if (type === 1) {
        this.$router.push({ path: '/caseManage/dbendreport/' + this.db_id })
        return true
      }
      if (type === 0) {
        req.status = '6'
        msg = '确认要签收吗?'
      }
      if (!this.bsId) {
        return false
      }
      this.$confirm(msg, '提示', {
        type: 'warning'
      }).then(() => {
        updBusinessSignDB({
          id: this.bsId,
          status: 2,
          dbId: this.db_id,
          signUserId: this.curUser.id,
          updateUserId: this.curUser.id,
          bizType: 3,
          action: '签收督办案件',
          bizId: this.db_id,
          userId: this.curUser.id,
          userName: this.curUser.realName
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: '签收成功', type: 'success'
            })
            location.reload()
          }
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    getBisSign(id) {
      getBisSignOne({
        businessTable: 'aj_supervise',
        businessValue: id,
        noticeOrgId: this.curDept.id,
        businessType: 4,
        status: 1
      }).then((res) => {
        if (res.code === '000000' && res.data) {
          if (res.data.length > 0) {
            this.bsId = res.data[0]['id']
            this.showSign = true
          }
        }
      })
    },
    toAjDetail() {
      // this.$router.push({ path: '/caseManage/detailSyh/' + this.caseId })
      this.$router.push({
        path: '/caseFile/index', query: { id: this.caseId }
      })
    },
    saveConcern() {
      if (this.concernId) {
        const flag = this.isConcern ? 0 : 1
        const msg = this.isConcern ? '取消关注' : '关注成功'
        cancelConcern({
          id: this.concernId, enable: flag
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.isConcern = flag
          }
        })
      } else if (!this.concernId && !this.isConcern) {
        concernCase({
          AJBH: this.caseInfo.AJBH, userId: this.curUserId
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: '关注成功',
              type: 'success'
            })
            this.isConcern = true
            this.concernId = res.data
          }
        })
      }
    },
    getConcern() {
      getConcernCase({
        ajbh: this.caseInfo.AJBH, userId: this.curUserId
      }).then((res) => {
        if (res.data && res.data.length > 0) {
          const data = res.data[0]
          if (data['enable'] === 1) {
            this.isConcern = true
          } else {
            this.isConcern = false
          }
          this.concernId = data['id']
        }
      })
    },
    getReport() {
      getSuperviseReport({
        dbId: this.db_id
      }).then((res) => {
        if (res.code === '000000' && res.data && res.data.length > 0) {
          this.report = res.data[0]
          this.endReport = true
        }
      })
    },
    showCbDia() {
      this.$refs.urgeChild.showCbDiaAdd()
    },
    getLastData() {
      const fn = this.$refs.childGetList
      setTimeout(function() {
        fn.getData()
      }, 5000)
    },
    goBack() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curUser) {
      this.curUserId = this.curUser.id
    }
    this.db_id = this.$route.params.id
    this.getReport()
  },
  created() {
    this.db_id = this.$route.params.id
    this.detailData()
  }
}
</script>

<style scoped>
.db_detail .text_c {
  text-align: center;
}

.db_detail .p_htl1 {
  height: 33px;
  text-align: center;
  line-height: 33px;
}

.db_detail .p_htl2 {
  text-align: center;
  height: 40px;
  line-height: 40px;
}

.db_detail .col_row {
  padding: 12px 0;
  border-bottom: 1px dashed #00a0e9;
}
.db_detail .col_title {
  text-align: right;
}

.db_card {
  margin-bottom: 10px;
}
.db_card .card_title {
  font-weight: bold;
}
.db_detail .ajbh-color {
  cursor: pointer;
}

.db_detail .ajbh-color:hover {
  color: #3da1ff;
}
</style>
