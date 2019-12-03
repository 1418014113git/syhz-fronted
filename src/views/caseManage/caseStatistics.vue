<template>
 <!--案件统计情况报表-->
  <section class="caseStatistics">
    <el-col>
      <el-card style="margin-bottom: 10px;">
        <el-form :inline="true" :model="param">
          <el-form-item label="年份">
            <el-date-picker @change="yearChange"
              v-model="yearDate"
              type="year" value-format="yyyy"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="季度">
            <el-select v-model="quarterDate" placeholder="请先选择年" :disabled="quarterDisabled" @change="quarterChange" clearable>
              <el-option label="一季度" value="1"></el-option>
              <el-option label="二季度" value="2"></el-option>
              <el-option label="三季度" value="3"></el-option>
              <el-option label="四季度" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker  v-model="startTime"  placeholder="请选择" type="date"  value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="startTimeChange"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker  v-model="endTime" placeholder="请先选择开始时间" type="date" :disabled="endDateDisabled" value-format="yyyy-MM-dd" @change="endTimeChange"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query(true)">查询</el-button>
            <el-button type="primary" @click="resetForm">重置</el-button>
            <el-button type="primary" @click="exportToExcel" :disabled="isOnExport">导出</el-button>
            <el-button type="primary" v-if="$isViewBtn('200001')" @click="caseStandardSetting">案件达标数配置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-bottom: 10px;">
        <!--案件统计情况网页展示表-->
        <p class="tableTitle">{{tableTitle}}{{fileName}}</p>
        <el-table  :data="tableData" style="width: 100%" border v-loading="loading" show-summary :summary-method="getSummaries">
          <el-table-column type="index" width="50" label="序号"  align="center"></el-table-column>
            <el-table-column prop="cityName" label="市" width="102" align="center"></el-table-column>
            <el-table-column label="侦破刑事案件数" align="center" >
              <el-table-column prop="zpxs.food" label="食品"  width="60" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.solveCases.food>0"  style="cursor:pointer;"  @click="queryNum(scope.row.solveCases,scope.row.cityCode,'1')">{{scope.row.solveCases.food}}</span>
                  <span v-else >{{scope.row.solveCases.food}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="solveCases.drugs" label="药品"  width="60" align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.solveCases.drugs>0" style="cursor:pointer;"  @click="queryNum(scope.row.solveCases,scope.row.cityCode,'2')">{{scope.row.solveCases.drugs}}</span>
                  <span  v-else>{{scope.row.solveCases.drugs}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="solveCases.environment" label="资源环境" width="60" align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.solveCases.environment>0" style="cursor:pointer;"  @click="queryNum(scope.row.solveCases,scope.row.cityCode,'3')">{{scope.row.solveCases.environment}}</span>
                  <span  v-else>{{scope.row.solveCases.environment}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="solveCases.total" label="总案件数"  width="60" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.solveCases.total}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="solveCases.integral" label="计分"  width="70" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.solveCases.integral}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="大案侦办" align="center">
              <el-table-column prop="supervises.superviseB1" label="侦破部督案件数"  width="70" align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.supervises.superviseB1>0" style="cursor:pointer;"  @click="queryNum(scope.row.supervises,scope.row.cityCode,'2','1')">{{scope.row.supervises.superviseB1}}</span>
                  <span  v-else>{{scope.row.supervises.superviseB1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="supervises.superviseB2" label="未侦破部督案件数"  width="70"  align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.supervises.superviseB2>0" style="cursor:pointer;"  @click="queryNum(scope.row.supervises,scope.row.cityCode,'2','0')">{{scope.row.supervises.superviseB2}}</span>
                  <span  v-else>{{scope.row.supervises.superviseB2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="supervises.superviseT1" label="侦破厅督案件数"  width="70" align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.supervises.superviseT1>0" style="cursor:pointer;"  @click="queryNum(scope.row.supervises,scope.row.cityCode,'3','1')">{{scope.row.supervises.superviseT1}}</span>
                  <span  v-else>{{scope.row.supervises.superviseT1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="supervises.superviseT2" label="未侦破厅督案件数" width="70"  align="center">
                <template slot-scope="scope">
                  <span  v-if="scope.row.supervises.superviseT2>0" style="cursor:pointer;"  @click="queryNum(scope.row.supervises,scope.row.cityCode,'3','0')">{{scope.row.supervises.superviseT2}}</span>
                  <span  v-else>{{scope.row.supervises.superviseT2}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="supervises.integral" label="计分"  width="70" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="打击处理人员情况" align="center">
              <el-table-column label="逮捕人数" align="center">
                <el-table-column prop="handle.arrestFood" label="食品" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.arrestFood>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'1','1')">{{scope.row.handle.arrestFood}}</span>
                    <span  v-else>{{scope.row.handle.arrestFood}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.arrestDrugs" label="药品" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.arrestDrugs>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'2','1')">{{scope.row.handle.arrestDrugs}}</span>
                    <span  v-else>{{scope.row.handle.arrestDrugs}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.arrestEnvironment" label="资源环境" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.arrestEnvironment>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'3','1')">{{scope.row.handle.arrestEnvironment}}</span>
                    <span  v-else>{{scope.row.handle.arrestEnvironment}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.arrestTotal" label="合计"  width="60" align="center"></el-table-column>
              </el-table-column>
              <el-table-column label="起诉人数" align="center">
                <el-table-column prop="handle.sueFood" label="食品" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.sueFood>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'1','2')">{{scope.row.handle.sueFood}}</span>
                    <span  v-else>{{scope.row.handle.sueFood}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.sueDrugs" label="药品" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.sueDrugs>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'2','2')">{{scope.row.handle.sueDrugs}}</span>
                    <span  v-else>{{scope.row.handle.sueDrugs}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.sueEnvironment" label="资源环境" width="60"  align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.handle.sueEnvironment>0" style="cursor:pointer;"  @click="queryNum(scope.row.handle,scope.row.cityCode,'3','2')">{{scope.row.handle.sueEnvironment}}</span>
                    <span  v-else>{{scope.row.handle.sueEnvironment}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handle.sueTotal" label="合计"  width="60" align="center"></el-table-column>
              </el-table-column>
              <el-table-column prop="handle.integral" label="计分"  width="70" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="全国性案件协查数" align="center">
              <el-table-column label="发起" align="center">
                <el-table-column prop="nationalAssist.launchFood" label="食品"  width="60" align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.nationalAssist.launchFood>0" style="cursor:pointer;"  @click="queryNum(scope.row.nationalAssist,scope.row.cityCode,'1')">{{scope.row.nationalAssist.launchFood}}</span>
                    <span  v-else>{{scope.row.nationalAssist.launchFood}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nationalAssist.launchDrugs" label="药品"  width="60" align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.nationalAssist.launchDrugs>0" style="cursor:pointer;"  @click="queryNum(scope.row.nationalAssist,scope.row.cityCode,'2')">{{scope.row.nationalAssist.launchDrugs}}</span>
                    <span  v-else>{{scope.row.nationalAssist.launchDrugs}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nationalAssist.launchTotal" label="合计" width="60"  align="center"></el-table-column>
                <el-table-column prop="nationalAssist.launchIntegral" label="计分" width="70"  align="center"></el-table-column>
              </el-table-column>
              <el-table-column label="不按要求核查反馈" align="center">
                <el-table-column prop="noFeedBacks.noFBFood" label="食品"  width="60" align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.noFeedBacks.noFBFood>0" style="cursor:pointer;"  @click="queryNum(scope.row.noFeedBacks,scope.row.cityCode,'1')">{{scope.row.noFeedBacks.noFBFood}}</span>
                    <span  v-else>{{scope.row.noFeedBacks.noFBFood}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="noFeedBacks.noFBDrugs" label="药品"  width="60" align="center">
                  <template slot-scope="scope">
                    <span  v-if="scope.row.noFeedBacks.noFBDrugs>0" style="cursor:pointer;"  @click="queryNum(scope.row.noFeedBacks,scope.row.cityCode,'2')">{{scope.row.noFeedBacks.noFBDrugs}}</span>
                    <span  v-else>{{scope.row.noFeedBacks.noFBDrugs}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="noFeedBacks.noFBTotal" label="合计" width="60"  align="center"></el-table-column>
                <el-table-column prop="noFeedBacks.noFBIntegral" label="计分" width="70"  align="center"></el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="total" label="总分" width="70" align="center"></el-table-column>
          </el-table>
      </el-card>
    </el-col>
    <aj-standard-num-setting v-if="settingShow" @settingShow="settingShowListen"></aj-standard-num-setting>
  </section>
</template>

<script>
// import FileSaver from 'file-saver'
import { getajzbList } from '@/utils/anzbList'
import AjStandardNumSetting from './components/AjStandardNumSetting'
// import XLSX2 from '../../../static/js/xlsx.extendscript.js'
export default {
  name: 'caseStatistics',
  components: {
    AjStandardNumSetting
  },
  data() {
    return {
      tableData: getajzbList(),
      yearDate: '', //  年
      quarterDate: '', // 季度
      loading: false, // 列表加载loading
      quarterDisabled: true, // 季度选择框是否禁用
      endDateDisabled: true, // 结束时间选择框是否禁用
      param: { // 接口参数
        startTime: '',
        endTime: '',
        type: 'year' // 查询类型
      },
      startTime: '', // 开始时间
      endTime: '', // 结束始时间
      tableTitle: '', // 统计表标题存储
      fileName: '案件侦办、打击处理和全国性协查情况统计表', // xlsx文件标题
      isShowItem: false, // 网页列表展示时隐藏一些table项，导出时在excel表上显示
      pickerOptions: { // 控制开始日期只能小于当前日期
        disabledDate(time) {
          return time.getTime() >= Date.now()
        }
      },
      settingShow: false,
      isOnExport: true // 导出按钮默认不可点击，当查询接口ok后，才能点击。
    }
  },
  methods: {
    caseStandardSetting() {
      this.settingShow = true
    },
    settingShowListen() {
      this.settingShow = false
      this.query()
    },
    query(hand) {
      this.tableTit()
      this.tableData = getajzbList()
      this.loading = true
      this.isOnExport = true
      if (hand) { // 手动点击时，添加埋点参数
        this.param.logFlag = 1
      }
      this.$query('statistics/djcl', this.param).then((response) => {
        this.loading = false
        this.isOnExport = false
        if (response.code === '000000' && (response.data.supervises.length > 0 || response.data.handle.length > 0 || response.data.solveCases.length > 0 || response.data.nationalAssist.length > 0 || response.data.noFeedBacks.length > 0)) {
          this.delwithData(response.data)
        }
      }).catch(() => {
        this.loading = false
        this.isOnExport = true
      })
    },
    tableTit() { // table标题处理
      if (this.yearDate && !this.quarterDate) { // 按年查询
        this.tableTitle = this.yearDate + '年'
        this.yearChange(this.yearDate)
      } else if (this.yearDate && this.quarterDate) { // 按季度查询
        var years = this.param.startTime.substring(0, 4)
        var quarterDate = this.delquarterDate(this.quarterDate)
        this.tableTitle = years + '年第' + quarterDate + '季度'
      } else if (this.startTime && this.endTime) { // 按时间段查询， 有开始和结束时间
        var yearStart = this.startTime.substring(0, 4)
        var yearEnd = this.endTime.substring(0, 4)
        var monthStart = this.startTime.substring(5, 7)
        var monthEnd = this.endTime.substring(5, 7)
        var dateStart = this.startTime.substr(8, 2)
        var dateEnd = this.endTime.substr(8, 2)
        if (monthStart.substr(0, 1) === '0') {
          monthStart = monthStart.substr(1, 1)
        }
        if (monthEnd.substr(0, 1) === '0') {
          monthEnd = monthEnd.substr(1, 1)
        }
        if (dateStart.substr(0, 1) === '0') {
          dateStart = dateStart.substr(1, 1)
        }
        if (dateEnd.substr(0, 1) === '0') {
          dateEnd = dateEnd.substr(1, 1)
        }
        if (yearStart === yearEnd) {
          this.tableTitle = yearStart + '年' + monthStart + '月' + dateStart + '日_' + monthEnd + '月' + dateEnd + '日'
        } else {
          this.tableTitle = yearStart + '年' + monthStart + '月' + dateStart + '日_' + yearEnd + '年' + monthEnd + '月' + dateEnd + '日'
        }
      } else if (this.startTime && !this.endTime) { // 只选了开始时间
        var startYear = this.startTime.substring(0, 4)
        var startMonth = this.startTime.substring(5, 7)
        var startDate = this.startTime.substr(8, 2)
        var curDate = this.getNowFormatDate()
        if (startMonth.substr(0, 1) === '0') {
          startMonth = startMonth.substr(1, 1)
        }
        if (startDate.substr(0, 1) === '0') {
          startDate = startDate.substr(1, 1)
        }
        if (this.startTime === curDate) {
          this.tableTitle = startYear + '年' + startMonth + '月' + startDate + '日'
        } else {
          this.tableTitle = startYear + '年' + startMonth + '月' + startDate + '日_至今'
        }
      }
    },
    getNowFormatDate() { // 获取当前日期
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    delwithData(data) {
      var handle = data.handle // 打击处理人员
      var nationalAssist = data.nationalAssist // 全国协查--发起
      var noFeedBacks = data.noFeedBacks // 全国协查--不按要求核查
      var solveCases = data.solveCases // 侦破刑事案件
      var supervises = data.supervises // 大案侦办
      if (handle.length > 0) {
        for (let i = 0; i < handle.length; i++) { // 打击处理人员
          const item = handle[i]
          for (let j = 0; j < this.tableData.length; j++) {
            const it = this.tableData[j]
            if (item.cityCode.indexOf(it.cityCode) > -1) {
              it.handle = item
              it.handle.type = 'handle'
              break
            }
          }
        }
      }

      if (nationalAssist.length > 0) {
        for (let i = 0; i < nationalAssist.length; i++) { // 全国协查--发起
          const item = nationalAssist[i]
          for (let j = 0; j < this.tableData.length; j++) {
            const it = this.tableData[j]
            if (item.cityCode.indexOf(it.cityCode) > -1) {
              it.nationalAssist = item
              it.nationalAssist.type = '0'
              break
            }
          }
        }
      }

      if (noFeedBacks.length > 0) {
        for (let i = 0; i < noFeedBacks.length; i++) { // 全国协查--不按要求核查
          const item = noFeedBacks[i]
          for (let j = 0; j < this.tableData.length; j++) {
            const it = this.tableData[j]
            if (item.cityCode.indexOf(it.cityCode) > -1) {
              it.noFeedBacks = item
              it.noFeedBacks.type = '1'
              break
            }
          }
        }
      }

      if (solveCases.length > 0) {
        for (let i = 0; i < solveCases.length; i++) { // 侦破刑事案件
          const item = solveCases[i]
          for (let j = 0; j < this.tableData.length; j++) {
            const it = this.tableData[j]
            if (item.cityCode.indexOf(it.cityCode) > -1) {
              it.solveCases = item
              it.solveCases.type = 'solveCases'
              break
            }
          }
        }
      }

      if (supervises.length > 0) {
        for (let i = 0; i < supervises.length; i++) { // 大案侦办
          const item = supervises[i]
          for (let j = 0; j < this.tableData.length; j++) {
            const it = this.tableData[j]
            if (item.cityCode.indexOf(it.cityCode) > -1) {
              it.supervises = item
              it.supervises.type = 'supervises'
              break
            }
          }
        }
      }

      // 计算当前行的总分
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        item.solveCases.integral ? item.solveCases.integral : 0
        item.supervises.integral ? item.supervises.integral : 0
        item.handle.integral ? item.handle.integral : 0
        item.nationalAssist.launchIntegral ? item.nationalAssist.launchIntegral : 0
        item.noFeedBacks.noFBIntegral ? item.noFeedBacks.noFBIntegral : 0
        var total = item.solveCases.integral + item.supervises.integral + item.handle.integral + item.nationalAssist.launchIntegral + item.noFeedBacks.noFBIntegral
        item.total = Math.floor(total * 100) / 100
      }
      this.tableData.sort((a, b) => b.total - a.total)
    },
    yearChange(val) { // 按年查询
      this.endDateDisabled = true // 禁用结束时间选择框
      this.param.type = 'year'
      if (val) {
        this.startTime = ''
        this.endTime = ''
        this.quarterDisabled = false // 激活季度选择框
        const date = new Date(val + '-01-01')
        this.param.startTime = this.$parseTime(new Date(date.getFullYear(), 0, 1), '{y}-{m}-{d}')
        this.param.endTime = this.$parseTime(new Date(date.getFullYear(), 12, 0), '{y}-{m}-{d}')
      } else {
        this.tableTitle = ''
        this.quarterDate = '' // 清空季度选值
        this.quarterDisabled = true// 禁用季度选择框
      }
    },
    quarterChange(val) { // 按季度查询
      this.endDateDisabled = true // 禁用结束时间选择框
      if (val) {
        this.param.type = ''
        this.startTime = ''
        this.endTime = ''
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.param.startTime = this.$parseTime(new Date(date.getFullYear(), (val * 3 - 3), 1), '{y}-{m}-{d}')
        this.param.endTime = this.$parseTime(new Date(date.getFullYear(), (val * 3), 0), '{y}-{m}-{d}')
      } else {
        this.tableTitle = ''
        this.param.type = 'year'
      }
    },
    startTimeChange(val) { // 开始时间
      this.param.endTime = ''
      this.quarterDisabled = true// 禁用季度选择框
      if (val) {
        this.endDateDisabled = false // 激活结束时间选择框
        this.yearDate = ''
        this.quarterDate = ''
        this.param.startTime = val
        this.param.type = ''
      } else {
        this.endDateDisabled = true // 禁用结束时间选择框
        this.endTime = ''
        this.param.startTime = ''
        this.tableTitle = ''
        this.param.type = 'year'
      }
    },
    endTimeChange(val) { // 结束时间
      this.quarterDisabled = true// 禁用季度选择框
      this.param.type = ''
      if (val) {
        if (this.startTime > val) {
          this.$alert('结束时间不能小于开始时间', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {
              this.endTime = ''
              this.param.endTime = ''
            }
          })
          return
        }
        this.param.endTime = val
        this.yearDate = ''
        this.quarterDate = ''
      } else {
        this.param.endTime = ''
        this.tableTitle = ''
      }
    },

    /* eslint-disable */
    exportToExcel() { // 导出Excel
      const param = {
        data: this.tableData,
        title: this.tableTitle + this.fileName
      }
      this.$gotoid("/exportanjtb", JSON.stringify(param))
    },
         getSummaries(param) {
        const tjArry=[
          'solveCases.food','solveCases.drugs','solveCases.environment','solveCases.total','supervises.superviseB1','supervises.superviseB2',
          'supervises.superviseT1','supervises.superviseT2','handle.arrestFood','handle.arrestDrugs','handle.arrestEnvironment',
          'handle.arrestTotal','handle.sueFood','handle.sueDrugs','handle.sueEnvironment','handle.sueTotal','nationalAssist.launchFood',
          'nationalAssist.launchDrugs','nationalAssist.launchTotal','noFeedBacks.noFBFood','noFeedBacks.noFBDrugs','noFeedBacks.noFBTotal'
        ]
        const { columns, data } = param;
        const sums = [];
        let values=[];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '';
            return;
          }
          if (index === 1) {
            sums[index] = '总计';
            return;
          }
          if(column.property==='solveCases.food'){
            values = data.map(item => Number(item['solveCases'].food))
          }
          if(column.property==='solveCases.drugs'){
            values = data.map(item => Number(item['solveCases'].drugs))
          }
          if(column.property==='solveCases.environment'){
            values = data.map(item => Number(item['solveCases'].environment))
          }
          if(column.property==='solveCases.total'){
            values = data.map(item => Number(item['solveCases'].total))
          }
          if(column.property==='supervises.superviseB1'){
            values = data.map(item => Number(item['supervises'].superviseB1))
          }
          if(column.property==='supervises.superviseB2'){
            values = data.map(item => Number(item['supervises'].superviseB2))
          }
          if(column.property==='supervises.superviseT1'){
            values = data.map(item => Number(item['supervises'].superviseT1))
          }
          if(column.property==='supervises.superviseT2'){
            values = data.map(item => Number(item['supervises'].superviseT2))
          }
          if(column.property==='handle.arrestFood'){
            values = data.map(item => Number(item['handle'].arrestFood))
          }
          if(column.property==='handle.arrestDrugs'){
            values = data.map(item => Number(item['handle'].arrestDrugs))
          }
          if(column.property==='handle.arrestEnvironment'){
            values = data.map(item => Number(item['handle'].arrestEnvironment))
          }
          if(column.property==='handle.arrestTotal'){
            values = data.map(item => Number(item['handle'].arrestTotal))
          }
          if(column.property==='handle.sueFood'){
            values = data.map(item => Number(item['handle'].sueFood))
          }
          if(column.property==='handle.sueDrugs'){
            values = data.map(item => Number(item['handle'].sueDrugs))
          }
          if(column.property==='handle.sueEnvironment'){
            values = data.map(item => Number(item['handle'].sueEnvironment))
          }
          if(column.property==='handle.sueTotal'){
            values = data.map(item => Number(item['handle'].sueTotal))
          }
          if(column.property==='nationalAssist.launchFood'){
            values = data.map(item => Number(item['nationalAssist'].launchFood))
          }
          if(column.property==='nationalAssist.launchDrugs'){
            values = data.map(item => Number(item['nationalAssist'].launchDrugs))
          }
          if(column.property==='nationalAssist.launchTotal'){
            values = data.map(item => Number(item['nationalAssist'].launchTotal))
          }
          if(column.property==='noFeedBacks.noFBFood'){
            values = data.map(item => Number(item['noFeedBacks'].noFBFood))
          }
          if(column.property==='noFeedBacks.noFBDrugs'){
            values = data.map(item => Number(item['noFeedBacks'].noFBDrugs))
          }
          if(column.property==='noFeedBacks.noFBTotal'){
            values = data.map(item => Number(item['noFeedBacks'].noFBTotal))
          }
          if(tjArry.indexOf(column.property)!==-1){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
          }else{
            sums[index] = '-';
          }
        });
        return sums;
    },
    delquarterDate(val) { // 季度数字转为汉字
      switch (val) {
        case '1':
          return "一"
          break
        case '2':
          return "二"
          break
        case '3':
          return "三"
          break
        case '4':
          return "四"
          break
      }
    },
    queryNum(row, code, fllb, cslb) { // 点表上的数字，跳转对应的列表页
      if (row.type === 'solveCases') {  // 侦破刑事案件  fllb : 1 食品 2 药品 3环境
        var param = {
          ajzt: 'pa',
          fllb: fllb,
          cityCode: code,
          startTime: this.param.startTime,
          endTime: this.param.endTime
        }
         this.$router.push({ path: '/caseManage', query: param })
      }
      else if (row.type === 'handle') { // 打击处理人员情况   cslb  2:起诉  1：逮捕  fllb : 1 食品 2 药品 3环境
        var param = {
          type: row.type,
          fllb: fllb,
          cslb: cslb,
          cityCode: code,
          startTime: this.param.startTime,
          endTime: this.param.endTime
        }
        this.$gotoid('/caseManage/statisHandle', JSON.stringify(param))  // 打击处理人员情况（跳转到人员详情页） 需求173 2019-08-12
      }
      else if (row.type === 'supervises') {   // 大案侦办   fllb: 2 部督办  3 厅督办   cslb: 0未破  1已破
        var param = {
          level: fllb,
          status: cslb,
          cityCode: code,
          startTime: this.param.startTime,
          endTime: this.param.endTime
        }
        this.$gotoid('/caseManage/statisDblist', JSON.stringify(param))  // 案件督办列表（针对该统计表单独写的）
      } else {  //  全国性协查   fllb : 1 食品 2 药品 3环境   type  0 发起   1不反馈
        var param = {
          type: row.type,
          fllb: fllb,
          cityCode: code,
          startTime: this.param.startTime,
          endTime: this.param.endTime
        }
        this.$gotoid('/caseManage/statisInvestigation', JSON.stringify(param)) // 全国性协查（针对该统计表单独写的）
      }
    },
    resetForm() { // 重置
      this.yearDate = '', //  年
      this.quarterDate = '', // 季度
      this.startTime = '', // 开始时间
      this.endTime = '', // 结束时间
      this.tableTitle = '' //table标题
      this.param = { // 接口参数
        startTime: '',
        endTime: '',
        type: 'year' // 默认查全年
      },
      this.quarterDisabled = true// 禁用季度选择框
      this.endDateDisabled = true // 禁用结束时间选择框
      this.query(true)
    },
  },
  mounted() {
    this.query()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.caseStatistics {
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .el-table__header-wrapper {
    table{
      border-bottom: 1px solid #fff;
    }
  }
  .el-table--border {
    border: 1px solid #ebeef5;
  }
  .el-year-table td .cell {
    color: #fff !important;
  }
  .tableTitle {
    font-size: 16px;
    text-align: center;
    padding-bottom: 10px;
  }


 // 统计表样式设置
  .el-table__footer-wrapper .has-gutter tr td:first-child{
    border: 0;
    border-top: 1px solid #fff;
  }
  .el-table__footer-wrapper .has-gutter tr td:nth-child(2){
    text-align: left;
  }
  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
    border-top: 1px solid #fff;
  }

  // 将滚定条设置到合计行下方
  .el-table{
    overflow: auto;
  }
  .el-table__body-wrapper,
  .el-table__header-wrapper,
  .el-table__footer-wrapper{
    overflow:visible !important;
  }
  .el-table::after{
    position: relative !important;
  }
}
</style>
