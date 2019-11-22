<template>
  <div class="deptStatistical">
    <el-form :inline="true" :model="filters" ref="filters" label-width="80px" style="text-align: left;">
      <el-form-item label="开始日期" prop="startDate1">
        <el-date-picker
          v-model="filters.startDate1"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="ksStartPickerOptions"
          placeholder="请选择开始时间"
          @change="ksStartDateChange" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="startDate2">
        <el-date-picker
          v-model="filters.startDate2"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="ksEndPickerOptions"
          placeholder="请选择结束时间"
          @change="ksEndDateChange"
          :disabled="ksEndDateDisabled" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" prop="endDate1">
        <el-date-picker
          v-model="filters.endDate1"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="jsStartPickerOptions"
          placeholder="请选择开始时间"
          @change="jsStartDateChange" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="endDate2">
        <el-date-picker
          v-model="filters.endDate2"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="jsEndPickerOptions"
          placeholder="请选择结束时间"
          @change="jsEndDateChange"
          :disabled="jsEndDateDisabled" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件类型" prop="type">
        <el-select v-model="filters.type" placeholder="全部" clearable>
          <el-option label="环境" value="3"></el-option>
          <el-option label="食品" value="1"></el-option>
          <el-option label="药品" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="筛选条件" prop="timeType">
        <el-select v-model="filters.timeType" placeholder="全部" clearable @change="timeTypeChange">
          <el-option label="本年" value="1"></el-option>
          <el-option label="本年上半年" value="2"></el-option>
          <el-option label="本年下半年" value="3"></el-option>
          <el-option label="本季" value="4"></el-option>
          <el-option label="本月" value="5"></el-option>
          <el-option label="本周" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDbStatistical(true)">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>督办案件情况统计</div>
    <!-- 饼状图 -->
    <div class="clearfix" style="margin: 20px 0 50px;" v-loading="echartDivLoading">
      <div id="echartDb" style="height: 500px;margin:0 auto;"></div>
    </div>
    <div style="margin-bottom:10px;">督办案件破获情况统计</div>
    <el-table :data="dbCaseData"  style="width: 100%;" :max-height="tableHeight" v-loading="tableLoading" class="table_th_center"
     show-summary :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick"
     :row-class-name="getRowClass" ref="teamStatistical">
      <el-table-column type="expand" width="40">
        <template slot-scope="scope">
          <el-table :data="scope.row.child||[]" :style="expandTableStyle" v-loading="listChildLoading" max-height="400">
            <el-table-column prop="" label="" width="40"></el-table-column>
            <el-table-column type="index" label="序号" align="center" :width="smallItemWidth"></el-table-column>
            <el-table-column prop="areaName" label="单位" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e1p1" label="侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e1p1>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'1','1')">{{sonScope.row.totalList.e1p1}}</span>
                <span v-else >{{sonScope.row.totalList.e1p1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList.e1p2" label="未侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e1p2>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'1','2')">{{sonScope.row.totalList.e1p2}}</span>
                <span v-else >{{sonScope.row.totalList.e1p2}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList.e2p1" label="侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e2p1>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'2','1')">{{sonScope.row.totalList.e2p1}}</span>
                <span v-else >{{sonScope.row.totalList.e2p1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList.e2p2" label="未侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e2p2>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'2','2')">{{sonScope.row.totalList.e2p2}}</span>
                <span v-else >{{sonScope.row.totalList.e2p2}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList.e3p1" label="侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e3p1>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'3','1')">{{sonScope.row.totalList.e3p1}}</span>
                <span v-else >{{sonScope.row.totalList.e3p1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalList.e3p2" label="未侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.totalList.e3p2>0" :class="sonScope.row.canClick?'canClick':'notClick'" @click="linkAjdb(sonScope.row.canClick,sonScope.row.departType,'',sonScope.row.deptCode,'3','2')">{{sonScope.row.totalList.e3p2}}</span>
                <span v-else >{{sonScope.row.totalList.e3p2}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center"></el-table-column>
      <el-table-column prop="areaName" label="省市" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="e1p1" label="侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.e1p1>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','1','1')">{{scope.row.e1p1}}</span>
          <span v-else >{{scope.row.e1p1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="e1p2" label="未侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.e1p2>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','1','2')">{{scope.row.e1p2}}</span>
          <span v-else >{{scope.row.e1p2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="e2p1" label="侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
         <template slot-scope="scope">
          <span v-if="scope.row.e2p1>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','2','1')">{{scope.row.e2p1}}</span>
          <span v-else >{{scope.row.e2p1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="e2p2" label="未侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.e2p2>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','2','2')">{{scope.row.e2p2}}</span>
          <span v-else >{{scope.row.e2p2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="e3p1" label="侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.e3p1>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','3','1')">{{scope.row.e3p1}}</span>
          <span v-else >{{scope.row.e3p1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="e3p2" label="未侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.e3p2>0" :class="scope.row.canClick?'canClick':'notClick'" @click="linkAjdb(scope.row.canClick,'city',scope.row.cityCode,'','3','2')">{{scope.row.e3p2}}</span>
          <span v-else >{{scope.row.e3p2}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'examinationStatistical',
  data() {
    return {
      smallItemWidth: 60, // 表格最小格子的宽度
      filters: {
        area: [],
        department: []
      },
      dbCaseData: [], // 队伍统计
      tableHeight: null,
      tableLoading: false, // 统计loading
      echartDivLoading: true, // 统计图loading
      listChildLoading: false, // 子列表loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      expands: [], // 展开的行
      screenWidth: '', // 屏幕宽度
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      ksStartPickerOptions: {}, // 开始日期
      ksEndPickerOptions: {},
      jsStartPickerOptions: {}, // 结束日期
      jsEndPickerOptions: {},
      ksEndDateDisabled: true,
      jsEndDateDisabled: true
    }
  },
  components: {
  },
  methods: {
    getRowKeys(row) {
      return row.departCode
    },
    getRowClass({ row, rowIndex }) {
      if (row.canExpand === true) {
        return ''
      } else {
        return 'row-custom'
      }
    },
    rowClick(row) {
      if (this.expands.indexOf(row.departCode) > -1) { // 展开项中存在
        this.expands.splice(this.expands.indexOf(row.departCode), 1)
      } else { // 展开项中不存在
        this.expands.push(row.departCode)
        if (row.departCode === '610000530000') { // 省厅
          this.queryDbStatistical(true, row.departCode) // 根据部门code查
        } else {
          if (row.cityCode) {
            this.queryDbStatistical(true, row.cityCode) // 根据盟市code查
          } else {
            //
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = '合计'
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
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    queryDbStatistical(hand, city) { // 督办统计
      var param = JSON.parse(JSON.stringify(this.filters))
      param.area = ''
      param.department = ''
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      if (city) { // 点击表格展开的查询
        if (city === '610000530000') { // 省厅
          param.departCode = city
        } else {
          param.cityCode = city
        }
      } else { // 一级表格的查询
        this.expands = [] // 初始化 所有行 均不展开
        param.provinceCode = '610000'
      }
      this.queryDbCase(city, param) // 督办案件情况统计
      this.queryDbCasePh(city, param) // 破获情况统计
    },
    queryDbCase(city, param) { // 查督办案件
      this.echartDivLoading = true
      this.$query('casesupervisetotal/1', param).then((response) => {
        this.echartDivLoading = false
        if (response.code === '000000') {
          this.drawChart(response.data)
        }
      }).catch(() => {
        this.echartDivLoading = false
      })
    },
    queryDbCasePh(city, param) { // 查督办案件破获情况
      if (city) {
        this.listChildLoading = true
      } else {
        this.tableLoading = true
      }
      this.$queryPost('casesupervise/total', param).then((response) => {
        if (response.code === '000000') {
          if (city) {
            this.listChildLoading = false
            var childData = response.data
            for (let m = 0; m < childData.length; m++) { // 遍历是否可点击跳转
              var childElement = childData[m]
              if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1' || this.deptInfo.depType === '2') { // 厅 总队 支队
                childElement.canClick = true
              } else if (this.deptInfo.depType === '3' && childElement.deptCode === this.deptInfo.depCode) { // 大队
                childElement.canClick = true
              } else if (this.deptInfo.depType === '4' && childElement.deptCode === this.deptInfo.parentDepCode) { // 派出所
                childElement.canClick = true
              } else {
                childElement.canClick = false
              }
            }
            for (let i = 0; i < this.dbCaseData.length; i++) {
              const item = this.dbCaseData[i]
              if (city === '610000530000') { // 省厅
                if (item.departCode === city) {
                  item.child = childData
                }
              } else {
                if (item.cityCode === city) {
                  item.child = childData
                }
              }
            }
          } else {
            this.tableLoading = false
            var data = response.data
            for (let index = 0; index < data.length; index++) {
              var element = data[index]
              element = Object.assign(element, element.totalList) // 需要累加的值 放到totalList 累加的时候两层有问题
              element.canExpand = false
              if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1') { // 厅或者总队 全部都可展开
                element.canExpand = true // 可展开
                element.canClick = true // 可点击
              } else if (this.deptInfo.depType === '2' && element.areaCode === this.deptInfo.areaCode.substring(0, 4)) { // 支队
                element.canExpand = true
                element.canClick = true
              } else if ((this.deptInfo.depType === '3' || this.deptInfo.depType === '4') && element.areaCode === this.deptInfo.areaCode.substring(0, 4)) { // 和大队只能展开自己的市
                element.canExpand = true
                element.canClick = false
              }
            }
            this.dbCaseData = data
          }
        }
      }).catch(() => {
        this.tableLoading = false
      })
    },
    linkAjdb(canClick, level, cityCode, deptCode, dbLevel, phStatus) { // 跳转到督办列表
      if (!canClick) {
        return false
      }
      var param = {
        origin: 'dbStatistical', // 表示从统计跳转过去的
        clickLevel: level, // 区分是一级还是二级 表格，一级 city,二级是 部门的type
        cityCode: cityCode,
        deptCode: deptCode, // 当前点击的code
        dbLevel: dbLevel, // 督办等级
        phStatus: phStatus, // 是否破获 1已破 2未破
        startDate1: this.filters.startDate1, // 筛选框的值
        startDate2: this.filters.startDate2,
        endtDate1: this.filters.endDate1,
        endDate2: this.filters.endDate2,
        type: this.filters.type, // 案件类型
        timeType: this.filters.timeType // 筛选条件
      }
      // this.$gotoid('/caseManage/dbList', JSON.stringify(param))
      this.$router.push({ path: '/caseManage/dbList', query: param })
    },
    timeTypeChange(val) { // 筛选条件 change
      if (val) {
        this.filters.startDate1 = '' // 清空掉时间段
        this.filters.startDate2 = ''
        this.filters.endDate1 = ''
        this.filters.endDate2 = ''
      }
    },
    goDeptStatistical(row) { // 跳转到机构 页面
      // this.$router.push({ path: '/basicService/deptStatistical', query: { departCode: row.departCode }})
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    ksStartDateChange(val) {
      if (val) {
        this.ksEndDateDisabled = false
        this.ksEndPickerOptions = Object.assign({}, 'ksEndPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime()
          }
        })
      } else {
        this.filters.startDate2 = '' // 结束时间清空
        this.ksEndDateDisabled = true
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    ksEndDateChange(val) { // 结束时间change事件
      if (val) {
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.ksStartPickerOptions = Object.assign({}, 'ksStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    jsStartDateChange(val) {
      if (val) {
        this.jsEndDateDisabled = false
        this.jsEndPickerOptions = Object.assign({}, 'jsEndPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() < new Date(val).getTime()
          }
        })
      } else {
        this.filters.endDate2 = '' // 结束时间清空
        this.jsEndDateDisabled = true
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    jsEndDateChange(val) { // 结束时间change事件
      if (val) {
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
          disabledDate: (time) => {
            return time.getTime() > new Date(val).getTime()
          }
        })
      } else {
        this.jsStartPickerOptions = Object.assign({}, 'jsStartPickerOptions', {
          disabledDate: (time) => {
            return false
          }
        })
      }
    },
    toPercent(num, total) { // 数字转百分比,num 当前数，total 总数
      if (total) {
        return (Math.round((num / total) * 10000) / 100).toFixed(2) + '%'
      } else {
        return '0.00%'
      }
    },
    drawChart(data) { // 年龄 饼状图
      var tjArr = [
        { dbLevel: 1, dbName: '部督办', itemTotal: data.e1s1 + data.e1s2 + data.e1s3, value1: data.e1s3, value2: data.e1s1, value3: data.e1s2, normalItem: {}}, // 部督办
        { dbLevel: 2, dbName: '厅督办', itemTotal: data.e2s1 + data.e2s2 + data.e2s3, value1: data.e2s3, value2: data.e2s1, value3: data.e2s2, normalItem: {}}, // 厅督办
        { dbLevel: 3, dbName: '市督办', itemTotal: data.e3s1 + data.e3s2 + data.e3s3, value1: data.e3s3, value2: data.e3s1, value3: data.e3s2, normalItem: {}} // 市督办
      ]
      for (let index = 0; index < tjArr.length; index++) {
        var element = tjArr[index]
        element.normalItem = {
          formatter: [
            '{title|{b}}{abg|}',
            '  {typeHead|分类}{valueHead|数量}{rateHead|占比}',
            '{hr|}',
            '  {type|环境}{value|' + element.value1 + '}{rate|' + this.toPercent(element.value1, element.itemTotal) + '}',
            '  {type|食品}{value|' + element.value2 + '}{rate|' + this.toPercent(element.value2, element.itemTotal) + '}',
            '  {type|药品}{value|' + element.value3 + '}{rate|' + this.toPercent(element.value3, element.itemTotal) + '}'
          ].join('\n'),
          backgroundColor: '#eee',
          borderColor: '#777',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            title: {
              color: '#eee',
              align: 'center'
            },
            abg: {
              backgroundColor: '#333',
              width: '100%',
              align: 'right',
              height: 25,
              borderRadius: [4, 4, 0, 0]
            },
            type: {
              height: 24,
              width: 20,
              padding: [0, 0, 0, 0],
              align: 'left'
            },
            typeHead: {
              color: '#333',
              height: 24,
              align: 'left'
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 0.5,
              height: 0
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'left'
            },
            valueHead: {
              color: '#333',
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center'
            },
            rate: {
              width: 40,
              align: 'right',
              padding: [0, 10, 0, 0]
            },
            rateHead: {
              color: '#333',
              width: 40,
              align: 'center',
              padding: [0, 10, 0, 0]
            }
          }
        }
      }
      var echartDb = echarts.init(document.getElementById('echartDb'))
      echartDb.setOption({
        color: ['#1088F6', '#04E4E4', '#D25482', '#F67C4E', '#F84C6E', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        // color: ['#C23531', '#2F4554', '#61A0A8'],
        title: {
          text: '督办案件情况统计',
          subtext: '督办级别',
          left: 'center',
          textStyle: {
            color: '#ddd'
          }
        },
        toolbox: {
          show: false,
          orient: 'horizontal',
          right: 50,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: '人员年龄构成保存为图片',
              icon: 'image://static/image/download.png'
              // emphasis: {
              //   icon: 'image://static/image/download_b.png'
              // }
            }
          },
          itemSize: 20,
          iconStyle: {
            emphasis: { color: '#fff' }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          itemGap: 15,
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          },
          bottom: 0,
          left: 'center',
          data: ['部督办', '厅督办', '市督办']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            labelLine: {
              length: 30
            },
            data: [
              {
                value: tjArr[0].itemTotal,
                name: tjArr[0].dbName,
                label: {
                  normal: tjArr[0].normalItem
                }
              },
              {
                value: tjArr[1].itemTotal,
                name: tjArr[1].dbName,
                label: {
                  normal: tjArr[1].normalItem
                }
              },
              {
                value: tjArr[2].itemTotal,
                name: tjArr[2].dbName,
                label: {
                  normal: tjArr[2].normalItem
                }
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    reset() { // 重置
      this.resetForm('filters')
      this.queryDbStatistical()
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    // this.initData() // 初始化筛选条件数据
    this.queryDbStatistical()

    this.$nextTick(() => { // 页面渲染完成后的回调
      this.screenWidth = this.$refs.teamStatistical.$el.clientWidth + 'px'
      // this.screenWidth = document.body.clientWidth + 'px'
      this.expandTableStyle = 'width:' + this.screenWidth + ';border-left: none;border-right: none;overflow-x:auto;'
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.deptStatistical {
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  .el-form .el-cascader.el-cascader--small,
  .el-form .el-input.el-input--small,
  .el-form .el-select.el-select--small {
    width: 222px;
  }
  //修改表格边框颜色
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: none;
    border-right: 1px solid #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.canClick {
  color: #00a0e9;
  text-decoration: underline;
  cursor: pointer;
}
.canClick:hover {
  text-decoration: underline;
}
.el-table .row-custom .cell .el-table__expand-icon {
  display: none;
}
.el-table .row-custom .xuhao {
  // 如果用display none 隐藏了 会整行往左移
  opacity: 0;
  pointer-events: none;
}
.el-table .row-hj .el-table-column--selection {
  // 合计行去掉 复选框
  opacity: 0;
  pointer-events: none;
}
.el-autocomplete-suggestion {
  border: 1px solid #00a0e9;
}
.el-autocomplete-suggestion__wrap {
  background-color: #005982 !important;
  border: 0 !important;
}
.el-autocomplete-suggestion li {
  color: #fff;
}
.el-autocomplete-suggestion.is-loading li:hover,
.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
</style>
