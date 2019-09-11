<template>
  <div>
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <el-card class="caseEdit">
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-col :span="18">
          <el-form :model="casezy" size="small" ref="form" :rules="rules" label-width="110px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="casezy.title" size="small" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="syhFllb">
              <el-select v-model="casezy.syhFllb" placeholder="请选择">
                <el-option label="食品" value="1"></el-option>
                <el-option label="药品" value="2"></el-option>
                <el-option label="环境" value="3"></el-option>
                <el-option label="综合" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="lawCategory">
              <el-select v-model="casezy.lawCategory" placeholder="请选择">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="casezy.author" maxlength="50" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="浏览时长">
              <el-select v-model="casezy.issueDate" placeholder="请选择">
                <el-option label="10分钟" value="1"></el-option>
                <el-option label="20分钟" value="2"></el-option>
                <el-option label="30分钟" value="3"></el-option>
                <el-option label="40分钟" value="4"></el-option>
                <el-option label="50分钟" value="5"></el-option>
                <el-option label="60分钟" value="6"></el-option>
                <el-option label="70分钟" value="7"></el-option>
                <el-option label="80分钟" value="8"></el-option>
                <el-option label="90分钟" value="9"></el-option>
                <el-option label="100分钟" value="10"></el-option>
                <el-option label="110分钟" value="11"></el-option>
                <el-option label="120分钟" value="12"></el-option>
                <el-option label="其他" value="13"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期">
              <el-date-picker v-model="casezy.enforcementDate"  type="date" placeholder="施行日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="casezy.enabled" placeholder="请选择">
                <el-option label="可读" value="1"></el-option>
                <el-option label="不可读" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传附件" style="margin-top: 15px;">
              <el-upload class="upload-demo" drag multiple :action="uploadAction"
                         :auto-upload="true"
                         :file-list="attachment"
                         :on-success="imgSuccess"
                         :on-remove="imgRemove"
                         :on-preview="imgPreview"
                         :before-remove="imgBfRemove"
                         :before-upload="beforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传MP4，mp5等视屏文件</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="详情" prop="content">
              <vue-editor v-model="casezy.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;"></vue-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add" v-loading.fullscreen.lock="loading">保 存
              </el-button>
              <el-button @click="callback">取 消</el-button>
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
    uploadImg
  } from '@/utils/editorUpload'
  import Attachment from '@/api/attachment'

  export default {
    name: 'knowledgeAdd',
    components: {
      VueEditor
    },
    data() {
      return {
        attachment: [],
        uploadAction: Attachment.uploadFileUrl,
        id: '',
        loading: false,
        currentDep: {},
        casezy: {
          syhFllb: '',
          lawCategory: '',
          lawCategoryName: '',
          title: '',
          content: '',
          author: '',
          enactment: '',
          issueDate: '',
          enforcementDate: '',
          timeliness: '',
          annex: '',
          createUser: '',
          mergeUser: '',
          enabled: '',
          view: ''
        },
        categoryOptions: [
          {
            label: '法律', value: '1'
          },
          {
            label: '行政法规', value: '2'
          },
          {
            label: '地方性行政法规', value: '201'
          },
          {
            label: '部门规章', value: '202'
          },
          {
            label: '司法解释', value: '3'
          },
          {
            label: '其他规范性文件', value: '4'
          }
        ],
        rules: {
          title: [
            {
              required: true, message: '请输入标题', trigger: 'change'
            },
            {
              min: 2, max: 100, message: '标题长度应为2到100个字', trigger: 'blur'
            }
          ],
          syhFllb: [
            {
              required: true, message: '请选择类别', trigger: 'change'
            }
          ],
          lawCategory: [
            {
              required: true, message: '请选择分类', trigger: 'change'
            }
          ],
          content: [
            {
              max: 200, message: '内容过长请修改内容', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      callback() {
        this.$router.push('/knowledgeBase/knowledgeBank')
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
      add() {
        // logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.push('/knowledgeBase/knowledgeBank')
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
      imgPreview(file) {
      },
      beforeUpload(file) {
        const msg = this.UploadAttachment.fileValid(file)
        if (msg.length > 0) {
          this.$message({
            message: msg, type: 'warning'
          })
          return false
        }
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .caseEdit .input_w {
    width: 300px;
  }

  .caseEdit .el-form-item {
    margin-bottom: 16px;
  }
  .caseEdit .el-select,
  .caseEdit .el-date-editor--date {
    width: 100%;
  }
</style>
