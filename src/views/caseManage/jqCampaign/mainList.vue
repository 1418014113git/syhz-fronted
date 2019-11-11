<template>
  <section class="mainList">
   <!--集群战役列表-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="行政区划">
          <el-tooltip effect="dark" class="input_w" :content="selectCurxzqhDep.cityName" placement="top-start" :popper-class="(selectCurxzqhDep.cityName&&selectCurxzqhDep.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="xzqhOptions"
              v-model="area"
              :props="props"
              change-on-select
              @change="handleAreaChange"
              :show-all-levels="false"
              :disabled="Number(curDept.depType)>2"
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="单位机构">
          <el-tooltip effect="dark" class="input_w" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptions"
              v-model="department"
              :props="deptProps"
              change-on-select
              :show-all-levels="false"
              @change="handleDeptChange"
              :disabled="Number(curDept.depType)>2"
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="下发类别" prop="status">
          <el-select  v-model="filters.status" size="small" placeholder="全部" clearable class="input_w">
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select  v-model="filters.status" size="small" placeholder="全部" clearable class="input_w">
            <!-- <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('status')" :key="item.dictKey"></el-option> -->
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24"  style="padding-bottom: 0;">
        <el-form-item label="发起日期">
          <el-date-picker v-model="dateRand1" type="daterange" range-separator="至" class="input_w"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange1"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="dateRand2" type="daterange" range-separator="至" class="input_w"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange2"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="filters.title" clearable placeholder="请输入标题" size="small" maxlength="50" class="input_w"></el-input>
        </el-form-item>
        <!-- <el-form-item label="发起日期" prop="start1">
          <el-date-picker
            v-model="filters.start1"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间"
            @change="fqStartDateChange"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="end1" label-width="30px">
          <el-date-picker
            v-model="filters.end1"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="fqEndDateDisabled">
          </el-date-picker>
       </el-form-item>
       <el-form-item label="结束日期" prop="start2">
          <el-date-picker
            v-model="filters.start2"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择开始时间"
            @change="jSstartDateChange"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="end2" label-width="30px">
          <el-date-picker
            v-model="filters.end2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="jSendDateDisabled">
          </el-date-picker>
        </el-form-item> -->
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item>
          <el-button type="primary" size="small"  @click="query(true,true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-if="btnqx.isShowsqbtn"   @click="apply">申请</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  v-if="btnqx.isShowxfbtn" @click="downSend">下发</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  v-if="btnqx.isShowbxfbtn" @click="budownSend">部下发</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="exportList">导出</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" :max-height="tableHeight" :row-key="getRowKeys"  :expand-row-keys="expands" @expand-change="rowClick" @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.tableDataList"  v-loading="listChildLoading" >
            <!-- <el-table-column prop="" width="47"></el-table-column> -->
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="" align="center" label="地市"  width="200"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="xsnum" align="center" label="检查线索数量"  width="200">
              <template slot-scope="scope">
                <span class="linkColor"  @click="handleClueList(scope.row)">{{scope.row.xsnum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="检查率"  width="200"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50"></el-table-column>
      <!-- <el-table-column prop="" width="47"></el-table-column> -->
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="title" align="center" label='标题'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyDateName" align="center" label='发起单位'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startDate" align="center" label='发起日期'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="endDate" align="center" label='结束日期'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="citys" align="center" label='涉及省/市数'  min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalxsnum" align="center" label='总线索数'  min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="linkColor"  @click="handleClueList(scope.row)">{{scope.row.totalxsnum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label='状态'  min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.status'>{{$getDictName(scope.row.status+'','status')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" align="center" label='厅评价'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" align="center" label='市评价'  min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--查阅密码弹出层-->
    <el-dialog title="查阅密码" :visible.sync="isShowdialog" class="querypsd">
      <el-form ref="passWordForm" :rules="passWordRules" :model="passWordForm" size="mini" label-width="100px">
        <el-form-item label="查阅密码" prop="queryPwd">
          <el-input v-model.trim="passWordForm.queryPwd" type="password" auto-complete="off" maxlength="8" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC martop btnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="handleSubmit" v-loading.fullscreen.lock="loadingFlag" class="saveBtn">验证</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
import ClueList from './clueList' // 线索列表
export default {
  name: 'mainList',
  components: {
    ClueList
  },
  data() {
    return {
      filters: {
        status: '', // 状态
        title: '' // 标题
        // start1: '', // 发起日期 开始时间
        // end1: '', // 发起日期 结束时间
        // start2: '', // 结束日期 开始时间
        // end2: '' // 结束日期 结束时间
      },
      // curDeptCode: '', // 当前部门
      listData: [],
      total: 0,
      page: 1,
      pageSize: 15,
      dateRand1: [], // 发起日期 时间集合
      dateRand2: [], // 结束日期 时间集合
      passWordForm: {
        queryPwd: ''
      },
      btnqx: { // 查询列表上的一些按钮权限控制
        // isShowsqbtn: false, // 是否显示申请按钮   市支队、区县大队有权限。
        // isShowxfbtn: false, // 是否显示下发按钮   厅总队、市支队有权限。
        // isShowbxfbtn: false // 是否显示部下发按钮   厅总队有权限。
        isShowsqbtn: true, // 是否显示申请按钮   市支队、区县大队有权限。
        isShowxfbtn: true, // 是否显示下发按钮   厅总队、市支队有权限。
        isShowbxfbtn: true // 是否显示部下发按钮   厅总队有权限。
      },
      pcsParentDept: {}, // 派出所的上级部门
      fqEndDateDisabled: false, // 发起日期 结束时间禁用
      jSendDateDisabled: false, // 结束日期 结束时间禁用
      multipleSelection: [],
      expands: [],
      area: [],
      department: [],
      listLoading: false, // 主表加载loading
      listChildLoading: false, // 子表加载loading
      isShowdialog: false, // 是否显示查阅密码弹出框
      isShowxsDialog: false, // 是否显示线索列表弹出框
      loadingFlag: false, // 验证按钮loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      exportBtn: false, // 导出按钮显隐

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
      tableHeight: null,
      passWordRules: {
        queryPwd: [
          { required: true, message: '请输入查阅密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在6到8个字符', trigger: 'blur' }
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
            this.btnqx.isShowxfbtn = true // 显示下发按钮
            this.btnqx.isShowbxfbtn = true // 显示部下发按钮
          } else if (this.curDept.depType === '2') { // 支队
            this.btnqx.isShowsqbtn = true // 显示申请按钮
            this.btnqx.isShowxfbtn = true // 显示下发按钮
            currentArea = ['610000', this.curDept.areaCode]
            for (var i = 0; i < this.xzqhOptions[0].children.length; i++) {
              const element = this.xzqhOptions[0].children[i]
              if (element.cityCode === this.deptInfo.areaCode) {
                this.xzqhOptions[0].children[i].disabled = false
              } else {
                this.xzqhOptions[0].children[i].disabled = true
              }
            }
          } else if (this.curDept.depType === '3') { // 大队
            this.btnqx.isShowsqbtn = true // 显示申请按钮
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
          } else if (this.curDept.depType === '4') { // 派出所
            this.btnqx.isShowsqbtn = true // 显示申请按钮
            currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.parentDepCode]
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
            // 查询派出所的上级
            this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
              if (response.code === '000000') {
                this.pcsParentDept = response.data
              }
            }).catch(() => {
              this.caseLoading = false
            })
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
      // if (this.filters.end1 && !this.filters.start1) {
      //   this.$alert('发起日期的开始时间不能为空', '提示', {
      //     type: 'warning',
      //     confirmButtonText: '确定'
      //   })
      //   return
      // }
      // if (this.filters.end1 && this.filters.start1 && this.filters.start1 > this.filters.end1) {
      //   this.$alert('发起日期的开始时间不能大于结束时间', '提示', {
      //     type: 'warning',
      //     confirmButtonText: '确定'
      //   })
      //   return
      // }
      this.page = flag ? 1 : this.page
      const para = {
        title: this.filters.title, // 标题
        start1: this.dateRand1[0] ? this.dateRand1[0] : '', // 发起日期 开始时间
        end1: this.dateRand1[1] ? this.dateRand1[1] : '', // 发起日期 结束时间
        start2: this.dateRand2[0] ? this.dateRand2[0] : '', // 结束日期 开始时间
        end2: this.dateRand2[1] ? this.dateRand2[1] : '', // 结束日期 结束时间
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
        para.departCode = this.department[this.department.length - 1]// 部门code
      } else {
        para.departCode = this.curDept.depCode // 所属部门code
      }
      para.curDeptType = this.curDept.depType === '4' ? this.pcsParentDept.depType : this.curDept.depType // 当前部门类型

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      this.$query('page/casecluster/list', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list
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
    getRowKeys(row) {
      // console.log('departCode', JSON.stringify(row.departCode))
      return row.departCode
    },
    rowClick(row) {
      // if (row.departCode) {
      //   if (this.expands.indexOf(row.departCode) > -1) { // 展开项中存在
      //     this.expands.splice(this.expands.indexOf(row.departCode), 1)
      //   } else { // 展开项中不存在
      //     this.expands.push(row.departCode)
      //     if (row.departCode === '610000530000') { // 省厅
      //       this.query(false, row.departCode) // 根据部门code查
      //     } else {
      //       if (row.cityCode) {
      //         this.query(false, row.cityCode) // 根据盟市code查
      //       }
      //     }
      //   }
      // }
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    },
    handleDetail(index, row) {
      if (row.passWord) { // 弹出查阅密码弹出框
        this.isShowdialog = true
      } else { // 集群战役详情页
        // this.$router.push({ path: '/jqCampaign/detail', query: {id: row.id }})
      }
    },
    resetForm() { // 重置
      this.filters = {
        status: '',
        title: '',
        start1: '',
        end1: '',
        start2: '',
        end2: ''
      }
      this.area = []
      this.department = []
      this.initData()
      this.query(true, false)
    },
    cancel() {
      this.isShowdialog = false
      this.restData()
    },
    handleSubmit(index, row) {
      this.$refs.passWordForm.validate(valid => {
        if (valid) {
          // this.$confirm('确认修改密码吗?', '提示', {
          //   type: 'warning'
          // }).then(() => {
          //   this.verifypwd()
          // })
          this.verifypwd(row)
        }
      })
    },
    verifypwd(row) { // 验证查阅密码
      this.loadingFlag = true
      var param = {
        passWord: this.passWordForm.queryPwd
      }
      this.$update('' + this.curUser.id, param, true).then((response) => {
        this.loadingFlag = false
        if (response.code === '000000') {
          // this.$message({
          //   message: '验证成功',
          //   type: 'success'
          // })
          this.isShowdialog = false
          this.$router.push({ path: '/jqCampaign/detail', query: { type: 'listDetail', id: row.id }}) // 跳转到详情页
        }
      }).catch(() => {
        this.loadingFlag = false
        this.restData()
      })
    },
    restData() {
      this.$refs['passWordForm'].resetFields()
      this.passWordForm.queryPwd = ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // fqStartDateChange(val) { // 发起日期 开始时间change事件
    //   if (val) {
    //     this.fqEndDateDisabled = false
    //   } else {
    //     this.fqEndDateDisabled = true
    //   }
    // },
    // jSstartDateChange(val) { // 结束日期 开始时间change事件
    //   if (val) {
    //     this.jSendDateDisabled = false
    //   } else {
    //     this.jSendDateDisabled = true
    //   }
    // },
    // fqEndDateDisabled(val) { // 发起日期  结束时间change事件
    //   if (val) {
    //     if (this.filters.start1 > val) {
    //       this.$alert('结束日期不能小于开始日期', '提示', {
    //         type: 'warning',
    //         confirmButtonText: '确定',
    //         callback: action => {
    //           this.filters.end1 = ''
    //         }
    //       })
    //       return
    //     }
    //     this.filters.end1 = val
    //   }
    // },
    // jSendDateDisabled(val) { // 结束日期  结束时间change事件
    //   if (val) {
    //     if (this.filters.start2 > val) {
    //       this.$alert('结束日期不能小于开始日期', '提示', {
    //         type: 'warning',
    //         confirmButtonText: '确定',
    //         callback: action => {
    //           this.filters.end2 = ''
    //         }
    //       })
    //       return
    //     }
    //     this.filters.end2 = val
    //   }
    // },
    dateChange1(val) { // 发起日期 change事件
      this.start1.start1 = val[0]
      this.start1.end1 = val[1]
    },
    dateChange2(val) { // 结束日期 change事件
      this.start1.start2 = val[0]
      this.start1.end2 = val[1]
    },
    toback() { // 返回
      this.$router.back(-1)
    },
    apply() { // 申请
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { id: 1 }}) // 跳转到集群战役申请页
    },
    downSend() { // 下发

    },
    budownSend() { // 部下发

    },
    exportList() { // 导出
      // var para = {
      //   id: this.curDept.id, // 当前部门的id
      //   logFlag: 1, // 添加埋点参数
      //   type: 2, // 接口规定的
      //   userId: this.curUser.id,
      //   realName: this.filters.realName, // 姓名关键字
      //   userSort: this.filters.userSort,	// 人员类别
      //   userState: this.filters.userState // 人员状态
      // }
      // if (this.area && this.area.length > 0) { // 行政区划
      //   console.log(this.area)
      //   para.provinceCode = this.area[0] || '' // 省code
      //   para.cityCode = this.area[1] || '' // 市code
      //   para.reginCode = this.area[2] || '' // 区code
      // } else {
      //   para.provinceCode = '' // 省code
      //   para.cityCode = '' // 市code
      //   para.reginCode = '' // 区code
      // }
      // if (this.department && this.department.length > 0) { // 单位机构
      //   para.departCode = this.department[this.department.length - 1] || '' // 部门code
      // } else {
      //   para.departCode = ''
      // }

      // var url = this.downLoadUrl + 'excel/exporFile/USERMESSAGE?id=' + this.curDept.id + '&type=' + 2 + '&userId=' + this.curUser.id +
      //   '&provinceCode=' + para.provinceCode + '&cityCode=' + para.cityCode + '&reginCode=' + para.reginCode + '&departCode=' + para.departCode +
      //    '&realName=' + para.realName + '&userSort=' + para.userSort + '&userState=' + para.userState
      // window.open(url)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.init()
  },
  activated() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.mainList{
  .el-dialog{
    width: 30%;
  }
  .querypsd{
    .el-form{
      width: 80%;
      margin: 30px auto;
    }
  }
  .input_w{
    width: 300px;
  }
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
