<template>
  <section>
    <div class="report">
      <h2>{{ task_name }}</h2>
      <h3 class="report_form">
        <p style="display: inline-block; width: 120px; text-align: right; padding-right: 12px;">成果上报</p>
      </h3>
      <div class="report_form">
        <el-form :model="form" ref="form" :rules="rules" size="small" label-width="140px">
          <el-form-item label="上报标题" prop="title">
            <el-input v-model="form.title" clearable auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="审批单位" prop="title">
            <el-collapse>
              <el-collapse-item title="选择部门" name="1">
                <div class="dept-tree">
                  <el-tree class="filter-tree" :data="depData" :props="{children: 'children',label: 'name'}" default-expand-all ref="aceptDep"
                           highlight-current show-checkbox check-strictly @check-change="menuChang"
                           :expand-on-click-node="false" node-key="id"
                           style="margin-top: 5px;">
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="刑事案件" prop="xsajnum">
                <el-input v-model="form.xsajnum" clearable auto-complete="off" class="short_input"></el-input>起
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抓获犯罪嫌疑人" prop="zhxyrnum">
                <el-input v-model="form.zhxyrnum" clearable auto-complete="off" class="short_input"></el-input>人
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="刑事拘留" prop="xsjlnum">
                <el-input v-model="form.xsjlnum" clearable auto-complete="off" class="short_input"></el-input>人
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="逮捕" prop="dbnum">
                <el-input v-model="form.dbnum" clearable auto-complete="off" class="short_input"></el-input>人
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="取保候审" prop="qbhsnum">
                <el-input v-model="form.qbhsnum" clearable auto-complete="off" class="short_input"></el-input>人
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="判刑" prop="pxnum">
                <el-input v-model="form.pxnum" clearable auto-complete="off" class="short_input"></el-input>人
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="成果总结" prop="desription" style="padding: 10px 0">
            <vue-editor v-model="form.desription" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
          </el-form-item>
          <el-form-item label="成果附件">
            <el-upload class="upload-demo" drag multiple :action="uploadAction"
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
            <el-button type="primary" @click="onSubmit(false)">保 存</el-button>
            <el-button type="primary" @click="onSubmit(true)">上 报</el-button>
            <el-button @click="cancelEdit('form')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
  import { getTask, editReport, addReport, getReport, onlySaveReport, taskReportReject } from '@/api/specialTasks'
  import VueEditor from '@/components/Editor/VueEditor'
  import { getParentDept } from '@/api/dept'
  import { getSessionDeptSelect } from '@/api/depts'
  import { uploadImg } from '@/utils/editorUpload'
  export default {
    components: {
      VueEditor
    },
    data() {
      const numberValid = (rule, value, callback) => {
        const reg = /^[0-9]*$/
        if (value.length < 1 || !reg.test(value)) {
          callback(new Error('请输入正确的数字'))
        } else {
          callback()
        }
      }
      return {
        taskId: '',
        uploadAction: this.UploadAttachment.uploadFileUrl,
        uploadImgs: [],
        task_name: '',
        form: {
          title: '',
          dept: '',
          desription: '',
          attachment: '',
          xsajnum: '', zhxyrnum: '', xsjlnum: '', dbnum: '', qbhsnum: '', pxnum: '', status: 0
        },
        rules: {
          title: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[\s\S]*$/
              console.info('-' + value + '-')
              if (value.length < 1 || !reg.test(value)) {
                callback(new Error('请输入正确的上报标题'))
              } else {
                callback()
              }
            }
          }],
          desription: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[\s\S]*$/
              if (value.length < 1 || !reg.test(value)) {
                callback(new Error('请输入正确的成果总结'))
              } else {
                callback()
              }
            }
          }],
          xsajnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }],
          zhxyrnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }],
          xsjlnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }],
          dbnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }],
          qbhsnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }],
          pxnum: [{
            required: true, validator: numberValid, trigger: 'blur'
          }]
        },
        curDept: {},
        curUser: {},
        depData: []
      }
    },
    methods: {
      onSubmit(flag) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.listLoading = true
            this.handleImg()
            this.form.bizType = '6'
            this.form.bizId = this.form.taskId
            this.form.type = '0007'
            if (flag) {
              if (this.$route.params.id) {
                this.form.action = '提交成果上报审核'
                if (this.form.report_status === 2) {
                  this.form.status = 1
                  taskReportReject(this.form).then((res) => {
                    this.listLoading = false
                    this.returnMsg('提交成功', res)
                  }).catch(() => {
                    this.listLoading = false
                  })
                } else {
                  this.form.status = 1
                  this.form.serverId = this.$route.params.id
                  this.flowSave()
                }
              } else {
                this.form.action = '添加并提交成果上报审核'
                this.form.status = 1
                this.flowSave()
              }
            } else {
              if (this.$route.params.id) {
                this.onlyUpd()
              } else {
                this.form.action = '添加成果上报'
                this.onlySave()
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      flowSave() {
        addReport(this.form).then((res) => {
          this.returnMsg('上报成功', res)
        }).catch(() => {
          this.listLoading = false
        })
      },
      onlySave() {
        onlySaveReport(this.form).then((res) => {
          this.returnMsg('提交成功', res)
        }).catch(() => {
          this.listLoading = false
        })
      },
      onlyUpd() {
        editReport(this.form).then((res) => {
          this.returnMsg('修改成功', res)
        }).catch(() => {
          this.listLoading = false
        })
      },
      returnMsg(msg, response) {
        if (response.code === '000000') {
          this.$message({
            message: msg, type: 'success'
          })
          this.toBack()
        }
      },
      toBack() {
        this.$router.push({
          path: '/specialTasks/results/' + this.$route.params.taskId
        })
      },
      detailTask() {
        const task = this.$route.params.taskId
        const para = {
          id: task
        }
        getTask(para).then((response) => {
          const data = response.data
          this.task_name = data.task_name
        })
      },
      detailReport() {
        const para = {
          id: this.$route.params.id
        }
        getReport(para).then((response) => {
          const data = response.data
          this.form = data
          this.form.approveDept = data.examine_dept
          this.form.examineDept = data.examine_dept
          this.form.taskId = this.$route.params.taskId
          if (data.examine_dept) {
            this.$refs.aceptDep.setCheckedKeys([data.examine_dept])
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.form = {
          taskId: this.$route.params.taskId,
          title: '',
          dept: '',
          desription: '',
          attachment: '', xsajnum: '', zhxyrnum: '', xsjlnum: '', dbnum: '', qbhsnum: '', pxnum: ''
        }
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toBack()
        })
      },
      handleImg() {
        if (this.uploadImgs.length > 0) {
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
      menuChang(data, isChecked) {
        if (isChecked) {
          this.$refs.aceptDep.setCheckedKeys([])
          this.form.acpDept = data.id
          this.form.acpDeptName = data.name
          this.$refs.aceptDep.setCheckedKeys([String(data.id)])
        } else {
          const d = this.$refs.aceptDep.getCheckedKeys()
          if (!d || d.length === 0) {
            this.form.acpDept = ''
            this.form.acpDeptName = ''
          }
        }
        this.form.approveDept = this.form.acpDept
        this.form.examineDept = this.form.acpDept
      },
      initDept() {
        this.depData = getParentDept(getSessionDeptSelect(), this.curDept.parentDepCode)
      }
    },
    mounted() {
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const user = JSON.parse(sessionStorage.getItem('userInfo'))
      if (user && depToken) {
        this.curDept = depToken
        this.curUser = user
        this.form.createId = this.curUser.id
        this.form.createName = this.curUser.realName
        this.form.userId = this.curUser.id
        this.form.userName = this.curUser.realName
        this.form.createDeptId = this.curDept.id
        this.form.createDeptName = this.curDept.depName
        this.detailTask()
        this.form.taskId = this.$route.params.taskId
        if (this.$route.params.id) {
          this.detailReport()
        }
        this.initDept()
      }
    }
  }
</script>

<style scoped>
.report {
	width: 80%;
	margin: 0 auto;
}
.report h2 {
	text-align: center;
	font-weight: bold;
	font-size: 22px;
}
.report h3 {
	font-size: 16px;
	font-weight: bold;
	height: 50px;
	line-height: 50px;
	margin-bottom: 10px;
}
.report .report_form {
	width: 95%;
	margin: 0 auto;
}
.report .short_input {
	width: 100px;
	margin-right: 10px;
}
.report .dept-tree {
	max-height: 400px;
	overflow-y: auto;
	padding: 5px;
}
</style>
