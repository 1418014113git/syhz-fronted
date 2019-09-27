<template>
  <section class="addExamine">
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <el-card class="spt_report">
      <div slot="header">
        <span>考试信息</span>
      </div>
      <el-row type="flex" justify="center" class="clearfix">
        <el-col :span="20">
          <el-form :model="examForm" ref="examForm" :rules="rules" label-width="96px" label-position="left" v-loading="formLoading" class="clearfix">
            <el-col>
              <el-form-item label="考试名称" prop="examinationName">
                <el-input type="text" size="small" v-model="examForm.examinationName" clearable placeholder="请输入" maxlength="50" style="width:calc(100% - 30px)"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startDate" class="clearfix">
                <el-date-picker v-model="examForm.startDate" type="datetime" :picker-options="startPickerOptions" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="选择日期时间" @change="startDateChange" class="left" style="width:calc(100% - 30px)"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试开始时间，只有到了开始时间才能进入考试页面进行考试！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="截止时间" prop="endDate" class="clearfix">
                <el-date-picker v-model="examForm.endDate" type="datetime" :picker-options="endPickerOptions" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="选择日期时间" @change="endDateChange" class="left" style="width:calc(100% - 30px)"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试截至时间，截止时间以后，警员将不能在进入考试页面进行考试！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
                <el-form-item label="考试时限" prop="totalDate" class="clearfix">
                <el-input type="text" v-model="examForm.totalDate" clearable placeholder="请输入" maxlength="3" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right"  effect="dark" content="请填写考试限定时间，在时间范围内警员可以自主提交答卷，到达限定时间，系统将强制提交答卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="允许次数" prop="permitNumber" class="clearfix">
                <el-input-number v-model="examForm.permitNumber" :min="1" :max="9" label="请输入"></el-input-number>
                <el-tooltip class="right"  effect="dark" content="请填写允许警员重复考试的次数，有多个成绩时，以最高分成绩为准！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="试卷类型" prop="type" class="clearfix">
                <el-select v-model="examForm.type" placeholder="请选择题型" @change="examPaperTypeChange" class="left" style="width:calc(100% - 30px)">
                  <el-option v-for="item in paperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="请选择试卷类型，重复考试时，人工组卷题目不会变化；随机组卷题目会随机抽取！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="选择试卷" prop="paperId" class="clearfix">
                <el-select v-model="examForm.paperId" placeholder="请选择题型" class="left" style="width:calc(100% - 30px)">
                  <el-option v-for="item in paperList" :key="item.id" :label="item.paperName" :value="item.id"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="根据您选择的试卷类型，系统自动获取对应试卷列表，您可以选择需要的考卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="分类" prop="examinationType">
                <el-select v-model="examForm.examinationType" placeholder="请选择分类" style="width:calc(100% - 30px)">
                  <el-option v-for="item in examinationTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开放单位" prop="openDepts" class="clearfix">
                <!-- 可以多选；只能是本单位或者下级单位，无法选择上级及其他单位 -->
                <el-select v-model="examForm.openDepts" placeholder="请选择开放单位" multiple class="left openWrap" style="width:calc(100% - 30px)">
                  <el-option v-for="item in openDeptsList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                </el-select>
                <el-tooltip class="right" effect="dark" content="根据实际情况，选择可以参加本次考试的机构单位！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="阅卷人员" prop="markPeople" class="clearfix">
                <el-input type="text" v-model="yjry" clearable class="left" style="width:410px;" @keyup.enter.native="filterMarkPeople(yjry)" placeholder="请输入关键字，回车键搜索"></el-input>
                  <!-- filterable
                  :filter-method="filterMethod" -->
                <el-transfer class="left" style="width:calc(100% - 30px)"
                  filter-placeholder="请输入关键字检索人员"
                  v-model="examForm.markPeople"
                  :button-texts="['移除', '选中']"
                  :titles="['人员列表','已选中的人员']"
                  :data="markingPeopleData">
                  <span slot-scope="{ option }">{{ option.label }}-{{ option.dept }}</span>
                </el-transfer>
                <el-tooltip class="right" effect="dark" content="请选择本次考试主观题的阅卷人员。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="考试须知" class="clearfix" prop="remark">
                <el-input type="textarea" :rows="2" v-model="examForm.remark" maxlength="1000" placeholder="最多可输入1000文字！" class="left" style="width:calc(100% - 30px)"></el-input>
                <el-tooltip class="right" effect="dark" content="请填写警员在参加考试时的注意事项，事项内容会在进入考试页面时自动弹出！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="24" align="center" style="margin-bottom:10px;">
              <el-button size="mini" @click="cancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
              <el-button size="mini" @click="handleSave('examForm')" class="saveBtn" :loading="formLoading">保存</el-button>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import { uploadImg } from '@/utils/editorUpload'
import { examPaperType, systemClassify } from '@/utils/codetotext'
import { regEnCode, regCnCode } from '@/utils/validate'

