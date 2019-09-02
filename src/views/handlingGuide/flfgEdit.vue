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
            <el-form-item label="颁布机关">
              <el-input v-model="casezy.establishmentOrgan" maxlength="50" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="颁布日期">
              <el-date-picker v-model="casezy.issueDate"  type="date" placeholder="颁布日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="施行日期">
              <el-date-picker v-model="casezy.enforcementDate"  type="date" placeholder="施行日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="时效性">
              <el-input v-model="casezy.timeliness" size="small" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="颁布文号">
              <el-input v-model="casezy.enactment" size="small" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="content">
              <vue-editor v-model="casezy.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;"></vue-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onEdit" v-loading.fullscreen.lock="loading">保 存
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
          syhFllb: '',
          lawCategory: '',
          lawCategoryName: '',
          title: '',
          content: '',
          establishmentOrgan: '',
          enactment: '',
          issueDate: '',
          enforcementDate: '',
          timeliness: '',
          annex: '',
          createUser: '',
          mergeUser: ''
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
              max: 40000, message: '内容过长请修改内容', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      callback() {
        this.$router.push('/handlingGuide/flfgList')
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
      onEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.casezy.enforcementDate = this.casezy.enforcementDate ? this.$parseTime(this.casezy.enforcementDate, '{y}-{m}-{d}') : ''
            this.casezy.issueDate = this.casezy.issueDate ? this.$parseTime(this.casezy.issueDate, '{y}-{m}-{d}') : ''
            this.casezy.lawCategoryName = this.getCategoryData(this.casezy.lawCategory)
            if (sessionStorage.getItem(this.$route.path)) {
              this.casezy.id = this.id
              this.$update('syhlaws/' + this.id, this.casezy).then(response => {
                this.$router.push('/handlingGuide/flfgList')
              })
            } else {
              this.$save('syhlaws', this.casezy).then(response => {
                this.$router.push('/handlingGuide/flfgList')
              })
            }
          }
        })
      },
      getDetail() {
        this.loading = true
        this.$query('syhlaws/' + this.id, {}).then(response => {
          this.loading = false
          this.casezy = response.data
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
      }
    },
    mounted() {
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.currentDep && curUser) {
        this.casezy.createUser = curUser.id
        this.casezy.mergeUser = curUser.id
      }
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        this.id = sessionStorage.getItem(this.$route.path)
        this.getDetail()
      }
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
