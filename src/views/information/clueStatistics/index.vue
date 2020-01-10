<template>
  <section class="clueStatistics">
    <el-card>
      <el-form :model="searchData" ref="searchDataForm" :inline="true" size="small">
        <el-form-item label="采集日期">
          <el-select v-model="selectDate" @change="handleChangeDate">
            <el-option v-for="item in selectDateMap" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-date-picker v-model="searchData.collectionDateStart" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :readonly="collectionDateReadonly" :picker-options="startDatePicker"></el-date-picker>
          <el-date-picker v-model="searchData.collectionDateEnd" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :readonly="collectionDateReadonly" :picker-options="endDatePicker"></el-date-picker>
        </el-form-item>
        <el-form-item label="线索分类">
          <el-select v-model="searchData.clueType">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="item in $getDicts('xsfl')" :label="item.dictName" :value="item.dictKey" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线索来源">
          <el-select v-model="searchData.clueSource">
            <el-option label="全部" value="0"></el-option>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('xsly')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集区域">
          <el-select v-model="searchData.collectionArea" value-key="cityCode" v-if="collectionAreaDisabled">
            <el-option v-for="item in areaList" :key="item.cityCode" :value="item" :label="item.cityName"></el-option>
          </el-select>
          <el-input v-model="searchData.collectionArea.cityName" :readonly="true" v-else></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleClickSearch">查询</el-button>
          <el-button type="primary" @click="handleClickReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="cardInterval">
      <el-row>
        <el-col :span="24">
          <span>{{ tipTextMap.collectionDateStart + '至' + tipTextMap.collectionDateEnd + 
            '，采集分类为“' + tipTextMap.clueTypeText + 
            '”、来源为“' + tipTextMap.clueSourceText + 
            '”、区域为“' + tipTextMap.collectionAreaText +
            '”的线索共计：' + tipTextMap.clueTotal + '条！' }}</span>
        </el-col>
        <el-col :span="24" class="statisticsArea">
          <clue-type-statistics :data="tipTextMap" ref="clueTypeStatisticsRef"></clue-type-statistics>
        </el-col>
        <el-col :span="24" class="statisticsArea">
          <clue-sorce-statistics :data="tipTextMap" ref="clueSorceStatisticsRef"></clue-sorce-statistics>
        </el-col>
        <el-col :span="24" class="statisticsArea" v-show="showHistogramStatistics && showClueAreaStatisticsByArea">
          <clue-area-histogram :data="tipTextMap" ref="clueAreaHistogramRef"></clue-area-histogram>
        </el-col>
        <el-col :span="24" class="statisticsArea" v-show="showClueAreaStatisticsByOneArea">
          <clue-area-pie :data="tipTextMap" ref="clueAreaPieRef"></clue-area-pie>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import clueTypeStatistics from './components/clueTypeStatistics'
import clueSorceStatistics from './components/clueSorceStatistics'
import clueAreaHistogram from './components/clueAreaHistogram'
import clueAreaPie from './components/clueAreaPie'

