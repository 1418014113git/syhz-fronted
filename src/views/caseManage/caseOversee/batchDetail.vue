<template>
  <section class="deptWrap">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card style="margin-top:10px;">
      <!-- <div slot="header">
        <span>督办批次详情</span>
      </div> -->
      <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="dbBatchForm" ref="dbBatchForm" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="12">
          <el-form-item label="批次名称" prop="title">
            <span  @click="changeShowAll($event,'showAllPcmc')" :class="showAllPcmc?'showAll':'showPart'">{{dbBatchForm.title}}</span>
          </el-form-item>
          <el-form-item label="督办级别" prop="superviseLevel" class="clearfix">
            {{$getDictName(dbBatchForm.superviseLevel+'', 'dbjb')}}
          </el-form-item>
          <el-form-item label="发布单位" prop="publishDepartName">
            {{dbBatchForm.publishDepartName}}
          </el-form-item>
          <el-form-item label="发布时间" prop="publishDate" class="clearfix">
            {{dbBatchForm.publishDate}}
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate" class="clearfix">
            {{dbBatchForm.startDate}}
          </el-form-item>
          <el-form-item label="截止日期" prop="endDate" class="clearfix">
            {{dbBatchForm.endDate}}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="文号" prop="referenceNumber" class="clearfix">
            {{dbBatchForm.referenceNumber}}
          </el-form-item>
          <el-form-item label="状态" prop="status" class="clearfix">
            {{$getDictName(dbBatchForm.status+'', 'dbajpczt')}}
          </el-form-item>
          <el-form-item label="发布人" prop="publishPersonName" class="clearfix">
            {{dbBatchForm.publishPersonName}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提醒时限" class="clearfix" prop="remark">
            截止日期前 {{dbBatchForm.remindDate}} 天提醒督办申请单位提交结案报告
          </el-form-item>
          <el-form-item label="正文" class="clearfix" prop="content">
            <div v-html="dbBatchForm.content"></div>
            <!-- <vue-editor v-model="dbBatchForm.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;"></vue-editor> -->
          </el-form-item>
          <el-form-item label="附件" class="clearfix" prop="remark">
            <p v-for="item in uploadImgs" :key="item.path">
                <!-- <a :title="item.name" :href="item.path" target="_blank" class="fjlink">{{item.name}}</a>&nbsp;&nbsp;&nbsp; -->
                <a @click="downFile(item)" class="fjlink">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item label="督办案件" class="clearfix" prop="cases">
            <el-table :data="choosedCases" style="width: 100%;" :max-height="tableHeight">
              <el-table-column type="expand" width="30">
                <template slot-scope="scope">
                  <el-form label-position="left" inline>
                    <el-form-item label="简要案情">
                      <span>{{ scope.row.jyaq }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column prop="ajmc" label="案件名称" min-width="10%" show-overflow-tooltip></el-table-column>
              <el-table-column label="案件编号" min-width="10%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <a class="ajbh-color" @click="toAjDetail(scope.row.caseId)">{{scope.row.ajbh}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="ajlb" label="案件类别" min-width="10%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ajzt" label="案件状态" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sajz" label="涉案价值（万元）" min-width="10%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="applyDepartName" label="申请单位" min-width="10%" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>
// import { regCode } from '@/utils/validate'
// import { getTree } from '@/api/dept'
import VueEditor from '@/components/Editor/VueEditor'
import { uploadImg } from '@/utils/editorUpload'
import { getThousandNum } from '@/utils/public'
export default {
  name: 'add',
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadFiles: [], // 附件
      dbBatchForm: {
        administrative: [] // 行政区划
      }, // 机构信息
      showAllPcmc: false, // 批次名称是否全部显示
      formLoading: false, // 表单loading
      carryParam: {}, // 列表带过来的参数
      administrativeData: [], // 行政区划
      startPickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // }
      },
      endPickerOptions: {},
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      dbData: [],
      tableHeight: 400,
      dbAjData: [],
      oneCase: {}, // 督办案件，当前选中的案件
      choosedCases: [], // 选中的案件，存选中案件的完整数据
      uploadImgs: [], // 附件列表
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  components: {
    VueEditor
  },
  methods: {
    changeShowAll(e, type) {
      this[type] = !this[type]
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    },
    init() {
      // 盟市
      // this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
      //   if (response.code === '000000') {
      //     this.administrativeData = response.data ? response.data : []
      //     if (this.carryParam.deptId) {
      //       // 列表进来的
      //     } else {
      //       // 首页进来的
      //       this.carryParam.deptId = this.deptInfo.id // 将当前机构的id 放到 this.carryParam.deptId
      //     }
      this.queryDetailById() // 查详情
      //   }
      // })
    },
    downFile(item) {
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    queryDetailById() { // 通过id查询详情
      this.formLoading = true
      this.$query('casesupervisebatch/' + this.carryParam.dbBatchId, {}).then((response) => {
        this.formLoading = false
        if (response.code === '000000') {
          this.dbBatchForm = response.data
          if (this.dbBatchForm.caseList) { // 督办案件列表
            for (let m = 0; m < this.dbBatchForm.caseList.length; m++) {
              var item = this.dbBatchForm.caseList[m]
              if (item.sajz) { // 涉案价值
                item.sajz = getThousandNum((item.sajz / 10000).toFixed(2))
              } else {
                item.sajz = 0
              }
            }
            this.choosedCases = this.dbBatchForm.caseList // 督办案件列表
          }
          if (this.dbBatchForm.superviseLevel) { // 督办级别
            this.dbBatchForm.superviseLevel = this.dbBatchForm.superviseLevel + ''
          }
          if (this.dbBatchForm.document) { // 申请的附件
            this.uploadImgs = [] // 先清空掉该数组
            var files = this.dbBatchForm.document.split('|')
            for (let index = 0; index < files.length; index++) {
              var element = files[index]
              element = JSON.parse(element)
              this.uploadImgs.push(element)
            }
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    toAjDetail(id) { // 跳转到案件详情
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query) {
      this.carryParam = this.$route.query
      this.init()
    }
  },
  watch: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.deptWrap {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 40px 40px 20px;
  }
  .el-select,
  .el-input,
  .el-cascader {
    width: 100%;
  }
  .el-cascader__label {
    font-size: 15px;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .clearfix:after {
    clear: both;
    content: "";
    display: block;
  }
  .el-collapse-item__content {
    padding: 0 20px;
  }
  .xzqhWrap .el-cascader__label {
    cursor: not-allowed;
  }
  .showPart {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .showAll {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    overflow: auto;
  }
}
</style>
