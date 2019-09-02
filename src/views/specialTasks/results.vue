<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="成果名称">
        <el-input v-model="filters.title" placeholder="成果名称" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('102010')" v-on:click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('102011')" v-on:click="handleAdd">添加</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button size="small" v-on:click="toList">返回</el-button>
      </el-form-item> -->
       <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-form>
    <el-table :data="reports"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="title" label="成果名称"></el-table-column>
      <el-table-column prop="create_date" label="上报时间"></el-table-column>
      <el-table-column prop="create_dept_name" label="上报部门"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.report_status === 0">草稿</span>
          <span v-if="scope.row.report_status === 1">待审核</span>
          <span v-if="scope.row.report_status === 2">审核未通过</span>
          <span v-if="scope.row.report_status === 3">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="scope.row.report_status === 1 && scope.row.enable === true && scope.row.examine_dept === deptId && $isViewBtn('102017')" title="审核" size="small" type="primary" @click="review(scope.row.id)" >审核</el-button>
          <el-button type="primary" title="详情" v-if="$isViewBtn('102012')" size="mini" icon="el-icon-document" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button v-if="(scope.row.report_status === 0 || scope.row.report_status === 2) && scope.row.enable === true && $isViewBtn('102013') && scope.row.create_dept_id === deptId"
                     title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button v-if="(scope.row.report_status === 0 || scope.row.report_status === 2) && scope.row.enable === true && $isViewBtn('102014') && scope.row.create_dept_id === deptId"
                     title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import { getReportListPage, deleteReport } from '@/api/specialTasks'
  export default {
    name: 'index',
    components: {},
    data() {
      return {
        filters: {
          status: '',
          title: '',
          create_date: '',
          create_dept_name: ''
        },
        deptId: '',
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        reports: [],
        caseId: '',
        tableHeight: null
      }
    },
    methods: {
      formatStatus(row, column) {
        return row.status === '0' ? '正在进行中' : '已结束'
      },
      excelImport() {},
      otherImport() {},
      handleAdd() {
        const task = this.$route.params.taskId
        this.$router.push({ path: '/specialTasks/reportResults/' + task })
      },
      query(flag) {
        this.listLoading = true
        this.page = flag ? 1 : this.page
        const para = {
          pageNum: this.page,
          title: this.filters.title,
          create_date: '',
          taskId: this.$route.params.taskId,
          deptId: this.deptId,
          pageSize: this.pageSize
        }
        getReportListPage(para).then((response) => {
          this.listLoading = false
          this.reports = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(false)
      },
      handleDetail(index, row) {
        this.$router.push({ path: '/specialTasks/resultsDetail/' + row.id })
      },
      handleEdit(index, row) {
        const task = this.$route.params.taskId
        this.$router.push({ path: '/specialTasks/reportResults/' + task + '/' + row.id })
      },
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = { id: row.id }
          deleteReport(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.query(false)
          })
        }).catch(() => {

        })
      },
      review(id) {
        // const task = this.$route.params.taskId
        this.$router.push({ path: '/specialTasks/resultsDetail/examine/' + this.$route.params.taskId + '/' + id })
      },
      clear() {
        this.filters = {
          status: '',
          title: '',
          create_date: '',
          create_dept_name: ''
        }
      },
      toList() {
        this.$router.push({ path: '/specialTasks' })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (depToken) {
        this.deptId = depToken.id
      }
      this.query(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
  p > span{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
  }
</style>
