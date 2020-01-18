<template>
  <div class="insideInfoToK">
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
              <el-select v-model="lawInfo.articleType" placeholder="请选择" @change="lbChange">
                <el-option label="食品" :value="1"></el-option>
                <el-option label="药品" :value="2"></el-option>
                <el-option label="环境" :value="3"></el-option>
                <el-option label="综合" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="category" v-if="moduleType === '1'">
              <el-select v-model="lawInfo.category" placeholder="请选择">
                <el-option v-for="item in categoryOptions1" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="category" v-if="moduleType === '2'">
              <el-select v-model="lawInfo.category" placeholder="请选择">
                <el-option v-for="item in categoryOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="category" v-if="moduleType === '4'">
              <el-select v-model="lawInfo.category" placeholder="请选择">
                <el-option v-for="item in categoryOptions4" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颁布机关" prop="publishOrgName" v-if="moduleType !== '4'">
              <el-input v-model="lawInfo.publishOrgName" maxlength="50" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="颁布日期" prop="publishTime" v-if="moduleType !== '4'">
              <el-date-picker v-model="lawInfo.publishTime"  type="date" placeholder="颁布日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="施行日期" prop="effectiveTime" v-if="moduleType !== '4'">
              <el-date-picker v-model="lawInfo.effectiveTime"  type="date" placeholder="施行日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="颁布文号" prop="publishCode" v-if="moduleType !== '4'">
              <el-input v-model="lawInfo.publishCode" size="small" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="地域" prop="region" v-if="moduleType === '4'">
              <el-select v-model="lawInfo.region" placeholder="请选择" class="input_w2" clearable>
                <el-option label="省内" :value="0"></el-option>
                <el-option label="省外" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期" prop="publishTime" v-if="moduleType === '4'">
              <el-date-picker v-model="lawInfo.publishTime"  type="date" placeholder="发布日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="来源" prop="source" v-if="moduleType === '4'">
              <el-select v-model="lawInfo.source" placeholder="请选择" class="input_w2" clearable>
                <el-option label="公安内部" :value="0"></el-option>
                <el-option label="最高法院" :value="1"></el-option>
                <el-option label="最高检察院" :value="2"></el-option>
                <el-option label="其他" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyWord" v-if="moduleType === '4'">
              <el-input v-model="lawInfo.keyWord" type="text" size="small" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="abstract" v-if="moduleType === '4'">
              <el-input v-model="lawInfo.abstract" type="textarea" size="small" maxlength="500" placeholder="最多可输入500个字符！"></el-input>
            </el-form-item>
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
  import { checkFileName, moveInfo } from '@/api/trainRuleConfig'
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
        moduleType: '',
        filters: {},
        loading: false,
        currentDep: {},
        lawInfo: {
          articleType: '',
          category: '',
          title: '',
          content: '',
          draft: '',
          publishOrgName: '',
          publishCode: '',
          publishTime: '',
          effectiveTime: '',
          departInfo: '',
          enclosure: [],
          region: '',
          source: '',
          keyWord: '',
          abstract: '',
          workId: '',
          documentId: ''
        },
        categoryOptions1: [
          { label: '法律', value: 1 },
          { label: '行政法规', value: 2 },
          { label: '地方性行政法规', value: 201 },
          { label: '部门规章', value: 202 },
          { label: '司法解释', value: 3 },
          { label: '其他规范性文件', value: 4 }
        ],
        categoryOptions2: [],
        categoryOptions4: [
          { label: '案例', value: 1 },
          { label: '判例', value: 2 },
          { label: '办案指引', value: 3 },
          { label: '技战法', value: 4 }
        ],
        optionsSP: [
          { value: 1010, label: '食品中可能违法添加的非食用物质名单' },
          { value: 1020, label: '食品中可能滥用的食品添加剂品种名单' },
          { value: 1030, label: '其它食品标准' }
        ],
        optionsYP: [
          { value: 2010, label: '保健食品中易非法添加的物质和组分及检测依据' },
          { value: 2020, label: '化妆品中易非法添加的物质、组分及检测依据' },
          { value: 2030, label: '含可待因复方口服溶液品种目录' },
          { value: 2040, label: '其它药品标准' }
        ],
        optionsHJ: [
          { value: 3010, label: '其它环境标准' }
        ],
        chooseAbleFlag: false,
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
          ],
          publishOrgName: [
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
                  callback(new Error('颁布机关不能输入特殊字符'))
                } else if (value.length > 50) {
                  callback(new Error('颁布机关长度不能超过 50个字符'))
                } else {
                  callback()
                }
              }
            }
          ],
          publishCode: [
            {
              required: false, trigger: 'blur', validator: (rule, value, callback) => {
                if (value === '' || value === undefined) {
                  return callback()
                }
                // const regEnCode = /[`~!@$%^&()_+<>?:"{},.\/;'[\]]/
                // const regCnCode = /[·！￥（——）：；“”‘、，|《。》？、【】[\]]/
                const regEnCode = this.$regCode
                const regCnCode = this.$regCode
                if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
                  callback(new Error('颁布文号不能输入特殊字符'))
                } else if (value.length > 50) {
                  callback(new Error('颁布文号长度不能超过 50个字符'))
                } else {
                  callback()
                }
              }
            }
          ],
          publishTime: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === null || value === '') {
                callback(new Error('请选择颁布日期'))
              } else if (new Date() < value) {
                callback(new Error('颁布日期不能大于当前日期'))
              } else {
                callback()
              }
            }
          }],
          effectiveTime: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (value === null || value === '') {
                return callback(new Error('请选择施行日期'))
              } else if (new Date(this.lawInfo.publishTime) > value) {
                callback(new Error('施行日期不能小于颁布日期'))
              } else {
                callback()
              }
              // else if (new Date() < value) {
              //   callback(new Error('施行日期不能大于当前日期'))
              // }
            }
          }]
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
        curUser: {},
        moveId: ''
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
        sessionStorage.setItem(this.$route.path, '')
        this.$gotoid('/insideInfo/insideInfoList', JSON.stringify({ filters: this.filters }))
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
            para.effectiveTime = this.lawInfo.effectiveTime ? this.$parseTime(this.lawInfo.effectiveTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
            para.publishTime = this.lawInfo.publishTime ? this.$parseTime(this.lawInfo.publishTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
            para.logFlag = 1 // 手动点击时，添加埋点参数
            para.enclosure = JSON.stringify(this.lawInfo.enclosure)
            para.departInfo = this.departInfo
            para = this.$setCurrentUser(para)
            para.belongAreaCode = para.areaCode
            para.adminFlag = this.$isViewBtn('129405') ? '0' : '1'
            para.moveFlag = 1
            let url = ''
            if (this.moduleType === '1') {
              url = 'lawInfo'
            }
            if (this.moduleType === '2') {
              url = 'industryInfo'
            }
            if (this.moduleType === '3') {
              url = 'standardInfo'
            }
            if (this.moduleType === '4') {
              url = 'caseinfo'
            }
            this.$update(url + '/save', para).then(response => {
              this.loading = false
              this.$update('reptileinfostatus/' + this.moveId, { status: 2 }).then(response => {
                this.$message({
                  message: '添加成功',
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
      parentdepartcode() {
        const para = this.$setCurrentUser({})
        this.$query('parentdepartcode/' + para.belongDepCode, para, true).then(response => {
          this.departInfo = response.data
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
      },
      lbChange(val, flag) {
        if (val === 1) { // 食品
          this.categoryOptions2 = this.optionsSP
        } else if (val === 2) { // 药品
          this.categoryOptions2 = this.optionsYP
        } else if (val === 3) { // 环境
          this.categoryOptions2 = this.optionsHJ
        } else if (val === 4) { // 综合
          this.categoryOptions2 = this.optionsYP
        }
        if (flag !== '1') {
          this.lawInfo.category = ''
        }
        this.chooseAbleFlag = false
      },
      queryMove(moveId) {
        const para = {
          id: moveId
        }
        moveInfo(para).then(response => {
          this.lawInfo.articleType = response.data.artGroup
          this.lawInfo.content = response.data.artContent.replace(/<font/g, '<span').replace(/style/g, '').replace(/st1:chsdate/g, 'span').replace(/\n/g, '').replace(/　/g, '')
          this.lawInfo.title = response.data.artTitle
        })
      }
    },
    mounted() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.parentdepartcode()
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.moveId) {
          this.moveId = para.moveId
          this.queryMove(para.moveId)
          this.moduleType = para.moduleType
          this.filters = para.filters
          if (this.moduleType === '4') {
            this.lawInfo.publishTime = new Date()
          }
        }
      }
    }
  }
</script>

<style>
  .insideInfoToK .input_w {
    width: 300px;
  }

  .insideInfoToK .el-form-item {
    margin-bottom: 16px;
  }
  .insideInfoToK .el-select,
  .insideInfoToK .el-date-editor--date {
    width: 100%;
  }
  .insideInfoToK .el-upload.el-upload--text, .insideInfoToK .el-upload-dragger{
    width: 100%;
  }
  .insideInfoToK .caseEdit .ql-image{
    display: none;
  }
</style>
