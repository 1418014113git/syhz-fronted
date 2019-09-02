<template>
<div>
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <div class="examine" v-loading="listLoading">
    <el-card>
      <div slot="header" class="clearfix">
        <span>详情</span>
      </div>
      <div>
        <inspect-ident v-if="type==='0006'" :detail="detail"></inspect-ident>
        <local-assist v-if="type==='0005'" :detail="detail"></local-assist>
        <country-assist v-if="type==='0004'" :detail="detail"></country-assist>
        <supervise v-if="type==='0003'" :detail="detail"></supervise>
        <supervise-report v-if="type==='0008'" :detail="detail"></supervise-report>
        <nows-apply v-if="type === '0009'" :detail="detail"></nows-apply>
      </div>
    </el-card>
    <el-card style="margin-top: 10px;">
      <div slot="header" class="clearfix">
        <span>审核</span>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :model="examine" size="small" ref="form" :rules="rules" label-width="120px">
            <el-form-item label="审核人：">
              {{examine.userName}}
            </el-form-item>
            <el-form-item label="审核部门：">
              {{examine.deptName}}
            </el-form-item>
            <el-form-item label="审核意见：">
              <div v-if="formDisable">
                <el-tag type="success" v-if="examine.status==='pass'">通过</el-tag>
                <el-tag type="warning" v-if="examine.status==='reject'">驳回</el-tag>
                <el-tag v-if="examine.status==='continue'">向上级申请</el-tag>
              </div>
              <el-radio-group v-model="examine.status" size="small" @change="typeChange" v-if="!formDisable">
                <el-radio label="pass" border>通过</el-radio>
                <el-radio label="reject" border>驳回</el-radio>
                <el-radio label="continue" border v-if="type !== '0006' && type !== '0008' && type !== '0003' && type !== '0009'">向上级申请</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="examine.status==='reject'" label="驳回原因：">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model="examine.content"
                :disabled="formDisable"
                maxlength="240"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item v-show="examine.status==='pass' && type === '0008'" label="领导批示：">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model="examine.comment"
                :disabled="formDisable"
                maxlength="400"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item v-show="examine.status==='continue'" label="上级部门：">
              <el-select v-model="examine.acpDept" placeholder="请选择" class="input_w" clearable>
                <el-option v-for="item in depData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="type==='0005'" label="级别：">
              {{formatType(detail.assistType)}}
            </el-form-item>
            <el-form-item v-if="(type==='0005' || type === '0003') && examine.status==='pass'" label="开始日期：" :disabled="formDisable">
              <el-date-picker v-model="examine.startTime" type="datetime"
                placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                :disabled="formDisable" @change="startChange" clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="(type==='0005' || type === '0003') && examine.status==='pass'" label="截止日期：" :disabled="formDisable">
              <el-date-picker v-model="examine.endTime" type="datetime"
                placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                :disabled="formDisable" @change="endChange" clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button v-if="!formDisable && $isViewBtn('121002')" type="primary" size="small" v-on:click="onSubmit()">提交</el-button>
              <el-button v-if="!formDisable" size="small" @click="cancel">取消</el-button>
              <!-- <el-button v-if="formDisable" size="small" @click="cancel">返回</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</div>
</template>

<script>
import LocalAssist from './components/localAssist'
import Supervise from './components/supervise'
import CountryAssist from './components/countryAssist'
import InspectIdent from './components/inspectIdent'
import SuperviseReport from './components/superviseReport'
import NowsApply from './components/nowsApply' // 无文书申请待办
import {
  getDetailForExamine, workExaminePass, workExamineReject, workExamineContinue
} from '@/api/workflow'
import {
  getSessionDeptSelect
} from '@/api/depts'
import {
  getParentDeptArray
} from '@/api/dept'
import {
  getAssistLevelText
} from '@/utils/codetotext'

