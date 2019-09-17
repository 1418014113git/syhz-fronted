<template>
  <div class="intell-count" >
    <el-form :inline="true" :model="filters" label-width="120px">
      <el-form-item label="采集时间：">
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.startTime" type="month" placeholder="开始日期"
                        size="small" clearable></el-date-picker>
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.endTime" type="month" placeholder="结束日期"
                        size="small" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="填报单位：">
        <el-input v-model="filters.tbdw" auto-complete="off" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="getChartData(true)" v-if="$isViewBtn('107001')">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card shadow="never" class="card">
      <div id="chartColumn" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
    <el-card shadow="never" class="card">
      <div style="width: 90%; margin:0 auto;">
        <el-table :data="xsList" v-loading="listLoading" :default-sort = "{prop: 'time', order: 'descending'}" style="width: 100%;">
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="xslx" label="线索类型"></el-table-column>
          <el-table-column prop="num" label="线索数量" ></el-table-column>
          <el-table-column label="同比(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.tb>0" style="color: red">{{scope.row.tb.toFixed(2)}}%</span>
              <span v-if="scope.row.tb<0" style="color: #56b372">{{scope.row.tb.toFixed(2)}}%</span>
              <span v-if="Number(scope.row.tb)===0">{{scope.row.tb.toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="环比(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.hb>0" style="color: red">{{scope.row.hb.toFixed(2)}}%</span>
              <span v-if="scope.row.hb<0" style="color: #56b372">{{scope.row.hb.toFixed(2)}}%</span>
              <span v-if="Number(scope.row.hb)===0">{{scope.row.hb.toFixed(2)}}%</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
// import {
//   getIntellCount, getIntellCountYear
// } from '@/api/intellSystem'
// import {
//   parseTime
// } from '@/utils/index'

export default {
  name: 'highindustry',
  data() {
    return {
      startPicker: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      endPicker: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      time: '2018-02-01',
      filters: {
        startTime: '',
        endTime: '',
        tbdw: ''
      },
      listLoading: false,
      page: 1,
      pageSize: 5,
      legendData: [],
      seriesData: [],
      dataList: [],
      xsList: [],
      tempList: [],
      monthData: {},
      step: 0,
      xsTotal: [],
      sjrTotal: [],
      phoneTotal: []
    }
  },
  methods: {
    drawColumnChart() {
      const colors = ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8']
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            },
            label: {
              textStyle: {
                color: '#eeeeee'
              },
              backgroundColor: 'rgba(0, 160, 233, 1)'
            }
          }
        },
        color: colors,
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          iconStyle: {
            color: '#bbbbbb',
            borderColor: '#bbbbbb'
          }
        },
        legend: {
          data: ['食品', '药品', '环境', '线索总数'],
          align: 'left',
          left: 10,
          textStyle: {
            color: '#bbbbbb'
          }
        },
        barMaxWidth: 30,
        xAxis: [
          {
            type: 'category',
            data: this.legendData,
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '月数量',
            minInterval: 1,
            boundaryGap: ['0', '10%'],
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          },
          {
            type: 'value',
            name: '线索总数',
            position: 'right',
            minInterval: 1,
            boundaryGap: ['0', '10%'],
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: colors[4]
              }
            }
          }
        ],
        series: this.seriesData
      })
    },
    getChartData(hand) {
      // var param = {}
      // if (hand) {
      //   param.logFlag = 1
      // }
      this.legendData = [
        '2018-9', '2018-10', '2018-11', '2018-12', '2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8'
      ]
      this.seriesData = [
        {
          name: '食品',
          type: 'bar',
          smooth: true,
          data: [23, 33, 21, 45, 30, 76, 0, 162, 32, 50, 64, 33]
        },
        {
          name: '药品',
          type: 'bar',
          smooth: true,
          data: [26, 59, 90, 64, 0, 70, 75, 82, 48, 18, 60, 23]
        },
        {
          name: '环境',
          type: 'bar',
          smooth: true,
          data: [62, 21, 14, 22, 21, 7, 16, 22, 47, 18, 0, 23]
        },
        {
          name: '线索总数',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: [111, 113, 125, 131, 51, 153, 91, 266, 127, 86, 124, 79]
        }
      ]
      this.drawColumnChart()
      this.getListData()
    },
    getListData() {
      this.xsList = [
        {
          time: '2019-08', xslx: '食品', num: 33, tb: -12, hb: 23
        },
        {
          time: '2019-08', xslx: '药品', num: 23, tb: -1, hb: 8
        },
        {
          time: '2019-08', xslx: '环境', num: 23, tb: 2, hb: 0.5
        },
        {
          time: '2019-07', xslx: '食品', num: 64, tb: 12, hb: 8
        },
        {
          time: '2019-07', xslx: '药品', num: 60, tb: 1.5, hb: 2.3
        },
        {
          time: '2019-07', xslx: '环境', num: 0, tb: -1.2, hb: -2.3
        },
        {
          time: '2019-06', xslx: '食品', num: 50, tb: 0, hb: 2.3
        },
        {
          time: '2019-06', xslx: '药品', num: 18, tb: -12, hb: 23
        },
        {
          time: '2019-06', xslx: '环境', num: 18, tb: -12, hb: 23
        },
        {
          time: '2019-05', xslx: '食品', num: 33, tb: -12, hb: 23
        },
        {
          time: '2019-05', xslx: '药品', num: 32, tb: -12, hb: 23
        },
        {
          time: '2019-05', xslx: '环境', num: 48, tb: -12, hb: 23
        },
        {
          time: '2019-04', xslx: '食品', num: 47, tb: -12, hb: 23
        },
        {
          time: '2019-04', xslx: '药品', num: 162, tb: -12, hb: 23
        },
        {
          time: '2019-04', xslx: '环境', num: 82, tb: -12, hb: 23
        },
        {
          time: '2019-03', xslx: '食品', num: 0, tb: -12, hb: 23
        },
        {
          time: '2019-03', xslx: '药品', num: 75, tb: -12, hb: 23
        },
        {
          time: '2019-03', xslx: '环境', num: 16, tb: -12, hb: 23
        }
      ]
    }
  },
  mounted: function() {
    this.getChartData()
  },
  watch: {
    step(val) {
      if (val === 4) {
        this.listLoading = false
        this.drawColumnChart()
        this.step = 0
      }
    }
  }
}
</script>


<style scoped>
.intell-count .card {
  margin-bottom: 20px;
}
</style>
