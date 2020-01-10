<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-card class="statisticsArea" v-loading="loadingBar">
          <chart-bar :chartTitle="barChartTitle" :chartData="barChartData" ref="chartAreaBarRef"></chart-bar>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import chartBar from './chartBar'

export default {
  name: 'ClueAreaHistogram',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    chartBar
  },
  data() {
    return {
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      loadingBar: false,
      barChartTitle: '线索区域统计',
      legendDataTemp: ['环境', '食品', '药品', '综合', '上级转交', '行政部门转交', '嫌疑人供述', '摸排走访', '举报'],
      barChartData: {
        legendData: [],
        seriesData: [],
        xAxisData: []
      }
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    init() {
    },
    refresh() {
      if (this.deptInfo.depType === '1' || this.deptInfo.depType === '2') {
        if (this.data && this.data.collectionAreaCode === '0' && this.data.collectionArea && this.data.collectionArea.length > 0) {
          this.getBarData(this.data)
        }
      }
    },
    getBarData(data) {
      this.loadingBar = true
      const param = {
        collectionDateStart: data.collectionTimestampStart,
        collectionDateEnd: data.collectionTimestampEnd
      }
      if (data.clueType !== '0') {
        param.clueType = data.clueType
      }
      if (data.clueSource !== '0') {
        param.clueSource = data.clueSource
      }
      const collectionChildAreaList = []
      if (data.collectionAreaCode !== '0') {
        if (data.collectionAreaCode !== '-1') {
          collectionChildAreaList.push({
            cityCode: data.collectionAreaCode,
            cityName: data.collectionAreaText
          })
        }
      } else {
        for (const index in data.collectionArea) {
          const item = data.collectionArea[index]
          if (item && item.cityCode !== '0' && item.cityCode !== '-1') {
            collectionChildAreaList.push({
              cityCode: item.cityCode,
              cityName: item.cityName
            })
          }
        }
      }
      param.area = collectionChildAreaList
      this.chartDataReset()
      this.$update('clueStatistics/byArea', param).then(response => {
        this.loadingBar = false
        if (response.code === '000000') {
          this.barChartData = {
            legendData: response.data.legendData ? response.data.legendData : this.legendDataTemp,
            seriesData: response.data.seriesData,
            xAxisData: response.data.xData
          }
          this.$refs.chartAreaBarRef.resize()
        }
      }).catch(() => {
        this.loadingBar = false
      })
    },
    chartDataReset() {
      this.barChartData = {
        legendData: [],
        seriesData: [],
        xAxisData: []
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.statisticsArea {
  width: 100%;
  margin-top: 10px;
  background: white;
}
</style>
