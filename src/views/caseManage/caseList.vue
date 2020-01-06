<template>
  <section class="caseList">
    <el-form :inline="true" :model="filters" ref="filters" label-width="106px" class="form" v-loading="filterLoading">
      <el-form-item label="行政区划">
        <el-cascader :options="areaOptions" :disabled="areaDisabled" :clearable="!areaDisabled && String(curDept.depType) !== '2'" v-model="filters.area" :props="areaProps" change-on-select @change="handleAreaChange" :show-all-levels="false" placeholder="全部" popper-class="caseList_cascader"></el-cascader>
      </el-form-item>
      <el-form-item label="认领单位">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name && selectCurDep.name.length > 9) === true ? 'tooltipShow' : 'tooltipHide'">
          <el-cascader :options="deptOptions" :disabled="deptDisabled" :clearable="!deptDisabled" v-model="filters.department" :props="deptProps" change-on-select :show-all-levels="false" @change="handleDeptChange" placeholder="全部"></el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-tooltip v-for="item in filterData" :key="item.index"  effect="dark" :content="item.columnDescribe" placement="top-start" :popper-class="(item.columnDescribe.length > 5) === true ? 'tooltipShow_case' : 'tooltipHide_case'">
        <el-form-item :label="item.columnDescribe" :prop="item.filterName" class="autoItem">
          <el-input v-if="item.columnType === 1" v-model="filters[item.filterName]" size="small" clearable maxlength="50" :placeholder="'请输入' + item.columnDescribe"></el-input>
          <el-cascader v-if="item.columnType === 3 && item.columnName === 'SYH_FLLB'" v-model="filters[item.filterName]" change-on-select filterable :options="fllbList" clearable @change="AJLXHandler"></el-cascader>
          <el-select v-if="item.columnType === 3 && item.columnName !== 'SYH_FLLB'" v-model="filters[item.filterName]" placeholder="请选择" clearable>
            <el-option v-if="item.columnName === 'AJZT'" v-for="option in ajztData" :key="option.code" :label="option.codeName" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'AJLB'" v-for="option in ajlbData" :key="option.code" :label="option.name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'SYH_AJLB'" v-for="option in ajzmData" :key="option.code" :label="option.name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'CONFIRM_STATUS'" v-for="option in dqztData" :key="option.value" :label="option.label" :value="option.value"></el-option>
            <el-option v-if="item.columnName === 'AJXZ'" v-for="option in AJXZList" :key="option.code" :label="option.code_name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'AJSX'" v-for="option in AJSXList" :key="option.value" :label="option.label" :value="option.value"></el-option>
            <el-option v-if="item.columnName === 'BARXB'" v-for="option in XBList" :key="option.value" :label="option.label" :value="option.value"></el-option>
            <el-option v-if="item.columnName === 'AJLY'" v-for="option in ajlyData" :key="option.code" :label="option.codeName" :value="option.code"></el-option>
          </el-select>
          <span v-if="item.columnType === 2">
            <el-date-picker v-model="filters[item.filterName + 'Start']" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" @change="startDateChange($event, item.filterName, item.columnDescribe)"></el-date-picker>
            <el-form-item label="至" class="time_left">
              <el-date-picker :disabled="filters[item.filterName + 'Start'] === undefined || filters[item.filterName + 'Start'] === null || filters[item.filterName + 'Start'] === ''" v-model="filters[item.filterName + 'End']" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束日期" @change="endDateChange($event, item.filterName, item.columnDescribe)"></el-date-picker>
            </el-form-item>
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item label="关键词" style="margin-left: -4px;">
        <el-input v-model="filters.words" size="small" placeholder="请输入关键词" clearable maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="列表模板">
        <el-select v-model="filters.templateId" placeholder="请选择" @change="handleTemplate">
          <el-option v-for="item in templateData" :key="item.code" :label="item.templateName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查询方式">
        <el-select v-model="filters.queryType" placeholder="请选择">
          <el-option label="模糊查询" value="1"></el-option>
          <el-option label="精确查询" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" size="small" v-on:click="query(true)">查询</el-button>
        <el-button type="primary" size="small" v-on:click="restForm()">重置</el-button>
        <el-button type="primary" size="small" v-on:click="clearTable()">清除过滤条件</el-button>
        <el-button v-if="$isViewBtn('182003') || $isViewBtn('182004') || $isViewBtn('182005')" type="primary" size="small" v-on:click="toTemplate()">维护模板</el-button>
        <el-button type="primary" size="small" v-if="$isViewBtn('103001')" v-on:click="gotoMergeList()">重复合并列表</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="caseData" ref="caseTable" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="简要案情">
              <span v-html="getReplace(props.row.jyaq)"></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="52"></el-table-column>
      <el-table-column label="地区" type="index" width="100">
        <template slot-scope="scope">
          <span class="area bg0">{{getArea(scope.row, scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="item in titleData" :key="item.index" :label="item.columnDescribe" :prop="item.titleName" :sortable="sortable"
                       :width="setWidth(item)"
                       :min-width="item.columnName === 'AJMC' ? '200px' : '130px'"
                       :class-name="className(item)"
                       :column-key="item.titleName"
                       :filters="(item.columnName === 'AJZT' ? ajztFilter : (item.columnName === 'SYH_AJLB' ? ajlbFilter : (item.columnName === 'CONFIRM_STATUS' ? confirmStatusFilter : [])))"
                       :filter-method="filterHandler"
                       :show-overflow-tooltip="(item.columnName === 'AJBH' || item.columnName === 'AJLY' ? false : true)">
        <template slot-scope="scope">
          <el-tooltip v-if="item.columnName === 'AJBH'" class="item" effect="dark" :content="scope.row[item.titleName]" placement="top">
            <a class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">
              {{ scope.row[item.titleName].substring(0, 7) + '...' }}
            </a>
          </el-tooltip>
          <a v-else-if="item.columnName === 'AJMC'" class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">
            {{ scope.row[item.titleName] }}
          </a>
          <span v-else-if="item.columnName === 'CONFIRM_STATUS'">
            {{scope.row[item.titleName] === 2 ? ('上报已读') : (scope.row[item.titleName] === 1 || scope.row[item.titleName] === undefined || scope.row[item.titleName] === null ? '上报未读': '')}}
          </span>
          <span v-else-if="item.columnName === 'SYH_FLLB'" :class="'ajfl type' + (scope.row[item.titleName].indexOf(',') > -1 ? scope.row[item.titleName].split(',')[0] : scope.row[item.titleName])">{{getFllbName(scope.row[item.titleName])}}</span>
          <span v-else-if="item.columnName === 'AJZT'">{{getAjztName(scope.row[item.titleName])}}</span>
          <span v-else-if="item.columnName === 'SYH_AJLB'">{{getAjzmName(scope.row[item.titleName])}}</span>
          <el-tooltip v-else-if="item.columnName === 'AJLY'" class="item" effect="dark" :content="getAjlyName(scope.row[item.titleName])" placement="top">
            <span>{{(getAjlyName(scope.row[item.titleName])&&getAjlyName(scope.row[item.titleName]).length > 4) ? (getAjlyName(scope.row[item.titleName]).substring(0, 4) + '...') : getAjlyName(scope.row[item.titleName])}}</span>
          </el-tooltip>
          <span v-else-if="item.columnName === 'AJLB'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'AJXZ'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'AJSX'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'BARXB'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else>{{scope.row[item.titleName]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets" title="详情" circle @click="handleAjDetail(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="primary" icon="el-icon-rank" circle title="重复合并" @click="handleAjMerge(scope.$index, scope.row)" v-if="$isViewBtn('103002')"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { getTree } from '@/api/dept'
import { getSYHFLLBList, getAJSXList, getXBSelect } from '@/utils/codetotext'
export default {
  name: 'caseList',
  data() {
    return {
      filters: {
        area: [],
        department: [],
        templateId: '',
        words: '',
        queryType: '1',
        ajzt: '',
        larqStart: '', // 立案开始日期
        larqEnd: '', // 立案结束日期
        parqStart: '', // 破案开始日期
        parqEnd: '' // 破案结束日期
      },
      queryArea: [],
      queryDeptCode: '',
      lastTemplateId: '',
      selectCurDep: { name: '' },
      deptOptions: [],
      deptDisabled: false,
      areaOptions: [],
      areaDisabled: false,
      areaProps: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      sortable: false,
      filterLoading: false,
      listLoading: false,
      templateData: [],
      filterData: [],
      titleData: [],
      caseData: [],
      ajztData: [], // 案件状态
      ajlbData: [], // 案件类别
      ajzmData: [], // 案件罪名
      ajlyData: [], // 案件来源
      ajlyList: [],
      dqztData: [
        { label: '上报未读', value: 1 },
        { label: '上报已读', value: 2 }
      ],
      fllbList: getSYHFLLBList(), // 案件分类类别
      AJSXList: getAJSXList(), // 案件属性
      XBList: getXBSelect(), // 性别
      AJXZList: [], // 案件性质
      total: 0,
      page: 1,
      pageSize: 15,
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      ajlbFilter: [],
      ajztFilter: [],
      confirmStatusFilter: [
        { text: '上报未读', value: '1' },
        { text: '上报已读', value: '2' }
      ],
      ajlxFirst: '',
      areaList: {},
      areaColorList: {}
    }
  },
  methods: {
    getArea(row, index) {
      let areaCode = row.deptCode.substring(0, 6)
      if (this.areaList[areaCode] !== undefined) {
        return this.areaList[areaCode].substring(0, 2)
      }
      if (this.curDept.depType === '1' || this.curDept.depType === '-1') {
        const dept = this.findParentDept(row.deptCode)
        if (dept.depType === '3') {
          areaCode = dept.parentCode.substring(0, 6)
        }
        if (dept.depType === '4') {
          const dept = this.findParentDept(dept.parentCode)
          areaCode = dept.parentCode.substring(0, 6)
        }
      }
      const arr = []
      this.eachArea(this.areaOptions, areaCode, arr)
      this.areaList[row.deptCode.substring(0, 6)] = arr.join(',')
      return arr.join(',').substring(0, 2)
    },
    eachArea(child, value, arr) {
      for (let i = 0; i < child.length; i++) {
        const item = child[i]
        if (item.cityCode === value) {
          arr.push(item.cityName)
          break
        } else {
          if (item.children) {
            this.eachArea(item.children, value, arr)
          }
        }
      }
    },
    findParentDept(paramCode) {
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (item.depCode === paramCode) {
          return item
        }
      }
    },
    setWidth(item) {
      if (item.columnName === 'AJMC') {
        return ''
      }
      if (item.columnName === 'AJBH') {
        return '140px'
      }
      if (item.columnName === 'AJLY') {
        return '110px'
      }
      if (this.titleData.length < 8) {
        return '240px'
      }
      if (item.columnName === 'SYH_FLLB' || item.columnName === 'CONFIRM_STATUS' || item.columnName === 'AJZT' || item.columnName === 'AJSX' || item.columnName === 'LARQ' || item.columnName === 'PARQ') {
        return '130px'
      }
      if (item.columnName === 'BARHJSZDSSXQ_NAME' || item.columnName === 'BARSJJZDSSXQ_NAME') {
        return '240px'
      }
      return '210px'
    },
    className(item) {
      if (this.sortable) {
        if (item.columnName === 'AJZT' || item.columnName === 'SYH_AJLB' || item.columnName === 'CONFIRM_STATUS') {
          return 'show_filter'
        }
      }
      return ''
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return String(row[property]) === String(value)
    },
    handleAreaChange(val) { // 行政区划
      this.filters.department = []
      if (val.length > 0) {
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        const param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              const arr = []
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
      if (val.length > 0) {
        const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
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
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          const arr = response.data ? response.data : []
          if (String(this.curDept.depType) === '2') {
            arr[0].disabled = true
            for (let i = 0; i < arr[0].children.length; i++) {
              const item = arr[0].children[i]
              if (String(item.cityCode) !== String(this.curDept.areaCode)) {
                item.disabled = true
              }
            }
          }
          this.areaOptions = arr
          let currentArea = []
          if (this.queryArea.length > 0) { // 案件协查、集群战役 跳转进入
            currentArea = this.queryArea
          } else {
            if (this.curDept.depType === '-1' || this.curDept.depType === '1') { // 省 总队
              currentArea = [this.curDept.areaCode]
            } else if (this.curDept.depType === '2') { // 支队
              currentArea = ['610000', this.curDept.areaCode]
            } else if (this.curDept.depType === '3') { // 大队 派出所
              currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
              this.deptDisabled = true
              this.areaDisabled = true
            } else if (this.curDept.depType === '4') {
              this.areaDisabled = true
              if (this.curDept.areaCode === '611400') { // 杨凌例外
                currentArea = ['610000', '611400']
              } else { // 正常的派出所
                currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
              }
            }
          }
          if (this.$route.query.fadz) { // 案件档案 发案地址--点击列表数字跳转过来的
            if (this.$route.query.cityCode) {
              this.filters.area = ['610000', this.$route.query.cityCode]
            } else {
              this.filters.area = currentArea
            }
          } else {
            this.filters.area = currentArea
          }

          this.handleAreaChange(this.filters.area) // 查单位机构
          if (this.queryArea.length > 0) {
            let currentDepartment = []
            if (this.queryDeptCode !== '') {
              currentDepartment = [this.queryDeptCode]
            } else {
              currentDepartment = []
            }
            this.filters.department = currentDepartment
          } else {
            // 默认选择本单位
            if (this.curDept.depType === '-1') { // 省
              // this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '1') { // 总队
              // this.filters.department = [this.curDept.parentDepCode, this.curDept.depCode]
            } else if (this.curDept.depType === '2') { // 支队
              this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '3') { // 大队
              this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '4') { // 派出所
              this.filters.department = [this.curDept.parentDepCode, this.curDept.depCode]
            }
          }
          this.queryTemplate()
        }
      }).catch(() => {
      })
    },
    handleAjDetail(index, row) { // 厅级别用户查看详情时，有confirmId时 先改案件上报状态
      if (String(this.curDept.depType) === '1') { // 厅级别用户 初始化的三种部门
        if (row.confirmStatus && row.confirmStatus === 1 && row.confirmId) {
          const para = {
            signUserId: this.curUser.id,
            signUserName: this.curUser.realName,
            status: 2
          }
          this.listLoading = true
          this.$update('bisnotice/' + row.confirmId, para).then((response) => {
            if (response.code === '000000') {
              this.listLoading = false
              this.query(true)
              this.$router.push({ path: '/caseFile/index', query: { id: row.id, isRl: '1' }})
            }
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          this.$router.push({ path: '/caseFile/index', query: { id: row.id, isRl: '1' }})
        }
      } else {
        this.$router.push({ path: '/caseFile/index', query: { id: row.id, isRl: '1' }})
      }
    },
    queryTemplate() {
      this.filterLoading = true
      this.listLoading = true
      this.$query('caseManage/template', { deptCode: this.curDept.depCode }).then(response => {
        this.templateData = response.data
        // if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        //   const templateId = sessionStorage.getItem(this.$route.path)
        //   this.filters.templateId = parseInt(templateId)
        //   sessionStorage.setItem(this.$route.path, '')
        // } else {
        this.filters.templateId = this.templateData[0].id
        // }
        this.lastTemplateId = this.filters.templateId
        this.sortable = this.isDisabledSort()
        this.queryFilter()
        this.queryTableTitle()
        this.query()
      })
    },
    queryFilter() {
      this.filterLoading = true
      this.$query('caseManage/filter', { templateId: this.filters.templateId, deptCode: this.curDept.depCode }).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i]
          const columnArr = item.columnName.toLowerCase().split('_')
          let filterName = ''
          if (columnArr.length > 1) {
            for (let j = 0; j < columnArr.length; j++) {
              const column = columnArr[j]
              if (j === 0) {
                filterName += column
              } else {
                filterName += column.substring(0, 1).toUpperCase() + column.substring(1, column.length)
              }
            }
          } else {
            filterName = item.columnName.toLowerCase()
          }
          item.filterName = filterName
        }
        this.filterData = response.data
        this.filterLoading = false
      })
    },
    queryTableTitle() {
      this.listLoading = true
      this.titleData = []
      this.$query('caseManage/tableTitle', { templateId: this.filters.templateId, deptCode: this.curDept.depCode }).then(response => {
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i]
          const columnArr = item.columnName.toLowerCase().split('_')
          let titleName = ''
          if (columnArr.length > 1) {
            for (let j = 0; j < columnArr.length; j++) {
              const column = columnArr[j]
              if (j === 0) {
                titleName += column
              } else {
                titleName += column.substring(0, 1).toUpperCase() + column.substring(1, column.length)
              }
            }
          } else {
            titleName = item.columnName.toLowerCase()
          }
          item.titleName = titleName
        }
        this.titleData = response.data
        this.sortable = this.isDisabledSort()
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true)
    },
    toTemplate() {
      this.$gotoid('/reportTemplate')
    },
    restForm() {
      for (const key in this.filters) {
        if (key !== 'area' && key !== 'department' && key !== 'templateId') {
          if (typeof this.filters[key] === 'object') {
            this.filters[key] = []
          } else {
            this.filters[key] = ''
          }
        }
      }
    },
    clearTable() {
      this.$refs.caseTable.clearSort()
      this.filters.words = ''
      this.filters.queryType = '1'
      this.filters.ajzt = ''
      this.filters.larqStart = '' // 立案开始日期
      this.filters.larqEnd = '' // 立案结束日期
      this.filters.parqStart = '' // 破案开始日期
      this.filters.parqEnd = '' // 破案结束日期
    },
    query(flag) {
      this.listLoading = true
      const para = JSON.parse(JSON.stringify(this.filters))
      para.department = this.filters.department.join(',')
      para.area = this.filters.area.join(',')
      if (para.syhFllb) {
        para.syhFllb = this.filters.syhFllb.join(',')
      }
      para.depType = this.curDept.depType
      para.curDeptCode = this.curDept.depCode // 当前登录部门code，必传
      this.page = flag ? 1 : this.page
      para.pageNum = this.page
      para.pageSize = this.pageSize
      this.$query('caseManage/caseList', para).then(response => {
        this.caseData = response.data.list
        this.total = response.data.totalCount
        this.pageSize = response.data.pageSize
        this.listLoading = false
      })
    },
    initAjzt() { // 初始化案件状态数据源
      this.$query('tcpcode', { codeLx: 'ajzt' }).then((response) => {
        if (response.data && response.data.length > 0) {
          const temp = {}
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            temp[element.codeName] = element.code
          }
          const arr = []
          const arr1 = []
          for (const key in temp) {
            arr.push({ code: temp[key], codeName: key })
            arr1.push({ value: temp[key], text: key })
          }
          this.ajztData = arr
        }
      }).catch(() => {
      })
    },
    initAjlb(category) { // 初始化案件类别
      this.$query('ajlb', { category: category }).then((response) => {
        if (response.data && response.data.length > 0) {
          this.ajlbData = response.data
        }
      }).catch(() => {
      })
    },
    initAjzm(category) { // 案件罪名
      this.$query('ajzm', { category: category }).then(response => {
        if (response.data && response.data.length > 0) {
          this.ajzmData = response.data
          const arr = []
          for (let j = 0; j < this.ajzmData.length; j++) {
            const data = this.ajzmData[j]
            arr.push({ value: data.code, text: data.name })
          }
          this.ajlbFilter = arr
        }
      })
      // this.$query('ajzmcode', { codeLx: 'ajlb' }).then((response) => {
      //   this.$query('ajzmcode', {}).then((response) => {
      //     if (response.data && response.data.length > 0) {
      //       this.ajzmData = response.data
      //       const arr = []
      //       for (let j = 0; j < this.ajzmData.length; j++) {
      //         const data = this.ajzmData[j]
      //         arr.push({ value: data.SYH_AJLB, text: data.SYH_AJLB_NAME })
      //       }
      //       this.ajlbFilter = arr
      //     }
      //   })
      // }).catch(() => {
      // })
    },
    initAjly() { // 初始化案件来源 (去重)
      this.$query('tcpcode', { codeLx: 'ajly' }).then((response) => {
        this.ajlyList = response.data
        if (response.data && response.data.length > 0) {
          const arr = response.data
          const array = []
          const nameArr = []
          const codeArr = []
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (nameArr.indexOf(item.codeName) > -1) {
              const index = nameArr.indexOf(item.codeName)
              const oldCode = codeArr[index]
              if (parseInt(oldCode) < parseInt(item.code)) {
                codeArr[index] = item.code
                array[index] = item
              }
            } else {
              nameArr.push(item.codeName)
              codeArr.push(item.code)
              array.push(item)
            }
          }
          this.ajlyData = array
        }
      }).catch(() => {
      })
    },
    initAjxz() {
      const para = {
        codelx: 'ajxz'
      }
      this.$query('CODENAMEQUERY', para).then((response) => {
        this.AJXZList = response.data
      })
    },
    startDateChange(val, key, text) {
      if (val === undefined || val === null || val === '') {
        this.filters[key + 'End'] = ''
      }
      const endDate = this.filters[key + 'End']
      if (endDate !== undefined && endDate !== null && endDate !== '') {
        if (new Date(endDate) < new Date(val)) {
          this.$alert(text + '的开始时间不能大于结束时间', '提示', { type: 'warning' })
          this.filters[key + 'End'] = ''
        }
      }
    },
    endDateChange(val, key, text) {
      const startDate = this.filters[key + 'Start']
      if (val) {
        if (new Date(startDate) > new Date(val)) {
          this.$alert(text + '的开始时间不能大于结束时间', '提示', { type: 'warning' })
          this.filters[key + 'End'] = ''
        }
      }
    },
    isDisabledSort() {
      for (let i = 0; i < this.templateData.length; i++) {
        const item = this.templateData[i]
        if (item.id === this.lastTemplateId) {
          if (item.delAble === 0) {
            return true
          }
        }
      }
      return false
    },
    handleTemplate(val) {
      this.$confirm('是否切换报表模板？', '提示', {
        type: 'warning',
        cancelButtonText: '否',
        confirmButtonText: '是'
      }).then(() => {
        // this.lastTemplateId = val
        // this.sortable = this.isDisabledSort()
        // this.queryFilter()
        // this.queryTableTitle()
        // this.query()
        sessionStorage.setItem(this.$route.path, val)
        this.$router.push({ path: this.$route.path, query: { time: new Date().getTime() }})
      }).catch(() => {
        this.filters.templateId = this.lastTemplateId
      })
    },
    getFllbName(fllb) {
      if (fllb) {
        const array = fllb.split(',')
        let data = this.fllbList
        const arr = []
        for (let i = 0; i < array.length; i++) {
          data = this.eachData(data, array[i], arr)
          break
        }
        return arr.join('，')
      } else {
        return '-'
      }
    },
    eachData(child, value, arr) {
      let children = []
      child.forEach((item, index) => {
        if (item.value === value) {
          arr.push(item.label)
          children = item.children
        }
      })
      return children
    },
    getAjztName(ajzt) {
      for (let i = 0; i < this.ajztData.length; i++) {
        const item = this.ajztData[i]
        if (String(ajzt) === String(item.code)) {
          return item.codeName
        }
      }
    },
    getAjzmName(ajzm) {
      for (let i = 0; i < this.ajzmData.length; i++) {
        const item = this.ajzmData[i]
        if (String(ajzm) === String(item.code)) {
          return item.name
        }
      }
    },
    getAjlyName(ajly) {
      for (let i = 0; i < this.ajlyList.length; i++) {
        const item = this.ajlyList[i]
        if (String(ajly) === String(item.code)) {
          return item.codeName
        }
      }
    },
    AJLXHandler(val) {
      if (val && val.length > 0) {
        if (this.ajlxFirst || this.ajlxFirst !== val[0]) {
          this.ajlxFirst = val[0]
          this.initAjlb(this.ajlxFirst) // 案件类别
          this.initAjzm(this.ajlxFirst) // 案件罪名
        }
      }
    },
    gotoMergeList() { // 跳转 重复合并列表
      // this.$router.push({ path: '/caseManage/caseMergeList', query: { origin: 'caseList' }})
      var param = {
        origin: 'caseList'
      }
      this.$gotoid('/caseManage/caseMergeList', JSON.stringify(param))
    },
    handleAjMerge(index, row) { // 案件重复合并 12.4
      var param = {
        type: 'merge',
        caseId: row.id, // 案件id
        ajmc: row.ajmc,
        ajbh: row.ajbh
      }
      this.$gotoid('/caseManage/caseMergeForm', JSON.stringify(param))
    },
    setFilter() {
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const param = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (param) {
          if (param.areaCode) {
            this.queryArea = param.areaCode
          }
          if (param.deptCode) {
            this.queryDeptCode = param.deptCode
          }
          // if (String(param.type) === '0') {
          //   this.filters.ajzt = '402'
          // }
          // if (String(param.type) === '1') {
          //   this.filters.ajzt = '402'
          // }
          if (param.start) {
            if (String(param.type) === '0') {
              // this.filters.larqStart = param.start
            }
            if (String(param.type) === '1') {
              this.filters.parqStart = param.start
            }
          }
          if (param.end) {
            if (String(param.type) === '0') {
              this.filters.larqEnd = param.end
            }
            if (String(param.type) === '1') {
              this.filters.parqEnd = param.end
            }
          }
        }
        sessionStorage.setItem(this.$route.path, '')
      }
    },
    getReplace(data) {
      if (data) {
        var item = data.split('/r/n').join('\r\n')
        return item
      }
    }
  },
  mounted() {
    this.initAjzt() // 案件状态
    this.initAjxz() // 案件性质
    this.initAjly() // 案件来源
    this.setFilter()
    this.initData()
  }
}
</script>

