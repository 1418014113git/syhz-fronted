<template>
  <section class="chart-container">
    <!-- <el-carousel trigger="click" class="echart_carousel">
      <el-carousel-item v-for="item in chartData" :key="item.id">
        <div :id="item.id" style="width: 100%; height: 326px;"></div>
      </el-carousel-item>
    </el-carousel> -->

    <!-- <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-table v-else :data="tableData" style="width: 100%;" show-summary :summary-method="getSummaries">
      <el-table-column prop="from" label="来源" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unit" label="单位" max-width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="数量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$thousSplit(scope.row.count+'')}}
        </template>
      </el-table-column>
    </el-table> -->
    <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-table v-else :data="tableData" style="width: 100%;" show-summary :summary-method="getSummaries" v-loading="listLoading">
      <el-table-column prop="index" label="序号" width="60">
         <template slot-scope="scope">
          {{scope.row.index}}
        </template>
      </el-table-column>
      <el-table-column prop="syhXzqhName" label="单位/市" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resource" label="资源" max-width="50" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="handleResourceDateil(scope.row)" :class="scope.row.resource>0?'resource_detail_link':''">{{scope.row.resource}} 类</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="数量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$thousSplit(scope.row.total+'')}}
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { geWjWTotal
  // socialIntegrationResources
} from '@/api/portal'
import echarts from 'echarts'
export default {
  name: 'CommunityDataEchart',
  data() {
    return {
      id: null,
      chartColumn: null,
      wjwColumn: null,
      chartBar: null,
      chartData: [
        {
          'id': 'wjwColumn1', 'text': 'chart3'
        }
      ],
      cityNum: [],
      year: [],
      yearNum: [],
      tableData: [],
      countSize: 0,
      rowNum: 0,
      listLoading: false,
      totalSummary: 0, // 数量合计
      resourceTotal: 0, // 资源总数合计
      staticData: [
        {
          syhXzqhName: '食药环侦总队',
          syhXzqh: '610000',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '西安市',
          syhXzqh: '610100',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '铜川市',
          syhXzqh: '610200',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '宝鸡市',
          syhXzqh: '610300',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '咸阳市',
          syhXzqh: '610400',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '渭南市',
          syhXzqh: '610500',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '延安市',
          syhXzqh: '610600',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '汉中市',
          syhXzqh: '610700',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '榆林市',
          syhXzqh: '610800',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '安康市',
          syhXzqh: '610900',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '商洛市',
          syhXzqh: '611000',
          resource: 0,
          total: 0
        }, {
          syhXzqhName: '杨凌区',
          syhXzqh: '611100',
          resource: 0,
          total: 0
        }
      ]
    }
  },
  methods: {
    getSummaries() {
      // const sums = ['合计', '', '']
      // sums[2] = this.$thousSplit(this.countSize + '')
      // return sums
      const sums = ['', '合计', '', '']
      sums[2] = this.resourceTotal + ' 类' // 资源合计
      sums[3] = this.$thousSplit(this.totalSummary + '') // 数量合计
      return sums
    },
    geWjWTotal() {
      geWjWTotal().then((res) => {
        if (res.code === '000000' && res.data) {
          const data = res.data
          const array = []
          array.push({
            value: data[0].num,
            name: '新生儿信息'
          })
          array.push({
            value: data[1].num,
            name: '医疗机构患者信息'
          })
          this.drawWjwChart(array)
        }
      })
    },
    drawWjwChart(data) {
      this.wjwColumn = echarts.init(document.getElementById('wjwColumn1'))
      this.wjwColumn.setOption({
        title: {
          text: '社会单位整合共享数据资源'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: ['新生儿信息', '医疗机构患者信息']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['0', '50%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.wjwColumn.on('click', (param) => {
        const name = param.name
        if (name === '新生儿信息') {
          this.$router.push({
            path: 'wjw/xs'
          })
        }
        if (name === '医疗机构患者信息') {
          this.$router.push({
            path: 'wjw/yy'
          })
        }
      })
    },
    init() {
      // socialIntegrationResources().then((res) => {
      //   if (res.code === '000000' && res.data) {
      //     this.tableData = res.data
      //     this.tableData.forEach(element => {
      //       this.countSize += element.count
      //     })
      //     this.rowNum = res.data.length
      //   }
      // })
      this.$query('sjxtjlb', this.param).then((response) => {
        if (response.code === '000000' && response.data) {
          this.listLoading = false
          // this.tableData = response.data 不能直接赋值，需要将资源为0的也拼接再显示
          this.dealData(response.data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleResourceDateil(row) {
      this.$gotoid('/synthesizeAnalysis/socialIntegrationResources')
    },
    dealData(data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        this.resourceTotal += element.resource // 资源总数
        this.totalSummary += element.total // 数量总数
      }
      var diffArr = []
      for (let i = 0; i < this.staticData.length; i++) {
        const item = this.staticData[i]
        var isExit = false
        for (let j = 0; j < data.length; j++) {
          var it = data[j]
          if (item.syhXzqh === it.syhXzqh) {
            isExit = true
            break
          }
        }
        if (!isExit && (item.syhXzqh !== '610000')) { // 如果查出来的结果集没有总队，则不往新数组push
          diffArr.push(item)
        }
      }
      data = data.concat(diffArr)
      if (data[0].syhXzqh === '610000') { // 查询结果 第一条是总队
        for (let m = 0; m < data.length; m++) {
          const element = data[m]
          if (m === 0 && element.syhXzqh === '610000') {
            // m.index = '' // 总队 不显示序号
            this.$set(element, 'index', '')
          } else {
            // m.index = m // 序号，市按照正常序号
            this.$set(element, 'index', m)
          }
        }
      } else {
        for (let m = 0; m < data.length; m++) {
          const element = data[m]
          this.$set(element, 'index', m + 1) // 序号，第一条数据是市的，从1进行排序
        }
        // 若第一条不是总队，则把总队的数据手动放在第一位
        data.unshift(this.staticData[0])
      }
      this.tableData = data
    }
  },
  mounted() {
    // this.geWjWTotal()
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.chart-container {
  width: 100%;
  // float: left;
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
.resource_detail_link {
  cursor: pointer;
  text-decoration: underline;
}
@media only screen and (max-width: 1367px) {
}
</style>
