<template>
 <!--阅卷列表-->
  <section class="testTableList">
    <el-row class="">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
    <!--查询条件-->
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="单位" prop="deptName">
        <el-tooltip class="item" effect="dark" :content="filters.deptName" placement="top-start" :popper-class="(filters.deptName&&filters.deptName.length>16)?'tooltipShow':'tooltipHide'">
          <el-autocomplete
            v-model="filters.deptName"
            :fetch-suggestions="querySearchAsyncDept"
            placeholder="输入关键字检索单位"
            :trigger-on-focus="false"
            @select="handleSelectDept"
            class="autoInputW"
          ></el-autocomplete>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-autocomplete
          v-model="filters.realName"
          :fetch-suggestions="querySearchAsyncName"
          placeholder="输入关键字检索姓名"
          :trigger-on-focus="false"
          @select="handleSelectName"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="阅卷状态" prop="">
        <el-select v-model="filters.status" placeholder="请选择" clearable @change="examStatusChange">
          <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="queryList(true,true)">检索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="deptName" label="单位名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="realName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="考试时间" width="280" align="center"></el-table-column>
      <el-table-column prop="score" label="自动阅卷得分" width="140" align="center"></el-table-column>
      <el-table-column prop="artScore" label="人工阅卷得分" width="140" align="center"></el-table-column>
      <el-table-column prop="status" label="阅卷状态" width="160" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'start'" style="color:#F56C6C;">{{$getLabelByValue(scope.row.status, txData)}}</span>
          <span v-else-if="scope.row.status === 'end'" style="color:#67C23A;">{{$getLabelByValue(scope.row.status, txData)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" circle  :title="scope.row.status === 'start'?'阅卷':'详情'"  :icon="scope.row.status === 'start'?'el-icon-view':'el-icon-document'"  @click="goOverScore(scope.$index, scope.row)"></el-button>
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
      isQueryDept: true, // 是否再次调用检索单位功能
      isQueryName: true, // 是否再次调用检索姓名功能
      txData: goOverPaperStatus() // 阅卷状态
    }
  },
  methods: {
    examStatusChange(val) {
      this.initData()
      this.queryList(true, true)
    },
    initData() {
      this.tableData = []
      this.total = 0
      this.pageSize = 15
    },
    queryList(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        realName: this.filters.realName,
        deptName: this.filters.deptName,
        status: this.filters.status,
        examId: this.carryParam.examId // 考试的id
      }
      if (hand) {
        para.logFlag = 1 // 添加埋点参数
      }
      this.$query('exam/subjectiveList', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.pageSize = response.data.pageSize
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
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
    },
    querySearchAsyncDept(queryString, cb) { // 单位检索
      if (queryString) {
        this.isQueryDept = true
        if (this.isQueryDept) {
          var param = {
            name: this.filters.deptName
          }
          this.$query('departsearch', param, true).then((response) => {
            var restaurants = response.data
            restaurants.forEach(element => {
              element.value = element.name
            })
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          })
        }
      } else {
        this.isQueryDept = false
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    querySearchAsyncName(queryString, cb) { // 姓名检索
      if (queryString) {
        this.isQueryName = true
        if (this.isQueryName) {
          var param = {
            realName: this.filters.realName
          }
          if (this.filters.deptName) {
            param.deptName = this.filters.deptName
          }
          this.$query('userlikename', param, true).then((response) => {
            var restaurants = response.data
            restaurants.forEach(element => {
              element.value = element.realName
            })
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          })
        }
      } else {
        this.isQueryName = false
      }
    },
    handleSelectDept(item) {
      this.filters.deptName = item.name
      this.isQueryDept = false
    },
    handleSelectName(item) {
      this.filters.realName = item.realName
      this.isQueryName = false
    },
    goBack() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    this.queryList(true)
  },
  activated() {
    this.queryList(true)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.testTableList {
  height: 100%;
  .addTestQuestion {
    float: right;
    margin-bottom: 10px;
  }
}
.el-autocomplete-suggestion {
  border: 1px solid #00a0e9;
}
.el-autocomplete-suggestion__wrap {
  background-color: #005982 !important;
  border: 0 !important;
}
.el-autocomplete-suggestion li {
  color: #fff;
}
.el-autocomplete-suggestion.is-loading li:hover,
.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: rgba(188, 232, 252, 0.1);
}
.autoInputW {
  width: 300px;
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
</style>
