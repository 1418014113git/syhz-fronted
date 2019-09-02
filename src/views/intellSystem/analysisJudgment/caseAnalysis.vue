<template>
  <div style="height: 100%;">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div style="height: 100%;">
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="采集时间从：">
            <el-date-picker type="date" placeholder="采集时间" size="small"></el-date-picker>
          </el-form-item>
          <el-form-item label="到：">
            <el-date-picker type="date" placeholder="采集时间" size="small"></el-date-picker>
          </el-form-item>
          <el-form-item label="高发类型：">
            <el-select :clearable="true" v-model="ajlb" size="small" placeholder="请选择" filterable>
              <el-option v-for="item in ajlbData" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="query">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="right-layout">
        <div id="cyzt" class="frame right-item" style="min-height: 417px;">
          <div class="header">
            <span>案件类别分析</span>
          </div>
          <div id="cyztEChart" class="content" style="height: 377px;">
          </div>
        </div>
        <div id="dlfx" class="frame right-item" style="min-height: 417px;">
          <div class="header">
            <span>案件类别走势分析</span>
          </div>
          <div id="dlfxEChart" class="content" style="height: 377px;">
          </div>
        </div>
      </el-col>
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
        ajlb: '',
        ajlbData: [],
        qxx: {},
        currentIndex: 0,
        tableTitle: 'mine-table-title',
        tableTitleAndColor: 'mine-table-title mine-table-title-color',
        cyztEChart: null,
        dlfxEChart: null,
        dxfxZXEChart: null,
        dxfxBinEChart: null
      }
    },
    components: {},
    methods: {
      toback() {
        window.history.go(-1)
      },
      initAjlb() { // 初始化案件类别
        this.$query('getajlb', {}).then((response) => {
          if (response.data && response.data.length > 0) {
            this.ajlbData = response.data
          }
        }).catch(() => {
        })
      },
      query() {

      },
      reset() {

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
      showCYZTECharts: function() {
        const _this = this
        _this.cyztEChart = eChart.init(document.getElementById('cyztEChart'))
        var option = {
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
              data: ['西安市', '宝鸡市', '咸阳市', '铜川市', '渭南市', '延安市', '榆林市', '汉中市', '安康市', '商洛市'],
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
              name: '案件数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220, 120, 160, 330]
            }
          ]
        }
        _this.cyztEChart.setOption(option)
      },
      showDLFXCharts: function() {
        const _this = this
        _this.dlfxEChart = eChart.init(document.getElementById('dlfxEChart'))
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#a76f00', '#d0e3fe', '#F43F0D'],
          legend: {
            data: ['西安市', '宝鸡市', '咸阳市', '铜川市', '渭南市', '延安市', '榆林市', '汉中市', '安康市', '商洛市'],
            textStyle: {
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
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
            data: ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12'],
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
              name: '西安市',
              type: 'line',
              stack: '案件总量',
              data: [120, 132, 101, 134, 90, 500, 700, 500, 400, 200, 400, 756],
              lineStyle: {
                color: '#f46470'
              }
            },
            {
              name: '宝鸡市',
              type: 'line',
              stack: '案件总量',
              data: [220, 182, 191, 234, 290, 887, 556, 410, 452, 621, 741, 564],
              lineStyle: {
                color: '#ffb337'
              }
            },
            {
              name: '咸阳市',
              type: 'line',
              stack: '案件总量',
              data: [150, 232, 201, 154, 190, 784, 985, 455, 123, 254, 301, 741],
              lineStyle: {
                color: '#23ce7b'
              }
            },
            {
              name: '铜川市',
              type: 'line',
              stack: '案件总量',
              data: [156, 286, 389, 565, 1290, 888, 1000, 1214, 556, 756, 414, 874],
              lineStyle: {
                color: '#a257ed'
              }
            },
            {
              name: '渭南市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#fee344'
              }
            },
            {
              name: '延安市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#01ccff'
              }
            },
            {
              name: '榆林市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#07ecc8'
              }
            },
            {
              name: '汉中市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#a76f00'
              }
            },
            {
              name: '安康市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#d0e3fe'
              }
            },
            {
              name: '商洛市',
              type: 'line',
              stack: '案件总量',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              lineStyle: {
                color: '#F43F0D'
              }
            }
          ]
        }
        _this.dlfxEChart.setOption(option)
      },
      showDXFXZXECharts: function() {
        const _this = this
        _this.dxfxZXEChart = eChart.init(document.getElementById('dxfxEChartZX'))
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#f46470', '#ffb337', '#23ce7b'],
          legend: {
            data: ['正面', '中性', '负面'],
            textStyle: {
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
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
            data: ['2019-08-18', '2019-08-19', '2019-08-20', '2019-08-21', '2019-08-22'],
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
              name: '正面',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90],
              lineStyle: {
                color: '#f46470'
              }
            },
            {
              name: '中性',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290],
              lineStyle: {
                color: '#ffb337'
              }
            },
            {
              name: '负面',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190],
              lineStyle: {
                color: '#23ce7b'
              }
            }
          ]
        }
        _this.dxfxZXEChart.setOption(option)
      },
      showDXFXEBinCharts: function() {
        const _this = this
        _this.dxfxBinEChart = eChart.init(document.getElementById('dxfxEChartBin'))
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}:{c} ({d}%)'
          },
          color: ['#f46470', '#ffb337', '#23ce7b'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['正面', '中性', '负面'],
            textStyle: {
              color: '#ffffff'
            }
          },
          series: [
            {
              name: '舆情数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {
                  value: 577,
                  name: '正面'
                },
                {
                  value: 1117,
                  name: '中性'
                },
                {
                  value: 927,
                  name: '负面'
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
      }
    },
    created() {
    },
    mounted() {
      const _this = this
      _this.showCYZTECharts()
      _this.showDLFXCharts()
      _this.initAjlb()
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
    overflow-y: auto;
    overflow-x: hidden;
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
