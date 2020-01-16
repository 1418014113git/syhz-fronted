<template>
  <div class="caseAssist_clueBack">
    <p style="padding: 5px 20px; font-size: 16px;">将线索转回上级单位。</p>
    <el-form ref="backClueForm" :rules="backClueFormRules" :model="backClueForm" size="small" label-width="90px">
      <el-form-item label="接收单位" prop="receiveDept">
        <el-select v-model="backClueForm.receiveDept" placeholder="请选择部门" v-loading="deptLoading" style="width: 100%;" disabled>
          <el-option v-for="(item, index) in exDeptData" :key="index" :label="item.departName" :value="item.departCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="content">
        <el-input v-model.trim="backClueForm.content" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="tabC dialogBtnUpLine">
      <el-button @click="cancelBack" class="cancelBtn">取 消</el-button>
      <el-button type="primary" @click="saveBack" class="saveBtn" :loading="btnLoading">提 交</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'clueBack',
    props: ['assistId', 'qbxsId', 'qbxsDeptId', 'receiveCode'],
    data() {
      return {
        curUser: JSON.parse(sessionStorage.getItem('userInfo')),
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
        curAssistId: this.assistId,
        curQbxsId: this.qbxsId,
        curQbxsDeptId: this.qbxsDeptId,
        curReceiveCode: this.receiveCode,
        exDeptData: [],
        pcsParentDept: {},
        deptLoading: false,
        btnLoading: false,
        backClueForm: {
          receiveDept: '',
          content: ''
        },
        backClueFormRules: {
          receiveDept: [{ required: true, message: '请选择接受单位', trigger: 'change' }],
          content: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                callback(new Error('请填写原因'))
              } else {
                callback()
              }
            }
          }]
        }
      }
    },
    watch: {
      assistId: function(assistId) {
        this.curAssistId = assistId
      },
      qbxsId: function(qbxsId) {
        this.curQbxsId = qbxsId
      },
      qbxsDeptId: function(qbxsDeptId) {
        this.curQbxsDeptId = qbxsDeptId
      },
      receiveCode: function(receiveCode) {
        this.curReceiveCode = receiveCode
      }
    },
    methods: {
      queryParentDept(paramCode) {
        this.deptLoading = true
        this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            const exDeptData = {
              departCode: response.data.departCode,
              departName: response.data.departName,
              acceptDeptId: response.data.id
            }
            this.backClueForm.receiveDept = response.data.departCode
            this.backClueForm.receiveDeptName = response.data.departName
            this.exDeptData = [exDeptData]
            this.deptLoading = false
          } else {
            this.deptLoading = false
          }
        }).catch(() => {
          this.deptLoading = false
        })
      },
      querypcssj() { // 查询派出所的上级
        this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            this.pcsParentDept = response.data
          }
        }).catch(() => {
        })
      },
      cancelBack() {
        this.backClueForm = {
          receiveDept: '',
          content: ''
        }
        this.$refs.backClueForm.resetFields()
        this.$emit('closeDialog', true)
      },
      saveBack() {
        this.$refs.backClueForm.validate(valid => {
          if (valid) {
            this.btnLoading = true
            const para = {
              assistId: this.curAssistId,
              qbxsId: this.curQbxsId,
              qbxsDeptId: this.curQbxsDeptId,
              receiveCode: this.curReceiveCode,
              receiveDept: this.backClueForm.receiveDept,
              receiveDeptName: this.backClueForm.receiveDeptName,
              remark: this.backClueForm.content,
              assistType: 1,
              curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName,
              curDeptCode: this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.depCode,
              userId: this.curUser.id,
              userName: this.curUser.realName,
              opt: 'addRecord'
            }
            this.$update('/caseassistclue/qbxsReturn', para).then((response) => {
              this.$message({
                message: '转回成功！',
                type: 'success',
                duration: 2000
              })
              this.btnLoading = false
              this.$emit('closeDialog', false, true)
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        })
      },
      initData() {
        let paramCode = ''
        if (this.curDept.depType === '4') { // 派出所
          paramCode = this.curDept.parentDepCode
          this.querypcssj()
        } else {
          paramCode = this.curDept.depCode
        }
        this.queryParentDept(paramCode)
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style>
  .caseAssist_clueBack .el-form{
    padding: 10px 20px;
  }
</style>
