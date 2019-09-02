<template>
<!--检验鉴定汇总-->
  <section>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;margin-top:20px;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="msCity" label="区域名称" min-width="8%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="msName" label="机构名称" min-width="15%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="loginNum"  label="数量"  min-width="5%" ></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar" v-if="total">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" :current-page="page" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  export default {
    name: 'ajList',
    data() {
      return {
        filters: {},
        list: [],
        data: {
          pageSize: 15,
          pageNum: 1,
          totalCount: 5,
          list: [
            {
              msCity: '陕西省西安市',
              msName: '陕西省西安市公安厅环境食品药品犯罪侦查总队',
              loginNum: 1520
            },
            {
              msCity: '陕西省铜川市',
              msName: '陕西省铜川市公安局环境食品药品犯罪侦查大队',
              loginNum: 1500
            },
            {
              msCity: '陕西省宝鸡市',
              msName: '陕西省宝鸡市公安局环境食品药品犯罪侦查大队',
              loginNum: 1480
            },
            {
              msCity: '陕西省咸阳市',
              msName: '陕西省咸阳市公安局环境食品药品犯罪侦查大队',
              loginNum: 1473
            },
            {
              msCity: '陕西省延安市',
              msName: '陕西省延安市公安局环境食品药品犯罪侦查大队',
              loginNum: 1470
            },
            {
              msCity: '陕西省渭南市',
              msName: '陕西省渭南市公安局环境食品药品犯罪侦查大队',
              loginNum: 1430
            },
            {
              msCity: '陕西省汉中市',
              msName: '陕西省汉中市公安局环境食品药品犯罪侦查大队',
              loginNum: 1410
            },
            {
              msCity: '陕西省榆林市',
              msName: '陕西省榆林市公安局环境食品药品犯罪侦查大队',
              loginNum: 1400
            },
            {
              msCity: '陕西省安康市',
              msName: '陕西省安康市公安局环境食品药品犯罪侦查大队',
              loginNum: 1392
            },
            {
              msCity: '陕西省商洛市',
              msName: '陕西省商洛市公安局环境食品药品犯罪侦查大队',
              loginNum: 1388
            }
          ]
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        dateRand: [],
        tableHeight: null
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getLogList(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getLogList(false)
      },
      getLogList(flag) {
        this.page = flag ? 1 : this.page
        // const para = {
        //   pageNum: this.page,
        //   pageSize: this.pageSize
        // }
        this.total = this.data.totalCount
        this.pageSize = this.data.pageSize
        this.list = this.data.list
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - 180
      this.getLogList(true)
    }
  }

</script>

<style>
  .case .el-date-editor .el-range-separator{
    padding: 0;
  }
</style>
