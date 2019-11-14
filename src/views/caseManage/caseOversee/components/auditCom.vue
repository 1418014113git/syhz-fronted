<template>
<!-- 审核弹框 -->
  <div class="auditCom">
    <el-form ref="auditForm" :rules="rules" :model="auditForm" size="small" label-width="100px">
      <el-form-item label="审核意见" prop="content">
        <el-input v-model.trim="auditForm.content" type="textarea" :rows="3" clearable  maxlength="500" placeholder="" class="inputW"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="tabC dialogBtnUpLine">
      <el-button  @click="auditSubmit('4')" :loading="btnLoading" class="cancelBtn" style="margin-right:20px;">不通过</el-button>
      <el-button  type="primary" @click="auditSubmit('3')" class="saveBtn" :loading="btnLoading">通过</el-button>
    </el-row>
  </div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['cardId', 'isShowDialog'],
  name: 'baseInfo',
  data() {
    return {
      auditForm: { // 审核
        content: '' // 审核意见
      },
      dbId: '', // 督办id
      remarkType: '', // 当前选择的审核状态 1:通过，2不通过
      btnLoading: false, // 省厅弹框按钮loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        remark: [ // 审核意见校验
          { required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (this.remarkType === 2) { // 不通过
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
      this.dbId = val
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.initData()
      // if (this.cardId) {
      //   this.cardNumber = this.cardId
      //   this.detail()
      // }
    },
    initData() {
      this.resetForm('auditForm')
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    auditSubmit(type) { // 审核 type:1 通过， 2：不通过
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
          this.auditForm.status = type // 审核状态
          if (type === '3' && !this.auditForm.content) { // 不通过
            param.content = '审核通过'
          }
          this.$update('casesuperviseexamine/' + this.dbId, param).then((response) => {
            if (response.code === '000000') {
              this.btnLoading = false // 关闭加载条
              this.$emit('closeDialog', false)
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

