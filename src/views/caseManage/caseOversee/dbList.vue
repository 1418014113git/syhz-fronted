<template>
  <div class="dblist">
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback" v-if="hasBackBtn">   <!--返回-->
    </el-row>
    <el-form ref="dbqueryForm" :inline="true" :model="filters" label-width="78px">
      <el-form-item label="行政区划" prop="examStatus">
        <el-cascader
          :options="xzqhOptions"
          v-model="filters.area"
          :props="props"
          change-on-select
          @change="handleAreaChange"
          :show-all-levels="false"
          placeholder="全部"
          :clearable="Number(deptInfo.depType)<2"
          :disabled="Number(deptInfo.depType)>2">
        </el-cascader>
      </el-form-item>
      <!-- 督办单位 指的是 督办记录的申请单位和审核单位  -->
      <el-form-item label="督办单位" prop="examStatus">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="filters.department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            clearable placeholder="全部"
            :disabled="Number(deptInfo.depType)>2">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="filters.applyPersonName" clearable placeholder="请输入申请人姓名" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="全部" clearable>
          <el-option v-for="item in $getDicts('dbajzt')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="督办级别">
        <el-select v-model="filters.superviseLevel" placeholder="请选择" clearable>
          <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期">
        <el-date-picker
          v-model="filters.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions"
          placeholder="请选择开始时间"
          @change="startDateChange"
          clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="filters.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="endPickerOptions"
          placeholder="请选择结束时间"
          @change="endDateChange"
          :disabled="endDateDisabled"
          clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="filters.keyword" clearable placeholder="请输入关键词" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="queryBtn && $isViewBtn('100801')"  v-on:click="queryDb(true,true)">查询</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100801')" v-on:click="resetFormFilter">重置</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('100802')" v-on:click="handleDbApply('apply')">申请</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100808')" v-on:click="handleDbBatchList('apply')">督办批次列表</el-button>
        <!-- <el-button type="primary" size="small" v-if="$isViewBtn('100803')"  v-on:click="saveDBInfo('demand')">发起督办</el-button> -->
      </el-form-item>
    </el-form>
    <el-row style="margin:0px 0 16px;">
      <el-button class="right" type="primary" size="small" v-if="$isViewBtn('100809') && (deptInfo.depType==='-1'||deptInfo.depType==='1'||deptInfo.depType==='2')" v-on:click="handleDbBatchRelease('apply')">督办批次发布</el-button>
      <!-- 下载 -->
      <a :href="downLoadUrl+gpdbFileName" :download="gpdbFileName" target="_blank" class="right" style="margin-right:10px;color: #00a0e9;cursor: pointer;text-decoration:underline;">
        <i class="el-icon-download"></i>
      </a>
      <!-- 预览 -->
      <a :href="downLoadUrl+gpdbFileName" target="_blank" class="right" style="margin-right:6px;color: #00a0e9;cursor: pointer;text-decoration:underline;">挂牌督办办法</a>
    </el-row>
    <el-table :data="dbData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center" :span-method="objectSpanMethod">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="案件名称" min-width="15%" prop="caseName" show-overflow-tooltip></el-table-column>
      <el-table-column label="案件编号" min-width="15%" show-overflow-tooltip>
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.caseId)">{{scope.row.caseNumber}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="督办批次" min-width="10%" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyDeptName" label="申请单位" min-width="15%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyPersonName" label="申请人" min-width="10%" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyDate" label="申请日期" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.status!==0">{{scope.row.applyDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="superviseLevel" label="督办级别" width="100" align="center">
        <template slot-scope="scope">
          {{$getDictName(scope.row.superviseLevel+'','dbjb')}}
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="截止日期" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          {{$getDictName(scope.row.status+'','dbajzt')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button  v-if="$isViewBtn('100805')" title="详情" size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)" icon="el-icon-tickets" circle>
          </el-button>
          <!-- 草稿状态 或者 审核不通过 有 编辑按钮 -->
          <el-button v-if="(scope.row.status === 0 && userInfo.id === scope.row.creationId) ||
                   ($isViewBtn('100806') && (scope.row.status === 0||scope.row.status === 4) && ((deptInfo.depType!=='4'&&scope.row.applyDeptCode === deptInfo.depCode)||(deptInfo.depType==='4'&&scope.row.applyDeptCode === deptInfo.parentDepCode)))"
                    title="编辑" size="mini" type="primary" @click="editDBInfo(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button v-if="$isViewBtn('100807') && scope.row.status!==0 && (scope.row.superviseDeptCode === deptInfo.depCode) && scope.row.superviseLevel>1 && (scope.row.wdStatus===0||scope.row.wdStatus===4)"
                      title="向上申请" size="mini" type="primary" @click="handleUpToApply(scope.$index, scope.row)" icon="el-icon-arrow-up" circle></el-button>
          <!-- <el-button v-if="$isViewBtn('100813') && deptInfo.depCode===scope.row.superviseDeptCode && scope.row.status===1"
                      title="审核" type="primary" size="small" @click="handleAudit"></el-button> -->
          <!-- <el-button v-if="(scope.row.status === '0' || scope.row.status === '2') && $isViewBtn('100807') && scope.row.apply_dept_id === String(currentDeptId)" title="删除" size="mini" type="danger"
                     @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete" circle></el-button>
          <el-button v-if="(scope.row.status === '7' || scope.row.status === '8') && $isViewBtn('100806') && scope.row.apply_dept_id === String(currentDeptId)" title="考核打分" size="mini" type="danger"
                     @click="handleDialog(scope.$index, scope.row)" icon="el-icon-star-off" circle></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="listTotal > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;"></el-pagination>
    </el-col>
    <!-- 查阅密码 -->
    <el-dialog title="查阅密码" :visible.sync="checkPasswordVisible" width="30%" @close="passwordCancel">
      <el-form ref="checkForm" :inline="true" :model="checkForm" :rules="rules" label-width="100px" v-loading="formLoading" class="passwordForm">
        <el-form-item label="查阅密码" prop="secretCode">
          <el-input v-model.trim="checkForm.secretCode" clearable type="password" placeholder="请输入查阅密码" size="small" maxlength="8" style="width:100%;"></el-input>
        </el-form-item>
        <el-row class="tabC martop btnUpLine">
          <!-- <el-col :span="24" align="center"> -->
            <el-button size="mini" @click="passwordCancel" class="cancelBtn" :loading="formLoading">取消</el-button>
            <el-button size="mini" @click="passwordCheck" class="saveBtn" :loading="formLoading">验证</el-button>
          <!-- </el-col> -->
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 审核弹框-->
    <!-- <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" @close="closeshDialog" :close-on-click-modal="false">
      <audit-com :isShowDialog="isShowshDialog" :dbId="currentDb.recordId" :dsh="dsh_Info" @closeDialog="closeshDialog"></audit-com>
    </el-dialog> -->
    <!-- 考核打分 -->
    <!-- <el-dialog title="考核打分" :visible.sync="assessScoresVisible" width="1340px" @close="closeDialog">
      <AssessScores ref="assessScores" @setAssessScores="setAssessScores" @closeDialog="closeDialog"></AssessScores>
    </el-dialog> -->
  </div>
</template>

<script>
import { getTree } from '@/api/dept'
import { deleteSupervise } from '@/api/supervise'
import {
  getDBLevelText, getAssistStatusText
} from '@/utils/codetotext'
import {
  parseTime
} from '@/utils/index'
import AssessScores from '@/views/caseAssist/components/assessScores'
import importexport from '@/api/importexport'
export default {
  name: 'dblist',
  components: {
    AssessScores
  },
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      gpdbFileName: '全省公安机关环境食品药品犯罪案件挂牌督办办法.pdf', // 挂牌督办办法 文件名字
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
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
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      pcsParentDept: {},
      assessForm: {
        content: ''
      },
      assessScoresForm: {},
      assessScoresVisible: false,
      currentDeptId: '',
      filters: {
        status: '',
        superviseLevel: '', // 督办级别
        startDate: '', // 截止日期 开始
        endDate: '' // 截止日期 结束
      },
      ajbh: '',
      toEdit: {},
      pageSize: 15,
      listTotal: 0,
      page: 1,
      listLoading: false,
      dbAddDiaVisible: false,
      dbAddDiaTitle: '',
      dbData: [],
      deptTree: [],
      tableHeight: null,
      startPickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // }
      },
      endPickerOptions: {},
      checkForm: {},
      formLoading: false, // 验证密码弹框的loading
      currentDb: {}, // 当前点击的督办
      endDateDisabled: true,
      checkPasswordVisible: false, // 验证密码的弹框
      spanArr: [], // 合并行
      position: 0,
      queryBtn: false, // 查询按钮是否可点击
      carryParam: {}, // 页面传递的参数
      hasBackBtn: false, // 是否有返回按钮
      isShowshDialog: false, // 是否显示审核弹框
      rules: {
        secretCode: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^[a-zA-Z0-9]{6,8}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入查阅密码！'))
            } else if (reg.test(value)) {
              this.$query('casesupervisecode', { id: this.currentDb.recordId, secretCode: value }).then((response) => {
                if (response.code === '000000') {
                  this.listLoading = false
                  if (response.data.length > 0) {
                    callback()
                  } else {
                    callback(new Error('查阅密码不正确，请重新输入。'))
                  }
                } else {
                  callback(new Error('查阅密码不正确，请重新输入。'))
                }
              }).catch(() => {
                this.listLoading = false
              })
            } else {
              callback(new Error('密码格式不正确（6-8位的字母或者数字）！'))
            }
          }
        }]
      }
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(new Date(time), '{y}-{m}-{d} {h}:{i}')
    }
  },
  methods: {
    handleAreaChange(val) { // 行政区划
      if (val.length === 1 && this.deptInfo.depType === '2') {
        this.queryBtn = false
        this.$message({
          message: '请至少选择到市',
          type: 'error'
        })
        return false
      } else {
        this.queryBtn = true
      }
      this.filters.department = []
      if (val.length > 0) {
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
        this.selectCurDep = { name: '' }
      }
    },
    initData() { // 初始化筛选条件
      // 行政区划
      this.listLoading = true
      var _this = this
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1') { // 省 总队
            currentArea = [this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '2') { // 支队
            currentArea = ['610000', this.deptInfo.areaCode]
            _this.xzqhOptions[0].disabled = true
            for (let index = 0; index < this.xzqhOptions[0].children.length; index++) {
              const element = this.xzqhOptions[0].children[index]
              if (element.cityCode === this.deptInfo.areaCode) {
                _this.xzqhOptions[0].children[index].disabled = false
              } else {
                _this.xzqhOptions[0].children[index].disabled = true
              }
            }
          } else if (this.deptInfo.depType === '3') { // 大队
            currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '4') { // 派出所
            if (this.deptInfo.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
            }
          }
          this.filters.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          if (this.deptInfo.depType === '-1') { // 省
            this.filters.department = [this.deptInfo.depCode]
          } else if (this.deptInfo.depType === '1') { // 总队
            this.filters.department = [this.deptInfo.parentDepCode, this.deptInfo.depCode]
          } else if (this.deptInfo.depType === '2') { // 支队
            this.filters.department = [this.deptInfo.depCode]
          } else if (this.deptInfo.depType === '3') { // 大队
            this.filters.department = [this.deptInfo.depCode]
          } else if (this.deptInfo.depType === '4') { // 派出所
            this.filters.department = [this.deptInfo.parentDepCode] // 派出所当作上级处理
            // 调接口查 派出所的上级
            this.$query('hsyzparentdepart/' + this.deptInfo.depCode, {}, 'upms').then((response) => {
              if (response.code === '000000') {
                this.pcsParentDept = response.data
              }
            }).catch(() => {
              this.caseLoading = false
            })
          }
          this.handleDeptChange(this.filters.department)
          this.queryDb(true) // 查列表
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    initDataJump() { // 统计跳转来的 初始化行政区机构
      // 行政区划
      this.listLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          if (this.carryParam.clickLevel === 'city') { // 点击的是统计中 第一级的
            this.filters.area = ['610000', this.carryParam.cityCode]
            this.handleAreaChange(this.filters.area) // 查单位机构
            this.filters.department = []
          } else { // 点击的是统计中 第二级的，需要分别处理支队和大队
            if (this.carryParam.clickLevel === '2') {
              this.filters.area = ['610000', this.carryParam.deptCode.substring(0, 4) + '00']
            } else if (this.carryParam.clickLevel === '3') {
              this.filters.area = ['610000', this.carryParam.deptCode.substring(0, 4) + '00', this.carryParam.deptCode.substring(0, 6)]
            }
            this.handleAreaChange(this.filters.area) // 查单位机构
            this.filters.department = [this.carryParam.deptCode]
          }
          this.handleDeptChange(this.filters.department)
          this.queryDb(true) // 查列表
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryDb(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryDb(false, true)
    },
    queryDb(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = JSON.parse(JSON.stringify(this.filters))
      para.area = ''
      para.department = ''
      // para.ajbh = this.ajbh || '' // 案件编号
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (this.filters.area && this.filters.area.length > 0) { // 行政区划
        para.provinceCode = this.filters.area[0] || '' // 省code
        para.cityCode = this.filters.area[1] || '' // 市code
        para.reginCode = this.filters.area[2] || '' // 区code
      } else {
        para.provinceCode = '' // 省code
        para.cityCode = '' // 市code
        para.reginCode = '' // 区code
      }
      if (this.filters.department) { // 单位机构
        para.departCode = this.filters.department[this.filters.department.length - 1] // 部门code
        para.departType = this.selectCurDep.depType // 部门类型
      } else {
        para.departCode = this.deptInfo.depCode // 所属部门code
        para.departType = this.deptInfo.depType // 部门类型
      }
      para.supType = this.deptInfo.depType === '4' ? this.pcsParentDept.depType : this.deptInfo.depType // 当前部门类型

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/casesupervise', para).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          this.dbData = response.data.list
          this.listTotal = response.data.totalCount
          this.pageSize = response.data.pageSize
          this.spanArr = [] // 置空
          this.rowspan(this.dbData)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    rowspan(tableData) {
      tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (tableData[index].caseId === tableData[index - 1].caseId) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 合并行
      if (columnIndex === 1) { // 合并案件名称
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 2) { // 合并案件编号
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    startDateChange(val) {
      if (val) {
        this.endDateDisabled = false
        // 限制 截止时间 必须是开始时间之后
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filters.endDate = '' // 结束时间清空
        this.endDateDisabled = true
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    handleDialog(index, row) {
      this.assessScoresVisible = true
      if (this.$refs.assessScores) {
        if (row.rate) {
          this.$refs.assessScores.init(row.rate)
        }
      }
      this.assessForm.index = index
    },
    closeDialog() {
      this.assessScoresVisible = false
    },
    setAssessScores(rate) {
      this.dbData[this.assessForm.index].rate = rate
      this.closeDialog()
    },
    formatterLevel(row) {
      return getDBLevelText(row.supervise_level)
    },
    filterStateText(state) {
      return getAssistStatusText(state)
    },
    handleUpToApply(index, row) { // 向上申请
      this.$router.push({ path: '/caseManage/toup/dbApply', query: { dbId: row.recordId, type: 'up' }})
    },
    judgePassword(recordId, value) {
      if (recordId && value) {
        var status = false
        const para = {
          id: recordId,
          secretCode: value
        }
        this.$query('casesupervisecode', para).then((response) => {
          if (response.code === '000000') {
            this.listLoading = false
            if (response.data.length > 0) {
              status = true
            } else {
              status = false
            }
            return status
          }
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    handleDetail(index, row) {
      // 判断是否有查阅密码
      if (row.secretCode) {
        this.currentDb = row
        this.checkPasswordVisible = true
      } else { // 无查阅密码
        this.$router.push({ path: '/caseManage/dbDetail', query: { dbId: row.recordId }})
      }
    },
    passwordCancel() { // 取消验证密码
      this.currentDb = {}
      this.resetForm('checkForm')
      this.checkPasswordVisible = false
    },
    passwordCheck() { // 验证查阅密码
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.checkPasswordVisible = false
          this.$router.push({ path: '/caseManage/dbDetail', query: { dbId: this.currentDb.recordId }})
        }
      })
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    handleDbApply() { // 申请案件督办
      this.$router.push({ path: '/caseManage/dbApply' })
    },
    handleDbBatchList() { // 督办批次列表
      this.$router.push({ path: '/caseManage/db/batchList' })
    },
    handleDbBatchRelease() { // 督办批次发布
      this.$router.push({ path: '/caseManage/db/batchRelease' })
    },
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const para = {
          id: row.id,
          logFlag: 1
        }
        deleteSupervise(para).then((res) => {
          this.listLoading = false
          if (res.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.query(true)
        })
      }).catch(() => {
        this.listLoading = false
      })
    },
    saveDBInfo(type) {
      this.$router.push({
        path: '/caseManage/dbedit/' + type
      })
    },
    editDBInfo(index, row) {
      this.currentDb = row
      this.$router.push({ path: '/caseManage/dbApply', query: { dbId: this.currentDb.recordId }})
      // if (row.category === 'apply') {
      //   this.$router.push({
      //     path: '/caseManage/dbedit/apply/' + row.id
      //   })
      // } else if (row.category === 'demand') {
      //   this.$router.push({
      //     path: '/caseManage/dbedit/demand/' + row.id
      //   })
      // }
    },
    handleAudit(index, row) { // 审核
      this.currentDb = row
      this.isShowshDialog = true
    },
    closeshDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      if (this.$refs.auditForm) {
        this.$refs.auditForm.resetForm('auditForm')
      }
      this.isShowshDialog = false // 下发催办弹框隐藏
    },
    resetFormFilter() {
      this.filters = {
        status: ''
      }
      this.ajbh = ''
      this.initData()
    },
    toAjDetail(id) {
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    toback() {
      // this.$router.back(-1)
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/dblist')
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    if (this.$route.query.origin) {
      this.hasBackBtn = true // 是否显示返回按钮
      this.carryParam = this.$route.query
      if (this.carryParam.origin === 'portal') { // 首页 跳转来的
        if (this.$route.query.status) {
          this.filters.status = this.$route.query.status // 首页-审核待办-督办审核
        }
        if (this.$route.query.jabgStatus) {
          this.filters.jabgStatus = this.$route.query.jabgStatus // 首页-审核待办-结案报告审核
        }
        if (this.$route.query.qsStatus) {
          this.filters.qsStatus = this.$route.query.qsStatus // 首页-催办待办-1是案件催办签收待办  2案件催办反馈待办
        }
        if (this.$route.query.businessType) {
          this.filters.businessType = this.$route.query.businessType // 首页-签收待办 4是案件督办签收
        }
        this.initData()
      }
      if (this.carryParam.origin === 'caseFile') { // 案件档案 跳转来的
        this.filters.keyword = this.carryParam.abjh // 将案件编号赋值给查询条件 关键词
        this.initData()
      }
      if (this.carryParam.origin === 'dbStatistical') { // 督办统计 跳转来的
        this.filters.startDate1 = this.carryParam.startDate1 || ''// 开始时间
        this.filters.startDate2 = this.carryParam.startDate2 || ''
        this.filters.startDate = this.carryParam.endDate1 || '' // 结束时间
        this.filters.endDate = this.carryParam.endDate2 || ''
        this.filters.type = this.carryParam.type || '' // 案件类型
        this.filters.timeType = this.carryParam.timeType || '' // 时间筛选条件
        this.filters.superviseLevel = this.carryParam.dbLevel || '' // 督办级别
        this.filters.phStatus = this.carryParam.phStatus || '' // 督办级别
        this.initDataJump()
      }
    } else {
      this.hasBackBtn = false
      this.initData()
    }
  },
  activated() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    // if (this.$route.query.ajbh) {
    //   this.ajbh = this.$route.query.ajbh
    // }
    // this.initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dblist .breakWord span {
  word-wrap: break-word;
}
.dblist .el-form .el-cascader.el-cascader--small,
.dblist .el-form .el-input.el-input--small,
.dblist .el-form .el-select.el-select--small {
  // width: 222px;
}
.myPropt {
  .el-message-box__content:after {
    clear: both;
    display: block;
    content: "";
  }
  .el-message-box__content {
    padding: 20px 15px 5px;
    .el-message-box__message {
      float: left;
    }
    .el-message-box__input {
      float: left;
      width: 65%;
      margin: 0 0 0 20px;
      padding-top: 0;
    }
    .el-message-box__message p:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
}
// 查阅密码的弹框
.passwordForm {
  width: 94%;
  margin: 20px auto 0;
  .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: 60%;
  }
}
</style>
