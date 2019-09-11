<template>
  <div class="case-claim">
    <el-card style="margin-bottom: 10px;">
      <el-form :inline="true" :model="filters" label-width="92px">
        <!-- <el-form-item label="时间">
          <el-date-picker v-model="dateRange" type="daterange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable></el-date-picker>
        </el-form-item> -->
        <el-form-item label="年份：" prop="yearDate">
          <el-date-picker @change="yearChange"
            v-model="yearDate"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="季度：" prop="quarterDate">
          <el-select v-model="quarterDate" filterable clearable placeholder="请选择" @change="quarterChange" :disabled="quarterDisabled">
            <el-option label="第一季度" value="1"></el-option>
            <el-option label="第二季度" value="2"></el-option>
            <el-option label="第三季度" value="3"></el-option>
            <el-option label="第四季度" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份：" prop="monthDate">
          <el-select v-model="monthDate" filterable clearable placeholder="请选择" @change="monthChange" :disabled="monthDisabled">
            <el-option label="1月" value="1"></el-option>
            <el-option label="2月" value="2"></el-option>
            <el-option label="3月" value="3"></el-option>
            <el-option label="4月" value="4"></el-option>
            <el-option label="5月" value="5"></el-option>
            <el-option label="6月" value="6"></el-option>
            <el-option label="7月" value="7"></el-option>
            <el-option label="8月" value="8"></el-option>
            <el-option label="9月" value="9"></el-option>
            <el-option label="10月" value="10"></el-option>
            <el-option label="11月" value="11"></el-option>
            <el-option label="12月" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选类型：">
          <el-select v-model="filters.type" filterable clearable placeholder="请选择" @change="queryByType">
            <el-option label="本年" value="year"></el-option>
            <el-option label="本季" value="quarter"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="本周" value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段：" prop="startTime">
          <el-date-picker
            v-model="startTime"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择开始时间"
            @change="startDateChange">
          </el-date-picker>
           <el-date-picker
            v-model="endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            @change="endDateChange"
            :disabled="endDateDisabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isViewBtn('100401')"  @click="query(true)">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table :data="caseData" v-loading="listLoading" ref="table" style="width: 100%;" :row-key='getRowKeys' :expand-row-keys="expandstab" @expand-change="handleExpand" show-summary :summary-method="getSummaries"
    :row-class-name="getRowClass">
      <!-- 市下点击展开可查看下属部门 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="subDeptCaseData" v-loading="subLoading" style="width: 100%;" max-height="400">
              <el-table-column prop="" width="140"></el-table-column>
              <el-table-column prop="name" label="单位" min-width="15%"></el-table-column>
              <el-table-column prop="claimed" label="已认领（新增案件）" min-width="10%">
                <template slot-scope="sonScope">
                  <span v-if="sonScope.row.claimed>0" :class="sonScope.row.canClickSon?'canClick':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second','',sonScope.row.deptId,sonScope.row.deptCode,'2')">{{sonScope.row.claimed}}</span>
                  <span v-else >{{sonScope.row.claimed}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="toClaimed" label="待认领" min-width="5%">
                <template slot-scope="sonScope">
                  <span v-if="sonScope.row.toClaimed>0" :class="sonScope.row.canClickSon?'canClick':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second','',sonScope.row.deptId,sonScope.row.deptCode,'1')">{{sonScope.row.toClaimed}}</span>
                  <span v-else >{{sonScope.row.toClaimed}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="downward" label="下发案件" min-width="5%">
                <template slot-scope="sonScope">
                  <span v-if="sonScope.row.downward>0" :class="sonScope.row.canClickSon?'canClick':'notClick'"  @click="linkAjrl(sonScope.row.canClickSon,'second','',sonScope.row.deptId,sonScope.row.deptCode,'3')">{{sonScope.row.downward}}</span>
                  <span v-else >{{sonScope.row.downward}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="forward" label="转发案件" min-width="5%">
                <template slot-scope="sonScope">
                  <span v-if="sonScope.row.forward>0" :class="sonScope.row.canClickSon?'canClick':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second','',sonScope.row.deptId,sonScope.row.deptCode,'4')">{{sonScope.row.forward}}</span>
                  <span v-else >{{sonScope.row.forward}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="revoke" label="撤销案件" min-width="5%">
                <template slot-scope="sonScope">
                  <span v-if="sonScope.row.revoke>0" :class="sonScope.row.canClickSon?'canClick':'notClick'" @click="linkAjrl(sonScope.row.canClickSon,'second','',sonScope.row.deptId,sonScope.row.deptCode,'5')">{{sonScope.row.revoke}}</span>
                  <span v-else >{{sonScope.row.revoke}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="案件总数" min-width="5%"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="index" label="序号" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.cityCode!=='610000'">{{scope.row.index}}</span>
          <span v-else ></span>
        </template>
      </el-table-column>
      <el-table-column prop="cityName" label="单位" min-width="15%"></el-table-column>
      <el-table-column prop="claimed" label="已认领（新增案件）" min-width="10%">
        <template slot-scope="scope">
          <span v-if="scope.row.claimed>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,scope.row.deptId,scope.row.deptCode,'2')">{{scope.row.claimed}}</span>
          <span v-else >{{scope.row.claimed}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="toClaimed" label="待认领" min-width="5%">
        <template slot-scope="scope">
          <span v-if="scope.row.toClaimed>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,scope.row.deptId,scope.row.deptCode,'1')">{{scope.row.toClaimed}}</span>
          <span v-else >{{scope.row.toClaimed}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="downward" label="下发案件" min-width="5%">
        <template slot-scope="scope">
          <span v-if="scope.row.downward>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,scope.row.deptId,scope.row.deptCode,'3')">{{scope.row.downward}}</span>
          <span v-else >{{scope.row.downward}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="forward" label="转发案件" min-width="5%">
        <template slot-scope="scope">
          <span v-if="scope.row.forward>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,scope.row.deptId,scope.row.deptCode,'4')">{{scope.row.forward}}</span>
          <span v-else >{{scope.row.forward}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="revoke" label="撤销案件" min-width="5%">
        <template slot-scope="scope">
          <span v-if="scope.row.revoke>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjrl(scope.row.canClick,'first',scope.row.cityCode,scope.row.deptId,scope.row.deptCode,'5')">{{scope.row.revoke}}</span>
          <span v-else >{{scope.row.revoke}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="案件总数" min-width="5%"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { querySonDeptByCity } from '@/api/dept'
import { getSessionDeptSelect } from '@/api/depts'
export default {
  name: 'caseStatistical',
  data() {
    return {
      filters: {
        type: '', // 筛选类型
        startTime: '', // 开始时间，发送给接口的数据
        endTime: '' // 结束时间
      },
      dateRange: [],
      expandstab: [], // 设置当前的展开行
      caseData: [], // 市的列表数据
      subDeptCaseData: [], // 下级部门列表数据
      listLoading: false, // 列表加载loading
      subLoading: false, // 子列表loading
      totlaYrl: 0, // 已认领合计
      totalDrl: 0, // 待认领合计
      totalXf: 0, // 下发合计
      totalZf: 0, // 转发合计
      totalCx: 0, // 撤销合计
      totalAll: 0, // 总数合计
      getRowKeys(row) {
        return row.cityCode
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      staticData: [
        {
          cityName: '环食药侦总队',
          cityCode: '610000'
        }, {
          cityName: '西安市',
          cityCode: '610100'
        }, {
          cityName: '铜川市',
          cityCode: '610200'
        }, {
          cityName: '宝鸡市',
          cityCode: '610300'
        }, {
          cityName: '咸阳市',
          cityCode: '610400'
        }, {
          cityName: '渭南市',
          cityCode: '610500'
        }, {
          cityName: '延安市',
          cityCode: '610600'
        }, {
          cityName: '汉中市',
          cityCode: '610700'
        }, {
          cityName: '榆林市',
          cityCode: '610800'
        }, {
          cityName: '安康市',
          cityCode: '610900'
        }, {
          cityName: '商洛市',
          cityCode: '611000'
        }, {
          cityName: '杨凌区',
          cityCode: '611100'
        }
      ],
      curFirstLevelId: '', // 当前展开的一级id
      curFirstLevelCode: '', // 当前展开的一级code
      startTime: '', // 开始时间，页面是绑定的modle
      endTime: '', // 结束时间
      yearDate: '', // 年份
      quarterDate: '', // 季度
      monthDate: '', // 月份
      quarterDisabled: true,
      monthDisabled: true,
      endDateDisabled: true, // 结束时间禁用
      curDept: {} // 当前部门
    }
  },
  methods: {
    getSummaries() {
      const sums = ['', '', '合计', '', '', '', '', '']
      sums[3] = this.$thousSplit(this.totlaYrl + '')
      sums[4] = this.$thousSplit(this.totalDrl + '')
      sums[5] = this.$thousSplit(this.totalXf + '')
      sums[6] = this.$thousSplit(this.totalZf + '')
      sums[7] = this.$thousSplit(this.totalCx + '')
      sums[8] = this.$thousSplit(this.totalAll + '')
      return sums
    },
    query(hand) {
      this.initStaticData()
      this.expandstab = []
      if (this.filters.type === '') {
        if (this.startTime === '' && this.endTime !== '') { // 开始时间为空,结束时间不为空
          this.$message({
            message: '开始时间不能为空', type: 'error'
          })
          return false
        } else if (this.startTime !== '' && this.endTime === '') { // 选择了开始时间,结束时间为空
          this.endTime = this.getdate() // 将当前时间赋值给结束时间
        } else if (this.startTime && this.endTime) { // 开始时间和结束时间均不为空
          if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
            this.$message({
              message: '结束时间不能小于开始时间', type: 'error'
            })
            return false
          }
        }
      }
      if (hand) { // 手动点击时，添加埋点参数
        this.filters.logFlag = 1
      }
      this.totlaYrl = 0 // 已认领合计
      this.totalDrl = 0 // 待认领合计
      this.totalXf = 0 // 下发合计
      this.totalZf = 0 // 转发合计
      this.totalCx = 0 // 撤销合计
      this.totalAll = 0 // 总数合计
      this.listLoading = true
      this.$query('statistics/ajrl', this.filters).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          // this.caseData = response.data
          if (response.data.length > 0) {
            this.dealData(response.data)
          } else {
            this.initStaticData()
            this.caseData = this.staticData
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    dealData(resData) { // 将接口返回的数据与静态的12市数据进行拼接
      for (let i = 0; i < resData.length; i++) {
        const item = resData[i]
        for (let j = 0; j < this.staticData.length; j++) {
          var it = this.staticData[j]
          if (item.cityCode.indexOf(it.cityCode) > -1) {
            item.cityName = it.cityName
            it = item
            this.$set(this.staticData, j, it) // 若没有set，则it更新了，但是staticData数组不更新
            break
          }
        }
      }
      this.caseData = this.staticData
      for (let index = 0; index < this.caseData.length; index++) {
        const element = this.caseData[index]
        element.index = index
        element.total = element.claimed + element.toClaimed + element.revoke // 6.11 增加“案件总数”，等于已认领+待认领+撤销案件
        this.totlaYrl += element.claimed // 已认领
        this.totalDrl += element.toClaimed // 待认领
        this.totalXf += element.downward // 下发
        this.totalZf += element.forward // 转发
        this.totalCx += element.revoke // 撤销
        this.totalAll += element.total // 案件总数
        if (this.curDept.depCode.substr(0, 6) === '610000') { // 总队以及内设
          element.canExpand = true
          element.canClick = true
        } else if (this.curDept.depCode.substr(4, 2) === '00' && element.deptCode && element.deptCode.substr(0, 6) === this.curDept.depCode.substr(0, 6)) { // 市以及内设
          element.canExpand = true
          element.canClick = true
        } else if (this.curDept.depCode.substr(4, 2) !== '00' && element.deptCode && element.deptCode.substr(0, 4) === this.curDept.depCode.substr(0, 4)) { // 县区的可以展开自己市 但是不能点击自己的市
          // element.deptCode === this.curDept.parentDepCode 不能这样判断 鄂尔多斯有问题
          element.canExpand = true
          element.canClick = false
        }
      }
    },
    getRowClass(row) {
      // console.log(row)
      if (!row.row.canExpand) {
        return 'row-expand-cover'
      }
    },
    handleExpand(row, expands) {
      if (expands.length) {
        this.expandstab = []
        if (row) {
          this.expandstab.push(row.cityCode)
          this.curFirstLevelId = row.deptId
          this.curFirstLevelCode = row.deptCode
        } else {
          this.expandstab = []
        }
      }
      var deptList = getSessionDeptSelect()
      this.subDeptCaseData = querySonDeptByCity(deptList, row.cityCode)
      for (let index = 0; index < this.subDeptCaseData.length; index++) { // 初始化市下的单位数据全为0
        const element = this.subDeptCaseData[index]
        element.claimed = 0
        element.toClaimed = 0
        element.downward = 0
        element.forward = 0
        element.revoke = 0
        element.total = 0
      }
      if (Number(row.total) > 0) { // 上级total为0时 不请求接口
        this.querySubDeptCaseData(row)
      }
    },
    querySubDeptCaseData(row) {
      this.subLoading = true
      var param = {
        cityCode: row.cityCode,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        type: this.filters.type
      }
      this.$query('statistics/ajrl', param).then((response) => {
        if (response.code === '000000') {
          this.subLoading = false
          var sonResData = response.data
          for (let i = 0; i < sonResData.length; i++) {
            const item = sonResData[i]
            for (let j = 0; j < this.subDeptCaseData.length; j++) {
              var it = this.subDeptCaseData[j]
              if ((item.deptId + '').indexOf(it.id + '') > -1) {
                it = item
                this.$set(this.subDeptCaseData, j, it)
                break
              }
            }
          }
          for (let index = 0; index < this.subDeptCaseData.length; index++) {
            const element = this.subDeptCaseData[index]
            element.total = element.claimed + element.toClaimed + element.revoke // 6.11 增加“案件总数”，等于已认领+待认领+撤销案件
            if (this.curDept.depCode.substr(0, 6) === '610000') { // 总队以及内设
              element.canClickSon = true
            } else if (this.curDept.depCode.substr(4, 2) === '00' && element.cityCode === this.curDept.areaCode) { // 市以及内设
              element.canClickSon = true
            } else if (this.curDept.depCode.substr(4, 2) !== '00' && element.deptCode === this.curDept.depCode) { // 县区只能点击自己
              element.canClickSon = true
            } else {
              element.canClickSon = false
            }
            this.$set(this.subDeptCaseData, index, element)
          }
        }
      }).catch(() => {
        this.subLoading = false
      })
    },
    startDateChange(val) { // 开始时间change事件
      if (val) {
        this.filters.type = ''
        this.yearDate = '' // 清空年份值
        this.quarterDate = ''
        this.monthDate = ''
        this.yearChange() // 清空了yearDate 没有自动调change事件
        this.endDateDisabled = false
      } else {
        this.endDateDisabled = true
      }
    },
    endDateChange(val) { // 结束时间change事件
      if (val) {
        this.filters.startTime = this.startTime
        this.filters.endTime = this.endTime
      }
    },
    queryByType(val) { // 查询类型change事件
      this.filters.startTime = ''
      this.filters.endTime = ''
      this.yearDate = '' // 清空年份值
      this.quarterDate = ''
      this.monthDate = ''
      this.yearChange() // 清空了yearDate 没有自动调change事件
      if (val) {
        this.query()
      }
    },
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      // + ' ' + now.toTimeString().substr(0, 8)
    },
    reset() { // 重置
      this.filters = {
        startTime: '', endTime: '', type: ''
      }
      this.dateRange = []
      this.yearDate = '' // 年份
      this.quarterDate = '' // 季度
      this.monthDate = '' // 月份
      this.startTime = '' // 开始时间
      this.endTime = '' // 结束时间
      this.query(true)
    },
    yearChange(val) { // 按年查询
      this.endDateDisabled = true // 禁用结束时间选择框
      this.quarterDate = '' // 清空季度
      this.monthDate = '' // 清空月
      if (val) {
        this.filters.type = '' // 清空掉筛选类型框
        this.startTime = ''
        this.endTime = ''
        this.quarterDisabled = false // 激活季度选择框
        this.monthDisabled = false
        const date = new Date(val + '-01-01')
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), 0, 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), 12, 0), '{y}-{m}-{d}')
      } else {
        this.quarterDisabled = true // 禁用季度选择
        this.monthDisabled = true // 禁用月份选择
      }
    },
    quarterChange(val) {
      if (val) {
        this.monthDisabled = true
        this.startTime = ''
        this.endTime = ''
        this.monthDisabled = true
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), (val * 3 - 3), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), (val * 3), 0), '{y}-{m}-{d}')
      } else {
        this.monthDisabled = false
      }
    },
    monthChange(val) {
      if (val) {
        this.quarterDisabled = true
        this.startTime = ''
        this.endTime = ''
        let date = new Date()
        if (this.yearDate) {
          date = new Date(this.yearDate + '-01-01')
        }
        this.filters.startTime = this.$parseTime(new Date(date.getFullYear(), (val - 1), 1), '{y}-{m}-{d}')
        this.filters.endTime = this.$parseTime(new Date(date.getFullYear(), val, 0), '{y}-{m}-{d}')
      } else {
        this.quarterDisabled = false
      }
    },
    linkAjrl(canClick, level, cityCode, deptId, deptCode, type) { // 跳转到案件认领列表
      if (!canClick) {
        return false
      }
      var param = {
        origin: 'statistical', // 表示从统计跳转过去的
        deptLevel: level, // 区分是一级还是二级
        cityCode: cityCode,
        // deptId: deptId, // 当前点击的id
        // curFirstLevelId: this.curFirstLevelId, // 展开一级的，有可能展开一级后点一级的跳转 所以不能用这个字段判断
        deptCode: deptCode, // 当前点击的code
        curFirstLevelCode: this.curFirstLevelCode, // 展开一级的，有可能展开一级后点一级的跳转 所以不能用这个字段判断
        type: type, // 待认领...等
        yearDate: this.yearDate, // 筛选框的值
        quarterDate: this.quarterDate,
        monthDate: this.monthDate,
        queryType: this.filters.type,
        startTime: this.startTime,
        endTime: this.endTime,
        filtStartTime: this.filters.startTime, // 查询的参数，认领页面需要用到
        filtEndTime: this.filters.endTime
      }
      console.log(param)
      this.$gotoid('/caseManage/ajrl', JSON.stringify(param))
    },
    initStaticData() {
      for (let index = 0; index < this.staticData.length; index++) { // 初始化12市数据全为0
        const element = this.staticData[index]
        element.claimed = 0
        element.toClaimed = 0
        element.downward = 0
        element.forward = 0
        element.revoke = 0
        element.total = 0
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    this.initStaticData()
    if (sessionStorage.getItem(this.$route.path)) {
      var carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.yearDate = carryParam.yearDate || '' // 筛选框的值
      this.quarterDate = carryParam.quarterDate || ''
      this.monthDate = carryParam.monthDate || ''
      this.filters.type = carryParam.queryType || ''
      this.startTime = carryParam.startTime || ''
      this.endTime = carryParam.endTime || ''
      this.yearChange(this.yearDate)
      this.quarterChange(this.quarterDate)
      this.monthChange(this.monthDate)
      if (this.filters.type) {
        this.queryByType(this.filters.type)
      }
      this.startDateChange(this.startTime)
      this.endDateChange(this.endTime)
    } else {
      // 需求176 默认查询本年度
      var curYear = new Date().getFullYear() + ''
      this.yearDate = curYear
      this.yearChange(curYear)
    }
    this.query()
    if (sessionStorage.getItem('depToken')) { // 当前部门
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
  }
}
</script>
<style>
.case-trend .card {
  margin-bottom: 20px;
}
.case-claim .el-table__expanded-cell {
  width: 500px;
  margin-left: 100px;
  padding: 0;
}
.canClick {
  cursor: pointer;
}
.canClick:hover {
  text-decoration: underline;
}
.el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}
</style>
