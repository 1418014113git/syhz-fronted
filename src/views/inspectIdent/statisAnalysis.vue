<template>
  <!--检验鉴定统计分析-->
  <div class="case-trend">
    <el-card shadow="never" v-for="item in chartData" :key="item.id" class="card">
      <div :id="item.id" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'statisAnalysis',
  data() {
    return {
      chartColumn: null,
      chartBar: null,
      chartData: [
        { 'id': 'chartColumn1' },
        { 'id': 'chartColumn2' }
      ],
      citys: ['西安市', '宝鸡市', '咸阳市', '铜川市', '渭南市', '延安市', '榆林市', '汉中市', '安康市', '商洛市'],
      natureNum: [{
        value: 21,
        name: '西安市'
      },
      {
        value: 18,
        name: '宝鸡市'
      },
      {
        value: 15,
        name: '咸阳市'
      },
      {
        value: 22,
        name: '铜川市'
      },
      {
        value: 28,
        name: '渭南市'
      },
      {
        value: 18,
        name: '延安市'
      },
      {
        value: 19,
        name: '榆林市'
      },
      {
        value: 23,
        name: '汉中市'
      },
      {
        value: 32,
        name: '安康市'
      },
      {
        value: 24,
        name: '商洛市'
      }
      ],
      cityNum: [21, 18, 15, 22, 28, 18, 19, 23, 32, 24]
    }
  },
  methods: {
    init() {
      this.drawColumnChart() // 检验鉴定统计分析柱状图
      this.pieChart() // 检验鉴定统计分析饼状图
    },
    drawColumnChart() { // 检验鉴定统计分析柱状图
      this.chartColumn = echarts.init(document.getElementById('chartColumn1'))
      this.chartColumn.setOption({
        title: {
          text: '检验鉴定统计分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 14
          },
          data: this.citys,
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          },
          nameTextStyle: {
            fontSize: 14
          }
        },
        barMaxWidth: 30,
        yAxis: {
          type: 'value',
          name: '数量',
          boundaryGap: ['0', '10%'],
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          },
          nameTextStyle: {
            fontSize: 14
          }
        },
        series: [{
          name: '数量',
          type: 'bar',
          data: this.cityNum,
          // color: '#b95ff9',
          // 配置柱子颜色
          itemStyle: {
            normal: {
              // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function(params) {
                var colorList = ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      })
    },
    pieChart() { // 检验鉴定统计分析饼状图
      this.chartPie = echarts.init(document.getElementById('chartColumn2'))
      this.chartPie.setOption({
        color: ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '检验鉴定统计分析',
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
          data: this.citys,
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
            data: this.natureNum,
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
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style scoped>
.case-trend .card {
  margin-top: 20px;
}
</style>
