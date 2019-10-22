<template>
  <section class="deptWrap">
    <el-row>
      <!-- <img src="@/assets/icon/back.png"  class="goBack" @click="back"> -->
      <el-button size="mini" class="right" @click="lookMoreDept" icon="el-icon-menu">更多机构信息</el-button>
    </el-row>
    <el-card style="margin-top:10px;">
      <div slot="header">
        <span>机构信息</span>
        <!-- 非本单位机构用户审核权限用户登录 不显示编辑按钮，业务审核人员 只能对本单位的机构信息进行维护 -->
        <el-button style="float: right; padding: 3px 0;font-size:22px;margin-top:-5px;" type="text" icon="el-icon-edit-outline" title="编辑" @click="editDepartment"></el-button>
      </div>
        <!-- <el-row type="flex" justify="center" class="clearfix"> -->
      <el-form :model="departmentForm" ref="departmentForm" label-width="120px" label-position="left" v-loading="formLoading" class="clearfix">
        <el-col :span="11">
          <el-form-item label="机构全称" prop="departName">
            {{departmentForm.departName}}
          </el-form-item>
          <el-form-item label="机构级别" prop="adminLevel" class="clearfix">
            {{departmentForm.adminLevel}}
          </el-form-item>
          <el-form-item label="编制人数" prop="compileNum" class="clearfix">
            {{departmentForm.compileNum}}
          </el-form-item>
          <el-form-item label="所属行政区划" prop="areaCode" class="clearfix">
            {{departmentForm.areaCode}}
          </el-form-item>
          <el-form-item label="成立时间" prop="foundingTime" class="clearfix">
            {{departmentForm.foundingTime}}
          </el-form-item>
          <el-form-item label="联系电话" prop="linkmanPhone" class="clearfix">
            {{departmentForm.linkmanPhone}}
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainLeader" class="clearfix">
            {{departmentForm.mainLeader}}
          </el-form-item>
          <el-form-item label="日常联系人" prop="dayLeader" class="clearfix">
            {{departmentForm.dayLeader}}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="机构代码" prop="departCode" class="clearfix">
            {{departmentForm.departCode}}
          </el-form-item>
          <el-form-item label="主要职责任务" prop="mainAssignment" class="clearfix">
            {{departmentForm.mainAssignment}}
          </el-form-item>
          <el-form-item label="实有人数" prop="realityNum" class="clearfix">
            {{departmentForm.realityNum}}
          </el-form-item>
          <el-form-item label="机构详细地址" prop="address" class="clearfix">
            {{departmentForm.address}}
          </el-form-item>
          <el-form-item label="邮编" prop="postcode" class="clearfix">
            {{departmentForm.postcode}}
          </el-form-item>
          <el-form-item label="传真号码" prop="faxNumber" class="clearfix">
            {{departmentForm.faxNumber}}
          </el-form-item>
          <el-form-item label="分管局领导" prop="subofficeLeader" class="clearfix">
            {{departmentForm.subofficeLeader}}
          </el-form-item>
          <el-form-item label="机构设置模式" prop="designMode">
            {{departmentForm.designMode}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" class="clearfix" prop="remark">
            {{departmentForm.remark}}
          </el-form-item>
        </el-col>
      </el-form>
        <!-- </el-row> -->
    </el-card>
  </section>
</template>

<script>
import { uploadImg } from '@/utils/editorUpload'
import { examPaperType, systemClassify } from '@/utils/codetotext'
// import { getTree } from '@/api/dept'

export default {
  name: 'add',
  data() {
    return {
      paperList: [], // 只能选择本单位组织的试卷
      openDeptsList: [], // 开放单位只能是本单位或者下级单位，无法选择上级及其他单位
      departmentForm: {
        permitNumber: 1, // 允许次数
        openDepts: [], // 开放单位
        markPeople: [] // 阅卷人员
      },
      editorHeight: '', // 右侧内容的高度
      markingPeopleData: [], // 阅卷人员data
      value: [],
      paperType: examPaperType(), // 试卷类型
      examinationTypeData: systemClassify(), // 试卷分类
      deptProps: {
        value: 'deptCode',
        label: 'deptName'
      },
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
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
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  methods: {
    lookMoreDept() { // 更多机构信息
      this.$router.push({ path: '/basicService/deptInfo/index', query: {}})
    },
    editDepartment() { // 编辑部门
      this.$router.push({ path: '/basicService/deptInfo/edit', query: {}})
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    init() {
      // 开放单位：获取本单位和下级单位
      // this.$query('deptsbyparentdeptcode', { deptCode: this.deptInfo.depCode }, 'upms').then((response) => {
      //   if (response.code === '000000') {
      //     this.openDeptsList = response.data
      //   } else {
      //     this.openDeptsList = []
      //   }
      // }).catch(() => {
      //   this.openDeptsList = []
      // })
      // 查开放部门
      this.treeLoading = true
      this.$query('childDept', { deptCode: this.deptInfo.depCode }).then((response) => {
        this.treeLoading = false
        if (response.code === '000000') {
          this.openDeptsList = [response.data]
        } else {
          this.openDeptsList = []
        }
        // this.openDeptsList = JSON.parse(sessionStorage.getItem('DeptTree')) // 全部的部门
        this.defaultExpandedKeys = [this.deptInfo.id] // 默认展开当前部门的下一级
      }).catch(() => {
        this.treeLoading = false
        this.openDeptsList = []
      })
      var _this = this
      // 阅卷人员 查所有人
      this.markingPeopleData = []
      this.$query('userallbyenable', {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.allSystemPeople = response.data
          _this.markPerOwn = []
          for (let index = 0; index < this.allSystemPeople.length; index++) {
            var element = this.allSystemPeople[index]
            if (element.deptCode === this.deptInfo.depCode) {
              _this.markPerOwn.push(element)
            }
          }
          var nameArr = [] // 用户名
          var jinghaoArr = [] // 警号
          var deptArr = [] // 所在单位
          var userIdArr = [] // 用户id
          _this.markPerFormattingOwn = []
          for (let index = 0; index < _this.markPerOwn.length; index++) {
            const element = _this.markPerOwn[index]
            nameArr.push(element.realName)
            jinghaoArr.push(element.userName)
            deptArr.push(element.deptName)
            userIdArr.push(element.userId)
          }
          nameArr.forEach((name, index) => {
            _this.markPerFormattingOwn.push({
              label: name + '-' + jinghaoArr[index], // 将姓名和警号拼一起 方便查询
              key: userIdArr[index],
              dept: deptArr[index]
            })
          })

          var nameArrAll = [] // 用户名
          var jinghaoArrAll = [] // 警号
          var deptArrAll = [] // 所在单位
          var userIdArrAll = [] // 用户id
          _this.markPerFormattingAll = []
          for (let m = 0; m < _this.allSystemPeople.length; m++) {
            const item = _this.allSystemPeople[m]
            nameArrAll.push(item.realName)
            jinghaoArrAll.push(item.userName)
            deptArrAll.push(item.deptName)
            userIdArrAll.push(item.userId)
          }
          nameArrAll.forEach((name, index) => {
            _this.markPerFormattingAll.push({
              label: name + '-' + jinghaoArrAll[index], // 将姓名和警号拼一起 方便查询
              key: userIdArrAll[index],
              dept: deptArrAll[index]
            })
          })
          this.markingPeopleData = _this.markPerFormattingOwn
        } else {
          this.markingPeopleData = []
        }
      }).catch(() => {
        this.markingPeopleData = []
      })
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
    endDateChange(val) {
      if (val) {
        this.$refs.departmentForm.validateField('startDate', (error) => {
          console.log(error)
        })
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
                  message: '修改成功', type: 'success'
                })
                this.$router.push({ path: '/handlingGuide/examineManage' })
              }
            }).catch(() => {
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
    // this.init()
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
}
</style>
