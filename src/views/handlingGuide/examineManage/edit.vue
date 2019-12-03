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
                <el-input type="text" size="small" v-model="examForm.examinationName" clearable placeholder="请输入" maxlength="50" style="width:calc(100% - 30px)" :disabled="formDisabled"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startDate" class="clearfix">
                <el-date-picker v-model="examForm.startDate" type="datetime" :picker-options="startPickerOptions" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="选择日期时间" @change="startDateChange" class="left" style="width:calc(100% - 30px)" :disabled="formDisabled"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试开始时间，只有到了开始时间才能进入考试页面进行考试！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="截止时间" prop="endDate" class="clearfix">
                <el-date-picker v-model="examForm.endDate" type="datetime" :picker-options="endPickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :disabled="endDateDisabled" default-time="23:59:59" placeholder="选择日期时间" @change="endDateChange" class="left" style="width:calc(100% - 30px)"></el-date-picker>
                <el-tooltip class="right"  effect="dark" content="请选择考试截止时间，截止时间以后，警员将不能在进入考试页面进行考试！已经开始的考试，只能修改截止时间。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
                <el-form-item label="考试时限" prop="totalDate" class="clearfix">
                <el-input type="text" v-model="examForm.totalDate" clearable placeholder="请输入" maxlength="3" class="left" style="width:calc(100% - 30px)" :disabled="formDisabled">
                  <template slot="append">分钟</template>
                </el-input>
                <el-tooltip class="right"  effect="dark" content="请填写考试限定时间，在时间范围内警员可以自主提交答卷，到达限定时间，系统将强制提交答卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="允许次数" prop="permitNumber" class="clearfix">
                <el-input-number v-model="examForm.permitNumber" :min="1" :max="9" label="请输入" :disabled="formDisabled"></el-input-number>
                <el-tooltip class="right"  effect="dark" content="请填写允许警员重复考试的次数，有多个成绩时，以最高分成绩为准！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="试卷类型" prop="type" class="clearfix">
                <el-select v-model="examForm.type" placeholder="请选择题型" @change="examPaperTypeChange" class="left" style="width:calc(100% - 30px)" :disabled="formDisabled">
                  <el-option v-for="item in paperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="请选择试卷类型，重复考试时，人工组卷题目不会变化；随机组卷题目会随机抽取！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="选择试卷" prop="paperId" class="clearfix">
                <el-select v-model="examForm.paperId" placeholder="请选择题型" class="left" style="width:calc(100% - 30px)" :disabled="formDisabled" @change="paperChange">
                  <el-option v-for="item in paperList" :key="item.id" :label="item.paperName" :value="item.id"></el-option>
                </el-select>
                <el-tooltip class="right"  effect="dark" content="根据您选择的试卷类型，系统自动获取对应试卷列表，您可以选择需要的考卷！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="分类" prop="examinationType">
                <el-select v-model="examForm.examinationType" placeholder="请选择分类" style="width:calc(100% - 30px)" :disabled="formDisabled">
                  <el-option v-for="item in examinationTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开放单位" prop="openDepts" class="clearfix" v-show="!formDisabled">
                <!-- 可以多选；只能是本单位或者下级单位，无法选择上级及其他单位 -->
                <!-- <el-select v-model="examForm.openDepts" placeholder="请选择开放单位" multiple class="left openWrap" style="width:calc(100% - 30px)">
                  <el-option v-for="item in openDeptsList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                </el-select> -->
                <el-collapse class="left" style="width:calc(100% - 30px)">
                  <el-collapse-item name="1">
                     <template slot="title">
                      <div style="position:relative;">
                        <span>选择部门</span>
                        <el-checkbox-group v-model="checkListDeps" style="position:absolute;top: 0;left: 100px;" :disabled="formDisabled">
                          <!-- 当前登录部门的 所有上级复选框 禁用 -->
                          <el-checkbox :label="1" :disabled="Number(deptInfo.depType)>1" @change="handleCheckedDepts($event,'1')">总队</el-checkbox>
                          <el-checkbox :label="2" :disabled="Number(deptInfo.depType)>2" @change="handleCheckedDepts($event,'2')">支队</el-checkbox>
                          <el-checkbox :label="3" :disabled="Number(deptInfo.depType)>3" @change="handleCheckedDepts($event,'3')">大队</el-checkbox>
                          <el-checkbox :label="4" :disabled="Number(deptInfo.depType)>4" @change="handleCheckedDepts($event,'4')">派出所</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </template>
                    <div class="dept-tree" v-loading="treeLoading">
                      <!-- v-if="formDisabled" -->
                      <el-tree class="filter-tree" :data="openDeptsList"
                        :props="openDeptProps"
                        :default-expand-all="false"
                        ref="depTree"
                        highlight-current
                        show-checkbox
                        check-strictly
                        @check-change="checkDeptChange"
                        :expand-on-click-node="false" node-key="deptId"
                        :default-expanded-keys="defaultExpandedKeys"
                        :default-checked-keys="defaultCheckedKeys"
                        style="margin-top: 5px;">
                        <span slot-scope="{ node, data }" @mouseleave="mouseleave(data,$event)" @mouseover="mouseover(data,$event)" style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                          <span>
                            <span>{{data.deptName}}</span>
                          </span>
                          <span class="node_none">
                            <el-button v-if="data.child && data.child.length>0" size="mini" @click="checkedSonDept(data,$event)" circle icon="el-icon-check" title="选中子部门"></el-button>
                            <el-button v-if="data.child && data.child.length>0" size="mini" @click="noCheckedSonDept(data,$event)" circle icon="el-icon-close" title="取消子部门"></el-button>
                          </span>
                        </span>
                      </el-tree>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <el-tooltip class="right" effect="dark" content="根据实际情况，选择可以参加本次考试的机构单位！" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="阅卷人员" prop="markPeople" class="clearfix" v-show="yjryIsShow && !formDisabled">
                <el-input type="text" v-model="yjry" clearable class="left" style="width:360px;" @keyup.enter.native="filterMarkPeople(yjry)" placeholder="请输入关键字，回车键搜索" :disabled="formDisabled"></el-input>
                  <!-- filterable
                  :filter-method="filterMethod" -->
                <el-transfer class="left" style="width:calc(100% - 30px)"
                  filter-placeholder="请输入关键字检索人员"
                  v-model="examForm.markPeople"
                  :button-texts="['移除', '选中']"
                  :titles="['人员列表','已选中的人员']"
                  :data="markingPeopleData"
                  @change="transferMarkPerChange">
                  <span slot-scope="{ option }" :title="option.dept">{{ option.label }}-{{ option.dept }}</span>
                </el-transfer>
                <el-tooltip class="right" effect="dark" content="请选择本次考试主观题的阅卷人员。" placement="top">
                  <el-button circle><i class="el-icon-question"></i></el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="考试须知" class="clearfix" prop="remark">
                <el-input type="textarea" :rows="2" v-model="examForm.remark" maxlength="1000" placeholder="最多可输入1000文字！" class="left" style="width:calc(100% - 30px)" :disabled="formDisabled"></el-input>
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
import { regCode } from '@/utils/validate'
// import { getTree } from '@/api/dept'

