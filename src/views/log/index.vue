<template>
  <div class="loglist">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" ref="filters">
        <!-- <el-form-item label="时间范围：">
          <div class="case">
            <el-date-picker v-model="dateRand" type="daterange" @change="dateChange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </div>
        </el-form-item> -->
        <el-form-item label="操作人：">
          <el-input placeholder="输入名称搜索" v-model="filters.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="IP地址：">
          <el-input placeholder="输入IP地址" v-model="filters.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求方法：">
          <el-input placeholder="输入请求方法" v-model="filters.action" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求参数：">
          <el-input placeholder="输入请求参数" v-model="filters.query" clearable></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" size="small" v-on:click="getLogList(true)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-on:click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <a :href="exportDataUrl+'sysoperatrlog?type=4&name='+filters.name+'&ip='+filters.ip+'&action='+filters.action+'&query='+filters.query+'&startDate='+(dateRand.length>0?dateRand[0]:'')+'&endDate='+(dateRand.length>1?dateRand[1]:'')"  download="t.xlsx"  >
            <el-button type="primary"  v-if="$isViewBtn('111003')">Excel导出</el-button>
            <el-button type="primary"  v-if="$isViewBtn('111003')">备份</el-button>
          </a>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" v-on:click="toPersonManager">异常情况</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="logs" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="statisticCollect">
      <el-table-column type="index" label="序号" width="56"></el-table-column>
      <el-table-column prop="user_name" label="用户名" min-width="100"></el-table-column>
      <el-table-column prop="real_name" label="姓名" min-width="100"></el-table-column>
      <el-table-column prop="action" label="请求方法" min-width="200" ></el-table-column>
      <el-table-column prop="ip_address" label="IP地址" width="140" ></el-table-column>
      <el-table-column label="请求参数" min-width="200" >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="请求参数"
            width="600"
            trigger="click">
            <el-row style="width:576px; max-height: 600px; overflow-y: auto; word-break: break-all;">
              {{scope.row.args}}
            </el-row>
            <p slot="reference" class="show-word4">{{scope.row.args}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="返回数据" min-width="500" >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="返回数据"
            width="600"
            trigger="click">
            <el-row style="width:576px; max-height: 600px; overflow-y: auto; word-break: break-all;">
              {{scope.row.return_data}}
              <el-button type="primary"
                         v-clipboard:copy="scope.row.return_data"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError">点击复制</el-button>
            </el-row>
            <p slot="reference" class="show-word4">{{scope.row.return_data}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="create_date" label="创建时间" width="170" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { getPageList } from '@/api/log/log.js'
import importexport from '@/api/importexport'
export default {
  name: 'ajList',
  data() {
    return {
      exportDataUrl: importexport.exportDataUrl,
      filters: {
        name: '', ip: '', query: '', action: ''
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
    onCopy(e) {
      this.$message({
        message: '复制成功', type: 'success'
      })
    },
    onError(e) {
      this.$message({
        message: '复制失败', type: 'success'
      })
    },
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
      getPageList(para).then((response) => {
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
      this.filters.name = ''
      this.dateRand = []
      this.dateChange('')
      this.getLogList(true)
    },
    toPersonManager() {
      // this.$router.push({ path: '/config/restricted' })
      this.$router.push({ path: '/log/indexAbnormal' })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.getLogList(true)
  }
}

</script>

<style>
.loglist .case .el-date-editor .el-range-separator {
  padding: 0;
}
.loglist .el-button--danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  background-image: linear-gradient(
    0deg,
    rgba(245, 108, 108, 0.5) 0%,
    rgba(240, 162, 162, 0.8) 84%
  );
}
.loglist .show-word4 {
  cursor: default;
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
