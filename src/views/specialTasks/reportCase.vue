<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input placeholder="输入案件名称进行过滤" v-model="filters.AJMC" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd">上报</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="cases"  v-loading="listLoading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="AJMC" label="案件名称"></el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类型"></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <div style="clear: both"></div>
  </section>
</template>

<script>
  import { addReportCase, getCaseListPage } from '@/api/specialTasks'
  export default {
    name: 'index',
    data() {
      return {
        filters: {
          AJMC: ''
        },
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        cases: [],
        multipleSelection: [],
        caseType: [],
        curUserId: '',
        curUserName: '',
        curtDept: {}
      }
    },
    props: [
      'id',
      'caseCheckNode'
    ],
    methods: {
      formatStatus(row, column) {
        return row.status === '0' ? '正在进行中' : '已结束'
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
          this.multipleSelection = []
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleAdd: function() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请勾选需要上报的案件',
            type: 'warning'
          })
        } else {
          const ids = []
          this.multipleSelection.forEach(function(item, index) {
            ids.push(item.id)
          })
          const form = {
            taskId: this.id,
            caseIds: ids,
            status: '1',
            dept: this.caseCheckNode,
            bizType: 6,
            bizId: this.id,
            action: '上报案件',
            userId: this.curUserId,
            userName: this.curUserName
          }
          addReportCase(form).then((res) => {
            this.listLoading = false
            this.$message({
              message: '上报成功',
              type: 'success'
            })
            this.toggleSelection()
            this.$emit('refreshList')
          }).catch(() => {
            this.listLoading = false
          })
        }
      },
      query(flag) {
        this.listLoading = true
        this.page = flag ? 1 : this.page
        const para = {
          pageNum: this.page,
          ajmc: this.filters.AJMC,
          dept: this.caseCheckNode,
          depCode: this.curtDept.depCode
        }
        getCaseListPage(para).then((response) => {
          this.listLoading = false
          this.cases = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query(false)
      }
    },
    mounted() {
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.curtDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (curUser) {
        this.curUserId = curUser.id
        this.curUserName = curUser.realName
        this.query(true)
      }
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
