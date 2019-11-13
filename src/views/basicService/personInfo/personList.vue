<template>
  <section class="personList">
   <!--人员信息列表页-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters" label-width="90px" class="form">
       <el-form-item label="行政区划">
        <el-tooltip effect="dark" :content="selectCurxzqhDep.cityName" placement="top-start" :popper-class="(selectCurxzqhDep.cityName&&selectCurxzqhDep.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="xzqhOptions"
            v-model="area"
            :props="props"
            change-on-select
            @change="handleAreaChange"
            :show-all-levels="false"
            placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="单位机构">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
        <el-form-item label="姓名" prop="realName">
        <el-autocomplete
          v-model="filters.realName"
          :fetch-suggestions="querySearchAsyncName"
          placeholder="输入关键字检索"
          :trigger-on-focus="false"
          @select="handleSelectName"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="人员类别" prop="userSort">
        <el-select  v-model="filters.userSort" size="small" placeholder="请选择" clearable  @change="rylbChange">
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('rylx')" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="userState">
        <el-select  v-model="filters.userState" size="small" placeholder="请选择" clearable :disabled="statusDisabled">
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(curUserState)" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="exportList">导出</el-button>
      </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;"  class="testList"  :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="linkColor" @click="handleDetail(scope.$index, scope.row)">{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="警号"  width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userIdNumber" label="身份证号" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.userIdNumber'>{{getAfterSix(scope.row.userIdNumber)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userSex" label="性别" >
        <template slot-scope="scope">
          <span v-if="scope.row.userSex+''">{{getSex(scope.row.userSex)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="现任职级" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.workerGrade'>{{$getDictName(scope.row.workerGrade+'', 'xrzj')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="现任职务" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.workerDuty'>{{$getDictName(scope.row.workerDuty+'', xrzw)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workerPhone" label="办公电话" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="phone" label="手机号码"  width="160" show-overflow-tooltip></el-table-column>
       <el-table-column prop="userSort" label="人员类别" width="100">
        <template slot-scope="scope">
          <span v-if='scope.row.userSort'>{{$getDictName(scope.row.userSort+'','rylx')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userState" label="状态">
        <template slot-scope="scope">
          <span v-if='scope.row.userState'>
            <span v-if='scope.row.userSort===1'>{{$getDictName(scope.row.userState+'','ryztmj')}}</span>
            <span v-else>{{$getDictName(scope.row.userState+'','ryztfj')}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="编辑信息"  type="primary" icon="el-icon-edit" circle  v-if='scope.row.id===curUser.id'  @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" title="编辑状态"  type="primary"  icon="el-icon-edit-outline"  circle  v-if="(scope.row.departCode===curDept.depCode) && $isViewBtn('170001')"  @click="editStatus(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
          :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 状态编辑 -->
    <el-dialog title="编辑人员状态" :visible.sync="isShowEditStatus" size="small" class="editPerStatus">
      <el-form ref="editPerForm" :rules="editPerRules" :model="editPerForm" size="mini" :label-width="formLabelWidth">
        <el-form-item label="姓名" prop="realName" :label-width="formLabelWidth">
          <span>{{curRow.realName}}</span>
        </el-form-item>
        <el-form-item label="身份证号" prop="userIdNumber" :label-width="formLabelWidth">
          <span v-if='curRow.userIdNumber'>{{getAfterSix(curRow.userIdNumber)}}</span>
        </el-form-item>
        <el-form-item label="排列次序" prop="order" :label-width="formLabelWidth">
          <el-input-number v-model.trim="editPerForm.order" :min="1" :max="999" @change="sortChange(editPerForm)"></el-input-number>
        </el-form-item>
        <el-form-item label="人员状态" prop="userState">
          <el-select  v-model="editPerForm.userState" size="small" placeholder="">
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts(editPerStatus)" :key="item.dictKey"></el-option>
          </el-select>
      </el-form-item>
      <div class="tipText">
        <i class="el-icon-warning"></i> 状态非“在职”人员，将不能再登录平台及办理相关业务，请务必谨慎设置人员状态！
      </div>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save"  class="saveBtn" :loading="btnLoading">保 存</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
import http from '@/api/http'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {
        realName: '', // 姓名关键字
        userSort: '',	// 人员类别
        userState: '' // 人员状态
      },
      area: [],
      department: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      isShowEditStatus: false,
      list: [],
      formLabelWidth: '100px',
      btnLoading: false,
      curRow: {}, // 存储当前被点击行数据
      curUserState: '', // 根据人员类别存储对应的在职状态key值。 'userStatefj': 辅警、工勤, 'userStatemj':民警
      xrzw: '', // 根据当前用户角色是总队，还是支队，存储对应的字典key值， ‘xrzwzod’：总队， 'xrzwzhd':支队
      editPerForm: {
        order: 1, // 排列次序
        userState: '' // 人员状态
      },
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' }, // 当前选中的部门
      selectCurxzqhDep: { cityName: '' }, // 当前行政区划
      editPerStatus: '', // 点击列表当前行，根据当前行的人员类别， 判断出人员状态的字典key值并存储。
      downLoadUrl: http.LoginModuleName, // nginx配置的文件下载
      tableHeight: null,
      statusDisabled: true,
      editPerRules: {
        order: [ // 序号
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              // if (!value) {
              //   callback(new Error('请输入序号'))
              // } else {
              //   callback()
              // }
              callback()
            }
          }
        ],
        userState: [ // 人员状态
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            currentArea = [this.curDept.areaCode]
          } else if (this.curDept.depType === '2') { // 支队
            currentArea = ['610000', this.curDept.areaCode]
          } else if (this.curDept.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') {
            if (this.curDept.areaCode === '610403') { // 杨凌例外
              currentArea = ['610000', '610403']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          this.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          if (this.curDept.depType === '-1') { // 省
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '1') { // 总队
            this.department = [this.curDept.parentDepCode, this.curDept.depCode]
          } else if (this.curDept.depType === '2') { // 支队
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '3') { // 大队
            this.department = [this.curDept.depCode]
          } else if (this.curDept.depType === '4') { // 派出所
            this.department = [this.curDept.parentDepCode, this.curDept.depCode]
          }
          this.handleDeptChange(this.department)
          this.query(true) // 查询列表
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAreaChange(val) { // 行政区划
      this.department = []
      this.selectCurDep = { name: '' } // 当前选中的部门
      if (val.length > 0) {
        this.xzqhDepChange(val)
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        var param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              var arr = []
              const data = response.data
              for (let i = 0; i < data.length; i++) {
                const obj = data[i]
                arr.push({
                  id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                  depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                })
              }
              this.deptOptions = getTree(arr) // 机构
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    xzqhDepChange(val) { // 行政区划获取当前tiptop信息
      if (val.length > 0) {
        if (this.xzqhOptions && this.xzqhOptions[0].children) {
          var xzqhOptions = this.xzqhOptions[0].children
          for (let i = 0; i < xzqhOptions.length; i++) {
            const dept = xzqhOptions[i]
            if (dept.cityCode === val[val.length - 1]) {
              this.selectCurxzqhDep = dept
            } else {
              if (dept.children && dept.children.length > 0) {
                for (let j = 0; j < dept.children.length; j++) {
                  const depts = dept.children[j]
                  if (depts.cityCode === val[val.length - 1]) {
                    this.selectCurxzqhDep = depts
                  }
                }
              }
            }
          }
        }
      } else {
        this.selectCurxzqhDep = { cityName: '' }
      }
    },
    handleDeptChange(val) { // 单位机构
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.department = []
        this.selectCurDep = { name: '' }
      }
    },
    query(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        realName: this.filters.realName, // 姓名关键字
        userSort: this.filters.userSort,	// 人员类别
        userState: this.filters.userState, // 人员状态
        pageNum: this.page, // 页数
        pageSize: this.pageSize // 条数
      }
      if (this.area && this.area.length > 0) { // 行政区划
        para.provinceCode = this.area[0] || '' // 省code
        para.cityCode = this.area[1] || '' // 市code
        para.reginCode = this.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.department && this.department.length > 0) { // 单位机构
        para.departCode = this.department[this.department.length - 1] || '' // 部门code
      } else {
        para.departCode = ''
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/USERMESSAGE', para, 'upms').then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.list = response.data.list
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.list = []
      this.total = 0
      this.pageSize = 15
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true, true)
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/basicService/personInfo', query: { type: 'listDetail', id: row.id }})
    },
    handleEdit(index, row) { // 编辑
      this.$router.push({ path: '/basicService/personInfo', query: { type: 'listEdit', id: row.id }})
    },
    editStatus(index, row) { // 编辑人员状态
      this.curRow = row
      this.editPerForm.order = row.order
      var userSort = row.userSort ? row.userSort + '' : ''
      if (userSort) {
        this.editPerForm.userState = row.userState ? row.userState + '' : ''
        if (userSort === '1') { // 民警
          this.editPerStatus = 'ryztmj'
        } else { // 辅警，工勤
          this.editPerStatus = 'ryztfj'
        }
      }

      this.isShowEditStatus = true
    },
    querySearchAsyncName(queryString, cb) { // 姓名检索
      if (queryString) {
        this.isQueryName = true
        if (this.isQueryName) {
          var param = {
            realName: this.filters.realName
          }
          if (this.area[0]) {
            param.provinceCode = this.area[0]
          }
          if (this.area[1]) {
            param.cityCode = this.area[1]
          }
          if (this.area[2]) {
            param.reginCode = this.area[2]
          }
          if (this.department && this.department.length > 0) { // 单位机构
            param.departCode = this.department[this.department.length - 1] || '' // 部门code
          }
          this.$query('USERNAMERETRIEVAL', param, true).then((response) => {
            var restaurants = response.data
            restaurants.forEach(element => {
              element.value = element.realName
            })
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          })
        }
      } else {
        this.isQueryName = false
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelectName(item) {
      this.filters.realName = item.realName
      this.isQueryName = false
    },
    resetForm() { // 重置
      this.filters = {
        realName: '', // 姓名关键字
        userSort: '',	// 人员类别
        userState: '', // 人员状态
        deptId: ''
      }
      this.area = []
      this.department = []
      this.initData()
      this.init()
    },
    exportList() { // 导出
      var para = {
        id: this.curDept.id, // 当前部门的id
        logFlag: 1, // 添加埋点参数
        type: 2, // 接口规定的
        userId: this.curUser.id,
        realName: this.filters.realName, // 姓名关键字
        userSort: this.filters.userSort,	// 人员类别
        userState: this.filters.userState // 人员状态
      }
      if (this.area && this.area.length > 0) { // 行政区划
        console.log(this.area)
        para.provinceCode = this.area[0] || '' // 省code
        para.cityCode = this.area[1] || '' // 市code
        para.reginCode = this.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.department && this.department.length > 0) { // 单位机构
        para.departCode = this.department[this.department.length - 1] || '' // 部门code
      } else {
        para.departCode = ''
      }

      var url = this.downLoadUrl + 'excel/exporFile/USERMESSAGE?id=' + this.curDept.id + '&type=' + 2 + '&userId=' + this.curUser.id +
        '&provinceCode=' + para.provinceCode + '&cityCode=' + para.cityCode + '&reginCode=' + para.reginCode + '&departCode=' + para.departCode +
         '&realName=' + para.realName + '&userSort=' + para.userSort + '&userState=' + para.userState
      window.open(url)
    },
    rylbChange(val) { // 人员类别change事件
      this.filters.userState = ''
      this.curUserState = ''
      this.statusDisabled = true
      if (val) {
        if (val === '1') { // 民警
          this.curUserState = 'ryztmj'
        } else { // 辅警，工勤
          this.curUserState = 'ryztfj'
        }
        this.statusDisabled = false
      }
    },
    save() { // 保存
      this.$refs.editPerForm.validate(valid => {
        if (valid) {
          if (this.editPerForm.userState === '1') { // 在职
            this.saveData(1)
          } else {
            var status = this.$getDictName(this.editPerForm.userState, this.editPerStatus)
            this.$confirm('是否确定将人员状态设置为' + status + '，设置以后该人员将不能再正常登录系统及办理相关业务！', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(() => {
              this.saveData(0)
            }).catch(() => {
              // this.isShowEditStatus = false
            })
          }
        }
      })
    },
    saveData(enabled) {
      this.btnLoading = true
      this.editPerForm.lastId = this.curUser.id // 最后修改人id
      this.editPerForm.lastName = this.curUser.realName // 最后修改人姓名
      this.editPerForm.enabled = enabled // 人员的启用/禁用状态，在职状态，传1，非在职状态，传0
      this.$update('userState/' + this.curRow.id, this.editPerForm, true).then((response) => {
        if (response.code === '000000') {
          this.$message({
            message: '人员状态设置成功！',
            type: 'success',
            duration: 2000
          })
          // setTimeout(() => {
          this.btnLoading = false
          this.isShowEditStatus = false
          this.query(true)
          // }, 2000)
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    cancel() {
      this.isShowEditStatus = false
    },
    getSex(val) {
      var name = ''
      if (val === 0) {
        name = '男'
      } else if (val === 1) {
        name = '女'
      } else if (val === 2) {
        name = '未知'
      }
      return name
    },
    getAfterSix(val) {
      var number = ''
      if (val.length === 18) {
        number = val.substring(0, 12) + '******'
      } else if (val.length === 15) {
        number = val.substring(0, 10) + '******'
      }
      return number
    },
    sortChange(obj) {
      if (!obj.order) {
        setTimeout(() => {
          this.$set(obj, 'order', 1)
        }, 50)
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '1') { // 总队
        this.xrzw = 'xrzwzod'
      } else if (this.curDept.depType === '2') { // 支队
        this.xrzw = 'xrzwzhd'
      } else if (this.curDept.depType === '3') { // 大队
        this.xrzw = 'xrzwdd'
      } else if (this.curDept.depType === '4') { // 派出所
        this.xrzw = 'xrzwpcs'
      }
    }
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.init()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.personList{
  .el-dialog{
    width: 35%;
  }
  .editPerStatus .el-form{
    width: 85%;
    margin: 0 auto;
  }
  .tipText{
    margin: 8px 0;
    color: #ffe617;
  }
  .el-select .el-input--small .el-input__inner {
    height: 25px !important;
  }
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.el-cascader--small {
  font-size: 16px;
}
</style>
