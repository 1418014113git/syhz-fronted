<template>
  <div class="intell-count" >
    <el-form :inline="true" :model="filters" label-width="120px">
      <el-form-item label="时间：">
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.startTime" type="month" placeholder="开始日期"
                        size="small" clearable></el-date-picker>
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.endTime" type="month" placeholder="结束日期"
                        size="small" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="单位：">
        <el-input v-model="filters.tbdw" auto-complete="off" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="getChartData" v-if="$isViewBtn('107001')">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card shadow="never" class="card">
      <div id="chartColumn" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
    <el-card shadow="never" class="card">
      <div id="chartColumn2" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
    <el-card shadow="never" class="card">
      <div id="chartColumn3" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
    <el-card shadow="never" class="card">
      <div style="width: 90%; margin:0 auto;">
        <el-table :data="xsList" v-loading="listLoading" :default-sort = "{prop: 'time', order: 'descending'}" style="width: 100%;">
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="xslx" label="类型"></el-table-column>
          <el-table-column prop="num" label="数量" ></el-table-column>
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
            data: ['食品', '药品', '环境', '案件总数'],
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
              name: '案件总数',
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
      drawColumnChart2() {
        const colors = ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#CC99CC', '#DA70D6', '#01ccff', '#07ecc8', '#FFA07A', '#CCFF66']
        this.chartColumn = echarts.init(document.getElementById('chartColumn2'))
        this.chartColumn.setOption({
          // title : {
          //   text: '某站点用户访问来源',
          //   subtext: '纯属虚构',
          //   x:'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 件({d}%)'
          },
          legend: {
            data: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
            align: 'left',
            left: 10,
            textStyle: {
              color: '#bbbbbb'
            }
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left',
                    max: 1548
                  }
                }
              },
              restore: { show: true },
              saveAsImage: { show: true }
            },
            iconStyle: {
              color: '#bbbbbb',
              borderColor: '#bbbbbb'
            }
          },
          color: colors,
          calculable: true,
          series: [
            {
              name: '行政区划',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 35, name: '西安市' },
                { value: 10, name: '铜川市' },
                { value: 34, name: '宝鸡市' },
                { value: 15, name: '咸阳市' },
                { value: 13, name: '渭南市' },
                { value: 11, name: '延安市' },
                { value: 15, name: '汉中市' },
                { value: 25, name: '榆林市' },
                { value: 25, name: '安康市' },
                { value: 18, name: '商洛市' }
              ]
            }
          ]
        })
      },
      drawColumnChart3() {
        const colors = ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#CC99CC', '#DA70D6', '#01ccff', '#07ecc8', '#FFA07A', '#CCFF66']
        this.chartColumn = echarts.init(document.getElementById('chartColumn3'))
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
            data: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
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
              data: ['2018-9', '2018-10', '2018-11', '2018-12', '2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8'],
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
            }
          ],
          series: [
            {
              name: '西安市',
              type: 'line',
              smooth: true,
              data: [13, 15, 10, 25, 15, 6, 13, 6, 7, 2, 2, 4]
            },
            {
              name: '铜川市',
              type: 'line',
              smooth: true,
              data: [3, 5, 14, 15, 23, 16, 5, 6, 4, 2, 1, 8]
            },
            {
              name: '宝鸡市',
              type: 'line',
              smooth: true,
              data: [2, 2, 11, 32, 10, 6, 0, 0, 2, 4, 2, 0]
            },
            {
              name: '咸阳市',
              type: 'line',
              smooth: true,
              data: [1, 2, 3, 2, 13, 11, 10, 3, 2, 2, 2, 0]
            },
            {
              name: '渭南市',
              type: 'line',
              smooth: true,
              data: [3, 5, 0, 5, 10, 6, 0, 6, 8, 4, 12, 8]
            },
            {
              name: '延安市',
              type: 'line',
              smooth: true,
              data: [1, 0, 1, 23, 11, 16, 3, 6, 2, 14, 2, 3]
            },
            {
              name: '汉中市',
              type: 'line',
              smooth: true,
              data: [3, 2, 1, 5, 10, 15, 12, 6, 7, 3, 12, 5]
            },
            {
              name: '榆林市',
              type: 'line',
              smooth: true,
              data: [1, 5, 10, 11, 5, 6, 3, 7, 20, 2, 11, 1]
            },
            {
              name: '安康市',
              type: 'line',
              smooth: true,
              data: [1, 6, 4, 15, 12, 16, 12, 5, 8, 3, 12, 2]
            },
            {
              name: '商洛市',
              type: 'line',
              smooth: true,
              data: [3, 2, 4, 12, 1, 9, 10, 16, 18, 4, 4, 7]
            }
          ]
        })
      },
      getChartData() {
        this.legendData = [
          '2018-9', '2018-10', '2018-11', '2018-12', '2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8'
        ]
        this.seriesData = [
          {
            name: '食品',
            type: 'bar',
            smooth: true,
            data: [3, 5, 0, 5, 10, 6, 0, 6, 8, 4, 12, 8]
          },
          {
            name: '药品',
            type: 'bar',
            smooth: true,
            data: [0, 0, 2, 1, 0, 5, 4, 5, 2, 0, 0, 4]
          },
          {
            name: '环境',
            type: 'bar',
            smooth: true,
            data: [3, 4, 0, 4, 2, 7, 1, 0, 4, 4, 0, 2]
          },
          {
            name: '案件总数',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            data: [6, 9, 3, 10, 12, 18, 5, 11, 14, 8, 12, 14]
          }
        ]
        this.drawColumnChart()
        this.drawColumnChart2()
        this.drawColumnChart3()
        this.getListData()
      },
      getListData() {
        this.xsList = [
          {
            time: '2019-08', xslx: '食品', num: 8, tb: -2, hb: 8
          },
          {
            time: '2019-08', xslx: '药品', num: 4, tb: -1, hb: 8
          },
          {
            time: '2019-08', xslx: '环境', num: 2, tb: 2, hb: 0.5
          },
          {
            time: '2019-07', xslx: '食品', num: 12, tb: 12, hb: 8
          },
          {
            time: '2019-07', xslx: '药品', num: 0, tb: 1.5, hb: 2.3
          },
          {
            time: '2019-07', xslx: '环境', num: 0, tb: -1.2, hb: -2.3
          },
          {
            time: '2019-06', xslx: '食品', num: 4, tb: 0, hb: 2
          },
          {
            time: '2019-06', xslx: '药品', num: 0, tb: -1.1, hb: 2.3
          },
          {
            time: '2019-06', xslx: '环境', num: 4, tb: -0, hb: 0
          },
          {
            time: '2019-05', xslx: '食品', num: 8, tb: -0, hb: 0
          },
          {
            time: '2019-05', xslx: '药品', num: 2, tb: -0, hb: 0
          },
          {
            time: '2019-05', xslx: '环境', num: 4, tb: 0, hb: 1
          },
          {
            time: '2019-04', xslx: '食品', num: 6, tb: -1, hb: 1
          },
          {
            time: '2019-04', xslx: '药品', num: 5, tb: -1, hb: 1
          },
          {
            time: '2019-04', xslx: '环境', num: 0, tb: -1, hb: 1
          },
          {
            time: '2019-03', xslx: '食品', num: 0, tb: 0, hb: 0
          },
          {
            time: '2019-03', xslx: '药品', num: 4, tb: 0, hb: 0
          },
          {
            time: '2019-03', xslx: '环境', num: 1, tb: 0, hb: 0
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
