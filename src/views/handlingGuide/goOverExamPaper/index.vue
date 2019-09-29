<template>
 <!--阅卷列表-->
  <section class="testTableList">
    <!--查询条件-->
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="单位" prop="deptName">
        <el-input type="text" size="small" v-model="filters.deptName" clearable placeholder="输入关键字检索单位"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input type="text" size="small" v-model="filters.realName" clearable placeholder="输入关键字检索姓名"></el-input>
      </el-form-item>
      <el-form-item label="阅卷状态" prop="">
        <el-select v-model="filters.status" placeholder="请选择" @change="examStatusChange">
          <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryList(true,true)">检索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="deptName" label="单位名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="realName" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="考试时间" width="280"></el-table-column>
      <el-table-column prop="score" label="自动阅卷得分" width="280"></el-table-column>
      <el-table-column prop="artScore" label="人工阅卷得分" width="280"></el-table-column>
      <el-table-column prop="status" label="阅卷状态" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'start'" style="color:#F56C6C;">{{$getLabelByValue(scope.row.status, txData)}}</span>
          <span v-else-if="scope.row.status === 'end'" style="color:#67C23A;">{{$getLabelByValue(scope.row.status, txData)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" circle  :title="scope.row.status === 'start'?'阅卷':'详情'"  @click="goOverScore(scope.$index, scope.row)" icon="el-icon-view"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
          :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { goOverPaperStatus } from '@/utils/codetotext'
export default {
  props: ['menuItemNode'],
  data() {
    return {
      tableData: [], // 列表数据
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      filters: {
        realName: '', // 用户名称
        deptName: '', // 单位名称
        status: '' // 阅卷状态
      },
      txData: goOverPaperStatus() // 阅卷状态
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    examStatusChange(val) {
      this.queryList(false, true)
    },
    queryList(flag) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        realName: this.filters.realName,
        deptName: this.filters.deptName,
        status: this.filters.status
      }
      this.$query('exam/subjectiveList', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.queryList(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.queryList(true, true)
    },
    goOverScore(index, row) { // 去阅卷
      this.$gotoid('/handlingGuide/goOverExamPaper/settingScore', JSON.stringify(row))
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.queryList(true)
  },
  activated() {
    this.queryList(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testTableList {
  height: 100%;
  .addTestQuestion {
    float: right;
    margin-bottom: 10px;
  }
}
</style>
