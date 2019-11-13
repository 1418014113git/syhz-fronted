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
            <el-upload drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadFiles"
                       :on-success="attachmentSuccess"
                       :on-remove="attachmentRemove"
                       :before-remove="attachmentBfRemove"
                       :before-upload="beforeUpload"
                       :limit="10"
                       :on-exceed="handleExceed">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，最多10个</div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="督办案件" class="clearfix" prop="cases">
            <!-- <div class="clearfix">
              <el-select v-model="oneCase.id" filterable clearable
              placeholder="请输入案件名称或者案件编号搜索" :filter-method="filterDbCase"
                       value-key="id" class="left" @change="dbCaseChange" style="width:80%">
                <el-option v-for="item in dbAjData" :key="item.id" :label="item.ajmc+'-'+item.ajbh" :value="item.id"></el-option>
              </el-select>
              <el-button size="mini" @click="addDbCaseList" class="right">加入列表</el-button>
            </div> -->
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
                  <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.ajbh}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="ajlb" label="案件类别" min-width="10%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ajzt" label="案件状态" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sajz" label="涉案价值" min-width="10%" show-overflow-tooltip></el-table-column>
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
    attachmentSuccess(res, file, fileList) {
      this.uploadFiles = fileList
    },
    attachmentRemove(file, fileList) {
      this.uploadFiles = fileList
    },
    attachmentBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    handleExceed(files, fileList) { // 限制上传文件个数
      this.$message.error('最多上传10个文件')
    },
    beforeUpload(file) {
      const msg = this.UploadAttachment.fileValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    },
    handleFile() {
      if (this.uploadFiles.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const img = this.uploadFiles[i]
          if (img.status === 'success') {
            // arr.push({
            //   name: img.name, path: img.path ? img.path : img.response.data
            // })
            arr.push(JSON.stringify({ name: img.name, path: img.path || img.response.data }))
          }
        }
        this.dbBean.document = arr.join('|') // 这里不能用逗号
      } else {
        // this.$message.error('文书附件不能为空')
        // return false
      }
    },
    superviseLevelChange(event) { // 督办级别change
      console.log(event)
      this.queryDbCase()
      this.$confirm('调整督办级别会清空已选督办案件，是否继续调整？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {

      })
    },
    queryDbCase() {
      // if (!val) {
      //   this.dbajData = []
      //   return false
      // }
      // this.caseLoading = true
      this.$query('casesuperviseselect', {
        superviseLevel: this.dbBatchForm.superviseLevel, // 督办级别
        departCode: this.deptInfo.depCode
      }).then((response) => {
        // this.caseLoading = false
        this.dbAjData = response.data
        console.log(this.dbAjData)
      }).catch(() => {
        this.caseLoading = false
      })
    },
    filterDbCase(query, item) { // 督办案件的 自定义选择方法
      // 下拉支持关键字检索案，包括案件名称、案件编号、简要案情
      return item.ajmc.indexOf(query) > -1
    },
    dbCaseChange(val) { // 督办案件 change

    },
    addDbCaseList() { // 加入列表
      // 判断是否 在下面列表是否存在 若存在 则不push
      for (const id in this.choosedCases) {
        if (this.choosedCases.hasOwnProperty(id)) {
          const element = this.choosedCases[id]
          if (element === this.oneCase.id) {
            this.$message({
              message: '该案件已加入该批次',
              type: 'error'
            })
            return false
          } else {
            // 将选中的案件 完整数据 保存到 choosedCases数组中
            for (let index = 0; index < this.dbAjData.length; index++) {
              const element = this.dbAjData[index]
              if (element.id === this.oneCase.id) {
                this.choosedCases.push(element)
              }
            }
          }
        }
      }
    },
    handleDeleteAj(index, row) { // 选中的督办案件移除
      this.$confirm('确定要移除该案件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // for (let index = 0; index < this.dbAjData.length; index++) {
        //   const element = this.dbAjData[index]
        //   if (element.id === row.id) {
        //     this.choosedCases.splice(element)
        //   }
        // }
        for (let index = 0; index < this.choosedCases.length; index++) {
          const element = this.choosedCases[index]
          if (element.id === row.id) {
            this.choosedCases.splice(element)
          }
        }
      }).catch(() => {

      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    areaChange(val) { // 行政区划 change事件
      if (val.length > 1) {
        var curCityCode = val[1]
        for (let index = 0; index < this.administrativeData[0].children.length; index++) {
          const element = this.administrativeData[0].children[index]
          if (curCityCode === element.cityCode) {
            this.dbBatchForm.areaName = element.cityName
            break
          }
        }
      } else {
        this.dbBatchForm.areaName = ''
      }
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
    queryDetailById() { // 通过id查询详情
      this.formLoading = true
      this.$query('casesupervisebatch/' + this.carryParam.dbBatchId, {}).then((response) => {
        this.formLoading = false
        if (response.code === '000000') {
          this.dbBatchForm = response.data
          this.choosedCases = this.dbBatchForm.caseList // 督办案件列表
          if (this.dbBatchForm.superviseLevel) { // 督办级别
            this.dbBatchForm.superviseLevel = this.dbBatchForm.superviseLevel + ''
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    startDateChange(val) { // 开始日期
      if (val) {
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return (time.getTime() < new Date(val).getTime() - 86400000)
          }
        })
      } else {
        this.dbBatchForm.endDate = ''
        // this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    endDateChange(val) {

    },
    cancel() { // 取消
      this.$confirm('是否要放弃编辑机构信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到详情画面
        this.$router.push({ path: '/basicService/deptInfo/detail', query: { deptId: this.carryParam.deptId }})
      }).catch(() => {
        // 留在编辑页面
      })
    },
    handleSave(type, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          var param = JSON.parse(JSON.stringify(this.dbBatchForm))
          // if (this.dbBatchForm.administrative && this.dbBatchForm.administrative.length > 0) {
          //   param.provinceCode = this.dbBatchForm.administrative[0]
          //   param.cityCode = this.dbBatchForm.administrative[1] || ''
          //   param.reginCode = this.dbBatchForm.administrative[2] || ''
          //   param.administrative = this.dbBatchForm.administrative[this.dbBatchForm.administrative.length - 1] // 为最后一级的code
          // }
          param.departCode = this.deptInfo.depCode
          param.areaCode = this.deptInfo.areaCode
          param.departName = this.deptInfo.depName

          param.userId = this.userInfo.id
          param.userName = this.userInfo.userName
          param.status = type
          var caseIds = []
          for (let m = 0; m < this.choosedCases.length; m++) {
            const element = this.choosedCases[m]
            caseIds.push(element.id)
          }
          param.caseIds = caseIds.join(',') // 督办案件
          // console.log(param)
          this.formLoading = true
          this.$save('casesupervisebatch', param).then((response) => {
            this.formLoading = false
            if (response.code === '000000') {
              this.$message({
                message: '批次信息保存成功', type: 'success'
              })
              // 停留2秒跳转到详情页面
              // setTimeout(() => {
              //   this.$router.push({ path: '/basicService/deptInfo/detail' })
              // }, 2000)
            } else {
              // this.$message({
              //   message: '机构信息保存失败，请联系管理员！', type: 'success'
              // })
            }
          }).catch(() => {
            this.$message({
              message: '机构信息保存失败，请联系管理员！', type: 'success'
            })
            this.formLoading = false
          })
        }
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
