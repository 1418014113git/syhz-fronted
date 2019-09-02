<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="ip地址">
          <el-input v-model="filters.ipAddress" placeholder="ip地址" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item prop="value6" label="时间范围">
          <div class="block case">
            <el-date-picker v-model="dateRand" type="daterange" @change="dateChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" clearable></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" size="small" v-on:click="getLogList(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="modeName" label="应用名称" min-width="15%"></el-table-column>
      <el-table-column prop="loginNum"  label="访问次数"  min-width="7%" ></el-table-column>
      <el-table-column prop="loginProportion"  label="访问占比"  min-width="7%" ></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar" v-if="total">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" :page-sizes="[15,30,50,100]" :current-page="page" @size-change="handleSizeChange" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import { getApplicationLog } from '@/api/log/log.js'
  export default {
    name: 'ajList',
    data() {
      return {
        filters: {
          ipAddress: ''
        },
        countNum: '',
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
        this.getLogList(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getLogList(false)
      },
      getLogList(flag) {
        this.page = flag ? 1 : this.page
        const para = this.filters
        para.pageNum = this.page
        para.pageSize = this.pageSize
        this.listLoading = true
        getApplicationLog(para).then((response) => {
          const data = response.data
          this.logs = data.list
          var obj = null
          for (var i = 0; i < response.data.list.length; i++) {
            obj += parseInt(response.data.list[i].loginNum)
          }
          for (var j = 0; j < response.data.list.length; j++) {
            this.logs[j].loginProportion = (this.logs[j].loginNum / obj * 100).toFixed(2) + '%'
          }
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.listLoading = false
        })
      },
      reset() {
        this.$refs['filters'].resetFields()
        this.dateRand = []
        this.dateChange('')
        this.filters.ipAddress = ''
        this.getLogList(true)
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.getLogList(true)
    }
  }

</script>

<style>

  .case .el-date-editor .el-range-separator{
    padding: 0;
  }
</style>
