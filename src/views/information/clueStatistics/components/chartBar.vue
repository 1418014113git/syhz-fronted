<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartBar',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    chartData: {
      type: Object,
      required: true
    },
    chartTitle: {
      type: String,
      default: '统计图'
    }
  },
  components: {},
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (val.seriesData && val.legendData && val.xAxisData) {
          this.setOptions()
        }
      }
    }
  },
  computed: {
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$el)
      if (this.chartData.seriesData && this.chartData.legendData && this.chartData.xAxisData) {
        this.setOptions()
      }
    },
    setOptions() {
      if (this.chart) {
        this.chart.setOption({
          title: {
            text: this.chartTitle
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: this.chartData.legendData
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.chartData.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false
              }
            }
          ],
          series: this.chartData.seriesData
        }, true)
      }
    },
    resize() {
      this.$nextTick(() => {
        this.chart.resize('auto', 'auto')
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
