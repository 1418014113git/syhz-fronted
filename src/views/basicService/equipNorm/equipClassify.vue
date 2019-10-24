<template>
  <section>
    <el-row class="clearfix">
      <el-button class="right" type="primary" size="small" v-on:click="goAdd()" icon="el-icon-plus" style="margin-top:3px;">添加装备分类</el-button>
      <img src="@/assets/icon/back.png" class="goBack" @click="back" style="margin-right: 10px;">
    </el-row>
    <!-- <el-form :inline="true" :model="equipNormForm" label-width="78px" label-position="left" class="clearfix">
      <el-form-item  label="装备分类">

      </el-form-item>
      <el-form-item label="配备项目">

      </el-form-item>
      <el-form-item>

      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" v-on:click="goAdd()" icon="el-icon-menu">装备分类管理</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="XZQH" label="装备分类名称" align="center" width="200"></el-table-column>
      <el-table-column prop="SL" label="显示次序" align="center" width="100"></el-table-column>
      <el-table-column prop="DSL" label="最新编辑时间" align="center" width="200"></el-table-column>
      <el-table-column prop="TSL" label="说明" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" circle icon="el-icon-edit-outline" @click="handleDetail(scope.$index, scope.row)"></el-button>
          <el-button title="停用" size="mini" type="primary" circle icon="el-icon-minus" @click="handleDetail(scope.$index, scope.row)"></el-button>
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
import { removeAjCheckOrganization } from '@/api/inspectIdent'
import { getCityTree } from '@/api/citys'
export default {
  name: 'list',
  data() {
    return {
      equipNormForm: {},
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      list: [],
      options: [],
      props: {
        label: 'cityName',
        value: 'cityCode'
      },
      tableHeight: null
    }
  },
  methods: {
    back() {
      this.$router.back(-1)
    },
    handleDetail: function(index, row) {
      this.$router.push({ path: '/basic/equip/detailArea', query: { id: row.ID, name: row.JGMC }})
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/handlingGuide/inspecorgEdit/', query: { id: row.ID }})
    },
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.ID
        }
        removeAjCheckOrganization(para).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query()
        })
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
    query(hand) {
      // var param = {}
      // if (hand) {
      //   param.logFlag = 1
      // }
      var listData = [
        {
          'SYH_SJGXSJ': '2019-04-26 17:20:48',
          'JGMC': '陕西省西安市环境食品药品侦查总队',
          'SL': 315,
          'DSL': 181,
          'TSL': 134,
          'ZBLX': 1,
          'ID': '1000',
          'XZQH': '陕西省西安市'
        },
        {
          'SYH_SJGXSJ': '2019-04-26 17:20:48',
          'JGMC': '陕西省咸阳市环境食品药品侦查总队',
          'SL': 27,
          'DSL': 14,
          'TSL': 13,
          'ZBLX': 1,
          'ID': '10001',
          'XZQH': '陕西省咸阳市'
        }
      ]

      this.total = 4
      this.pageSize = 15
      this.list = listData
      return false
    },
    search() {
      this.page = 1
      this.query(true)
    },
    resetSearch() {
      this.filters = {
        name: '', ywfw: '', citys: []
      }
      this.page = 1
      this.query(true)
    },
    goAdd() {
      console.log('------go')
      this.$router.push({ path: '/basic/equip/add' })
    },
    init() {
      getCityTree().then((response) => {
        const data = response.data
        this.options = data
        this.filters.citys = [610000]
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query()
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
