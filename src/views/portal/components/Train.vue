<template>
  <section class="trainBox">
    <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-carousel trigger="click" class="echart_carousel" :interval="interval" style="width:100%;">
      <el-carousel-item>
        <el-table :data="tableData"  style="width: 99%;" max-height="260">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="areaName" label="省市" align="center" min-width="70"></el-table-column>
          <el-table-column prop="total5" label="学习人次" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="total6" label="学习时长" align="center" min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.total6 > 0 ? $buildTime(scope.row.total6) : '-'}}
            </template>
          </el-table-column>
        </el-table>
      </el-carousel-item>
      <el-carousel-item >
        <div id="examChartPerson" style="width: 100%; height: 260px;"></div>
      </el-carousel-item>
      <el-carousel-item >
        <div id="examChartTime" style="width: 100%; height: 260px;"></div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Train',
  data() {
    return {
      interval: 10000, // 轮播间隔
      tableData: []
    }
  },
  methods: {
    init() {
      this.$update('knowledge/queryTrainCrouse', { cityCode: 1 }).then((response) => {
        if (response.data) {
          this.tableData = response.data
          var cityArr = [] // 省市
          var total5Arr = [] // 学习人次
          var total6Arr = [] // 学习时长
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index]
            element.total6_text = element.total6 > 0 ? this.$buildTime(element.total6) : '-'
            cityArr.push(element.areaName)
            total5Arr.push(element.total5)
            total6Arr.push(element.total6)
          }
          this.drawEchartPerson(cityArr, total5Arr) // 学习人次
          this.drawEchartTime(cityArr, total6Arr) // 学习时长
        }
      })
    },
    drawEchartPerson(cityArr, realNumArr) {
      var examChartPerson = echarts.init(document.getElementById('examChartPerson'))
      examChartPerson.setOption({
        color: ['#04E4E4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: 'scroll',
          itemGap: 15,
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          },
          top: 0,
          left: 'center',
          data: ['学习人次']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0',
          top: '12%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: cityArr,
            axisTick: {
              alignWithLabel: true
            },
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
          }
        ],
        yAxis: [
          {
            name: '',
            type: 'value',
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: '#FFF'
              }
            },
            nameTextStyle: {
              fontSize: 13
            }
          }
        ],
        series: [
          {
            name: '学习人次',
            type: 'bar',
            barWidth: '60%',
            data: realNumArr
          }
        ]
      })
    },
    drawEchartTime(cityArr, realNumArr, valueText) {
      var _this = this
      var examChartTime = echarts.init(document.getElementById('examChartTime'))
      examChartTime.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            for (var i = 0; i < params.length; i++) {
              return params[i].axisValue + '<br/>' + params[i].seriesName + '：' + _this.$buildTime(params[i].value)
            }
          }
        },
        legend: {
          type: 'scroll',
          itemGap: 15,
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          },
          top: 0,
          left: 'center',
          data: ['学习时长']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0',
          top: '12%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: cityArr,
            axisTick: {
              alignWithLabel: true
            },
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
          }
        ],
        yAxis: [
          {
            name: '',
            type: 'value',
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: '#FFF'
              }
            },
            nameTextStyle: {
              fontSize: 13
            }
          }
        ],
        series: [
          {
            name: '学习时长',
            type: 'bar',
            barWidth: '60%',
            data: realNumArr
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
<style rel="stylesheet/scss" lang="scss">
.trainBox {
  margin-top: 10px;
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .poaj {
    font-size: 16px;
    text-align: center;
    color: #38dc98;
    padding-top: 3px;
  }
  .echart_carousel .el-carousel__container {
    height: 290px;
  }
  .echart_carousel .el-carousel__indicator.is-active > .el-carousel__button {
    background-color: #99a9bf;
  }
  .echart_carousel .el-carousel__indicator > .el-carousel__button {
    background-color: #d3dce6;
  }
}
</style>
