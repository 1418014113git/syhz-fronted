<template>
  <div class="deptStatistical">
    <el-row class="clearfix">
      <img src="@/assets/icon/back.png" class="goBack" @click="back" style="margin-right: 10px;">
    </el-row>
    <div style="margin: 0 0 10px 0;" v-if="deptPerData && deptPerData.length > 0">{{deptPerData[0].deptName}}_队伍基本情况</div>
    <el-table :data="deptPerData"  style="width: 100%;" :max-height="tableHeight"
      v-loading="teamLoading" class="table_th_center">
      <el-table-column prop="usort" label="人员类型" :min-width="smallItemWidth-10" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.usort">{{$getDictName(scope.row.usort+'','rylx')}}</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="ryNum" label="人员数量" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="avgAge" label="平均年龄" :min-width="smallItemWidth" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sumAge&&scope.row.sumAgeCount">{{Math.round(scope.row.sumAge / scope.row.sumAgeCount)}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="性别" align="center">
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
    <div style="margin: 30px 0 10px 0;" v-if="deptPerData && deptPerData.length > 0">{{deptPerData[0].deptName}}_相关人员及联系人</div>
    <el-table :data="deptDetail" style="width: 100%;border-left: none;" v-loading="detailLoading" max-height="400">
      <el-table-column prop="mainName" label="主要负责人" align="center" :min-width="smallItemWidth+100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mainDuty" label="主要负责人职务" :min-width="smallItemWidth+100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $getDictName(scope.row.mainDuty+'', xrzw) }}
        </template>
      </el-table-column>
      <el-table-column prop="mainPhone" label="主要负责人联系方式" :min-width="smallItemWidth+160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.mainWorkPhone && scope.row.mainPhone">{{scope.row.mainWorkPhone+','+scope.row.mainPhone}}</span>
          <span v-else-if="scope.row.mainWorkPhone">{{scope.row.mainWorkPhone}}</span>
          <span v-else-if="scope.row.mainPhone">{{scope.row.mainPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dailyName" label="日常联系人" align="center" :min-width="smallItemWidth+100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dailyDuty" label="日常联系人职务" :min-width="smallItemWidth+100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $getDictName(scope.row.mainDuty+'', xrzw) }}
        </template>
      </el-table-column>
      <el-table-column prop="dailyPhone" label="日常联系人联系方式" :min-width="smallItemWidth+160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.dailyWorkerPhone && scope.row.dailyPhone">{{scope.row.dailyWorkerPhone+','+scope.row.dailyPhone}}</span>
          <span v-else-if="scope.row.dailyWorkerPhone">{{scope.row.dailyWorkerPhone}}</span>
          <span v-else-if="scope.row.dailyPhone">{{scope.row.dailyPhone}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 饼状图 -->
    <div class="clearfix" style="margin: 50px 0 80px;">
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
      <div id="echartZzmm" style="width: 500px; height: 400px;" v-show="customChart==='1'"></div>
      <div id="echartHdxw" style="width: 500px; height: 400px;" v-show="customChart==='2'"></div>
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
      deptPerData: [], // 队伍基本情况统计
      deptDetail: [], // 相关人员及联系人
      expandstab: [], // 设置当前的展开行
      caseData: [], // 市的列表数据
      tableHeight: null,
      endDateDisabled: true, // 结束时间禁用
      teamLoading: false, // 考试统计loading
      detailLoading: false,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      carryParam: {}, // 传递来的参数
      curDept: {}, // 当前部门
      customChart: '', // 自选择统计图
      xrzw: '' // 根据当前用户角色是总队，还是支队，存储对应的字典key值， ‘xrzwzod’：总队， 'xrzwzhd':支队
    }
  },
  components: {
  },
  methods: {
    queryDeptStatistical(hand) { // 队伍统计
      this.teamLoading = true
      var param = {
        departCode: this.carryParam.departCode // 队伍列表传递来的 部门 code
      }
      if (hand) { // 手动点击时，添加埋点参数
        param.logFlag = 1
      }
      // hsyzusertotal
      this.$query('dept/statisticsDetail', param, 'upms').then((response) => {
        if (response.code === '000000') {
          this.teamLoading = false
          this.deptPerData = response.data
          if (!this.deptPerData[0].deptName) {
            this.deptPerData[0].deptName = this.carryParam.departName // 机构名称
          }
        }
      }).catch(() => {
        this.teamLoading = false
      })
      this.queryEchart(param) // 查询统计图数据
    },
    queryEchart(param) { // 查询统计数据
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
    queryDeptDetail() { // 查询机构的基本情况
      this.detailLoading = true
      this.deptDetail = []
      this.$query('hsyzdepartleader/' + this.carryParam.departCode, {}, 'upms').then((response) => {
        this.detailLoading = false
        if (response.code === '000000') {
          this.deptDetail.push(response.data)

          if (this.deptDetail[0].departType === '1') { // 总队
            this.xrzw = 'xrzwzod'
          } else if (this.deptDetail[0].departType === '2') { // 支队
            this.xrzw = 'xrzwzhd'
          } else if (this.deptDetail[0].departType === '3') { // 大队
            this.xrzw = 'xrzwdd'
          }
          // else if (this.deptDetail.depType === '4') { // 派出所
          //   this.xrzw = 'xrzwpcs'
          // }
          // this.drawChartAge() // 年龄
          // this.drawChartGender() // 性别
          // this.drawChartEducation() // 学历
        }
      }).catch(() => {
        this.teamLoading = false
      })
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
      // var joinPerArr = []
      // if (this.cityData.length > 0) {
      var joinPerArr = [
        { value: this.echartAllData.sex0, name: '男性' },
        { value: this.echartAllData.sex1, name: '女性' }
      ]
      // }
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
      // echartZzmm.resize() // 重置echarts的宽度，达到自适应
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
      // echartHdxw.resize() // 重置echarts的宽度，达到自适应
    },
    customChartChange(val) { // 自选择统计图 change事件
      if (val) {
        if (val === '1') { // 政治面貌构成
          this.drawChartZzmm()
        } else if (val === '2') { // 获得学位构成
          this.drawChartXw()
        }
      } else {
        // 统计图隐藏
      }
    },
    back() {
      this.$router.back(-1)
    }
  },
  destroyed() {
    // sessionStorage.removeItem('/caseManage/caseClaimStatistical')
  },
  mounted() {
    // 队伍统计 传来的 机构code
    if (this.$route.query && this.$route.query.departCode) {
      this.carryParam = this.$route.query
      this.queryDeptStatistical() // 人数统计
      this.queryDeptDetail() // 相关人员查询
    }
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
  cursor: pointer;
}
.canClick:hover {
  text-decoration: underline;
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
