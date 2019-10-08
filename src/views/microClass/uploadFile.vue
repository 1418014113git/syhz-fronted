<template>
  <div class="classRoom_uploadFile">
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
              <el-input v-model="form.describe" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个文字！"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload drag
                :action="uploadAction"
                :before-upload="pictureBeforeUpload"
                :on-error="pictureError"
                :on-success="pictureSuccess"
                :on-remove="pictureRemove"
                         :file-list="imgList"
                >
                <img v-if="form.enIcon" :src="form.enIcon" class="avatar">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="资料附件">
              <!--action="/syhz/uploadFile"-->
              <el-upload drag ref="fileUpload"
                action="/upload/uploadFileSingle"
                :before-upload="fileBeforeUpload"
                :on-error="fileError"
                :on-success="fileSuccess"
                :on-remove="fileRemove"
                :data="uploadData"
                :file-list="enclosureList"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">支持Word、PDF、视频、音频和PPT文件！最多可一次性上传5个文件！过大的视频文件建议单个上传！（视频支持MP4、AVI、WMV，最大2G；音频支持MP3，最大512M）</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add" class="saveBtn" v-loading.fullscreen.lock="loading">保 存</el-button>
              <el-button @click="callback" class="cancelBtn">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        source: '',
        active: '',
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
                return callback(new Error('内容简介最多可输入500个文字！'))
              }
              return callback()
            }
          }]
        },
        nameCheckFlag: true,
        curUser: {}
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
      add() {
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
            if (this.detailId !== '') {
              if (!this.nameCheckFlag) {
                this.$alert('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！', '提示', {
                  confirmButtonText: '知道了',
                  callback: action => {
                  }
                })
                this.loading = false
                return false
              }
              this.executeUpdate()
            } else {
              let para = JSON.parse(JSON.stringify(this.form))
              para.enclosure = JSON.stringify(this.form.enclosure)
              para.departInfo = this.departInfo
              para = this.$setCurrentUser(para)
              para.aduitFlag = this.$isViewBtn('139010') ? '0' : '1'
              // 调用保存接口
              this.$save('traincourse', para).then(response => {
                this.loading = false
                this.$message({
                  message: '上传资料成功',
                  type: 'success'
                })
                this.callback()
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            this.loading = false
          }
        })
      },
      callback() {
        const param = JSON.stringify(this.filters)
        if (this.source === 'online') {
          this.$gotoid('/micro/onlineClassRoom', param)
        }
        if (this.source === 'trainMaterial') {
          this.$gotoid('/micro/trainMaterial', this.active)
        }
        if (this.source === '0') {
          this.$gotoid('/micro/moreVideo', param)
        }
        if (this.source === '1') {
          this.$gotoid('/micro/moreAudio', param)
        }
        if (this.source === '2') {
          this.$gotoid('/micro/moreDocument', param)
        }
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
        if (file.size / 1024 / 1024 > 500) {
          this.$message({
            message: '图片上传失败！上传图片大小不得超过5M！',
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
        const videoReg = /^(video\/mp4)|(video\/avi)|(video\/wmv)$/
        const audioReg = /^(audio\/mp3)$/
        let flag = false
        if (wordReg.test(file.type) || pdfReg.test(file.type) || pptReg.test(file.type)) {
          this.uploadFileType = '0'
          flag = true
          if (file.size / 1024 > 500) {
            this.$message({
              message: '文件上传失败！上传文档大小不得超过500K！',
              type: 'error'
            })
            return false
          }
        }
        if (videoReg.test(file.type)) {
          this.uploadFileType = '1'
          flag = true
          if (file.size / 1024 / 1024 / 1024 > 500) {
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
          if (this.form.enclosure.length > 5) {
            this.$message({
              message: '最多可一次性上传5个文件！',
              type: 'error'
            })
            return false
          }
        }
        const checkFlag = true
        return this.checkEnName(file, checkFlag)
      },
      async checkEnName(enName) {
        let flag = true
        // 校验文件名称是否重复
        const response = await this.$queryAsyns('traincourseonly', { enName: enName, entype: this.uploadFileType })
        if (response.data.data !== null && response.data.data.length > 0) {
          this.$alert('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！', '提示', {
            confirmButtonText: '知道了',
            callback: action => {
            }
          })
          this.nameCheckFlag = false
          flag = false
        } else {
          this.nameCheckFlag = true
          flag = true
        }
        return flag
      },
      fileError() {
      },
      fileSuccess(response, file, fileList) {
        if (response.code !== '000000') {
          this.$alert(response.message + '， 请重新上传', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.clearFileList()
            }
          })
          return false
        }
        const data = {
          enCode: '1',
          enType: this.uploadFileType,
          enClass: file.name.substring(file.name.lastIndexOf('.'), file.name.length),
          enName: file.name.substring(0, file.name.lastIndexOf('.')),
          enPath: response.data,
          enPathOld: response.data,
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
        this.$refs.fileUpload.abort()
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
        this.$query('parentdepartcode/' + para.belongDepCode, {}, true).then(response => {
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
            }]
          }
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
      executeUpdate() {
        let para = JSON.parse(JSON.stringify(this.form))
        para.enCode = this.form.enclosure[0].enCode
        para.enType = this.form.enclosure[0].enType
        para.enClass = this.form.enclosure[0].enClass
        para.enName = this.form.enclosure[0].enName
        para.enPath = this.form.enclosure[0].enPath
        para.enPathOld = this.form.enclosure[0].enPath
        para = this.$setCurrentUser(para)
        para.lastId = para.creationId
        para.lastName = para.creationName
        this.$update('traincourseupdate/' + this.detailId, para).then(response => {
          this.loading = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.callback()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    watch: {
      'nameCheckFlag': function(val) {
        if (!val) {
          this.clearErrorFileList()
        }
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
          this.source = param.jumpType
          this.active = param.active
          this.filters = param.param
        }
      }
    }
  }
</script>
<style>
  .classRoom_uploadFile .el-upload.el-upload--text, .classRoom_uploadFile .el-upload-dragger{
    width: 100%;
  }
  .classRoom_uploadFile .avatar-uploader .el-upload {
    border: 1px dashed #409EFF;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .classRoom_uploadFile .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .classRoom_uploadFile .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .classRoom_uploadFile .avatar {
    width: 100%;
    height: 100%;
    padding: 15px;
    display: block;
  }
</style>
