<template>
<!-- 审核弹框 -->
  <div class="auditCom">
    <el-form ref="auditForm" :rules="rules" :model="auditForm" size="small" label-width="100px">
      <el-form-item label="审核意见" prop="content">
        <el-input v-model.trim="auditForm.content" type="textarea" :rows="3" clearable  maxlength="500" placeholder="最多输入500个字符" class="inputW"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="tabC dialogBtnUpLine">
      <el-button  class="cancelBtn" @click="auditSubmit('4')" :loading="btnLoading" style="margin-right:20px;">不通过</el-button>
      <el-button  class="saveBtn" type="primary" @click="auditSubmit('3')" :loading="btnLoading">通过</el-button>
    </el-row>
  </div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['dbId', 'dsh'],
  name: 'baseInfo',
  data() {
    return {
      auditForm: { // 审核
        content: '' // 审核意见
      },
      db_Id: '', // 督办id
      dsh_Info: {}, // 待审核的督办
      remarkType: '', // 当前选择的审核状态 1:通过，2不通过
      btnLoading: false, // 省厅弹框按钮loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        remark: [ // 审核意见校验
          { required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (this.remarkType === '4') { // 不通过
              if (!value) {
                callback(new Error('审核意见不能为空'))
              } else {
                callback()
              }
            } else { // 通过，如果意见栏没有输入意见信息，后台处理自动写入“审核通过”
              callback()
            }
          } }
        ]
      }
    }
  },
  components: {
    titlePub
  },
  computed: {

  },
  watch: {
    dbId(val) {
      if (val) {
        this.db_Id = val
        this.init()
      }
    },
    dsh(val) {
      if (val) {
        this.dsh_Info = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.initData()
      if (this.dbId) {
        this.db_Id = this.dbId
      }
      if (this.dsh) {
        this.dsh_Info = this.dsh
      }
    },
    initData() {
      this.resetForm('auditForm')
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    auditSubmit(type) { // 审核 type:3 通过， 4不通过
      this.remarkType = type
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.btnLoading = true // 加载进度条
          var param = {
            userId: this.userInfo.id, // 审核人id
            userName: this.userInfo.realName, // 审核人姓名
            departCode: this.deptInfo.depCode, // 审核人部门code
            departName: this.deptInfo.depName // 审核人部门名称
          }
          param.status = type // 审核状态
          param = Object.assign(param, this.dsh_Info, this.auditForm)
          if (type === '3' && !this.auditForm.content) { // 不通过
            param.content = '审核通过'
          }
          this.$update('casesuperviseexamine/' + this.dbId, param).then((response) => {
            if (response.code === '000000') {
              this.btnLoading = false // 关闭加载条
              this.$emit('closeDialog') // 调用父页面的 关闭弹框
              location.reload() // 刷新页面，因为审核后 审核信息 基本信息 左边菜单数量 都需要刷新，所以这里整个页面全重新刷一遍
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

