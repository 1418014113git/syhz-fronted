<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item  label="行政区划：">
        <el-cascader :clearable="true" v-model="filters.citys" :options="options" :props="props" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="装备类型：" v-if="ywfwView">
        <el-input v-model="filters.ywfw" placeholder="装备类型" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="机构名称：">
        <el-input v-model="filters.name" placeholder="机构名称" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search" v-if="$isViewBtn('105001')" >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="goAdd()" v-if="$isViewBtn('105002')" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="XZQH" label="省/市/区"></el-table-column>
      <el-table-column label="机构名称">
        <template slot-scope="scope">
          <p :title="scope.row.JGMC" class="ellipsis-word">{{scope.row.JGMC}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="SL" label="装备总数量" width="200"></el-table-column>
      <el-table-column prop="DSL" label="单警装备数量" width="200"></el-table-column>
      <el-table-column prop="TSL" label="特勤装备数量" width="200"></el-table-column>
      <!--<el-table-column prop="enable" label="是否启用" ></el-table-column>-->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="查看明细" size="mini" type="primary" circle   icon="el-icon-document" @click="handleDetail(scope.$index, scope.row)" v-if="$isViewBtn('105003')" ></el-button>
          <!--
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)" v-if="$isViewBtn('105003')" ></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)" v-if="$isViewBtn('105004')" ></el-button>
           -->

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
      ywfwView: false,
      filters: {
        name: '',
        ywfw: '',
        citys: []
      },
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
<style scoped>
</style>
