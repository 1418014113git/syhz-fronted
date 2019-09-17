<template>
  <div class="loglist">
    <!-- 筛选条件 -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="开始时间：" prop="startDate">
          <el-date-picker
            v-model="filters.startDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间">
          </el-date-picker>
           <el-date-picker
            v-model="filters.endDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="queryChecks(true,true)">查询</el-button>
          <el-button type="primary" size="small" v-on:click="reset">重置</el-button>
          <el-button type="primary" size="small" v-on:click="exportChecks">Excel导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="operateList" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="depName" label="单位及部门" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userName" label="登录账号" width="140"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="160"></el-table-column>
      <el-table-column prop="idNum" label="身份证号码" width="220"></el-table-column>
      <el-table-column prop="ip" label="操作IP" width="200" ></el-table-column>
      <el-table-column prop="num" label="总查询次数" width="140"></el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageSize"
                     :total="total" :current-page="page" :page-sizes="[15,30,50,100]" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>
<script>
import importexport from '@/api/importexport'
export default {
  name: 'ajList',
  data() {
    return {
      total: 0,
      page: 0,
      pageSize: 15,
      exportDataUrl: importexport.exportModuleName,
      filters: {
        startDate: '',
        endDate: ''
      },
      operateList: [],
      listLoading: false,
      dateRand: [],
      tableHeight: null
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.queryChecks(true, true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.queryChecks(false, true)
    },
    queryChecks(flag, hand) {
      this.page = flag ? 1 : this.page
      if (this.filters.startDate === '' && this.filters.endDate !== '') { // 开始时间为空
        this.$message({
          message: '开始时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.startDate !== '' && this.filters.endDate === '') { // 结束时间为空
        this.filters.endDate = this.getdate()
      } else if (this.filters.startDate && this.filters.endDate) {
        if (new Date(this.filters.startDate).getTime() > new Date(this.filters.endDate).getTime()) {
          this.$message({
            message: '开始时间不能大于结束时间', type: 'error'
          })
          return false
        }
      }
      this.listLoading = true
      const params = this.filters
      params.pageNum = this.page
      params.pageSize = this.pageSize
      if (hand) {
        params.logFlag = 1 // 是否写日志
      }
      this.$query('syslog/list', params).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          const data = response.data
          this.total = data.totalCount
          this.operateList = data.list
          this.pageSize = data.pageSize
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportChecks() { // 导出excel
      if (this.filters.startDate === '' && this.filters.endDate !== '') { // 开始时间为空
        this.$message({
          message: '开始时间不能为空', type: 'error'
        })
        return false
      } else if (this.filters.startDate !== '' && this.filters.endDate === '') { // 结束时间为空
        this.filters.endDate = this.getdate()
      } else if (this.filters.startDate && this.filters.endDate) {
        if (new Date(this.filters.startDate).getTime() > new Date(this.filters.endDate).getTime()) {
          this.$message({
            message: '开始时间不能大于结束时间', type: 'error'
          })
          return false
        }
      }
      // window.location.href = this.exportDataUrl + 'syslog/excel?startDate=' + this.filters.startDate + '&endDate=' + this.filters.endDate
      window.location.href = this.exportDataUrl + 'syslog/excel?startDate=' + this.filters.startDate + '&endDate=' + this.filters.endDate +
        '&pageNum=' + this.page + '&pageSize=' + this.pageSize
    },
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.queryChecks(true, true)
    }

  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.queryChecks(true)
  }
}

</script>

<style>
</style>
