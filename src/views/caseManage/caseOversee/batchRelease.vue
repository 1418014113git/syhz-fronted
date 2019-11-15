<template>
  <section class="deptWrap">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card style="margin-top:10px;">
      <!-- <div slot="header">
        <span>督办批次发布</span>
      </div> -->
      <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="dbBatchForm" ref="dbBatchForm" :rules="rules" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="11">
          <el-form-item label="批次名称" prop="title">
            <el-input type="text" size="small" v-model.trim="dbBatchForm.title" clearable placeholder="请输入" maxlength="20" ></el-input>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate" class="clearfix">
            <el-date-picker v-model="dbBatchForm.startDate" type="date" :picker-options="startPickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="startDateChange" class="left" ></el-date-picker>
          </el-form-item>
          <el-form-item label="督办级别" prop="superviseLevel" class="clearfix">
            <el-select v-model="dbBatchForm.superviseLevel" placeholder="请选择督办级别" class="db_create_input" @visible-change="levelVisibleChange" @change="superviseLevelChange">
              <el-option label="部督办" value="1" v-if="deptInfo.depType==='1'"></el-option>
              <el-option label="厅督办" value="2" v-if="deptInfo.depType==='1'"></el-option>
              <el-option label="市督办" value="3" v-if="deptInfo.depType==='2'"></el-option>
              <!-- <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="文号" prop="referenceNumber" class="clearfix">
            <el-input type="text" v-model.trim="dbBatchForm.referenceNumber" clearable placeholder="请输入" maxlength="50" class="left"></el-input>
          </el-form-item>
          <el-form-item label="截止日期" prop="endDate" class="clearfix">
            <el-date-picker v-model="dbBatchForm.endDate" type="date" :picker-options="endPickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="endDateChange" class="left" ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提醒时限" class="clearfix" prop="remindDate">
            截止日期前 <el-input-number v-model.trim="dbBatchForm.remindDate" :min="2" :max="999"></el-input-number> 天提醒督办申请单位提交结案报告
          </el-form-item>
          <el-form-item label="正文" class="clearfix" prop="content">
            <vue-editor v-model="dbBatchForm.content" useCustomImageHandler @imageAdded="handleImageAdded"
                          style="width: 100%; min-width: 500px;"></vue-editor>
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
            <div class="clearfix">
              <el-select v-model="oneCase.id" filterable clearable
              placeholder="请输入案件名称或者案件编号搜索" :filter-method="filterDbCase"
                       value-key="id" class="left" @change="dbCaseChange" style="width:80%">
                <el-option v-for="item in dbAjData" :key="item.id" :label="item.ajmc+'-'+item.ajbh" :value="item.id"></el-option>
              </el-select>
              <el-button size="mini" @click="addDbCaseList" class="right">加入列表</el-button>
            </div>
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
              <el-table-column prop="AJLB_NAME" label="操作" width="60">
                <template slot-scope="scope">
                  <el-button title="移除" size="mini" type="primary" @click="handleDeleteAj(scope.$index, scope.row)" icon="el-icon-close" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center" style="margin-bottom:10px;">
          <el-button size="mini" @click="handleSave('1','dbBatchForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">保存</el-button>
          <el-button size="mini" @click="cancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
          <el-button size="mini" @click="handleSave('2','dbBatchForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">发布</el-button>
        </el-col>
      </el-form>
      <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>
