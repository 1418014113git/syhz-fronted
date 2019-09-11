<template>
<div>
  <el-row class="caseEdit">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
  </el-row>
  <el-card class="caseEdit">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3>
          <p style="display: inline-block; width: 120px; text-align: right; padding-right: 0;">案例指引</p>
        </h3>
        <el-form :model="casezy" size="small" ref="form" :rules="rules" label-width="180px">
          <!--<el-form-item label="创建人">-->
            <!--<el-input v-model="casezy.createUser" size="small" :disabled="true" class="input_w"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="创建部门">-->
            <!--<el-input v-model="casezy.createDept" size="small" :disabled="true" class="input_w"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="来源：" prop="source">
            <el-select v-model="casezy.source" placeholder="请选择" class="input_w2" clearable>
              <el-option label="公安内部" value="0"></el-option>
              <el-option label="最高法院" value="1"></el-option>
              <el-option label="最高检察院" value="2"></el-option>
              <el-option label="其他" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：" prop="caseType">
              <el-select v-model="casezy.caseType" placeholder="请选择" class="input_w2" clearable>
                <el-option label="食品" value="0"></el-option>
                <el-option label="药品" value="1"></el-option>
                <el-option label="环境" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地域：" prop="caseArea">
              <el-select v-model="casezy.caseArea" placeholder="请选择" class="input_w2" clearable>
                <el-option label="区内" value="0"></el-option>
                <el-option label="区外" value="1"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model="casezy.title" size="small" maxlength="30" class="input_w2"></el-input>
          </el-form-item>
          <el-form-item label="编号：" prop="caseNum">
            <el-input v-model="casezy.caseNum" size="small" class="input_w2" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="关键词：" prop="keywords">
            <el-input v-model="casezy.keywords" size="small" maxlength="30" class="input_w2"></el-input>
          </el-form-item>
          <el-form-item label="摘要：" prop="summary">
            <el-input type="textarea" :autosize="{ minRows: 2}" placeholder="请输入内容"  class="input_w2"
                      v-model="casezy.summary" maxlength="200">
            </el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <vue-editor v-model="casezy.content" useCustomImageHandler @imageAdded="handleImageAdded"  class="input_w2"
                        style="width: 80%;min-width: 500px;"></vue-editor>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!casezy.id" type="primary" @click="onAdd" v-loading.fullscreen.lock="loading">保 存
            </el-button>
            <el-button v-if="casezy.id" type="primary" @click="onEdit" v-loading.fullscreen.lock="loading">保 存
            </el-button>
            <el-button @click="toList">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
  import VueEditor from '@/components/Editor/VueEditor'
  import {
    addCaseGuide, editCaseGuide, getCaseGuideDetail
  } from '@/api/handingGuide'
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
        uploadAction: Attachment.uploadFileUrl,
        id: '',
        loading: false,
        currentDep: {},
        casezy: {
          source: '',
          caseType: '',
          caseArea: '',
          title: '',
          caseNum: '',
          keywords: '',
          summary: '',
          content: ''
        },
        rules: {
          source: [{
            required: true, message: '请选择来源', trigger: 'change'
          }],
          title: [
            {
              required: true, message: '请输入标题', trigger: 'change'
            },
            {
              min: 2, max: 100, message: '标题长度应为2到100个字', trigger: 'blur'
            }
          ],
          caseNum: [
            {
              required: true, message: '请输入编号', trigger: 'blur'
            },
            {
              min: 1, max: 40, message: '编号长度应小于40个字', trigger: 'blur'
            }
          ],
          keywords: [{
            max: 200, message: '关键词不能超过200字', trigger: 'blur'
          }],
          summary: [{
            max: 500, message: '摘要不能超过500字', trigger: 'blur'
          }],
          content: [
            {
              max: 40000, message: '内容过长请修改内容', trigger: 'blur'
            }
          ],
          caseType: [{
            required: true, message: '请选择类型', trigger: 'change'
          }]
        }
      }
    },
    methods: {
      onAdd() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // console.info(JSON.stringify(this.casezy))
            this.casezy.logFlag = 1 // 手动点击时，添加埋点参数
            addCaseGuide(this.casezy).then((response) => {
              if (response.data) {
                this.toList()
              }
            })
          }
        })
      },
      onEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.casezy.logFlag = 1 // 手动点击时，添加埋点参数
            editCaseGuide(this.casezy).then((response) => {
              if (response.data) {
                this.toList()
              }
            })
          }
        })
      },
      getDetail() {
        const para = {
          id: this.id
        }
        this.loading = true
        getCaseGuideDetail(para).then((response) => {
          this.loading = false
          // this.casezy = response.data
          this.casezy.id = response.data.id
          this.casezy.source = response.data.source
          this.casezy.caseType = response.data.case_type
          this.casezy.caseArea = response.data.case_area
          this.casezy.title = response.data.title
          this.casezy.caseNum = response.data.case_num
          this.casezy.keywords = response.data.keywords
          this.casezy.summary = response.data.summary
          this.casezy.content = response.data.content
          this.casezy.createDept = response.data.create_dept
          this.casezy.createUser = response.data.create_user
          delete this.casezy.case_num
          delete this.casezy.create_dept
          delete this.casezy.create_user
          delete this.casezy.create_time
          delete this.casezy.case_area
          delete this.casezy.case_type
        }).catch(() => {
          this.loading = false
        })
      },
      toList() {
        this.$router.push({
          path: '/handlingGuide'
        })
      },
      toback() {
        this.$router.back(-1)
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
      }
    },
    mounted() {
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.currentDep && curUser) {
        this.casezy.createDept = this.currentDep.depName
        this.casezy.createUser = curUser.realName
      }
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.getDetail()
      }
    }
  }
</script>

<style scoped>
  .caseEdit {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .caseEdit h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .caseEdit .input_w2 {
    width: 80%;
  }

  .caseEdit .el-form-item {
    margin-bottom: 16px;
  }
</style>
