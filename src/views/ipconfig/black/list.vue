<template>
  <section>
    <el-form :inline="true"
             :model="filters">
      <el-form-item label="IP 地址：">
        <el-input v-model="filters.title" placeholder="IP 地址" size="small"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="filters.yys"
                   placeholder="请选择">
          <el-option label="黑名单" value="0"></el-option>
          <el-option label="白名单" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="goAdd()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="ip" label="IP地址段" min-width="8%">
        <template slot-scope="scope">
          <span>{{getIp(scope.row)}}</span>
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="yys"
                       label="运营商"
                       min-width="8%"></el-table-column>
                       -->
      <el-table-column prop="adress" label="所属地" min-width="6%"></el-table-column>
      <el-table-column label="分类" min-width="10%">
        <template slot-scope="scope">
          <span v-if="String(scope.row.type) === '0'">黑名单</span>
          <span v-if="String(scope.row.type) === '1'">白名单</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="views" label="阅读数" sortable min-width="4%"></el-table-column> -->
      <el-table-column prop="remark" label="备注" min-width="10%"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24"
            class="toolbar">
      <el-pagination v-if="total > 0"
                     layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handleCurrentChange"
                     :page-sizes="[15,30,50,100]"
                     @size-change="handleSizeChange"
                     :page-size="pageSize"
                     :current-page="page"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
import { getDepToken } from '@/utils/auth'
export default {
  name: 'list',
  data() {
    return {
      filters: {
        title: '',
        date: '',
        yys: '0'
      },
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      list: [],
      currentDep: '',
      tableHeight: null
    }
  },
  methods: {
    getIp(row) {
      var ips = row.ip + ' -- ' + row.ipEnd
      return ips
    },
    formatTxt(str) {
      return str.replace(',', '，')
    },
    handleDetail: function(index, row) {
      this.$router.push({ path: '/tztg/detail/' + row.id })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/ipconfig/edit/' + row.id })
    },
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        // const para = {
        //   id: row.id
        // }
        // removeTztg(para).then((response) => {
        //   this.$message({
        //     message: '删除成功',
        //     type: 'success'
        //   })
        //   this.page = 1
        //   this.query()
        // })
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query()
    },
    query(flag, hand) {
      this.total = 7
      this.pageSize = 15
      this.page = flag ? 1 : this.page
      if (hand) {
        // logFlag = 1
      }
      this.listLoading = false
      if (this.filters.yys === '0') {
        this.list = [{ 'id': 1, 'ip': '1.80.83.155', 'ipEnd': '1.80.83.255', 'yys': '电信', 'adress': '陕西省西安市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '113.200.39.250', 'ipEnd': '113.200.39.255', 'yys': '联通', 'adress': '陕西省铜川市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '111.18.71.221', 'ipEnd': '111.18.71.255', 'yys': '电信', 'adress': '陕西省宝鸡市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '111.155.100.203', 'ipEnd': '111.155.100.215', 'yys': '联通', 'adress': '陕西省宝鸡市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '61.150.115.245', 'ipEnd': '61.150.115.255', 'yys': '电信', 'adress': '陕西省榆林市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '36.40.191.215', 'ipEnd': '36.40.191.225', 'yys': '电信', 'adress': '陕西省延安市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }, { 'id': 1, 'ip': '	36.45.223.213', 'ipEnd': '36.45.223..225', 'yys': '电信', 'adress': '陕西省西安市', 'type': 0, 'time': '2018-08-07 17:24:21', 'remark': '非法地址' }]
      } else if (this.filters.yys === '1') {
        this.list = [{ 'id': 2, 'ip': '113.200.39.250', 'ipEnd': '113.200.39.255', 'yys': '联通', 'adress': '陕西省铜川市', 'type': 1, remark: '陕西省铜川市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '111.155.100.211', 'ipEnd': '111.155.100.255', 'yys': '联通', 'adress': '陕西省宝鸡市', 'type': 1, remark: '陕西省宝鸡市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '1.80.83.211', 'ipEnd': '1.80.83.222', 'yys': '电信', 'adress': '陕西省西安市', 'type': 1, remark: '陕西省西安市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '36.40.191.111', 'ipEnd': '36.40.191.115', 'yys': '电信', 'adress': '陕西省延安市', 'type': 1, remark: '陕西省延安市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '61.150.115.186', 'ipEnd': '61.150.115.190', 'yys': '电信', 'adress': '陕西省榆林市', 'type': 1, remark: '陕西省榆林市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '113.200.219.1', 'ipEnd': '113.200.219.25', 'yys': '联通', 'adress': '陕西省咸阳市', 'type': 1, remark: '陕西省咸阳市政府IP', 'time': '2018-08-07 17:24:21' }, { 'id': 2, 'ip': '61.150.127.125', 'ipEnd': '61.150.127.160', 'yys': '电信', 'adress': '陕西省宝鸡市', 'type': 1, remark: '陕西省宝鸡市政府IP', 'time': '2018-08-07 17:24:21' }]
      }
      // const para = {
      //   pageNum: this.page,
      //   pageSize: this.pageSize,
      //   title: this.filters.title,
      //   orgId: this.currentDep
      // }
      // if (this.filters.date) {
      //   para.startTime = this.filters.date[0]
      //   para.endTime = this.filters.date[1]
      // }
      // this.listLoading = true
      // getTztgListPage(para).then((response) => {
      //   const data = response.data
      //   this.total = data.totalCount
      //   this.pageSize = data.pageSize
      //   this.list = data.list
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    search() {
      this.page = 1
      this.query(true, true)
    },
    goAdd() {
      this.$router.push({ path: '/ipconfig/save/' + this.filters.yys })
    },
    setCurrentOrg() {
      const a = JSON.parse(getDepToken())
      this.currentDep = a[0].id
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.setCurrentOrg()
    this.query()
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>
<style scoped>
</style>
