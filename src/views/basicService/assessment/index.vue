<template>
 <!--考核评比-->
  <section class="assess">
    <el-col v-loading="loading">
      <el-card style="margin-bottom: 10px;">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="年份" prop="yearDate">
            <el-date-picker @change="yearChange"
              v-model="filterForm.yearDate"
              type="year" value-format="yyyy"
              placeholder="选择年"
              :clearable="false"
              :picker-options="yearPickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="季度" prop="quarterDate">
            <el-select v-model="filterForm.quarterDate" placeholder="请选择" :disabled="quarterDisabled" @change="quarterChange" clearable class="selectBox">
              <el-option label="第一季度" value="1"></el-option>
              <el-option label="第二季度" value="2"></el-option>
              <el-option label="第三季度" value="3"></el-option>
              <el-option label="第四季度" value="4"></el-option>
              <el-option label="自定义" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义日期" prop="startDate">
            <el-date-picker  v-model="filterForm.startDate"  placeholder="请选择" type="date" :disabled="startDateDisabled" value-format="yyyy-MM-dd" :picker-options="startPickerOptions" @change="startDateChange"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="endDate">
            <el-date-picker  v-model="filterForm.endDate" placeholder="请选择" type="date" :disabled="endDateDisabled" value-format="yyyy-MM-dd" :picker-options="endPickerOptions" @change="endDateChange"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item> -->
            <el-button type="primary" @click="queryAssess(true)">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="primary" v-if="$isViewBtn('103602')" @click="exportToExcel" :disabled="isOnExport">导出</el-button>
            <el-button type="primary" v-if="$isViewBtn('103601')" @click="assessStandardSetting">设置考核标准</el-button>
            <el-button type="primary" @click="assessProjectSetting">设置考核项目</el-button>
          <!-- </el-form-item> -->
        </el-form>
      </el-card>
      <el-card style="margin-bottom: 10px;">
        <el-table :data="assessData"  style="width: 100%;" v-loading="loading1" class="table_th_center"
          :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick"
          ref="teamStatistical" :row-class-name="getRowClass" show-summary :summary-method="getSummaries">
          <el-table-column type="expand" :width="isSheng?40:1" class-name="expand"  fixed="left">
            <template slot-scope="scope">
              <el-table :data="scope.row.child||[]" :style="expandTableStyle" v-loading="loading2">
                <el-table-column prop="" label="" width="40" fixed="left"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="55" fixed="left"></el-table-column>
                <el-table-column prop="name" label="单位" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip fixed="left"></el-table-column>
                <el-table-column v-for="(item4,index4) in tableHead" :prop="item4.sign" :label="item4.categoryName" :key="index4" align="center" min-width="80">
                  <el-table-column v-for="(item5,index5) in item4.children" :prop="item5.sign+item4.category" :label="item5.categoryName" :key="index5"  align="center">
                    <el-table-column v-for="(item6,index6) in item5.children" :prop="item6.categoryName==='计分'?item6.sign:item6.sign+item4.category" :label="item6.categoryName" :key="index6" :min-width="smallItemWidth"  align="center">
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="55" label="序号" align="center"  fixed="left"></el-table-column>
          <el-table-column prop="name" :label="isSheng===true?'地市':'单位'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip  fixed="left"></el-table-column>
          <!-- 其他的三级字段的prop 需要加上一级的category -->
          <el-table-column v-for="(item1,index1) in tableHead" :prop="item1.sign" :label="item1.categoryName" :key="index1" align="center" min-width="80">
            <el-table-column v-for="(item2,index2) in item1.children" :prop="item2.sign+item1.category" :label="item2.categoryName"  :key="index2"  align="center">
              <el-table-column v-for="(item3,index3) in item2.children" :prop="item3.categoryName==='计分'?item3.sign:item3.sign+item1.category" :label="item3.categoryName" :key="index3" :min-width="smallItemWidth"  align="center">
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </section>
</template>

