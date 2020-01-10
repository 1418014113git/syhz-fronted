<template>
 <!-- 发案地域统计 -->
  <section class="caseAreabar">
    <p class="comTit">
      发案地域统计
      <el-popover
      class="zbts"
      placement="right"
      width="300"
      trigger="hover">
        <div>
          <span>根据查询条件统计发案地域案件数量柱状图</span>
        </div>
        <el-button  type="primary" size="mini" circle  slot="reference"><svg-icon icon-class="wenhao1"></svg-icon></el-button>
      </el-popover>
    </p>
    <div id="chartfaBar"  style="width: 100%; height: 300px;margin:0 auto 20px auto;"></div>
  </section>
</template>

<script>
import echarts from 'echarts'
export default {
  props: ['queryData'],
  data() {
    return {
      chartfaBar: null,
      datas: [], // 数据集合
      citys: ['城区', '郊区', '镇', '乡村', '林区', '其他'], // x轴数据
      cityNum: [] // y轴数据
      // cityNum: [10, 52, 200, 334, 390, 330]
    }
  },
  watch: {
    queryData(val) {
      if (val) {
        this.datas = val
        this.caseTotalList()
      }
    }
  },
  methods: {
    caseTotalList() {
      this.cityNum = []
      this.datas.forEach(item => {
        this.cityNum[0] = item.chengqu
        this.cityNum[1] = item.jiaoqu
        this.cityNum[2] = item.zheng
        this.cityNum[3] = item.xiangcun
        this.cityNum[4] = item.linqu
        this.cityNum[5] = item.other
      })
      this.drawColumnChart()
    },
    drawColumnChart() { // 柱状图
      this.chartfaBar = echarts.init(document.getElementById('chartfaBar'))
      this.chartfaBar.setOption({
        title: {
          text: '发案地域统计',
          textStyle: { color: 'rgba(0,0,0,0)' } // 标题此处不显示，为了设置下载时的文件名称
        },
        tooltip: {},
        toolbox: {
          itemSize: 17,
          x: '1750px',
          feature: {
            saveAsImage: {}
          },
          iconStyle: {
            borderColor: '#fff'// 图形的描边颜色
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name: '',
          axisLine: {
            lineStyle: {
              color: '#bbb'
            }
          },
          nameTextStyle: {
            fontSize: 13
          },
          data: this.citys
        },
        yAxis: {
          name: '',
          boundaryGap: ['0', '10%'],
          nameGap: 18,
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#bbb'
            }
          },
          nameTextStyle: {
            fontSize: 13
          },
          splitLine: { show: false }
        },
        series: [{
          name: '',
          type: 'bar',
          data: this.cityNum,
          barWidth: '60%',
          itemStyle: {
            normal: {
              // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              // color(params) {
              //   var colorList = ['#F39800', '#FCC800', '#FFF100', '#CFDB00', '#8FC31F', '#22AC38', '#009944', '#009B6B', '#009E96', '#00A0C1', '#00A0E9', '#0086D1']
              //   return colorList[params.dataIndex]
              // }
            }
          }
        }]
      })
      window.onresize = this.chartfaBar.resize
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.queryData.length > 0) {
      this.datas = this.queryData
      this.caseTotalList()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.caseAreabar {
  width: 100%;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.echart_carousel .el-carousel__container {
  height: 326px;
}

.echart_carousel .el-carousel__indicator.is-active > .el-carousel__button {
  background-color: #99a9bf;
}

.echart_carousel .el-carousel__indicator > .el-carousel__button {
  background-color: #d3dce6;
}
.chartTit {
  font-size: 14px;
  text-align: center;
  color: #38dc98;
  padding: 12px 0;
}
.chartTit img {
  margin: -3px 8px 0 0;
}
.zbts{
  margin-left: 10px;
  .el-button--mini.is-circle, .el-button--small.is-circle {
    padding: 0;
  }
  .svg-icon[data-v-5d4549d3] {
    width: 1.3em;
    height: 1.3em;
  }
}

@media only screen and (max-width: 1367px) {
  canvas {
    left: -6px !important;
  }
  .el-carousel__indicator {
    padding: 0px 4px;
  }
}
</style>
