<template>
  <!-- 审核 -->
  <div class="caseAssist_auditCom">
    <div class="auditForm">
      <el-form ref="auditForm" :rules="auditRules" :model="auditForm" v-loading="auditFormLoading" size="small" label-width="100px">
        <el-form-item label="编号" prop="assistNumber" v-if="roleType === 1">
          <el-input v-model.trim="auditForm.assistNumber" clearable maxlength="50" placeholder="请输入" disabled></el-input>
        </el-form-item>
        <el-form-item label="协查级别" prop="assistLevel">
          <el-select v-model="auditForm.assistLevel" placeholder="请选择" @change="levelChange">
            <el-option v-for="item in assistLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker v-model="auditForm.startDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" @change="startChange" placeholder="请选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate">
          <el-date-picker v-model="auditForm.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :disabled="timeEndDisable" @change="endChange" placeholder="请选择截止时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核意见" prop="content">
          <el-input v-model.trim="auditForm.content" type="textarea" :rows="4" clearable  maxlength="500" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine" >
        <el-button @click="executeAudit(4)" class="cancelBtn" :loading="cancelBtnLoading" :disabled="auditBtnLoading">不通过</el-button>
        <el-button v-if="roleType === 1" type="primary" @click="executeAudit(3)" class="saveBtn" :loading="auditBtnLoading" :disabled="cancelBtnLoading">通过</el-button>
        <el-button v-if="roleType === 2" type="primary" @click="executeAudit(6)" class="saveBtn" :loading="auditBtnLoading" :disabled="cancelBtnLoading">通过且向上申请</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSessionDeptSelect } from '@/api/depts'
