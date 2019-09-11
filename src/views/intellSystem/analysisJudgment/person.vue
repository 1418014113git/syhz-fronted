<template>
  <div style="height: 100%;">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div style="height: 100%;text-align:center">
      <el-card style="margin-bottom: 10px;">
        <el-form :inline="true">
          <el-form-item label="立案日期">
            <el-date-picker v-model="data.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="案件状态">
            <el-select v-model="data.ajzt" :clearable="true" size="small" placeholder="请选择" filterable>
              <el-option v-for="item in ajzt" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员性别">
            <el-select v-model="data.ryxb" :clearable="true" size="small" placeholder="请选择" filterable>
              <el-option v-for="item in ryxb" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省">
            <el-select v-model="data.province" :clearable="true" size="small" placeholder="请选择" filterable>
              <el-option v-for="item in province" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-select v-model="data.city" :clearable="true" size="small" placeholder="请选择" filterable>
              <el-option v-for="item in city" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-bottom: 10px;" v-loading="listLoading">
        <div :span="20" class="right-layout">
        <div id="cyzt" class="frame right-item" style="min-height: 417px;">
          <div class="header">
            <span>嫌疑人分析</span>
          </div>
          <div id="cyztEChart" class="content" style="height: 377px;">
          </div>
        </div>
        <div id="dxfx" class="frame right-item" style="min-height: 130px;">
          <div class="header">
            <span>嫌疑人性别比例</span>
          </div>
          <div class="content" style="height: 377px;">
            <el-col id="dxfxEChartZX" :span="12" style="height: 100%;">

            </el-col>
            <el-col id="dxfxEChartBin" :span="12" style="height: 100%;">

            </el-col>
          </div>
        </div>
      </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import eChart from 'echarts'

  export default {
    name: 'analysis',
    data() {
      return {
        ajzt: [
          {
            code: 1,
            name: '结案'
          },
          {
            code: 2,
            name: '立案'
          },
          {
            code: 3,
            name: '受理'
          }
        ],
        ryxb: [
          {
            code: 1,
            name: '男'
          },
          {
            code: 2,
            name: '女'
          }
        ],
        province: [
          {
            code: 1,
            name: '陕西省'
          },
          {
            code: 2,
            name: '山西省'
          },
          {
            code: 3,
            name: '山东省'
          },
          {
            code: 4,
            name: '广东省'
          }
        ],
        city: [
          {
            code: 1,
            name: '西安市'
          },
          {
            code: 3,
            name: '延安市'
          },
          {
            code: 4,
            name: '咸阳市'
          }
        ],
        leftItems: [
          {
            id: '1',
            jp: 'cyzt',
            value: '嫌疑人分析',
            icon: '/static/image/caseFile_images/bzts.png'
          },
          {
            id: '2',
            jp: 'dxfx',
            value: '嫌疑人性别比例',
            icon: '/static/image/caseFile_images/ydzc.png'
          }
        ],
        currentIndex: 0,
        tableTitle: 'mine-table-title',
        tableTitleAndColor: 'mine-table-title mine-table-title-color',
        cyztEChart: null,
        dxfxZXEChart: null,
        dxfxBinEChart: null,
        data: {},
        listLoading: false
      }
    },
    components: {},
    methods: {
      query() {
        this.showCYZTECharts(true)
        this.showDXFXZXECharts(true)
        this.showDXFXEBinCharts(true)
      },
      toback() {
        window.history.go(-1)
      },
      clickItem(item, index) {
        const _this = this
        this.currentIndex = index
        var top = 0
        if (index > 0) {
          for (var i = 0; i <= index - 1; i++) {
            var jp = _this.leftItems[i].jp
            top += $('#' + jp)[0].offsetHeight + 30
          }
        }
        $('.right-layout').animate({ 'scrollTop': top }, 500)
      },
      showCYZTECharts: function(hand) {
        const _this = this
        // if (hand) { // 手动点击时，添加埋点参数
        //   logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
        // }
        _this.cyztEChart = eChart.init(document.getElementById('cyztEChart'))
        var option = {
          title: {
            text: '嫌疑人数',
            textStyle: {
              color: '#bce8fc'
            }
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['西安市', '宝鸡市', '咸阳市', '银川市', '渭南市', '延安市', '榆林市', '汉中市', '安康市', '商洛市'],
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                lineStyle: {
                  color: '#bce8fc'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#bce8fc'
                }
              }
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: '30%',
              data: [300, 120, 50, 40, 120, 305, 130, 120, 110, 110]
            }
          ]
        }
        _this.cyztEChart.setOption(option)
      },
      showDXFXZXECharts: function(hand) {
        const _this = this
        // if (hand) { // 手动点击时，添加埋点参数
        //   logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
        // }
        _this.dxfxZXEChart = eChart.init(document.getElementById('dxfxEChartZX'))
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#23ce7b', '#f46470'],
          legend: {
            data: ['男', '女'],
            textStyle: {
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2019-04', '2019-05', '2019-06', '2019-07', '2019-08'],
            axisLine: {
              lineStyle: {
                color: '#bce8fc'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#bce8fc'
              }
            }
          },
          series: [
            {
              name: '男',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190],
              lineStyle: {
                color: '#f46470'
              }
            },
            {
              name: '女',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90],
              lineStyle: {
                color: '#23ce7b'
              }
            }
          ]
        }
        _this.dxfxZXEChart.setOption(option)
      },
      showDXFXEBinCharts: function(hand) {
        const _this = this
        // if (hand) { // 手动点击时，添加埋点参数
        //   logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
        // }
        _this.dxfxBinEChart = eChart.init(document.getElementById('dxfxEChartBin'))
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}:{c} ({d}%)'
          },
          color: ['#f46470', '#23ce7b'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['男', '女'],
            textStyle: {
              color: '#ffffff'
            }
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {
                  value: 577,
                  name: '女'
                },
                {
                  value: 1117,
                  name: '男'
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
        }
        _this.dxfxBinEChart.setOption(option)
      },
      reset() {
        this.data = {
          time: null,
          ajzt: '',
          ryxb: '',
          province: '',
          city: ''
        }
        this.query()
      }
    },
    created() {
    },
    mounted() {
      const _this = this
      _this.showCYZTECharts()
      _this.showDXFXZXECharts()
      _this.showDXFXEBinCharts()
      $('.right-layout').scroll(function(e) {
        for (var i = 0; i < _this.leftItems.length; i++) {
          if ($('.right-layout').scrollTop() > $('#' + _this.leftItems[i].jp)[0].offsetTop) {
            _this.currentIndex = i + 1
          } else if ($('.right-layout').scrollTop() === 0) {
            _this.currentIndex = 0
          }
        }
      })
    }
  }