export default {
  name: 'examine',
  components: {
    LocalAssist, Supervise, CountryAssist, InspectIdent, SuperviseReport, NowsApply
  },
  data() {
    return {
      type: '',
      wfId: '',
      wdId: '',
      detail: {},
      currentDep: {},
      examine: {
        userId: '',
        userName: '',
        deptId: '',
        deptName: '',
        content: '',
        startTime: '',
        endTime: '',
        status: '',
        acpDept: '',
        id: '',
        type: '',
        comment: ''
      },
      rules: {
        contentRules: [{
          required: false, trigger: 'blur', message: ''
        }],
        statusRules: [{
          required: false, trigger: 'change', message: '请选择处理方式'
        }],
        startTimeRules: [{
          required: false, trigger: 'change', message: '请选择开始时间'
        }],
        endTimeRules: [{
          required: false, trigger: 'change', message: '请选择截止时间'
        }]
      },
      formDisable: false,
      depData: [],
      listLoading: false,
      hideParentDept: false
    }
  },
  methods: {
    formatType(assistType) {
      return getAssistLevelText(assistType)
    },
    typeChange(val) {
      if (val === 'pass' && this.type === '0003') {
        this.detail.assistType = '4' // 字段无意义只为用户修改时 计算7天
        this.examine.startTime = this.addDate(new Date(), 0, '')
        this.examine.endTime = this.addDate(new Date(), 7, '')
      }
    },
    onSubmit() {
      this.timelineParams()
      if (this.examine.status === '') {
        this.$message({
          message: '请选择处理方式', type: 'warning'
        })
        return false
      }
      if (!this.examine.id && this.type !== '0009') {
        return false
      }
      if (this.examine.status === 'pass') {
        this.listLoading = true
        workExaminePass(this.examine).then((res) => {
          this.toResult(res)
        })
      }
      if (this.examine.status === 'reject') {
        if (!this.examine.content) {
          this.$message({
            message: '请输入驳回理由', type: 'warning'
          })
          return false
        }
        this.listLoading = true
        workExamineReject(this.examine).then((res) => {
          this.toResult(res)
        })
      }
      if (this.examine.status === 'continue') {
        if (!this.examine.acpDept) {
          this.$message({
            message: '请选择上级部门', type: 'warning'
          })
          return false
        }
        this.listLoading = true
        workExamineContinue(this.examine).then((res) => {
          this.toResult(res)
        })
      }
    },
    toResult(res) {
      if (res.code === '000000') {
        this.listLoading = false
        this.$message({
          message: '提交成功', type: 'success'
        })
        this.cancel()
      }
    },
    cancel() {
      // this.examine.content = ''
      // this.examine.startTime = ''
      // this.examine.endTime = ''
      // this.examine.status = ''
      // this.$refs['form'].resetFields()
      this.$router.push({
        path: '/workflow/index/' + this.type
      })
    },
    timelineParams() {
      if (this.type === '0008') {
        this.examine.businessId = this.detail.dbId
      } else {
        this.examine.businessId = this.examine.id
      }
      this.examine.serverType = this.type
    },
    getDetail() {
      const para = {
        id: this.wfId
      }
      this.listLoading = true
      getDetailForExamine(para).then((response) => {
        this.listLoading = false
        if (response.data) {
          this.detail = response.data
          this.examine.type = this.detail.type
          this.examine.id = this.detail.id
          this.examine.flowId = this.wfId
          this.examine.wdId = this.detail.flow.wd_id
          if (this.detail.flow.wd_flow_status !== '1') {
            this.formDisable = true
          } else {
            this.formDisable = false
          }
          if (this.detail.startTime) {
            this.examine.startTime = this.detail.startTime
          }
          if (this.detail.endTime) {
            this.examine.endTime = this.detail.endTime
          }
          if (this.detail.flow.content) {
            this.examine.content = this.detail.flow.content
          }
          if (this.detail.comment) {
            this.examine.comment = this.detail.comment
          }
          if (this.detail.flow.wd_flow_status) {
            if (this.detail.flow.wd_flow_status === '4') {
              this.examine.status = 'reject'
            } else if (this.detail.flow.wd_flow_status === '3') {
              this.examine.status = 'pass'
            } else if (this.detail.flow.wd_flow_status === '6') {
              this.examine.status = 'continue'
            }
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    computeDate(type, date) {
      if (this.detail.assistType === '1') {
        return this.addDate(date, '', 12 * type)
      } else if (this.detail.assistType === '2') {
        return this.addDate(date, 2 * type, '')
      } else if (this.detail.assistType === '3') {
        return this.addDate(date, 3 * type, '')
      } else if (this.detail.assistType === '4') {
        return this.addDate(date, 7 * type, '')
      }
    },
    startChange(val) {
      this.examine.startTime = this.addDate(new Date(val + ':00'), '', '')
      if (this.detail.assistType !== '5') {
        this.examine.endTime = this.computeDate(1, new Date(val + ':00'))
      }
    },
    endChange(val) {
      this.examine.endTime = this.addDate(new Date(val + ':00'), '', '')
      if (this.detail.assistType !== '5') {
        this.examine.startTime = this.computeDate(-1, new Date(val + ':00'))
      }
    },
    addDate(date, days, hours) {
      const d = new Date(date)
      if (days) {
        d.setDate(d.getDate() + days)
      }
      if (hours) {
        d.setHours(d.getHours() + hours)
      }
      const m = d.getMonth() + 1
      return d.getFullYear() + '-' + m + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    }
  },
  mounted() {
    this.type = this.$route.params.type
    this.wfId = this.$route.params.id
    this.getDetail()
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.examine.userId = curUser.id
    this.examine.userName = curUser.realName
    if (this.currentDep) {
      this.examine.deptId = this.currentDep.id
      this.examine.deptName = this.currentDep.depName
    }
    this.depData = getParentDeptArray(getSessionDeptSelect(), this.currentDep.parentDepCode)
    if (this.type === '0003' && this.currentDep.depCode) {
      const s1 = this.currentDep.depCode.substring(2, 6)
      if (s1 === '0000') {
        // 表示省厅
        this.hideParentDept = true
      }
    }
  }
}
</script>

<style scoped>
</style>
