<template>
  <div>
    <el-row>
      <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
    </el-row>
    <el-card style="margin-bottom: 10px;">
      <el-form :inline="true">
        <el-form-item label="接警时间">
          <el-date-picker v-model="dateRand" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="接警人">
          <el-select size="small" v-model="inPersonOpt" placeholder="请选择接警人">
            <el-option v-for="item in inPersonList" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出警人">
          <el-select size="small" v-model="outPersonOpt" placeholder="请选择出警人">
            <el-option v-for="item in outPersonList" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="keyWordsOpt" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select size="small" v-model="diquOpt" placeholder="请选择地区">
            <el-option v-for="item in diquList" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div style="height: 100%;">
        <div style="height: 100%;">
            <div id="cyzt" class="frame right-item" style="min-height: 417px;">
              <div class="header">
                <span>警情分布</span>
              </div>
              <div id="cyztEChart" class="content" style="height: 377px;">
              </div>
            </div>
            <div id="dlfx" class="frame right-item" style="min-height: 417px;">
              <div class="header">
                <span>警情走势</span>
              </div>
              <div id="dlfxEChart" class="content" style="height: 377px;">
              </div>
            </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'
  import eChart from 'echarts'

  export default {
    data() {
      return {
        dateRand: [],
        inPersonOpt: '',
        outPersonOpt: '',
        keyWordsOpt: '',
        diquOpt: '',
        diquList: [{
          value: '陕西省',
          label: '陕西省'
        }, {
          value: '西安市',
          label: '西安市'
        }, {
          value: '宝鸡市',
          label: '宝鸡市'
        }, {
          value: '咸阳市',
          label: '咸阳市'
        }, {
          value: '铜川市',
          label: '铜川市'
        }, {
          value: '渭南市',
          label: '渭南市'
        }, {
          value: '延安市',
          label: '延安市'
        }, {
          value: '榆林市',
          label: '榆林市'
        }, {
          value: '汉中市',
          label: '汉中市'
        }, {
          value: '安康市',
          label: '安康市'
        }, {
          value: '商洛市',
          label: '商洛市'
        }],
        inPersonList: [{
          value: '6100533',
          label: '6100533'
        }, {
          value: '6100532',
          label: '6100532'
        }, {
          value: '6100531',
          label: '6100531'
        }, {
          value: '6100530',
          label: '6100530'
        }, {
          value: '6100529',
          label: '6100529'
        }, {
          value: '6100528',
          label: '6100528'
        }, {
          value: '6100527',
          label: '6100527'
        }, {
          value: '6100526',
          label: '6100526'
        }, {
          value: '6100525',
          label: '6100525'
        }, {
          value: '6100524',
          label: '6100524'
        }, {
          value: '6100523',
          label: '6100523'
        }],
        outPersonList: [{
          value: '6100533',
          label: '6100533'
        }, {
          value: '6100532',
          label: '6100532'
        }, {
          value: '6100531',
          label: '6100531'
        }, {
          value: '6100530',
          label: '6100530'
        }, {
          value: '6100529',
          label: '6100529'
        }, {
          value: '6100528',
          label: '6100528'
        }, {
          value: '6100527',
          label: '6100527'
        }, {
          value: '6100526',
          label: '6100526'
        }, {
          value: '6100525',
          label: '6100525'
        }, {
          value: '6100524',
          label: '6100524'
        }, {
          value: '6100523',
          label: '6100523'
        }],
        cyztEChart: null,
        dlfxEChart: null
      }
    },
    methods: {
      query(hand) {
        this.showCYZTECharts(hand)
        this.showDLFXCharts(hand)
      },
      callback() {
        window.history.go(-1)
      },
      showCYZTECharts: function() {
        const _this = this
        _this.cyztEChart = eChart.init(document.getElementById('cyztEChart'))
        var option = {
          title: {
            text: '各市的警情数量',
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
              name: '警情数',
              type: 'bar',
              barWidth: '30%',
              data: [50, 99, 200, 230, 249, 160, 220, 120, 160, 100]
            }
          ]
        }
        _this.cyztEChart.setOption(option)
      },
      showDLFXCharts: function() {
        const _this = this
        _this.dlfxEChart = eChart.init(document.getElementById('dlfxEChart'))
        var option = {
          title: {
            text: '近12个月的警情数量变化',
            textStyle: {
              color: '#bce8fc'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          color: ['#f46470'],
          legend: {
            data: ['警情数量'],
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
            data: ['2018-09', '2018-10', '2018-11', '2018-12', '2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08'],
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
              name: '警情数量',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 20, 30, 54, 20, 90, 10, 80],
              lineStyle: {
                color: '#f46470'
              }
            }
          ]
        }
        _this.dlfxEChart.setOption(option)
      },
      reset() {
        this.dateRand = []
        this.inPersonOpt = ''
        this.outPersonOpt = ''
        this.keyWordsOpt = ''
        this.query()
      }
    },
    mounted() {
      const _this = this
      _this.showCYZTECharts()
      _this.showDLFXCharts()
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
  body > .el-container {
    margin-bottom: 40px;
  }

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
