<template>
  <div style="height: 100%;">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div style="height: 100%;">
      <el-col :span="24" class="right-layout">
        <div id="cyzt" class="frame right-item" style="min-height: 417px;">
          <div class="header">
            <span>舆情媒体分布统计图</span>
          </div>
          <div id="cyztEChart" class="content" style="height: 377px;">
          </div>
        </div>
        <div id="dlfx" class="frame right-item" style="min-height: 417px;">
          <div class="header">
            <span>舆情媒体分布趋势图</span>
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
              data: ['微信', 'APP', '网媒', '微博', '论坛', '视频', '评论', '博客', '报刊'],
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
              name: '发布数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220, 120, 160]
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
          color: ['#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8', '#a76f00', '#d0e3fe'],
          legend: {
            data: ['微信', 'APP', '网媒', '微博', '论坛', '视频', '评论', '博客', '报刊'],
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
              name: '微信',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90],
              lineStyle: {
                color: '#f46470'
              }
            },
            {
              name: 'APP',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290],
              lineStyle: {
                color: '#ffb337'
              }
            },
            {
              name: '网媒',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190],
              lineStyle: {
                color: '#23ce7b'
              }
            },
            {
              name: '微博',
              type: 'line',
              stack: '总量',
              data: [156, 286, 389, 565, 1290],
              lineStyle: {
                color: '#a257ed'
              }
            },
            {
              name: '论坛',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0],
              lineStyle: {
                color: '#fee344'
              }
            },
            {
              name: '视频',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0],
              lineStyle: {
                color: '#01ccff'
              }
            },
            {
              name: '评论',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0],
              lineStyle: {
                color: '#07ecc8'
              }
            },
            {
              name: '博客',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0],
              lineStyle: {
                color: '#a76f00'
              }
            },
            {
              name: '报刊',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0],
              lineStyle: {
                color: '#d0e3fe'
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
      _this.showDXFXZXECharts()
      _this.showDXFXEBinCharts()
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
