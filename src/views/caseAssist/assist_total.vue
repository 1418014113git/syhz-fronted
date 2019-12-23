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
                  <el-button type="primary" @click="handleClick" icon="el-icon-search">查询</el-button>
                </el-form-item>
              </el-form>
              <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane :label="title + '情况'" name="0">
                  <el-table :data="caseAssistData" :class="curDept.depType !== '1' ? 'no_expand' : ''" :border="false" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-table :data="scope.row.list" v-loading="listChildLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                          <el-table-column prop="" width="118">
                            <template slot-scope="scopeEx">
                            </template>
                          </el-table-column>
                          <el-table-column prop="deptName" align="center" label="单位" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" :label="title + '数'">
                            <el-table-column prop="fqNum" align="center" width="90" label="发起" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.fqNum > 0 && enableTo(scope.row, true)" class="linkColor" @click="toAssistList(0, scope.row, true)">{{scope.row.fqNum}}</a>
                                <span v-else>{{scope.row.fqNum || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="cyNum" align="center" width="90" label="反馈" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.cyNum > 0 && enableTo(scope.row, true)" class="linkColor" @click="toAssistList(1, scope.row, true)">{{scope.row.cyNum}}</a>
                                <span v-else>{{scope.row.cyNum || 0}}</span>
                              </template>
                            </el-table-column>
                          </el-table-column>
                          <el-table-column align="center" label="协查案件数">
                            <el-table-column prop="hjnum" align="center" width="90" label="环境" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="spnum" align="center" width="90" label="食品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="ypnum" align="center" width="90" label="药品" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fllbnum" align="center" width="90" label="总计" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                          <el-table-column align="center" label="侦办刑事案件">
                            <el-table-column prop="larqCount" align="center" width="90" label="立案（起）" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.larqCount > 0" class="linkColor" @click="toCaseList(0, scope.row, true)">{{scope.row.larqCount}}</a>
                                <span v-else>{{scope.row.larqCount || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="parqCount" align="center" width="90" label="破案（起）" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.parqCount > 0" class="linkColor" @click="toCaseList(1, scope.row, true)">{{scope.row.parqCount}}</a>
                                <span v-else>{{scope.row.parqCount || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="zhrys" align="center" width="90" label="抓获（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="xsjl" align="center" width="90" label="刑拘（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="pzdb" align="center" width="90" label="批捕（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="yjss" align="center" width="90" label="移诉（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="dhwd" align="center" width="110" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="sajz" align="center" width="110" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="70" label="序号"></el-table-column>
                    <el-table-column prop="cityName" align="center" :label="areaTitle" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" :label="title + '数'">
                      <el-table-column prop="fqNum" align="center" width="90" label="发起" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.fqNum > 0 && enableTo(scope.row)" class="linkColor" @click="toAssistList(0, scope.row, false)">{{scope.row.fqNum}}</a>
                          <span v-else>{{scope.row.fqNum || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="cyNum" align="center" width="90" label="反馈" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.cyNum > 0 && enableTo(scope.row) && curDept.depType !== '1'" class="linkColor" @click="toAssistList(1, scope.row, false)">{{scope.row.cyNum}}</a>
                          <span v-else>{{scope.row.cyNum || 0}}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="协查案件数">
                      <el-table-column prop="hjnum" align="center" width="90" label="环境" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="spnum" align="center" width="90" label="食品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="ypnum" align="center" width="90" label="药品" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="fllbnum" align="center" width="90" label="总计" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="侦办刑事案件">
                      <el-table-column prop="larqCount" align="center" width="90" label="立案（起）" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.larqCount > 0 && enableTo(scope.row)" class="linkColor" @click="toCaseList(0, scope.row)">{{scope.row.larqCount}}</a>
                          <span v-else>{{scope.row.larqCount || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="parqCount" align="center" width="90" label="破案（起）" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.parqCount > 0 && enableTo(scope.row)" class="linkColor" @click="toCaseList(1, scope.row)">{{scope.row.parqCount}}</a>
                          <span v-else>{{scope.row.parqCount || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="zhrys" align="center" width="90" label="抓获（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="xsjl" align="center" width="90" label="刑拘（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="pzdb" align="center" width="90" label="批捕（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="yjss" align="center" width="90" label="移诉（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="dhwd" align="center" width="110" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="sajz" align="center" width="110" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="线索反馈情况" name="1">
                  <el-table :data="clueAssistData" :class="curDept.depType !== '1' ? 'no_expand' : ''" v-loading="listLoading" style="width: 100%; margin-top: 5px;" :max-height="countHeight" :span-method="arraySpanMethod" show-summary sum-text="总计" :summary-method="getSummaries1">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-table :data="scope.row.list" v-loading="listChildLoading" style="width: 100%; margin-top: 5px;"  :max-height="countHeight">
                          <el-table-column prop="" width="118">
                            <template slot-scope="scopeEx">
                            </template>
                          </el-table-column>
                          <el-table-column prop="deptName" align="center" label="单位" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" :label="title + '数'">
                            <el-table-column prop="fqNum" align="center" width="90" label="发起" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.fqNum > 0 && enableTo(scope.row, true)" class="linkColor" @click="toAssistList(0, scope.row)">{{scope.row.fqNum}}</a>
                                <span v-else>{{scope.row.fqNum || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="cyNum" align="center" width="90" label="反馈" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.cyNum > 0 && enableTo(scope.row, true)" class="linkColor" @click="toAssistList(1, scope.row)">{{scope.row.cyNum}}</a>
                                <span v-else>{{scope.row.cyNum || 0}}</span>
                              </template>
                            </el-table-column>
                          </el-table-column>
                          <el-table-column prop="qbxsNum" align="center" width="80" label="线索总数（条）" show-overflow-tooltip>
                            <template slot-scope="scope">
                              <a v-if="scope.row.qbxsNum > 0 && enableTo(scope.row, true)" class="linkColor" @click="toClueList('', scope.row, true)">{{scope.row.qbxsNum}}</a>
                              <span v-else>{{scope.row.qbxsNum || 0}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="线索核查核实情况（条）">
                            <el-table-column prop="cs" align="center" width="90" label="查实" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <!--<a v-if="scope.row.cs > 0 && enableTo(scope.row, true)" class="linkColor" @click="toClueList('2', scope.row, true)">{{scope.row.cs}}</a>-->
                                <!--<span v-else>{{scope.row.cs || 0}}</span>-->
                                <span>{{scope.row.cs || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="cf" align="center" width="90" label="查否" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <!--<a v-if="scope.row.cf > 0 && enableTo(scope.row, true)" class="linkColor" @click="toClueList('3', scope.row, true)">{{scope.row.cf}}</a>-->
                                <!--<span v-else>{{scope.row.cf || 0}}</span>-->
                                <span>{{scope.row.cf || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="whc" align="center" width="90" label="未核查" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <!--<a v-if="scope.row.whc > 0 && enableTo(scope.row, true)" class="linkColor" @click="toClueList('', scope.row, true)">{{scope.row.whc}}</a>-->
                                <!--<span v-else>{{scope.row.whc || 0}}</span>-->
                                <span>{{scope.row.whc || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="hcl" align="center" width="90" label="核查率" show-overflow-tooltip>
                              <template slot-scope="scope">
                                {{scope.row.hcl}} <span v-if="scope.row.hcl !== '-'">%</span>
                              </template>
                            </el-table-column>
                          </el-table-column>
                          <el-table-column align="center" label="侦办刑事案件">
                            <el-table-column prop="larqCount" align="center" width="90" label="立案（起）" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.larqCount > 0 && enableTo(scope.row, true)" class="linkColor" @click="toCaseList(0, scope.row, true)">{{scope.row.larqCount}}</a>
                                <span v-else>{{scope.row.larqCount || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="parqCount" align="center" width="90" label="破案（起）" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <a v-if="scope.row.parqCount > 0 && enableTo(scope.row, true)" class="linkColor" @click="toCaseList(1, scope.row, true)">{{scope.row.parqCount}}</a>
                                <span v-else>{{scope.row.parqCount || 0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="zhrys" align="center" width="90" label="抓获（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="xsjl" align="center" width="90" label="刑拘（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="pzdb" align="center" width="90" label="批捕（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="yjss" align="center" width="90" label="移诉（人）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="dhwd" align="center" width="110" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="sajz" align="center" width="110" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" width="70" label="序号"></el-table-column>
                    <el-table-column prop="cityName" align="center" :label="areaTitle" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" :label="title + '数'">
                      <el-table-column prop="fqNum" align="center" width="90" label="发起" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.fqNum > 0 && enableTo(scope.row)" class="linkColor" @click="toAssistList(0, scope.row)">{{scope.row.fqNum}}</a>
                          <span v-else>{{scope.row.fqNum || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="cyNum" align="center" width="90" label="反馈" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.cyNum > 0 && enableTo(scope.row) && curDept.depType !== '1'" class="linkColor" @click="toAssistList(1, scope.row)">{{scope.row.cyNum}}</a>
                          <span v-else>{{scope.row.cyNum || 0}}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column prop="qbxsNum" align="center" width="80" label="线索总数（条）" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a v-if="scope.row.qbxsNum > 0 && enableTo(scope.row)" class="linkColor" @click="toClueList('', scope.row)">{{scope.row.qbxsNum}}</a>
                        <span v-else>{{scope.row.qbxsNum || 0}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="线索核查核实情况（条）">
                      <el-table-column prop="cs" align="center" width="90" label="查实" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <!--<a v-if="scope.row.cs > 0 && enableTo(scope.row)" class="linkColor" @click="toClueList('2', scope.row)">{{scope.row.cs}}</a>-->
                          <!--<span v-else>{{scope.row.cs || 0}}</span>-->
                          <span>{{scope.row.cs || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="cf" align="center" width="90" label="查否" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <!--<a v-if="scope.row.cf > 0 && enableTo(scope.row)" class="linkColor" @click="toClueList('3', scope.row)">{{scope.row.cf}}</a>-->
                          <!--<span v-else>{{scope.row.cf || 0}}</span>-->
                          <span>{{scope.row.cf || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="whc" align="center" width="90" label="未核查" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <!--<a v-if="scope.row.whc > 0 && enableTo(scope.row)" class="linkColor" @click="toClueList('', scope.row)">{{scope.row.whc}}</a>-->
                          <!--<span v-else>{{scope.row.whc || 0}}</span>-->
                          <span>{{scope.row.whc || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="hcl" align="center" width="90" label="核查率" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.hcl}} <span v-if="scope.row.hcl !== '-'">%</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="侦办刑事案件">
                      <el-table-column prop="larqCount" align="center" width="90" label="立案（起）" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.larqCount > 0 && enableTo(scope.row)" class="linkColor" @click="toCaseList(0, scope.row)">{{scope.row.larqCount}}</a>
                          <span v-else>{{scope.row.larqCount || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="parqCount" align="center" width="90" label="破案（起）" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a v-if="scope.row.parqCount > 0 && enableTo(scope.row)" class="linkColor" @click="toCaseList(1, scope.row)">{{scope.row.parqCount}}</a>
                          <span v-else>{{scope.row.parqCount || 0}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="zhrys" align="center" width="90" label="抓获（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="xsjl" align="center" width="90" label="刑拘（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="pzdb" align="center" width="90" label="批捕（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="yjss" align="center" width="90" label="移诉（人）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="dhwd" align="center" width="110" label="捣毁窝点（个）" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="sajz" align="center" width="110" label="涉案金额（万元）" show-overflow-tooltip></el-table-column>
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
        title: '案件协查',
        areaTitle: '',
        assistType: '1', // 协查类型：1 案件协查  2 集群战役
        activeName: '0',
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
        clueAssistData: [],
        countHeight: null,
        curDept: {},
        curUser: {},
        systemTime: ''
      }
    },
    methods: {
      enableTo(row, flag) {
        if (this.curDept.depType === '1') {
          return true
        }
        if (this.curDept.areaCode === row.cityCode) {
          return true
        }
        if (flag && row.deptCode === this.curDept.depCode) {
          return true
        }
        return false
      },
      radioChange(value) {
        const para = this.buildTime({})
        this.filters.time = [para.startTime, para.endTime]
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
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
              sums[index] = sums[index]
            } else {
              sums[index] = sums[index]
            }
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      getSummaries1(param) {
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
              sums[index] = ((sums[6] + sums[7]) / sums[5] * 100).toFixed(2) + '%'
            } else {
              sums[index] = sums[index]
            }
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      query() {
        const para = {
          fllb: this.filters.type,
          type: this.assistType,
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          cityCode: '',
          deptCode: this.filters.departCode,
          deptType: this.curDept.depType
        }
        this.listLoading = true
        this.$query('/assistStatistics/assistAj', para).then((response) => {
          this.listLoading = false
          this.caseAssistData = response.data
        }).catch(() => {
          this.listLoading = false
        })
      },
      query1() {
        const para = {
          fllb: this.filters.type,
          type: this.assistType,
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          cityCode: '',
          departCode: this.filters.deptCode,
          deptType: this.curDept.depType
        }
        this.listLoading = true
        this.$query('assistStatistics/assistFk', para).then((response) => {
          this.listLoading = false
          this.clueAssistData = response.data
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
      },
      findParentDept(paramCode) {
        const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const item = deptArr[i]
          if (item.depCode === paramCode) {
            return item
          }
        }
      },
      toAssistList(type, row, flag) {
        // type：0 发起  1 反馈
        const para = {
          // status: '4', // 状态
          areaCode: [], // 行政区划
          type: type,
          deptCode: flag ? row.deptCode : '', // 部门code
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '', // 开始时间
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '' // 截止时间
        }
        const dept = this.findParentDept(row.deptCode)
        const cityCode = dept.depCode.substring(0, 6)
        if (dept.depType === '2') { // 支队
          para.areaCode = ['610000', cityCode]
        } else if (dept.depType === '3') { // 大队 派出所
          para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
        } else if (dept.depType === '4') {
          if (dept.areaCode === '611400') { // 杨凌例外
            para.areaCode = ['610000', '611400']
          } else { // 正常的派出所
            para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
          }
        }
        if (this.assistType === '1') {
          this.$gotoid('/caseAssist/list', JSON.stringify(para))
        } else {
          this.$router.push({ path: '/jqcampaign', query: para })
        }
      },
      toCaseList(type, row, flag) {
        // type：0 立案  1 破案
        const para = {
          start: this.filters.time ? this.$parseTime(this.filters.time[0], '{y}-{m}-{d}') + ' 00:00:00' : '',
          end: this.filters.time ? this.$parseTime(this.filters.time[1], '{y}-{m}-{d}') + ' 23:59:59' : '',
          type: type,
          areaCode: [], // 行政区划
          deptCode: flag ? row.deptCode : '' // 部门code
        }
        const dept = this.findParentDept(row.deptCode)
        const cityCode = dept.depCode.substring(0, 6)
        if (dept.depType === '2') { // 支队
          para.areaCode = ['610000', cityCode]
        } else if (dept.depType === '3') { // 大队 派出所
          para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
        } else if (dept.depType === '4') {
          if (dept.areaCode === '611400') { // 杨凌例外
            para.areaCode = ['610000', '611400']
          } else { // 正常的派出所
            para.areaCode = ['610000', cityCode.substring(0, 4) + '00', cityCode]
          }
        }
        this.$gotoid('/caseManage/caseList', JSON.stringify(para))
      },
      toClueList(type, row, flag) {
        // if (this.assistType === '1') {
        //   const para = {
        //     type: type,
        //     assistType: '1',
        //     deptCode: flag ? row.deptCode : '',
        //     cityCode: row.cityCode
        //   }
        //   this.$router.push({ path: '/caseAssist/clueList', query: para })
        // } else {
        //   const para = {
        //     id: '',
        //     type: type,
        //     deptCode: '',
        //     cityCode: row.cityCode,
        //     curDeptCode: row.deptCode,
        //     deptType: row.deptType
        //   }
        //   this.$router.push({ path: '/jqcampaign/clueList', query: para })
        // }
        this.toAssistList('', row, flag)
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.countHeight = document.documentElement.clientHeight - 230
      if (this.$route.path === '/caseAssist/total_jq') {
        this.title = '集群战役'
        this.assistType = '2'
      }
      if (this.$route.path === '/caseAssist/total') {
        this.title = '案件协查'
        this.assistType = '1'
      }
      let currentDepartment = []
      if (this.curDept.depType === '-1') { // 省
        this.areaTitle = '地市'
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '1') { // 总队
        this.areaTitle = '地市'
        currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
      } else if (this.curDept.depType === '2') { // 支队
        this.areaTitle = '单位'
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '3') { // 大队
        this.areaTitle = '单位'
        currentDepartment = [this.curDept.depCode]
      } else if (this.curDept.depType === '4') { // 派出所
        this.areaTitle = '单位'
        if (this.curDept.areaCode === '611400') {
          currentDepartment = [this.curDept.parentDepCode]
        } else {
          currentDepartment = [this.curDept.parentDepCode, this.curDept.depCode]
        }
      }
      this.filters.departCode = currentDepartment[currentDepartment.length - 1]
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
  .caseAssist_totalList .no_expand .el-table__body tbody > tr .el-table__expand-column .cell > div{
    display: none;
  }
  /*.caseAssist_totalList .el-table__body tbody > tr:first-child .el-table__expand-column .cell > div{*/
    /*display: none;*/
  /*}*/
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
