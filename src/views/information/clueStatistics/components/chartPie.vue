<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'chartPie',
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
    },
    chartSeriesName: {
      type: String,
      default: ''
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
        if (val.seriesData && val.legendData) {
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
      if (this.chartData.seriesData && this.chartData.legendData) {
        this.setOptions()
      }
    },
    setOptions() {
      if (this.chart) {
        this.chart.setOption({
          title: {
            text: this.chartTitle,
            left: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: '40',
            data: this.chartData.legendData
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: this.chartSeriesName,
              type: 'pie',
              radius: '65%',
              label: {
                formatter: '{title|{b}}{abg|}\n{num|数量}{num|占比}\n {hr|}\n {per|{c}}{per|{d}%}',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  title: {
                    color: '#eee',
                    align: 'center'
                  },
                  abg: {
                    backgroundColor: '#333',
                    width: '100%',
                    align: 'right',
                    height: 22,
                    borderRadius: [4, 4, 0, 0]
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    align: 'center',
                    color: 'red',
                    padding: [0, 20, 0, 30],
                    borderRadius: 1
                  },
                  num: {
                    color: '#333',
                    width: 20,
                    height: 10,
                    padding: [0, 30, 10, 35],
                    align: 'center'
                  }
                }
              },
              data: this.chartData.seriesData
            }
          ]
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
