<template>
  <el-row class="report" type="flex" justify="center">
    <el-col :span="16">
      <el-card :body-style="{padding:'20px 50px'}">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold">上传结案报告</span>
        </div>
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="140px">
          <el-form-item label="上报人员">
            {{form.createUserName}}
          </el-form-item>
          <el-form-item label="上报部门">
            {{form.createDeptName}}
          </el-form-item>
          <el-form-item label="上报标题" prop="title">
            <el-input v-model="form.title" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="审核部门" prop="examineDeptId">
            <el-select v-model="form.examineDeptId" placeholder="请选审核部门" class="db_endReport_input">
              <el-option v-for="item in depData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结案报告" prop="content">
            <vue-editor v-model="form.content" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
          </el-form-item>
          <el-form-item label="上传附件">
            <el-upload class="upload-demo" drag
                       :action="uploadAction" multiple
                       :file-list="attachment"
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
            <el-button size="small" type="primary" @click="doEndDb"
                       v-loading.fullscreen.lock="saveLoading">提 交</el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import VueEditor from '@/components/Editor/VueEditor'
  import {
    saveSuperviseReport, getSuperviseReportByid, updateSuperviseReport, saveReportReject
  } from '@/api/supervise'
  import {
    getSessionDeptSelect
  } from '@/api/depts'
  import {
    getParentDeptArray
  } from '@/api/dept'
  import {
    uploadImg
  } from '@/utils/editorUpload'

  export default {
    components: {
      VueEditor
    },
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        form: {},
        db_id: '',
        saveLoading: false,
        attachment: [],
        depData: [],
        curDept: {},
        curUser: {},
        rules: {
          title: [
            {
              required: true, message: '请输入标题', trigger: 'blur'
            },
            {
              max: 100, message: '标题不能超过100字', trigger: 'blur'
            }
          ],
          content: [
            {
              required: true, message: '请输入报告内容', trigger: 'blur'
            },
            {
              max: 20000, message: '报告内容不能超过2万字', trigger: 'blur'
            }
          ],
          examineDeptId: [
            {
              required: true, message: '请选择审核部门', trigger: 'change'
            }
          ]
        }
      }
    },
    methods: {
      doEndDb() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.handleImg()
            this.handleDepts()
            const req = this.form
            if (!this.form.id) {
              this.doSave(req)
            } else if (this.form.id && this.form.id !== '') {
              if (this.form.status === 2) {
                this.form.status === 1
                this.form.type = '0008'
                this.doReject(req)
              } else {
                this.doUpdate(req)
              }
            }
          }
        })
      },
      doReject(req) {
        req.approveDept = req.examineDeptId
        req.approveDeptName = req.examineDeptName
        req.userId = req.createUser
        req.userName = req.createUserName
        saveReportReject(req).then((res) => {
          this.returnMsg(res, '修改成功')
        }).catch(() => {
          this.saveLoading = false
        })
      },
      doSave(req) {
        saveSuperviseReport(req).then((res) => {
          this.returnMsg(res, '上报成功')
        }).catch(() => {
          this.saveLoading = false
        })
      },
      doUpdate(req) {
        updateSuperviseReport(req).then((res) => {
          this.returnMsg(res, '修改成功')
        }).catch(() => {
          this.saveLoading = false
        })
      },
      returnMsg(res, msg) {
        this.saveLoading = false
        if (res.code === '000000') {
          this.$message({
            message: msg, type: 'success'
          })
          this.toList()
        }
      },
      toList() {
        this.$router.push({
          path: '/caseManage/dbdetail/' + this.db_id
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      handleDepts() {
        if (this.form.examineDeptId) {
          for (let i = 0; i < this.depData.length; i++) {
            if (this.depData[i]['id'] === this.form.examineDeptId) {
              this.form.examineDeptName = this.depData[i]['name']
              return true
            }
          }
        }
      },
      handleImg() {
        if (this.attachment.length > 0) {
          const arr = []
          for (let i = 0; i < this.attachment.length; i++) {
            const img = this.attachment[i]
            if (img.status === 'success') {
              arr.push({
                name: img.name, path: img.path ? img.path : img.response.data
              })
            }
          }
          this.form.attachment = JSON.stringify(arr)
        }
      },
      imgSuccess(res, file, fileList) {
        this.attachment = fileList
      },
      imgRemove(file, fileList) {
        this.attachment = fileList
      },
      imgBfRemove(file, fileList) {
        if (file && file.status === 'success') {
          return this.$confirm('确定移除' + file.name + '？')
        }
      },
      imgPreview(file) {},
      beforeUpload(file) {
        const msg = this.UploadAttachment.fileValid(file)
        if (msg.length > 0) {
          this.$message({
            message: msg, type: 'warning'
          })
          return false
        }
      },
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((response) => {
          if (response.code === '000000') {
            Editor.insertEmbed(cursorLocation, 'image', response.data)
            resetUploader()
          }
        }).catch((e) => {})
      },
      getEndReport() {
        getSuperviseReportByid({
          id: this.form.id
        }).then((res) => {
          if (res.code === '000000') {
            this.form = res.data
            if (this.form.attachment) {
              this.attachment = JSON.parse(this.form.attachment)
            }
            this.form.status = this.form.reportStatus
            this.form.bizId = this.$route.params.id
          }
        })
      }
    },
    mounted() {
      this.db_id = this.$route.params.id
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curDept && this.curUser) {
        this.form.createUser = this.curUser.id
        this.form.createUserName = this.curUser.realName
        this.form.createDept = this.curDept.id
        this.form.createDeptName = this.curDept.depName
        this.form.dbId = this.db_id
        this.form.status = 1
      }
      this.form.bizId = this.$route.params.id
      if (this.$route.params.reportId) {
        this.form.id = this.$route.params.reportId
      }
      this.depData = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
      if (this.$route.params.reportId) {
        this.getEndReport()
      }
    }
  }
</script>

<style scoped>
.report .db_endReport_input {
  width: 300px;
}
</style>
