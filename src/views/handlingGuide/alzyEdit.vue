<template>
  <div class="alzyEdit">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form :model="lawInfo" size="small" ref="form" :rules="rules" label-width="110px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="lawInfo.title" size="small" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="articleType">
              <el-select v-model="lawInfo.articleType" placeholder="请选择">
                <el-option label="食品" :value="1"></el-option>
                <el-option label="药品" :value="2"></el-option>
                <el-option label="环境" :value="3"></el-option>
                <el-option label="综合" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-select v-model="lawInfo.category" placeholder="请选择">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地域" prop="region">
              <el-select v-model="lawInfo.region" placeholder="请选择" class="input_w2" clearable>
                <el-option label="省内" :value="0"></el-option>
                <el-option label="省外" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期" prop="publishTime">
              <el-date-picker v-model="lawInfo.publishTime"  type="date" placeholder="发布日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-select v-model="lawInfo.source" placeholder="请选择" class="input_w2" clearable>
                <el-option label="公安内部" :value="0"></el-option>
                <el-option label="最高法院" :value="1"></el-option>
                <el-option label="最高检察院" :value="2"></el-option>
                <el-option label="其他" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyWord">
              <el-input v-model="lawInfo.keyWord" type="text" size="small" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="abstract">
              <el-input v-model="lawInfo.abstract" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个字符！"></el-input>
            </el-form-item>
            <!--<el-form-item label="颁布机关" prop="publishOrgName">-->
              <!--<el-input v-model="lawInfo.publishOrgName" maxlength="50" size="small" ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="颁布日期" prop="publishTime">-->
              <!--<el-date-picker v-model="lawInfo.publishTime"  type="date" placeholder="颁布日期"></el-date-picker>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="施行日期" prop="effectiveTime">-->
              <!--<el-date-picker v-model="lawInfo.effectiveTime"  type="date" placeholder="施行日期"></el-date-picker>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="颁布文号" prop="publishCode">-->
              <!--<el-input v-model="lawInfo.publishCode" size="small" maxlength="20"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="正文" prop="content">
              <vue-editor v-model="lawInfo.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;"></vue-editor>
            </el-form-item>
            <el-form-item label="资料附件">
              <el-upload drag ref="fileUpload"
                         action="/upload/uploadFileSingle"
                         :on-error="fileError"
                         :on-success="fileSuccess"
                         :on-remove="fileRemove"
                         :data="uploadData"
                         :file-list="enclosureList"
                         :before-upload="fileBeforeUpload"
                         :limit="5"
                         multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">视频支持MP4、AVI、WMV，最大2G；音频支持PM3，最大512M；文档最大64M；</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button v-if="showSave" type="primary" class="saveBtn" @click="onEdit('0')" v-loading.fullscreen.lock="loading">保 存</el-button>
              <el-button type="primary" class="saveBtn" @click="onEdit('1')" v-loading.fullscreen.lock="loading">提 交</el-button>
              <el-button @click="callback" class="cancelBtn">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { checkFileName } from '@/api/trainRuleConfig'
  import VueEditor from '@/components/Editor/VueEditor'
  import {
    uploadImg
  } from '@/utils/editorUpload'
  import Attachment from '@/api/attachment'

  export default {
    name: 'caseEdit',
    components: {
      VueEditor
    },
    data() {
      return {
        showSave: true,
        uploadAction: Attachment.uploadFileUrl,
        id: '',
        callBack: '',
        active: '',
        filters: {},
        loading: false,
        currentDep: {},
        lawInfo: {
          articleType: '',
          category: '',
          title: '',
          content: '',
          draft: '',
          departInfo: '',
          enclosure: [],
          region: '',
          source: '',
          keyWord: '',
          abstract: '',
          publishTime: new Date(),
          workId: '',
          documentId: ''
        },
        categoryOptions: [
          { label: '案例', value: 1 },
          { label: '判例', value: 2 },
          { label: '办案指引', value: 3 },
          { label: '技战法', value: 4 }
        ],
        rules: {
          title: [
            {
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                // const regEnCode = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/
                // const regCnCode = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/
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
            }
          ],
          articleType: [{ required: true, message: '请选择类别', trigger: 'change' }],
          category: [{ required: true, message: '请选择分类', trigger: 'change' }],
          source: [{ required: true, message: '请选择来源', trigger: 'change' }],
          content: [{ max: 65000, message: '正文内容长度不能超过 65000个字符', trigger: 'blur' }],
          keyWord: [
            {
              required: false, trigger: 'blur', validator: (rule, value, callback) => {
                if (value === '' || value === undefined) {
                  return callback()
                }
                // const regEnCode = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/
                // const regCnCode = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/
                const regEnCode = this.$regCode
                const regCnCode = this.$regCode
                if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                  callback(new Error('关键词不能输入特殊字符'))
                } else if (value.length > 50) {
                  callback(new Error('关键词长度不能超过 50个字符'))
                } else {
                  callback()
                }
              }
            }
          ],
          abstract: [
            {
              required: false, trigger: 'blur', validator: (rule, value, callback) => {
                if (value === '' || value === undefined) {
                  return callback()
                }
                // const regEnCode = /[`~!@$%^&()_+<>?:"{},.\/;'[\]]/
                // const regCnCode = /[·！￥（——）：；“”‘、，|《。》？、【】[\]]/
                const regEnCode = this.$regCode
                const regCnCode = this.$regCode
                if (value.length > 0 && regEnCode.test(value) && regCnCode.test(value)) {
                  callback(new Error('摘要不能输入特殊字符'))
                } else if (value.length > 500) {
                  callback(new Error('摘要长度不能超过 500个字符'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        enclosureList: [],
        uploadData: {
          uploadDate: '',
          uploadUserId: ''
        },
        uploadFileType: '',
        departInfo: {},
        titleCheckFlag: false,
        nameCheckFlag: true,
        curUser: {}
      }
    },
    methods: {
      async titleCheckAsyns(callback) {
        // 同步处理
        const response = await this.$updateAsyns('traincaseinfobytitle', { title: this.lawInfo.title })
        const data = response.data
        if (this.id !== '') {
          if (data.data === null || data.data.length === 0 || (this.id === data.data[0].id && data.data.length === 1)) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('标题不能重复'))
          }
        } else {
          if (data.data === undefined || data.data === null || data.data.length === 0) {
            this.titleCheckFlag = true
            callback = callback()
          } else {
            this.titleCheckFlag = false
            callback = callback(Error('标题不能重复'))
          }
        }
        return callback
      },
      callback() {
        if (this.callBack === '') {
          this.$gotoid('/handlingGuide/alzyList', JSON.stringify(this.filters))
        } else {
          const para = {
            filters: this.filters,
            active: this.active
          }
          this.$gotoid('/handlingGuide/knowLedgeBase', JSON.stringify(para))
        }
      },
      getCategoryData(key) {
        let a = ''
        this.categoryOptions.forEach(item1 => {
          if (item1.value === key) {
            a += item1.label + ','
          }
        })
        return a
      },
      checkEnclosure() {
        let cfNum = 0
        for (let i = 0; i < this.lawInfo.enclosure.length; i++) {
          const curFile = this.lawInfo.enclosure[i]
          if (i < this.lawInfo.enclosure.length - 1) {
            const nextFile = this.lawInfo.enclosure[i + 1]
            if (curFile.enName === nextFile.enName && curFile.enClass === nextFile.enClass) {
              cfNum += 1
            }
          }
        }
        return cfNum > 0
      },
      onEdit(draft) {
        this.lawInfo.draft = draft
        this.loading = true
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.lawInfo.content === '' && this.lawInfo.enclosure.length === 0) {
              this.$message({
                message: '正文和附件，必须确保有一个不能为空',
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
            let para = JSON.parse(JSON.stringify(this.lawInfo))
            para.publishTime = this.lawInfo.publishTime ? this.$parseTime(this.lawInfo.publishTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
            para.logFlag = 1 // 手动点击时，添加埋点参数
            para.enclosure = JSON.stringify(this.lawInfo.enclosure)
            para.departInfo = this.departInfo
            para = this.$setCurrentUser(para)
            para.belongAreaCode = para.areaCode
            para.adminFlag = this.$isViewBtn('129405') ? '0' : '1'
            if (this.id !== '') {
              if (!this.nameCheckFlag) {
                this.$alert('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！', '提示', {
                  confirmButtonText: '知道了',
                  callback: action => {
                  }
                })
                this.loading = false
                return false
              }
              this.lawInfo.id = this.id
              para.subType = draft
              para.id = this.id
              this.$update('caseinfo/update', para).then(response => {
                this.loading = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.callback()
              }).catch(() => {
                this.loading = false
              })
            } else {
              this.$update('caseinfo/save', para).then(response => {
                this.loading = false
                this.$message({
                  message: '添加成功',
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
      parentdepartcode() {
        const para = this.$setCurrentUser({})
        this.$query('parentdepartcode/' + para.belongDepCode, para, true).then(response => {
          this.departInfo = response.data
        })
      },
      getDetail() {
        this.loading = true
        this.$query('caseinfo/' + this.id, {}).then(response => {
          this.loading = false
          this.lawInfo = response.data
          this.showSave = (this.lawInfo.draft !== '1' && this.lawInfo.draft !== 1)
          this.lbChange(this.lawInfo.articleType, '1')
          for (let i = 0; i < response.data.enclosure.length; i++) {
            const item = response.data.enclosure[i]
            this.enclosureList.push({
              name: item.enName + item.enClass,
              url: item.enPathOld
            })
          }
        }).catch(() => {
          this.loading = false
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
        if (this.lawInfo.enclosure.length === 5) {
          this.$message({
            message: '最多可一次性上传5个文件！',
            type: 'error'
          })
          return false
        }
        if (this.detailId === undefined || this.detailId === null || this.detailId === '') {
          const rejected = checkFileName('knowledgeenclosurebyname', {
            belongMode: '4',
            enName: file.name.substring(0, file.name.lastIndexOf('.')),
            enClass: file.name.substring(file.name.lastIndexOf('.'), file.name.length)
          })
          rejected.catch(() => {
            this.nameCheckFlag = true
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
          order: this.lawInfo.enclosure.length + 1
        }
        this.lawInfo.enclosure.push(data)
      },
      fileRemove(file, fileList) {
        if (file.response) {
          this.lawInfo.enclosure.splice(this.lawInfo.enclosure.indexOf(file.response.data), 1)
        } else {
          this.lawInfo.enclosure.splice(this.lawInfo.enclosure.indexOf(file.url), 1)
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
      }
    },
    watch: {
      // 'nameCheckFlag': function(val) {
      //   if (!val) {
      //     this.clearErrorFileList()
      //   }
      // }
    },
    mounted() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.parentdepartcode()
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.id) {
          this.id = para.id
          this.getDetail()
        }
        if (para.jumpType) {
          this.callBack = para.jumpType
          this.active = para.active
        }
        if (para.checkboxGroup1) {
          this.filters = para
        } else {
          this.filters = para.filters
        }
      }
    }
  }
</script>

<style>
.alzyEdit .input_w {
	width: 300px;
}

.alzyEdit .el-form-item {
	margin-bottom: 16px;
}
.alzyEdit .el-select,
.alzyEdit .el-date-editor--date {
  width: 100%;
}
.alzyEdit .el-upload.el-upload--text, .alzyEdit .el-upload-dragger{
  width: 100%;
}
.alzyEdit .caseEdit .ql-image{
  display: none;
}
</style>
