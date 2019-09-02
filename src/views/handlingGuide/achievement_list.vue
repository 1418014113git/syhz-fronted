<template>
  <section>
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="姓名：">
        <el-input v-model="filters.name" placeholder="姓名" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="排名：">
        <el-input v-model="filters.sort" placeholder="排名" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="成绩：">
        <el-input v-model="filters.cj" placeholder="成绩" size="small" clearable maxlength="30"></el-input>
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
      <el-table-column label="排名" prop="sort">
      </el-table-column>
      <el-table-column label="考生姓名" prop="userName">
      </el-table-column>
      <el-table-column label="性别" prop="xb">
      </el-table-column>
      <el-table-column label="职级" prop="zj">
      </el-table-column>
      <el-table-column label="所在单位" prop="szdw">
      </el-table-column>
      <el-table-column label="成绩" prop="cj">
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
    name: 'achievementList',
    data() {
      return {
        tableData: [],
        tableData1: [{
          userName: '马旭东',
          sort: 1,
          xb: '男',
          zj: '正处级',
          szdw: '陕西公安厅科信总队',
          cj: 95
        }, {
          userName: '张晓东',
          sort: 2,
          xb: '男',
          zj: '副局级',
          szdw: '咸阳市公安局',
          cj: 93
        }, {
          userName: '郭建东',
          sort: 3,
          xb: '男',
          zj: '正处级',
          szdw: '陕西公安厅科信总队',
          cj: 90
        }, {
          userName: '郭力强',
          sort: 4,
          xb: '男',
          zj: '副局级',
          szdw: '陕西公安厅科信总队',
          cj: 87
        }, {
          userName: '呼格',
          sort: 5,
          xb: '男',
          zj: '副处级',
          szdw: '咸阳市公安局',
          cj: 85
        }, {
          userName: '高圆圆',
          sort: 6,
          xb: '女',
          zj: '副处级',
          szdw: '陕西公安厅科信总队',
          cj: 83
        }, {
          userName: '马旭',
          sort: 7,
          xb: '男',
          zj: '科员',
          szdw: '咸阳市公安局',
          cj: 70
        }, {
          userName: '王嘉禾',
          sort: 8,
          xb: '男',
          zj: '科员',
          szdw: '西安市公安局',
          cj: 65
        }, {
          userName: '旺财',
          sort: 9,
          xb: '男',
          zj: '科员',
          szdw: '西安市公安局',
          cj: 63
        }, {
          userName: '李纯柱',
          sort: 10,
          xb: '男',
          zj: '科员',
          szdw: '西安市公安局',
          cj: 60
        }],
        tableCopyTableList: [],
        filters: {
          name: '',
          ywfw: '',
          citys: []
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
      resetSearch() {
        this.filters = {
          name: '', sort: '', cj: '', zj: ''
        }
        this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData1))
        this.tableData = this.paging(this.pageSize, this.page)
      },
      search() {
        this.loading = true
        this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData1))
        var userName = this.filters.name
        if (userName !== '' || userName !== null) {
          this.tableCopyTableList = this.tableCopyTableList.filter(item => {
            if (item.userName.includes(this.filters.name)) {
              return item
            }
          })
        }
        var sort = this.filters.sort
        if (typeof sort !== 'undefined' && sort !== '' && sort !== null) {
          this.tableCopyTableList = this.tableCopyTableList.filter(item => {
            if (item.sort === sort * 1) {
              return item
            }
          })
        }
        var cj = this.filters.cj
        if (typeof cj !== 'undefined' && cj !== '' && cj !== null) {
          this.tableCopyTableList = this.tableCopyTableList.filter(item => {
            if (item.cj >= cj * 1) {
              return item
            }
          })
        }
        this.tableData = this.paging(this.pageSize, this.page)
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
      toback() {
        this.$router.back(-1)
      },
      handleDetail(index, row) {
        this.$router.push({
          path: '/caseManage/investigation/detail/' + row.id
        })
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
