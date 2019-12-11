<template>
  <section class="caseAssist_totalList">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="content">
            <el-card>
              <el-form :inline="true" :model="filters" label-width="80px">
                <el-form-item label="案件类型">
                  <el-select v-model="filters.type" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="环境" value="3"></el-option>
                    <el-option label="食品" value="1"></el-option>
                    <el-option label="药品" value="2"></el-option>
                    <el-option label="综合" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="filters.timeType" @change="radioChange">
                    <el-radio label="1">本年</el-radio>
                    <el-radio label="2">本年上半年</el-radio>
                    <el-radio label="3">本年下半年</el-radio>
                    <el-radio label="4">本季</el-radio>
                    <el-radio label="5">本月</el-radio>
                    <el-radio label="6">本周</el-radio>
                    <el-radio label="7">时间段&nbsp;&nbsp;&nbsp;&nbsp;
                      <el-date-picker :disabled="filters.timeType !== '7'" v-model="filters.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                      <!--<el-date-picker :disabled="filters.timeType !== '7'" v-model="filters.startDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" @change="startDateChange($event, 'endDate')"></el-date-picker>-->
                      <!--<el-form-item label="至" class="time_left">-->
                        <!--<el-date-picker :disabled="filters.startDate === undefined || filters.startDate === null || filters.startDate === ''" v-model="filters.endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>-->
                      <!--</el-form-item>-->
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-if="$isViewBtn('139006')" @click="handleClick" icon="el-icon-search">查询</el-button>
                </el-form-item>
              </el-form>
              <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="案件协查情况" name="0">
                  <el-table :data="caseAssistData" :border="false" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-table :data="scope.row.caseAssistDataList" v-loading="listChildLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                          <el-table-column prop="" width="128">
                            <template slot-scope="scopeEx">
                            </template>
                          </el-table-column>
                          <el-table-column prop="departName" align="center" label="单位" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" label="协查案件数">
                            <el-table-column prop="total1" align="center" width="100" label="环境" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="食品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="药品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="总计" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                          <el-table-column prop="total1" align="center" width="120" label="移送行政部门处理（次）" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" label="侦办刑事案件">
                            <el-table-column prop="total00" align="center" width="120" label="立案（起）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total01" align="center" width="120" label="破案（起）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total02" align="center" width="120" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total03" align="center" width="120" label="刑事拘留（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total5" align="center" width="120" label="批准逮捕（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total7" align="center" width="160" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="80" label="序号"></el-table-column>
                    <el-table-column prop="areaName" align="center" label="地市" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="协查案件数">
                      <el-table-column prop="total1" align="center" width="100" label="环境" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="食品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="药品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="总计" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column prop="total1" align="center" width="120" label="移送行政部门处理（次）" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="侦办刑事案件">
                      <el-table-column prop="total00" align="center" width="120" label="立案（起）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total01" align="center" width="120" label="破案（起）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total02" align="center" width="120" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total03" align="center" width="120" label="刑事拘留（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total5" align="center" width="120" label="批准逮捕（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total7" align="center" width="160" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="线索协查情况" name="1">
                  <el-table :data="clueAssistData" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-table :data="scope.row.clueAssistDataList" v-loading="listChildLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                          <el-table-column prop="" width="128">
                            <template slot-scope="scopeEx">
                            </template>
                          </el-table-column>
                          <el-table-column prop="departName" align="center" label="单位" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" label="线索核查核实情况（条）">
                            <el-table-column prop="total1" align="center" width="100" label="环境" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="食品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="药品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total1" align="center" width="100" label="总计" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                          <el-table-column prop="total1" align="center" width="120" label="移送行政部门处理（次）" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" label="侦办刑事案件">
                            <el-table-column prop="total00" align="center" width="120" label="立案（起）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total01" align="center" width="120" label="破案（起）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total02" align="center" width="120" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total03" align="center" width="120" label="刑事拘留（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total5" align="center" width="120" label="批准逮捕（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="total7" align="center" width="160" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="80" label="序号"></el-table-column>
                    <el-table-column prop="areaName" align="center" label="地市" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="线索核查核实情况（条）">
                      <el-table-column prop="total1" align="center" width="100" label="环境" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="食品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="药品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total1" align="center" width="100" label="总计" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column prop="total1" align="center" width="120" label="移送行政部门处理（次）" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="侦办刑事案件">
                      <el-table-column prop="total00" align="center" width="120" label="立案（起）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total01" align="center" width="120" label="破案（起）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total02" align="center" width="120" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total03" align="center" width="120" label="刑事拘留（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total5" align="center" width="120" label="批准逮捕（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="total7" align="center" width="160" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  export default {
    name: 'caseAssist_totalList',
    data() {
      return {
        activeName: '0',
        expands: [],
        filters: {
          cityCode: '1',
          type: '',
          departCode: '',
          time: [],
          timeType: '1'
        },
        listLoading: false,
        listChildLoading: false,
        caseAssistData: [],
        caseAssistDataList: [],
        clueAssistData: [],
        clueAssistDataList: [],
        countHeight: null,
        curDept: {},
        curUser: {},
        systemTime: ''
      }
    },
    methods: {
      radioChange(value) {
        const para = this.buildTime({})
        this.filters.time = [para.startTime, para.endTime]
      },
      rowClick(row, expandedRows) {
        if (this.expands.indexOf(row.departCode) > -1) {
          this.expands.splice(this.expands.indexOf(row.departCode), 1)
        } else {
          this.expands.push(row.departCode)
          this.query(true, row.departCode)
        }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      },
      getRowKeys(row) {
        return row.departCode
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '总计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index === 9) {
              sums[index] = this.$buildTime(sums[index])
            } else {
              sums[index] = sums[index]
            }
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      query(flag, departCode) {
        const para = {
          type: this.filters.type,
          startTime: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          endTime: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          cityCode: '1'
        }
        if (flag) {
          this.listChildLoading = true
          para.departCode = departCode
        } else {
          this.listLoading = true
        }
        this.$update('knowledge/queryTrainCrouse', para).then((response) => {
          if (flag) {
            this.listChildLoading = false
            for (let i = 0; i < this.curriculumData.length; i++) {
              const item = this.curriculumData[i]
              if (item.departCode === departCode) {
                item.caseAssistDataList = response.data
              }
            }
          } else {
            this.listLoading = false
            this.caseAssistData = response.data
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      query1(flag, departCode) {
        const para = {
          type: this.filters.type,
          startTime: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          endTime: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          cityCode: '1'
        }
        if (flag) {
          this.listChildLoading = true
          para.departCode = departCode
        } else {
          this.listLoading = true
        }
        this.$update('knowledge/queryTrainCrouse', para).then((response) => {
          if (flag) {
            this.listChildLoading = false
            for (let i = 0; i < this.curriculumData.length; i++) {
              const item = this.curriculumData[i]
              if (item.departCode === departCode) {
                item.clueAssistDataList = response.data
              }
            }
          } else {
            this.listLoading = false
            this.clueAssistData = response.data
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleClick(item, event) {
        if (this.activeName === '0') {
          this.query()
        }
        if (this.activeName === '1') {
          this.query1()
        }
      },
      buildTime(para) {
        console.info(this.filters.timeType)
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
        para.startTime = startTime
        para.endTime = endTime
        // 赋当前时间
        if (this.filters.timeType !== '2') {
          para.endTime = this.$parseTime(new Date(this.systemTime), '{y}-{m}-{d}') + ' 23:59:59'
        }
        return para
      },
      getSysTime() {
        this.$query('knowledge/queryTime').then(response => {
          this.systemTime = response.data
          this.radioChange()
          this.query()
        })
      },
      startDateChange(val, key) {
        if (val === undefined || val === null || val === '') {
          this.filters[key] = ''
        }
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.countHeight = document.documentElement.clientHeight - 230
      this.getSysTime()
    }
  }
</script>

<style>
  .caseAssist_totalList .content {
    padding: 0 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .caseAssist_totalList .el-card.is-always-shadow .el-card__body > div.all{
    height: 50px;
  }
  .caseAssist_totalList .el-card.is-always-shadow .el-card__body ul{
    margin-left: 20px;
  }
  .caseAssist_totalList .el-table__body td.el-table__expanded-cell{
    padding: 0;
  }
  .caseAssist_totalList .el-table__body td.el-table__expanded-cell > div {
    margin: 0!important;
  }
  .caseAssist_totalList .el-table_1_column_1.el-table__expand-column{
    width: 100px;
  }
  .caseAssist_totalList .el-table__body-wrapper .is-center.left{
    text-align: left !important;
  }
  .caseAssist_totalList .el-table__body-wrapper .el-table__expanded-cell .is-center.left.is-leaf{
    text-align: center !important;
  }
  .caseAssist_totalList .el-table__body tbody > tr:first-child .el-table__expand-column .cell > div{
    display: none;
  }
  .caseAssist_totalList .el-range-editor.is-disabled{
    background: none;
  }
  .caseAssist_totalList .el-range-editor.is-disabled input{
    background: none;
  }
  .caseAssist_totalList .time_left{
    margin-left: 15px;
  }
  .caseAssist_totalList .time_left .el-form-item__label{
    width: 75px !important;
  }
  .caseAssist_totalList .el-table--border,
  .caseAssist_totalList .el-table--group,
  .caseAssist_totalList .el-table--border th,
  .caseAssist_totalList .el-table--border td,
  .caseAssist_totalList .el-table--border th.gutter:last-of-type{
    border: none;
  }
  .caseAssist_totalList .el-table--border::after,
  .caseAssist_totalList .el-table--group::after{
    width: 0;
  }
</style>
