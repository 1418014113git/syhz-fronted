<template>
  <div class="highindustry" >
<!--    <el-form :inline="true" :model="filters" label-width="120px">
      <el-form-item label="时间范围：">
        <el-date-picker v-model="filters.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" size="small"></el-date-picker>
      </el-form-item>
      <el-form-item  label="食药环分类：" >
        <el-select v-model="filters.type" style="width: 100%" placeholder="请选择">
          <el-option label="食品" value="1"></el-option>
          <el-option label="药品" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search">查询</el-button>
      </el-form-item>
    </el-form>-->
    <el-card shadow="never" class="card">
      <div id="chartColumn" style="width: 90%; min-height: 400px; margin:0 auto"></div>
      <el-table :data="dataList" v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="xylb" label="高发行业名称"></el-table-column>
        <el-table-column label="企业数量" align="center">
          <template slot-scope="scope">
            <span class="num-right">{{scope.row.num}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getAJDEPTCOUNTPage } from '@/api/comanalysis'
  import echarts from 'echarts'

  export default {
    name: 'highindustry',
    data() {
      return {
        filters: {
          title: '',
          date: ''
        },
        listLoading: false,
        page: 1,
        pageSize: 5,
        legendData: [],
        dataList: []
      }
    },
    methods: {
      drawColumnChart() {
        this.chartColumn = echarts.init(document.getElementById('chartColumn'))
        this.chartColumn.setOption({
          title: {
            text: '高发行业',
            x: 'center',
            textStyle: {
              color: '#bbbbbb'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.legendData,
            textStyle: {
              color: '#bbbbbb',
              fontSize: 14
            }
          },
          series: [
            {
              name: '企业数量',
              type: 'pie',
              radius: '65%',
              center: ['50%', '60%'],
              data: this.dataList,
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                      '#537ff7', '#f46470', '#ffb337', '#23ce7b', '#a257ed', '#fee344', '#01ccff', '#07ecc8'
                    ]
                    return colorList[params.dataIndex]
                  }
                },
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
      search() {
      },
      getData() {
        const para = {
          pageNum: this.page,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getAJDEPTCOUNTPage(para).then((response) => {
          const data = response.data
          this.dataList = data.list
          const legendData = []
          this.dataList.forEach(function(item) {
            item.name = item.xylb
            item.value = item.num
            legendData.push(item.xylb)
          })
          this.legendData = legendData
          this.listLoading = false
          this.drawColumnChart()
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    mounted: function() {
      this.getData()
    }
  }
</script>


<style scoped>
.highindustry .card {
	margin-bottom: 20px;
}
.highindustry .num-right {
	display: inline-block;
	width: 150px;
	text-align: right;
	padding-right: 60px;
}
</style>
