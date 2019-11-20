<template>
  <section>
    <!-- 审核信息 -->
    <div class="auditInfo">
      <div class="titleWrap">
        <div class="left">{{title}}</div>
        <div class="right">
          <!-- 【评价打分】，审核单位，督办中或督办结束状态显示。 -->
          <el-button v-if="$isViewBtn('100820') && pjdfInfo.superviseDepartCode===deptInfo.depCode && (pjdfInfo.status===5||pjdfInfo.status===6)"
              type="primary" size="small" @click="handleSettingScore">评价打分</el-button>
        </div>
     </div>
      <el-form ref="pjdfInfo" :model="pjdfInfo" size="small" label-width="70px" class="scoreWrap">
        <el-form-item label="打分" prop="grade">
          <el-rate v-model="pjdfInfo.grade" disabled></el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="gradeContent">
          {{pjdfInfo.gradeContent}}
        </el-form-item>
      </el-form>
      <!-- 评价打分 弹框 -->
      <el-dialog title="评价打分" :visible.sync="isShowpjdf" size="small" class="pjdfForm" @close="resetForm('pjdfForm')">
        <el-form ref="pjdfForm" :rules="rules" :model="pjdfForm" size="small" label-width="70px" v-loading="formLoading">
          <el-form-item label="打分" prop="grade">
            <el-rate v-model="pjdfForm.grade"></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="gradeContent">
            <el-input v-model.trim="pjdfForm.gradeContent" type="textarea" :rows="3" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button  @click="scoreCancel('pjdfForm')" class="cancelBtn" :loading="formLoading">取 消</el-button>
          <el-button  type="primary" @click="scoreSubmit('pjdfForm')"  class="saveBtn" :loading="formLoading">完 成</el-button>
        </el-row>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
export default {
  props: ['pjdfData'],
  name: 'index',
  components: {
    titlePub
  },
  data() {
    return {
      title: '评价打分',
      loading: false, // 页面加载loading
      dataList: [],
      pjdfInfo: {}, // 评价数据
      isShowpjdf: false, // 评价打分弹框是否显示
      pjdfForm: {}, // 评价打分弹框
      AJBH: '', // 案件编号
      formLoading: false,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        grade: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请打分'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  watch: {
    pjdfData(val) {
      // this.loading = true
      // this.initData() // 初始化数据
      if (val) {
        this.pjdfInfo = val
        this.init()
      }
    }
  },
  methods: {
    init() {
      if (this.pjdfData) {
        this.pjdfInfo = this.pjdfData
      }
    },
    initData() { // 初始化数据
      this.dataList = []
      this.page = 1
      this.total = 0
      this.pageSize = 5
    },
    handleSettingScore() { // 评价打分
      this.isShowpjdf = true
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    scoreCancel() {
      this.resetForm('pjdfForm')
      this.isShowpjdf = false
    },
    scoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true
          var param = JSON.parse(JSON.stringify(this.pjdfForm))
          param.userId = this.userInfo.id // 用户id
          param.userName = this.userInfo.realName // 用户名
          this.$update('casesupervisegrade/' + this.pjdfInfo.dbId, param).then((response) => {
            this.formLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '评价打分成功', type: 'success'
              })
              location.reload() // 刷新页面
            } else {
              this.$message({
                message: '评价打分失败！', type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              message: '评价打分失败！', type: 'error'
            })
            this.formLoading = false
          })
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.auditInfo {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  border-radius: 8px;
  .scoreWrap {
    width: 96%;
    margin: 6px auto 0;
    .el-rate {
      margin-top: 5px;
    }
  }
  .el-dialog__body {
    padding: 10px 15px;
  }
}
</style>
