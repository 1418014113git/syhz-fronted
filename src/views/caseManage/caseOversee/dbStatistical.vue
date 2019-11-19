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
          @change="ksStartDateChange">
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
          :disabled="ksEndDateDisabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate1">
        <el-date-picker
          v-model="filters.endDate1"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="jsStartPickerOptions"
          placeholder="请选择开始时间"
          @change="jsStartDateChange">
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
          :disabled="jsEndDateDisabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件类型" prop="type">
        <el-select v-model="filters.type" placeholder="全部" >
          <el-option label="食品" value="1"></el-option>
          <el-option label="药品" value="2"></el-option>
          <el-option label="环境" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="筛选条件" prop="timeType">
        <el-select v-model="filters.timeType" placeholder="全部" >
          <el-option label="本年" value="1"></el-option>
          <el-option label="本年上半年" value="2"></el-option>
          <el-option label="本年下半年" value="3"></el-option>
          <el-option label="本季" value="3"></el-option>
          <el-option label="本月" value="3"></el-option>
          <el-option label="本周" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDbStatistical(true)">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="teamData"  style="width: 100%;" :max-height="tableHeight" v-loading="teamLoading" class="table_th_center"
     show-summary :summary-method="getSummaries" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick"
     ref="teamStatistical">
      <el-table-column type="expand" width="40" v-if="canExpand">
        <template slot-scope="scope">
          <el-table :data="scope.row.child||[]" :style="expandTableStyle" v-loading="listChildLoading" max-height="400">
            <el-table-column prop="" label="" width="40"></el-table-column>
            <el-table-column type="index" label="序号" align="center" :width="smallItemWidth"></el-table-column>
            <el-table-column prop="name" label="单位" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <span class="canClick" @click="goDeptStatistical(scope.row)">{{scope.row.name}}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="totalList.e1p1" label="侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e1p2" label="未侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e2p1" label="侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e2p2" label="未侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e3p1" label="侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalList.e3p2" label="未侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center"></el-table-column>
      <el-table-column prop="areaName" label="省市" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.canClickJump===true" class="canClick" @click="goDeptStatistical(scope.row)">{{scope.row.name}}</span>
          <span v-else>{{scope.row.name}}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="totalList.e1p1" label="侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalList.e1p2" label="未侦破部督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalList.e2p1" label="侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalList.e2p2" label="未侦破厅督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalList.e3p1" label="侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalList.e3p2" label="未侦破市督案件数" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 饼状图 -->
    <div class="clearfix" style="margin: 50px 0 80px;" v-if="showEchart">
      <div id="echartAge" style="width: 33%; height: 400px; float:left;"></div>
    </div>
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
      teamData: [], // 队伍统计
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      props: {
        value: 'cityCode',
        label: 'cityName'
      },
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      firstCanJump: false, // 表格的一级是否可跳转
      tableHeight: null,
      cityData: [], // 盟市统计的
      teamLoading: false, // 统计loading
      listChildLoading: false, // 子列表loading
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      showEchart: true,
      selectCurDep: { name: '' },
      expands: [], // 展开的行
      echartAllData: {}, // 三个饼状图的数据源
      exportBtn: false,
      screenWidth: '', // 屏幕宽度
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      curDept: {}, // 当前部门
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
    queryDbStatistical(hand, city) { // 队伍统计
      var param = {}
      this.exportBtn = false // 导出按钮 显隐
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      if (city) { // 点击表格展开的查询
        this.listChildLoading = true
        if (city === '610000530000') { // 省厅
          param.departCode = city
        } else {
          param.cityCode = city
        }
      } else { // 一级表格的查询
        this.expands = [] // 初始化 所有行 均不展开
        this.teamLoading = true
        param.provinceCode = '610000'
      }
      this.$queryPost('casesupervise/total', param).then((response) => {
        if (response.code === '000000') {
          if (city) {
            this.listChildLoading = false
            for (let i = 0; i < this.teamData.length; i++) {
              const item = this.teamData[i]
              if (city === '610000530000') { // 省厅
                if (item.departCode === city) {
                  item.child = response.data
                }
              } else {
                if (item.cityCode === city) {
                  item.child = response.data
                }
              }
            }
          } else {
            this.teamLoading = false
            this.teamData = response.data
            // this.drawCityStatistical()
            for (let index = 0; index < this.teamData.length; index++) {
              var element = this.teamData[index]
              element.canExpand = false
              if (this.deptInfo.depType !== '-1' && this.deptInfo.depType !== '1' && element.cityCode === this.deptInfo.areaCode) { // 支队和大队只能展开自己的市
                element.canExpand = true
              }
            }
          }
        }
      }).catch(() => {
        this.teamLoading = false
      })
      if (city) {
        // 不需要刷新统计图
      } else {
        this.queryEchart(param)
      }
    },
    queryEchart(param) {
      this.$query('hsyzgusertotal', param, 'upms').then((response) => {
        if (response.code === '000000') {
          this.echartAllData = response.data[0]
          this.drawChartAge()
          this.drawChartGender()
          this.drawChartEducation()
        }
      }).catch(() => {
        this.teamLoading = false
      })
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
    drawChartAge() { // 年龄 饼状图
      // var scoreArr = []
      // if (this.cityData.length > 0) {
      var scoreArr = [
        { value: this.echartAllData.age1, name: '30岁及以下' },
        { value: this.echartAllData.age2, name: '31-40岁' },
        { value: this.echartAllData.age3, name: '41-50岁' },
        { value: this.echartAllData.age4, name: '51-60岁' },
        { value: this.echartAllData.age5, name: '60岁以上' }
      ]
      // }
      var echartAge = echarts.init(document.getElementById('echartAge'))
      echartAge.setOption({
        color: ['#1088F6', '#04E4E4', '#FFDB56', '#F67C4E', '#F84C6E', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '人员年龄构成',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#ddd'
          }
        },
        toolbox: {
          show: true,
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
          bottom: 0,
          itemGap: 15,
          data: ['30岁及以下', '31-40岁', '41-50岁', '51-60岁', '60岁以上'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['0', '60%'],
            data: scoreArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawChartGender() { // 性别 饼状图
      var joinPerArr = [
        { value: this.echartAllData.sex0, name: '男性' },
        { value: this.echartAllData.sex1, name: '女性' }
      ]
      var echartGender = echarts.init(document.getElementById('echartGender'))
      echartGender.setOption({
        color: ['#1088F6', '#FAD14A', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '人员性别构成',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#ddd'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 50,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: '人员性别构成保存为图片',
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
          bottom: 0,
          itemGap: 15,
          data: ['男性', '女性'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['0', '60%'],
            // center: ['50%', '60%'],
            data: joinPerArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawChartEducation() { // 学历 饼状图
      // var scoreArr = []
      // if (this.cityData.length > 0) {
      var scoreArr = [
        { value: this.echartAllData.culture1, name: '研究生' },
        { value: this.echartAllData.culture2, name: '本科' },
        { value: this.echartAllData.culture3, name: '专科' },
        { value: this.echartAllData.culture4, name: '高中' },
        { value: this.echartAllData.culture5, name: '初中' },
        { value: this.echartAllData.culture6, name: '小学' }
      ]
      // }
      var echartEducation = echarts.init(document.getElementById('echartEducation'))
      echartEducation.setOption({
        color: ['#1088F6', '#00C9E9', '#2CEC8B', '#FAD345', '#F67C4E', '#F84C6E', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '人员学历构成',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#ddd'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 50,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
              title: '人员学历构成保存为图片',
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
          bottom: 0,
          itemGap: 15,
          data: ['研究生', '本科', '专科', '高中', '初中', '小学'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['0', '60%'],
            data: scoreArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              fontSize: 14
            }
          }
        ]
      })
    },
    drawCityStatistical() { // 机构人员柱状图
      var cityArr = []
      var mjArr = []
      var fjArr = []
      var gqArr = []
      for (let index = 0; index < this.teamData.length; index++) {
        const element = this.teamData[index]
        cityArr.push(element.name)
        mjArr.push(element.count1)
        fjArr.push(element.count2)
        gqArr.push(element.count3)
      }
      this.cityStatistical = echarts.init(document.getElementById('cityStatistical'))
      var posList = [
        'left', 'right', 'top', 'bottom',
        'inside',
        'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
      ]
      var app = {}
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
          var labelOption = {
            normal: {
              rotate: app.config.rotate,
              align: app.config.align,
              verticalAlign: app.config.verticalAlign,
              position: app.config.position,
              distance: app.config.distance
            }
          }
          this.cityStatistical.setOption({
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
      var labelOption = {
        normal: {
          show: true,
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
      }
      this.cityStatistical.setOption({
        color: ['#08A0EC', '#4cabce', '#e5323e'],
        title: {
          text: '机构人员',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#ddd'
          }
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          right: 0,
          top: 0,
          feature: {
            saveAsImage: {
              show: true,
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['民警', '辅警', '工勤'],
          type: 'scroll',
          top: 0,
          itemGap: 15,
          textStyle: { color: '#bbbbbb' }
        },
        grid: {
          left: '5%',
          right: '5%'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: cityArr,
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
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            }
          }
        ],
        series: [
          { name: '民警', type: 'bar', barGap: 0, label: labelOption, data: mjArr },
          { name: '辅警', type: 'bar', barGap: 0, label: labelOption, data: fjArr },
          { name: '工勤', type: 'bar', barGap: 0, label: labelOption, data: gqArr }
        ]
      })
    },
    exportDeptExcel() { // 导出excel
      const param = {
        data: this.teamData
      }
      this.$gotoid('/exportTeam', JSON.stringify(param))
      // this.$router.push({ path: '/exportTeam', query: param })
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
      // console.log(this.$refs.teamStatistical.$el.clientWidth)
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
  // text-decoration: underline;
}
.el-table .row-sheng .cell .el-table__expand-icon {
  display: none;
}
.el-table .row-sheng .xuhao {
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
