<template>
  <section>
    <el-row>
      <el-col :span="20">
        <el-form ref="nowsForm" :model="nowsForm" :rules="rules" label-width="110px" class="flws-form">
          <el-form-item label="申请事由：" prop="content">
            <el-input type="textarea" :autosize="{minRows: 3, maxRows: 5}" v-model="nowsForm.content" maxlength="200" placeholder="请输入理由（不超过200字）" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="审核单位：" prop="acptDept">
            <el-tooltip class="item" effect="dark" :content="nowsForm.acptDeptName" placement="top-start" :popper-class="(nowsForm.acptDeptName&&nowsForm.acptDeptName.length>11)?'tooltipShow':'tooltipHide'">
              <el-select v-model="nowsForm.acptDept" placeholder="请选择审核单位" class="db_create_input" @change="deptChange" style="width:100%;">
                <el-option v-for="item in auditDeptData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
             </el-tooltip>
          </el-form-item>
          <el-form-item label="文书附件：" prop="uploadImgs" class="uploadImgs">
            <el-upload drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadImgs"
                       :on-success="imgSuccess"
                       :on-remove="imgRemove"
                       :on-preview="imgPreview"
                       :before-remove="imgBfRemove"
                       :before-upload="beforeUpload"
                       :limit="10"
                       :on-exceed="handleExceed">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipTextNoWs}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-loading="saveLoading">提交</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import {
  getSessionDeptSelect
} from '@/api/depts'
export default {
  props: ['ajbh', 'againNowsInfo'],
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      nowsForm: {
        files: ''
      }, // 没有文书表单
      auditDeptData: [], // 审核部门数据list
      saveLoading: false,
      AJBH: '',
      // againNowsInfo: {}, // 再次无文书申请数据
      userInfo: {}, // 当前用户
      curDept: {}, // 当前部门
      uploadImgs: [],
      rules: {
        content: [{
          required: true, message: '请输入申请事由', trigger: 'blur'
        }],
        acptDept: [{
          required: true, message: '请选择审核单位', trigger: 'change'
        }]
      }

    }
  },
  watch: {
    ajbh(val) {
      // console.log(val)
      if (val) {
        this.AJBH = val
      }
    },
    againNowsInfo(val) {
      if (val) {
        this.nowsForm = val
      }
    }
  },
  methods: {
    init(row) {
      if (this.ajbh) {
        this.AJBH = this.ajbh
      }
      this.nowsForm = row
      if (row.files) { // 申请的附件
        this.uploadImgs = [] // 先清空掉该数组
        var files = row.files.split('|')
        for (let index = 0; index < files.length; index++) {
          var element = files[index]
          element = JSON.parse(element)
          this.uploadImgs.push(element)
        }
      }
    },
    onSubmit() {
      this.$refs.nowsForm.validate(valid => {
        if (valid) {
          if (this.uploadImgs.length > 0) {
            this.handleImg()
          } else {
            this.$message.error('附件不能为空')
            return false
          }
          // console.log(this.nowsForm.files)
          this.saveLoading = true
          var param = {
            userId: this.userInfo.id,
            userName: this.userInfo.realName,
            deptId: this.curDept.id,
            deptName: this.curDept.depName,
            acptDept: this.nowsForm.acptDept,
            acptDeptName: this.nowsForm.acptDeptName,
            files: this.nowsForm.files, // 文书附件
            ajbh: this.AJBH,
            // ajbh: 'J6104296813050800001',
            content: this.nowsForm.content
          }
          this.$save('flws/examine', param).then((response) => {
            if (response.code === '000000') {
              this.saveLoading = false
              this.$message({
                type: 'success',
                message: '申请成功!'
              })
              this.$emit('changeDialog', false)
            }
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    reset() {
      this.nowsForm = {}
      this.$refs.nowsForm.resetFields()
      this.uploadImgs = []
    },
    initDept() {
      this.auditDeptData = []
      var dept = getSessionDeptSelect()
      for (let index = 0; index < dept.length; index++) {
        const element = dept[index]
        if (element.depCode === '610000535300' || element.depCode === '610000535400' || element.depCode === '610000535500') {
          this.auditDeptData.push(element)
        }
      }
    },
    deptChange(val) {
      if (val) {
        for (let i = 0; i < this.auditDeptData.length; i++) {
          if (val === this.auditDeptData[i].id) {
            this.nowsForm.acptDeptName = this.auditDeptData[i].name
          }
        }
      } else {
        this.nowsForm.acptDeptName = ''
      }
    },
    handleImg() {
      if (this.uploadImgs.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]
          if (img.status === 'success') {
            arr.push(JSON.stringify({ name: img.name, path: img.path ? img.path : img.response.data }))
            // arr.push(img.path || img.response.data)
          }
        }
        this.nowsForm.files = arr.join('|')
      }
    },
    handleExceed(files, fileList) { // 限制上传文件个数
      this.$message.error('最多上传10个文书附件')
    },
    imgSuccess(res, file, fileList) {
      this.uploadImgs = fileList
    },
    imgRemove(file, fileList) {
      this.uploadImgs = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {
      // console.log(file)
    },
    beforeUpload(file) {
      const msg = this.UploadAttachment.fileNoWsValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem('userInfo')) {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    }
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.initDept()
    this.init(this.againNowsInfo)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.flws-form {
  .uploadImgs.el-form-item .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>

