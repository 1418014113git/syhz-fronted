<template>
  <div class="case-trend">
    <el-card style="margin-bottom: 10px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="时间">
          <el-date-picker v-model="dateRange" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.syhFllb" clearable placeholder="请选择">
            <el-option v-for="item in fllb" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="filters.syhSjly" clearable placeholder="请选择">
            <el-option label="食药环侦" value="0"></el-option>
            <el-option label="警综" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="罪名类型">
          <el-select v-model="filters.syhAjlb" clearable placeholder="请选择" filterable>
            <el-option v-for="item in syhZMList" :key="item.value" :label="item.SYH_AJLB_NAME" :value="item.SYH_AJLB"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  v-if="$isViewBtn('100401')"  @click="query">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary"  v-if="$isViewBtn('100402')"  @click="queryMonth" style="margin-left:20px;">本月</el-button>
          <el-button type="primary"  v-if="$isViewBtn('100403')"  @click="queryQuarter">本季</el-button>
          <el-button type="primary"  v-if="$isViewBtn('100404')"  @click="queryYear">本年</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" v-for="item in chartData" :key="item.id" class="card">
      <div :id="item.id" style="width: 90%; min-height: 400px; margin:0 auto"></div>
    </el-card>
  </div>
</template>

<script>
import {
  getCaseTotalList,
  getMonthCaseTotalList,
  getMonthCaseFllbList,
  getTCode
} from '@/api/portal'
import echarts from 'echarts'
import {
  parseTime
} from '@/utils/index'

