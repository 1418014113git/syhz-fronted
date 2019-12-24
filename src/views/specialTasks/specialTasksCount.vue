<template>
  <div>
    <el-form :inline="true" :model="filters" label-width="120px">
      <el-form-item label="时间范围：">
        <el-date-picker
          v-model="filters.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search(true)">查询</el-button>
        <el-button type="primary" size="small" v-on:click="resetSearch(true)">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="chart-container">
      <div id="chartColumn" style="width: 850px; height: 326px;margin:0 auto;border:1px solid #00a0e9;padding:10px 0;"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getTaskQbxsAjCount } from '@/api/specialTasks'
export default {
  name: 'highindustry',
  data() {
    return {
      filters: {
        timeRange: ''
      },
      page: 1,
      pageSize: 5,
      legendData: [],
      numData: [],
      dataList: [],
      xAxis: [],
      tData: [],
      xData: [],
      aData: []
    }
  },
  methods: {
    drawColumnChart() {
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
          data: ['任务数量', '线索数量', '案件数量'],
          textStyle: {
            color: '#bbbbbb'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxis,
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
            name: '数量',
            min: 0,
            axisLabel: {
              formatter: '{value} 个'
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
            name: '任务数量',
            type: 'bar',
            data: this.tData,
            itemStyle: {
              normal: {
                color: '#537ff7'
              }
            }
          },
          {
            name: '线索数量',
            type: 'bar',
            data: this.xData,
            itemStyle: {
              normal: {
                color: '#f46470'
              }
            }
          },
          {
            name: '案件数量',
            type: 'bar',
            data: this.aData,
            itemStyle: {
              normal: {
                color: '#ffb337'
              }
            }
          }
        ]
      })
    },
    search(hand) {
      this.getData(hand)
    },
    resetSearch(hand) {
      this.filters.timeRange = ''
      this.getData(hand)
    },
    getData(hand) {
      const para = {
        startTime: '',
        endTime: ''
      }
      if (hand) {
        para.logFlag = 1
      }
      if (this.filters.timeRange) {
        para.startTime = this.filters.timeRange[0]
        para.endTime = this.filters.timeRange[1]
      }
      getTaskQbxsAjCount(para).then((response) => {
        const data = response.data
        this.xAxis = data.xAxis
        this.tData = data.tData
        this.xData = data.xData
        this.aData = data.aData
        this.drawColumnChart()
      })
    }
  },
  mounted: function() {
    this.getData()
  }
}
</script>


<style scoped>
.chart-container {
  width: 100%;
  padding: 50px 100px 150px;
  background: rgba(0, 89, 130, 0.7);
}
</style>
