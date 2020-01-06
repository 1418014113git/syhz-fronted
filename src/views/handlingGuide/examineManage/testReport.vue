<template>
  <div class="report">
    <!-- <el-card style="margin-bottom: 10px;">
    </el-card> -->
    <el-row class="btn_wrap">
      <el-button type="primary" @click="closeDia">关闭</el-button>
      <!-- @click="printReport" -->
      <!-- v-print="'#pdfDom'" -->
      <el-button type="primary" @click="printReport">打印</el-button>
      <el-button type="primary" @click="toGetPdf">下载</el-button>
    </el-row>
    <div id="pdfDom" style="padding: 20px;" ref="print">
      <p class="title" v-if="examItem.isHj">{{examItem.startTitle}} 至 {{examItem.endTitle}}考试报告</p>
      <p class="title" v-else>{{examItem.examinationName}}考试报告</p>
      <!-- 合计的考试报告 -->
      <p class="main_content" v-if="examItem.isHj">
        自 {{examItem.startDate}} 至 {{examItem.endDate}} 期间，各级单位组织考试 {{examItem.examNum}} 起，
        累计应考 {{examItem.totalNum}} 人，实考 {{examItem.realNum}} 人，
        实考占比 {{ toPercent(Number(examItem.realNum)/Number(examItem.totalNum)) }}。
      </p>
      <!-- 单个考试的考试报告 -->
      <p class="main_content" v-else>
        自 {{examItem.startDate}} 至 {{examItem.endDate}} 开展的考试活动期间，
        应考 {{examItem.totalNum}} 人，实考 {{examItem.realNum}} 人，
        实考占比 {{ toPercent(Number(examItem.realNum)/Number(examItem.totalNum)) }}。
      </p>
      <p class="main_content">
        其中考试成绩，
        优：{{examItem.y}} 人，占比 {{ toPercent(Number(examItem.y)/Number(examItem.realNum)) }}；
        良：{{examItem.l}} 人，占比 {{ toPercent(Number(examItem.l)/Number(examItem.realNum)) }}；
        中：{{examItem.z}} 人，占比 {{ toPercent(Number(examItem.z)/Number(examItem.realNum)) }}；
        差：{{examItem.c}} 人，占比 {{ toPercent(Number(examItem.c)/Number(examItem.realNum)) }}。
      </p>
      <p class="main_content">省市考试统计情况如下：</p>
      <el-table :data="cityData"  style="width: 100%" :max-height="tableHeight" border class="table_th_center" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="areaName" label="省市" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ykNum" label="应考总人数" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skNum" label="实考总人数" width="120" align="center"></el-table-column>
        <el-table-column prop="yNum" label="优" width="100" align="center"></el-table-column>
        <el-table-column prop="lNum" label="良" width="100" align="center"></el-table-column>
        <el-table-column prop="zNum" label="中" width="100" align="center"></el-table-column>
        <el-table-column prop="cNum" label="差" width="100" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 关闭按钮 -->
    <div style="text-align:center;">
      <el-button size="medium" type="primary" @click="closeDia">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'examinationStatistical',
  props: ['examItem'],
  data() {
    return {
      htmlTitle: '', // 导出pdf的文件名
      filterQuery: {
        deptCode: '',
        startDate: '',
        endDate: '',
        examinationName: '',
        type: ''
      },
      examinations: [], // 考试统计
      cityData: [], // 考试报告数据
      expandstab: [], // 设置当前的展开行
      caseData: [], // 市的列表数据
      // subDeptCaseData: [], // 下级部门列表数据
      listLoading: false, // 列表加载loading
      subLoading: false, // 子列表loading
      pageSize: 15,
      page: 1,
      total: 0,
      tableHeight: null,
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      endPickerOptions: {},
      startTime: '', // 开始时间，页面是绑定的modle
      endTime: '', // 结束时间
      yearDate: '', // 年份
      quarterDate: '', // 季度
      monthDate: '', // 月份
      quarterDisabled: true,
      monthDisabled: true,
      endDateDisabled: true, // 结束时间禁用
      examLoading: false, // 考试统计loading
      cityLoading: false, // 盟市统计loading
      cityStatistical: {},
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      multipleSelection: [], // 选中的多行
      showEchart: false,
      curDept: {} // 当前部门
    }
  },
  watch: { // 监听state状态变化
    examItem: {
      handler: function(val, oldeval) {
        // this.queryList(true)
        this.queryCityStatisticalByExam(this.examItem) // 考试统计
      }
    }
  },
  methods: {
    closeDia() { // 关闭弹框
      this.$emit('isShowDialog')
    },
    printReport() { // 打印报告
      this.$print(this.$refs.print) // 使用
    },
    toGetPdf() { // 下载报告
      window.scrollTo(0, 0)
      if (this.examItem.isHj) { // 合计的考试报告
        this.htmlTitle = this.examItem.startTitle + '至' + this.examItem.endTitle + '考试报告'
      } else {
        this.htmlTitle = this.examItem.examinationName + '考试报告'
      }
      this.getPdf(this.htmlTitle)
    },
    toPercent(point) {
      if (point) {
        var str = Number(point * 100).toFixed(1)
        str += '%'
        return str
      } else {
        return '0%'
      }
    },
    queryCityStatisticalByExam(examObj) {
      // if (hand) { // 手动点击时，添加埋点参数
      //   this.filters.logFlag = 1
      // }
      this.listLoading = true
      var examIdStr = ''
      if (examObj.isHj) { // 合计的考试报告
        examIdStr = examObj.hjIds
      } else {
        examIdStr = examObj.examinationId // 单个考试的考试报告
      }
      this.$query('examination/statisticsOne?examinationIds=' + examIdStr, {}).then((response) => {
        if (response.code === '000000') {
          this.listLoading = false
          this.cityData = response.data
          if (this.cityData.length > 0) {
            // this.showEchart = true
            for (let index = 0; index < this.cityData.length; index++) {
              var cityElement = this.cityData[index]
              cityElement.ykNum = 0 // 应考
              cityElement.skNum = 0 // 实考
              cityElement.yNum = 0
              cityElement.lNum = 0
              cityElement.zNum = 0
              cityElement.cNum = 0
              for (let m = 0; m < cityElement.child.length; m++) {
                const deptElement = cityElement.child[m]
                cityElement.ykNum += deptElement.totalNum
                cityElement.skNum += deptElement.realNum
                cityElement.yNum += deptElement.y
                cityElement.lNum += deptElement.l
                cityElement.zNum += deptElement.z
                cityElement.cNum += deptElement.c
              }
            }
          } else {
            this.cityData = []
            // this.showEchart = false
          }
          for (let q = 0; q < this.cityData.length; q++) {
            const item = this.cityData[q]
            if (item.ykNum === 0) {
              this.cityData.splice(q, 1)
              q = q - 1
            }
          }
          this.drawChartScore()
          this.drawChartPerNum()
          this.drawCityStatistical()
        }
      }).catch(() => {
        this.cityLoading = false
      })
    },
    getRowClass(row) {
      // console.log(row)
      if (!row.row.canExpand) {
        return 'row-expand-cover'
      }
    },
    drawChartScore() { // 考试成绩 饼状图
      var scoreArr = []
      if (this.cityData.length > 0) {
        var yNumAll = 0
        var lNumALl = 0
        var zNumAll = 0
        var cNumAll = 0
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          yNumAll += element.yNum
          lNumALl += element.lNum
          zNumAll += element.zNum
          cNumAll += element.cNum
        }
        scoreArr = [
          { value: yNumAll, name: '优' },
          { value: lNumALl, name: '良' },
          { value: zNumAll, name: '中' },
          { value: cNumAll, name: '差' }
        ]
      }
      // this.echartScore = echarts.init(document.getElementById('echartScore'))
      this.echartScore.setOption({
        color: ['#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '考试成绩分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
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
          data: ['优', '良', '中', '差'],
          textStyle: {
            color: '#bbbbbb',
            fontSize: 14
          }
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            // radius: ['0', '75%'],
            // center: ['50%', '60%'],
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
    drawChartPerNum() { // 参考人数 饼状图
      var joinPerArr = []
      if (this.cityData.length > 0) {
        var ykNumAll = 0 // 应考
        var skNumALl = 0 // 实考
        var qkNum = 0 // 缺考
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          ykNumAll += element.ykNum
          skNumALl += element.skNum
        }
        qkNum = Number(ykNumAll) - Number(skNumALl)
        joinPerArr = [
          { value: skNumALl, name: '实考人数' },
          { value: qkNum, name: '缺考人数' }
        ]
      }
      // this.echartPerNum = echarts.init(document.getElementById('echartPerNum'))
      this.echartPerNum.setOption({
        color: ['#0ECACA', '#1088F6', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#22AC38', '#0086D1'],
        title: {
          text: '参考情况分析',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
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
          data: ['实考人数', '缺考人数'],
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
            center: ['50%', '60%'],
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
    drawCityStatistical() { // 地市考试分析柱状图
      var cityArr = [['product', '应考人数', '实考人数']]
      if (this.cityData.length > 0) {
        for (let p = 0; p < this.cityData.length; p++) {
          const element = this.cityData[p]
          var arr = [element.areaName, element.ykNum, element.skNum]
          cityArr.push(arr)
        }
      }
      // this.cityStatistical = echarts.init(document.getElementById('cityStatistical'))
      this.cityStatistical.setOption({
        title: {
          text: '地市考试分析',
          subtext: '',
          x: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          textStyle: { color: '#bbbbbb' }
        },
        tooltip: {},
        dataset: {
          source: cityArr
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          { type: 'bar', barWidth: 30, itemStyle: { color: '#5DB1FF' }},
          { type: 'bar', barWidth: 30, barGap: 0, itemStyle: { color: '#20CF53' }}
        ]
      })
    }
  },
  destroyed() {
    sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    if (this.examItem) {
      this.queryCityStatisticalByExam(this.examItem) // 考试统计
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.report {
  .btn_wrap {
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  // 文章样式
  .title {
    font-size: 26px;
    text-align: center;
  }
  .main_content {
    font-size: 16px;
    text-indent: 20px;
  }
  .el-table {
    background: #ffffff;
    color: #000000;
    thead {
      background: #ffffff;
      color: #000000;
    }
    .el-table__body-wrapper tr:nth-child(even) {
      background-color: transparent;
    }
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table th > .cell,
  .el-table__empty-text {
    color: #000000;
  }
}
@media print {
  // 文章样式
  .title {
    font-size: 26px;
    text-align: center;
  }
  .main_content {
    font-size: 16px;
    text-indent: 20px;
  }
}
</style>
