<template>
<div>
  <el-row class="caseEdit">
    <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
  </el-row>
  <el-card class="caseEdit" v-loading="loading">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="flfgDetail">
          <div class="lineDetail">
            <div>类别：
              <span v-if="casezy.syhFllb === '1'">食品</span>
              <span v-if="casezy.syhFllb === '2'">药品</span>
              <span v-if="casezy.syhFllb === '3'">环境</span>
              <span v-if="casezy.syhFllb === '4'">综合</span>
            </div>
            <div>分类：<span>{{getCategoryData(casezy.lawCategory)}}</span> </div>
            <div class="detailBtn">
              <el-button type="success" v-if="$isViewBtn('118003') && casezy.createUser === String(curUser.id)" plain @click="doEdit">修改</el-button>
              <!-- <el-button plain @click="callback">返回</el-button> -->
            </div>
          </div>
          <div class="lineDetail">
            <div>颁布机关：<span>{{casezy.establishmentOrgan}}</span></div>
          </div>
          <div class="lineDetail">
            <div>颁布文号：<span>{{casezy.enactment}}</span></div>
          </div>
          <div class="lineDetail">
            <div>颁布日期：<span>{{this.$parseTime(casezy.issueDate, '{y}-{m}-{d}')}}</span></div>
            <div>施行日期：<span>{{this.$parseTime(casezy.enforcementDate, '{y}-{m}-{d}')}}</span></div>
          </div>
          <div class="lineDetail">
            <div>时效性： <span>{{casezy.timeliness}}</span></div>
          </div>
        </div>
        <div class="flfgContent">
          <div class="title">{{casezy.title}}</div>
          <div v-html="casezy.content" class="e-p-line ql-editor" style="padding: 10px 50px;"></div>
        </div>
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
        curUser: {},
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
        ]
      }
    },
    methods: {
      getCategoryData(key) {
        let a = ''
        this.categoryOptions.forEach(item1 => {
          if (item1.value === key) {
            a += item1.label + ','
          }
        })
        return a.substring(0, a.length - 1)
      },
      doEdit() {
        this.$gotoid('/handlingGuide/flfg/edit', this.id)
      },
      callback() {
        this.$router.push({ path: '/handlingGuide/flfgList' })
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
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (sessionStorage.getItem(this.$route.path)) {
        this.id = sessionStorage.getItem(this.$route.path)
        this.getDetail()
      }
    }
  }
</script>

<style scoped>
  .flfgDetail{
    padding: 20px;
    display: inline-block;
    width: 100%;
  }
  .flfgDetail > div.lineDetail{
    width: 100%;
    padding: 5px;
    display: inline-block;
  }
  .flfgDetail > div.lineDetail > div{
    float: left;
    width: 45%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .flfgDetail > div.lineDetail > div.detailBtn{
    width: 10%;
    text-align: right;
  }
  .flfgDetail > div.lineDetail > div > span{
    margin-left: 20px;
  }
  .flfgContent{
    border-top: 1px solid #eeeeee;
    padding-top: 20px;
    min-height: 500px;
  }
  .flfgContent .title{
    color: rgb(32, 160, 255);
    font-size: 26px;
    text-align: center;
  }
</style>
