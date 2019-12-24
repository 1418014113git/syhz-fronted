<template>
  <div class="insideInfoSave">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="callback">
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form :model="form" size="small" ref="form" :rules="rules" label-width="110px">
            <el-form-item label="类别" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
                <el-option label="环境" value="3"></el-option>
                <el-option label="食品" value="1"></el-option>
                <el-option label="药品" value="2"></el-option>
                <el-option label="综合" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容简介" prop="describe">
              <el-input v-model="form.describe" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个字符！"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload drag
                :action="uploadAction"
                :before-upload="pictureBeforeUpload"
                :on-error="pictureError"
                :on-success="pictureSuccess"
                :on-remove="pictureRemove"
                         :file-list="imgList" :limit="1"
                >
                <img v-if="form.enIcon" :src="form.enIcon" class="avatar">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="资料附件">
              <el-upload drag ref="fileUpload"
                action="/upload/uploadFileSingle"
                :before-upload="fileBeforeUpload"
                :on-error="fileError"
                :on-success="fileSuccess"
                :on-remove="fileRemove"
                :data="uploadData"
                :file-list="enclosureList"
                 :limit="5"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">视频支持MP4、AVI、WMV，最大2G；音频支持PM3，最大512M；文档最大64M；<br>资料标题是上传的资料名称，上传前请确认资料名称！</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="saveBtn" @click="add('1')" v-loading.fullscreen.lock="loading">提 交</el-button>
              <el-button @click="callback" class="cancelBtn">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { checkFileName, moveInfo } from '@/api/trainRuleConfig'
  export default {
    data() {
      return {
        showSave: true,
        uploadAction: this.UploadAttachment.uploadFileUrl,
        filters: {},
        detailId: '',
        loading: false,
        uploadFileType: '',
        uploadData: {
          uploadDate: new Date().getTime(),
          uploadUserId: ''
        },
        departInfo: {},
        form: {
          type: '',
          describe: '',
          enIcon: '',
          enclosure: []
        },
        imgList: [],
        enclosureList: [],
        rules: {
          type: [{
            required: true, trigger: 'blur', message: '请选择类别'
          }],
          describe: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (value !== undefined && value !== null && value !== '' && value.length > 500) {
                return callback(new Error('内容简介不能超过 500个字符'))
              }
              return callback()
            }
          }]
        },
        nameCheckFlag: true,
        currentFile: '',
        curUser: {},
        moveId: ''
      }
    },
    methods: {
      checkEnclosure() {
        let cfNum = 0
        for (let i = 0; i < this.form.enclosure.length; i++) {
          const curFile = this.form.enclosure[i]
          if (i < this.form.enclosure.length - 1) {
            const nextFile = this.form.enclosure[i + 1]
            if (curFile.enName === nextFile.enName && curFile.enClass === nextFile.enClass) {
              cfNum += 1
            }
          }
        }
        return cfNum > 0
      },
      add(draft) {
        this.form.draft = draft
        this.loading = true
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.form.enclosure.length === 0) {
              this.$message({
                message: '请至少上传一个资料附件',
                type: 'warning'
              })
              this.loading = false
              return false
            }
            if (this.checkEnclosure()) {
              this.$alert('您上传的资料列表中存在同名且同格式的文件，请确认一个，重新上传！', '提示', {
                confirmButtonText: '知道了',
                callback: action => {
                }
              })
              this.loading = false
              return false
            }
            let para = JSON.parse(JSON.stringify(this.form))
            para.enclosure = JSON.stringify(this.form.enclosure)
            para.departInfo = this.departInfo
            para = this.$setCurrentUser(para)
            para.adminFlag = this.$isViewBtn('139010') ? '0' : '1'
            para.moveFlag = 1
            // 调用保存接口
            this.$save('traincourse', para).then(response => {
              this.loading = false
              this.$update('reptileinfostatus/' + this.moveId, { status: 2 }).then(response => {
                this.$message({
                  message: '上传资料成功',
                  type: 'success'
                })
              })
              this.callback()
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
      },
      callback() {
        sessionStorage.setItem(this.$route.path, '')
        this.$gotoid('/insideInfo/insideInfoList', JSON.stringify({ filters: this.filters }))
      },
      pictureBeforeUpload(file) {
        const imageReg = /^(image\/jpg)|(image\/jpeg)|(image\/png)$/
        if (!imageReg.test(file.type)) {
          this.$message({
            message: '上传附件只支持 jpg、jpeg、png 图片格式',
            type: 'warning'
          })
          return false
        }
        if (file.size / 1024 / 1024 > 5) {
          this.$message({
            message: '文件上传失败！上传文档大小不得超过5M！',
            type: 'error'
          })
          return false
        }
      },
      pictureError() {
        this.$message({
          message: '图片上传失败！上传图片大小不得超过500K！',
          type: 'error'
        })
      },
      pictureSuccess(response, file, fileList) {
        if (response.code !== '000000') {
          this.$alert(response.message + '， 请重新上传', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.clearFileList()
            }
          })
          return false
        }
        this.form.enIcon = response.data
      },
      pictureRemove(file, fileList) {
        if (file.response) {
          this.form.enIcon = ''
        } else {
          this.form.enIcon = ''
        }
      },
      fileBeforeUpload(file) {
        this.uploadData.uploadUserId = this.curUser.id
        this.uploadData.uploadDate = this.$parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')
        this.uploadData.fileName = file.name
        const wordReg = /^(application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(application\/msword)$/
        const pdfReg = /^(application\/vnd.openxmlformats-officedocument.presentationml.presentation)|(application\/pdf)$/
        const pptReg = /^(application\/vnd.ms-powerpoint)$/
        const videoReg = /^(video\/mp4)|(video\/avi)|(video\/x-ms-wmv)$/
        const audioReg = /^(audio\/mp3)$/
        let flag = false
        if (wordReg.test(file.type) || pdfReg.test(file.type) || pptReg.test(file.type)) {
          this.uploadFileType = '0'
          flag = true
          if (file.size / 1024 / 1024 > 64) {
            this.$message({
              message: '文件上传失败！上传文档大小不得超过64M！',
              type: 'error'
            })
            return false
          }
        }
        if (videoReg.test(file.type)) {
          this.uploadFileType = '1'
          flag = true
          if (file.size / 1024 / 1024 / 1024 > 2) {
            this.$message({
              message: '文件上传失败！上传视频大小不得超过2G！',
              type: 'error'
            })
            return false
          }
        }
        if (audioReg.test(file.type)) {
          this.uploadFileType = '2'
          flag = true
          if (file.size / 1024 / 1024 > 512) {
            this.$message({
              message: '文件上传失败！上传音频大小不得超过512M！',
              type: 'error'
            })
            return false
          }
        }
        if (!flag) {
          this.$message({
            message: '仅支持Word、PDF、视频、音频和PPT文件',
            type: 'error'
          })
          return false
        }
        if (this.detailId !== '') {
          if (this.form.enclosure.length === 1) {
            this.$message({
              message: '编辑时只能上传1个文件！',
              type: 'error'
            })
            return false
          }
        } else {
          if (this.form.enclosure.length === 5) {
            this.$message({
              message: '最多可一次性上传5个文件！',
              type: 'error'
            })
            return false
          }
        }
        if (this.detailId === undefined || this.detailId === null || this.detailId === '') {
          const rejected = checkFileName('traincourseonly', {
            enName: file.name.substring(0, file.name.lastIndexOf('.')),
            entype: this.uploadFileType
          })
          rejected.catch(() => {
            this.$alert('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！', '提示', {
              confirmButtonText: '知道了',
              callback: action => {
              }
            })
          })
          return rejected
        }
      },
      fileError() {
      },
      fileSuccess(response, file, fileList) {
        this.loading = false
        if (response.code !== '000000') {
          this.$alert(response.message + '， 请重新上传', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.clearFileList()
            }
          })
          return false
        }
        const enPathOld = response.data
        let enPathNew = ''
        const cl = enPathOld.substring(enPathOld.lastIndexOf('.') + 1, enPathOld.length)
        if (cl === 'docx' || cl === 'doc' || cl === 'ppt' || cl === 'pptx') {
          enPathNew = enPathOld.substring(0, enPathOld.lastIndexOf('.')) + '.pdf'
        } else {
          if (cl === 'mp4') {
            enPathNew = enPathOld.substring(0, enPathOld.lastIndexOf('/') + 1) + 'conversion_' + enPathOld.substring(enPathOld.lastIndexOf('/') + 1)
          } else if (cl === 'avi' || cl === 'wmv') {
            enPathNew = enPathOld.substring(0, enPathOld.lastIndexOf('/') + 1) + 'conversion_' + enPathOld.substring(enPathOld.lastIndexOf('/') + 1, enPathOld.lastIndexOf('.')) + '.mp4'
          } else {
            enPathNew = enPathOld
          }
        }
        const data = {
          enCode: '1',
          enType: this.uploadFileType,
          enClass: file.name.substring(file.name.lastIndexOf('.'), file.name.length),
          enName: file.name.substring(0, file.name.lastIndexOf('.')),
          enPath: enPathNew,
          enPathOld: enPathOld,
          order: this.form.enclosure.length + 1
        }
        this.form.enclosure.push(data)
      },
      fileRemove(file, fileList) {
        if (file.response) {
          this.form.enclosure.splice(this.form.enclosure.indexOf(file.response.data), 1)
        } else {
          this.form.enclosure.splice(this.form.enclosure.indexOf(file.url), 1)
        }
      },
      clearFileList() {
        this.$refs.fileUpload.abort()
        const elementArr = document.getElementsByClassName('el-upload-list__item')
        for (let i = 0; i < elementArr.length; i++) {
          const element = elementArr[i]
          if (i === elementArr.length - 1) {
            element.setAttribute('style', 'display: none;')
            element.remove()
          }
        }
      },
      clearErrorFileList() {
        this.$refs.fileUpload.abort(this.currentFile)
        const elementArr = document.getElementsByClassName('el-upload-list__item')
        for (let i = 0; i < elementArr.length; i++) {
          const element = elementArr[i]
          const className = element.getAttribute('class')
          if (className.indexOf('is-ready') > -1 || className.indexOf('is-uploading') > -1) {
            element.setAttribute('style', 'display: none;')
            element.remove()
          }
        }
      },
      parentdepartcode() {
        const para = this.$setCurrentUser({})
        this.$query('parentdepartcode/' + para.belongDepCode, para, true).then(response => {
          this.departInfo = response.data
        })
      },
      detail() {
        this.$query('traincourselist/' + this.detailId).then(response => {
          this.form = {
            type: response.data.type + '',
            describe: response.data.describe,
            enIcon: response.data.enIcon,
            enclosure: [{
              enCode: '1',
              enType: response.data.enType,
              enClass: response.data.enClass,
              enName: response.data.enName,
              enPath: response.data.enPath,
              enPathOld: response.data.enPathOld
            }],
            draft: response.data.draft
          }
          this.showSave = (response.data.draft !== '1' && response.data.draft !== 1)
          this.imgList = [{
            name: response.data.enIcon.substring(response.data.enIcon.lastIndexOf('/') + 1, response.data.enIcon.length),
            url: response.data.enIcon
          }]
          this.enclosureList = [{
            name: response.data.enName + response.data.enClass,
            url: response.data.enPath
          }]
        })
      },
      queryMove(moveId) {
        const para = {
          id: moveId
        }
        moveInfo(para).then(response => {
          this.form.type = response.data.artGroup
          this.form.content = response.data.artContent
          this.form.title = response.data.artTitle
        })
      }
    },
    mounted() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.parentdepartcode()
      if (sessionStorage.getItem(this.$route.path)) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param !== undefined && param !== null && param !== '') {
          if (param.id) {
            this.detailId = param.id
            this.detail()
          }
          if (param.moveId) {
            this.moveId = param.moveId
            this.queryMove(param.moveId)
            this.filters = param.filters
          } else {
            this.source = param.jumpType
            this.form.type = param.active
            this.active = param.active
            this.filters = param.param
          }
        }
      }
    }
  }
</script>
<style>
  .insideInfoSave .el-upload.el-upload--text, .insideInfoSave .el-upload-dragger{
    width: 100%;
  }
  .insideInfoSave .avatar-uploader .el-upload {
    border: 1px dashed #409EFF;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .insideInfoSave .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .insideInfoSave .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .insideInfoSave .avatar {
    width: 100%;
    height: 100%;
    padding: 15px;
    display: block;
  }
</style>