import { getAssistLevel } from '@/utils/codetotext'
export default {
  props: ['assistId', 'info', 'row'],
  name: 'baseInfo',
  data() {
    return {
      oldEndDate: '',
      curUser: {}, // sessionStorage获取用户信息
      baseInfo: {}, // 基础信息
      curRow: {},
      auditForm: {
        assistLevel: '',
        assistNumber: '',
        startDate: null,
        endDate: null,
        content: ''
      },
      assistLevel: getAssistLevel(),
      timeEndDisable: true,
      auditFormLoading: false,
      auditBtnLoading: false,
      cancelBtnLoading: false,
      auditDeptData: [], // 地市审核时,从session获取数据，遍历出省厅的部门id
      curAssistId: '', // 集群战役id
      contentType: '', // 当前选择的审核状态   3通过，4不通过 6向上申请
      roleType: '', // 角色类型，  1： 省厅， 2：地市
      auditRules: {
        assistNumber: [{//  编号
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const regNumber = /^[A-Za-z0-9]+$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入编号'))
            } else if (!regNumber.test(value)) {
              callback(new Error('仅支持英文、数字'))
            } else {
              callback()
            }
          }
        }],
        assistLevel: [{ required: true, message: '请选择协查级别', trigger: 'change' }],
        startDate: [{
          required: true, trigger: ['change', 'blur'], validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请选择开始时间'))
            }
            if (this.auditForm.endDate) {
              if (new Date(this.auditForm.endDate) < new Date(value)) {
                return callback(new Error('开始时间不能大于截止时间'))
              }
            }
            return callback()
          }
        }],
        endDate: [{
          required: true, trigger: ['change', 'blur'], validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请选择截止时间'))
            }
            if (new Date(this.auditForm.startDate) > new Date(value)) {
              return callback(new Error('截止时间不能小于开始时间'))
            }
            // if (this.oldEndDate !== '' && new Date(this.oldEndDate).getTime() === new Date(this.auditForm.endDate).getTime()) {
            //   return callback()
            // }
            if (new Date(value) < new Date()) {
              return callback(new Error('截止时间不能小于当前系统时间'))
            }
            return callback()
          }
        }],
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              callback(new Error('请填写审核意见'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  watch: {
    assistId(val) {
      this.curAssistId = val
      this.baseInfo = this.info
    },
    row(val) {
      this.curRow = val
    }
  },
  methods: {
    setBaseInfo(baseInfo, row) {
      this.baseInfo = baseInfo
      this.curAssistId = this.baseInfo.assistId
      this.auditForm.assistLevel = String(this.baseInfo.assistLevel)
      this.auditForm.assistNumber = this.baseInfo.assistNumber
      this.auditForm.startDate = this.baseInfo.startDate
      this.auditForm.endDate = this.baseInfo.endDate
      this.oldEndDate = this.baseInfo.endDate
      this.auditForm.content = ''
      this.auditFormLoading = false
      this.auditBtnLoading = false
      this.cancelBtnLoading = false
      this.curRow = row
      if (this.roleType === 1) {
        let parentCode = ''
        if (this.curDept.depType === '1') {
          parentCode = this.baseInfo.auditDeptCode
        }
        if (this.curDept.depType === '2') {
          parentCode = this.curDept.depCode
        }
        this.initNumber(parentCode)
      }
    },
    findParentDept(paramCode) {
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (item.depCode === paramCode) {
          return item.parentCode
        }
      }
    },
    initNumber(parentCode) {
      this.auditFormLoading = true
      this.$query('caseAssist/number', { dept: parentCode }).then(response => {
        this.auditForm.assistNumber = response.data
        this.auditFormLoading = false
      })
    },
    executeAudit(type) { //   省厅审核  type:3 通过  4 不通过 , 地市审核 type: 4 不通过  6 通过且向上申请
      if ((String(type) === '3' || String(type) === '6') && (this.auditForm.content === undefined || this.auditForm.content === null || this.auditForm.content === '')) {
        this.auditForm.content = '审核通过'
      }
      this.auditFormLoading = true
      this.auditBtnLoading = true
      this.remarkType = type
      const param = {
        userId: this.curUser.id, // 当前用户id
        userName: this.curUser.realName, // 当前用户名
        status: type, // 审核状态
        curDeptName: this.curDept.depName, // 当前部门名称
        curDeptCode: this.curDept.depCode, // 当前部门code
        curDeptId: this.curDept.id, // 当前部门id
        bsId: this.curAssistId, // 协查id
        flowId: this.curRow.wfId, // 列表返回的wfId
        wdId: this.curRow.wdId // 列表返回的wdId
      }
      param.content = this.auditForm.content
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          if (type === 3) { // 通过
            param.number = this.auditForm.assistNumber // 编号
            param.startDate = this.auditForm.startDate // 开始时间
            param.endDate = this.auditForm.endDate // 截止时间
          }
          if (type === 6) { // 通过
            param.acceptDeptId = this.auditForm.acceptDeptId// 接收部门id
            param.acceptDeptCode = this.auditForm.acceptDeptCode// 接收部门code
            param.acceptDeptName = this.auditForm.acceptDeptName// 接收部门名称
          }
          this.$update('caseAssist/examine', param).then((response) => {
            this.auditFormLoading = false
            this.auditBtnLoading = false
            this.$emit('closeDialog', false)
          }).catch(() => {
            this.auditFormLoading = false
            this.auditBtnLoading = false
          })
        } else {
          this.auditFormLoading = false
          this.auditBtnLoading = false
          return false
        }
      })
    },
    levelChange(val) {
      if (val) {
        if (String(val) === '5') {
          this.timeEndDisable = false
        }
        this.startChange(this.auditForm.startDate.substring(0, 16))
      } else {
        this.auditForm.startDate = null
        this.auditForm.endDate = null
      }
    },
    startChange(val) {
      if (val) {
        this.auditForm.startDate = this.addDate(new Date(val + ':00'), '', '')
        if (this.auditForm.assistLevel !== '5') {
          this.auditForm.endDate = this.computeDate(1, new Date(val + ':00'))
        }
      }
    },
    endChange(val) {
      if (val) {
        this.auditForm.endDate = this.addDate(new Date(val + ':00'), '', '')
        if (this.auditForm.assistLevel !== '5') {
          this.auditForm.startDate = this.computeDate(-1, new Date(val + ':00'))
        }
      }
    },
    computeDate(type, date) {
      if (this.auditForm.assistLevel === '1') {
        return this.addDate(date, '', 12 * type)
      } else if (this.auditForm.assistLevel === '2') {
        return this.addDate(date, 2 * type, '')
      } else if (this.auditForm.assistLevel === '3') {
        return this.addDate(date, 3 * type, '')
      } else if (this.auditForm.assistLevel === '4') {
        return this.addDate(date, 7 * type, '')
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
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '-1' || this.curDept.depType === '1') { //  省厅 总队
        this.roleType = 1
      } else if (this.curDept.depType === '2') { // 地市  支队
        if (this.info.cityNum > 1) {
          this.roleType = 2
          this.auditDeptData = getSessionDeptSelect()
          this.auditDeptData.forEach(item => {
            if (item.depCode === '610000530000') { // 总队 (地市审核时，向上反馈的接收单位是总队)
              this.auditForm.acceptDeptId = item.id // 接收部门id
              this.auditForm.acceptDeptCode = item.depCode // 接收部门code
              this.auditForm.acceptDeptName = item.name // 接收部门名称
            }
          })
        } else {
          this.roleType = 1
        }
      }
    }
    this.setBaseInfo(this.info, this.row)
  }
}
</script>
<style>
  .caseAssist_auditCom .dialogBtnUpLine{
    text-align: right;
    padding-right: 20px;
  }
  .caseAssist_auditCom .el-select, .caseAssist_auditCom .el-input {
    width: 100%;
  }
</style>
