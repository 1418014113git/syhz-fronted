<template>
  <section class="deptWrap">
    <el-row>
      <!-- <img src="@/assets/icon/back.png"  class="goBack" @click="back"> -->
      <el-button size="mini" class="right" @click="lookMoreDept" icon="el-icon-menu">更多机构信息</el-button>
    </el-row>
    <el-card style="margin-top:10px;">
      <div slot="header">
        <span>机构信息</span>
      </div>
      <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="departmentForm" ref="departmentForm" :rules="rules" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="11">
          <el-form-item label="机构全称" prop="departName">
            <el-input type="text" size="small" v-model="departmentForm.departName" clearable placeholder="请输入" maxlength="50" ></el-input>
          </el-form-item>
          <el-form-item label="机构级别" prop="adminLevel" class="clearfix">
            <el-select v-model="departmentForm.adminLevel" placeholder="请选择" class="left" >
              <el-option v-for="item in paperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编制人数" prop="compileNum" class="clearfix">
            <el-input type="text" size="small" v-model="departmentForm.compileNum" clearable placeholder="请输入" maxlength="3"></el-input>
          </el-form-item>
          <el-form-item label="所属行政区划" prop="areaCode" class="clearfix">
            <el-select v-model="departmentForm.areaCode" placeholder="请选择" class="left" >
              <el-option v-for="item in paperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成立时间" prop="foundingTime" class="clearfix">
            <el-date-picker v-model="departmentForm.foundingTime" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期时间" @change="dateChange" class="left" ></el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="linkmanPhone" class="clearfix">
            <el-input type="text" v-model="departmentForm.linkmanPhone" clearable placeholder="请输入" maxlength="11" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainLeader" class="clearfix">
            <el-input type="text" v-model="departmentForm.mainLeader" clearable placeholder="请输入" maxlength="20" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="日常联系人" prop="dayLeader" class="clearfix">
            <el-input type="text" v-model="departmentForm.dayLeader" clearable placeholder="请输入" maxlength="20" class="left" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="机构代码" prop="departCode" class="clearfix">
            <el-input type="text" v-model="departmentForm.departCode" clearable placeholder="请输入" maxlength="20" class="left" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="主要职责任务" prop="mainAssignment" class="clearfix">
            <el-input type="text" v-model="departmentForm.mainAssignment" clearable placeholder="请输入" maxlength="3" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="实有人数" prop="realityNum" class="clearfix">
            <el-input type="text" v-model="departmentForm.realityNum" clearable placeholder="请输入" maxlength="3" class="left" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="机构详细地址" prop="address" class="clearfix">
            <el-input type="text" v-model="departmentForm.address" clearable placeholder="请输入" maxlength="3" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="邮编" prop="postcode" class="clearfix">
            <el-input type="text" v-model="departmentForm.postcode" clearable placeholder="请输入" maxlength="6" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="传真号码" prop="faxNumber" class="clearfix">
            <el-input type="text" v-model="departmentForm.faxNumber" clearable placeholder="请输入" maxlength="11" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="分管局领导" prop="subofficeLeader" class="clearfix">
            <el-input type="text" v-model="departmentForm.subofficeLeader" clearable placeholder="请输入" maxlength="3" class="left" ></el-input>
          </el-form-item>
          <el-form-item label="机构设置模式" prop="designMode">
            <el-select v-model="departmentForm.designMode" placeholder="请选择" >
              <!-- <el-option v-for="item in examinationTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
              <option label="单设为省/市/县级公安机关内设部门" value="1">单设为省/市/县级公安机关内设部门</option>
              <option label="列为省/市/县级公安机关经侦、治安等部门内设机构" value="2"></option>
              <option label="在省/市/县级公安机关刑侦、治安等部分加挂牌子" value="3"></option>
              <option></option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" class="clearfix" prop="remark">
            <el-input type="textarea" :rows="2" v-model="departmentForm.remark" maxlength="500" placeholder="最多可输入500文字！"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center" style="margin-bottom:10px;">
          <el-button size="mini" @click="cancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
          <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading" style="margin-left:20px;">保存</el-button>
        </el-col>
      </el-form>
      <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>
import { uploadImg } from '@/utils/editorUpload'
import { examPaperType, systemClassify } from '@/utils/codetotext'
import { regCode } from '@/utils/validate'
// import { getTree } from '@/api/dept'

