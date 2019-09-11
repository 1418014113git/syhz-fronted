<template>
  <el-container>
    <el-aside width="252px">
      <el-card style="margin-bottom: 10px;">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-card>
    </el-aside>
    <el-container>
      <el-main style="padding-top: 0;">
        <el-card style="margin-bottom: 10px;">
          <el-form :inline="true">
            <el-form-item label="时间">
              <el-date-picker v-model="dateRand" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="地区">
              <el-select size="small" v-model="diquOpt" placeholder="请选择地区">
                <el-option v-for="item in diquList" :label="item.label" :value="item.value"
                           :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="query(true,true)">查询</el-button>
              <el-button type="primary" @click="handleDown()">下载选中项</el-button>
              <el-button type="primary" @click="generateReport()">生成报告</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card>
          <el-table :data="dataList" v-loading="listLoading" style="width: 100%;" max-height="600px">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="diqu" label="地区"></el-table-column>
            <el-table-column prop="time" label="生成时间"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button title="下载" size="mini" type="danger" icon="el-icon-download" circle v-if="$isViewBtn('110008')" @click="handleDown(dataListType)"></el-button>
                <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle v-if="$isViewBtn('110008')" @click="handleDel()"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                           :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
            </el-pagination>
          </el-col>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        diquOpt: '',
        dateRand: [],
        dataListType: '',
        listLoading: false,
        diquList: [{
          value: '陕西省',
          label: '陕西省'
        }, {
          value: '西安',
          label: '西安'
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
        data: [{
          label: '舆情日报',
          children: [{
            value: '01',
            label: '日报列表'
          }]
        }, {
          label: '舆情周报',
          children: [{
            value: '02',
            label: '周报列表'
          }]
        }, {
          label: '舆情月报',
          children: [{
            value: '03',
            label: '月报列表'
          }]
        }, {
          label: '舆情半年报',
          children: [{
            value: '04',
            label: '半年报列表'
          }]
        }, {
          label: '舆情年报',
          children: [{
            value: '05',
            label: '年报列表'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dataList: [],
        dataList1: [{
          name: '2019.08.22日报',
          diqu: '西安',
          time: '2019-08-22 14:49:36'
        }, {
          name: '2019.08.21日报',
          diqu: '宝鸡市',
          time: '2019-08-21 14:49:36'
        }, {
          name: '2019.08.20日报',
          diqu: '榆林市',
          time: '2019-08-20 14:15:54'
        }, {
          name: '2019.08.19日报',
          diqu: '宝鸡市',
          time: '2019-08-19 14:49:36'
        }, {
          name: '2019.08.18日报',
          diqu: '榆林市',
          time: '2019-08-18 14:15:36'
        }, {
          name: '2019.08.17日报',
          diqu: '西安',
          time: '2019-08-17 14:49:54'
        }, {
          name: '2019.08.16日报',
          diqu: '延安市',
          time: '2019-08-16 14:49:36'
        }, {
          name: '2019.08.15日报',
          diqu: '商洛市',
          time: '2019-08-15 14:49:36'
        }, {
          name: '2019.08.15日报',
          diqu: '宝鸡市',
          time: '2019-08-15 14:15:36'
        }, {
          name: '2019.08.14日报',
          diqu: '西安',
          time: '2019-08-14 14:49:54'
        }, {
          name: '2019.08.13日报',
          diqu: '延安市',
          time: '2019-08-13 14:15:36'
        }, {
          name: '2019.08.12日报',
          diqu: '安康市',
          time: '2019-08-12 14:15:36'
        }, {
          name: '2019.08.11日报',
          diqu: '西安',
          time: '2019-08-11 14:15:54'
        }, {
          name: '2019.08.10日报',
          diqu: '安康市',
          time: '2019-08-10 14:49:36'
        }, {
          name: '2019.08.09日报',
          diqu: '宝鸡市',
          time: '2019-08-09 14:49:36'
        }],
        dataList2: [{
          name: '2019.08.22周报',
          diqu: '商洛市',
          time: '2019-08-22 14:15:54'
        }, {
          name: '2019.08.21周报',
          diqu: '西安',
          time: '2019-08-21 14:49:36'
        }, {
          name: '2019.08.20周报',
          diqu: '商洛市',
          time: '2019-08-20 14:49:36'
        }, {
          name: '2019.08.19周报',
          diqu: '商洛市',
          time: '2019-08-19 14:15:54'
        }, {
          name: '2019.08.18周报',
          diqu: '安康市',
          time: '2019-08-18 14:49:36'
        }, {
          name: '2019.08.17周报',
          diqu: '安康市',
          time: '2019-08-17 14:15:36'
        }, {
          name: '2019.08.16周报',
          diqu: '咸阳市',
          time: '2019-08-16 14:49:54'
        }, {
          name: '2019.08.15周报',
          diqu: '咸阳市',
          time: '2019-08-15 14:15:36'
        }, {
          name: '2019.08.15周报',
          diqu: '西安',
          time: '2019-08-15 14:49:36'
        }, {
          name: '2019.08.14周报',
          diqu: '咸阳市',
          time: '2019-08-14 14:49:36'
        }, {
          name: '2019.08.13周报',
          diqu: '咸阳市',
          time: '2019-08-13 14:15:54'
        }, {
          name: '2019.08.12周报',
          diqu: '西安',
          time: '2019-08-12 14:49:36'
        }, {
          name: '2019.08.11周报',
          diqu: '榆林市',
          time: '2019-08-11 14:49:36'
        }, {
          name: '2019.08.10周报',
          diqu: '宝鸡市',
          time: '2019-08-10 14:15:54'
        }, {
          name: '2019.08.09周报',
          diqu: '西安',
          time: '2019-08-09 14:49:36'
        }],
        dataList3: [{
          name: '2019.01.22月报',
          diqu: '宝鸡市',
          time: '2019-08-22 14:49:36'
        }, {
          name: '2019.02.21月报',
          diqu: '西安',
          time: '2019-08-21 14:15:54'
        }, {
          name: '2019.03.20月报',
          diqu: '榆林市',
          time: '2019-08-20 14:49:36'
        }, {
          name: '2019.04.19月报',
          diqu: '咸阳市',
          time: '2019-08-19 14:49:36'
        }, {
          name: '2019.05.18月报',
          diqu: '咸阳市',
          time: '2019-08-18 14:15:36'
        }, {
          name: '2019.06.17月报',
          diqu: '榆林市',
          time: '2019-08-17 14:49:54'
        }, {
          name: '2019.07.16月报',
          diqu: '西安',
          time: '2019-08-16 14:15:36'
        }, {
          name: '2019.08.15月报',
          diqu: '宝鸡市',
          time: '2019-08-15 14:49:36'
        }, {
          name: '2019.09.15月报',
          diqu: '宝鸡市',
          time: '2019-08-15 14:15:54'
        }, {
          name: '2019.10.14月报',
          diqu: '西安',
          time: '2019-08-14 14:49:36'
        }, {
          name: '2019.11.13月报',
          diqu: '榆林市',
          time: '2019-08-13 14:15:36'
        }, {
          name: '2019.12.12月报',
          diqu: '咸阳市',
          time: '2019-08-12 14:49:54'
        }, {
          name: '2019.01.11月报',
          diqu: '榆林市',
          time: '2019-08-11 14:15:36'
        }, {
          name: '2019.03.10月报',
          diqu: '宝鸡市',
          time: '2019-08-10 14:49:36'
        }, {
          name: '2019.05.09月报',
          diqu: '宝鸡市',
          time: '2019-08-09 14:15:54'
        }],
        dataList4: [{
          name: '2019.08.22半年报',
          diqu: '宝鸡市',
          time: '2019-08-22 14:49:36'
        }, {
          name: '2019.08.21半年报',
          diqu: '咸阳市',
          time: '2019-08-21 14:15:36'
        }, {
          name: '2019.08.20半年报',
          diqu: '陕西省',
          time: '2019-08-20 14:49:36'
        }, {
          name: '2019.08.19半年报',
          diqu: '宝鸡市',
          time: '2019-08-19 14:15:54'
        }, {
          name: '2019.08.18半年报',
          diqu: '咸阳市',
          time: '2019-08-18 14:49:36'
        }, {
          name: '2019.08.17半年报',
          diqu: '渭南市',
          time: '2019-08-17 14:15:36'
        }, {
          name: '2019.08.16半年报',
          diqu: '宝鸡市',
          time: '2019-08-16 14:49:54'
        }, {
          name: '2019.08.15半年报',
          diqu: '宝鸡市',
          time: '2019-08-15 14:15:36'
        }, {
          name: '2019.08.15半年报',
          diqu: '渭南市',
          time: '2019-08-15 14:49:54'
        }, {
          name: '2019.08.14半年报',
          diqu: '铜川市',
          time: '2019-08-14 14:49:36'
        }, {
          name: '2019.08.13半年报',
          diqu: '商洛市',
          time: '2019-08-13 14:15:36'
        }, {
          name: '2019.08.12半年报',
          diqu: '宝鸡市',
          time: '2019-08-12 14:49:54'
        }, {
          name: '2019.08.11半年报',
          diqu: '宝鸡市',
          time: '2019-08-11 14:49:36'
        }, {
          name: '2019.08.10半年报',
          diqu: '商洛市',
          time: '2019-08-10 14:49:36'
        }, {
          name: '2019.08.09半年报',
          diqu: '铜川市',
          time: '2019-08-09 14:15:54'
        }],
        dataList5: [{
          name: '2019年报',
          diqu: '铜川市',
          time: '2019-08-16 14:49:54'
        }, {
          name: '2018年报',
          diqu: '商洛市',
          time: '2018-08-15 14:15:36'
        }, {
          name: '2017年报',
          diqu: '渭南市',
          time: '2017-08-15 14:49:54'
        }, {
          name: '2016年报',
          diqu: '宝鸡市',
          time: '2016-08-14 14:49:36'
        }, {
          name: '2015年报',
          diqu: '铜川市',
          time: '2015-08-13 14:15:36'
        }, {
          name: '2014年报',
          diqu: '渭南市',
          time: '2014-08-12 14:49:54'
        }, {
          name: '2013年报',
          diqu: '渭南市',
          time: '2013-08-11 14:49:36'
        }, {
          name: '2012年报',
          diqu: '商洛市',
          time: '2012-08-10 14:49:36'
        }, {
          name: '2011年报',
          diqu: '渭南市',
          time: '2011-08-09 14:15:54'
        }, {
          name: '2010年报',
          diqu: '宝鸡市',
          time: '2010-08-22 14:49:36'
        }],
        total: 0,
        page: 1,
        pageSize: 15
      }
    },
    methods: {
      query(flag, hand) {
        // this.listLoading = true
        // var param = {
        //   pageSize: this.pageSize,
        //   pageNum: flag ? 1 : this.page
        // }
        // if (hand) { // 手动点击时，添加埋点参数
        //   param.logFlag = 1
        // }
        // this.$query('', param).then((response) => {
        //   this.listLoading = false
        //   if (response.data && response.data.list && response.data.list.length > 0) {
        //     this.dataList = response.data.list
        //     this.page = response.data.totalCount
        //     this.pageSize = response.data.pageSize
        //   }
        // }).catch(() => {
        //   this.listLoading = false
        // })
      },
      handleNodeClick(data) {
        this.curTypeValue = data.value
        switch (data.value) {
          case '01':
            this.dataList = this.dataList1 // 日报列表
            this.dataListType = '1'
            break
          case '02':
            this.dataList = this.dataList2 // 周报列表
            this.dataListType = '2'
            break
          case '03':
            this.dataList = this.dataList3 // 月报列表
            this.dataListType = '3'
            break
          case '04':
            this.dataList = this.dataList4 // 半年报列表
            this.dataListType = '4'
            break
          case '05':
            this.dataList = this.dataList5 // 年报列表
            this.dataListType = '5'
            break
          default:
            break
        }
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          // logFlag = 1 // 请求接口时，将此参数添加到接口参数中，埋点参数
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      },
      handleDown: function(data) {
        if (data === '1') {
          window.open('/static/tempDoc/日报.docx')
        }
        if (data === '2') {
          window.open('/static/tempDoc/周报.docx')
        }
        if (data === '3') {
          window.open('/static/tempDoc/月报.docx')
        }
        if (data === '4') {
          window.open('/static/tempDoc/半年报.docx')
        }
        if (data === '5') {
          window.open('/static/tempDoc/年报.docx')
        }
        this.$message({
          message: '下载成功',
          type: 'success'
        })
      },
      generateReport: function(index, row) {
        this.$message({
          message: '生成成功',
          type: 'success'
        })
      },
      handleCurrentChange(val) {
        this.page = val
      },

      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
      }
    },
    mounted() {
      this.dataList = this.dataList1
      this.dataListType = '1'
    }
  }
</script>

<style>


  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
