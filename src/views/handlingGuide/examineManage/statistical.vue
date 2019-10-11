<template>
  <div class="case-claim">
    <el-card style="margin-bottom: 10px;">
      <el-form :inline="true" :model="filterQuery" label-width="84px">
        <el-form-item label="发布单位"  prop="deptRange">
          <el-select v-model="filterQuery.deptRange" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="省厅" value="1"></el-option>
            <el-option label="地市" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试名称"  prop="examinationName">
          <el-input v-model="filterQuery.examinationName" clearable maxlength="20" placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="考试日期" prop="startTime">
          <el-date-picker v-model="filterQuery.startDate" type="date" value-format="yyyy-MM-dd" :picker-options="startPickerOptions" placeholder="请选择开始时间" @change="startDateChange"></el-date-picker>
          <el-date-picker v-model="filterQuery.endDate" type="date"  value-format="yyyy-MM-dd" :picker-options="endPickerOptions" placeholder="请选择结束时间" :disabled="endDateDisabled"  @change="endDateChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="筛选类型">
          <el-select v-model="filterQuery.type" filterable clearable placeholder="请选择" @change="filterTypeChange">
            <el-option label="本年" value="year"></el-option>
            <el-option label="本季" value="quarter"></el-option>
            <el-option label="本月" value="month"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryExamStatistical(true)">查询</el-button>
          <!-- <el-button type="primary" v-if="$isViewBtn('100401')" @click="reset">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <!--考试信息-->
    <el-card style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <span>考试统计&emsp;<el-button circle title="选中考试后，可按单条或多条考试信息统计地市考试情况！"><i class="el-icon-question"></i></el-button></span>
      </div>
      <el-table :data="examinations"  style="width: 100%;" :max-height="tableHeight" @selection-change="handleSelectionChange" v-loading="examLoading"
       show-summary>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="examinationName" label="考试名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalNum" label="应考人数" width="160" align="center">
        </el-table-column>
        <el-table-column prop="realNum" label="实考人数" width="160" align="center"></el-table-column>
        <el-table-column prop="y" label="优" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.y">{{scope.row.y}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column prop="l" label="良" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.l">{{scope.row.l}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column prop="z" label="中" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.z">{{scope.row.z}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column prop="c" label="差" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.c">{{scope.row.c}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.totalNum" class="canClick" @click="watchReport">考试报告</span> -->
            <el-button @click="watchReport(scope.$index, scope.row)" icon="el-icon-document" title="可生成查询结果汇总考试报告">考试报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar clearfix">
        <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                      :current-page="page" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>
    <!--地市统计-->
    <el-card style="margin-bottom: 10px;" v-loading="cityLoading">
      <div slot="header" class="clearfix">
        <span>地市考试统计</span>
      </div>
      <el-table :data="cityData"  style="width: 100%" :max-height="tableHeight" :row-class-name="getRowClass">
        <!-- :expand-row-keys="expends" -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.child" style="width: 100%;" max-height="400">
              <el-table-column prop="" label="" width="110px" style="opacity:0;"></el-table-column>
              <el-table-column prop="deptName" label="单位" min-width="25%"></el-table-column>
              <el-table-column prop="totalNum" label="应考总人数" width="160"></el-table-column>
              <el-table-column prop="realNum" label="实考总人数" width="160"></el-table-column>
              <el-table-column prop="y" label="优" width="100"> </el-table-column>
              <el-table-column prop="l" label="良" width="100"></el-table-column>
              <el-table-column prop="z" label="中" width="100"></el-table-column>
              <el-table-column prop="c" label="差" width="100"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" class-name="xuhao">
          <template slot-scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="地市" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ykNum" label="应考总人数" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skNum" label="实考总人数" width="160"></el-table-column>
        <el-table-column prop="yNum" label="优" width="100"></el-table-column>
        <el-table-column prop="lNum" label="良" width="100"></el-table-column>
        <el-table-column prop="zNum" label="中" width="100"></el-table-column>
        <el-table-column prop="cNum" label="差" width="100"></el-table-column>
      </el-table>
      <!-- 饼状图 -->
      <div class="clearfix" style="margin: 50px 0 80px;">
        <div id="echartScore" style="width: 49%; min-height: 400px; float:left;"></div>
        <div id="echartPerNum" style="width: 49%; min-height: 400px; float:right;"></div>
      </div>
      <!-- 柱状图 -->
      <div id="cityStatistical" style="min-height: 400px;"></div>
    </el-card>
    <!-- 考试报告 -->
    <el-dialog title="考试报告" :visible.sync="dialogReportVisible" size="small" @close="closeDia" class="reportDialog" width="60%">
      <test-report :examItem="currentExam" @isShowDialog="closeDia"></test-report>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import testReport from './testReport'
export default {
  name: 'examinationStatistical',
  data() {
    return {
      filterQuery: {
        deptCode: '',
        startDate: '',
        endDate: '',
        examinationName: '',
        type: ''
      },
      examinations: [], // 考试统计
      childCityData: [],
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
      cityData: [], // 盟市统计的
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
      echartScore: {},
      echartPerNum: {},
      cityStatistical: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      multipleSelection: [], // 选中的多行
      showEchart: false,
      dialogReportVisible: false, // 考试报告弹框
      currentExam: {}, // 当前点击的考试报告
      curDept: {} // 当前部门
    }
  },
  components: {
    testReport
  },
  methods: {
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
      this.cityLoading = true
      this.$query('examination/statisticsOne?examinationIds=' + examIdStr, param).then((response) => {
        if (response.code === '000000') {
          this.cityLoading = false
          this.cityData = response.data
          if (this.cityData.length > 0) {
            // this.showEchart = true
            for (let index = 0; index < this.cityData.length; index++) {
              var cityElement = this.cityData[index]
              cityElement.index = index
              cityElement.ykNum = 0 // 应考
              cityElement.skNum = 0 // 实考
              cityElement.yNum = 0
              cityElement.lNum = 0
              cityElement.zNum = 0
              cityElement.cNum = 0
              if (cityElement.child) {
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
    getRowClass({ row, rowIndex }) {
      // console.log(row)
      if (rowIndex === 0) {
        return 'row-sheng'
      } else {
        return ''
      }
    },
    handleCurrentChange(val) {
      alert(val) // 分页查询
      this.page = val
      this.queryExamStatistical()
    },
    handleSizeChange(val) { // 分条查询
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
      this.echartScore = echarts.init(document.getElementById('echartScore'))
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
      this.echartPerNum = echarts.init(document.getElementById('echartPerNum'))
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
      this.cityStatistical = echarts.init(document.getElementById('cityStatistical'))
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
    watchReport(index, row) { // 考试报告
      this.currentExam = row // 当前选中的考试
      this.dialogReportVisible = true
    },
    closeDia() {
      this.dialogReportVisible = false
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
    },
    linkAjrl(canClick, level, cityCode, deptId, deptCode, type) { // 跳转到案件认领列表
      if (!canClick) {
        return false
      }
      var param = {
        origin: 'statistical', // 表示从统计跳转过去的
        deptLevel: level, // 区分是一级还是二级
        cityCode: cityCode,
        deptCode: deptCode, // 当前点击的code
        curFirstLevelCode: this.curFirstLevelCode, // 展开一级的，有可能展开一级后点一级的跳转 所以不能用这个字段判断
        type: type, // 待认领...等
        yearDate: this.yearDate, // 筛选框的值
        quarterDate: this.quarterDate,
        monthDate: this.monthDate,
        queryType: this.filters.type,
        startTime: this.startTime,
        endTime: this.endTime,
        filtStartTime: this.filters.startTime, // 查询的参数，认领页面需要用到
        filtEndTime: this.filters.endTime
      }
      console.log(param)
      this.$gotoid('/caseManage/ajrl', JSON.stringify(param))
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    this.queryExamStatistical() // 考试统计
    // this.initStaticData()
    // if (sessionStorage.getItem(this.$route.path)) {
    //   var carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
    //   this.yearDate = carryParam.yearDate || '' // 筛选框的值
    //   this.quarterDate = carryParam.quarterDate || ''
    //   this.monthDate = carryParam.monthDate || ''
    //   this.filters.type = carryParam.queryType || ''
    //   this.startTime = carryParam.startTime || ''
    //   this.endTime = carryParam.endTime || ''
    //   this.yearChange(this.yearDate)
    //   this.quarterChange(this.quarterDate)
    //   this.monthChange(this.monthDate)
    //   if (this.filters.type) {
    //     this.queryByType(this.filters.type)
    //   }
    //   this.startDateChange(this.startTime)
    //   this.endDateChange(this.endTime)
    // } else {
    //   // 需求176 默认查询本年度
    //   var curYear = new Date().getFullYear() + ''
    //   this.yearDate = curYear
    //   this.yearChange(curYear)
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.case-trend .card {
  margin-bottom: 20px;
}
.case-claim .el-table__expanded-cell {
  width: 500px;
  margin-left: 100px;
  padding: 0;
}
.canClick {
  cursor: pointer;
}
.canClick:hover {
  text-decoration: underline;
}
.el-table .row-sheng .cell .el-table__expand-icon {
  display: none;
}
.el-table .row-sheng .xuhao {
  // 如果用display none 隐藏了 会整行往左移
  opacity: 0;
}
.reportDialog {
  .el-dialog {
    background: #ffffff;
    border: 1px solid #bebebe;
  }
  .el-dialog__header {
    border-bottom: 2px solid #aaaaaa;
    .el-dialog__title {
      color: #000000;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #000000;
    }
  }
  .el-dialog__body {
    background: #ffffff;
    color: #000000;
  }
}
</style>