<script>
// import FileSaver from 'file-saver'
import { getajzbList } from '@/utils/anzbList'
export default {
  name: 'assess',
  components: {
  },
  data() {
    return {
      assessData: [], // 考核评比列表
      tableHead: [
        // {
        //   id: 400, label: '环境', prop: 'q', width: '', children: [
        //     {
        //       id: 410, label: '侦办案件', prop: 'q', width: '', children: [
        //         { id: 411, label: '立案', prop: '', width: '110' },
        //         { id: 412, label: '破案', prop: '', width: '140' }
        //       ]
        //     },
        //     {
        //       id: 410, label: '处理人员', prop: 'q', width: '', children: [
        //         { id: 411, label: '抓获', prop: '', width: '110' },
        //         { id: 412, label: '抓获额外', prop: '', width: '140' }
        //       ]
        //     }
        //   ]
        // }
      ],
      smallItemWidth: 80,
      yearPickerOptions: {
        disabledDate(time) {
          // 可选范围 2017-2030
          return time.getTime() > new Date('2030-01-01').getTime() || time.getTime() < new Date('2017-01-01').getTime()
        }
      },
      firstCanJump: false,
      systemTime: '', // 系统当前时间戳
      loading: false,
      loading1: false, // 列表加载loading
      loading2: false, // 列表加载loading
      expands: [], // 展开的行
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      isSheng: true, // 表头显示 地市还是单位
      startPickerOptions: {},
      endPickerOptions: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      tableData: getajzbList(),
      quarterDisabled: true, // 季度选择框是否禁用
      startDateDisabled: true,
      endDateDisabled: true, // 结束时间选择框是否禁用
      filterForm: { // 接口参数
        yearDate: '', //  年
        quarterDate: '', // 季度
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      xzhj: {},
      zyhj: {},
      settingShow: false,
      isOnExport: true // 导出按钮默认不可点击，当查询接口ok后，才能点击。
    }
  },
  methods: {
    getRowKeys(row) {
      return row.deptCode
    },
    getRowClass(row) {
      if (!this.isSheng) { // 合计行 隐藏展开符号 和 序号
        return 'row-expand-cover'
      }
      // if(row.row.departType === '2' || row.row.departType === '3'){

      // }
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['id']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parentId']]
        if (key) {
          if (!key['children']) {
            key['children'] = []
            key['children'].push(treeArray[i])
          } else {
            key['children'].push(treeArray[i])
          }
        } else {
          r.push(treeArray[i])
        }
      }
      return r
    },
    getSysTime() {
      this.loading = true
      this.$query('knowledge/queryTime').then(response => {
        this.loading = false
        this.systemTime = response.data
        this.filterForm.yearDate = new Date(this.systemTime).getFullYear() + ''
        this.yearChange(this.filterForm.yearDate)
        this.queryAssess(true) // 查询列表
      })
    },
    queryAssess(hand, city) { // city 表示展开的查询，有可能是areacode,也有可能是deptCode
      var param = JSON.parse(JSON.stringify(this.filterForm))
      if (!param.startDate || !param.endDate) {
        this.$message.error('请选择自定义日期')
        return false
      }
      param.startDate = param.startDate.replace(/-/g, '') // 接口要求时间去掉短横线
      param.endDate = param.endDate.replace(/-/g, '')
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      param.userId = this.userInfo.id
      if (city) { // 点击表格展开的查询
        this.loading2 = true
        if (city === '610000530000') { // 省厅
          param.deptCode = city
        } else {
          param.cityCode = city
        }
        // param.isExpandTable = '1' // 展开表格查询的标志字段
      } else { // 一级表格的查询
        this.loading1 = true
        if (this.deptInfo.depType === '1') {
          param.provinceCode = '610000'
        } else if (this.deptInfo.depType === '2') {
          param.cityCode = this.deptInfo.areaCode
        } else if (this.deptInfo.depType === '3') {
          param.deptCode = this.deptInfo.depCode
        } else if (this.deptInfo.depType === '4') {
          param.deptCode = this.deptInfo.parentDepCode
        }
        this.expands = [] // 初始化 所有行 均不展开
      }
      this.$query('khpb/total', param).then((response) => {
        if (response.code === '000000') {
          this.isOnExport = false
          var head = this.getTree(response.data.tableHead)
          this.tableHead = head
          if (city) {
            this.loading2 = false
            for (let i = 0; i < this.assessData.length; i++) {
              const item = this.assessData[i]
              if (city === '610000530000') { // 省厅
                if (item.deptCode === city) {
                  item.child = response.data.list
                }
              } else {
                if (item.areaCode === city) {
                  item.child = response.data.list
                }
              }
            }
          } else {
            this.loading1 = false
            this.assessData = response.data.list
            this.xzhj = response.data.xzhj
            this.zyhj = response.data.zyhj
            if (param.provinceCode === '610000') { // 查全省
              this.isSheng = true
            } else {
              this.isSheng = false // 控制 表头显示 省市 还是单位机构
            }
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    assessStandardSetting() { // 设置考核标准
      this.$router.push({ path: '/basicService/asses/standardSetting' })
    },
    assessProjectSetting() { // 设置考核项目
      this.$router.push({ path: '/basicService/asses/projectSetting' })
    },
    rowClick(row) { // 案件数量统计  展开
      if (this.expands.indexOf(row.deptCode) > -1) { // 展开项中存在
        this.expands.splice(this.expands.indexOf(row.deptCode), 1)
      } else { // 展开项中不存在
        this.expands.push(row.deptCode)
        if (row.deptCode === '610000530000') { // 省厅
          this.queryAssess(true, row.deptCode) // 根据部门code查
        } else {
          if (row.areaCode) {
            this.queryAssess(true, row.areaCode) // 根据盟市code查
          } else {
            //
          }
        }
      }
    },
    yearChange(val) { // 按年查询
      this.startDateDisabled = true
      this.endDateDisabled = true // 禁用结束时间选择框
      if (val) {
        this.quarterDisabled = false // 激活季度选择框
        if (this.filterForm.quarterDate) { // 按年查询change，若此时存在季度
          this.quarterChange(this.filterForm.quarterDate)
        } else { // 不存在季度
          const date = new Date(val + '-01-01')
          this.filterForm.startDate = this.$parseTime(new Date(date.getFullYear(), 0, 1), '{y}-{m}-{d}')
          this.filterForm.endDate = this.$parseTime(new Date(date.getFullYear(), 12, 0), '{y}-{m}-{d}')
        }
      } else {
        // 清除年 不存在这种情况
      }
    },
    quarterChange(val) { // 按季度查询
      this.startDateDisabled = true
      this.endDateDisabled = true // 禁用结束时间选择框
      if (val) {
        if (val === '5') { // 自定义
          this.startDateDisabled = false
          this.endDateDisabled = false
          this.filterForm.startDate = ''
          this.filterForm.endDate = ''
        } else { // 非自定义
          var date = ''
          if (this.filterForm.yearDate) {
            date = new Date(this.filterForm.yearDate + '-01-01')
          }
          this.filterForm.startDate = this.$parseTime(new Date(date.getFullYear(), (val * 3 - 3), 1), '{y}-{m}-{d}')
          this.filterForm.endDate = this.$parseTime(new Date(date.getFullYear(), (val * 3), 0), '{y}-{m}-{d}')
        }
      } else {
        this.yearChange(this.filterForm.yearDate)
      }
    },
    startDateChange(val) { // 开始时间
      if (val) {
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime() - (60 * 60 * 24 * 1000)
          }
        })
      } else {
        this.filterForm.endDate = ''
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
        this.endPickerOptions = Object.assign({}, 'endPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    endDateChange(val) { // 结束时间
      if (val) {
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.startPickerOptions = Object.assign({}, 'startPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    /* eslint-disable */
    exportToExcel() { // 导出Excel
      const param = {
        data: this.assessData,
        tableHead: this.tableHead
      }
      this.$gotoid("/exportAccess", JSON.stringify(param))
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '';
          return;
        }
        if (index === 2) {
          sums[index] = '总计';
          return;
        }
        // 总队的 不合计 计分
        if (this.deptInfo.depType === '1' && column.label.indexOf('计分') > -1) {
          sums[index] = '-';
          return;
        }
        // column.property 相当于是prop
        if (column.property === "aqwcxcaj1") {
          sums[index] = this.xzhj.aqwcxcajhj1;
          return;
        }
        if (column.property === "aqwcxcaj2") {
          sums[index] = this.xzhj.aqwcxcajhj2;
          return;
        }
        if (column.property === "aqwcxcaj3") {
          sums[index] = this.xzhj.aqwcxcajhj3;
          return;
        }
        if (column.property === "aqwwcxcaj1") {
          sums[index] = this.xzhj.aqwwcxcajhj1;
          return;
        }
        if (column.property === "aqwwcxcaj2") {
          sums[index] = this.xzhj.aqwwcxcajhj2;
          return;
        }
        if (column.property === "aqwwcxcaj3") {
          sums[index] = this.xzhj.aqwwcxcajhj3;
          return;
        }
        if (column.property === "aqwcjqhcaj1") {
          sums[index] = this.zyhj.aqwcjqhcajhj1;
          return;
        }
        if (column.property === "aqwcjqhcaj2") {
          sums[index] = this.zyhj.aqwcjqhcajhj2;
          return;
        }
        if (column.property === "aqwcjqhcaj3") {
          sums[index] = this.zyhj.aqwcjqhcajhj3;
          return;
        }
        if (column.property === "aqwwcjqhcaj1") {
          sums[index] = this.zyhj.aqwwcjqhcajhj1;
          return;
        }
        if (column.property === "aqwwcjqhcaj2") {
          sums[index] = this.zyhj.aqwwcjqhcajhj2;
          return;
        }
        if (column.property === "aqwwcjqhcaj3") {
          sums[index] = this.zyhj.aqwwcjqhcajhj3;
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index];
        } else {
          sums[index] = '-';
        }
      });

      return sums;
    },
    reset() { // 重置
      this.resetForm('filterForm')
      this.filterForm.quarterDate = ''
      this.getSysTime() // 页面重新初始化
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
  },
  mounted() {
    this.getSysTime() // 获取系统时间
    this.$nextTick(() => { // 页面渲染完成后的回调
      this.screenWidth = this.$refs.teamStatistical.$el.clientWidth + 'px'
      this.expandTableStyle = 'width:' + this.screenWidth + ';border-left: none;border-right: none;overflow-x:auto;'
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.assess {
  .selectBox .el-input__inner {
    // 季度选择框
    height: 25px !important;
  }
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  //修改表格边框颜色
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: none;
    border-right: 1px solid #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  // .row-expand-cover .xuhao .cell div {
  //   color: transparent;
  // }
  // 不能点击的样式
  .noClick {
    pointer-events: none;
  }
  // .el-table--scrollable-x .el-table__body-wrapper {
  //   overflow-x: hidden;
  // }
  // .el-table__header-wrapper {
  //   table {
  //     border-bottom: 1px solid #fff;
  //   }
  // }
  // .el-table--border {
  //   border: 1px solid #ebeef5;
  // }
  // .el-year-table td .cell {
  //   color: #fff !important;
  // }

  // 将滚定条设置到合计行下方，会影响列的fixed
  // .el-table {
  //   overflow: auto;
  // }
  // .el-table__body-wrapper,
  // .el-table__header-wrapper,
  // .el-table__footer-wrapper {
  //   overflow: visible !important;
  // }
  // .el-table::after {
  //   position: relative !important;
  // }
  // 固定左侧列的样式问题
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    tr:nth-child(odd) {
    background-color: #004f77;
  }
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    tr:nth-child(even) {
    background-color: #032c43;
  }
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    .el-table__body
    tr:hover
    > td {
    background-color: #2164a1;
  }
  .el-table__fixed::before,
  .el-table__fixed::before {
    opacity: 0;
  }
  // 总计列 样式
  .el-table__fixed-footer-wrapper tbody td {
    background-color: rgb(0, 89, 130);
    color: #ffffff;
    border-top: none;
  }
}
</style>