import { regCode } from '@/utils/validate'
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
        superviseLevel: '', // 督办级别
        remindDate: 2 // 提醒时限
      }, // 机构信息
      formLoading: false, // 表单loading
      carryParam: {}, // 列表带过来的参数
      startPickerOptions: { // 开始日期 默认为本日，可选本日和本日之后
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 86400000
        }
      },
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      dbData: [],
      tableHeight: 400,
      dbAjData: [],
      dbAjDataAll: [],
      oneCase: {}, // 督办案件，当前选中的案件
      choosedCases: [], // 选中的案件，存选中案件的完整数据
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        title: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入批次名称'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        referenceNumber: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入文号'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        startDate: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择开始日期'))
            } else {
              callback()
            }
          }
        }],
        endDate: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择截止日期'))
            } else {
              callback()
            }
          }
        }],
        superviseLevel: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择督办级别'))
            } else {
              callback()
            }
          }
        }],
        remindDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            var reg = /^[1-9]{1}\d{0,2}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入提醒时限'))
            } else if (reg.test(value)) {
              // 判断开始时间和结束时间
              if (this.dbBatchForm.startDate && this.dbBatchForm.endDate) {
                var days = this.getDays(this.dbBatchForm.startDate, this.dbBatchForm.endDate)
                console.log(days)
                if (days < value) {
                  callback(new Error('提醒时限不能大于开始时间和结束时间的间隔！'))
                } else {
                  callback()
                }
              }
            } else {
              callback(new Error('请输入正确的提醒时限'))
            }
          }
        }],
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入正文'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  components: {
    VueEditor
  },
  watch: {
  },
  computed: {
  },
  methods: {
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
    levelVisibleChange(val) {
      // if (val) {
      //   this.$confirm('调整督办级别会清空已选督办案件，是否继续调整？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     return true
      //   }).catch(() => {
      //     return false
      //   })
      // }
    },
    superviseLevelChange(val) { // 督办级别change
      // console.log(event)
      // this.beforeStorageValue = this.dbBatchForm.superviseLevel
      if (this.deptInfo.depType === '1' || this.deptInfo.depType === '-1') {
        if (val) {
          this.$confirm('调整督办级别会清空已选督办案件，是否继续调整？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {
            if (val === '1') {
              this.dbBatchForm.superviseLevel = '2'
            }
            if (val === '2') {
              this.dbBatchForm.superviseLevel = '1'
            }
          })
        }
      }
      this.queryDbCase()
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
        this.dbAjDataAll = response.data
        // console.log(this.dbAjData)
      }).catch(() => {
        this.caseLoading = false
      })
    },
    filterDbCase(query, item) { // 督办案件的 自定义选择方法
      // 下拉支持关键字检索案，包括案件名称、案件编号、简要案情
      if (query) {
        if (item) {
          this.dbAjData = this.dbAjDataAll.filter((item) => {
            if (item.ajmc.indexOf(query) > -1) {
              return true
              // return item.ajmc.indexOf(query) > -1
            }
          })
        } else {
          this.dbAjData = this.dbAjDataAll
        }
      } else {
        this.dbAjData = this.dbAjDataAll
      }
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
            return time.getTime() < new Date(val).getTime() + 86400000
          }
        })
        if (this.dbBatchForm.endDate && this.dbBatchForm.remindDate) { // 开始时间和结束时间 提醒时限均存在
          this.$refs.dbBatchForm.validateField('remindDate') // 校验提醒时限
        }
      } else {
        this.dbBatchForm.endDate = ''
        this.startPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 86400000
          }
        })
      }
    },
    endDateChange(val) {
      // 计算时间间隔 多少天
      if (val) {
        this.startPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 86400000
          }
        })
        if (this.dbBatchForm.startDate && this.dbBatchForm.remindDate) { // 开始时间和结束时间 提醒时限均存在
          this.$refs.dbBatchForm.validateField('remindDate') // 校验提醒时限
        }
      } else {
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < Date.now() + 86400000
          }
        })
      }
    },
    getDays(strDateStart, strDateEnd) {
      var strSeparator = '-' // 日期分隔符
      var oDate1
      var oDate2
      var iDays
      oDate1 = strDateStart.split(strSeparator)
      oDate2 = strDateEnd.split(strSeparator)
      var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2])
      var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2])
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)// 把相差的毫秒数转换为天数
      return iDays
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
          var param = JSON.parse(JSON.stringify(this.dbBatchForm))
          param.departCode = this.deptInfo.depCode // 部门code
          param.areaCode = this.deptInfo.areaCode // 行政区划
          param.departName = this.deptInfo.depName // 部门名称
          param.userId = this.userInfo.id // 用户id
          param.userName = this.userInfo.realName // 用户姓名
          param.status = type // 1保存，2发布
          var caseIds = []
          for (let m = 0; m < this.choosedCases.length; m++) {
            const element = this.choosedCases[m]
            caseIds.push(element.id)
          }
          param.caseIds = caseIds.join(',') // 督办案件 案件id用逗号隔开
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
              message: '批次信息保存失败，请联系管理员！', type: 'error'
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
    if (this.$route.query.dbBatchId) {
      this.carryParam = this.$route.query
      this.init()
    }
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
}
</style>