<style>
.caseList {
}
.caseList .el-form .el-cascader.el-cascader--small,
.caseList .el-form .el-input.el-input--small,
.caseList .el-form .el-select.el-select--small {
  width: 222px;
}
.caseList .autoItem {
  margin-right: 14px;
}
.caseList .time_left {
  padding-left: 10px;
  margin-right: 0;
  margin-bottom: 0;
}
.el-table-filter {
  background-color: #033e79;
}
.caseList .el-table .el-icon-arrow-down:before {
  content: "\E603";
}
.caseList .el-table .el-table__column-filter-trigger {
  display: none;
}
.caseList .el-table .show_filter .el-table__column-filter-trigger {
  display: inline-block;
}
.caseList .el-form-item__label {
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
}
.tooltipShow_case {
  opacity: 1;
}
.tooltipHide_case {
  opacity: 0;
}
.el-tooltip__popper.is-dark.tooltipShow_case .popper__arrow {
  left: 5px !important;
}
.caseList_cascader .el-cascader-menu__item.is-disabled {
  background-color: #00537d;
}
.caseList .ajfl,
.caseList .area {
  height: 23px;
  line-height: 18px;
  margin-right: 6px;
  font-size: 14px;
  word-break: keep-all;
  display: inline-block;
  padding: 2px 10px;
  background-blend-mode: normal, normal;
  border-radius: 4px;
}
.caseList .area {
  color: #ffffff;
  text-shadow: 0 0 2px #6f6d6d;
}
.caseList .type3 {
  background-image: linear-gradient(90deg, #187be0 0%, #54aedf 100%);
}
.caseList .type1 {
  background-image: linear-gradient(140deg, #40a954 0%, #20e1aa 100%);
}
.caseList .type2 {
  background-image: linear-gradient(140deg, #ff7a04 0%, #fdbc22 100%);
}

.caseList .bg0 {
  background-image: linear-gradient(90deg, #187be0 0%, #54aedf 100%);
}
.caseList .bg1 {
  background-image: linear-gradient(90deg, #fe595d 0%, #f789a6 100%);
}
.caseList .bg2 {
  background-image: linear-gradient(140deg, #138fb8 0%, #53c7e0 100%);
}
.caseList .bg3 {
  background-image: linear-gradient(140deg, #40a954 0%, #20e1aa 100%);
}
.caseList .bg4 {
  background-image: linear-gradient(140deg, #177ce0 0%, #54afe0 100%);
}
.caseList .bg5 {
  background-image: linear-gradient(140deg, #6e3ec8 0%, #8f55d5 100%);
}
.caseList .bg6 {
  background-image: linear-gradient(140deg, #ff7a04 0%, #fdbc22 100%);
}
</style>
