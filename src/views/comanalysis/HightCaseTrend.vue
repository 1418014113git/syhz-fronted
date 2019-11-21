<template>
  <div class="HightCaseTrend" v-loading="allLoading">
    <el-form :inline="true" :model="filters" label-width="100px">
      <el-form-item label="采集时间：">
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.startTime" type="month" placeholder="开始日期"
                        size="small" clearable></el-date-picker>
        <el-date-picker value-format="yyyy-MM-dd" v-model="filters.endTime" type="month" placeholder="结束日期"
                        size="small" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="高发类型：">
        <el-select v-model="heightType" clearable placeholder="请选择" @change="selectChange" filterable>
          <el-option
            v-for="item in heightCaseData"
            :key="item.AJLB"
            :label="item.code_name"
            :value="item.AJLB">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="罪名类型：">
        <el-select v-model="filters.syhAjlb" clearable placeholder="请选择" @change="selectChangeZM" filterable>
          <el-option
            v-for="item in syhAjlbList"
            :key="item.value"
            :label="item.SYH_AJLB_NAME"
            :value="item.SYH_AJLB">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="getChartData" v-if="$isViewBtn('100711')">查询</el-button>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 高发类型 -->
    <div v-show="showContainerGF">
      <el-card shadow="never" class="card">
        <!-- <el-tag>高发类型统计</el-tag> -->
        <div id="chartColumn" style="width: 90%; min-height: 400px; margin:0 auto"></div>
      </el-card>
      <el-card shadow="never" class="card">
        <div style="width: 90%; margin:0 auto;">
          <!-- <el-tag>高发环比图</el-tag> -->
          <el-table :data="xsList" v-loading="listLoading" :default-sort = "{prop: 'time', order: 'descending'}" style="width: 100%;">
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column label="数量" >
              <template slot-scope="scope">
                <el-button type="text" @click="toAjList(scope.row)">{{scope.row.sumNum}}</el-button>
              </template>
            </el-table-column>
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
    <!-- 罪名类型 -->
    <div v-show="showContainerZM">
      <el-card shadow="never" class="card">
        <div id="chartColumnZM" style="width: 90%; min-height: 400px; margin:0 auto"></div>
      </el-card>
      <el-card shadow="never" class="card">
        <div style="width: 90%; margin:0 auto;">
          <el-table :data="xsListZM" v-loading="listLoading" :default-sort = "{prop: 'time', order: 'descending'}" style="width: 100%;">
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column label="数量" >
              <template slot-scope="scope">
                <el-button type="text" @click="toAjList(scope.row)">{{scope.row.sumNum}}</el-button>
              </template>
            </el-table-column>
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
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  // getHeightTrend,
  getHeightTrendByType, getHeightTrendTBHB, ajzmnum
} from '@/api/heightcase'
import {
  parseTime
} from '@/utils/index'
export default {
  name: 'HightCaseTrend',
  data() {
    return {
      allLoading: false,
      heightType: '',
      legend: '',
      legendZM: '',
      time: '2018-02-01',
      filters: {
        startTime: '',
        endTime: ''
      },
      listLoading: false,
      page: 1,
      pageSize: 5,
      legendData: [],
      seriesData: [],
      seriesDataZM: [],
      dataListGF: [],
      dataListZM: [],
      xsList: [],
      xsListZM: [],
      tempList: [],
      monthData: {},
      heightCaseData: [],
      syhAjlbList: [],
      showContainerGF: true,
      showContainerZM: false
    }
  },
  methods: {
    selectChange() {
      const len = this.heightCaseData.length
      for (let i = 0; i < len; i++) {
        if (this.heightCaseData[i]['AJLB'] === this.heightType) {
          this.legend = this.heightCaseData[i]['code_name']
        }
      }
    },
    selectChangeZM(val) {
      const len = this.syhAjlbList.length
      for (let i = 0; i < len; i++) {
        if (this.syhAjlbList[i]['SYH_AJLB'] === val) {
          this.legendZM = this.syhAjlbList[i]['SYH_AJLB_NAME']
        }
      }
    },
    drawColumnChartGF() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.on('click', (params) => {
        // console.info(params)
      })
      this.chartColumn.setOption({
        title: {
          text: '高发类型',
          textStyle: {
            color: '#bbbbbb'
          }
        },
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
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ['line', 'bar'] },
            restore: { show: false },
            saveAsImage: { show: true }
          },
          iconStyle: {
            color: '#bbbbbb',
            borderColor: '#bbbbbb'
          }
        },
        legend: {
          data: [this.legend],
          align: 'left',
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
          }
        ],
        series: this.seriesData,
        color: ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
      })
    },
    drawColumnChartZM() {
      this.chartColumn = echarts.init(document.getElementById('chartColumnZM'))
      this.chartColumn.on('click', (params) => {
        // console.info(params)
      })
      this.chartColumn.setOption({
        title: {
          text: '罪名类型',
          textStyle: {
            color: '#bbbbbb'
          }
        },
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
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ['line', 'bar'] },
            restore: { show: false },
            saveAsImage: { show: true }
          },
          iconStyle: {
            color: '#bbbbbb',
            borderColor: '#bbbbbb'
          }
        },
        legend: {
          data: [this.legendZM],
          align: 'left',
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
          }
        ],
        series: this.seriesDataZM
      })
    },
    getTypeSelectList() { // 初始化 select 数据
      this.allLoading = true
      if (!this.setParams()) {
        this.$message({
          message: '查询时间不能超过12个月',
          type: 'error'
        })
        return false
      }
      const paramGF = {
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        pageNum: 1,
        pageSize: 20
      }
      this.$query('heightcasetrend', paramGF).then((response) => {
        if (response.code === '000000' && response.data) {
          this.heightCaseData = response.data
          this.heightType = this.heightCaseData[0]['AJLB']
          this.legend = this.heightCaseData[0]['code_name']
          this.getChartData() // 查数据
        }
        this.allLoading = false
      })
      const paramZM = {
        startTime: this.filters.startTime,
        endTime: this.filters.endTime
      }
      this.$query('ajzmcode', paramZM).then((response) => {
        this.allLoading = false
        this.syhAjlbList = response.data
      })
    },
    getChartData() {
      // if (!this.heightType) {
      //   return false
      // }
      this.listLoading = true
      if (!this.setParams()) {
        this.$message({
          message: '查询时间不能超过12个月',
          type: 'error'
        })
        return false
      }
      // 判断筛选条件
      if (this.heightType) { // 高发类型
        this.showContainerGF = true
        this.filters.ajlb = this.heightType
        this.monthData = {}
        getHeightTrendByType(this.filters).then((response) => {
          this.dataListGF = response.data
          this.getValue()
          this.drawColumnChartGF()
          this.listLoading = false
        })
      } else {
        this.showContainerGF = false
      }
      if (this.filters.syhAjlb) { // 罪名类型
        this.showContainerZM = true
        ajzmnum(this.filters).then((response) => {
          this.dataListZM = response.data
          this.getValueZM()
          this.drawColumnChartZM()
          this.listLoading = false
        })
      } else {
        this.showContainerZM = false
      }
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
        name: this.legend, type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
      }
      const size = this.dataListGF.length
      for (let i = 0; i < size; i++) {
        const item = this.dataListGF[i]
        this.monthData[item.time] = {}
        const index = list.indexOf(item.time)
        type1.data[index] = item.ajlbNum
      }
      this.seriesData = []
      this.seriesData.push(type1)
      this.getData()
    },
    getValueZM() {
      const list = this.legendData
      const type1 = {
        name: this.legendZM, type: 'bar', barGap: 0, data: Array.apply(null, Array(list.length)).map(() => 0)
      }
      const size = this.dataListZM.length
      for (let i = 0; i < size; i++) {
        const item = this.dataListZM[i]
        this.monthData[item.time] = {}
        const index = list.indexOf(item.time)
        type1.data[index] = item.ajzmNum
      }
      this.seriesDataZM = []
      this.seriesDataZM.push(type1)
      this.getDataZM()
    },
    getData() {
      this.tempList = []
      this.xsList = []
      for (const key in this.monthData) {
        getHeightTrendTBHB({
          slsj: key + '-01',
          ajlb: this.heightType
        }).then((response) => {
          if (response.data && response.data.length > 0) {
            for (let j = 0; j < response.data.length; j++) {
              const item = response.data[j]
              this.xsList.push({
                name: this.legend, sumNum: item.ajlbNum, tb: item.tb, hb: item.hb, time: key
              })
            }
          }
        })
      }
    },
    getDataZM() {
      this.tempList = []
      this.xsListZM = []
      for (const key in this.monthData) {
        const param = {
          slsj: key + '-01',
          syhAjlb: this.filters.syhAjlb
        }
        this.$query('ajzmdetail', param).then((response) => {
          for (let j = 0; j < response.data.length; j++) {
            const item = response.data[j]
            this.xsListZM.push({
              name: this.legendZM, sumNum: item.ajzmNum, tb: item.tb, hb: item.hb, time: key
            })
          }
        })
      }
    },
    toAjList(row) {
      const time = new Date(row.time + '-01 00:00:00')
      time.setMonth(time.getMonth() + 1)
      this.$router.push({
        path: '/caseManage',
        query: {
          startDate: parseTime(new Date(row.time + '-01'), '{y}-{m}-{d}'),
          endDate: parseTime(new Date(time.getTime() - (1000 * 60 * 60 * 24)), '{y}-{m}-{d}'),
          ajlb: this.heightType
        }
      })
    },
    resetSearch() {
      this.filters.startTime = null
      this.filters.endTime = null
      this.filters.syhAjlb = ''
      this.heightType = this.heightCaseData[0]['AJLB']
      this.setParams()
      this.getChartData()
    }
  },
  mounted: function() {
    this.getTypeSelectList()
  }
}
</script>

<style>
.HightCaseTrend .card {
  margin-top: 10px;
}
</style>
