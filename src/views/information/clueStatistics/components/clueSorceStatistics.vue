<template>
  <section>
    <el-row>
      <el-col :span="12" v-if="currentStatus === 'time'">
        <el-button type="info" :disabled="dayDisabled" @click="handleClickDimension('1')" :class="timeDimensionType === '1' ? 'currentItem' : ''">按天</el-button>
        <el-button type="info" :disabled="monthDisabled" @click="handleClickDimension('2')" :class="timeDimensionType === '2' ? 'currentItem' : ''">>按自然月</el-button>
        <el-button type="info" :disabled="statisticsMonthDisabled" @click="handleClickDimension('3')" :class="timeDimensionType === '3' ? 'currentItem' : ''">>按统计月</el-button>
        <el-button type="info" :disabled="quarterDisabled" @click="handleClickDimension('4')" :class="timeDimensionType === '4' ? 'currentItem' : ''">>按季</el-button>
        <el-button type="info" :disabled="yearDisabled" @click="handleClickDimension('5')" :class="timeDimensionType === '5' ? 'currentItem' : ''">>按年</el-button>
      </el-col>
      <el-col :span="currentStatus === 'time' ? 12 : 24" >
        <div class="changeChart">
          <div :class="['changeChartItem', currentStatus === 'time' ? 'currentItem' : '']" @click="handleClickTime">时间</div>
          <div :class="['changeChartItem', currentStatus === 'sorce' ? 'currentItem' : '', sorceDisabled ? 'disabledChange' : '']" @click="handleClickSorce">来源</div>
        </div>
      </el-col>
      <el-col :span="24">
        <el-card class="statisticsArea" v-show="currentStatus === 'time'" v-loading="loadingLine">
          <clue-sorce-line-chart :chartTitle="lineChartTitle" :chartData="lineChartData" ref="clueSorceLineChartRef"></clue-sorce-line-chart>
        </el-card>
        <el-card class="statisticsArea" v-show="currentStatus === 'sorce'" v-loading="loadingPie">
          <clue-sorce-pie-chart :chartTitle="pieChartTitle" :chartData="pitChartData" :chartSeriesName="pieChartName" ref="clueSorcePieRef"></clue-sorce-pie-chart>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import clueSorcePieChart from './chartPie'
import clueSorceLineChart from './chartLine'

export default {
  name: 'ClueSorceStatistics',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    clueSorcePieChart,
    clueSorceLineChart
  },
  data() {
    return {
      loadingLine: false,
      loadingPie: false,
      timeDimensionType: '1',
      currentStatus: 'time',
      lineChartTitle: '线索来源统计',
      lineChartData: {},
      pieChartName: '线索来源',
      pieChartTitle: '线索来源统计',
      pitChartData: {}
    }
  },
  watch: {
  },
  computed: {
    sorceDisabled() {
      if (this.data && this.data.clueSource !== '0') {
        return true
      } else {
        return false
      }
    },
    dayDisabled() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum < 91) {
          return false
        }
      }
      return true
    },
    monthDisabled() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum <= (365 * 3) && timeQuantum > 91) {
          return false
        }
      }
      return true
    },
    statisticsMonthDisabled() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum <= (365 * 3) && timeQuantum > 91) {
          return false
        }
      }
      return true
    },
    quarterDisabled() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum <= (365 * 3) && timeQuantum > 182) {
          return false
        }
      }
      return true
    },
    yearDisabled() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum > (365 * 3)) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    init() {
      this.currentStatus = 'time'
      this.initTimeDimensionType()
    },
    handleClickTime() {
      this.currentStatus = 'time'
      if (this.$refs.clueSorceLineChartRef) {
        this.$refs.clueSorceLineChartRef.resize()
      }
    },
    handleClickSorce() {
      if (!this.sorceDisabled) {
        this.currentStatus = 'sorce'
        if (this.$refs.clueSorcePieRef) {
          this.$refs.clueSorcePieRef.resize()
        }
      }
    },
    handleClickDimension(type) {
      if (this.timeDimensionType !== type) {
        this.timeDimensionType = type
        this.getLineData()
      }
    },
    getLineData() {
      this.loadingLine = true
      const param = {
        collectionDateStart: this.data.collectionTimestampStart,
        collectionDateEnd: this.data.collectionTimestampEnd
      }
      if (this.data.clueType !== '0') {
        param.clueType = this.data.clueType
      }
      if (this.data.clueSource !== '0') {
        param.clueSource = this.data.clueSource
      }
      param.timeDimensionType = this.timeDimensionType
      this.lineChartDataReset()
      this.$query('clueStatistics/bySourceAndDate', param).then(response => {
        this.loadingLine = false
        if (response.code === '000000') {
          this.lineChartData = {
            legendData: response.data.legendData,
            seriesData: response.data.seriesData,
            xAxisData: response.data.xData
          }
        }
      }).catch(() => {
        this.loadingLine = false
      })
    },
    getPiedata() {
      this.loadingPie = true
      const param = {
        collectionDateStart: this.data.collectionTimestampStart,
        collectionDateEnd: this.data.collectionTimestampEnd
      }
      if (this.data.clueSource !== '0') {
        param.clueSource = this.data.clueSource
      }
      this.pieChartDataReset()
      this.$query('clueStatistics/bySource', param).then(response => {
        this.loadingPie = false
        if (response.code === '000000') {
          this.pitChartData = {
            seriesData: response.data.seriesData,
            legendData: response.data.legendData
          }
        }
      }).catch(() => {
        this.loadingPie = false
      })
    },
    refresh() {
      this.currentStatus = 'time'
      this.initTimeDimensionType()
      this.getLineData()
      if (!this.sorceDisabled) {
        // 执行请求饼图数据
        this.getPiedata()
      }
    },
    initTimeDimensionType() {
      if (this.data && this.data.collectionTimestampStart && this.data.collectionTimestampEnd) {
        const timeQuantum = (this.data.collectionTimestampEnd - this.data.collectionTimestampStart) / (1000 * 60 * 60 * 24)
        if (timeQuantum > 0 && timeQuantum < 91) {
          this.timeDimensionType = '1'
        } else if (timeQuantum > 0 && timeQuantum <= 365 && timeQuantum > 91) {
          this.timeDimensionType = '2'
        } else if (timeQuantum > 0 && timeQuantum <= (365 * 3) && timeQuantum > 365) {
          this.timeDimensionType = '4'
        } else if (timeQuantum > 0 && timeQuantum > (365 * 3)) {
          this.timeDimensionType = '5'
        }
      }
    },
    lineChartDataReset() {
      this.lineChartData = {
        legendData: [],
        seriesData: [],
        xAxisData: []
      }
    },
    pieChartDataReset() {
      this.pitChartData = {
        seriesData: [],
        legendData: []
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.changeChart {
  display: flex;
  justify-content: flex-end;
}
.changeChart div:last-child {
  border-right: 1px #00a0e9 solid;
}
.changeChartItem {
  width: 60px;
  border-top: 1px #00a0e9 solid;
  border-bottom: 1px #00a0e9 solid;
  border-left: 1px #00a0e9 solid;
  text-align: center;
  &:hover {
    background: #00a0e9;
    cursor: pointer;
  }
}
.currentItem {
  background: #00a0e9;
}
.disabledChange {
  background: none;
  &:hover {
    cursor: not-allowed;
  }
}
.statisticsArea {
  width: 100%;
  margin-top: 10px;
  background: white;
}
</style>
