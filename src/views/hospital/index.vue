<template>
  <section>
    <el-form :inline="true" :model="filters"  ref="filters">

      <el-form-item>
        <el-select size="small" v-model="filters.JGBJ" placeholder="机构类型" clearable>
          <el-option label="医院" value="医院"></el-option>
          <el-option label="卫生监督所" value="卫生监督所"></el-option>
          <el-option label="急救指挥中心" value="急救指挥中心"></el-option>
          <el-option label="村卫生室" value="村卫生室"></el-option>
          <el-option label="疾病防控中心" value="疾病防控中心"></el-option>
          <el-option label="社区卫生服务站" value="社区卫生服务站"></el-option>
          <el-option label="诊所" value="诊所"></el-option>
        </el-select>
      </el-form-item>
     <el-form-item>
        <el-input size="small" v-model="filters.FRDB" placeholder="法人代表" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="filters.JGMC" placeholder="机构名称" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="filters.DHHM" placeholder="联系方式" clearable maxlength="11"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="filters.DZ" placeholder="地址" clearable maxlength="100"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" v-on:click="getList(true)" >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table :data="hospitalList" highlight-current-row v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="JGMC" label="机构名称" min-width="13%">
      </el-table-column>
      <el-table-column prop="JGBJ" label="机构类型" min-width="10%" >
      </el-table-column>
      <el-table-column prop="DWFZR" label="单位负责人" min-width="7%" >
      </el-table-column>
      <el-table-column prop="DHHM" label="联系方式" min-width="10%" >
      </el-table-column>
      <el-table-column prop="FRDB" label="法人代表" min-width="10%" >
      </el-table-column>
      <el-table-column prop="EMAIL" label="单位电子邮箱" min-width="10%" >
      </el-table-column>
      <el-table-column prop="WEB" label="单位网站域名" min-width="10%" >
      </el-table-column>
      <el-table-column prop="CLSJ" label="单位成立时间" min-width="8%" >
      </el-table-column>
      <el-table-column prop="DZ" label="地址" min-width="22%" >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="详情" size="small" icon="el-icon-share" circle @click="handleDetail(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import { getPageList } from '@/api/hospital/hospital'
  export default {
    name: 'ajList',
    data() {
      return {
        filters: {
        },
        hospitalList: [],
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        dateRand: [],
        tableHeight: null
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getList(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.getList(false)
      },
      getList(flag) {
        this.page = flag ? 1 : this.page
        const para = this.filters
        para.pageNum = this.page
        para.pageSize = this.pageSize
        this.listLoading = true
        getPageList(para).then((response) => {
          const data = response.data
          this.total = data.totalCount
          this.hospitalList = data.list
          this.pageSize = data.pageSize
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      reset() {
        this.filters.JGBJ = ''
        this.filters.FRDB = ''
        this.filters.JGMC = ''
        this.filters.DHHM = ''
        this.filters.DZ = ''
        this.getList(true)
      },
      handleDetail: function(index, row) {
        this.$router.push({ path: '/hospital/detail/' + row.ID })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.getList(true)
    },
    activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    }
  }

</script>

<style>
.case .el-date-editor .el-range-separator {
	padding: 0;
}
</style>
