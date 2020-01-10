<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'chartNestPie',
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
        if (val.seriesData && val.seriesData.in && val.seriesData.out && val.legendData) {
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
      if (this.chartData.seriesData && this.chartData.seriesData.in && this.chartData.seriesData.out && this.chartData.legendData) {
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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
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
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: this.chartSeriesName,
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                position: 'inner'
              },
              labelLine: {
                show: false
              },
              data: this.chartData.seriesData.in
            },
            {
              name: this.chartSeriesName,
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
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
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: this.chartData.seriesData.out
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
