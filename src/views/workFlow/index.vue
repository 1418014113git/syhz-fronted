<template>
  <div class="workflow">
    <el-form :inline="true" :model="filters">
      <el-form-item label="状态">
        <el-select v-model="filters.state" size="small">
          <el-option label="待审批" value="1"></el-option>
          <el-option label="审批中" value="2"></el-option>
          <el-option label="通过" value="3"></el-option>
          <el-option label="驳回" value="4"></el-option>
          <el-option label="已过期" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="filters.timeRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="$isViewBtn('100707')" v-on:click="getList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="业务模块">
        <template slot-scope="scope">
        <span v-if="wdType==='0001'">人员协查</span>
        <span v-if="wdType==='0002'">企业协查</span>
        <span v-if="wdType==='0003'">案件督办</span>
        <span v-if="wdType==='0004'">全国性案件协查</span>
        <span v-if="wdType==='0005'">案件协查</span>
        <span v-if="wdType==='0006'">检验鉴定</span>
        <span v-if="wdType==='0008'">督办结案报告</span>
        <span v-if="wdType==='0009'">无文书待审核</span>
        </template>
      </el-table-column>
      <el-table-column prop="dept_name" label="申请部门"></el-table-column>
      <el-table-column prop="user_name" label="申请人员" width="100"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.wfStatus==='1'">待审批</span>
          <span v-if="scope.row.wfStatus==='2'">审批中</span>
          <span v-if="scope.row.wfStatus==='3'">通过</span>
          <span v-if="scope.row.wfStatus==='4'">驳回</span>
          <span v-if="scope.row.wfStatus==='5'">已过期</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="申请时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.wfStatus==='1' && $isViewBtn('121001')" type="primary" class="el-icon-document" @click="examine(scope.row)">审核</el-button>
          <el-button v-if="scope.row.wfStatus!=='1'" type="primary" class="el-icon-document" @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper"  @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="pageNum" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import {
  getWorkOrderPage
} from '@/api/workflow'

export default {
  name: 'workflow',
  components: {},
  data() {
    return {
      listLoading: false,
      total: 0,
      pageSize: 15,
      pageNum: 1,
      filters: {
        timeRange: [],
        state: '1'
      },
      listData: [],
      wdType: '',
      currentDep: {},
      tableHeight: null
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.getList()
    },
    formatType(row, column) {
      if (row.assistType === '1') {
        return '特提'
      }
      if (row.assistType === '2') {
        return '特急'
      }
      if (row.assistType === '3') {
        return '加急'
      }
      if (row.assistType === '4') {
        return '平急'
      }
      if (row.assistType === '5') {
        return '一般'
      }
    },
    getList() {
      const para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        wdType: this.wdType
      }
      if (this.filters.state) {
        para.status = this.filters.state
      }
      if (this.filters.timeRange && this.filters.timeRange.length === 2) {
        para.startTime = this.filters.timeRange[0]
        para.endTime = this.filters.timeRange[1]
      }
      if (this.wdType === '0005' || this.wdType === '0003' || this.wdType === '0004' || this.wdType === '0006' || this.wdType === '0008' || this.wdType === '0009') {
        para.acceptDept = this.currentDep.id
        this.getExamineList(para)
      }
    },
    getExamineList(para) {
      this.listLoading = true
      getWorkOrderPage(para).then((response) => {
        this.listLoading = false
        if (response.data) {
          this.listData = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    examine(row) {
      this.$router.push({
        path: '/workflow/examine/' + this.wdType + '/' + row.wfId
      })
    },
    detail(row) {
      this.$router.push({
        // path: '/workflow/examine/detail/' + id
        path: '/workflow/examine/' + this.wdType + '/' + row.wfId
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.wdType = this.$route.params.type
    this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.getList()
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
