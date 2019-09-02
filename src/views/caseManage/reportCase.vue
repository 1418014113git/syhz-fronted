<template>
  <div>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input placeholder="输入案件名称进行过滤" v-model="filters.AJMC" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd">上报</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="cases"  v-loading="listLoading" @selection-change="handleSelectionChange" :max-height="tableHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="AJMC" label="案件名称"></el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类型"></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right; margin-top: 5px;">
      </el-pagination>
    </el-col>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  import { addReportCase, getCaseListPage } from '@/api/investigation'
  export default {
    name: 'index',
    data() {
      return {
        filters: {
          AJMC: ''
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        cases: [],
        multipleSelection: [],
        caseType: [],
        deptId: '',
        curUserId: '',
        curtDept: {},
        tableHeight: null
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
          const a = JSON.parse(sessionStorage.getItem('userInfo'))
          const form = {
            investigationId: parseInt(this.id),
            caseIds: ids,
            dept: this.deptId,
            createUser: this.curUserId,
            status: 1,
            bizType: 4,
            action: '相关案件信息关联',
            bizId: parseInt(this.id),
            userId: a.id,
            userName: a.realName
          }
          addReportCase(form).then((res) => {
            this.listLoading = false
            this.$message({
              message: '上报成功',
              type: 'success'
            })
            this.toggleSelection()
            this.$emit('refreshList')
          })
        }
      },
      query(flag) {
        this.listLoading = true
        const para = {
          pageNum: flag ? 1 : this.page,
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
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(false)
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      const user = JSON.parse(sessionStorage.getItem('userInfo'))
      const depToken = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curtDept = depToken
      if (depToken) {
        this.deptId = depToken.id
        this.curUserId = user.id
        this.query(false)
      }
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
p > span {
	display: inline-block;
	height: 30px;
	line-height: 30px;
	margin-right: 20px;
}
</style>
