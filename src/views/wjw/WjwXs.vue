<template>
  <div class="WjwXs">
    <el-form :inline="true" :model="query" label-width="110px" ref="XsForm">
      <!--<el-form-item label="案件协查状态">-->
        <!--<el-select v-model="filters.status" placeholder="请选择通知分类" clearable>-->
          <!--<el-option v-for="item in statusData"-->
                     <!--:key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="出生证明编号">
        <el-input v-model="query.CSYYZMBH" clearable placeholder="证明编号" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="新生儿姓名">
        <el-input v-model="query.HXM" clearable placeholder="姓名" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="新生儿性别">
        <el-select v-model="query.HXB" placeholder="请选择性别" clearable class="inputw">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医疗机构">
        <el-input v-model="query.YLJG" clearable placeholder="医疗机构" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="出生地">
        <el-input v-model="query.HCSDD" clearable placeholder="出生地" size="small" class="inputw"></el-input>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="qsDateRand" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"
          value-format="yyyy-MM-dd" clearable @change="csDateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="queryData(true,true)" v-if="$isViewBtn('113001')">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column label="出生证明编号" min-width="6%">
        <template slot-scope="scope">
          <a class="ajbh-color" @click="handleDetail(scope.row)">{{scope.row.CSYYZMBH}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="HXM" label="新生儿姓名" min-width="5%"></el-table-column>
      <el-table-column prop="HXB" label="新生儿性别" min-width="5%"></el-table-column>
      <el-table-column label="出生日期" min-width="7%">
        <template slot-scope="scope">
          {{scope.row.HCSRQ | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="HCSDD" label="出生地点" min-width="10%"></el-table-column>
      <el-table-column prop="YLJG" label="医疗机构名称" min-width="10%"></el-table-column>
      <el-table-column prop="QFRQ" label="签发日期" min-width="7%"></el-table-column>
      <el-table-column prop="QFJG" label="签发机构名称" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button title="详情" size="mini" icon="el-icon-document" circle v-if="$isViewBtn('113002')"
                     @click="handleDetail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="pageChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="query.pageSize" :total="total" :current-page="query.pageNum" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {
    parseTime
  } from '@/utils/index'
  import {
    getWjwXsPage
  } from '@/api/xsrcs'

  export default {
    name: 'WjwXs',
    data() {
      return {
        query: {
          pageNum: 1,
          pageSize: 15,
          CSYYZMBH: '',
          HXM: '',
          HXB: '',
          YLJG: '',
          HCSDD: ''
        },
        total: 0,
        listData: [],
        listLoading: false,
        qsDateRand: [],
        qfDateRand: [],
        tableHeight: null
      }
    },
    methods: {
      csDateChange(val) {
        if (val && val.length > 0) {
          this.query.csStart = val[0]
          this.query.csEnd = val[1]
        } else {
          this.query.csStart = ''
          this.query.csEnd = ''
        }
      },
      qfDateChange(val) {
        if (val && val.length > 0) {
          this.query.qfStart = val[0]
          this.query.qfEnd = val[1]
        } else {
          this.query.qfStart = ''
          this.query.qfEnd = ''
        }
      },
      pageChange(val) {
        this.query.pageNum = val
        this.queryData(false, true)
      },
      handleSizeChange(val) {
        this.query.pageNum = 1
        this.query.pageSize = val
        this.queryData(false, true)
      },
      queryData(flag, hand) {
        this.listLoading = true
        this.query.pageNum = flag ? 1 : this.query.pageNum
        if (hand) { // 手动点击时，添加埋点参数
          this.query.logFlag = 1
        }
        getWjwXsPage(this.query).then((res) => {
          this.listLoading = false
          if (res.code === '000000' && res.data) {
            this.listData = res.data.list
            this.total = res.data.totalCount
            this.query.pageSize = res.data.pageSize
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      clear() {
        this.$refs.XsForm.resetFields()
        this.query = {
          pageNum: 1, pageSize: 10, CSYYZMBH: '', HXM: '', HXB: ''
        }
        this.qsDateRand = []
        this.qfDateRand = []
        this.queryData(true, true)
      },
      handleDetail(row) {
        this.$router.push({
          path: '/wjw/xs/' + row.CSYYZMBH
        })
      }
    },
    filters: {
      formatDate(time) {
        return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.queryData(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }
</script>

<style scoped>
  .WjwXs .inputw {
    width: 200px;
  }
</style>

