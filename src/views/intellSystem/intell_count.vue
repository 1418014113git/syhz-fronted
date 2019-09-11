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
          <el-table-column prop="q1sum" label="线索数量" ></el-table-column>
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
  import {
    getIntellCount, getIntellCountYear
  } from '@/api/intellSystem'
  import {
    parseTime
  } from '@/utils/index'

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
              saveAsImage: { show: true }
            },
            iconStyle: {
              color: '#bbbbbb',
              borderColor: '#bbbbbb'
            }
          },
          legend: {
            data: ['食品', '药品', '环境', '食药', '线索总数', '涉及人数', '手机号数'],
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
              name: '数量',
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
            },
            {
              type: 'value',
              name: '涉及人数',
              position: 'right',
              offset: 50,
              minInterval: 1,
              boundaryGap: ['0', '10%'],
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: {
                lineStyle: {
                  color: colors[5]
                }
              }
            },
            {
              type: 'value',
              name: '手机号数',
              position: 'right',
              offset: 100,
              minInterval: 1,
              boundaryGap: ['0', '10%'],
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: {
                lineStyle: {
                  color: colors[6]
                }
              }
            }
          ],
          series: this.seriesData
        })
      },
      getChartData(hand) {
        this.listLoading = true
        if (!this.setParams()) {
          this.$message({
            message: '查询时间不能超过12个月', type: 'error'
          })
          return false
        }
        this.seriesData = []
        this.monthData = {}
        if (hand) { // 手动点击时，添加埋点参数
          this.filters.logFlag = 1
        }
        getIntellCountYear(this.filters).then((response) => {
          if (response.code === '000000') {
            this.dataList = response.data
            this.getValue()
          }
          this.step = this.step + 1
        }).catch(() => { this.step = this.step + 1 })
        this.$query('intellcountkey', this.filters).then((response) => {
          this.xsTotal = this.setCountList(response, this.xsTotal)
          this.seriesData.push({
            name: '线索总数',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            data: this.xsTotal
          })
          this.step = this.step + 1
        })
        this.$query('intellcountperson', this.filters).then((response) => {
          this.sjrTotal = this.setCountList(response, this.sjrTotal)
          this.seriesData.push({
            name: '涉及人数',
            type: 'line',
            smooth: true,
            yAxisIndex: 2,
            data: this.sjrTotal
          })
          this.step = this.step + 1
        })
        this.$query('intellcountphones', this.filters).then((response) => {
          this.phoneTotal = this.setCountList(response, this.phoneTotal)
          this.seriesData.push({
            name: '手机号数',
            type: 'line',
            smooth: true,
            yAxisIndex: 3,
            data: this.phoneTotal
          })
          this.step = this.step + 1
        })
      },
      setCountList(response, array) {
        if (response.code === '000000') {
          array = Array.apply(null, Array(this.legendData.length)).map(() => 0)
          const data = response.data
          const size = data.length
          for (let i = 0; i < size; i++) {
            const item = data[i]
            const index = this.legendData.indexOf(item.dateStr)
            array[index] = item.num
          }
        }
        return array
      },
      setParams() {
        if (!this.filters.startTime || !this.filters.endTime) {
          const pre = new Date()
          this.filters.endTime = parseTime(pre, '{y}-{m}-{d}')
          pre.setFullYear(pre.getFullYear() - 1)
          pre.setMonth(pre.getMonth() + 1)
          this.filters.startTime = parseTime(pre, '{y}-{m}-{d}')
        }
        const start = new Date(this.filters.startTime)
        const end = new Date(this.filters.endTime)
        const size = ((end.getFullYear() * 12 + end.getMonth()) - (start.getFullYear() * 12 + start.getMonth()))
        if (size > 12) {
          return false
        }
        this.legendData = []
        for (let i = 0; i <= size; i++) {
          if (i > 0) {
            start.setMonth(start.getMonth() + 1)
          }
          this.legendData[i] = parseTime(start, '{y}-{m}')
        }
        return true
      },
      getValue() {
        const list = this.legendData
        const type1 = {
          name: '食品', type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
        }
        const type2 = {
          name: '药品', type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
        }
        const type3 = {
          name: '环境', type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
        }
        const type4 = {
          name: '食药', type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
        }
        const size = this.dataList.length
        for (let i = 0; i < size; i++) {
          const item = this.dataList[i]
          this.monthData[item.time] = {}
          const index = list.indexOf(item.time)
          switch (parseInt(item.xslx)) {
            case 1:
              type1.data[index] = item.num
              break
            case 2:
              type2.data[index] = item.num
              break
            case 3:
              type3.data[index] = item.num
              break
            case 4:
              type4.data[index] = item.num
              break
          }
        }
        this.seriesData.push(type1)
        this.seriesData.push(type2)
        this.seriesData.push(type3)
        this.seriesData.push(type4)
        this.getData()
      },
      getData() {
        this.tempList = []
        this.xsList = []
        for (const key in this.monthData) {
          getIntellCount({
            cjsj: key + '-01'
          }).then((response) => {
            if (response.data && response.data.length > 0) {
              for (let j = 0; j < response.data.length; j++) {
                const item = response.data[j]
                this.bindMonthData(key, item)
              }
            }
          })
        }
      },
      bindMonthData(key, item) {
        let text = ''
        if (item.xslx === '1') {
          text = '食品'
        }
        if (item.xslx === '2') {
          text = '药品'
        }
        if (item.xslx === '3') {
          text = '环境'
        }
        if (item.xslx === '4') {
          text = '食药'
        }
        this.tempList.push(key + '_' + item.xslx)
        this.xsList.push({
          xslx: text, q1sum: item.q1sum, tb: item.tb, hb: item.hb, time: key
        })
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
