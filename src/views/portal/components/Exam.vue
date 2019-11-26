<template>
  <section class="examBox">
    <!-- <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div> -->
    <el-carousel trigger="click" class="echart_carousel" :interval="interval" style="width:100%;">
      <el-carousel-item>
        <el-table :data="tableData" style="width: 99%;" max-height="260">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="areaName" label="省市" align="center" min-width="70"></el-table-column>
          <el-table-column prop="examCount" label="考试场次" align="center"></el-table-column>
          <el-table-column prop="realNum" label="参考人数" align="center" min-width="70"></el-table-column>
        </el-table>
      </el-carousel-item>
      <el-carousel-item >
        <div id="examChart" style="width: 100%; height: 260px;"></div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Exam',
  data() {
    return {
      interval: 10000, // 轮播间隔
      tableData: []
    }
  },
  methods: {
    init() {
      this.$query('examination/statisticsIndex', {}).then((response) => {
        if (response.data) {
          this.tableData = response.data
          var cityArr = []
          var realNumArr = []
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index]
            cityArr.push(element.areaName)
            realNumArr.push(element.realNum)
          }
          this.drawEchart(cityArr, realNumArr)
        }
      })
    },
    drawEchart(cityArr, realNumArr) {
      var examChart = echarts.init(document.getElementById('examChart'))
      examChart.setOption({
        color: ['#3398DB'],
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
          data: ['参考人数']
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
            name: '参考人数',
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
.examBox {
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
