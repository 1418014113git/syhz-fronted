<template>
  <section class="timeTrendAnalysis">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="content">
            <el-card>
              <el-form :inline="true" :model="filters" label-width="80px">
                <el-row>
                  <el-form-item label="筛选日期">
                    <el-select v-model="filters.queryType" placeholder="请选择">
                      <el-option label="立案日期" value="1"></el-option>
                      <el-option label="破案日期" value="2"></el-option>
                    </el-select>
                    <el-select v-model="filters.timeType" placeholder="请选择" @change="timeTypeChange">
                      <!--<el-option label="全部" value="0"></el-option>-->
                      <el-option label="本年" value="1"></el-option>
                      <el-option label="本季" value="4"></el-option>
                      <el-option label="本月" value="5"></el-option>
                      <el-option label="本周" value="6"></el-option>
                      <el-option label="本日" value="8"></el-option>
                      <el-option label="自定义" value="7"></el-option>
                    </el-select>
                    <el-date-picker :disabled="filters.timeType !== '7'" v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"></el-date-picker>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="案件分类">
                    <el-cascader v-model="filters.syhFllb" change-on-select filterable :options="fllbList" clearable></el-cascader>
                    <el-checkbox v-model="filters.childFlag">统计子级</el-checkbox>
                    <el-tooltip popper-class="message_tooltip" effect="light" content="勾选统计子级时统计当前选中案件分类的子级（包括子级的下级）案件数量" placement="right">
                      <i><svg-icon icon-class="wenhao1"></svg-icon></i>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="案件状态">
                    <el-select v-model="filters.ajzt" placeholder="请选择" clearable>
                      <el-option v-for="option in ajztData" :key="option.code" :label="option.codeName" :value="option.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleClick">查询</el-button>
                    <el-button type="primary" @click="restForm">重置</el-button>
                  </el-form-item>
                </el-row>
              </el-form>
              <div class="runChart" v-loading="runChart1Loading">
                <div class="runChart_title">
                  <span>案件趋势分析</span>
                  <el-tooltip popper-class="message_tooltip" effect="light" content="根据查询条件分析案件数量变化趋势" placement="right">
                    <i><svg-icon icon-class="wenhao1"></svg-icon></i>
                  </el-tooltip>
                  <span class="runChart_title_query">
                    统计项目
                    <el-select v-model="runChart1Type" multiple placeholder="请选择" @change="runChart1TypeChange">
                      <el-option label="案件（起）" value="1"></el-option>
                      <el-option label="抓获（人）" value="2"></el-option>
                      <el-option label="刑拘（人）" value="3"></el-option>
                      <el-option label="批捕（人）" value="4"></el-option>
                      <el-option label="移诉（人）" value="5"></el-option>
                      <el-option label="捣毁窝点（个）" value="6"></el-option>
                      <el-option label="涉案金额（万元）" value="7"></el-option>
                    </el-select>
                  </span>
                  <p class="runChart_title_btn">
                    <el-button v-if="btn1Flag" :class="runChart1DayType === '1' ? 'active' : ''" @click="clickDayType('1')">按年</el-button>
                    <el-button v-if="btn2Flag" :class="runChart1DayType === '2' ? 'active' : ''" @click="clickDayType('2')">按季</el-button>
                    <el-button v-if="btn3Flag" :class="runChart1DayType === '3' ? 'active' : ''" @click="clickDayType('3')">按自然月</el-button>
                    <el-button v-if="btn4Flag" :class="runChart1DayType === '4' ? 'active' : ''" @click="clickDayType('4')">按统计月</el-button>
                    <el-tooltip v-if="btn4Flag" popper-class="message_tooltip" effect="light" :content="totalMonthTxt" placement="right">
                      <i><svg-icon icon-class="wenhao1"></svg-icon></i>
                    </el-tooltip>
                    <el-button v-if="btn5Flag" :class="runChart1DayType === '5' ? 'active' : ''" @click="clickDayType('5')">按天</el-button>
                  </p>
                </div>
                <div class="runChart_container" id="container"></div>
              </div>
              <div class="runChart mar_top_50" v-loading="runChart2Loading">
                <div class="runChart_title">
                  <span>案件同比/环比分析</span>
                  <el-tooltip popper-class="message_tooltip" effect="light" content="根据查询条件分析案件同比/环比" placement="right">
                    <i><svg-icon icon-class="wenhao1"></svg-icon></i>
                  </el-tooltip>
                  <span class="runChart_title_query">
                    统计项目
                    <el-select v-model="runChart2Type" placeholder="请选择" @change="runChart2TypeChange">
                      <el-option label="案件（起）" value="1"></el-option>
                      <el-option label="抓获（人）" value="2"></el-option>
                      <el-option label="刑拘（人）" value="3"></el-option>
                      <el-option label="批捕（人）" value="4"></el-option>
                      <el-option label="移诉（人）" value="5"></el-option>
                      <el-option label="捣毁窝点（个）" value="6"></el-option>
                      <el-option label="涉案金额（万元）" value="7"></el-option>
                    </el-select>
                  </span>
                  <p class="runChart_title_btn">
                    <el-button v-if="btn1Flag" :class="runChart2DayType === '1' ? 'active' : ''" @click="clickDayType1('1')">按年</el-button>
                    <el-button v-if="btn2Flag" :class="runChart2DayType === '2' ? 'active' : ''" @click="clickDayType1('2')">按季</el-button>
                    <el-button v-if="btn3Flag" :class="runChart2DayType === '3' ? 'active' : ''" @click="clickDayType1('3')">按自然月</el-button>
                    <el-button v-if="btn4Flag" :class="runChart2DayType === '4' ? 'active' : ''" @click="clickDayType1('4')">按统计月</el-button>
                    <el-tooltip v-if="btn4Flag" popper-class="message_tooltip" effect="light" :content="totalMonthTxt" placement="right">
                      <i><svg-icon icon-class="wenhao1"></svg-icon></i>
                    </el-tooltip>
                    <el-button v-if="btn5Flag" :class="runChart2DayType === '5' ? 'active' : ''" @click="clickDayType1('5')">按天</el-button>
                  </p>
                </div>
                <div class="runChart_container" id="container1"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import { getSYHFLLBList } from '@/utils/codetotext'
  import echarts from 'echarts'
  export default {
    name: 'caseAssist_totalList',
    data() {
      return {
        activeName: '0',
        filters: {
          queryType: '1',
          time: [],
          timeType: '1',
          syhFllb: [],
          childFlag: true,
          ajzt: '',
          departCode: ''
        },
        fllbList: getSYHFLLBList(), // 案件分类类别
        ajztData: [], // 案件状态
        runChart1Type: ['1'],
        runChart1DayType: '',
        runChart1Data: [],
        runChart1Loading: false,
        runChart2Type: '1',
        runChart2DayType: '',
        runChart2Data: [],
        runChart2Loading: false,
        countHeight: null,
        curDept: {},
        curUser: {},
        systemTime: '',
        btn1Flag: false,
        btn2Flag: false,
        btn3Flag: false,
        btn4Flag: false,
        btn5Flag: false,
        runChart1Option: null,
        runChart2Option: null,
        runChart1: null,
        runChart2: null,
        runChartTypeArr: [
          { label: '案件（起）', value: '1', color: '#ff577c', barTxt: '案件数量', offset: 70, min: 0, max: 50 },
          { label: '抓获（人）', value: '2', color: '#ff7e61', barTxt: '抓获人数', offset: 70, min: 0, max: 50 },
          { label: '刑拘（人）', value: '3', color: '#ffdc70', barTxt: '刑拘人数', offset: 70, min: 0, max: 50 },
          { label: '批捕（人）', value: '4', color: '#27ff9b', barTxt: '批捕人数', offset: 70, min: 0, max: 50 },
          { label: '移诉（人）', value: '5', color: '#77c6ef', barTxt: '移诉人数', offset: 70, min: 0, max: 50 },
          { label: '捣毁窝点（个）', value: '6', color: '#1890ff', barTxt: '捣毁窝点', offset: 80, min: 0, max: 50 },
          { label: '涉案金额（万元）', value: '7', color: '#b695ff', barTxt: '涉案金额', offset: 95, min: 0, max: 1500 }
        ],
        xyColor: '#bbbbbb',
        totalMonthTxt: '',
        totalMonthValue: {}
      }
    },
    methods: {
      dateChange(val) {
        if (val === undefined || val === null || val.length === 0) {
          this.btn1Flag = false
          this.btn2Flag = false
          this.btn3Flag = false
          this.btn4Flag = false
          this.btn5Flag = false
        } else {
          this.initDayType()
        }
      },
      timeTypeChange(value) {
        this.runChart1Type = ['1']
        this.runChart2Type = '1'
        if (this.filters.timeType === '7') {
          this.btn1Flag = false
          this.btn2Flag = false
          this.btn3Flag = false
          this.btn4Flag = false
          this.btn5Flag = false
          this.filters.time = []
        } else {
          const para = this.buildTime({})
          this.filters.time = [para.startTime, para.endTime]
          this.initDayType()
        }
      },
      initDayType() {
        if (this.filters.timeType === '0') {
          this.btn1Flag = true
          this.btn2Flag = true
          this.btn3Flag = false
          this.btn4Flag = false
          this.btn5Flag = false
        } else if (this.filters.timeType === '6' || this.filters.timeType === '8') {
          this.btn1Flag = false
          this.btn2Flag = false
          this.btn3Flag = false
          this.btn4Flag = false
          this.btn5Flag = true
        } else {
          const startTime = new Date(this.filters.time[0])
          const endTime = new Date(this.filters.time[1])
          if (startTime.getFullYear() !== endTime.getFullYear()) {
            const cYear = endTime.getFullYear() - startTime.getFullYear()
            if (cYear > 1 && cYear <= 3) {
              this.btn1Flag = true
              this.btn2Flag = true
              this.btn3Flag = false
              this.btn4Flag = false
              this.btn5Flag = false
            } else {
              this.btn1Flag = true
              this.btn2Flag = true
              this.btn3Flag = false
              this.btn4Flag = false
              this.btn5Flag = false
            }
          } else {
            if (startTime.getMonth() !== endTime.getMonth()) {
              const cMonth = endTime.getMonth() - startTime.getMonth() + 1
              if (cMonth >= 1 && cMonth <= 12) {
                this.btn1Flag = false
                this.btn2Flag = false
                this.btn3Flag = true
                this.btn4Flag = true
                this.btn5Flag = cMonth <= 3
              }
            } else {
              this.btn1Flag = false
              this.btn2Flag = false
              this.btn3Flag = false
              this.btn4Flag = false
              this.btn5Flag = true
            }
          }
        }
        this.runChart1DayType = this.btn1Flag ? '1' : (this.btn2Flag ? '2' : (this.btn3Flag ? '3' : (this.btn4Flag ? '4' : (this.btn5Flag ? '5' : ''))))
        this.runChart2DayType = this.btn1Flag ? '1' : (this.btn2Flag ? '2' : (this.btn3Flag ? '3' : (this.btn4Flag ? '4' : (this.btn5Flag ? '5' : ''))))
        if (this.runChart1DayType !== '') {
          this.query()
        }
        if (this.runChart2DayType !== '') {
          this.query1()
        }
      },
      query() {
        const para = {
          syhFllb: this.filters.syhFllb.join(','),
          childFlag: this.filters.childFlag,
          dateType: this.filters.queryType,
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          type: this.runChart1DayType,
          deptCode: this.filters.departCode,
          deptType: this.curDept.depType,
          totalMonth: this.totalMonthValue.date,
          totalMode: this.totalMonthValue.mode
        }
        this.runChart1Loading = true
        this.$query('/analysis/caseTime', para).then((response) => {
          this.buildRunChart1Data(response)
          this.runChart1Loading = false
        }).catch(() => {
          this.runChart1Loading = false
        })
      },
      buildRunChart1Data(response) {
        let times = []
        if (this.runChart1DayType === '1') {
          times = this.getYear()
        }
        if (this.runChart1DayType === '2') {
          times = this.getQuarter()
        }
        if (this.runChart1DayType === '3' || this.runChart1DayType === '4') {
          times = this.getMonth()
        }
        if (this.runChart1DayType === '5') {
          times = this.getDay()
        }
        const type1 = []
        const type2 = []
        const type3 = []
        const type4 = []
        const type5 = []
        const type6 = []
        const type7 = []
        for (let i = 0; i < times.length; i++) {
          const time = times[i]
          if (response.data === undefined || response.data === null || response.data.length === 0) {
            type1.push(0)
            type2.push(0)
            type3.push(0)
            type4.push(0)
            type5.push(0)
            type6.push(0)
            type7.push(0)
          } else {
            let flag = false
            for (let j = 0; j < response.data.length; j++) {
              const item = response.data[j]
              if (time === item.date) {
                flag = true
                type1.push(item.type1)
                type2.push(item.type2)
                type3.push(item.type3)
                type4.push(item.type4)
                type5.push(item.type5)
                type6.push(item.type6)
                type7.push(item.type7)
                break
              }
            }
            if (!flag) {
              type1.push(0)
              type2.push(0)
              type3.push(0)
              type4.push(0)
              type5.push(0)
              type6.push(0)
              type7.push(0)
            }
          }
        }
        this.runChart1Data.type1 = type1
        this.runChart1Data.type2 = type2
        this.runChart1Data.type3 = type3
        this.runChart1Data.type4 = type4
        this.runChart1Data.type5 = type5
        this.runChart1Data.type6 = type6
        this.runChart1Data.type7 = type7
        this.buildRunChart(times, type1)
      },
      query1() {
        const para = {
          syhFllb: this.filters.syhFllb.join(','),
          childFlag: this.filters.childFlag,
          dateType: this.filters.queryType,
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          type: this.runChart2DayType,
          deptCode: this.filters.departCode,
          deptType: this.curDept.depType,
          totalMonth: this.totalMonthValue.date,
          totalMode: this.totalMonthValue.mode
        }
        this.runChart2Loading = true
        this.$query('/analysis/caseContrast', para).then((response) => {
          this.buildRunChart2Data(response)
          this.runChart2Loading = false
        }).catch(() => {
          this.runChart2Loading = false
        })
      },
      buildRunChart2Data(response) {
        let times = []
        if (this.runChart2DayType === '1') {
          times = this.getYear()
        }
        if (this.runChart2DayType === '2') {
          times = this.getQuarter()
        }
        if (this.runChart2DayType === '3' || this.runChart2DayType === '4') {
          times = this.getMonth()
        }
        if (this.runChart2DayType === '5') {
          times = this.getDay()
        }
        const type1 = []
        const type2 = []
        const type3 = []
        const type4 = []
        const type5 = []
        const type6 = []
        const type7 = []
        const tb_type1 = []
        const tb_type2 = []
        const tb_type3 = []
        const tb_type4 = []
        const tb_type5 = []
        const tb_type6 = []
        const tb_type7 = []
        const hb_type1 = []
        const hb_type2 = []
        const hb_type3 = []
        const hb_type4 = []
        const hb_type5 = []
        const hb_type6 = []
        const hb_type7 = []
        for (let i = 0; i < times.length; i++) {
          const time = times[i]
          if (response.data === undefined || response.data === null || response.data.length === 0) {
            type1.push(0)
            type2.push(0)
            type3.push(0)
            type4.push(0)
            type5.push(0)
            type6.push(0)
            type7.push(0)
            tb_type1.push(0)
            tb_type2.push(0)
            tb_type3.push(0)
            tb_type4.push(0)
            tb_type5.push(0)
            tb_type6.push(0)
            tb_type7.push(0)
            hb_type1.push(0)
            hb_type2.push(0)
            hb_type3.push(0)
            hb_type4.push(0)
            hb_type5.push(0)
            hb_type6.push(0)
            hb_type7.push(0)
          } else {
            let flag = false
            for (let j = 0; j < response.data.length; j++) {
              const item = response.data[j]
              if (time === item.date) {
                flag = true
                type1.push(item.type1)
                type2.push(item.type2)
                type3.push(item.type3)
                type4.push(item.type4)
                type5.push(item.type5)
                type6.push(item.type6)
                type7.push(item.type7)
                tb_type1.push(item.tb_type1)
                tb_type2.push(item.tb_type2)
                tb_type3.push(item.tb_type3)
                tb_type4.push(item.tb_type4)
                tb_type5.push(item.tb_type5)
                tb_type6.push(item.tb_type6)
                tb_type7.push(item.tb_type7)
                hb_type1.push(item.hb_type1)
                hb_type2.push(item.hb_type2)
                hb_type3.push(item.hb_type3)
                hb_type4.push(item.hb_type4)
                hb_type5.push(item.hb_type5)
                hb_type6.push(item.hb_type6)
                hb_type7.push(item.hb_type7)
                break
              }
            }
            if (!flag) {
              type1.push(0)
              type2.push(0)
              type3.push(0)
              type4.push(0)
              type5.push(0)
              type6.push(0)
              type7.push(0)
              tb_type1.push(0)
              tb_type2.push(0)
              tb_type3.push(0)
              tb_type4.push(0)
              tb_type5.push(0)
              tb_type6.push(0)
              tb_type7.push(0)
              hb_type1.push(0)
              hb_type2.push(0)
              hb_type3.push(0)
              hb_type4.push(0)
              hb_type5.push(0)
              hb_type6.push(0)
              hb_type7.push(0)
            }
          }
        }
        this.runChart2Data.type1 = type1
        this.runChart2Data.type2 = type2
        this.runChart2Data.type3 = type3
        this.runChart2Data.type4 = type4
        this.runChart2Data.type5 = type5
        this.runChart2Data.type6 = type6
        this.runChart2Data.type7 = type7
        this.runChart2Data.tb_type1 = tb_type1
        this.runChart2Data.tb_type2 = tb_type2
        this.runChart2Data.tb_type3 = tb_type3
        this.runChart2Data.tb_type4 = tb_type4
        this.runChart2Data.tb_type5 = tb_type5
        this.runChart2Data.tb_type6 = tb_type6
        this.runChart2Data.tb_type7 = tb_type7
        this.runChart2Data.hb_type1 = hb_type1
        this.runChart2Data.hb_type2 = hb_type2
        this.runChart2Data.hb_type3 = hb_type3
        this.runChart2Data.hb_type4 = hb_type4
        this.runChart2Data.hb_type5 = hb_type5
        this.runChart2Data.hb_type6 = hb_type6
        this.runChart2Data.hb_type7 = hb_type7
        this.buildRunChart1(this.runChartTypeArr[0].barTxt, this.runChart2Data.type1, this.runChart2Data.tb_type1, this.runChart2Data.hb_type1, times, this.runChartTypeArr[0].label)
      },
      handleClick() {
        this.runChart1Type = ['1']
        this.runChart2Type = '1'
        if (this.filters.time === undefined || this.filters.time === null || this.filters.time.length === 0) {
          this.$message({
            message: '请选择自定义时间区间',
            type: 'warning'
          })
          return false
        }
        this.query()
        this.query1()
      },
      restForm() {
        this.filters = {
          queryType: '1',
          time: [],
          timeType: '1',
          syhFllb: [],
          childFlag: true,
          ajzt: '',
          departCode: ''
        }
        this.timeTypeChange()
        this.handleClick()
      },
      buildTime(para) {
        const systemDate = new Date(this.systemTime)
        let startTime = ''
        let endTime = ''
        if (this.filters.timeType === '1') {
          startTime = systemDate.getFullYear() + '-01-01 00:00:00'
          const day = new Date(systemDate.getFullYear(), 12, 0)
          endTime = systemDate.getFullYear() + '-12-' + day.getDate() + ' 23:59:59'
        }
        if (this.filters.timeType === '2') {
          startTime = systemDate.getFullYear() + '-01-01 00:00:00'
          const day = new Date(systemDate.getFullYear(), 6, 0)
          endTime = systemDate.getFullYear() + '-6-' + day.getDate() + ' 23:59:59'
        }
        if (this.filters.timeType === '3') {
          startTime = systemDate.getFullYear() + '-07-01 00:00:00'
          const day = new Date(systemDate.getFullYear(), 12, 0)
          endTime = systemDate.getFullYear() + '-12-' + day.getDate() + ' 23:59:59'
        }
        if (this.filters.timeType === '4') {
          if (systemDate.getMonth() + 1 <= 3) {
            startTime = systemDate.getFullYear() + '-01-01 00:00:00'
            endTime = systemDate.getFullYear() + '-03-31 23:59:59'
          } else if (systemDate.getMonth() + 1 > 3 && systemDate.getMonth() + 1 <= 6) {
            startTime = systemDate.getFullYear() + '-04-01 00:00:00'
            endTime = systemDate.getFullYear() + '-06-30 23:59:59'
          } else if (systemDate.getMonth() + 1 > 6 && systemDate.getMonth() + 1 <= 9) {
            startTime = systemDate.getFullYear() + '-07-01 00:00:00'
            endTime = systemDate.getFullYear() + '-09-30 23:59:59'
          } else if (systemDate.getMonth() + 1 > 9 && systemDate.getMonth() + 1 <= 12) {
            startTime = systemDate.getFullYear() + '-10-01 00:00:00'
            endTime = systemDate.getFullYear() + '-12-31 23:59:59'
          }
        }
        if (this.filters.timeType === '5') {
          startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-01 00:00:00'
          const day = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0)
          endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + day.getDate() + ' 23:59:59'
        }
        if (this.filters.timeType === '6') {
          systemDate.setDate(systemDate.getDate() - systemDate.getDay() + 1)
          startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 00:00:00'
          systemDate.setDate(systemDate.getDate() + 6)
          endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 23:59:59'
        }
        if (this.filters.timeType === '8') {
          startTime = this.$parseTime(systemDate, '{y}-{m}-{d}') + ' 00:00:00'
          endTime = this.$parseTime(systemDate, '{y}-{m}-{d}') + ' 23:59:59'
        }
        para.startTime = startTime
        para.endTime = endTime
        // 赋当前时间
        return para
      },
      getSysTime() {
        this.$query('knowledge/queryTime').then(response => {
          this.systemTime = response.data
          this.timeTypeChange()
        })
      },
      startDateChange(val, key) {
        if (val === undefined || val === null || val === '') {
          this.filters[key] = ''
        }
      },
      initAjzt() { // 初始化案件状态数据源
        this.$query('tcpcode', { codeLx: 'ajzt' }).then((response) => {
          if (response.data && response.data.length > 0) {
            const temp = {}
            for (let index = 0; index < response.data.length; index++) {
              const element = response.data[index]
              if (temp[element.codeName] !== undefined && temp[element.codeName] !== '') {
                temp[element.codeName] = temp[element.codeName] + ',' + element.code
              } else {
                temp[element.codeName] = element.code
              }
            }
            const arr = []
            const arr1 = []
            for (const key in temp) {
              arr.push({ code: temp[key], codeName: key })
              arr1.push({ value: temp[key], text: key })
            }
            this.ajztData = arr
          }
        }).catch(() => {
        })
      },
      buildRunChart(times, data) {
        const minMaxArr = this.getMinMax(JSON.parse(JSON.stringify(data)))
        const dom = document.getElementById('container')
        let start = 0
        if (data.length > 12) {
          if (data.length % (data.length - 12) !== 0) {
            start = ((data.length - 12 + 1) / data.length) * 100
          } else {
            start = ((data.length - 12) / data.length) * 100
          }
        }
        this.runChart1 = echarts.init(dom)
        this.runChart1Option = {
          title: {
            text: '案件趋势分析',
            subtext: '',
            x: 'left',
            textStyle: {
              color: 'transparent'
            }
          },
          // legend: { // selectedMode: 'multiple' || 'single'
          //   data: ['案件（起）', '抓获（人）', '刑拘（人）', '批捕（人）', '移诉（人）', '捣毁窝点（个）', '涉案金额（万元）'],
          //   textStyle: {
          //     color: '#fft'
          //   }
          // },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '4%',
            right: '6%',
            top: '15%',
            containLabel: true
          },
          toolbox: {
            right: 50,
            top: -5,
            feature: {
              saveAsImage: {
                show: true,
                title: '保存为图片',
                icon: 'image://static/image/download.png'
              }
            },
            itemSize: 20,
            iconStyle: {
              emphasis: { color: this.xyColor }
            }
          },
          xAxis: {
            type: 'category',
            data: times,
            axisLine: {
              lineStyle: {
                color: this.xyColor,
                width: 1
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '案件（起）',
              min: minMaxArr[0],
              max: minMaxArr[1],
              splitLine: {
                lineStyle: {
                  color: this.xyColor
                }
              },
              nameTextStyle: {
                color: this.xyColor
              },
              axisLine: {
                lineStyle: {
                  color: this.xyColor,
                  width: 1
                }
              }
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              start: start,
              end: 100,
              zoomOnMouseWheel: false
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              textStyle: {
                color: this.xyColor
              },
              handleStyle: {
                color: this.xyColor,
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }
          ],
          series: [
            {
              name: '案件（起）',
              data: data,
              type: 'line',
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              color: ['#ff577c']
            }
          ]
        }
        if (this.runChart1Option && typeof this.runChart1Option === 'object') {
          this.runChart1.setOption(this.runChart1Option, true)
        }
      },
      buildRunChart1(name, data0, data1, data2, times, yText) {
        const dom = document.getElementById('container1')
        let start = 0
        if (data0.length > 12) {
          if (data0.length % (data0.length - 12) !== 0) {
            start = ((data0.length - 12 + 1) / data0.length) * 100
          } else {
            start = ((data0.length - 12) / data0.length) * 100
          }
        }
        this.runChart2 = echarts.init(dom)
        const app = {}
        const posList = [
          'left', 'right', 'top', 'bottom',
          'inside',
          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ]
        app.configParameters = {
          rotate: {
            min: -90,
            max: 90
          },
          align: {
            options: {
              left: 'left',
              center: 'center',
              right: 'right'
            }
          },
          verticalAlign: {
            options: {
              top: 'top',
              middle: 'middle',
              bottom: 'bottom'
            }
          },
          position: {
            options: echarts.util.reduce(posList, function(map, pos) {
              map[pos] = pos
              return map
            }, {})
          },
          distance: {
            min: 0,
            max: 100
          }
        }
        app.config = {
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          onChange: function() {
            const labelOption = {
              normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
              }
            }
            this.runChart2.setOption({
              series: [{
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }]
            })
          }
        }
        const labelOption = {
          show: false,
          position: app.config.position,
          distance: app.config.distance,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          rotate: app.config.rotate,
          formatter: '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        }
        this.runChart2Option = {
          title: {
            text: '案件同比/环比分析',
            subtext: '',
            x: 'left',
            textStyle: {
              color: 'transparent'
            }
          },
          color: ['#399FFE', '#4CC973', '#F9D237'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '4%',
            right: '6%',
            containLabel: true
          },
          legend: {
            data: [],
            textStyle: {
              color: '#fft'
            }
          },
          toolbox: {
            right: 50,
            top: 0,
            feature: {
              saveAsImage: {
                show: true,
                title: '保存为图片',
                icon: 'image://static/image/download.png'
              }
            },
            itemSize: 20,
            iconStyle: {
              emphasis: { color: '#fff' }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: times,
              axisLine: {
                lineStyle: {
                  color: this.xyColor,
                  width: 1
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: yText,
              axisLine: {
                lineStyle: {
                  color: this.xyColor,
                  width: 1
                }
              },
              splitLine: {
                lineStyle: {
                  color: this.xyColor
                }
              }
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              start: start,
              end: 100,
              zoomOnMouseWheel: false
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              textStyle: {
                color: this.xyColor
              },
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }
          ],
          series: []
        }
        this.runChart2Option.legend.data.push(name)
        this.runChart2Option.series.push({
          name: name,
          type: 'bar',
          barGap: 0,
          label: labelOption,
          data: data0,
          barMaxWidth: 50
        })
        if (this.runChart2DayType !== '1') {
          this.runChart2Option.legend.data.push('同比数量')
          this.runChart2Option.series.push({
            name: '同比数量',
            type: 'bar',
            label: labelOption,
            data: data1,
            barMaxWidth: 50
          })
        }
        this.runChart2Option.legend.data.push('环比数量')
        this.runChart2Option.series.push({
          name: '环比数量',
          type: 'bar',
          label: labelOption,
          data: data2,
          barMaxWidth: 50
        })
        if (this.runChart2Option && typeof this.runChart2Option === 'object') {
          this.runChart2.setOption(this.runChart2Option, true)
        }
      },
      clickDayType(event) {
        if (this.runChart1DayType === event) {
          return false
        }
        this.runChart1DayType = event
        this.runChart1Type = ['1']
        this.query()
      },
      clickDayType1(event) {
        if (this.runChart2DayType === event) {
          return false
        }
        this.runChart2DayType = event
        this.runChart2Type = '1'
        this.query1()
      },
      runChart1TypeChange() {
        if (this.runChart1Type === undefined || this.runChart1Type === null || this.runChart1Type.length === 0) {
          this.runChart1Type = ['1']
        }
        this.runChart1Option.series = []
        this.runChart1Option.yAxis = []
        let yIndex = 0
        for (let i = 0; i < this.runChartTypeArr.length; i++) {
          const item = this.runChartTypeArr[i]
          const index = parseInt(item.value)
          if (this.runChart1Type.indexOf(item.value) > -1) {
            const series = {
              name: item.label,
              type: 'line',
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              color: [item.color],
              data: this.runChart1Data['type' + index]
            }
            if (yIndex !== 0) {
              series.yAxisIndex = yIndex
            }
            this.runChart1Option.series.push(series)
            const array = JSON.parse(JSON.stringify(this.runChart1Data['type' + index]))
            const minMaxArr = this.getMinMax(array)
            const yAxis = {
              type: 'value',
              name: item.label,
              min: minMaxArr[0],
              max: minMaxArr[1],
              splitLine: {
                lineStyle: {
                  color: this.xyColor
                }
              },
              nameTextStyle: {
                color: this.xyColor
              },
              axisLine: {
                lineStyle: {
                  color: this.xyColor,
                  width: 1
                }
              }
            }
            this.runChart1Option.grid.right = '6%'
            if (yIndex !== 0) {
              yAxis.position = 'right'
              if (yIndex > 1) {
                let offset = this.runChart1Option.yAxis[this.runChart1Option.yAxis.length - 1].offset
                if (offset === undefined) {
                  offset = 0
                }
                yAxis.offset = offset + item.offset
                this.runChart1Option.grid.right = 3 * yIndex + '%'
              }
            }
            this.runChart1Option.yAxis.push(yAxis)
            yIndex += 1
          }
        }
        this.runChart1.setOption(this.runChart1Option, true)
      },
      runChart2TypeChange() {
        if (this.runChart2Type === undefined || this.runChart2Type === null || this.runChart2Type === '') {
          this.runChart2Type = '1'
        }
        let times = []
        if (this.runChart2DayType === '1') {
          times = this.getYear()
        }
        if (this.runChart2DayType === '2') {
          times = this.getQuarter()
        }
        if (this.runChart2DayType === '3' || this.runChart2DayType === '4') {
          times = this.getMonth()
        }
        if (this.runChart2DayType === '5') {
          times = this.getDay()
        }
        for (let i = 0; i < this.runChartTypeArr.length; i++) {
          const item = this.runChartTypeArr[i]
          const index = parseInt(item.value)
          if (String(this.runChart2Type) === String(item.value)) {
            this.buildRunChart1(item.barTxt, this.runChart2Data['type' + index], this.runChart2Data['tb_type' + index], this.runChart2Data['hb_type' + index], times, item.label)
          }
        }
      },
      compare(val1, val2) {
        return val1 - val2
      },
      formatNumber(number, n) {
        return (Array(n).join(0) + number).slice(-n)
      },
      getYear() {
        const startTime = new Date(this.filters.time[0])
        const endTime = new Date(this.filters.time[1])
        const startYear = startTime.getFullYear()
        const endYear = endTime.getFullYear()
        const arr = []
        for (let i = startYear; i <= endYear; i++) {
          arr.push(i + '年')
        }
        return arr
      },
      getMonth() {
        const startTime = new Date(this.filters.time[0])
        const endTime = new Date(this.filters.time[1])
        const startYear = startTime.getFullYear()
        const endYear = endTime.getFullYear()
        const c = endYear - startYear
        if (c === 0) {
          const startMonth = startTime.getMonth()
          const endMonth = endTime.getMonth()
          const arr = []
          for (let i = startMonth; i <= endMonth; i++) {
            arr.push(startYear + '年' + this.formatNumber(i + 1, 2) + '月')
          }
          return arr
        } else {
          const arr = []
          for (let i = startYear; i <= endYear; i++) {
            const startMonth = startTime.getMonth()
            const endMonth = endTime.getMonth()
            if (i === startYear) {
              for (let j = startMonth; j <= 11; j++) {
                arr.push(i + '年' + this.formatNumber(j + 1, 2) + '月')
              }
            }
            if (i === endYear) {
              for (let j = 0; j <= endMonth; j++) {
                arr.push(i + '年' + this.formatNumber(j + 1, 2) + '月')
              }
            }
          }
          return arr
        }
      },
      getQuarter() {
        const startTime = new Date(this.filters.time[0])
        const endTime = new Date(this.filters.time[1])
        const startYear = startTime.getFullYear()
        const endYear = endTime.getFullYear()
        const c = endYear - startYear
        const numArr = ['一', '二', '三', '四']
        if (c === 0) {
          const startMonth = startTime.getMonth() + 1
          const endMonth = endTime.getMonth() + 1
          const startQ = Math.floor((startMonth % 3 === 0 ? (startMonth / 3) : (startMonth / 3 + 1)))
          const endQ = Math.floor((endMonth % 3 === 0 ? (endMonth / 3) : (endMonth / 3 + 1)))
          const arr = []
          for (let i = startQ; i <= endQ; i++) {
            arr.push(startYear + '年' + '第' + numArr[i - 1] + '季度')
          }
          return arr
        } else {
          const arr = []
          const startMonth = startTime.getMonth() + 1
          const endMonth = endTime.getMonth() + 1
          const startQ = Math.floor((startMonth % 3 === 0 ? (startMonth / 3) : (startMonth / 3 + 1)))
          const endQ = Math.floor((endMonth % 3 === 0 ? (endMonth / 3) : (endMonth / 3 + 1)))
          for (let i = startYear; i <= endYear; i++) {
            if (i === startYear) {
              for (let j = startQ; j <= 4; j++) {
                arr.push(i + '年' + '第' + numArr[j - 1] + '季度')
              }
            } else if (i === endYear) {
              for (let j = 1; j <= endQ; j++) {
                arr.push(i + '年' + '第' + numArr[j - 1] + '季度')
              }
            } else {
              for (let j = 1; j <= 4; j++) {
                arr.push(i + '年' + '第' + numArr[j - 1] + '季度')
              }
            }
          }
          return arr
        }
      },
      getDay() {
        const startTime = new Date(this.filters.time[0])
        const endTime = new Date(this.filters.time[1])
        const days = (endTime.getTime() - startTime.getTime()) / (24 * 60 * 60 * 1000)
        const arr = []
        for (let i = 0; i <= days; i++) {
          const date = new Date(this.filters.time[0])
          arr.push(this.$parseTime(date.setDate(startTime.getDate() + i), '{y}-{m}-{d}'))
        }
        return arr
      },
      queryTotalMonth() {
        this.$query('sysconfig', { configKey: 'caseAnalysis' }).then(response => {
          const value = JSON.parse(response.data[0].configValue)
          this.totalMonthValue = value
          this.totalMonthTxt = value.message
          this.getSysTime()
          // const m1 = 11
          // const m2 = 12
          // const d = parseInt(value.date)
          // let date0 = ''
          // let date = ''
          // if (d > 31) {
          //   const c = d - 31
          //   date = this.formatNumber(c, 2)
          //   date0 = this.formatNumber(c + 1, 2)
          // } else if (d < 1) {
          //   const c = d - 31
          //   date = this.formatNumber(c, 2)
          //   date0 = this.formatNumber(c + 1, 2)
          // } else {
          //   date = this.formatNumber(d, 2)
          //   date0 = this.formatNumber(d + 1, 2)
          // }
          // if (value.mode === 'add') {
          //   this.totalMonthTxt = '按照总队要求统计，前一个月' + date0 + '日到次月' + date + '日算是次月统计总数。如：' + m1 + '月' + date0 + '日至' + m2 + '月' + date + '日，为' + m2 + '月统计数据。'
          // }
          // if (value.mode === 'subtract') {
          //   this.totalMonthTxt = '按照总队要求统计，前一个月' + date0 + '日到次月' + date + '日算是前一个月统计总数。如：' + m1 + '月' + date0 + '日至' + m2 + '月' + date + '日，为' + m1 + '月统计数据。'
          // }
        })
      },
      getMinMax(array) {
        array.sort(this.compare)
        const max = array[array.length - 1]
        if (max === 0) {
          return [0, 10]
        }
        let len = String(max).length
        if (String(max).indexOf('.') > -1) {
          len = String(max).split('.')[0].length
        }
        const num = parseInt('1' + this.formatNumber(0, len))
        if (max > num) {
          const a = Math.round(max / num)
          return [0, a * num]
        }
        return [0, num]
        // let num = parseInt('1' + this.formatNumber(0, String(max).length))
        // if (String(max).indexOf('.') > -1) {
        //   console.info(this.formatNumber(0, String(max).split('.')[0]))
        //   num = parseInt('1' + this.formatNumber(0, String(max).split('.')[0].length))
        // }
        // const a = Math.round(max / num)
        // if (a === 0) {
        //   return [0, parseInt('1' + num) / 2]
        // }
        // return [0, a * num]
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.countHeight = document.documentElement.clientHeight - 230
      let currentDepartment = []
      if (this.curDept.depType === '-1') { // 省
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '1') { // 总队
        currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
      } else if (this.curDept.depType === '2') { // 支队
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '3') { // 大队
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '4') { // 派出所
        if (this.curDept.areaCode === '611400') {
          currentDepartment = [this.curDept.parentDepCode]
        } else {
          currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
        }
      }
      this.filters.departCode = currentDepartment[currentDepartment.length - 1]
      this.queryTotalMonth()
      this.initAjzt()
    }
  }
</script>
<style>
  .timeTrendAnalysis .content {
    padding: 0 10px;
  }
  .timeTrendAnalysis .el-card.is-always-shadow .el-card__body > div.all{
    height: 50px;
  }
  .timeTrendAnalysis .el-card.is-always-shadow .el-card__body ul{
    margin-left: 20px;
  }
  .timeTrendAnalysis .el-range-editor.is-disabled{
    background: none;
  }
  .timeTrendAnalysis .el-range-editor.is-disabled input{
    background: none;
  }
  .timeTrendAnalysis .time_left{
    margin-left: 15px;
  }
  .timeTrendAnalysis .time_left .el-form-item__label{
    width: 75px !important;
  }
  .message_tooltip{
    color: #555
  }
  .timeTrendAnalysis .runChart{
    height: 100%;
    margin-top: 30px;
  }
  .timeTrendAnalysis .runChart_title{
  }
  .timeTrendAnalysis .runChart_title > span:first-child {
    font-size: 18px;
    font-weight: bold;
  }
  .timeTrendAnalysis .runChart_title .el-tooltip{
    margin-left: 10px;
  }
  .timeTrendAnalysis .runChart_title .runChart_title_query{
    margin-left: 50px;
  }
  .timeTrendAnalysis .runChart_title .runChart_title_query .el-select.el-select--small {
    width: 42%;
  }
  /*.timeTrendAnalysis .runChart_title .runChart_title_query .el-select.el-select--small .el-tag.el-tag--info.el-tag--mini:first-child .el-tag__close.el-icon-close {*/
    /*display: none;*/
  /*}*/
  .timeTrendAnalysis .runChart_title .runChart_title_btn{
    margin-top: 20px;
    height: 24px;
  }
  .timeTrendAnalysis .runChart_title .runChart_title_btn > button{
    background-color: rgba(0, 89, 130, 0.6);
    color: #fff;
    border-color: rgba(0, 160, 233, 0.6);
  }
  .timeTrendAnalysis .runChart_title .runChart_title_btn > button:hover{
    background-color: rgba(0, 89, 130, 0.6);
  }
  .timeTrendAnalysis .runChart_title .runChart_title_btn > button:last-child{
    margin-left: 10px;
  }
  .timeTrendAnalysis .runChart_title .runChart_title_btn > button.active {
    background-color: rgba(75, 173, 219, 1);
  }
  .timeTrendAnalysis .runChart .runChart_container{
    height: 500px;
  }
  .timeTrendAnalysis .mar_top_50{
    margin-top: 50px;
  }
</style>
