<template>
  <section class="chart-container">
    <!-- <div class="chartTit"><img src="/static/image/portal_newImg/ajzb.png" alt="">案件侦办地区分析</div> -->
    <el-carousel trigger="click" class="echart_carousel" :interval="interval">
      <el-carousel-item v-for="item in chartData" :key="item.id">
        <!-- <div v-for="item in chartData" :key="item.id" :id="item.id" style="width: 100%; height: 270px;"></div> -->
        <div class="chartTit"><img src="/static/image/portal_newImg/ajzb.png" alt="">{{item.title}}</div>
        <div :id="item.id"  style="width: 100%; height: 250px;"></div>
      </el-carousel-item>
    </el-carousel>
    <div v-if="chartData.length < 1" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
  </section>
</template>

<script>
import { getCaseTotalList, getMonthCaseTotalList, geWjWTotal } from '@/api/portal'
import echarts from 'echarts'
import {
  parseTime
} from '@/utils/index'

export default {
  name: 'EChart',
  data() {
    return {
      interval: 10000,
      id: null,
      chartColumn: null,
      wjwColumn: null,
      chartBar: null,
      chartData: [
        {
          'id': 'chartColumn', 'text': 'chart1', 'title': '案件侦办地区分析'
        },
        {
          'id': 'chartBar', 'text': 'chart2', 'title': '案件侦办走势分析'
        }
      ],
      citys: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市', '杨凌区', '西咸新区'],
      cityNum: [],
      year: [],
      yearNum: []
    }
  },
  methods: {
    caseTotalList() {
      const para = {}
      const pre = new Date()
      para.endTime = parseTime(pre, '{y}-{m}-{d}')
      pre.setFullYear(pre.getFullYear() - 1)
      para.startTime = parseTime(pre, '{y}-{m}-{d}')
      this.loading = true
      getCaseTotalList(para).then((response) => {
        const data = response.data
        const resM = {}
        data.forEach((item, index) => {
          resM[item.name] = item.num
        })
        for (let i = 0; i < this.citys.length; i++) {
          const c = this.citys[i]
          if (resM[c]) {
            this.cityNum[i] = resM[c]
          } else {
            this.cityNum[i] = 0
          }
        }
        this.drawColumnChart()
        this.loading = false
      })
    },
    monthCaseTotalList() {
      const para = {}
      const pre = new Date()
      para.endTime = parseTime(pre, '{y}-{m}-{d}')
      pre.setFullYear(pre.getFullYear() - 1)
      para.startTime = parseTime(pre, '{y}-{m}-{d}')
      const now = new Date()
      now.setFullYear(now.getFullYear() - 1)
      for (let i = 0; i < 12; i++) {
        now.setMonth(now.getMonth() + 1)
        this.year[i] = parseTime(now, '{y}-{m}')
      }
      this.loading = true
      getMonthCaseTotalList(para).then((response) => {
        const data = response.data
        const resM = {}
        data.forEach((item, index) => {
          const num = item.ajNum
          const month = item.dateStr
          if (num > 0) {
            resM[month] = num
          }
        })
        for (let i = 0; i < this.year.length; i++) {
          const c = this.year[i]
          if (resM[c]) {
            this.yearNum[i] = resM[c]
          } else {
            this.yearNum[i] = 0
          }
        }
        this.lineChart()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        title: {
          text: ''
        },
        tooltip: {},
        xAxis: {
          name: '城市',
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          nameTextStyle: {
            fontSize: 13
          },
          data: this.citys
        },
        barMaxWidth: 20,
        yAxis: {
          name: '案件数',
          boundaryGap: ['0', '10%'],
          nameGap: 18,
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          nameTextStyle: {
            fontSize: 13
          },
          splitLine: { show: false }
        },
        series: [{
          name: '案件',
          type: 'bar',
          data: this.cityNum,
          // color: '#b95ff9'
          itemStyle: {
            normal: {
              // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color(params) {
                var colorList = ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      })
      window.onresize = this.chartColumn.resize
    },
    lineChart() {
      const colors = ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8']
      this.chartBar = echarts.init(document.getElementById('chartBar'))
      this.chartBar.setOption({
        color: colors,
        title: {
          // text: '案件侦办走势分析'
        },
        xAxis: {
          name: '月份',
          type: 'category',
          data: this.year,
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          nameTextStyle: {
            fontSize: 13
          }
        },
        yAxis: {
          name: '案件数量',
          boundaryGap: ['0', '10%'],
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          nameTextStyle: {
            fontSize: 13
          }
        },
        series: [{
          name: '案件',
          data: this.yearNum,
          type: 'line'
        }]
      })
    },
    geWjWTotal() {
      geWjWTotal().then((res) => {
        if (res.code === '000000' && res.data) {
          const data = res.data
          const array = []
          array.push({
            value: data[0].num,
            name: '新生儿信息'
          })
          array.push({
            value: data[1].num,
            name: '医疗机构患者信息'
          })
          this.drawWjwChart(array)
        }
      })
    },
    drawWjwChart(data) {
      this.wjwColumn = echarts.init(document.getElementById('wjwColumn'))
      this.wjwColumn.setOption({
        title: {
          text: '社会单位整合共享数据资源'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: ['新生儿信息', '医疗机构患者信息']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['0', '50%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.wjwColumn.on('click', (param) => {
        const name = param.name
        if (name === '新生儿信息') {
          this.$router.push({
            path: 'wjw/xs'
          })
        }
        if (name === '医疗机构患者信息') {
          this.$router.push({
            path: 'wjw/yy'
          })
        }
      })
    }
  },
  mounted() {
    this.caseTotalList()
    this.monthCaseTotalList()
    // this.geWjWTotal()
  }
}
</script>
<style>
.chart-container {
  width: 100%;
  float: left;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.echart_carousel .el-carousel__container {
  height: 326px;
}

.echart_carousel .el-carousel__indicator.is-active > .el-carousel__button {
  background-color: #99a9bf;
}

.echart_carousel .el-carousel__indicator > .el-carousel__button {
  background-color: #d3dce6;
}
.chartTit {
  font-size: 14px;
  text-align: center;
  color: #38dc98;
  padding: 12px 0;
}
.chartTit img {
  margin: -3px 8px 0 0;
}
@media only screen and (max-width: 1367px) {
  canvas {
    left: -6px !important;
  }
  .el-carousel__indicator {
    padding: 0px 4px;
  }
}
</style>