export default {
  name: 'ClueStatistics',
  props: {},
  components: {
    clueTypeStatistics,
    clueSorceStatistics,
    clueAreaHistogram,
    clueAreaPie
  },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      selectDateMap: [],
      selectDate: '1',
      areaList: [],
      collectionDateReadonly: true,
      collectionAreaDisabled: false,
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      searchData: {
        collectionDateStart: '', // 采集日期开始
        collectionDateEnd: '', // 采集日期结束
        clueType: '0', // 线索分类
        clueSource: '0', // 线索来源
        collectionArea: { cityCode: '0', cityName: '——' } // 采集区域
      },
      tipTextMap: {
        collectionTimestampStart: '', // 采集日期开始时间戳
        collectionTimestampEnd: '', // 采集日期结束时间戳
        collectionDateStart: '', // 采集日期开始
        collectionDateEnd: '', // 采集日期结束
        clueTypeText: '', // 线索分类
        clueSourceText: '', // 线索来源
        clueType: '', // 线索分类
        clueSource: '', // 线索来源
        collectionAreaText: '', // 选中行政区划名称
        collectionAreaCode: '', // 选中行政区划Code
        collectionArea: [], // 选中行政区划的子一级行政区划
        clueTotal: 0
      }
    }
  },
  watch: {
  },
  computed: {
    showHistogramStatistics() {
      if (this.deptInfo.depType === '1' || this.deptInfo.depType === '2') {
        return true
      }
      return false
    },
    showClueAreaStatisticsByArea() {
      if (this.tipTextMap.collectionAreaCode === '0') {
        return true
      }
      return false
    },
    showClueAreaStatisticsByOneArea() {
      if (this.tipTextMap.collectionAreaCode !== '0') {
        if (this.tipTextMap.clueType === '0' || this.tipTextMap.clueSource === '0') {
          return true
        }
      }
      return false
    }
  },
  methods: {
    init() {
      const date = new Date()
      this.initSearchData(date)
      this.initSelectDateMap(date)
      if (this.deptInfo && (this.deptInfo.depType === '1' || this.deptInfo.depType === '2')) {
        this.collectionAreaDisabled = true
      }
      this.getArea()
    },
    handleClickSearch() {
      if (!this.searchData.collectionDateStart || !this.searchData.collectionDateEnd) {
        this.$message({
          message: '请选择采集日期',
          type: 'warning'
        })
        return
      }
      this.updataTipTextContent()
      this.loadStatisticsData()
    },
    handleClickReset() {
      const date = new Date()
      this.$refs.searchDataForm.resetFields()
      this.initSearchData(date)
    },
    handleChangeDate(data) {
      this.collectionDateReadonly = true
      const date = new Date()
      switch (data) {
        case '1':
          this.searchData.collectionDateStart = this.getMonthStartDate(date)
          this.searchData.collectionDateEnd = this.getMonthNowDate()
          break
        case '2':
          this.searchData.collectionDateStart = this.getQuarterStartDate(date)
          this.searchData.collectionDateEnd = this.getMonthNowDate()
          break
        case '3':
          this.searchData.collectionDateStart = this.getFirstHalfYearStartDate(date)
          if (data.getMonth() >= 6) {
            this.searchData.collectionDateEnd = this.getMonthNowDate()
          } else {
            this.searchData.collectionDateEnd = this.getFirstHalfYearEndDate(date)
          }
          break
        case '4':
          this.searchData.collectionDateStart = this.getSecondHalfYearStartDate(date)
          this.searchData.collectionDateEnd = this.getMonthNowDate()
          break
        case '5':
          this.searchData.collectionDateStart = this.getYearStartDate(date)
          this.searchData.collectionDateEnd = this.getMonthNowDate()
          break
        case '6':
          this.collectionDateReadonly = false
          break
        default:
          break
      }
    },
    initSearchData(date) {
      this.searchData.clueType = '0'
      this.searchData.clueSource = '0'
      this.selectDate = '1'
      this.clueTotal = 0
      this.collectionDateReadonly = true
      this.searchData.collectionDateStart = this.getMonthStartDate(date)
      this.searchData.collectionDateEnd = this.getMonthNowDate()
      if (this.deptInfo && (this.deptInfo.depType === '1' || this.deptInfo.depType === '2')) {
        this.searchData.collectionArea = { cityCode: '0', cityName: '全部' }
      }
    },
    getArea() {
      this.areaList = []
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          if (this.deptInfo && (this.deptInfo.depType === '1' || this.deptInfo.depType === '2')) {
            this.areaList.push({ cityCode: '0', cityName: '全部' })
            this.findTheSpecifiedArea(response.data)
            this.areaList.push({ cityCode: '-1', cityName: '其他' })
          } else {
            this.findAreaInfo(response.data)
            this.searchData.collectionArea = this.areaList[0]
            this.$nextTick(() => {
              this.searchData.collectionArea = this.areaList[0]
              this.tipTextMap.collectionAreaCode = this.searchData.collectionArea.cityCode
              this.tipTextMap.collectionAreaText = this.searchData.collectionArea.cityName
            })
          }
          this.updataTipTextContent()
          this.loadStatisticsData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 查找登录用户所在行政区划的子一级行政区划
    findTheSpecifiedArea(areaList) {
      if (areaList && areaList.length > 0) {
        for (let index = 0; index < areaList.length; index++) {
          if (areaList[index].parentId === this.deptInfo.areaCode) {
            this.areaList.push(areaList[index])
          } else {
            this.findTheSpecifiedArea(areaList[index].children)
          }
        }
      }
    },
    // 查找登录用户所在行政区划
    findAreaInfo(areaList) {
      if (areaList && areaList.length > 0) {
        for (let index = 0; index < areaList.length; index++) {
          if (areaList[index].cityCode === this.deptInfo.areaCode) {
            this.areaList.push(areaList[index])
          } else {
            this.findAreaInfo(areaList[index].children)
          }
        }
      }
    },
    // 格式化日期：yyyy-MM-dd
    formatDate(date) {
      const myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return (myyear + '-' + mymonth + '-' + myweekday)
    },
    // 获得本季度的开始月份
    getQuarterStartMonth(theMonth) {
      let quarterStartMonth = 0
      if (theMonth < 3) {
        quarterStartMonth = 0
      }
      if (theMonth > 2 && theMonth < 6) {
        quarterStartMonth = 3
      }
      if (theMonth > 5 && theMonth < 9) {
        quarterStartMonth = 6
      }
      if (theMonth > 8) {
        quarterStartMonth = 9
      }
      return quarterStartMonth
    },
    // 获得某月的天数
    getMonthDays(theYear, theMonth) {
      const monthStartDate = new Date(theYear, theMonth, 1)
      const monthEndDate = new Date(theYear, theMonth + 1, 1)
      const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    },
    // 获得本月的开始日期
    getMonthStartDate(date) {
      const nowYear = date.getFullYear()
      const nowMonth = date.getMonth()
      const monthStartDate = new Date(nowYear, nowMonth, 1)
      return this.formatDate(monthStartDate)
    },
    // 获得本月的当前日期
    getMonthNowDate() {
      return this.formatDate(new Date())
    },
    // 获得本季度的开始日期
    getQuarterStartDate(date) {
      const nowYear = date.getFullYear()
      const nowMonth = date.getMonth()
      const quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(nowMonth), 1)
      return this.formatDate(quarterStartDate)
    },
    // 获得本季度的结束日期
    getQuarterEndDate(date) {
      const nowYear = date.getFullYear()
      const quarterEndMonth = this.getQuarterStartMonth() + 2
      const quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(nowYear, quarterEndMonth))
      return this.formatDate(quarterStartDate)
    },
    // 获得上半年的开始日期
    getFirstHalfYearStartDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 0, 1)
      return this.formatDate(quarterStartDate)
    },
    // 获得上半年的结束日期
    getFirstHalfYearEndDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 5, 30)
      return this.formatDate(quarterStartDate)
    },
    // 获得下半年的开始日期
    getSecondHalfYearStartDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 6, 1)
      return this.formatDate(quarterStartDate)
    },
    // 获得下半年的结束日期
    getSecondHalfYearEndDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 11, 31)
      return this.formatDate(quarterStartDate)
    },
    // 获得全年的开始日期
    getYearStartDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 0, 1)
      return this.formatDate(quarterStartDate)
    },
    // 获得全年的结束日期
    getYearEndDate(date) {
      const nowYear = date.getFullYear()
      const quarterStartDate = new Date(nowYear, 11, 31)
      return this.formatDate(quarterStartDate)
    },
    initSelectDateMap(date) {
      this.selectDateMap.push({ label: '本月', value: '1' })
      this.selectDateMap.push({ label: '本季', value: '2' })
      this.selectDateMap.push({ label: '上半年', value: '3' })
      const nowMonth = date.getMonth()
      if (nowMonth >= 6) {
        this.selectDateMap.push({ label: '下半年', value: '4' })
      }
      this.selectDateMap.push({ label: '本年', value: '5' })
      this.selectDateMap.push({ label: '自定义', value: '6' })
    },
    beginDate() {
      const _this = this
      return {
        disabledDate(time) {
          if (_this.searchData.collectionDateEnd) {
            const collectionDateEndTemp = _this.searchData.collectionDateEnd.replace(/-/g, '/')
            const collectionTimestampEnd = Date.parse(collectionDateEndTemp + ' 00:00:00')
            return collectionTimestampEnd < time.getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    processDate() {
      const _this = this
      return {
        disabledDate(time) {
          if (_this.searchData.collectionDateStart) {
            const collectionDateStartemp = _this.searchData.collectionDateStart.replace(/-/g, '/')
            const collectionTimestampStart = Date.parse(collectionDateStartemp + ' 00:00:00')
            if (collectionTimestampStart < time.getTime() && time.getTime() < Date.now()) {
              return false
            } else {
              return true
            }
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    dateStart2Timestamp() {
      if (this.searchData.collectionDateStart) {
        const collectionDateStartTemp = this.searchData.collectionDateStart.replace(/-/g, '/')
        return Date.parse(collectionDateStartTemp + ' 00:00:00')
      } else {
        return ''
      }
    },
    dateEnd2Timestamp() {
      if (this.searchData.collectionDateEnd) {
        const collectionDateEndTemp = this.searchData.collectionDateEnd.replace(/-/g, '/')
        return Date.parse(collectionDateEndTemp + ' 23:59:59')
      } else {
        return ''
      }
    },
    updataTipTextContent() {
      this.tipTextMap.collectionDateStart = this.searchData.collectionDateStart ? this.searchData.collectionDateStart : '——'
      this.tipTextMap.collectionDateEnd = this.searchData.collectionDateEnd ? this.searchData.collectionDateEnd : '——'
      this.tipTextMap.clueTypeText = this.searchData.clueType === '0' ? '全部' : this.$getDictName(this.searchData.clueType, 'xsfl')
      this.tipTextMap.clueSourceText = this.searchData.clueSource === '0' ? '全部' : this.$getDictName(this.searchData.clueSource, 'xsly')
      this.tipTextMap.collectionTimestampStart = this.dateStart2Timestamp()
      this.tipTextMap.collectionTimestampEnd = this.dateEnd2Timestamp()
      this.tipTextMap.clueType = this.searchData.clueType
      this.tipTextMap.clueSource = this.searchData.clueSource
      this.tipTextMap.collectionAreaCode = this.searchData.collectionArea.cityCode
      this.tipTextMap.collectionAreaText = this.searchData.collectionArea.cityName
      this.tipTextMap.collectionArea = this.areaList
    },
    loadStatisticsData() {
      if (this.$refs.clueTypeStatisticsRef) {
        this.$refs.clueTypeStatisticsRef.refresh()
      }
      if (this.$refs.clueSorceStatisticsRef) {
        this.$refs.clueSorceStatisticsRef.refresh()
      }
      if (this.$refs.clueAreaHistogramRef) {
        this.$refs.clueAreaHistogramRef.refresh()
      }
      if (this.$refs.clueAreaPieRef) {
        this.$refs.clueAreaPieRef.refresh()
      }
      this.getTotal()
    },
    getTotal() {
      const param = {
        collectionDateStart: this.tipTextMap.collectionTimestampStart,
        collectionDateEnd: this.tipTextMap.collectionTimestampEnd
      }
      if (this.tipTextMap.clueType !== '0') {
        param.clueType = this.tipTextMap.clueType
      }
      if (this.tipTextMap.clueSource !== '0') {
        param.clueSource = this.tipTextMap.clueSource
      }
      this.$query('clueStatistics/total', param).then(response => {
        if (response.code === '000000') {
          this.tipTextMap.clueTotal = response.data.total
        } else {
          this.tipTextMap.clueTotal = 0
        }
      }).catch(() => {
        this.tipTextMap.clueTotal = 0
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cardInterval {
  margin-top: 20px;
}
.statisticsArea {
  width: 100%;
  height: 600px;
  margin-top: 10px;
}
</style>
