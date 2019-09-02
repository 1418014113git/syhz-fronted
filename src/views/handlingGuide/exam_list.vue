<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="考试名称：">
        <el-input v-model="filters.name" placeholder="考试名称" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="考试时间：">
        <el-date-picker
          v-model="filters.value1"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="考试名称" prop="examName">
      </el-table-column>
      <el-table-column label="考试时间" prop="examStartDate1">
      </el-table-column>
      <el-table-column label="报名人数" prop="examineeQuota">
      </el-table-column>
      <el-table-column label="实际参考人数" prop="examState">
      </el-table-column>
      <el-table-column label="平均分" prop="examState1">
      </el-table-column>
      <el-table-column label="考试通过率" prop="examState2">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">考试成绩</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                     :page-sizes="[5,10,15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="tableCopyTableList.length" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
  export default {
    name: 'examList',
    data() {
      return {
        tableData: [],
        tableData1: [{
          examID: 'e4d51b7d-7544-11e9-a1c5-0a580af402b2',
          examName: '2019-07-01考试',
          examineeQuota: 10,
          examState: 10,
          examState1: 80,
          examState2: '80%',
          examStartDate1: '2019-07-01',
          examStartDate: 1561964400000,
          examEndDate: 1561971600000,
          createDate: 1557727437000
        }, {
          examID: 'b7b19550-86a9-11e9-a1c5-0a580af402b2',
          examName: '2019-06-04考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-06-04',
          examStartDate: 1559577600000,
          examEndDate: 1561046400000,
          createDate: 1559639910000
        }, {
          examID: 'a89993e6-86a0-11e9-a1c5-0a580af402b2',
          examName: '2019-06-03考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-06-03',
          examStartDate: 1559491200000,
          examEndDate: 1561824000000,
          createDate: 1559636019000
        }, {
          examID: '7ce7d85c-7547-11e9-a1c5-0a580af402b2',
          examName: '2019-05-13考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-13',
          examStartDate: 1557676800000,
          examEndDate: 1559232000000,
          createDate: 1557728551000
        }, {
          examID: '3f01a0d8-7558-11e9-a1c5-0a580af402b2',
          examName: '2019-05-12考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-12',
          examStartDate: 1557590400000,
          examEndDate: 1561824000000,
          createDate: 1557735749000
        }, {
          examID: '0312e7eb-72b3-11e9-a1c5-0a580af402b2',
          examName: '2019-05-06考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-06',
          examStartDate: 1557072000000,
          examEndDate: 1559232000000,
          createDate: 1557444879000
        }, {
          examID: 'ee9f8f6e-55dd-11e9-8d13-0a580af40209',
          examName: '2019-05-06考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-06',
          examStartDate: 1559232000000,
          examEndDate: 1559232000000,
          createDate: 1554274729000
        }, {
          examID: '139279f7-7552-11e9-a1c5-0a580af402b2',
          examName: '2019-05-02考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-02',
          examStartDate: 1556726400000,
          examEndDate: 1561824000000,
          createDate: 1557733099000
        }, {
          examID: 'ef8f55c2-7549-11e9-a1c5-0a580af402b2',
          examName: '2019-05-02考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-05-02',
          examStartDate: 1556726400000,
          examEndDate: 1561824000000,
          createDate: 1557729602000
        }, {
          examID: '7f3e1e8f-6a46-11e9-a1c5-0a580af402b2',
          examName: '2019-04-29考试',
          examineeQuota: 0,
          examState: 0,
          examState1: 0,
          examState2: '0%',
          examStartDate1: '2019-04-29',
          examStartDate: 1556467200000,
          examEndDate: 1556553600000,
          createDate: 1556518663000
        }],
        tableCopyTableList: [],
        pickerOptions: {
          disabledDate(time) {
            // 填发日期 只能选今天和以前的
            return time.getTime() > Date.now()
          }
        },
        filters: {
          name: '',
          value1: '',
          value2: ''
        },
        page: 1,
        pageSize: 15,
        listLoading: false,
        list: [],
        options: [],
        tableHeight: null
      }
    },
    methods: {
      // 页数改变事件
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.tableData = this.paging(pageSize, this.page)
      },
      // 页码改变事件
      handleCurrentChange(current) {
        this.page = current
        this.tableData = this.paging(this.pageSize, current)
      },
      // 本地分页的方法
      paging(pageSize, current) {
        const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList))
        const tablePush = []
        tableList.forEach((item, page) => {
          if (pageSize * (current - 1) <= page && page <= pageSize * current - 1) {
            tablePush.push(item)
          }
        })
        return tablePush
      },

      handleDetail(index, row) {
        this.$router.push({
          path: '/educational/achievement/' + row.id
        })
      },
      search() {
        this.loading = true
        this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData1))
        var examName = this.filters.name
        if (examName !== '' && examName !== null) {
          this.tableCopyTableList = this.tableCopyTableList.filter(item => {
            if (item.examName.includes(this.filters.name)) {
              return item
            }
          })
        }
        if (this.filters.value1.length === 2) {
          this.tableCopyTableList = this.tableCopyTableList.filter(item => {
            if (this.filters.value1[0] <= item.examStartDate && item.examStartDate <= this.filters.value1[1]) {
              return item
            }
          })
        }
        this.tableData = this.paging(this.pageSize, this.page)
      },
      resetSearch() {
        this.filters = {
          name: '', value1: ''
        }
        this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData1))
        this.tableData = this.paging(this.pageSize, this.page)
      },
      init() {
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      // 初始化数据
      this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData1))
      this.tableData = this.paging(this.pageSize, this.page)
    }
  }
</script>
<style scoped>
</style>
