<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-card class="statisticsArea" v-loading="loadingNestPie">
          <chart-nest-pie :chartTitle="nestPieChartTitle" :chartData="nestPieChartData" :chartSeriesName="nestPieChartName" ref="chartNestPieRef"></chart-nest-pie>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import chartNestPie from './chartNestPie'
export default {
  name: 'ClueAreaPie',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    chartNestPie
  },
  data() {
    return {
      loadingNestPie: false,
      nestPieChartTitle: '线索区域统计',
      nestPieChartName: '线索区域',
      legendDataTemp: ['环境', '食品', '药品', '综合', '上级转交', '行政部门转交', '嫌疑人供述', '摸排走访', '举报'],
      nestPieChartData: {
        seriesData: {
          in: [],
          out: []
        },
        legendData: []
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
      if (this.data.collectionAreaCode !== '0') {
        if (this.data.clueType === '0' || this.data.clueSource === '0') {
          this.getNestPieData(this.data)
        }
      }
    },
    getNestPieData(data) {
      this.loadingNestPie = true
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
      param.collectionArea = data.collectionAreaCode
      this.chartDataReset()
      this.$query('clueStatistics/bySingleArea', param).then(response => {
        this.loadingNestPie = false
        if (response.code === '000000') {
          this.nestPieChartData = {
            legendData: response.data.legendData ? response.data.legendData : this.legendDataTemp,
            seriesData: {
              in: response.data.seriesData[0],
              out: response.data.seriesData[1]
            }
          }
          this.$refs.chartNestPieRef.resize()
        }
      }).catch(() => {
        this.loadingNestPie = false
      })
    },
    chartDataReset() {
      this.nestPieChartData = {
        seriesData: {
          in: [],
          out: []
        },
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
.statisticsArea {
  width: 100%;
  margin-top: 10px;
  background: white;
}
</style>
