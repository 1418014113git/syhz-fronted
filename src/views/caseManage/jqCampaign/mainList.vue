<template>
  <section class="mainList">
   <!--集群战役列表-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="行政区划">
          <el-tooltip effect="dark"    :class="curDept.depType === '1'?'input_w':'input_ws1'"  :content="selectCurxzqhDep.cityName" placement="top-start" :popper-class="(selectCurxzqhDep.cityName&&selectCurxzqhDep.cityName.length>10)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="xzqhOptions"
              v-model="area"
              :props="props"
              change-on-select
              @change="handleAreaChange"
              :show-all-levels="false"
              :disabled="Number(curDept.depType)>2"
              :clearable="Number(curDept.depType)<2"
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="参与单位">
          <el-tooltip effect="dark"  :class="curDept.depType === '1'?'input_w':'input_ws1'"  :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>12)===true?'tooltipShow':'tooltipHide'">
            <el-cascader
              :options="deptOptions"
              v-model="department"
              :props="deptProps"
              change-on-select
              :show-all-levels="false"
              @change="handleDeptChange"
              :disabled="Number(curDept.depType)>2"
              clearable
              placeholder="全部">
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="下发类别" prop="xflb" v-if="curDept.depType === '1'">
          <el-select  v-model="xflb" size="small" placeholder="全部" clearable class="input_w">
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('jqzyxflb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select  v-model="filters.status" size="small" placeholder="全部" clearable class="input_w">
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('jqzyzt')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24"  style="padding-bottom: 0;">
        <el-form-item label="发起日期">
          <el-date-picker v-model="dateRand1" type="daterange" range-separator="至"  :class="curDept.depType === '1'?'input_w1':'input_ws1'"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange1"
            value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="dateRand2" type="daterange" range-separator="至" :class="curDept.depType === '1'?'input_w1':'input_ws1'"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange2"
            value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="标题" >
          <el-input v-model.trim="filters.title" clearable placeholder="请输入标题" size="small" maxlength="50" :class="curDept.depType === '1'?'input_w1':'input_ws1'"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="query(true,true)">查询</el-button>
          <el-button type="primary" size="small"  v-if="btnqx.isShowsqbtn && $isViewBtn('101901') "   @click="apply">申请</el-button>
          <el-button type="primary" size="small"  v-if="btnqx.isShowxfbtn && $isViewBtn('101902')"  @click="downSend">下发</el-button>
          <el-button type="primary" size="small"  v-if="btnqx.isShowbxfbtn && $isViewBtn('101903')" @click="budownSend">部下发</el-button>
          <el-button type="primary" size="small"  v-if="listData.length>0 && $isViewBtn('101904')"  @click="exportList">导出</el-button>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- <div class="tableBox"  :style="{maxHeight:tableHeight+'px'}"> -->
      <el-table :data="listData" v-loading="listLoading"  ref="multipleTable" style="width: 100%;"  :max-height="tableHeight"  :row-class-name="getRowClassName" @select="handleselectRow" @select-all="handleselectAll">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.deptList"  v-loading="listChildLoading">
              <el-table-column type="index" width="100" align="center" label="序号"></el-table-column>
              <el-table-column prop="deptName" label="地市"  align="center" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop=""  align="center" label="核查线索数量（已核查/总）" >
                <template slot-scope="sonScope">
                  <span v-if="constrolxsnum(scope.row,sonScope.row)">
                    <span class="linkColor" v-if="sonScope.row.hc && sonScope.row.hc>0" @click="handleClueList(sonScope.row,'2,3',false)">{{sonScope.row.hc}}</span>
                    <span v-else>0</span>
                    /
                    <span class="linkColor"  v-if="sonScope.row.xsNum && sonScope.row.xsNum>0" @click="handleClueList(sonScope.row,'',false)">{{sonScope.row.xsNum}}</span>
                    <span v-else>0</span>
                  </span>
                  <span v-else>
                    <span>{{sonScope.row.hc ? sonScope.row.hc:0}}</span>
                    /
                    <span>{{sonScope.row.xsNum ? sonScope.row.xsNum:0}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="hcl" align="center" label="核查率">
                <template slot-scope="sonScope">
                  <span>{{sonScope.row.hcl ? sonScope.row.hcl : 0}}%</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="title" label='标题'  min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="cursor: pointer;"  @click="handleDetail(scope.$index, scope.row)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDeptName"  label='发起单位'  min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate"  label='发起日期'  min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endDate"  label='结束日期'  min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="citys"  label='涉及省/市数'  min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop=""  label='总线索数（已核查/总）'  min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span  v-if="constrolxsTotal(scope.row)">
              <span class="linkColor"  v-if="scope.row.hcCount && scope.row.hcCount>0" @click="handleClueList(scope.row,'2,3',true)">{{scope.row.hcCount}}</span>
              <span v-else>0</span>
              /
              <span class="linkColor" v-if="scope.row.xsCount && scope.row.xsCount>0" @click="handleClueList(scope.row,'',true)">{{scope.row.xsCount}}</span>
              <span v-else>0</span>
            </span>
            <span v-else>
              <span>{{scope.row.hcCount ? scope.row.hcCount : 0}}</span>
              /
              <span>{{scope.row.xsCount ? scope.row.xsCount : 0}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status"  label='状态'  min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if='scope.row.status'>{{$getDictName(scope.row.status+'','jqzyzt')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tCount"  label='厅评价'  min-width="100" v-if="curDept.depType === '1' || curDept.depType === '2'"    show-overflow-tooltip></el-table-column>
        <el-table-column prop="sCount"  label='市评价'  min-width="100" v-if="curDept.depType === '2' || curDept.depType === '3' || curDept.depType === '4'"  show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
            <el-button size="mini" title="修改"  type="primary" icon="el-icon-edit" circle  v-if="controlxg(scope.row)"  @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button size="mini" title="删除"  type="primary" icon="el-icon-delete" circle  v-if="controlsc(scope.row)"  @click="handleDel(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- </div> -->
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--查阅密码弹出层-->
    <el-dialog title="查阅密码" :visible.sync="isShowdialog" class="querypsd" @close="cancel">
      <el-form ref="passWordForm" :rules="passWordRules" :model="passWordForm" size="mini" label-width="100px">
        <el-form-item label="查阅密码" prop="passKey">
          <el-input v-model.trim="passWordForm.passKey" type="password" auto-complete="off" maxlength="8" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC martop btnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="handleSubmit" :loading="loadingFlag" class="saveBtn">验证</el-button>
      </el-row>
    </el-dialog>

    <!--导出弹出层-->
    <el-dialog title="导出" :visible.sync="isShowdcdialog" class="dcForm">
      <div class="dctitle">
        <i class="el-icon-warning iconStyle"></i>
        <span style="font-weight: bold;">导出协查战果反馈表</span>
      </div>
      <div class="checkArea">
        <el-radio v-model="dcForm.type" :label="1" style="margin-right:45px;">全部查询结果</el-radio>
        <el-radio v-model="dcForm.type" :label="2" :disabled="checkId.length===0">选中记录</el-radio>
      </div>
      <el-row class="tabC martop btnUpLine">
        <el-button  @click="canceldc" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="exporttableList"  class="saveBtn">导出</el-button>
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
        title: '', // 标题
        start1: '', // 发起日期 开始时间
        start2: '', // 发起日期 结束时间
        end1: '', // 结束日期 开始时间
        end2: '' // 结束日期 结束时间
      },
      dcForm: {
        type: 1
      },
      isShowdcdialog: false, // 是否显示导出弹框
      xflb: '', // 下发类别   厅总队账号，多一个查询条件“下发类别”（部下发，厅下发）
      listData: [],
      total: 0,
      page: 1,
      pageSize: 15,
      dateRand1: [], // 发起日期 时间集合
      dateRand2: [], // 结束日期 时间集合
      passWordForm: { // 查阅密码
        passKey: ''
      },
      btnqx: { // 查询列表上的一些按钮权限控制
        isShowsqbtn: false, // 是否显示申请按钮   市支队、区县大队有权限。
        isShowxfbtn: false, // 是否显示下发按钮   厅总队、市支队有权限。
        isShowbxfbtn: false // 是否显示部下发按钮   厅总队有权限。
      },
      pcsParentDept: {}, // 派出所的上上级部门
      pcsParentDeptype: '', // 派出所上级部门的部门类型
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
      checkId: [], // 复选框选中的列表id
      downLoadUrl: process.env.SYHZ_MODULE,
      carryParam: {}, // 存储集群战役统计页传递过来的参数
      totalType: '', // 要查申请获取下发标识
      curparam: '', // 存储查询列表的参数临时变量
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
      noCheck: '', // 存储从首页个人待办，待审核列表点击传递国来的参数
      passWordRules: {
        passKey: [
          { required: true, message: '请输入查阅密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在6到8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(flag) {
      this.listLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
            // currentArea = [this.curDept.areaCode]
            this.btnqx.isShowxfbtn = true // 显示下发按钮
            this.btnqx.isShowbxfbtn = true // 显示部下发按钮
          } else if (this.curDept.depType === '2') { // 支队
            this.btnqx.isShowsqbtn = true // 显示申请按钮
            // this.btnqx.isShowxfbtn = true // 显示下发按钮
            currentArea = ['610000', this.curDept.areaCode]
            this.xzqhOptions[0].disabled = true
            for (var i = 0; i < this.xzqhOptions[0].children.length; i++) {
              const element = this.xzqhOptions[0].children[i]
              if (element.cityCode === this.curDept.areaCode) {
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
            if (this.curDept.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
            }
          }
          if (this.carryParam.areaCode) { // 集群战役统计页传递过来的参数 行政区划
            this.area = this.carryParam.areaCode
          } else {
            this.area = currentArea
          }

          this.handleAreaChange(this.area) // 查单位机构
          if (this.carryParam.deptCode) { // 集群战役统计页传递过来的参数 部门code
            this.department = [this.carryParam.deptCode]
          } else { // 默认选择本单位
            if (this.curDept.depType === '-1') { // 省
            // this.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '1') { // 总队
            // this.department = [this.curDept.parentDepCode, this.curDept.depCode]
            } else if (this.curDept.depType === '2') { // 支队
              this.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '3') { // 大队
              this.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '4') { // 派出所
              this.department = [this.curDept.parentDepCode] // 派出所登录进来，把它自己当作它的上级单位
              // // 查询派出所的上级(大队)的部门信息
              this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
                if (response.code === '000000') {
                  this.pcsParentDept = response.data
                }
              }).catch(() => {

              })
            }
          }

          this.handleDeptChange(this.department)
          this.query(true, flag) // 查询列表
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    constrolxsTotal(row) { // 线索总数点击权限控制
      return this.curDept.depType === '1' || this.curDept.areaCode === row.cityCode || this.curDept.depCode === row.applyDeptCode || (row.category === 3 && (this.curDept.depCode === row.auditDeptCode)) || (this.curDept.depType === '4' && this.curDept.parentDepCode === row.applyDeptCode)
    },
    constrolxsnum(zRow, row) { // 核查线索数量点击权限控制
      return this.curDept.depType === '1' || this.curDept.areaCode === row.cityCode || this.curDept.depCode === row.deptCode || (zRow.category === 3 && (this.curDept.depCode === zRow.auditDeptCode)) || this.curDept.depCode === row.applyDeptCode || (this.curDept.depType === '4' && this.curDept.parentDepCode === row.applyDeptCode)
    },
    controlxg(row) { // 控制列表修改按钮
      return row.status === '0' && (this.curUser.id === row.userId || (((this.curDept.depType === '4' && this.curDept.parentDepCode === row.applyDeptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.applyDeptCode)) && this.$isViewBtn('101905')))
    },
    controlsc(row) { // 控制列表删除按钮
      return row.status === '0' && (this.curUser.id === row.userId || (((this.curDept.depType === '4' && this.curDept.parentDepCode === row.applyDeptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.applyDeptCode)) && this.$isViewBtn('101906')))
    },
    handleAreaChange(val) { // 行政区划
      this.department = []
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
                if (obj.depType !== '4') { // 不展示派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
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
    handleDeptChange(val) { // 单位机构名称鼠标移上去显示全部
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
        title: this.filters.title, // 标题
        start1: this.filters.start1, // 发起日期 开始时间
        start2: this.filters.start2, // 发起日期 结束时间
        end1: this.filters.end1, // 结束日期 开始时间
        end2: this.filters.end2, // 结束日期 结束时间
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        curDeptCode: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode, // 当前部门code
        status: this.filters.status, // 状态，
        isCheck: this.$isViewBtn('101908'), // 是否有审核权限
        noCheck: this.noCheck, // 从首页个人待办，待审核列表点击进来传递的标识。有标识只查询审核中和待审核的记录
        curCreate: this.totalType // 要查申请、下发的标识
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
      if (this.curDept.depType === '1') { // 总队
        para.xflb = this.xflb // 下发类别
      }
      if (this.department && this.department.length > 0) { // 单位机构
        para.queryDeptCode = this.department[this.department.length - 1] // 部门code
      } else {
        para.queryDeptCode = ''
      }
      // para.curDeptType = this.curDept.depType === '4' ? this.pcsParentDeptype : this.curDept.depType // 当前部门类型 .派出所取他的父级类型
      // para.parentCode = this.curDept.depType === '4' ? this.pcsParentDept.departCode : this.curDept.parentDepCode // 当前部门父级单位code

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
        para.noCheck = ''
        para.curCreate = ''
      }
      this.curparam = para
      this.$query('casecluster/list', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list
          this.$nextTick(function() {
            this.memoryChecked() // 记忆复选框被选中的列表
          })
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.listData = []
      this.page = 1
      this.total = 0
      this.pageSize = 15
    },
    handleDel(index, row) { // 删除
      this.$confirm('确定要删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          clusterId: row.clusterId
        }
        this.$update('casecluster/delete', param).then((response) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query(true, true) // 查询列表
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.listLoading = false
      })
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
      this.curRow = row
      if (row.havePwd > 0) { // 弹出查阅密码弹出框
        this.isShowdialog = true
      } else { // 集群战役详情页
        this.$router.push({ path: '/jqCampaign/detail', query: { id: row.clusterId }})
      }
    },
    resetForm() { // 重置
      this.filters = {
        status: '',
        title: '',
        start1: '',
        start2: '',
        end1: '',
        end2: ''
      }
      this.area = []
      this.department = []
      this.dateRand1 = []
      this.dateRand2 = []
      this.checkId = []
      this.initData()
      this.init(true)
    },
    cancel() {
      this.isShowdialog = false
      this.restData()
    },
    handleSubmit() {
      this.$refs.passWordForm.validate(valid => {
        if (valid) {
          this.verifypwd()
        }
      })
    },
    verifypwd() { // 验证查阅密码
      const param = {
        assistId: this.curRow.clusterId,
        pwd: this.passWordForm.passKey
      }
      this.loadingFlag = true
      this.$update('casecluster/detailPwd', param).then((response) => {
        this.loadingFlag = false
        if (response.code === '000000') {
          this.isShowdialog = false
          this.$router.push({ path: '/jqCampaign/detail', query: { id: this.curRow.clusterId }}) // 跳转到详情页
        }
      }).catch(() => {
        this.loadingFlag = false
        this.restData()
      })
    },
    restData() {
      this.$refs['passWordForm'].resetFields()
      this.passWordForm.passKey = ''
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      // this.checkIdRow = []
      // if (selection.length > 0) {
      //   selection.forEach((item, index) => {
      //     this.checkIdRow.push(item.clusterId)
      //   })
      // }
      if (this.checkId.length === 0 && selection.length > 0) {
        this.checkId.push(row.clusterId)
      } else {
        var checkId_ = this.checkId
        checkId_.forEach((clusterId) => {
          if (row.clusterId === clusterId) {
            this.removeByValue(this.checkId, row.clusterId)
          } else {
            if (!this.temp(row.clusterId)) {
              this.checkId.push(row.clusterId)
            }
          }
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    handleselectAll(selection) { // 全选
      var allSelect = selection
      if (selection.length > 0) {
        var checkId_1 = this.checkId
        allSelect.forEach((item, index) => {
          checkId_1.forEach((it, i) => {
            if (it !== item.clusterId) {
              if (!this.temp(item.clusterId)) {
                this.checkId.push(item.clusterId)
              }
            }
          })
        })
        if (this.checkId.length === 0) {
          allSelect.forEach((item, i) => {
            this.checkId.push(item.clusterId)
          })
        }
      } else {
        this.listData.forEach((item) => {
          this.checkId.forEach((it) => {
            if (item.clusterId === it) {
              this.removeByValue(this.checkId, item.clusterId)
            }
          })
        })
      }
      if (this.checkId.length > 0) {
        this.xsNum = this.checkId.length
      } else {
        this.xsNum = 0
      }
    },
    removeByValue(arr, val) { // 去重
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
        }
      }
    },
    temp(id) {
      if (this.checkId.indexOf(id) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 记忆函数
    memoryChecked() {
      // console.log('jiyi', JSON.stringify(this.checkId))
      if (this.listData.length > 0) {
        this.listData.forEach((item, index) => {
          if (this.checkId.indexOf(item.clusterId) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      }
    },

    getRowClassName({ row, rowIndex }) {
      if (!row.deptList || row.deptList.length === 0) {
        return 'row-expand-cover'
      }
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
      this.filters.start1 = val[0]
      this.filters.start2 = val[1]
    },
    dateChange2(val) { // 结束日期 change事件
      this.filters.end1 = val[0]
      this.filters.end2 = val[1]
    },
    toback() { // 返回
      this.$router.back(-1)
    },
    apply() { // 申请
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: 'add' }}) // 跳转到集群战役申请页
    },
    downSend() { // 下发
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: 'xf' }}) // 跳转到集群战役下发页
    },
    budownSend() { // 部下发
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: 'bxf' }}) // 跳转到集群战役部下发页
    },
    handleEdit(index, row) { // 修改
      var type = ''
      if (row.category === 1) { //  1部下发
        type = 'editbxf'
      } else if (row.category === 2) { //  2下发
        type = 'editxf'
      } else { //    3申请
        type = 'edit'
      }
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: type, id: row.clusterId }}) // 跳转到集群战役申请页
    },
    handleClueList(row, type, param) { // 线索列表
      if (param) { // 外层列表
        var cityCode = ''
        if (row.deptList.length > 1) {
          cityCode = '610000'
        } else {
          cityCode = row.cityCode
        }
        this.$router.push({ path: '/jqcampaign/clueList', query: { id: row.clusterId, type: type, deptCode: row.applyDeptCode, cityCode: cityCode, curDeptCode: row.applyDeptCode, deptType: row.deptType, source: 'mainw' }}) // 跳转到线索列表页
      } else { // 展开行列表
        this.$router.push({ path: '/jqcampaign/clueList', query: { id: row.clusterId, type: type, deptCode: row.applyDeptCode, cityCode: row.cityCode, curDeptCode: row.deptCode, deptType: row.deptType, source: 'mainn' }}) // 跳转到线索列表页
      }
    },
    exportList() { // 导出
      this.isShowdcdialog = true
    },
    canceldc() { // 取消导出
      this.isShowdcdialog = false
    },
    exporttableList() { // 导出列表
      var checkAll = []
      if (this.dcForm.type === 1) { // 导出全部
        this.listData.forEach((item, index) => {
          checkAll.push(item.clusterId)
        })
        this.listData.forEach((item, index) => {
          if (checkAll.indexOf(item.clusterId) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      } else if (this.dcForm.type === 2) { // 导出选中的
        checkAll = this.checkId
        this.listData.forEach((item, index) => {
          if (this.checkId.indexOf(item.clusterId) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      }
      if (this.dcForm.type === 1) { // 全部
        var parms = this.curparam
        parms.category = 1
        parms.curDeptName = this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName // 派出所取他的上级部门名称，非派出所取当前部门
        parms.realName = this.curUser.realName
        parms.curUserPhone = this.curUser.phone ? this.curUser.phone : ''
        parms.fileName = '涉案线索协查参与地战果反馈表'
        this.$download('cluster/export', parms)
      } else { // 导出选中的
        var para = {
          category: 2,
          clusterIds: checkAll.join(','), // 选中的列表集群战役Id集合，
          curDeptName: this.curDept.depType === '4' ? this.pcsParentDept.departName : this.curDept.depName, // 派出所取他的上级部门名称，非派出所取当前部门
          realName: this.curUser.realName,
          curUserPhone: this.curUser.phone ? this.curUser.phone : '',
          fileName: '涉案线索协查参与地战果反馈表'
        }
        this.$download('cluster/export', para)
      }
      setTimeout(() => {
        this.isShowdcdialog = false // 关闭弹框
        this.checkId = [] // 清空选中数组
        this.$refs.multipleTable.clearSelection() // 清空列表选中项
      }, 3000)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 330
    if (this.$route.query.noCheck) { // 有参数，说明是从首页--个人待办--审查待办--集群战役待审核
      this.noCheck = this.$route.query.noCheck
    }
    if (this.$route.query.status) { // 有参数，说明是从集群战役统计列表
      this.filters.status = this.$route.query.status
    }
    if (sessionStorage.getItem(this.$route.path)) {
      this.carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (this.carryParam.status) { // 案件状态
        this.filters.status = this.carryParam.status
      }
      if (this.carryParam.start && this.carryParam.end) {
        this.dateRand1 = [this.carryParam.start, this.carryParam.end] // 发起日期
        // this.dateRand2 = [this.carryParam.start, this.carryParam.end] // 结束日期
      }
      if (this.carryParam.type !== undefined && String(this.carryParam.type) === '0') { // 要查申请的标识
        this.totalType = 'curCreate'
      }
      if (this.carryParam.type !== undefined && String(this.carryParam.type) === '1') { // 要查下发的标识
        this.totalType = 'feed'
      }
    }

    this.init()
  },
  activated() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.mainList {
  .el-dialog {
    width: 30%;
  }
  .querypsd {
    .el-form {
      width: 80%;
      margin: 30px auto;
    }
  }
  .dcForm {
    .el-dialog {
      width: 25%;
    }
    .dcTitle {
      margin-bottom: 20px;
      padding-left: 15px;
    }
    .martop {
      margin-top: 20px;
    }
  }
  .input_w {
    width: 300px;
  }
  .input_w1 {
    width: 300px;
  }
  .input_w2 {
    width: 300px;
  }
  .input_ws1 {
    width: 350px;
  }
  // .el-table__expanded-cell {
  //   padding: 0;
  // }
  .iconStyle {
    color: #e6a23c;
    font-size: 16px;
  }
  .dctitle {
    padding-left: 15px;
    margin-bottom: 15px;
  }
  .checkArea {
    text-align: center;
  }
  .tableBox {
    width: 100%;
    overflow: auto;
  }
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.el-cascader-menu__item.is-disabled {
  background-color: transparent;
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.row-expand-cover .el-table__expand-icon {
  visibility: hidden;
}
@media only screen and (max-width: 1367px) {
  .mainList .input_w {
    width: 198px;
  }
  .mainList .input_w1 {
    width: 500px;
  }
}
</style>
