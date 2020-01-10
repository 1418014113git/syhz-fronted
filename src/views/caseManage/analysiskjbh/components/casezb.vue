<template>
 <!-- 案件侦办地区分析 -->
  <section class="casezb">
    <p class="comTit">
      案件侦办地区分析
      <el-popover
      class="zbts"
      placement="right"
      width="280"
      trigger="hover">
        <div>
          <span>根据查询条件分析不同地区的案件数量</span>
        </div>
        <el-button  type="primary" size="mini" circle  slot="reference"><svg-icon icon-class="wenhao1"></svg-icon></el-button>
      </el-popover>
    </p>
    <div id="chartzbBar"  style="width: 100%; height: 400px; margin:0 auto 20px auto;"></div>
    <!-- <div v-if="citys.length < 1 && cityNum.length < 1" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div> -->
  </section>
</template>

<script>
import echarts from 'echarts'
export default {
  props: ['queryData'],
  data() {
    return {
      chartzbBar: null,
      datas: [], // 数据集合
      citys: [], // x轴数据
      cityNum: [], // y轴数据
      xdataZoom: [], // x轴长度大于12时，将dataZoom赋值于此，显示横向滚动条。
      dataZoom: [
        {
          show: true,
          realtime: true,
          zoomOnMouseWheel: false,
          start: 0,
          end: 50
        },
        {
          type: 'inside',
          realtime: true,
          zoomOnMouseWheel: false,
          showDetail: false,
          start: 0,
          end: 50
        }
      ]
      // citys: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛', '杨凌', '西咸'],
      // cityNum: [10, 52, 200, 334, 390, 330, 220, 151, 200, 425, 256, 325]
    }
  },
  watch: {
    queryData(val) {
      if (val.length > 0) {
        this.datas = val
        this.caseTotalList()
      }
    }
  },
  methods: {
    initData() { // 初始化 x，y轴数据
      this.citys = [] // x轴数据
      this.cityNum = [] // y轴数据
    },
    caseTotalList() {
      this.initData()
      const citys = []
      const cityNum = []
      this.datas.forEach(item => {
        citys.push(item.orgName)
        cityNum.push(item.total)
      })
      this.citys = citys
      this.cityNum = cityNum
      this.$nextTick(function() {
        this.drawColumnChart()
      })
    },
    drawColumnChart() { // 柱状图
      this.chartzbBar = echarts.init(document.getElementById('chartzbBar'))
      this.chartzbBar.setOption({
        color: ['#3398DB'],
        title: {
          text: '案件侦办地区分析',
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
          // axisLabel: {
          //   interval: 0,
          //   rotate: this.curDept.depType === '1' ? 0 : 40 // 总队登上来，显示的是地市，文字短，其他登上来，文字长，需要旋转。
          // },
          axisTick: {
            alignWithLabel: true
          },
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
        dataZoom: this.xdataZoom,
        series: [{
          name: '',
          type: 'bar',
          data: this.cityNum,
          barWidth: '50',
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
      window.onresize = this.chartzbBar.resize
    }
  },
  mounted() {
    if (this.queryData.length > 0) {
      this.datas = this.queryData
      this.caseTotalList()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.casezb {
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
