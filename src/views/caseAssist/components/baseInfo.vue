<template>
<!-- 基本信息 -->
  <div class="caseAssist_baseInfo pubStyle" v-loading="loading">
    <div class="title">
      <div class="left">基本信息</div>
      <div class="right">
        <el-button type="primary" size="small" v-if="$isViewBtn('100911') && evaluateBtnVisible" @click="evaluate">综合评价</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100901') && applyBtnVisible" @click="reApply">重新申请</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100908') && auditBtnVisible" @click="audit">审核</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100909') && clueDistributeBtnVisible" @click="clueDistribute">线索分发</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100910') && clueFeedbackBtnVisible" @click="clueFeedback">线索反馈</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100907') && signBtnVisible" @click="sign">签收</el-button>
      </div>
    </div>
    <el-row class="baseInfo_content">
      <el-form ref="form" :model="baseInfo" size="small" label-width="115px" label-position="left">
        <el-col :span="8">
          <el-form-item label="标题：" prop="">
            <span class="whiteColor">{{baseInfo.title}}</span>
          </el-form-item>
          <el-form-item label="发起日期：" prop="">
            <span class="whiteColor" v-if="baseInfo.createDate">{{baseInfo.createDate}}</span>
          </el-form-item>
          <el-form-item label="协查级别：" prop="">
            <span class="whiteColor" v-if="baseInfo.assistLevel">{{ formatType(baseInfo.assistLevel) }}</span>
          </el-form-item>
          <el-form-item label="协查编号：" prop="">
            <span class="whiteColor" v-if="baseInfo.assistNumber">{{baseInfo.assistNumber}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发起单位：" prop="">
            <span class="whiteColor">{{baseInfo.applyDeptName}}</span>
          </el-form-item>
          <el-form-item label="发起人：" prop="">
              <span class="whiteColor">{{baseInfo.applyPersonName}}</span>
          </el-form-item>
          <el-form-item label="开始时间：" prop="">
            <span class="whiteColor" v-if="baseInfo.startDate">{{baseInfo.startDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态：" prop="">
            <span v-if="baseInfo.status">{{$getDictName(String(baseInfo.status), 'jqzyzt')}}</span>
          </el-form-item>
          <el-form-item label="发起人电话：" prop="">
            <span class="whiteColor">{{baseInfo.applyPersonPhone}}</span>
          </el-form-item>
          <el-form-item label="结束时间" prop="">
            <span class="whiteColor" v-if="baseInfo.endDate">{{baseInfo.endDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="正文：" prop="">
            <!--<vue-editor ref="child" v-model="baseInfo.assistContent" disabled></vue-editor>-->
            <span v-html="baseInfo.assistContent"></span>
          </el-form-item>
          <el-form-item label="附件：" prop="">
            <div class="data_list">
              <p v-for="(item, index) in baseInfo.attachment" :key="index">
                <a @click="upLoadFile(item)">{{item.name}}</a>&nbsp;&nbsp;&nbsp;
              </p>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="案件名称：" prop="">
            <span class="whiteColor">{{baseInfo.AJMC}}</span>
          </el-form-item>
          <el-form-item label="案件状态：" prop="">
            <span class="whiteColor" v-if="baseInfo.AJZT_NAME">{{baseInfo.AJZT_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="案件编号：" prop="">
            <span class="whiteColor" @click="toCase()" style="text-decoration: underline; cursor: pointer">{{baseInfo.AJBH}}</span>
          </el-form-item>
          <el-form-item label="案件类型：" prop="">
            <span class="whiteColor">{{baseInfo.SYH_AJLB_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="案件类别：" prop="">
            <span v-if="baseInfo.AJLB_NAME">{{baseInfo.AJLB_NAME}}</span>
          </el-form-item>
          <el-form-item label="发案部位：" prop="">
            <span class="whiteColor">{{baseInfo.FABW_NAME}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简要案情：" prop="">
            <span v-html="getReplace(baseInfo.JYAQ)"></span>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 审核弹框-->
    <el-dialog title="审核" :visible.sync="auditDialogVisible"  class="auditForm" :close-on-click-modal="false">
      <audit-com ref="auditCom" @closeDialog="closeAuditDialog" :assistId="curAssistId" :info="baseInfo" :row="curRow"></audit-com>
    </el-dialog>

    <!-- 分发线索-->
    <el-dialog title="分发线索" :visible.sync="clueDialogVisible"  class="ffxsForm" :close-on-click-modal="false">
      <distributeClue :isShowDialog="clueDialogVisible" @closeDialog="closeClueDialog" :id="curAssistId" :xcstatus="baseInfo.status" source="detail"></distributeClue>
    </el-dialog>
  </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import auditCom from './auditCom' // 审核弹框dialogBtnUpLine
import distributeClue from './distributeClue' // 分发线索
import {
  getAssistLevelText, getAssistStatusText
} from '@/utils/codetotext'

export default {
  props: ['assistId', 'info', 'signBtnVisibleH', 'evaluateBtnVisibleH'],
  name: 'baseInfo',
  data() {
    return {
      baseInfo: {}, // 基础信息
      curRow: {}, // 审核列表当前行的审核按钮显示时，将当前行数据传递过来
      curUser: JSON.parse(sessionStorage.getItem('userInfo')), // sessionStorage获取用户信息
      applyBtnVisible: false, // 是否显示申请按钮
      auditBtnVisible: false, // 是否显示审核按钮
      clueDistributeBtnVisible: false,
      clueFeedbackBtnVisible: false,
      signBtnVisible: false,
      evaluateBtnVisible: false,
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      loading: false, // 页面加载进度条
      auditDialogVisible: false, // 是否显示审核弹框
      clueDialogVisible: false, // 是否显示分发线索弹出框
      curAssistId: '' // 存储列表传递过来的id
    }
  },
  components: {
    auditCom,
    distributeClue,
    VueEditor
  },
  filters: {
    formatDate(value) {
      if (value) {
        var val = value.substring(0, 4) + '.' + parseInt(value.substring(4, 6)) + '.' + parseInt(value.substr(6))
      }
      return val
    }
  },
  watch: {
    'signBtnVisibleH': function(val) {
      this.signBtnVisible = val
    },
    'evaluateBtnVisibleH': function(val) {
      this.evaluateBtnVisible = val
    }
  },
  methods: {
    setSignBtnVisibleH(val) {
      this.signBtnVisible = val
    },
    setEvaluateBtnVisibleH(val) {
      this.evaluateBtnVisible = val
    },
    getReplace(data) {
      if (data) {
        var item = data.split('/r/n').join('\r\n')
        return item
      }
    },
    toCase() {
      this.$router.push({ path: '/caseFile/index', query: { id: this.baseInfo.id }})
    },
    setBaseInfo(baseInfo) {
      this.baseInfo = baseInfo
      const curDate = new Date(this.baseInfo.systemTime)
      const startDate = new Date(this.baseInfo.startDate)
      if ((String(this.baseInfo.status) === '1' || String(this.baseInfo.status) === '2') && String(this.baseInfo.category) === '2') {
        if (String(this.baseInfo.status) === '2' && this.curDept.depType === '2') {
          this.auditBtnVisible = false
        } else {
          if (this.baseInfo.auditDeptCode === this.curDept.depCode || String(this.curDept.depType) === '1') {
            this.auditBtnVisible = true
          }
        }
      }
      if (String(this.baseInfo.status) === '3') {
        if (this.baseInfo.applyDeptCode === this.curDept.depCode) {
          this.applyBtnVisible = true
        }
      }
      if ((String(this.info.status) === '5' || String(this.info.status) === '6' || String(this.info.status) === '7') && curDate > startDate) {
        if (String(this.curDept.depType) === '2') {
          this.clueDistributeBtnVisible = true
          this.clueFeedbackBtnVisible = true
        }
        if (String(this.curDept.depType) === '3') {
          this.clueFeedbackBtnVisible = true
        }
        // if (String(this.baseInfo.category) === '2') {
        //   if (this.baseInfo.auditDeptCode === this.curDept.depCode) {
        //     this.evaluateBtnVisible = this.evaluateBtnVisibleH
        //   }
        // }
        // if (String(this.baseInfo.category) === '3') {
        //   if (this.baseInfo.applyDeptCode === this.curDept.depCode) {
        //     this.evaluateBtnVisible = this.evaluateBtnVisibleH
        //   }
        // }
      }
      if ((String(this.curDept.depType) === '1' || (String(this.curDept.depType) === '2' && this.curDept.areaCode !== '611400' && this.curDept.areaCode !== '616200'))) {
        this.evaluateBtnVisible = this.evaluateBtnVisibleH
      }
      if (String(this.baseInfo.status) === '4') {
        this.signBtnVisible = this.signBtnVisibleH
      }
    },
    evaluate() { // 综合评价
      if (this.curDept.depType === '1') {
        this.$store.dispatch('Personeltotop', 'feedbackInfo')
      }
      if (this.curDept.depType === '2') {
        this.$store.dispatch('Personeltotop', 'feedbackInfo_area')
      }
    },
    reApply() { // 重新申请
      this.$router.push({ path: '/caseAssist/edit', query: { type: 'reApply', category: '2', id: this.assistId }})
    },
    audit() { // 审核
      this.$store.dispatch('Personeltotop', 'auditInfo')
    },
    clueDistribute() { // 线索分发
      this.$store.dispatch('Personeltotop', 'feedbackInfo')
    },
    clueFeedback() { // 线索反馈
      this.$store.dispatch('Personeltotop', 'feedbackInfo')
    },
    sign() { // 签收
      this.$store.dispatch('Personeltotop', 'signInfo')
    },
    upLoadFile(item) { // 下载附件
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    closeAuditDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      this.auditDialogVisible = val
      location.reload()
    },
    closeClueDialog(val) { // 关闭分发线索弹框
      this.clueDialogVisible = val
      location.reload()
    },
    formatStatus(status) {
      return getAssistStatusText(status)
    },
    formatType(assistLevel) {
      return getAssistLevelText(String(assistLevel))
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
  }
}
</script>
<style>
.caseAssist_baseInfo {
  width: 100%;
}
.caseAssist_baseInfo .el-form-item__label {
  color: #bce8fc;
  text-shadow: 0 0 1px #fff;
}
.caseAssist_baseInfo .title {
  width: 100%;
  padding: 7px 0 7px 7px;
  border-bottom: 2px solid #00a0e9;
  overflow: hidden;
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  font-size: 17px;
}
.caseAssist_baseInfo .title .left {
  float: left;
  letter-spacing: 3px;
}
.caseAssist_baseInfo .cardcom {
  position: absolute;
  bottom: 1px;
  left: 318px;
}
.caseAssist_baseInfo .ffxsForm .el-dialog {
  width: 80%;
  height: 80vh;
  overflow: auto;
}
.caseAssist_baseInfo .data_list {
  padding: 0 10px 0 0;
}
.caseAssist_baseInfo .data_list > p {
  display: inline-block;
  width: 100%;
}
.caseAssist_baseInfo .data_list > p a:first-child {
  float: left;
  text-decoration: underline;
  cursor: pointer;
}
.caseAssist_baseInfo .whiteColor {
  color: #fff;
}
.caseAssist_baseInfo .beyondTextClass {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.caseAssist_baseInfo .baseInfo_content {
  padding: 18px 0 0 45px;
}
.caseAssist_baseInfo .fjlink {
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  text-decoration: underline;
  cursor: pointer;
}
.caseAssist_baseInfo .fjlink:hover {
  text-decoration: underline;
}
.caseAssist_baseInfo .auditForm .el-dialog {
  width: 40%;
}
.caseAssist_baseInfo .auditForm .el-form {
  padding: 10px 20px;
}
.caseAssist_baseInfo .quillWrapper {
  background: none;
}
.caseAssist_baseInfo .quillWrapper .ql-snow.ql-toolbar {
  display: none;
}
.caseAssist_baseInfo .ql-container.ql-snow.ql-disabled {
  border: none !important;
}
@media only screen and (max-width: 1367px) {
  .caseAssist_baseInfo .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>

