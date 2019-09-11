<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <!--<el-form-item label="任务名称">-->
        <!--<el-input v-model="filters.userName" placeholder="登录账号" size="small" clearable></el-input>-->
        <!--</el-form-item>-->
        <el-form-item prop="value6" label="时间范围">
          <div class="block case">
            <el-date-picker v-model="dateRand" type="daterange" @change="dateChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" clearable></el-date-picker>
          </div>
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
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="msName" label="市名称" min-width="15%"></el-table-column>
      <el-table-column prop="loginNum"  label="登陆次数"  min-width="7%" ></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar" v-if="total">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" :current-page="page" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { getMsloginlog } from '@/api/log/log.js'
export default {
  name: 'ajList',
  data() {
    return {
      filters: {},
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
        para.logFlag = 1 // 是否写日志
      }
      this.listLoading = true
      getMsloginlog(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        this.logs = data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['filters'].resetFields()
      this.dateRand = []
      this.dateChange('')
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
