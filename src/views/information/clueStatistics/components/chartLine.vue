<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'ChartLine',
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
            text: this.chartTitle,
            textStyle: {
              color: '#ddd'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.chartData.legendData,
            textStyle: {
              color: '#ddd'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                backgroundColor: '#013a58',
                iconStyle: {
                  borderColor: '#ddd'
                }
              }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.chartData.xAxisData,
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            }
          },
          dataZoom: {
            type: 'slider',
            textStyle: {
              color: '#ddd'
            },
            show: this.chartData.xAxisData.length > 12,
            xAxisIndex: [0],
            bottom: -5,
            start: 0,
            end: Math.floor((12 / this.chartData.xAxisData.length) * 100) - 2
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            }
          },
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