export default {
  name: 'caseTrend',
  data() {
    return {
      filters: {
        syhFllb: '', // 分类
        syhAjlb: '', // 罪名类型
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        syhSjly: ''
      },
      fllb: [], // 分类列表
      syhZMList: [], // 罪名列表
      dateRange: [],
      id: null,
      chartColumn: null,
      chartBar: null,
      chartData: [
        {
          'id': 'chartPieZM', 'text': 'chart4'
        },
        {
          'id': 'chartPie', 'text': 'chart3'
        },
        {
          'id': 'chartColumn', 'text': 'chart1'
        },
        {
          'id': 'chartBar', 'text': 'chart2'
        }
      ],
      citys: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
      cityNum: [],
      year: [],
      yearNum: [],
      catchNum: [],
      nature: [],
      natureNum: [],
      natureZm: [],
      natureNumZm: [],
      selectedLX: {},
      selectedZM: {}
    }
  },
  methods: {
    caseTotalList() {
      const para = this.filters
      this.loading = true
      this.cityNum = []
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
        this.drawColumnChart() // 侦办案件地区分析
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    monthCaseTotalList() {
      if (!this.filters.startTime || !this.filters.endTime) {
        const pre = new Date()
        this.filters.endTime = parseTime(pre, '{y}-{m}-{d}')
        pre.setFullYear(pre.getFullYear() - 1)
        this.filters.startTime = parseTime(pre, '{y}-{m}-{d}')
      }
      const start = new Date(this.filters.startTime)
      const end = new Date(this.filters.endTime)
      const size = ((end.getFullYear() * 12 + end.getMonth()) - (start.getFullYear() * 12 + start.getMonth()))
      this.year = []
      for (let i = 0; i <= size; i++) {
        this.year[i] = parseTime(start, '{y}-{m}')
        start.setMonth(start.getMonth() + 1)
      }
      this.loading = true
      this.yearNum = []
      getMonthCaseTotalList(this.filters).then((response) => {
        if (response.code === '000000') {
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
        }
        this.getMonthZhrys(this.filters)
      })
    },
    getMonthZhrys(params) {
      this.$query('monthzhrys', params).then((response) => {
        if (response.code === '000000') {
          const data = response.data
          const resM = {}
          data.forEach((item, index) => {
            const num = item.zhrys
            const month = item.dateStr
            if (num > 0) {
              resM[month] = num
            }
          })
          for (let i = 0; i < this.year.length; i++) {
            const c = this.year[i]
            if (resM[c]) {
              this.catchNum[i] = resM[c]
            } else {
              this.catchNum[i] = 0
            }
          }
        }
        this.lineChart() // 侦办案件走势分析
        this.loading = false
      })
    },
    caseByFllb() {
      const para = this.filters
      this.loading = true
      this.nature = []
      this.natureNum = []
      getMonthCaseFllbList(para).then((response) => {
        const data = response.data
        data.forEach((item, index) => {
          const num = item.num
          const lbname = item.AJLB_NAME
          if (num > 0) {
            this.nature.push(lbname)
            this.natureNum.push({
              value: num,
              name: lbname
            })
            this.selectedLX[lbname] = index < 10
          }
        })
        this.pieChart() // 案件类型分析
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    caseByFlzm() {
      const para = this.filters
      this.loading = true
      this.natureZm = []
      this.natureNumZm = []
      this.$query('casebyajzmbzt', para).then((response) => {
        this.loading = false
        const data = response.data
        data.forEach((item, index) => {
          const num = item.num
          const lbname = item.SYH_AJLB_NAME
          if (num > 0) {
            this.natureZm.push(lbname)
            this.natureNumZm.push({
              value: num,
              name: lbname
            })
            this.selectedZM[lbname] = index < 10
          }
        })
        // this.syhZMList = response.data
        this.pieChartZM()
      }).catch(() => {
        this.loading = false
      })
    },
    pieChartZM() { // 案件罪名分析
      this.chartPieZM = echarts.init(document.getElementById('chartPieZM'))
      this.chartPieZM.setOption({
        color: ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8'],
        title: {
          text: '案件罪名分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#bbbbbb'
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
          data: this.natureZm, // 每个扇的名称
          selected: this.selectedZM,
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
            center: ['55%', '50%'],
            data: this.natureNumZm,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
              // normal: {
              //   color: function(value) { return '#' + ('00000' + ((Math.random() * 16775223 + 0.4) >> 0).toString(16)).slice(-6) }
              // }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    pieChart() { // 案件类型分析
      this.chartPie = echarts.init(document.getElementById('chartPie'))
      this.chartPie.setOption({
        color: ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8'],
        title: {
          text: '案件类型分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#bbbbbb'
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
          data: this.nature,
          selected: this.selectedLX,
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
            center: ['55%', '50%'],
            data: this.natureNum,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
              // normal: {
              //   color: function(value) { return '#' + ('00000' + ((Math.random() * 16775223 + 0.4) >> 0).toString(16)).slice(-6) }
              // }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawColumnChart() { // 侦办案件地区分析
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        title: {
          text: '侦办案件地区分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#bbbbbb'
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
              color(params) {
                var colorList = ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      })
    },
    lineChart() { // 侦办案件走势分析
      const colors = ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8']
      this.chartBar = echarts.init(document.getElementById('chartBar'))
      this.chartBar.setOption({
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
        title: {
          text: '侦办案件走势分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#bbbbbb'
          }
        },
        legend: {
          data: ['侦办数量', '抓获人数'],
          align: 'left',
          left: 10,
          textStyle: {
            color: '#bbbbbb'
          }
        },
        xAxis: {
          type: 'category',
          data: this.year,
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          },
          nameTextStyle: {
            fontSize: 14
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '数量',
            boundaryGap: ['0', '10%'],
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              fontSize: 14
            },
            nameTextStyle: {
              fontSize: 14
            }
          },
          {
            type: 'value',
            name: '抓获人数',
            boundaryGap: ['0', '10%'],
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} 人'
            }
          }
        ],
        series: [
          {
            name: '数量',
            data: this.yearNum,
            type: 'line'
          },
          {
            name: '人数',
            yAxisIndex: 1,
            data: this.catchNum,
            type: 'line'
          }
        ]
      })
    },
    query() {
      if (!this.setParams()) {
        this.$message({
          message: '查询时间不能超过48个月',
          type: 'error'
        })
        return false
      }
      if (this.dateRange && this.dateRange.length === 2) {
        this.filters.startTime = this.dateRange[0]
        this.filters.endTime = this.dateRange[1]
      } else {
        this.filters.startTime = ''
        this.filters.endTime = ''
      }
      this.caseTotalList()
      this.monthCaseTotalList()
      this.caseByFllb()
      this.caseByFlzm()
    },
    getTCode() { // 初始化select
      // 分类
      const para = {
        codeLx: 'fllb'
      }
      getTCode(para).then((response) => {
        const data = response.data
        if (data) {
          data.forEach((item, index) => {
            if (item.code !== '4') {
              this.fllb.push({
                value: item.code,
                label: item.code_name
              })
            }
          })
        }
      })
      // 罪名类型
      const paramZM = {
        startTime: this.filters.startTime,
        endTime: this.filters.endTime
      }
      this.$query('ajzmcode', paramZM).then((response) => {
        this.allLoading = false
        this.syhZMList = response.data
      })
    },
    queryMonth() { // 本月
      const pre = new Date()
      this.dateRange[1] = parseTime(pre, '{y}-{m}-{d}')
      pre.setDate(1) // 设置 本月的一号
      this.dateRange[0] = parseTime(pre, '{y}-{m}-{d}')
      this.dateRange = [this.dateRange[0], this.dateRange[1]]
      this.query()
    },
    queryQuarter() { // 本季
      this.dateRange[1] = parseTime(new Date(), '{y}-{m}-{d}')
      const y = new Date().getFullYear()
      const m = new Date().getMonth()
      const q = parseInt(m / 3)
      this.dateRange[0] = parseTime(new Date(y, (q) * 3, 1), '{y}-{m}-{d}')
      this.dateRange = [this.dateRange[0], this.dateRange[1]]
      this.query()
    },
    queryYear() { // 本年
      const pre = new Date()
      this.dateRange[1] = parseTime(pre, '{y}-{m}-{d}')
      pre.setMonth(0, 1) // 设置为一月
      this.dateRange[0] = parseTime(pre, '{y}-{m}-{d}')
      this.dateRange = [this.dateRange[0], this.dateRange[1]]
      this.query()
    },
    reset() { // 重置
      this.filters = {
        syhFllb: '', startTime: '', endTime: ''
      }
      this.dateRange = []
      this.query()
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
      if (size > 48) {
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
    }
  },
  mounted() {
    this.caseTotalList()
    this.monthCaseTotalList()
    this.caseByFllb() // 案件类型分析
    this.caseByFlzm() // 罪名分析
    this.getTCode()
  }
}

</script>

<style scoped>
.case-trend .card {
  margin-bottom: 20px;
}
</style>
