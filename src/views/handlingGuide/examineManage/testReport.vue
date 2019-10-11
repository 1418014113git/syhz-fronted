<template>
  <div class="report">
    <!-- <el-card style="margin-bottom: 10px;">
    </el-card> -->
    <el-row class="btn_wrap">
      <el-button type="primary" @click="closeDia">关闭</el-button>
      <!-- @click="printReport" -->
      <!-- v-print="'#pdfDom'" -->
      <el-button type="primary" @click="printReport">打印</el-button>
      <el-button type="primary" @click="toGetPdf">下载</el-button>
    </el-row>
    <div id="pdfDom" style="padding: 20px;" ref="print">
      <p class="title">{{examItem.examinationName}}考试报告</p>
      <p class="main_content">
        自 {{examItem.startDate}} 至 {{examItem.endDate}} 开展考试活动期间，应考 {{examItem.totalNum}} 人，实考 {{examItem.realNum}} 人，
        实考占比 {{ toPercent(Number(examItem.realNum)/Number(examItem.totalNum)) }}。</p>
      <p class="main_content">
        其中，
        优（{{examItem.y}}）人，占比 {{ toPercent(Number(examItem.y)/Number(examItem.totalNum)) }}；
        良（{{examItem.l}}）人，占比 {{ toPercent(Number(examItem.l)/Number(examItem.totalNum)) }}；
        中（{{examItem.z}}）人，占比 {{ toPercent(Number(examItem.z)/Number(examItem.totalNum)) }}；
        差（{{examItem.c}}）人，占比 {{ toPercent(Number(examItem.c)/Number(examItem.totalNum)) }}。
      </p>
      <p class="main_content">地市考试情况如下表所示：</p>
      <el-table :data="cityData"  style="width: 100%" :max-height="tableHeight" border class="table_th_center" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="areaName" label="地市" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ykNum" label="应考" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skNum" label="实考" width="120" align="center"></el-table-column>
        <el-table-column prop="yNum" label="优" width="100" align="center"></el-table-column>
        <el-table-column prop="lNum" label="良" width="100" align="center"></el-table-column>
        <el-table-column prop="zNum" label="中" width="100" align="center"></el-table-column>
        <el-table-column prop="cNum" label="差" width="100" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 关闭按钮 -->
    <div style="text-align:center;">
      <el-button size="medium" type="primary" @click="closeDia">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'examinationStatistical',
  props: ['examItem'],
  data() {
    return {
      htmlTitle: '', // 导出pdf的文件名
      filterQuery: {
        deptCode: '',
        startDate: '',
        endDate: '',
        examinationName: '',
        type: ''
      },
      examinations: [], // 考试统计
      cityData: [],
      expandstab: [], // 设置当前的展开行
      caseData: [], // 市的列表数据
      // subDeptCaseData: [], // 下级部门列表数据
      listLoading: false, // 列表加载loading
      subLoading: false, // 子列表loading
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null,
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      endPickerOptions: {},
      // cityData: [], // 盟市统计的
      startTime: '', // 开始时间，页面是绑定的modle
      endTime: '', // 结束时间
      yearDate: '', // 年份
      quarterDate: '', // 季度
      monthDate: '', // 月份
      quarterDisabled: true,
      monthDisabled: true,
      endDateDisabled: true, // 结束时间禁用
      examLoading: false, // 考试统计loading
      cityLoading: false, // 盟市统计loading
      cityStatistical: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      multipleSelection: [], // 选中的多行
      showEchart: false,
      curDept: {} // 当前部门
    }
  },
  watch: { // 监听state状态变化
    examItem: {
      handler: function(val, oldeval) {
        // this.queryList(true)
        this.queryCityStatisticalByExam(this.examItem.examinationId) // 考试统计
      }
    }
  },
  methods: {
    closeDia() { // 关闭弹框
      this.$emit('isShowDialog')
    },
    printReport() { // 打印报告
      this.$print(this.$refs.print) // 使用
    },
    toGetPdf() { // 下载报告
      window.scrollTo(0, 0)
      this.htmlTitle = this.examItem.examinationName + '考试报告'
      this.getPdf(this.htmlTitle)
    },
    toPercent(point) {
      if (point) {
        var str = Number(point * 100).toFixed(1)
        str += '%'
        return str
      } else {
        return '0%'
      }
    },
    handleSelectionChange(val) { // 多选表格
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      var choosedArr = []
      var choosedStr = ''
      if (this.multipleSelection.length > 0) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          const element = this.multipleSelection[index]
          choosedArr.push(element.examinationId)
        }
        choosedStr = choosedArr.join(',')
        this.queryCityStatisticalByExam(choosedStr)
      } else {
        this.cityData = []
        this.drawChartScore()
        this.drawChartPerNum()
        this.drawCityStatistical()
      }
    },
    getSummaries() {
      const sums = ['', '', '合计', '', '', '', '', '']
      sums[3] = this.$thousSplit(this.totlaYrl + '')
      sums[4] = this.$thousSplit(this.totalDrl + '')
      sums[5] = this.$thousSplit(this.totalXf + '')
      sums[6] = this.$thousSplit(this.totalZf + '')
      sums[7] = this.$thousSplit(this.totalCx + '')
      sums[8] = this.$thousSplit(this.totalAll + '')
      return sums
    },
    initStaticData() {
      for (let index = 0; index < this.cityData.length; index++) { // 初始化12市数据全为0
        const element = this.cityData[index]
        element.claimed = 0
        element.toClaimed = 0
        element.downward = 0
        element.forward = 0
        element.revoke = 0
        element.total = 0
      }
    },
    queryExamStatistical(hand) {
      if (this.filterQuery.type === '') {
        if (this.filterQuery.startDate === '' && this.filterQuery.endDate !== '') { // 开始时间为空,结束时间不为空
          this.$message({
            message: '开始时间不能为空', type: 'error'
          })
          return false
        } else if (this.filterQuery.startDate !== '' && this.filterQuery.endDate === '') { // 选择了开始时间,结束时间为空
          this.filterQuery.endDate = this.getdate() // 将当前时间赋值给结束时间
        } else if (this.filterQuery.startDate && this.filterQuery.endDate) { // 开始时间和结束时间均不为空
          if (new Date(this.filterQuery.startDate).getTime() > new Date(this.filterQuery.endDate).getTime()) {
            this.$message({
              message: '结束时间不能小于开始时间', type: 'error'
            })
            return false
          }
        }
      }
      // if (hand) { // 手动点击时，添加埋点参数
      //   this.filters.logFlag = 1
      // }
      var param = {
        deptRange: this.filterQuery.deptRange || '',
        startDate: this.filterQuery.startDate || '',
        endDate: this.filterQuery.endDate || '',
        examinationName: this.filterQuery.examinationName || '',
        year: this.filterQuery.type === 'year' ? true : '',
        quarter: this.filterQuery.type === 'quarter' ? true : '',
        month: this.filterQuery.type === 'month' ? true : '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.examLoading = true
      this.$query('examination/statistics', param).then((response) => {
        if (response.code === '000000') {
          this.examLoading = false
          this.examinations = response.data.list
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.examLoading = false
      })
    },
    queryCityStatisticalByExam(examIdStr) {
      // if (hand) { // 手动点击时，添加埋点参数
      //   this.filters.logFlag = 1
      // }
      this.listLoading = true
      this.$query('examination/statisticsOne?examinationIds=' + examIdStr, {}).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          this.cityData = response.data
          if (this.cityData.length > 0) {
            // this.showEchart = true
            for (let index = 0; index < this.cityData.length; index++) {
              var cityElement = this.cityData[index]
              cityElement.ykNum = 0 // 应考
              cityElement.skNum = 0 // 实考
              cityElement.yNum = 0
              cityElement.lNum = 0
              cityElement.zNum = 0
              cityElement.cNum = 0
              for (let m = 0; m < cityElement.child.length; m++) {
                const deptElement = cityElement.child[m]
                cityElement.ykNum += deptElement.totalNum
                cityElement.skNum += deptElement.realNum
                cityElement.yNum += deptElement.y
                cityElement.lNum += deptElement.l
                cityElement.zNum += deptElement.z
                cityElement.cNum += deptElement.c
              }
            }
          } else {
            this.cityData = []
            // this.showEchart = false
          }
          this.drawChartScore()
          this.drawChartPerNum()
          this.drawCityStatistical()
        }
      }).catch(() => {
        this.cityLoading = false
      })
    },
    getRowClass(row) {
      // console.log(row)
      if (!row.row.canExpand) {
        return 'row-expand-cover'
      }
    },
    handleCurrentChange(val) {
      alert(val) // 分页查询
      this.page = val
      this.queryExamStatistical()
    },
    handleSizeChange(val) { // 分条查询
      alert(val) // 分页查询
      this.pageSize = val
      this.queryExamStatistical()
    },
    drawChartScore() { // 考试成绩 饼状图
      var scoreArr = []
      if (this.cityData.length > 0) {
        var yNumAll = 0
        var lNumALl = 0
        var zNumAll = 0
        var cNumAll = 0
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          yNumAll += element.yNum
          lNumALl += element.lNum
          zNumAll += element.zNum
          cNumAll += element.cNum
        }
        scoreArr = [
          { value: yNumAll, name: '优' },
          { value: lNumALl, name: '良' },
          { value: zNumAll, name: '中' },
          { value: cNumAll, name: '差' }
        ]
      }
      // this.echartScore = echarts.init(document.getElementById('echartScore'))
      this.echartScore.setOption({
        color: ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '考试成绩分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 10,
          top: 20,
          bottom: 20,
          data: ['优', '良', '中', '差'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            // radius: ['0', '75%'],
            // center: ['50%', '60%'],
            data: scoreArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawChartPerNum() { // 参考人数 饼状图
      var joinPerArr = []
      if (this.cityData.length > 0) {
        var ykNumAll = 0 // 应考
        var skNumALl = 0 // 实考
        var qkNum = 0 // 缺考
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          ykNumAll += element.ykNum
          skNumALl += element.skNum
        }
        qkNum = Number(ykNumAll) - Number(skNumALl)
        joinPerArr = [
          { value: skNumALl, name: '实考人数' },
          { value: qkNum, name: '缺考人数' }
        ]
      }
      // this.echartPerNum = echarts.init(document.getElementById('echartPerNum'))
      this.echartPerNum.setOption({
        color: ['#0ECACA', '#1088F6', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '参考情况分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 10,
          top: 20,
          bottom: 20,
          data: ['实考人数', '缺考人数'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['0', '75%'],
            center: ['50%', '60%'],
            data: joinPerArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawCityStatistical() { // 地市考试分析柱状图
      var cityArr = [['product', '应考人数', '实考人数']]
      if (this.cityData.length > 0) {
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          var arr = [element.areaName, element.ykNum, element.skNum]
          cityArr.push(arr)
        }
      }
      // this.cityStatistical = echarts.init(document.getElementById('cityStatistical'))
      this.cityStatistical.setOption({
        title: {
          text: '地市考试分析',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          textStyle: { color: '#bbbbbb' }
        },
        tooltip: {},
        dataset: {
          source: cityArr
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          { type: 'bar', barWidth: 30, itemStyle: { color: '#5DB1FF' }},
          { type: 'bar', barWidth: 30, barGap: 0, itemStyle: { color: '#20CF53' }}
        ]
      })
    },
    filterTypeChange(val) { // 切换筛选类型
      if (val) {
        this.filterQuery.startDate = ''
        this.filterQuery.endDate = ''
      }
    },
    startDateChange(val) { // 开始时间change事件
      if (val) {
        this.filterQuery.type = ''
        this.endDateDisabled = false
        this.endPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'end')
      } else {
        this.endDateDisabled = true
        this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    endDateChange(val) { // 结束时间change事件
      if (val) {
        this.startPickerOptions = this.$pickerOptionChange(val, this.startPickerOptions, 'start')
      } else {
        this.startPickerOptions = this.$pickerOptionChange('', this.startPickerOptions, 'default')
      }
    },
    queryByType(val) { // 查询类型change事件
      this.filters.startTime = ''
      this.filters.endTime = ''
      this.yearDate = '' // 清空年份值
      this.quarterDate = ''
      this.monthDate = ''
      this.yearChange() // 清空了yearDate 没有自动调change事件
      if (val) {
        this.query()
      }
    },
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      // + ' ' + now.toTimeString().substr(0, 8)
    },
    reset() { // 重置
      // this.filters = {
      //   startTime: '', endTime: '', type: ''
      // }
      // this.dateRange = []
      // this.yearDate = '' // 年份
      // this.quarterDate = '' // 季度
      // this.monthDate = '' // 月份
      // this.startTime = '' // 开始时间
      // this.endTime = '' // 结束时间
      // this.query(true)
    },
    yearChange(val) { // 按年查询
      this.endDateDisabled = true // 禁用结束时间选择框
      this.quarterDate = '' // 清空季度
      this.monthDate = '' // 清空月
      if (val) {
        this.filters.type = '' // 清空掉筛选类型框
        this.startTime = ''
        this.endTime = ''
        this.quarterDisabled = false // 激活季度选择框
        this.monthDisabled = false
        const date = new Date(val + '-01-01')
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), 0, 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), 12, 0), '{y}-{m}-{d}')
      } else {
        this.quarterDisabled = true // 禁用季度选择
        this.monthDisabled = true // 禁用月份选择
      }
    },
    quarterChange(val) {
      if (val) {
        this.monthDisabled = true
        this.startTime = ''
        this.endTime = ''
        this.monthDisabled = true
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), (val * 3 - 3), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), (val * 3), 0), '{y}-{m}-{d}')
      } else {
        this.monthDisabled = false
      }
    },
    monthChange(val) {
      if (val) {
        this.quarterDisabled = true
        this.startTime = ''
        this.endTime = ''
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), (val - 1), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), val, 0), '{y}-{m}-{d}')
      } else {
        this.quarterDisabled = false
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    if (this.examItem && this.examItem.examinationId) {
      this.queryCityStatisticalByExam(this.examItem.examinationId) // 考试统计
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.report {
  .btn_wrap {
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  // 文章样式
  .title {
    font-size: 26px;
    text-align: center;
  }
  .main_content {
    font-size: 16px;
    text-indent: 20px;
  }
  .el-table {
    background: #ffffff;
    color: #000000;
    thead {
      background: #ffffff;
      color: #000000;
    }
    .el-table__body-wrapper tr:nth-child(even) {
      background-color: transparent;
    }
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table th > .cell,
  .el-table__empty-text {
    color: #000000;
  }
}
@media print {
  // 文章样式
  .title {
    font-size: 26px;
    text-align: center;
  }
  .main_content {
    font-size: 16px;
    text-indent: 20px;
  }
}
</style>
