<template>
  <div class="dblist">
    <el-row class="clearfix">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
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
          clearable placeholder="全部"
          :disabled="Number(deptInfo.depType)>2">
        </el-cascader>
      </el-form-item>
      <el-form-item label="创建单位" prop="examStatus">
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
      <el-form-item label="督办级别" prop="superviseLevel">
        <el-select v-model="filters.superviseLevel" placeholder="全部" >
          <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.designMode" placeholder="全部" >
          <el-option v-for="item in $getDicts('dbajpczt')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次名称" prop="title">
        <el-input v-model="filters.title" clearable placeholder="全部" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="文号" prop="referenceNumber">
        <el-input v-model="filters.referenceNumber" clearable placeholder="请输入文号" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="filters.startDate1"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="ksStartPickerOptions"
          placeholder="请选择开始时间"
          @change="ksStartDateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="filters.startDate2"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="ksEndPickerOptions"
          placeholder="请选择结束时间"
          @change="ksEndDateChange"
          :disabled="ksEndDateDisabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate1">
        <el-date-picker
          v-model="filters.endDate1"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="jsStartPickerOptions"
          placeholder="请选择开始时间"
          @change="jsStartDateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="endDate2">
        <el-date-picker
          v-model="filters.endDate2"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="jsEndPickerOptions"
          placeholder="请选择结束时间"
          @change="jsEndDateChange"
          :disabled="jsEndDateDisabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="queryDbBatch(true,true)">查询</el-button>
        <el-button type="primary" size="small"  v-on:click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item>
        <!-- v-if="$isViewBtn('100804')" -->
        <el-button type="primary" size="small"  v-on:click="handleBatchAdd('apply')">督办批次发布</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dbBatchData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column prop="title" label="批次名称" min-width="10%" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="案件编号" min-width="10%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="toAjDetail(scope.row.case_id)">{{scope.row.AJBH}}</a>
        </template>
      </el-table-column> -->
      <el-table-column prop="referenceNumber" label="文号" min-width="10%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="superviseLevel" label="督办级别" min-width="10%">
        <template slot-scope="scope">
          {{$getDictName(scope.row.superviseLevel+'','dbjb')}}
        </template>
      </el-table-column>
      <el-table-column prop="ajNumber" label="督办案件数量" min-width="10%"></el-table-column>
      <el-table-column prop="departName" label="发布单位" min-width="10%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="publishPersonName" label="发布人" min-width="10%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="publishDate" label="发布日期" width="140">
        <template slot-scope="scope">
          {{$handlerDateTime(scope.row.publishDate)}}
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.startDate">{{(scope.row.startDate).substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="截至日期" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.endDate">{{(scope.row.endDate).substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{$getDictName(scope.row.status+'','dbajpczt')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)" icon="el-icon-tickets" circle></el-button>
          <el-button title="修改" size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button title="删除" size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" circle></el-button>
          <!-- <el-button v-if="(scope.row.status === '0' || scope.row.status === '2')  && $isViewBtn('100806') && scope.row.apply_dept_id === String(currentDeptId)" title="修改" size="mini" type="primary"
                     @click="editDBInfo(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button v-if="(scope.row.status === '0' || scope.row.status === '2') && $isViewBtn('100807') && scope.row.apply_dept_id === String(currentDeptId)" title="删除" size="mini" type="danger"
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

    <el-dialog title="考核打分" :visible.sync="assessScoresVisible" width="1340px" @close="closeDialog">
      <AssessScores ref="assessScores" @setAssessScores="setAssessScores" @closeDialog="closeDialog"></AssessScores>
    </el-dialog>
  </div>
</template>

<script>
import { getTree } from '@/api/dept'
import {
  getDBLevelText, getAssistStatusText
} from '@/utils/codetotext'
import {
  parseTime
} from '@/utils/index'
import AssessScores from '@/views/caseAssist/components/assessScores'
export default {
  name: 'dblist',
  components: {
    AssessScores
  },
  data() {
    return {
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
      assessForm: {
        content: ''
      },
      assessScoresForm: {},
      assessScoresVisible: false,
      currentDeptId: '',
      filters: {
        caseName: '',
        createTime: '',
        deptName: ''
      },
      ajbh: '',
      toEdit: {},
      pageSize: 15,
      listTotal: 0,
      page: 1,
      listLoading: false,
      dbAddDiaVisible: false,
      dbAddDiaTitle: '',
      dbBatchData: [], // 列表数据
      deptTree: [],
      tableHeight: null,
      ksStartPickerOptions: {}, // 开始日期
      ksEndPickerOptions: {},
      jsStartPickerOptions: {}, // 结束日期
      jsEndPickerOptions: {},
      ksEndDateDisabled: true,
      jsEndDateDisabled: true
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
    handleDeptChange(val) { // 单位机构
      // console.log(val)
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
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1') { // 省 总队
            currentArea = [this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '2') { // 支队
            currentArea = ['610000', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '4') {
            if (this.deptInfo.areaCode === '610403') { // 杨凌例外
              currentArea = ['610000', '610403']
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
        }
        this.handleDeptChange(this.filters.department)
        this.queryDbBatch(true) // 查列表
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryDbBatch(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryDbBatch(false, true)
    },
    queryDbBatch(flag, hand) {
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const param = JSON.parse(JSON.stringify(this.filters))
      param.area = ''
      param.department = ''
      param.pageNum = this.page
      param.pageSize = this.pageSize
      param.deptId = this.currentDeptId
      if (this.filters.department && this.filters.department.length > 0) { // 如果选了 筛选条件的单位机构
        param.departCode = this.filters.department[this.filters.department.length - 1] // 部门code
        param.provinceCode = ''
        param.cityCode = ''
      } else if (this.filters.area && this.filters.area.length === 3) { // 区县 大队
        param.reginCode = this.filters.area[this.filters.area.length - 1] // 部门code
        param.departCode = ''
        param.provinceCode = ''
        param.cityCode = ''
      } else if (this.filters.area && this.filters.area.length === 2) { // 市 支队
        param.cityCode = this.filters.area[this.filters.area.length - 1]
      } else {
        param.provinceCode = '610000'
      }
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      this.$query('page/casesupervisebatch', param).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          this.dbBatchData = response.data.list
          this.listTotal = response.data.totalCount
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    ksStartDateChange(val) {
      if (val) {
        this.ksEndDateDisabled = false
        this.ksEndPickerOptions = Object.assign({}, 'ksEndPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime()
          }
        })
      } else {
        this.filters.startDate2 = '' // 结束时间清空
        this.ksEndDateDisabled = true
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    ksEndDateChange(val) { // 结束时间change事件
      if (val) {
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    jsStartDateChange(val) {
      if (val) {
        this.jsEndDateDisabled = false
        this.jsEndPickerOptions = Object.assign({}, 'jsEndPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime()
          }
        })
      } else {
        this.filters.endDate2 = '' // 结束时间清空
        this.jsEndDateDisabled = true
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    jsEndDateChange(val) { // 结束时间change事件
      if (val) {
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
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
    handleDetail(index, row) {
      // 判断是否有查阅密码
      // this.$prompt('请输入查阅密码', '查阅密码', {
      //   confirmButtonText: '验证',
      //   cancelButtonText: '取消',
      //   inputType: 'password',
      //   customClass: 'myPropt',
      //   inputPattern: /^[a-zA-Z0-9]{6,8}$/,
      //   inputErrorMessage: '密码格式不正确（6-8位的字母或者数字）'
      // }).then(({ value }) => {
      //   // this.$message({
      //   //   type: 'success',
      //   //   message: '你的邮箱是: ' + value
      //   // })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '取消输入'
      //   })
      // })
      this.$router.push({ path: '/caseManage/db/batchDetail', query: { dbBatchId: row.id }})
    },
    handleEdit(index, row) { // 编辑 督办批次
      this.$router.push({ path: '/caseManage/db/batchRelease', query: { dbBatchId: row.id }})
    },
    handleBatchAdd() { // 督办批次发布
      this.$router.push({ path: '/caseManage/db/batchRelease' })
    },
    handleDelete(index, row) { // 删除督办批次
      this.$confirm('确认删除该督办批次吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const param = {
          enable: '1' // 删除
        }
        this.$update('casesupervisebatchdel/' + row.id, param).then((response) => {
          this.listLoading = false
          if (response.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.queryDbBatch(true) // 刷新列表
          }
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    saveDBInfo(type) {
      this.$router.push({
        path: '/caseManage/dbedit/' + type
      })
    },
    editDBInfo(index, row) {
      if (row.category === 'apply') {
        this.$router.push({
          path: '/caseManage/dbedit/apply/' + row.id
        })
      } else if (row.category === 'demand') {
        this.$router.push({
          path: '/caseManage/dbedit/demand/' + row.id
        })
      }
    },
    resetForm() {
      this.filters = {
        caseName: '',
        createTime: '',
        deptName: ''
      }
      this.ajbh = ''
      this.queryDbBatch(true, true)
    },
    toAjDetail(id) {
      // this.$router.push({ path: '/caseManage/detailSyh/' + id })
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
    // const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    // if (this.$route.query.ajbh) {
    //   this.ajbh = this.$route.query.ajbh
    // }
    // if (depToken) {
    //   this.currentDeptId = depToken['id']
    this.initData()
    // }
    // this.dbData = [{ ajmc: '测试' }]
  },
  activated: function() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // if (sessionStorage.getItem(this.$route.path)) {
    //   this.ajbh = JSON.parse(sessionStorage.getItem(this.$route.path)).ajbh
    // }
    // if (this.$route.query.ajbh) {
    //   this.ajbh = this.$route.query.ajbh
    // }
    // if (depToken) {
    //   this.currentDeptId = depToken['id']
    //   this.queryDbBatch(true)
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dblist .breakWord span {
  word-wrap: break-word;
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
</style>
