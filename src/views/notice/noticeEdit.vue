<template>
  <div class="noticeEdit">
    <el-row class="noticeCard">
      <img src="@/assets/icon/back.png"  class="goBack" @click="callBack">   <!--返回-->
    </el-row>
    <el-card class="noticeCard">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form :model="noticeForm" ref="noticeForm" :rules="rules" v-loading="formLoading" label-width="120px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="noticeForm.title" auto-complete="off" clearable maxlength="50" :disabled="isDisabled" v-loading="titleLoading"></el-input>
            </el-form-item>
            <el-form-item label="通知内容" prop="content" class="content">
              <vue-editor ref="child" v-model="noticeForm.content" useCustomImageHandler @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload :limit="10"
                        :action="uploadAction"
                        class="upload-demo" drag multiple
                        :auto-upload="true"
                        :file-list="uploadImgs"
                        :on-success="imgSuccess"
                        :on-remove="imgRemove"
                        :before-remove="imgBfRemove"
                        :before-upload="beforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText_Notice_size}}<br>{{UploadAttachment.tipText_Notice_style}}</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="接收单位" prop="receiveDept" class="transfer">
              <el-button class="group" @click="addGroup">添加组</el-button>
              <el-transfer v-model="noticeForm.receiveDept" :titles="['我的组', '我的组']" :data="transferCYLXRData"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button v-if="showSave" type="primary" class="saveBtn" @click="onSubmit(0)" :loading="noticeForm.messageStatus === 0 && loading" :disabled="noticeForm.messageStatus === 1 && loading">保 存</el-button>
              <el-button type="primary" class="saveBtn" @click="onSubmit(1)" :loading="noticeForm.messageStatus === 1 && loading" :disabled="noticeForm.messageStatus === 0 && loading">提 交</el-button>
              <el-button @click="cancelEdit" class="cancelBtn" :disabled="loading">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="添加常用组" :visible.sync="groupDialogVisible" :close-on-click-modal="false" class="group_dialog" @close="closeDialog">
      <noticeGroupEdit ref="noticeGroupEdit" @closeDialog="closeDialog"></noticeGroupEdit>
    </el-dialog>
  </div>
</template>

