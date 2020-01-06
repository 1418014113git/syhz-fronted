<template>
  <div class="deptStatistical">
    <el-form :inline="true" :model="filters" ref="filters" label-width="80px" style="text-align: left;">
      <el-form-item label="行政区划" prop="examStatus">
        <el-cascader
          :options="xzqhOptions"
          v-model="filters.area"
          :props="props"
          change-on-select
          @change="handleAreaChange"
          :show-all-levels="false"
          clearable placeholder="全部">
        </el-cascader>
      </el-form-item>
      <el-form-item label="单位机构" prop="examStatus">
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>9)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="filters.department"
            :props="deptProps"
            change-on-select
            :show-all-levels="false"
            @change="handleDeptChange"
            clearable placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="人员类型" prop="userSort">
        <el-select  v-model="filters.userSort" size="small" placeholder="全部" clearable>
          <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('rylx')" :key="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryTeamStatistical(true)">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button type="info" @click="exportDeptExcel" v-if="exportBtn && $isViewBtn('182001')">导出</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0;"><i class="el-icon-info"></i>&nbsp;&nbsp;队伍基本情况只统计到大队，杨凌示范区没有大队只统计到支队！</div>
    <el-table :data="teamData"  style="width: 100%;" :max-height="tableHeight" v-loading="teamLoading" class="table_th_center"
      :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="rowClick"
     ref="teamStatistical" :row-class-name="getRowClass">
     <!-- show-summary :summary-method="getSummaries" -->
      <el-table-column type="expand" width="40" v-if="firstCanJump===false" class-name="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.list||[]" :style="expandTableStyle" v-loading="listChildLoading" max-height="400">
            <el-table-column prop="" label="" width="40"></el-table-column>
            <el-table-column type="index" label="序号" align="center" :min-width="smallItemWidth-10"></el-table-column>
            <el-table-column prop="deptName" label="单位机构" align="center" :min-width="smallItemWidth+70" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="canClick" @click="goDeptStatistical(scope.row)">{{scope.row.deptName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ryNum" label="人员数量" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="avgAge" label="平均年龄" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="性别">
              <el-table-column prop="sex0" label="男" :min-width="smallItemWidth" align="center"></el-table-column>
              <el-table-column prop="sex1" label="女" :min-width="smallItemWidth" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="" label="政治面貌" align="center">
              <el-table-column prop="zzmm1" label="中共党员" :min-width="smallItemWidth+26" align="center"></el-table-column>
              <el-table-column prop="zzmm3" label="共青团员" :min-width="smallItemWidth+26" align="center"></el-table-column>
              <el-table-column prop="zzmm2" label="民主党派" :min-width="smallItemWidth+26" align="center"></el-table-column>
              <el-table-column prop="zzmm4" label="群众" :min-width="smallItemWidth+26" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="" label="文化程度（学历）" align="center">
              <el-table-column prop="whcd1" label="研究生" :min-width="smallItemWidth+16" align="center"></el-table-column>
              <el-table-column prop="whcd3" label="本科" :min-width="smallItemWidth+16" align="center"></el-table-column>
              <el-table-column prop="whcd2" label="专科" :min-width="smallItemWidth+16" align="center"></el-table-column>
              <el-table-column prop="whcd4" label="高中" :min-width="smallItemWidth+16" align="center"></el-table-column>
              <el-table-column prop="whcd5" label="初中" :min-width="smallItemWidth+16" align="center"></el-table-column>
              <el-table-column prop="whcd6" label="小学" :min-width="smallItemWidth+16" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="" label="获得学位">
              <el-table-column prop="xw1" label="博士" :min-width="smallItemWidth" align="center"></el-table-column>
              <el-table-column prop="xw2" label="硕士" :min-width="smallItemWidth" align="center"></el-table-column>
              <el-table-column prop="xw3" label="学士" :min-width="smallItemWidth" align="center"></el-table-column>
              <el-table-column prop="xw4" label="无" :min-width="smallItemWidth" align="center"></el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" :min-width="smallItemWidth-10" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位机构':'省市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.canClickJump===true" class="canClick" @click="goDeptStatistical(scope.row)">{{scope.row.deptName}}</span>
          <span v-else>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ryNum" label="人员数量" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="avgAge" label="平均年龄" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" label="性别">
        <el-table-column prop="sex0" label="男" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="sex1" label="女" :min-width="smallItemWidth" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="政治面貌" align="center">
        <el-table-column prop="zzmm1" label="中共党员" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm3" label="共青团员" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm2" label="民主党派" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm4" label="群众" :min-width="smallItemWidth+26" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="文化程度（学历）" align="center">
        <el-table-column prop="whcd1" label="研究生" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd3" label="本科" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd2" label="专科" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd4" label="高中" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd5" label="初中" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd6" label="小学" :min-width="smallItemWidth+16" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="获得学位">
        <el-table-column prop="xw1" label="博士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw2" label="硕士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw3" label="学士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw4" label="无" :min-width="smallItemWidth" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <!-- 柱状图 -->
    <div id="cityStatistical" style="height: 550px;margin:40px 0;" v-if="showEchartZzt"></div>
    <!-- 饼状图 -->
    <div class="clearfix" style="margin: 50px 0 80px;" v-if="showEchart">
      <div id="echartAge" style="width: 33%; height: 400px; float:left;"></div>
      <div id="echartGender" style="width: 33%; height: 400px; float:left;"></div>
      <div id="echartEducation" style="width: 33%; height: 400px; float:left;"></div>
    </div>
    <!-- 自选择统计 -->
    <el-select  v-model="customChart" size="small" placeholder="请选择" @change="customChartChange">
      <el-option label="政治面貌构成" value="1"></el-option>
      <el-option label="获得学位构成" value="2"></el-option>
    </el-select>
    <div class="clearfix" style="margin: 50px 0 80px;">
      <div id="echartZzmm" style="width: 500px; height: 400px;float:left;" v-show="customChart==='1'"></div>
      <div id="echartHdxw" style="width: 500px; height: 400px;float:left;" v-show="customChart==='2'"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { getTree } from '@/api/dept'
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
      showEchartZzt: true, // 柱状图
      selectCurDep: { name: '' },
      expands: [], // 展开的行
      echartAllData: {}, // 三个饼状图的数据源
      exportBtn: false, // 是否显示导出按钮
      screenWidth: '', // 屏幕宽度
      expandTableStyle: '', // 展开表格的样式 宽度需要动态获取
      customChart: '', // 自选择统计图
      curDept: {} // 当前部门
    }
  },
  components: {
  },
  methods: {
    getRowClass(row) {
      if (row.row.cityName === '合计') { // 合计行 隐藏展开符号 和 序号
        return 'row-expand-cover'
      }
    },
    getRowKeys(row) {
      return row.deptCode
    },
    rowClick(row) {
      if (this.expands.indexOf(row.deptCode) > -1) { // 展开项中存在
        this.expands.splice(this.expands.indexOf(row.deptCode), 1)
      } else { // 展开项中不存在
        this.expands.push(row.deptCode)
        if (row.deptCode === '610000530000') { // 省厅
          // this.queryTeamStatistical(true, row.deptCode) // 根据部门code查
        } else {
          if (row.cityCode) {
            // this.queryTeamStatistical(true, row.cityCode) // 根据盟市code查
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
        if (this.firstCanJump === true) {
          if (index === 1) {
            sums[index] = '合计'
            return
          }
        } else {
          if (index === 2) {
            sums[index] = '合计'
            return
          }
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
    handleAreaChange(val) { // 行政区划
      this.filters.department = []
      if (val.length > 0) {
        this.deptOptions = [] // 清空单位机构数据
        this.selectCurDep = { name: '' } // 清空当前选中的单位机构
        var param = {
          provinceCode: val[0] || '',
          cityCode: val[1] || '',
          reginCode: val[2] || ''
        }
        this.$query('hsyzdeparttree', param, 'upms').then((response) => {
          if (response.code === '000000') {
            if (response.data && response.data.length > 0) {
              var arr = []
              const data = response.data
              for (let i = 0; i < data.length; i++) {
                const obj = data[i]
                if (obj.depType !== '4') { // 去掉派出所
                  arr.push({
                    id: obj.id, name: obj.dep_name, cityCode: obj.city_code,
                    depCode: obj.dep_code, parentCode: obj.super_dep_code, depType: obj.depType
                  })
                }
              }
              this.deptOptions = getTree(arr) // 机构
            }
          }
        }).catch(() => {
          this.formLoading = false
        })
      } else {
        this.deptOptions = []
      }
    },
    handleDeptChange(val) { // 单位机构
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.selectCurDep = { name: '' }
      }
    },
    initData() { // 初始化筛选条件
      // 行政区划
      this.teamLoading = true
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.xzqhOptions = response.data ? response.data : []
          var currentArea = []
          if (this.deptInfo.depType === '-1' || this.deptInfo.depType === '1') { // 省 总队
            currentArea = [this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '2') { // 支队
            currentArea = ['610000', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '3') { // 大队 派出所
            currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
          } else if (this.deptInfo.depType === '4') {
            if (this.deptInfo.areaCode === '611400') { // 杨凌例外
              currentArea = ['610000', '611400']
            } else { // 正常的派出所
              currentArea = ['610000', this.deptInfo.areaCode.substring(0, 4) + '00', this.deptInfo.areaCode]
            }
          }
          this.filters.area = currentArea
          this.handleAreaChange(currentArea) // 查单位机构
          // 默认选择本单位
          if (this.deptInfo.depType === '3') { // 有可能区县下有多个大队  所以要默认选择一个行政区划+当前的单位机构
            this.filters.department = [this.deptInfo.depCode]
          }
          // if (this.deptInfo.depType === '-1') { // 省
          //   this.filters.department = [this.deptInfo.depCode]
          // } else if (this.deptInfo.depType === '1') { // 总队
          //   this.filters.department = [this.deptInfo.parentDepCode, this.deptInfo.depCode]
          // } else if (this.deptInfo.depType === '2') { // 支队
          //   this.filters.department = [this.deptInfo.depCode]
          // } else if (this.deptInfo.depType === '3') { // 大队
          //   this.filters.department = [this.deptInfo.depCode]
          // }
          this.queryTeamStatistical()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryTeamStatistical(hand, city) { // 队伍统计
      this.exportBtn = true // 导出按钮 显隐
      this.showEchartZzt = false // 柱状图隐藏
      var param = {
        userSort: this.filters.userSort // 人员类型
      }
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
        if (this.filters.department && this.filters.department.length > 0) { // 如果选了 筛选条件的单位机构
          param.departCode = this.filters.department[this.filters.department.length - 1] // 部门code
          param.provinceCode = ''
          param.cityCode = ''
        } else if (this.filters.area && this.filters.area.length === 3) { // 区县 大队
          param.reginCode = this.filters.area[this.filters.area.length - 1] // 部门code
          param.departCode = ''
          param.provinceCode = ''
          param.cityCode = ''
        } else if (this.filters.area && this.filters.area.length === 2) { // 市 支队
          param.cityCode = this.filters.area[this.filters.area.length - 1]
        } else {
          param.provinceCode = '610000'
          this.showEchartZzt = true
        }
      }
      // 原接口 hsyzusertotal
      this.$query('dept/statistics', param, 'upms').then((response) => {
        if (response.code === '000000') {
          if (city) {
            this.listChildLoading = false
            for (let i = 0; i < this.teamData.length; i++) {
              const item = this.teamData[i]
              if (city === '610000530000') { // 省厅
                if (item.deptCode === city) {
                  item.child = response.data[0].list
                }
              } else {
                if (item.cityCode === city) {
                  item.child = response.data[0].list
                }
              }
            }
          } else {
            this.teamLoading = false
            var canClick = true
            this.teamData = response.data // 如果是全省 返回的是带有list的，如果非全省 直接返回的是机构的列表
            if (param.provinceCode === '610000') { // 查全省
              this.drawCityStatistical()
              this.exportBtn = true // 导出按钮显示
              this.firstCanJump = false
              canClick = false
            } else {
              this.firstCanJump = true // 控制 表头显示 省市 还是单位机构
              canClick = true // 一级的表格可跳转
            }
            for (let index = 0; index < this.teamData.length; index++) {
              const element = this.teamData[index]
              if (!element.cityName) {
                element.cityName = '合计'
                element.canClickJump = false // 合计 不能跳转
              } else {
                element.canClickJump = canClick // 是否可点击跳转
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
      // hsyzgusertotal
      this.$query('dept/statisticsChart', param, 'upms').then((response) => {
        if (response.code === '000000') {
          this.echartAllData = response.data[0]
          this.drawChartAge() // 年龄
          this.drawChartGender() // 性别
          this.drawChartEducation() // 学历
          this.drawChartZzmm() // 政治面貌
          this.drawChartXw() // 学位
        }
      }).catch(() => {
        this.teamLoading = false
      })
    },
    goDeptStatistical(row) { // 跳转到机构 页面
      this.$router.push({ path: '/basicService/deptStatistical', query: { departCode: row.deptCode, departName: row.deptName }})
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
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
    drawChartZzmm() { // 政治面貌 饼状图
      // var scoreArr = []
      // if (this.cityData.length > 0) {
      var scoreArr = [
        { value: this.echartAllData.zzmm1, name: '中共党员' },
        { value: this.echartAllData.zzmm2, name: '民主党派' },
        { value: this.echartAllData.zzmm3, name: '共青团员' },
        { value: this.echartAllData.zzmm4, name: '群众' }
      ]
      // }
      var echartZzmm = echarts.init(document.getElementById('echartZzmm'))
      echartZzmm.setOption({
        color: ['#1088F6', '#00C9E9', '#2CEC8B', '#FAD345', '#F67C4E', '#F84C6E', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '人员政治面貌构成',
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
              title: '人员政治面貌构成保存为图片',
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
          data: ['中共党员', '民主党派', '共青团员', '群众'],
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
    drawChartXw() { // 学位 饼状图
      // var scoreArr = []
      // if (this.cityData.length > 0) {
      var scoreArr = [
        { value: this.echartAllData.xw1, name: '博士' },
        { value: this.echartAllData.xw2, name: '硕士' },
        { value: this.echartAllData.xw3, name: '学士' },
        { value: this.echartAllData.xw4, name: '无' }
      ]
      // }
      var echartHdxw = echarts.init(document.getElementById('echartHdxw'))
      echartHdxw.setOption({
        color: ['#1088F6', '#00C9E9', '#2CEC8B', '#FAD345', '#F67C4E', '#F84C6E', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '人员学位构成',
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
              title: '人员学位构成保存为图片',
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
          data: ['博士', '硕士', '学士', '无'],
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
      var mjArr = [] // 民警数量
      var fjArr = [] // 辅警数量
      var gqArr = [] // 工勤数量
      var legendArr = []
      if (!this.filters.userSort) {
        legendArr = ['民警', '辅警', '工勤']
      } else if (this.filters.userSort === '1') {
        legendArr = ['民警']
      } else if (this.filters.userSort === '2') {
        legendArr = ['辅警']
      } else if (this.filters.userSort === '3') {
        legendArr = ['工勤']
      }
      for (let index = 0; index < this.teamData.length - 1; index++) { // 此处减一 是因为teamData中有合计行，合计行不需要体现在统计图
        const element = this.teamData[index]
        cityArr.push(element.cityName)
        mjArr.push(element.usort1)
        fjArr.push(element.usort2)
        gqArr.push(element.usort3)
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
      var seriesDataArr = [] // 根据选择不同的人员类型 赋值对应的 数据
      var colorCustom = [] // 根据选择不同的人员类型 赋值对应的 颜色
      if (!this.filters.userSort) {
        seriesDataArr = [
          { name: '民警', type: 'bar', barGap: 0, label: labelOption, data: mjArr },
          { name: '辅警', type: 'bar', barGap: 0, label: labelOption, data: fjArr },
          { name: '工勤', type: 'bar', barGap: 0, label: labelOption, data: gqArr }
        ]
        colorCustom = ['#08A0EC', '#4cabce', '#e5323e']
      } else if (this.filters.userSort === '1') {
        seriesDataArr = [
          { name: '民警', type: 'bar', barGap: 0, label: labelOption, data: mjArr }
        ]
        colorCustom = ['#08A0EC']
      } else if (this.filters.userSort === '2') {
        seriesDataArr = [
          { name: '辅警', type: 'bar', barGap: 0, label: labelOption, data: fjArr }
        ]
        colorCustom = ['#4cabce']
      } else if (this.filters.userSort === '3') {
        seriesDataArr = [
          { name: '工勤', type: 'bar', barGap: 0, label: labelOption, data: gqArr }
        ]
        colorCustom = ['#e5323e']
      }
      this.cityStatistical.setOption({
        color: colorCustom,
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
          data: legendArr,
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
        series: seriesDataArr
      }, true) // 此处加true，解决 人员类型改变后 echarts 重新渲染问题
    },
    customChartChange(val) { // 自选择统计图 change事件
      if (val) {
        if (val === '1') { // 政治面貌构成
          // this.drawChartZzmm()
        } else if (val === '2') { // 获得学位构成
          // this.drawChartXw()
        }
      } else {
        // 统计图隐藏
      }
    },
    exportDeptExcel() { // 导出excel
      const param = {
        data: this.teamData
      }
      this.$gotoid('/exportTeam', JSON.stringify(param))
      // this.$router.push({ path: '/exportTeam', query: param })
    },
    reset() { // 重置
      this.filters = {
        area: [],
        department: []
      }
      this.initData()
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    this.initData() // 初始化筛选条件数据
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
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  .row-expand-cover .xuhao .cell div {
    color: transparent;
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
