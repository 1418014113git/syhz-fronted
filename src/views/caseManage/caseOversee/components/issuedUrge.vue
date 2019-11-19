<template>
<!-- 下发催办弹框 -->
  <div class="auditCom">
    <el-form ref="dbxfcbForm" :model="dbxfcbForm" :rules="rules" label-width="120px">
      <el-form-item label="被催办单位" prop="urgedDeptName">
        <el-input v-model="bcb_data.urgedDeptName" disabled></el-input>
      </el-form-item>
      <el-form-item label="被催办责任人" prop="urgedPersonName">
        <el-input v-model="bcb_data.urgedPersonName" disabled></el-input>
      </el-form-item>
      <el-form-item label="催办截止日期" prop="endDate">
        <el-date-picker v-model="dbxfcbForm.endDate" type="date" placeholder="选择日期" class="db_create_input"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions" :clearable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="催办要求" prop="urgedContent">
        <el-input type="textarea" v-model="dbxfcbForm.urgedContent" maxlength="500" placeholder="最多输入500个字符"></el-input>
      </el-form-item>
      <el-form-item class="tabC">
        <el-button class="cancelBtn" @click="cancelDialog">取 消</el-button>
        <el-button class="saveBtn" type="primary" @click="onSubmitEdit"
                  v-loading.fullscreen.lock="btnLoading">催 办</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['bcbInfo', 'isShowDialog'],
  name: 'baseInfo',
  data() {
    return {
      dbxfcbForm: { // 审核
        endDate: '', // 催办截至日期
        content: '' // 审核意见
      },
      bcb_data: {}, // 被催办的信息
      db_Id: '', // 督办id
      btnLoading: false, // 省厅弹框按钮loading
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - (60 * 60 * 24 * 1000)
        }
      },
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        endDate: [{ // 催办截止日期
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入催办截止日期'))
            } else {
              callback()
            }
          }
        }],
        urgedContent: [{ // 催办要求
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入催办要求'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  components: {
    titlePub
  },
  computed: {

  },
  watch: {
    bcbInfo(val) {
      console.log('111----' + val)
      this.init()
      if (val) {
        this.bcb_data = val
      }
    }
    // isShowDialog: {
    //   handler: function(val, oldeval) {
    //     this.init()
    //   }
    // }
  },
  methods: {
    init() {
      this.resetForm('dbxfcbForm')
      if (this.bcbInfo) {
        this.bcb_data = this.bcbInfo
      }
      // 默认本日后第3天，可修改，可选本日及以后
      this.dbxfcbForm.endDate = this.$parseTime(new Date(Date.now() + (60 * 60 * 24 * 1000 * 3)), '{y}-{m}-{d}') // 默认 本日后的第三天
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
        this.dbxfcbForm.endDate = this.$parseTime(new Date(Date.now() + (60 * 60 * 24 * 1000 * 3)), '{y}-{m}-{d}') // 默认 本日后的第三天
      }
    },
    cancelDialog() {
      this.resetForm('dbxfcbForm') // 重置表单
      this.$emit('closeDialog') // 调用父页面的 关闭弹框
    },
    onSubmitEdit() { // 审核 type:3 通过， 4不通过
      this.$refs.dbxfcbForm.validate(valid => {
        if (valid) {
          if (!this.bcb_data.urgedDeptName) { // 被催办的信息
            return false
          }
          this.btnLoading = true // 加载进度条
          var param = this.dbxfcbForm
          // {
          //   superviseId: , // 督办id
          //   userId: this.userInfo.id, // 审核人id
          //   userName: this.userInfo.realName, // 审核人姓名
          //   departCode: this.deptInfo.depCode, // 审核人部门code
          //   departName: this.deptInfo.depName // 审核人部门名称
          // }
          param = Object.assign(param, this.bcb_data)
          param.urgentPersonId = this.userInfo.id // 当前人的信息
          param.urgentPersonName = this.userInfo.realName
          param.urgentDeptId = this.deptInfo.id
          param.urgentDeptName = this.deptInfo.depName
          param.status = 1 // 下发催办 写死 1
          this.$save('dbcbaj', param).then((response) => {
            if (response.code === '000000') {
              this.btnLoading = false // 关闭加载条
              this.resetForm('dbxfcbForm')
              this.$emit('closeDialog')
              this.$emit('initList') // 调用父级的刷新列表方法
            }
          }).catch(() => {
            this.btnLoading = false // 关闭加载条
          })
        } else {
          this.btnLoading = false // 关闭进度条
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.auditCom {
  .inputW {
    width: 95%;
  }
}
@media only screen and (max-width: 1367px) {
}
</style>

