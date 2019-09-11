<template>
  <div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="用户名">
          <el-input v-model="filters.userName" placeholder="用户名" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item prop="value6" label="时间范围">
          <div class="block case">
            <el-date-picker v-model="dateRand" type="daterange" @change="dateChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filters.realName" placeholder="用户名" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="ip">
          <el-input v-model="filters.ip" placeholder="用户名" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录状态">
          <el-select v-model="filters.loginStatus" placeholder="请选择" clearable>
            <el-option label="失败" value="0"></el-option>
            <el-option label="成功" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录方式">
          <el-select v-model="filters.loginType" placeholder="请选择" clearable>
            <el-option label="用户名密码登录" value="1"></el-option>
            <el-option label="PKI登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" size="small" v-on:click="getLogList(true,true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="56"></el-table-column>
      <el-table-column prop="user_name" label="用户名" min-width="15%"></el-table-column>
      <el-table-column prop="real_name" label="姓名" min-width="15%"></el-table-column>
      <el-table-column label="登录方式" min-width="15%">
        <template slot-scope="scope">
          <span v-if="String(scope.row.login_type) === '1'">用户名密码登录</span>
          <span v-if="String(scope.row.login_type) === '2'">PKI登录</span>
        </template>
      </el-table-column>
      <el-table-column prop="login_status"  label="登录状态"  :formatter = "dateFormatStatus" min-width="7%" ></el-table-column>
      <el-table-column prop="ip_address" label="IP地址" min-width="10%" ></el-table-column>
      <el-table-column prop="create_date" label="登录时间" min-width="10%" ></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-if="total">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { getLoginPageList } from '@/api/log/log.js'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {
        userName: '',
        realName: '',
        ip: '',
        loginStatus: '',
        loginType: ''
      },
      logs: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      dateRand: [],
      tableHeight: null
    }
  },
  methods: {
    dateChange(val) {
      if (val && val.length > 0) {
        this.filters.startDate = val[0]
        this.filters.endDate = val[1]
      } else {
        this.filters.startDate = ''
        this.filters.endDate = ''
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getLogList(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getLogList(false, true)
    },
    getLogList(flag, hand) {
      this.page = flag ? 1 : this.page
      const para = this.filters
      para.pageNum = this.page
      para.pageSize = this.pageSize
      if (hand) {
        para.logFlag = 1
      }
      this.listLoading = true
      getLoginPageList(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        this.logs = data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dateFormatStatus(row, column) {
      return row.login_status === 1 ? '成功' : '失败'
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.dateRand = []
      this.dateChange('')
      this.filters.realName = ''
      this.filters.userName = ''
      this.filters.ip = ''
      this.filters.loginStatus = ''
      this.filters.loginType = ''
      this.getLogList(true, true)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.getLogList(true)
  }
}

</script>

<style>
.case .el-date-editor .el-range-separator {
  padding: 0;
}
</style>