export default {
  name: 'add',
  data() {
    return {
      paperList: [], // 只能选择本单位组织的试卷
      openDeptsList: [], // 开放单位只能是本单位或者下级单位，无法选择上级及其他单位
      departmentForm: {}, // 机构信息
      editorHeight: '', // 右侧内容的高度
      markingPeopleData: [], // 阅卷人员data
      value: [],
      paperType: examPaperType(), // 试卷类型
      examinationTypeData: systemClassify(), // 试卷分类
      deptProps: {
        value: 'deptCode',
        label: 'deptName'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      formLoading: false, // 表单loading
      allSystemPeople: [], // 系统所有人员
      markPerFormattingOwn: [], // 自己单位人员
      markPerFormattingAll: [], // 格式化后的所有人员
      markPerOwn: [],
      carryParam: {}, // 列表带过来的参数
      yjry: '', // 阅卷人员筛选框
      endDateDisabled: true, // 结束时间禁用
      treeLoading: true, // 开放单位加载的loading
      defaultExpandedKeys: [], // 默认展开的节点的 key 的数组
      defaultCheckedKeys: [], // 默认勾选的节点的 key 的数组
      markFilterFlag: false, // 阅卷老师是否筛选过
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        departName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构全称的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        departCode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构代码的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        adminLevel: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构级别的内容'))
            } else {
              callback()
            }
          }
        }],
        mainAssignment: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入主要职责任务的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        areaCode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入所属行政区划的内容'))
            } else {
              callback()
            }
          }
        }],
        address: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入机构详细地址的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        postcode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入邮编的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        foundingTime: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择开始时间'))
            } else if (new Date(this.departmentForm.startDate).getTime() < new Date().getTime()) {
              callback(new Error('开始时间不能小于当前时间'))
            } else if (new Date(this.departmentForm.startDate).getTime() > new Date(this.departmentForm.endDate).getTime()) {
              callback(new Error('开始时间不能大于截至时间'))
            } else {
              callback()
            }
          }
        },
        linkmanPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入联系电话的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        mainLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入主要负责人的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        subofficeLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入分管局领导的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        dayLeader: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入日常联系人的内容'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        designMode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择机构设置模式'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        faxNumber: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入传真'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    lookMoreDept() { // 更多机构信息
      this.$router.push({ path: '/basicService/deptInfo/index', query: {}})
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    init() {
      // 查upms下的人员数
      // this.$query('/', {}).then((response) => {
      //   if (response.code === '000000') {

      //   }
      // }).catch(() => {
      //   this.formLoading = false
      // })
      if (this.carryParam.examId) {
        this.queryDetailById() // 查详情
      }
    },
    queryDetailById() { // 通过id查询详情
      this.formLoading = true
      this.departmentForm.openDepts = []
      this.$query('examination/' + this.carryParam.examId, {}).then((response) => {
        if (response.code === '000000') {
          response.data.examinationType = response.data.examinationType + '' // 分类
          response.data.type = response.data.type + '' // 试卷类型
          this.examPaperTypeChange(response.data.type) // 查试卷

          var choosedDepts = response.data.openDepts.split(',') // 开放单位
          var newDeptsArr = []
          for (let index = 0; index < choosedDepts.length; index++) {
            var element = Number(choosedDepts[index])
            newDeptsArr.push(element)
          }
          this.$refs.depTree.setCheckedKeys(newDeptsArr)

          if (response.data.markPeople) { // 阅卷人员
            var choosedPers = response.data.markPeople.split(',')
            var newPersArr = []
            for (let index = 0; index < choosedPers.length; index++) {
              var item = Number(choosedPers[index])
              newPersArr.push(item)
            }
          }
          this.departmentForm = response.data
          // this.departmentForm.openDepts = newDeptsArr
          this.departmentForm.markPeople = newPersArr
        }
      }).catch(() => {
        this.formLoading = false
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
      }).catch((e) => { })
    },
    startDateChange(val) {
      if (val) {
        this.endDateDisabled = false
        this.$refs.departmentForm.validateField('endDate', (error) => {
          console.log(error)
        })
        // this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        //   disabledDate: (time) => {
        //     return time.getTime() < new Date(val).getTime()
        //   }
        // })
      } else {
        this.endDateDisabled = true
      }
    },
    dateChange(val) {
      if (val) {
        // this.startPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'start')
      } else {
        // this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    cancel() { // 取消
      this.$confirm('是否要放弃编辑机构信息', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到详情画面
        this.$router.push({ path: '/basicService/deptInfo/detail', query: {}})
      }).catch(() => {
        // 留在编辑页面
      })
      // this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          var param = JSON.parse(JSON.stringify(this.departmentForm))
          var checkedNodes = this.$refs.depTree.getCheckedNodes()
          var checkedIdsArr = []
          for (let w = 0; w < checkedNodes.length; w++) {
            const element = checkedNodes[w]
            checkedIdsArr.push(element.deptId)
          }
          param.openDepts = checkedIdsArr.join(',') // 开放单位
          if (param.markPeople && param.markPeople.length > 0) { // 阅卷老师
            param.markPeople = param.markPeople.join(',')
          } else {
            param.markPeople = ''
          }
          param.deptCode = this.deptInfo.depCode // 当前部门code
          param.deptName = this.deptInfo.depName
          if (this.carryParam.examId) {
            param.modifier = this.userInfo.userName
          } else {
            param.creator = this.userInfo.userName
          }
          // console.log(param)
          this.formLoading = true
          if (this.carryParam.examId) {
            // 编辑
            this.$update('examination/update', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '机构信息保存成功', type: 'success'
                })
                this.$router.push({ path: '/basicService/deptInfo/detail' })
              } else {
                this.$message({
                  message: '机构信息保存失败，请联系管理员！', type: 'success'
                })
              }
            }).catch(() => {
              this.$message({
                message: '机构信息保存失败，请联系管理员！', type: 'success'
              })
              this.formLoading = false
            })
          } else {
            // 添加
            this.$update('examination/save', param).then((response) => {
              if (response.code === '000000') {
                this.formLoading = false
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$router.push({ path: '/handlingGuide/examineManage' })
              }
            }).catch(() => {
              this.formLoading = false
            })
          }
        }
      })
    },
    examPaperTypeChange(val) { // 试卷类型change，只能选择本单位组织的试卷，其他单位的无法选择
      if (val) {
        this.formLoading = true
        var param = {
          paperStatus: 2, // 已发布
          deptCode: this.deptInfo.depCode,
          paperType: val
        }
        this.$query('exampaper', param).then((response) => {
          this.formLoading = false
          if (response.code === '000000') {
            this.paperList = response.data
          } else {
            this.paperList = []
          }
        }).catch(() => {
          this.formLoading = false
          this.paperList = []
        })
      } else {
        this.paperList = []
      }
    },
    timeDifference(time1, time2) { // 计算时间相减
      // 定义两个变量time1,time2分别保存开始和结束时间
      // var time1 = '2017-12-03 12:01'
      // var time2 = '2017-12-03 12:35'
      // 判断开始时间是否大于结束日期
      // if (time1 > time2) {
      //   alert('开始时间不能大于结束时间！')
      //   return false
      // }
      // 截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
      var begin1 = time1.substr(0, 10).split('-')
      var end1 = time2.substr(0, 10).split('-')
      // 将拆分的数组重新组合，并实例成化新的日期对象
      var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0])
      var date2 = new Date(end1[1] + -+end1[2] + -+end1[0])
      // 得到两个日期之间的差值m，以分钟为单位
      // Math.abs(date2-date1)计算出以毫秒为单位的差值
      // Math.abs(date2-date1)/1000得到以秒为单位的差值
      // Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
      var m = parseInt(Math.abs(date2 - date1) / 1000 / 60)
      // 小时数和分钟数相加得到总的分钟数
      // time1.substr(11,2)截取字符串得到时间的小时数
      // parseInt(time1.substr(11,2))*60把小时数转化成为分钟
      var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2))
      var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2))
      // 两个分钟数相减得到时间部分的差值，以分钟为单位
      var n = min2 - min1
      // 将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
      var minutes = m + n
      return minutes
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    this.init()
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
    padding: 20px 40px;
  }
  .el-select,
  .el-input {
    width: 100%;
  }

  .el-transfer-panel {
    width: 360px;
  }
  .el-transfer__buttons {
    padding: 0 20px;
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
  .dept-tree {
    max-height: 400px;
    overflow-y: auto;
    // padding: 5px;
  }
}
.node_block {
  display: inline-block;
}
.node_none {
  display: none;
}
</style>
