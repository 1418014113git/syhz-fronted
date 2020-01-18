<template>
<!-- 导入线索 -->
<div class="caseAssist_importClue">
  <el-form ref="drForm" :rules="rules"  :model="drForm" size="small" label-width="100px">
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-form-item label="分类" prop="category">
          <el-select v-model="drForm.category" placeholder="请选择分类" class="inputW">
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('fllb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入线索">
          <input type="file" @change="getFile" clearable name="file" id="excelFile"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row class="tabC dialogBtnUpLine">
    <el-popover
      placement="left"
      width="400"
      trigger="hover">
      <div>
         <p>说明：</p>
         <p>1、导入文件支持xls和xlsx两种格式。</p>
         <p>2、第一行规定必须为标题行，且多次导入标题需保持一致。</p>
         <p>3、根据标题中的“<span class="redC">地址</span>”自动分发线索到地市对应的支队，注意标题必须为“<span class="redC">地址</span>”。</p>
         <p>4、标题必须包含“<span class="redC">序号</span>”，该序号为线索序号，用于根据序号快速定位线索。</p>
         <p>5、相同“<span class="redC">序号</span>”的线索自动以最后上传的线索<span class="redC">更新</span>线索内容，不会新增线索。</p>
      </div>
      <el-button  type="primary" slot="reference"  class="saveBtn"><svg-icon icon-class="wenhao"></svg-icon> 导入说明</el-button>
    </el-popover>
    <el-button  @click="cancel" class="cancelBtn marlr">取消</el-button>
    <el-button  type="primary" @click="importFile"  class="saveBtn" :loading="btnLoading">导入</el-button>
  </el-row>
</div>
</template>

<script>
import { getSessionDeptSelect } from '@/api/depts'
import axios from 'axios'
export default {
  props: ['isShowDialog', 'id', 'category', 'oldStatus'],
  name: 'baseInfo',
  data() {
    return {
      curUser: {}, // sessionStorage获取用户信息
      curDept: {}, // sessionStorage获取部门信息
      depCode: '', // 存储当前部门id
      depName: '', // 存储当前部门名称
      drForm: {
        category: '' // 分类
      },
      // attachment: [], // 导入的文件集合
      btnLoading: false, // 省厅弹框按钮loading
      uploadAction: this.UploadAttachment.uploadFileUrl,
      fileCon: '', // 导入线索列表
      assistId: '', // 集群id
      rules: {
        category: [ // 分类
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
    isShowDialog: {
      handler: function(val, oldeval) {
        this.init()
      }
    },
    id: {
      handler: function(val, oldeval) {
        this.assistId = val
      }
    }
  },
  methods: {
    init() {
      this.initData()
    },
    initData() {
      this.drForm.category = ''
      this.fileCon = ''
      this.btnLoading = false
      const file = document.getElementById('excelFile')
      file.value = ''
      this.resetForm('drForm')
    },
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields()
    },
    getfqDepts() { // 如果登上来的是派出所 发起单位显示成大队
      var tfdwData = getSessionDeptSelect()
      var parentDepCode = this.curDept.parentDepCode
      for (let i = 0; i < tfdwData.length; i++) {
        if (parentDepCode === tfdwData[i].depCode) {
          this.depName = tfdwData[i].name // 当前部门名称
          this.depCode = tfdwData[i].depCode // 当前部门code
        }
      }
    },
    importFile() { //   导入线索
      this.$refs.drForm.validate(valid => {
        if (valid) {
          if (this.fileCon === '') {
            this.$message.error('请选择要导入的线索！')
            return false
          }
          if (this.curDept.depType === '4') { // 派出所
            this.getfqDepts() // 如果登上来的是派出所 发起单位显示成大队
          } else {
            this.depCode = this.curDept.depCode
            this.depName = this.curDept.depName
          }
          this.btnLoading = true
          const formData = new FormData()
          if (this.oldStatus === '4' || this.oldStatus === '5' || this.oldStatus === '6' || this.oldStatus === '7') {
            formData.append('opt', 'addRecord')
          } else {
            formData.append('opt', '')
          }
          formData.append('file', this.fileCon) // 文件
          formData.append('category', this.drForm.category) // 食药环分类
          formData.append('userId', this.curUser.id) // 当前用户id
          formData.append('userName', this.curUser.userName) // 当前用户名称
          formData.append('curDeptCode', this.depCode) // 当前部门code
          formData.append('curDeptName', this.depName) // 当前部门名称
          formData.append('assistId', this.assistId) // 集群id
          formData.append('type', 1) // 1案件协查  2集群战役
          if (this.curDept.depType === '2' && this.category === '3') { // 支队下发时，传
            formData.append('xfType', 'zdxf')
          }
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'userId': this.curUser.id,
              'userName': this.curUser.userName
            }
          }
          axios.post('syhz/caseassistclue/upload', formData, config).then((response) => {
            this.btnLoading = false
            if (response.data.code === '000000') {
              this.$message({
                message: '导入成功', type: 'success'
              })
              this.$emit('closeDialog', false)
              this.$emit('result', response.data.data)
            } else {
              const file = document.getElementById('excelFile')
              file.value = ''
              this.$message({
                message: response.data.message, type: 'error'
              })
              this.fileCon = ''
            }
          }).catch((response) => {
            this.btnLoading = false
            this.$message({
              message: '导入失败', type: 'error'
            })
          })
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    cancel() { // 取消
      this.$emit('closeDialog', false)
    },
    getFile() {
      if (event.target.files[0]) {
        this.fileCon = event.target.files[0]
      } else {
        this.fileCon = ''
      }
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.assistId = this.id
    this.init()
  }
}
</script>
<style>
  .caseAssist_importClue .inputW{
    width: 57%;
  }
  .caseAssist_importClue .redC{
    color: #f72929;
  }
  .caseAssist_importClue .el-form{
    padding: 10px 20px;
  }
  .caseAssist_importClue .el-upload-dragger {
    width: 410px;
    height: 190px;
  }
  .caseAssist_importClue .el-upload-list__item {
    width: 70%;
  }
  .caseAssist_importClue .redC{
    color: #f72929;
  }
  .caseAssist_importClue .marlr{
    margin: 0 15px;
  }
</style>

