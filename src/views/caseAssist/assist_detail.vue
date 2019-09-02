<template>
  <div>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div class="db_detail">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card" style="height: 500px;">
          <el-row>
            <el-col :span="16" class="card_title">
              <span style="margin-right:50px;">协查案件信息</span>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="mini" v-if="Number(assist.status) >= 5 && showQsBtn && $isViewBtn('100910') && bsId" @click="doStateDb(0)"
                         v-loading.fullscreen.lock="doStateLoading">签收
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="10" class="text_c">状态</el-col>
            <el-col :span="10" class="text_c">协查级别</el-col>
          </el-row>
          <el-row>
            <el-col :span="10" class="text_c">
              <span v-if="assist.status === 1">待审核</span>
              {{formatStatus(assist.status)}}
            </el-col>
            <el-col :span="10" class="text_c">
              {{formatType(assist.assistType)}}
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col>任务案件</el-col>
          </el-row>
          <el-row style="margin-top: 10px;" type="flex" justify="center">
            <el-col class="text_c" style="font-size: 18px;">
              <el-button type="text" @click="toAjDetail()" style="font-size: 18px;" :title="caseInfo.AJMC" class="ellipsis-word">{{ caseInfo.AJMC }}</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;" type="flex" justify="center">
            <el-col class="text_c" style="font-size: 18px;">
              <el-button type="text" @click="toAjDetail()" style="font-size: 18px;">{{ caseInfo.AJBH }}</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;" type="flex" justify="center">
            <el-col :span="6">
              <p class="p_htl1">
                <el-button v-if="!isConcern" type="warning" icon="el-icon-star-off" circle
                           @click="saveConcern"></el-button>
                <el-button v-else type="success" icon="el-icon-star-off" circle @click="saveConcern"></el-button>
              </p>
              <p v-if="!isConcern" class="p_htl2">关注</p>
              <p v-else class="p_htl2">已关注</p>
            </el-col>
            <el-col :span="6">
              <p class="p_htl1">状态</p>
              <p class="p_htl2">{{caseInfo.AJZT_NAME}}</p>
            </el-col>
            <el-col :span="6">
              <p class="p_htl1">涉案价值 </p>
              <p class="p_htl2">¥ {{ caseInfo.SAJZ }}</p>
            </el-col>
          </el-row>
          <el-row style="border:1px solid #CCC; padding:0 10px;">
            <el-row style="margin-top: 10px;">
              <el-col :span="6"></el-col>
              <el-col :span="10">案件类型:{{ caseInfo.AJXZ_NAME}}</el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="6">案件类别:</el-col>
              <el-col :span="16">{{ caseInfo.AJLB_NAME }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-col :span="6">立案日期:</el-col>
              <el-col :span="16">{{ $handlerDateTime(caseInfo.LARQ) }}</el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card" style="height: 500px;">
          <div>
            <p class="card_title"><span style="margin-right:50px;">最新进展</span><span>{{ caseInfo.AJMC }}</span></p>
            <time-line-small :caseId="assist_id" :type="5" style=" max-height: 420px; overflow-y: auto; padding: 0 50px 50px;"></time-line-small>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col style="min-height: 200px; margin-bottom: 50px;">
        <el-tabs type="border-card">
          <el-tab-pane label="协查信息">
            <assist-info :assistInfoData="assist"></assist-info>
          </el-tab-pane>
          <el-tab-pane label="反馈信息">
            <feed-back :id="assist.id" :assistDepts="assistDepts" :state="assist.status" :bs-id="bsId"></feed-back>
          </el-tab-pane>
          <el-tab-pane label="审核信息">
            <examine-list :id="assist.id" type="0005"></examine-list>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
  </div>
</template>

<script>
import {
  getConcernCase, concernCase, cancelConcern
} from '@/api/common'
import timeLineSmall from '../common/timeLineSmall'
import AssistInfoTab from './components/assistInfoTab'
import ExamineList from '../common/ExamineList'
import feedBack from './components/feedBack'
import {
  getAssistCase
} from '@/api/assistCase'
import {
  getAJJBXXSYHID
} from '@/api/caseManage'
import {
  getAssistLevelText, getAssistStatusText
} from '@/utils/codetotext'
import {
  updBusinessSignAssist, getBisSignOne
} from '@/api/workSignList'

export default {
  name: 'casedb',
  data() {
    return {
      caseId: '',
      assist_id: '',
      doStateLoading: false,
      assist: {},
      caseInfo: {},
      curUserId: '',
      isConcern: false,
      concernId: '',
      bsId: '',
      curUser: {},
      curDept: {},
      showQsBtn: false,
      assistDepts: ''
    }
  },
  components: {
    'time-line-small': timeLineSmall,
    'assist-info': AssistInfoTab,
    'examine-list': ExamineList,
    'feed-back': feedBack
  },
  methods: {
    formatStatus(status) {
      return getAssistStatusText(status)
    },
    formatType(assistType) {
      return getAssistLevelText(assistType)
    },
    ajBaseInfo(id) {
      if (id) {
        getAJJBXXSYHID({ id: id }).then((response) => {
          const data = response.data
          if (data) {
            this.caseInfo = {
              AJMC: data.AJMC,
              AJBH: data.AJBH,
              AJZT_NAME: data.AJZT_NAME,
              SAJZ: data.SAJZ,
              SYH_FLLB: data.SYH_FLLB,
              AJLB_NAME: data.AJLB_NAME,
              LARQ: data.LARQ
            }
            this.getConcern()
          }
        })
      }
    },
    assistInfo() {
      if (this.assist_id) {
        const para = {
          id: this.assist_id
        }
        getAssistCase(para).then((response) => {
          if (response.data) {
            this.assist = response.data
            if (response.data.attachement) {
              this.assist.attachement = JSON.parse(response.data.attachement)
            }
            this.caseId = response.data.caseId
            this.ajBaseInfo(response.data.caseId)
            if (this.assist.assistDeptId.indexOf('[' + this.curDept.id + ']') > -1) {
              this.showQsBtn = true
            }
            if (this.assist.assistDeptId) {
              this.assistDepts = this.assist.assistDeptId
            }
          }
        })
      }
    },
    doStateDb(type) {
      const req = {
        id: this.assist_id
      }
      let msg = ''
      if (type === 0) {
        req.status = 6
        msg = '确认要签收吗?'
      }
      if (!this.bsId) {
        return false
      }
      this.$confirm(msg, '提示', {
        type: 'warning'
      }).then(() => {
        updBusinessSignAssist({
          id: this.bsId,
          status: 2,
          localInegId: this.assist_id,
          signUserId: this.curUser.id,
          updateUserId: this.curUser.id,
          bizType: 5,
          action: '签收案件协查',
          bizId: this.assist_id,
          userId: this.curUser.id,
          userName: this.curUser.realName
        }).then((res) => {
          if (res.code === '000000') {
            this.$message({
              message: '签收成功',
              type: 'success'
            })
            location.reload()
          }
        }).catch(() => {
          this.doStateLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    getBisSign(id) {
      getBisSignOne({
        businessValue: id,
        businessTable: 'aj_local_investigation', noticeOrgId: this.curDept.id, businessType: 6, status: 1
      }).then((res) => {
        if (res.code === '000000' && res.data) {
          if (res.data.length > 0) {
            this.bsId = res.data[0]['id']
          }
        }
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
    toAjDetail() {
      // this.$router.push({ path: '/caseManage/detailSyh/' + this.caseId })
      this.$router.push({
        path: '/caseFile/index', query: { id: this.caseId }
      })
    },
    toback() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curUser && this.curDept) {
      this.curUserId = this.curUser.id
      this.getBisSign(this.assist_id)
    }
  },
  created() {
    this.assist_id = this.$route.params.id
    this.assistInfo()
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

.db_detail .box-card {
  margin: 2px 2px 0 2px;
}

.db_detail .box-card .card_title {
  display: inline-block;
  height: 40px;
  line-height: 45px;
}
</style>
