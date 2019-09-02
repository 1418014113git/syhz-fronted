<template>
  <div class="inspect_apply">
    <h3>检验鉴定报告</h3>
    <el-form :model="form" ref="form" :rules="rules" size="small"  label-width="120px"> <!--:rules="rules"-->
      <el-form-item label="反馈人">
        {{curUser.realName}}
      </el-form-item>
      <el-form-item label="反馈部门">
        {{curDept.depName}}
      </el-form-item>
      <el-form-item label="鉴定报告" prop="authResult">
        <el-input type="textarea" v-model="form.authResult" auto-complete="off" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload :action="uploadAction"
                   class="upload-demo" drag multiple
                   :auto-upload="true"
                   :file-list="uploadImgs"
                   :on-success="imgSuccess"
                   :on-remove="imgRemove"
                   :on-preview="imgPreview"
                   :before-remove="imgBfRemove"
                   :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(true)" v-loading.fullscreen.lock="saveLoading">提 交</el-button>
        <el-button size="small" @click="cancelEdit">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCheckResult } from '@/api/inspectIdent'
// import {editAuthenticate} from '@/api/inspectIdent'

export default {
  name: 'edit',
  data() {
    return {
      saveLoading: false,
      uploadAction: this.UploadAttachment.uploadFileUrl,
      form: {
        authResult: ''
      },
      uploadImgs: [],
      rules: {
        authResult: [
          {
            required: true, message: '请输入报告内容', trigger: 'blur'
          },
          {
            max: 40000, message: '内容过长请修改内容', trigger: 'blur'
          }
        ]
      },
      curUser: {},
      curDept: {}
    }
  },
  methods: {
    onSubmit(flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          this.handleImg()
          this.form.createOrgId = this.curDept.id
          this.form.createOrgName = this.curDept.depName
          this.form.createId = this.curUser.id
          this.form.createName = this.curUser.realName
          addCheckResult(this.form).then((response) => {
            this.$update('authenticate/' + this.form.authId, { status: 7 }).then((res) => {
              this.resReturn(response, '提交成功')
            })
          }).catch(() => {
            this.saveLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resReturn(res, message) {
      if (res.code === '000000') {
        this.saveLoading = false
        this.$message({
          message: message,
          type: 'success'
        })
        this.toList()
      }
    },
    toList() {
      this.$router.push({ path: '/inspectIdent/detail/' + this.form.authId })
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.toList()
      })
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
      console.log(file)
    },
    beforeUpload(file) {
      const msg = this.UploadAttachment.fileValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    },
    handleImg() {
      const arr = []
      for (let i = 0; i < this.uploadImgs.length; i++) {
        const img = this.uploadImgs[i]
        if (img.status === 'success') {
          arr.push({
            name: img.name, path: img.path ? img.path : img.response.data
          })
        }
      }
      this.form.attachment = JSON.stringify(arr)
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.$route.params.id) {
      this.form.authId = this.$route.params.id
    }
  }
}
</script>

<style scoped>
.inspect_apply {
  width: 70%;
  margin: 0 auto;
}
.inspect_apply h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}

.inspect_apply .input_w {
  width: 40%;
}
.inspect_apply .el-form-item {
  margin-bottom: 18px;
}
</style>
