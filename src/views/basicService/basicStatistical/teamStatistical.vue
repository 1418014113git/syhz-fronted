<template>
  <div class="deptStatistical">
    <!--考试信息-->
    <!-- <el-card style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <span>陕西省西安市公安局环食药侦支队_队伍基本情况</span>
      </div> -->
      <div style="margin: 10px 0;"><i class="el-icon-info"></i>&nbsp;&nbsp;队伍基本情况只统计到大队，杨凌示范区没有大队只统计到支队！</div>
      <el-table :data="teamData"  style="width: 100%;" :max-height="tableHeight"
      :row-class-name="getRowClassExam" v-loading="examLoading" class="table_th_center">
        <el-table-column type="expand" width="40">
          <template slot-scope="scope">
            <el-table :data="scope.row.child" style="border-left: none;" max-height="400">
              <!-- margin-left: 41px; -->
              <el-table-column type="index"  label="序号" align="center" width="40"></el-table-column>
              <el-table-column prop="totalNum" label="单位机构" align="center" :width="smallItemWidth+100"></el-table-column>
              <el-table-column prop="index" label="合计" width="60" align="center"></el-table-column>
              <el-table-column prop="examinationName" label="民警">
                <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="性别" align="center">
                  <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
                <el-table-column prop="totalNum" label="学历" align="center">
                  <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="examinationName" label="辅警">
                <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="性别" align="center">
                  <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
                <el-table-column prop="totalNum" label="学历" align="center">
                  <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="examinationName" label="工勤">
                <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
                <el-table-column prop="totalNum" label="性别" align="center">
                  <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
                <el-table-column prop="totalNum" label="学历" align="center">
                  <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
                  <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="totalNum" label="省市" :width="smallItemWidth+50" align="center"></el-table-column>
        <el-table-column prop="index" label="合计" width="60" align="center"></el-table-column>
        <el-table-column prop="examinationName" label="民警">
          <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="性别" align="center">
            <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="totalNum" label="学历" align="center">
            <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="examinationName" label="辅警">
          <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="性别" align="center">
            <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="totalNum" label="学历" align="center">
            <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="examinationName" label="工勤">
          <el-table-column prop="totalNum" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="平均年龄" width="60" align="center"></el-table-column>
          <el-table-column prop="totalNum" label="性别" align="center">
            <el-table-column prop="totalNum" label="男" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="女" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="totalNum" label="学历" align="center">
            <el-table-column prop="totalNum" label="研" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="本" :width="smallItemWidth" align="center"></el-table-column>
            <el-table-column prop="totalNum" label="专" :width="smallItemWidth" align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    <!-- </el-card> -->
    <!--地市统计-->
    <!-- <el-card style="margin-bottom: 10px;" v-loading="cityLoading">
      <div slot="header" class="clearfix">
        <span>陕西省西安市公安局环食药侦支队_相关人员及联系人</span>
      </div> -->
      <div style="margin: 30px 0 10px 0;">陕西省西安市公安局环食药侦支队_相关人员及联系人</div>
      <el-table :data="cityData"  style="width: 100%" :max-height="tableHeight" :row-class-name="getRowClass" class="table_th_center">
        <el-table-column type="index" label="主要负责人" width="100" class-name="xuhao">
          <template slot-scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="主要负责人职务" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ykNum" label="主要负责人联系方式" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skNum" label="日常联系人" width="160" align="center"></el-table-column>
        <el-table-column prop="yNum" label="日常联系人职务" width="200" align="center"></el-table-column>
        <el-table-column prop="lNum" label="日常联系人联系方式" min-width="100" align="center"></el-table-column>
      </el-table>
    <!-- </el-card> -->
    <el-card style="margin-bottom: 10px;" v-loading="cityLoading">
      <div slot="header" class="clearfix">
        <span>统计</span>
      </div>
      <!-- 饼状图 -->
      <div class="clearfix" style="margin: 50px 0 80px;" v-if="showEchart">
        <div id="echartScore" style="width: 49%; height: 400px; float:left;"></div>
        <div id="echartPerNum" style="width: 49%; height: 400px; float:right;"></div>
      </div>
      <!-- 柱状图 -->
      <div id="cityStatistical" style="height: 400px;" v-if="showEchart"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'examinationStatistical',
  data() {
    return {
      smallItemWidth: 70, // 表格最小格子的宽度
      filterQuery: {
        deptCode: [],
        startDate: '',
        endDate: '',
        examinationName: '',
        type: 'year' // 默认查本年
      },
      teamData: [], // 队伍统计
      childCityData: [],
      expandstab: [], // 设置当前的展开行
      caseData: [], // 市的列表数据
      // subDeptCaseData: [], // 下级部门列表数据
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
      systemTime: '', // 系统时间
      startDateDisabled: true, // 开始时间禁用
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
      currentExam: {}, // 当前点击的考试报告
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' },
      deptOptions: [], // 部门数据
      curDept: {} // 当前部门
    }
  },
  components: {
  },
  methods: {
    getSummaries(param) {
      // const sums = ['', '', '合计', '', '', '', '', '']
      // sums[3] = this.$thousSplit(this.totlaYrl + '')
      // sums[4] = this.$thousSplit(this.totalDrl + '')
      // sums[5] = this.$thousSplit(this.totalXf + '')
      // sums[6] = this.$thousSplit(this.totalZf + '')
      // sums[7] = this.$thousSplit(this.totalCx + '')
      // sums[8] = this.$thousSplit(this.totalAll + '')
      // return sums
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '总计'
          return
        }
        if (index === 9) {
          sums[index].innerHTML = '<el-button @click="watchReport(scope.$index, scope.row)" icon="el-icon-document" title="可生成查询结果汇总考试报告">考试报告</el-button>'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 2) { // 考试名称列
            sums[index] = ''
          } else {
            sums[index] = sums[index]
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    handleDeptChange(val) { // 发布单位
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
        this.selectCurTingDep = { name: '' }
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
    filterTypeChange(val) { // 考试日期修改类型change
      // if (val) {
      //   this.filterQuery.startDate = ''
      //   this.filterQuery.endDate = ''
      // }
      if (val === 'timePeriod') {
        this.startDateDisabled = false // 开始时间可编辑
        this.filterQuery.startDate = '' // 开始时间清空
        this.filterQuery.endDate = ''
      } else {
        this.startDateDisabled = true
        this.endDateDisabled = true
        this.buildTime()
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
      if (hand) { // 手动点击时，添加埋点参数
        this.filterQuery.logFlag = 1
      }
      if (this.filterQuery.type !== 'timePeriod') { // 时间段
        this.buildTime() // 页面上显示 年度/季度/月的时间
      }
      var param = {
        // deptRange: this.filterQuery.deptRange || '',
        startDate: this.filterQuery.startDate || '',
        endDate: this.filterQuery.endDate || '',
        examinationName: this.filterQuery.examinationName || '',
        year: this.filterQuery.type === 'year' ? true : '',
        quarter: this.filterQuery.type === 'quarter' ? true : '',
        month: this.filterQuery.type === 'month' ? true : '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      if (this.filterQuery.deptCode.length === 0) {
        param.deptCode = ''
      } else {
        param.deptCode = this.filterQuery.deptCode[this.filterQuery.deptCode.length - 1] // 最后一级的code
      }
      this.examLoading = true
      this.$query('examination/statistics', param).then((response) => {
        if (response.code === '000000') {
          this.examLoading = false
          var statisticData = response.data.list
          if (statisticData.length > 0) {
            // 计算合计,添加到表格的最后一行
            var pageTotalObj = { totalNum: 0, realNum: 0, y: 0, l: 0, z: 0, c: 0, isHj: true }
            statisticData.forEach((element, index) => {
              element.isHj = false // 是否是合计行的标志
              element.index = index + 1
              pageTotalObj.totalNum += Number(element.totalNum)
              pageTotalObj.realNum += element.realNum
              pageTotalObj.y += element.y
              pageTotalObj.l += element.l
              pageTotalObj.z += element.z
              pageTotalObj.c += element.c
            })
            statisticData.push(pageTotalObj)
          }
          this.examinations = statisticData
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
        // deptRange: this.filterQuery.deptRange || '',
        startDate: this.filterQuery.startDate || '',
        endDate: this.filterQuery.endDate || '',
        examinationName: this.filterQuery.examinationName || '',
        year: this.filterQuery.type === 'year' ? true : '',
        quarter: this.filterQuery.type === 'quarter' ? true : '',
        month: this.filterQuery.type === 'month' ? true : '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      if (this.filterQuery.deptCode.length === 0) {
        param.deptCode = ''
      } else {
        param.deptCode = this.filterQuery.deptCode[this.filterQuery.deptCode.length - 1] // 最后一级的code
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
    getRowClassExam({ row, rowIndex }) { // 考试统计
      if (row.isHj) {
        return 'row-hj'
      } else {
        return ''
      }
    },
    querySearchExam(queryString, cb) { // 考试名称关键字搜索
      var param = {
        examinationName: this.filterQuery.examinationName || ''
      }
      this.$query('examinationname', param).then((response) => {
        var restaurants = response.data
        restaurants.forEach(element => {
          element.value = element.examinationName
        })
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      })
    },
    handleSelectExam(item) {
      this.filterQuery.examinationName = item.examinationName
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    getSysTime() { // 系统时间
      this.examLoading = true
      this.$query('exam/systemTime').then(response => {
        this.systemTime = response.data
        this.queryExamStatistical() // 考试统计
      })
    },
    buildTime() {
      const systemDate = new Date(this.systemTime)
      let startTime = ''
      let endTime = ''
      if (this.filterQuery.type === 'year') { // 年度
        startTime = systemDate.getFullYear() + '-01-01 00:00:00'
        // const day = new Date(systemDate.getFullYear(), 12, 0)
        const day = new Date()
        endTime = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' 23:59:59'
      }
      if (this.filterQuery.type === 'quarter') { // 季度
        if (systemDate.getMonth() + 1 <= 3) {
          startTime = systemDate.getFullYear() + '-01-01 00:00:00'
          // endTime = systemDate.getFullYear() + '-03-31 23:59:59'
        } else if (systemDate.getMonth() + 1 > 3 && systemDate.getMonth() + 1 <= 6) {
          startTime = systemDate.getFullYear() + '-04-01 00:00:00'
          // endTime = systemDate.getFullYear() + '-06-30 23:59:59'
        } else if (systemDate.getMonth() + 1 > 6 && systemDate.getMonth() + 1 <= 9) {
          startTime = systemDate.getFullYear() + '-07-01 00:00:00'
          // endTime = systemDate.getFullYear() + '-09-30 23:59:59'
        } else if (systemDate.getMonth() + 1 > 9 && systemDate.getMonth() + 1 <= 12) {
          startTime = systemDate.getFullYear() + '-10-01 00:00:00'
          // endTime = systemDate.getFullYear() + '-12-31 23:59:59'
        }
        const day = new Date()
        endTime = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' 23:59:59'
      }
      if (this.filterQuery.type === 'month') { // 月
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-01 00:00:00'
        // const day = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0)
        const day = new Date()
        endTime = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + ' 23:59:59'
      }
      this.filterQuery.startDate = startTime
      this.filterQuery.endDate = endTime
      // return para
    },
    handleCurrentChange(val) {
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
        color: ['#23ce7b', '#537ff7', '#ffb337', '#f46470', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '考试成绩分析',
          subtext: '',
          x: 'center',
          // top: 10,
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
          bottom: 0,
          itemGap: 15,
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
            radius: ['0', '60%'],
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
          bottom: 0,
          itemGap: 15,
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
            radius: ['0', '60%'],
            // center: ['50%', '60%'],
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
          type: 'scroll',
          bottom: 0,
          itemGap: 15,
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
    startDateChange(val) { // 开始时间change事件
      if (val) {
        // this.filterQuery.type = ''
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
      if (row.isHj) { // 合计行的考试报告
        var hjArrIds = [] // 当前页的id
        for (let m = 0; m < this.examinations.length; m++) {
          const element = this.examinations[m]
          if (element.examinationId) {
            hjArrIds.push(element.examinationId)
          }
        }
        this.currentExam.hjIds = hjArrIds.join(',')
        this.currentExam.startDate = this.filterQuery.startDate // 开始时间
        this.currentExam.endDate = this.filterQuery.endDate // 截至时间
        this.currentExam.examNum = hjArrIds.length // 总数
        this.currentExam.startTitle = this.filterQuery.startDate.substr(0, 4) + '年' + this.filterQuery.startDate.substr(5, 2) + '月' + this.filterQuery.startDate.substr(8, 2) + '日'
        this.currentExam.endTitle = this.filterQuery.endDate.substr(0, 4) + '年' + this.filterQuery.endDate.substr(5, 2) + '月' + this.filterQuery.endDate.substr(8, 2) + '日'
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
      this.filterQuery = {
        deptCode: [],
        startDate: '',
        endDate: '',
        examinationName: '',
        type: 'year' // 默认查本年
      }
      // this.dateRange = []
      // this.yearDate = '' // 年份
      // this.quarterDate = '' // 季度
      // this.monthDate = '' // 月份
      // this.startTime = '' // 开始时间
      // this.endTime = '' // 结束时间
      this.queryExamStatistical(true)
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
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['depCode']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parentCode']]
        if (key && key.depType !== '4') { // 去掉派出所的层级
          if (!key['children']) {
            if (treeArray[i].depType !== '4') {
              key['children'] = []
              key['children'].push(treeArray[i])
            }
          } else {
            if (treeArray[i].depType !== '4') {
              key['children'].push(treeArray[i])
            }
          }
        } else {
          if (treeArray[i].depType !== '4') {
            r.push(treeArray[i])
          }
        }
      }
      return r
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    var dept = this.getTree(JSON.parse(sessionStorage.getItem('DeptSelect')))
    this.deptOptions = dept
    this.teamData = [{ 'totalNum': 1, 'child': [{ 'totalNum': 1 }] }, { 'totalNum': 2, 'child': [{ 'totalNum': 2 }] }]
    // this.teamData = [{ 'totalNum': 1 }, { 'totalNum': 2 }]
    // this.getSysTime()
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
.deptStatistical {
  .el-table__expanded-cell {
    // width: 500px;
    margin-left: 50px;
    padding: 0;
  }
  //修改表格边框颜色
  .el-table--border th {
    border-bottom: 1px solid #45758b;
    border-right: 1px solid #45758b;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #45758b;
  }
  .el-table--border td {
    // border-right: none;
    border-right: 1px solid #45758b;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
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
  pointer-events: none;
}
.el-table .row-hj .el-table-column--selection {
  // 合计行去掉 复选框
  opacity: 0;
  pointer-events: none;
}
.el-autocomplete-suggestion {
  border: 1px solid #00a0e9;
}
.el-autocomplete-suggestion__wrap {
  background-color: #005982 !important;
  border: 0 !important;
}
.el-autocomplete-suggestion li {
  color: #fff;
}
.el-autocomplete-suggestion.is-loading li:hover,
.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
</style>