export default {
  name: 'add',
  data() {
    return {
      action: '',
      paperList: [], // 只能选择本单位组织的试卷
      openDeptsList: [], // 开放单位只能是本单位或者下级单位，无法选择上级及其他单位
      examForm: {
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
      endPickerOptions: {},
      formLoading: false, // 表单loading
      allSystemPeople: [], // 系统所有人员
      markPerFormattingOwn: [],
      markPerFormattingAll: [],
      carryParam: {}, // 列表带过来的参数
      yjry: '', // 阅卷人员筛选框
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        examinationName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入考试名称'))
            } else if (regEnCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else if (regCnCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        startDate: {
          required: true, message: '请输入开始时间', trigger: 'blur'
        },
        endDate: {
          required: true, message: '请输入截止时间', trigger: 'blur'
        },
        totalDate: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[0-9]+$/
            if (value === '') {
              callback(new Error('请输入考试时限'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('考试时限最多为三位数字'))
            }
          }
        }],
        permitNumber: {
          required: true, message: '请输入允许次数', trigger: 'blur'
        },
        type: {
          required: true, message: '请选择试卷类型', trigger: 'blur'
        },
        paperId: {
          required: true, message: '请选择试卷', trigger: 'blur'
        },
        examinationType: {
          required: true, message: '请选择分类', trigger: 'change'
        },
        openDepts: {
          required: true, message: '请选择开放单位', trigger: 'blur'
        }
      }
    }
  },
  methods: {
    filterMarkPeople(val) { // 阅卷老师筛选框
      this.markingPeopleData = []
      // 根据当前的val 查询
      var _this = this
      if (val) {
        for (let k = 0; k < _this.markPerFormattingAll.length; k++) {
          var itemK = _this.markPerFormattingAll[k]
          if (itemK.label.indexOf(val) > -1) {
            _this.markingPeopleData.push(itemK)
          }
        }
      } else {
        _this.markingPeopleData = _this.markPerFormattingOwn
      }
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    init() {
      // 开放单位：获取本单位和下级单位
      this.$query('deptsbyparentdeptcode', { deptCode: this.deptInfo.depCode }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.openDeptsList = response.data
        } else {
          this.openDeptsList = []
        }
      }).catch(() => {
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
          _this.markPerFormattingOwn = []
          for (let index = 0; index < _this.markPerOwn.length; index++) {
            const element = _this.markPerOwn[index]
            nameArr.push(element.realName)
            jinghaoArr.push(element.userName)
            deptArr.push(element.deptName)
          }
          nameArr.forEach((name, index) => {
            _this.markPerFormattingOwn.push({
              label: name + '-' + jinghaoArr[index], // 将姓名和警号拼一起 方便查询
              key: index,
              dept: deptArr[index]
            })
          })

          var nameArrAll = [] // 用户名
          var jinghaoArrAll = [] // 警号
          var deptArrAll = [] // 所在单位
          _this.markPerFormattingAll = []
          for (let m = 0; m < _this.allSystemPeople.length; m++) {
            const item = _this.allSystemPeople[m]
            nameArrAll.push(item.realName)
            jinghaoArrAll.push(item.userName)
            deptArrAll.push(item.deptName)
          }
          nameArrAll.forEach((name, index) => {
            _this.markPerFormattingAll.push({
              label: name + '-' + jinghaoArr[index], // 将姓名和警号拼一起 方便查询
              key: index,
              dept: deptArr[index]
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
      this.examForm.openDepts = []
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

          if (response.data.markPeople) { // 阅卷人员
            var choosedPers = response.data.markPeople.split(',')
            var newPersArr = []
            for (let index = 0; index < choosedPers.length; index++) {
              var item = Number(choosedPers[index])
              newPersArr.push(item)
            }
          }
          this.examForm = response.data
          this.examForm.openDepts = newDeptsArr
          this.examForm.markPeople = newPersArr
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
        this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    endDateChange() {

    },
    cancel() {
      this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          this.formLoading = true
          var param = JSON.parse(JSON.stringify(this.examForm))
          if (param.openDepts && param.openDepts.length > 0) { // 开放单位
            param.openDepts = param.openDepts.join(',')
          }
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
          // if (this.carryParam.questinoId) {
          //   // 编辑
          //   this.$update('examquestion/' + this.carryParam.questinoId, param).then((response) => {
          //     this.formLoading = false
          //     if (response.code === '000000') {
          //       this.$message({
          //         message: '修改成功', type: 'success'
          //       })
          //       this.$router.push({ path: '/handlingGuide/testbaseManage' })
          //     }
          //   }).catch(() => {
          //     this.formLoading = false
          //   })
          // } else {
          // 添加
          this.$update('examination/save', param).then((response) => {
            if (response.code === '000000') {
              this.formLoading = true
              this.loading = false
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
        // }
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
.addExamine {
  .el-transfer-panel {
    width: 410px;
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
}
.spt_report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
</style>
