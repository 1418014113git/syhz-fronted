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
          <el-cascader v-if="item.columnType === 3 && item.columnName === 'SYH_FLLB'" v-model="filters[item.filterName]" change-on-select filterable :options="fllbList" clearable></el-cascader>
          <el-select v-if="item.columnType === 3 && item.columnName !== 'SYH_FLLB'" v-model="filters[item.filterName]" placeholder="请选择" clearable>
            <el-option v-if="item.columnName === 'AJZT'" v-for="option in ajztData" :key="option.code" :label="option.codeName" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'AJLB'" v-for="option in ajlbData" :key="option.code" :label="option.name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'SYH_AJLB'" v-for="option in ajzmData" :key="option.code" :label="option.name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'CONFIRM_STATUS'" v-for="option in dqztData" :key="option.value" :label="option.label" :value="option.value"></el-option>
            <el-option v-if="item.columnName === 'AJXZ'" v-for="option in AJXZList" :key="option.code" :label="option.code_name" :value="option.code"></el-option>
            <el-option v-if="item.columnName === 'AJSX'" v-for="option in AJSXList" :key="option.value" :label="option.label" :value="option.value"></el-option>
            <el-option v-if="item.columnName === 'BARXB'" v-for="option in XBList" :key="option.value" :label="option.label" :value="option.value"></el-option>
          </el-select>
          <span v-if="item.columnType === 2">
            <el-date-picker v-model="filters[item.filterName + 'Start']" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" @change="startDateChange($event, item.filterName)"></el-date-picker>
            <el-form-item label="至" class="time_left">
              <el-date-picker :disabled="filters[item.filterName + 'Start'] === undefined || filters[item.filterName + 'Start'] === null || filters[item.filterName + 'Start'] === ''" v-model="filters[item.filterName + 'End']" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" @change="endDateChange($event, item.filterName)"></el-date-picker>
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
      <el-form-item >
        <el-button type="primary" size="small" v-on:click="query(true)">查询</el-button>
        <el-button v-if="$isViewBtn('182003') || $isViewBtn('182004') || $isViewBtn('182005')" type="primary" size="small" v-on:click="toTemplate()">维护模板</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="caseData" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="简要案情">
              <span>{{ props.row.jyaq }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="52"></el-table-column>
      <el-table-column v-for="item in titleData" :key="item.index" :label="item.columnDescribe" :prop="item.titleName" :sortable="sortable"
                       :width="setWidth(item)"
                       :min-width="item.columnName === 'AJMC' ? '200px' : '130px'"
                       :class-name="className(item)"
                       :column-key="item.titleName"
                       :filters="(item.columnName === 'AJZT' ? ajztFilter : (item.columnName === 'SYH_AJLB' ? ajlbFilter : (item.columnName === 'CONFIRM_STATUS' ? confirmStatusFilter : [])))"
                       :filter-method="filterHandler">
        <template slot-scope="scope">
          <a v-if="item.columnName === 'AJMC' || item.columnName === 'AJBH'" class="ajbh-color" @click="handleAjDetail(scope.$index, scope.row)">{{scope.row[item.titleName]}}</a>
          <span v-else-if="item.columnName === 'CONFIRM_STATUS'">
            {{scope.row[item.titleName] === null || scope.row[item.titleName] === undefined || scope.row[item.titleName] === 2 ? ('上报已读') : (scope.row[item.titleName] === 1 ? '上报未读': '')}}
          </span>
          <span v-else-if="item.columnName === 'SYH_FLLB'">{{getFllbName(scope.row[item.titleName])}}</span>
          <span v-else-if="item.columnName === 'AJZT'">{{getAjztName(scope.row[item.titleName])}}</span>
          <span v-else-if="item.columnName === 'SYH_AJLB'">{{getAjzmName(scope.row[item.titleName])}}</span>
          <span v-else-if="item.columnName === 'AJLB'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'AJXZ'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'AJSX'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else-if="item.columnName === 'BARXB'">{{scope.row[item.titleName + 'Name']}}</span>
          <span v-else>{{scope.row[item.titleName]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets"  circle @click="handleAjDetail(scope.$index, scope.row)"></el-button>
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
  import { getSYHFLLBList, getAJLBText, getAJSXList, getXBSelect } from '@/utils/codetotext'
  export default {
    name: 'caseList',
    data() {
      return {
        filters: {
          area: [],
          department: [],
          templateId: '',
          words: ''
        },
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
        ]
      }
    },
    methods: {
      setWidth(item) {
        if (item.columnName === 'AJMC') {
          return ''
        }
        if (this.titleData.length < 8) {
          return '240px'
        }
        if (item.columnName === 'CONFIRM_STATUS' || item.columnName === 'AJZT' || item.columnName === 'AJSX' || item.columnName === 'LARQ') {
          return '120px'
        }
        if (item.columnName === 'BARHJSZDSSXQ_NAME' || item.columnName === 'BARSJJZDSSXQ_NAME') {
          return '240px'
        }
        return '200px'
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
              for (let i = 0; i < arr[0].children.length; i++) {
                const item = arr[0].children[i]
                if (String(item.cityCode) !== String(this.curDept.areaCode)) {
                  item.disabled = true
                }
              }
            }
            this.areaOptions = arr
            let currentArea = []
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
              if (this.curDept.areaCode === '610403') { // 杨凌例外
                currentArea = ['610000', '610403']
              } else { // 正常的派出所
                currentArea = ['610000', this.curDept.areaCode.substring(0, 4) + '00', this.curDept.areaCode]
              }
            }
            this.filters.area = currentArea
            this.handleAreaChange(currentArea) // 查单位机构
            // 默认选择本单位
            if (this.curDept.depType === '-1') { // 省
              this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '1') { // 总队
              this.filters.department = [this.curDept.parentDepCode, this.curDept.depCode]
            } else if (this.curDept.depType === '2') { // 支队
              this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '3') { // 大队
              this.filters.department = [this.curDept.depCode]
            } else if (this.curDept.depType === '4') { // 派出所
              this.filters.department = [this.curDept.parentDepCode, this.curDept.depCode]
            }
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
          if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
            const templateId = sessionStorage.getItem(this.$route.path)
            this.filters.templateId = parseInt(templateId)
            sessionStorage.setItem(this.$route.path, '')
          } else {
            this.filters.templateId = this.templateData[0].id
          }
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
        this.getCase(false, true)
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCase(true, true)
      },
      toTemplate() {
        this.$gotoid('/reportTemplate')
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
            this.ajztFilter = arr1
          }
        }).catch(() => {
        })
      },
      initAjlb() { // 初始化案件类别
        this.$query('getajlb', {}).then((response) => {
          if (response.data && response.data.length > 0) {
            this.ajlbData = response.data
          }
        }).catch(() => {
        })
      },
      initAjzm() { // 案件罪名
        this.$query('ajzm', {}).then(response => {
          if (response.data && response.data.length > 0) {
            this.ajzmData = response.data
            const arr = []
            for (let j = 0; j < this.ajzmData.length; j++) {
              const data = this.ajzmData[j]
              arr.push({value: data.code, text: data.name})
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
      initAjxz() {
        const para = {
          codelx: 'ajxz'
        }
        this.$query('CODENAMEQUERY', para).then((response) => {
          this.AJXZList = response.data
        })
      },
      startDateChange(val, key) {
        if (val === undefined || val === null || val === '') {
          this.filters[key + 'End'] = ''
        }
      },
      endDateChange(val, key) {
        console.info(val, key)
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
        if (fllb && fllb.indexOf(',') > -1) {
          const array = fllb.split(',')
          let text = ''
          for (let i = 0; i < array.length; i++) {
            text += '，' + getAJLBText(array[i])
          }
          return text.substring(1, text.length)
        } else {
          return getAJLBText(fllb)
        }
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
      }
    },
    mounted() {
      this.initData()
      this.initAjzt() // 案件状态
      this.initAjlb() // 案件类别
      this.initAjzm() // 案件罪名
      this.initAjxz() // 案件性质
      this.queryTemplate()
    }
  }
</script>

<style>
  .caseList{
  }
  .caseList .el-form .el-cascader.el-cascader--small, .caseList .el-form .el-input.el-input--small, .caseList .el-form .el-select.el-select--small{
    width: 222px;
  }
  .caseList .autoItem{
    margin-right: 14px;
  }
  .caseList .time_left{
    padding-left: 10px;
    margin-right: 0;
    margin-bottom: 0;
  }
  .el-table-filter{
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
  .caseList .el-form-item__label{
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
  .el-tooltip__popper.is-dark.tooltipShow_case .popper__arrow{
    left: 5px !important;
  }
  .caseList_cascader .el-cascader-menu__item.is-disabled{
    background-color: #00537d;
  }
</style>