</script>

<style>
  .mine-table-title {
    font-size: 14px;
  }

  .mine-table-title-color {
    color: #bce8fc !important;
    cursor: pointer;
  }

  .mine-table-title:hover {
    text-decoration: underline;
    text-underline: #bce8fc;
  }
</style>

<style scoped>
  .left-layout {
    height: 100%;
    position: relative;
  }

  .left-content {
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }

  .left-items {
    width: 90%;
    display: inline-block;
    padding: 25px 0;
    float: left;
  }

  .frame {
    border: 2px solid #00a0e9;
    background-color: rgba(0, 64, 94, 0.7);
    border-radius: 8px;
  }

  .left-item {
    line-height: 39px;
    height: 39px;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  .left-item > img {
    width: 21px;
    height: 21px;
  }

  .left-item:hover {
    cursor: pointer;
  }

  .clicked {
    background-color: #00a0e9;
    color: #fff;
  }

  .right-layout {
    height: 100%;
  }

  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: url(/static/image/personFile_images/titlePub.png) no-repeat;
    background-size: 100% 100%
  }

  .header span {
    color: #bce8fc;
    font-size: 16px;
    padding-left: 20px;
  }

  .right-item {
    width: 100%;
    margin-bottom: 30px;
  }

  .content {
    padding: 20px;
  }

  .content > span {
    font-size: 14px;
    color: #bce8fc;
  }

</style>