export default {
  name: 'add',
  data() {
    return {
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
      openDeptProps: { children: 'child', label: 'deptName', value: 'deptId' }, // 开放单位是否可编辑
      // openDeptDisabledProps: { children: 'child', label: 'deptName', value: 'deptId', disabled: function(data, node) { return true } }, // 开放单位是否可编辑
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
      checkListDeps: [], // 开放部门复选框的v-model
      returnedItem: [], // 开放部门 复选框 递归时用到的数组
      formDisabled: false, // 表单是否禁用
      yjryIsShow: false, // 是否显示阅卷人员
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        examinationName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入考试名称'))
            } else if (regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else {
              callback()
            }
          }
        }],
        startDate: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择开始时间'))
            } else if (this.formDisabled) { // 考试已经开始 编辑时，不校验开始时间
              callback()
            } else {
              if (new Date(this.examForm.startDate).getTime() < new Date().getTime()) {
                callback(new Error('开始时间不能小于当前时间'))
              } else if (new Date(this.examForm.startDate).getTime() > new Date(this.examForm.endDate).getTime()) {
                callback(new Error('开始时间不能大于截至时间'))
              } else {
                callback()
              }
            }
          }
        },
        endDate: {
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请选择截止时间'))
            } else if (new Date(this.examForm.endDate).getTime() < new Date().getTime()) {
              callback(new Error('截至时间不能小于当前时间'))
            } else if (new Date(this.examForm.startDate).getTime() > new Date(this.examForm.endDate).getTime()) {
              callback(new Error('截至时间不能小于开始时间'))
            } else {
              callback()
            }
          }
        },
        totalDate: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[0-9]+$/
            if (value === '') {
              callback(new Error('请输入考试时限'))
            } else if (reg.test(value)) {
              if (Number(value) < 5) {
                callback(new Error('考试时限需至少大于五分钟'))
              }
              if (this.examForm.startDate && this.examForm.endDate) { // 考试时限 不能大于 开始时间和截止时间
                var diff = this.timeDifference(this.examForm.startDate, this.examForm.endDate)
                if (value > diff) {
                  callback(new Error('考试时限不能大于考试时间'))
                } else {
                  callback()
                }
              }
            } else {
              callback(new Error('考试时限最多为三位数字'))
            }
          }
        }],
        permitNumber: {
          required: true, message: '请输入允许次数', trigger: 'blur'
        },
        type: {
          required: true, message: '请选择试卷类型', trigger: 'change'
        },
        paperId: {
          required: true, message: '请选择试卷', trigger: 'change'
        },
        examinationType: {
          required: true, message: '请选择分类', trigger: 'change'
        },
        openDepts: {
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            var checkedNodes = this.$refs.depTree.getCheckedNodes()
            if (checkedNodes.length > 0) {
              callback()
            } else {
              callback(new Error('请选择开放单位'))
            }
          }
        },
        markPeople: {
          required: false, trigger: 'change', validator: (rule, value, callback) => {
            if (this.yjryIsShow) {
              if (value && value.length > 0) {
                callback()
              } else {
                callback(new Error('请选择本次考试主观题的阅卷人员'))
              }
            } else {
              callback()
            }
          }
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
        _this.markFilterFlag = true
        for (let k = 0; k < _this.markPerFormattingAll.length; k++) {
          var itemK = _this.markPerFormattingAll[k]
          if (itemK.label.indexOf(val) > -1) {
            _this.markingPeopleData.push(itemK)
          }
        }
      } else {
        _this.markFilterFlag = false
        // _this.markingPeopleData = this.markPerFormattingAll // 切换为所有人员
        _this.markingPeopleData = _this.markPerFormattingOwn // 搜索框为空时 展示当前部门的人
      }
    },
    transferMarkPerChange() { // 左边数据源 切换为所有人员
      if (this.markFilterFlag) {
        this.markingPeopleData = this.markPerFormattingAll
      }
    },
    uniqueById(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    mouseleave(data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.setAttribute('class', 'node_none')
    },
    mouseover(data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.setAttribute('class', 'node_block')
    },
    checkDeptChange(data) { // 复选框事件
      // this.$refs.depTree.store.nodesMap[data.id].expanded = true // 展开当前部门的子部门
    },
    checkedSonDept(data, $event) { // 选中子部门
      // this.$refs.depTree.store.nodesMap[data.id].expanded = true // 展开当前部门的子部门
      var checkNodes = this.$refs.depTree.getCheckedNodes()
      // checkNodes = this.unique(checkNodes.concat([data])) // 包含当前节点
      var newArr = this.unique(checkNodes.concat(data.child))
      this.$refs.depTree.setCheckedNodes(newArr) // 设置选中的节点
    },
    noCheckedSonDept(data, $event) { // 取消选中子部门
      var checkedNodes = this.$refs.depTree.getCheckedNodes() // 获取当前选中的部门
      for (let m = 0; m < data.child.length; m++) { // 当前节点的所有子节点
        const childItem = data.child[m]
        for (let index = 0; index < checkedNodes.length; index++) { // 遍历现有的节点
          const element = checkedNodes[index]
          if (childItem.deptId === element.deptId) {
            checkedNodes.splice(index, 1)
            break
          }
        }
      }
      this.$refs.depTree.setCheckedNodes(checkedNodes) // 设置选中的节点
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.deptId) && res.set(arr.deptId, 1))
    },
    handleCheckedDepts(value, curType) { // 开放部门checklist变化
      // console.log(value + '---' + curType)
      var checkedNodes = this.$refs.depTree.getCheckedNodes()
      var byTypeArr = []
      this.returnedItem = [] // 递归方法调用前 先将数组置为空
      byTypeArr = this.findByLeafType(this.openDeptsList, curType)
      // console.log(byTypeArr)
      if (value) { // 选中 当前类型的所有部门
        var newArr = this.unique(checkedNodes.concat(byTypeArr))
        this.$refs.depTree.setCheckedNodes(newArr) // 设置选中的节点
      } else { // 取消 当前类型的所有部门
        for (let q = 0; q < byTypeArr.length; q++) { // 当前类型的所有节点
          const childItem = byTypeArr[q]
          for (let w = 0; w < checkedNodes.length; w++) { // 遍历现有选中的节点
            const element = checkedNodes[w]
            if (childItem.deptId === element.deptId) {
              checkedNodes.splice(w, 1)
              break
            }
          }
        }
        this.$refs.depTree.setCheckedNodes(checkedNodes) // 设置选中的节点
      }
    },
    findByLeafType(nodes, type) { // 通过type找所有类型相同的部门
      for (let index = 0; index < nodes.length; index++) {
        const item = nodes[index]
        if (item.departType === type) {
          this.returnedItem.push(item)
        }
        if (item.child && item.child.length > 0) { // 判断chlidren是否有数据
          this.findByLeafType(item.child, type) // 递归调用
        }
      }
      return this.returnedItem
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
      this.examForm.openDepts = []
      this.$query('examination/' + this.carryParam.examId, {}).then((response) => {
        if (response.code === '000000') {
          if (new Date(response.data.startDate).getTime() < new Date().getTime()) { // 开始时间 小于 当前时间，说明考试已经开始
            this.formDisabled = true
            this.endDateDisabled = false
          } else {
            this.formDisabled = false
          }
          response.data.examinationType = response.data.examinationType + '' // 分类
          response.data.type = response.data.type + '' // 试卷类型
          this.examPaperTypeChange(response.data.type) // 查试卷
          this.paperChange(response.data.paperId) // 查是否含有主观题，判断是否显示阅卷老师

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
          this.examForm = response.data
          this.examForm.markPeople = newPersArr // 阅卷人员
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
        this.$refs.examForm.validateField('endDate', (error) => {
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
        this.$refs.examForm.validateField('startDate', (error) => {
          console.log(error)
        })
        // this.startPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'start')
      } else {
        // this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    cancel() {
      this.$router.push({ path: '/handlingGuide/examineManage' })
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.questionForm)
          var param = JSON.parse(JSON.stringify(this.examForm))
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
    paperChange(val) { // 选择试卷 判断是否有主观题，如果没有主观题 则不能选择阅卷老师
      if (val) {
        this.$query('exampaperinfotypes', { paperId: val }).then((response) => {
          this.formLoading = false
          if (response.code === '000000' && response.data.length > 0) { // 有主观题
            this.yjryIsShow = true
          } else {
            this.yjryIsShow = false
            this.examForm.markPeople = []
          }
        }).catch(() => {
          this.yjryIsShow = false
        })
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
.addExamine {
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
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background: rgba(184, 184, 185, 0.5);
  }
}
.spt_report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.node_block {
  display: inline-block;
}
.node_none {
  display: none;
}
</style>
