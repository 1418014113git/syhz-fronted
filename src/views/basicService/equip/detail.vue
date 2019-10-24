<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item  label="行政区划：">
        <el-cascader :clearable="true" v-model="filters.citys" :options="options" :props="props" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="装备类型：" v-if="ywfwView">
        <el-cascader style="width:100%"
                     v-model="filters.ZBLX"
                     :options="optionsZblx"
                     :props="propsZblx"
                     change-on-select clearable></el-cascader>
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
      <el-table-column prop="XZQH" label="省/市/区县"></el-table-column>
      <el-table-column label="机构名称">
        <template slot-scope="scope">
          <p :title="scope.row.JGMC" class="ellipsis-word">{{scope.row.JGMC}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="SL" label="数量" width="200"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="查看明细" size="mini" type="primary" circle  @click="handleDetail(scope.$index, scope.row)" v-if="$isViewBtn('105003')" >查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <!--
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    -->
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
          ZBLX: '',
          name: '',
          ywfw: '',
          citys: []
        },
        total: 0,
        page: 1,
        pageSize: 30,
        listLoading: false,
        list: [],
        optionsZblx: [],
        propsZblx: {
          label: 'zbName',
          value: 'zbCode'
        },
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
        this.$router.push({ path: '/basic/equip/detail', query: { id: row.ID, name: row.JGMC }})
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
      query() {
        var listData = [
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市环境食品药品侦查大队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 1,
            'XZQH': '陕西省西安市新城区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市新城区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 2,
            'XZQH': '陕西省西安市新城区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市碑林区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 3,
            'XZQH': '陕西省西安市碑林区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市莲湖区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 4,
            'XZQH': '陕西省西安市莲湖区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市灞桥区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 5,
            'XZQH': '陕西省西安市灞桥区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市未央区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 6,
            'XZQH': '陕西省西安市未央区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市雁塔区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 7,
            'XZQH': '陕西省西安市雁塔区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市阎良区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 8,
            'XZQH': '陕西省西安市阎良区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市临潼区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 9,
            'XZQH': '陕西省西安市临潼区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市长安区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 10,
            'XZQH': '陕西省西安市长安区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市高陵区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 11,
            'XZQH': '陕西省西安市高陵区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市鄠邑区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 12,
            'XZQH': '陕西省西安市鄠邑区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市蓝田县环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 13,
            'XZQH': '陕西省西安市蓝田县'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市周至县环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 14,
            'XZQH': '陕西省西安市周至县'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市高新区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 15,
            'XZQH': '陕西省西安市高新区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市经开区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 16,
            'XZQH': '陕西省西安市经开区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市国际港务区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 17,
            'XZQH': '陕西省西安市国际港务区'
          },
          {
            'SYH_SJGXSJ': '2019-04-26 17:20:48',
            'JGMC': '陕西省西安市西咸新区环境食品药品侦查支队',
            'SL': 10,
            'ZBLX': 1,
            'ID': 18,
            'XZQH': '陕西省西安市西咸新区'
          }
        ]
        this.total = 18
        this.pageSize = 20
        this.list = listData
        return false
      },
      search() {
        this.page = 1
        this.query()
      },
      resetSearch() {
        this.filters = {
          name: '', ywfw: '', citys: []
        }
        this.page = 1
        this.query()
      },
      goAdd() {
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
      this.optionsZblx = [
        { 'zbName': '单警装备', 'zbCode': 1 },
        { 'zbName': '特勤装备', 'zbCode': 1 }
      ]
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.query()
      this.init()
    }
  }
</script>
<style scoped>
</style>
