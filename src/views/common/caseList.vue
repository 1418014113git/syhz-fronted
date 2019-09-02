<template>
  <div class="caseList">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.AJBH" clearable placeholder="案件编号" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.AJMC" clearable placeholder="案件名称" size="small" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="queryCase(true)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="caseList" v-loading="loading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="AJBH" label="案件编号"></el-table-column>
      <el-table-column prop="AJMC" label="案件名称"></el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类别"></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="selected(scope.row)"
            type="text"
            size="small">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="filters.pageSize" :total="total" :current-page="filters.page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {
    getCasePage
  } from '@/api/casePage'
  export default {
    name: 'caseList',
    data() {
      return {
        filters: {
          pageSize: 15, page: 1
        },
        loading: false,
        total: 0,
        caseList: [],
        tableHeight: null
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.filters.page = val
        this.queryCase(false)
      },
      handleSizeChange(val) {
        this.filters.page = 1
        this.filters.pageSize = val
        this.queryCase(false)
      },
      selected(row) {
        this.$emit('selectedCase', row)
      },
      queryCase(flag) {
        this.filters.page = flag ? 1 : this.filters.page
        getCasePage(this.filters).then((response) => {
          if (response.data.list.length > 0) {
            this.caseList = response.data.list
            this.total = response.data.totalCount
            this.page = response.data.pageNum
            this.filters.pageSize = response.data.pageSize
          }
        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.queryCase(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
</style>