<script>
  import VueEditor from '@/components/Editor/VueEditor'
  import { uploadImg } from '@/utils/editorUpload'
  import noticeGroupEdit from './noticeGroupEdit'
  export default {
    name: 'edit',
    components: {
      VueEditor,
      noticeGroupEdit
    },
    data() {
      return {
        formLoading: false,
        groupDialogVisible: false,
        titleLoading: false,
        isDisabled: false,
        showSave: true,
        CYLXRData: [],
        transferCYLXRData: [],
        uploadAction: this.UploadAttachment.uploadFileUrl,
        uploadImgs: [],
        loading: false,
        noticeForm: {
          title: '',
          content: '',
          attachements: '',
          messageStatus: '',
          userId: '',
          userName: '',
          curDeptId: '',
          curDeptName: '',
          curDeptCode: '',
          recipient: '',
          receiveDept: []
        },
        deptList: [],
        rules: {
          title: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const regEnCode = this.$regCode
              const regCnCode = this.$regCode
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入标题'))
              } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                callback(new Error('标题不能输入特殊字符'))
              } else if (value.length > 50) {
                callback(new Error('标题长度不能超过 50个字符'))
              } else {
                return this.titleCheckAsyns(callback)
              }
            }
          }],
          receiveDept: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value.length === 0) {
                return callback(new Error('请选择接收单位'))
              }
              return callback()
            }
          }],
          content: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                return callback(new Error('请输入站内信息正文'))
              } else if (value.length > 65000) {
                return callback(new Error('通知内容长度不能超过 65000个字符'))
              }
              return callback()
            }
          }]
        },
        curDept: {},
        curUser: {},
        titleCheckFlag: false,
        checkFlag: this.$isViewBtn('149005'),
        id: ''
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        this.titleLoading = true
        // 同步处理
        const response = await this.$updateAsyns('notice/validName', { title: this.noticeForm.title, userId: this.curUser.id })
        const data = response.data
        if (this.id !== '') {
          if (data.data === null || data.data.length === 0 || (this.id === data.data[0].id && data.data.length === 1)) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            if (this.isDisabled) {
              callback = callback(Error('通知标题重复，请确认是否已转发！'))
            } else {
              callback = callback(Error('通知标题重复，请确认后重新输入！'))
            }
          }
        } else {
          if (data.data === undefined || data.data === null || data.data.length === 0) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('通知标题重复，请确认后重新输入！'))
          }
        }
        this.titleLoading = false
        return callback
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
      beforeUpload(file) {
        const msg = this.UploadAttachment.fileValid_Notice(file)
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
        this.noticeForm.attachements = JSON.stringify(arr)
      },
      onSubmit(status) {
        this.loading = true
        this.$refs.noticeForm.validate(valid => {
          if (valid) {
            this.handleImg()
            this.noticeForm.messageStatus = status
            this.noticeForm.userId = this.curUser.id
            this.noticeForm.userName = this.curUser.realName
            this.noticeForm.curDeptId = this.curDept.id
            this.noticeForm.curDeptName = this.curDept.depName
            this.noticeForm.curDeptCode = this.curDept.depCode
            const data = []
            for (let i = 0; i < this.CYLXRData.length; i++) {
              const item = this.CYLXRData[i]
              for (let j = 0; j < this.noticeForm.receiveDept.length; j++) {
                const groupId = this.noticeForm.receiveDept[j]
                if (item.groupId === groupId) {
                  data.push({ group: item.groupId, type: item.type, list: item.detail })
                }
              }
            }
            this.noticeForm.recipient = JSON.stringify(data)
            this.noticeForm.checkFlag = this.checkFlag
            if (this.id) {
              this.noticeForm.id = this.id
              this.$update('notice/update', this.noticeForm).then((response) => {
                if (response.success === true) {
                  this.timeOutBack()
                  this.$message({
                    message: '编辑通知信息成功！',
                    type: 'success'
                  })
                }
              }).catch(() => {
                this.loading = false
              })
            } else {
              this.$save('notice/save', this.noticeForm).then((response) => {
                this.timeOutBack()
                this.$message({
                  message: '通知信息' + (status === 0 ? '保存' : '提交') + '成功！',
                  type: 'success'
                })
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            this.loading = false
            console.log('error submit!!')
            return false
          }
        })
      },
      timeOutBack() {
        const _this = this
        setTimeout(function() {
          _this.loading = false
          _this.callBack()
        }, 2000)
      },
      cancelEdit() {
        this.$confirm('是否放弃当前编辑的通知信息？', '提示', {
          type: 'warning',
          cancelButtonText: '否',
          confirmButtonText: '是'
        }).then(() => {
          this.callBack()
        })
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
      contentChange(val) {
        this.$refs.noticeForm.validateField('content')
      },
      callBack() {
        // this.$router.back(-1)
        this.$gotoid('/notice/index')
      },
      checkCYLXR() {
        // 调用查询常用联系人接口
        this.$query('group/groupinfo', { creatorId: this.curUser.id, deptCode: this.curDept.depCode }).then(response => {
          if (response.data === null || response.data === undefined || response.data.length === 0) {
            this.$confirm('常用联系人组未设置，是否先前往设定常用联系人组？', '提示', {
              type: 'warning',
              cancelButtonText: '否',
              confirmButtonText: '是'
            }).then(() => {
              // TODO 跳转至常用联系人设置页面
              this.$gotoid('/groups/groupsSave')
            }).catch(() => {
            })
          } else {
            this.CYLXRData = response.data
            const tData = []
            for (let i = 0; i < response.data.length; i++) {
              const item = response.data[i]
              tData.push({ label: item.groupName, key: item.groupId })
            }
            this.transferCYLXRData = tData
          }
        })
      },
      detail() {
        this.formLoading = true
        let id = this.id
        if (this.noticeForm.parentId) {
          id = this.noticeForm.parentId
        }
        this.$query('notice/' + id).then(response => {
          this.formLoading = false
          if (this.noticeForm.parentId) {
            this.noticeForm.title = '（转发）' + response.data.title
            this.noticeForm.content = response.data.content
          } else {
            this.noticeForm = {
              title: response.data.title,
              content: response.data.content,
              messageStatus: response.data.messageStatus,
              receiveDept: []
            }
            if (response.data.recipient !== undefined && response.data.recipient !== null && response.data.recipient !== '[]') {
              const data = []
              const reJson = JSON.parse(response.data.recipient)
              for (let i = 0; i < reJson.length; i++) {
                const item = reJson[i]
                data.push(item.group)
              }
              this.noticeForm.receiveDept = data
            } else {
              this.noticeForm.receiveDept = []
            }
            if (response.data.attachements !== undefined && response.data.attachements !== null && response.data.attachements !== '') {
              this.uploadImgs = JSON.parse(response.data.attachements)
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      },
      addGroup() {
        this.groupDialogVisible = true
        if (this.$refs.noticeGroupEdit) {
          this.$refs.noticeGroupEdit.queryDept()
        }
      },
      closeDialog() {
        this.groupDialogVisible = false
        this.checkCYLXR()
        this.$refs.noticeGroupEdit.clear()
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.checkCYLXR()
      if (sessionStorage.getItem(this.$route.path)) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param.parentId) {
          this.isDisabled = true
          this.noticeForm.parentId = param.parentId
        } else {
          this.id = param.id
        }
        this.detail()
      }
    }
  }
</script>

<style>
  .noticeEdit .el-upload.el-upload--text, .noticeEdit .el-upload-dragger{
    width: 100%;
  }
  .noticeEdit .content .el-form-item__label:after {
    content: '*';
    color: #f56c6c;
    margin-left: 5px;
  }
  .noticeEdit .noticeCard{
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .noticeEdit p{
    margin: 20px 0 10px;
  }
  .noticeEdit p:first-child{
    margin-top: 0;
  }
  .noticeEdit .noticeCard .el-transfer-panel {
    width: 44%;
  }
  .noticeEdit .noticeCard .ql-image{
    display: none;
  }
  .noticeEdit .content .el-form-item__content{
    margin-bottom: 10px;
  }
  .noticeEdit .content .el-form-item__content > span{
    position: absolute;
  }
  .noticeEdit .content .el-form-item__error {
    margin-top: 10px;
  }
  .noticeEdit .transfer{
    margin-bottom: 30px;
  }
  .noticeEdit .transfer .el-form-item__error{
    margin-top: 10px;
  }
  .noticeEdit .group{
    position: absolute;
    left: 45%;
    top: 5px;
  }
  .noticeEdit .noticeGroupEdit{
    padding: 0 30px;
  }
  .noticeEdit .noticeGroupEdit .el-col-18{
    width: 100%;
  }
  .noticeEdit .el-dialog__header{
    text-align: center;
  }
  .noticeEdit .noticeGroupEdit .btn{
    text-align: right;
    width: 100%;
    padding-right: 0;
    margin-bottom: 0;
  }
  .noticeEdit .el-dialog{
    width: 57%;
  }
  .noticeEdit .noticeGroupEdit .el-transfer-panel {
    width: 44%;
  }
  @media screen and (min-width: 1700px) and (max-width: 1920px) {
    .noticeEdit .noticeCard .el-transfer-panel {
      width: 45%;
    }
    .noticeEdit .group{
      left: 46%;
    }
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 45%;
    }
  }
  @media screen and (min-width: 1280px) and (max-width: 1599px) {
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 42%;
    }
  }
  @media screen and (min-width: 1152px) and (max-width: 1279px) {
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 43%;
    }
    .noticeEdit .el-dialog{
      width: 70%;
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1151px) {
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 41%;
    }
    .noticeEdit .el-dialog{
      width: 70%;
    }
  }
  @media screen and (max-width: 1023px) {
    .noticeEdit .noticeGroupEdit .el-transfer-panel {
      width: 39%;
    }
    .noticeEdit .el-dialog{
      width: 75%;
    }
  }
</style>
