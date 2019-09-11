<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="机构名称：">
        <el-input v-model="filters.name" placeholder="机构名称" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="业务范围：">
        <el-input v-model="filters.ywfw" placeholder="业务范围" size="small" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item  label="归属地：">
        <el-cascader :clearable="true" v-model="filters.citys" :options="options" :props="props" change-on-select></el-cascader>
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
      <el-table-column label="检验机构名称">
        <template slot-scope="scope">
          <p :title="scope.row.JGMC" class="ellipsis-word">{{scope.row.JGMC}}</p>
        </template>
      </el-table-column>
      <el-table-column label="业务范围">
        <template slot-scope="scope">
          <p :title="scope.row.YWFW" class="ellipsis-word">{{scope.row.YWFW}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="SSXQ" label="省/市/区县"></el-table-column>
      <el-table-column prop="SYH_SJLDSJ" label="创建时间" width="200"></el-table-column>
      <!--<el-table-column prop="enable" label="是否启用" ></el-table-column>-->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)" v-if="$isViewBtn('105003')" ></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)" v-if="$isViewBtn('105004')" ></el-button>
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
import { getAjCheckOrganization, removeAjCheckOrganization } from '@/api/inspectIdent'
import { getCityTree } from '@/api/citys'
export default {
  name: 'list',
  data() {
    return {
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
      this.$router.push({ path: '/tztg/detail/' + row.ID })
    },
    handleEdit: function(index, row) {
      this.$router.push({ path: '/handlingGuide/inspecorgEdit/', query: { id: row.ID }})
    },
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = {
          id: row.ID,
          logFlag: 1 // 手动点击时，添加埋点参数
        }
        removeAjCheckOrganization(para).then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.page = 1
          this.query(true)
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(true, true)
    },
    query(flag, hand) {
      this.filters.province = ''
      this.filters.city = ''
      this.filters.county = ''
      function getCityByCode(citys, cityCode) {
        for (let i = 0; i < citys.length; i++) {
          if (citys[i].cityCode === cityCode) {
            return citys[i]
          }
        }
      }
      if (this.filters.citys.length > 0) {
        const province = getCityByCode(this.options, this.filters.citys[0])
        this.filters.province = province.cityName
        if (this.filters.citys.length > 1) {
          const city = getCityByCode(province.children, this.filters.citys[1])
          this.filters.city = city.cityName
          if (this.filters.citys.length > 2) {
            const county = getCityByCode(city.children, this.filters.citys[2])
            this.filters.county = county.cityName
          }
        }
      }
      const para = {
        pageNum: flag ? 1 : this.page,
        pageSize: this.pageSize,
        ssxq: '',
        jgmc: this.filters.name,
        ywfw: this.filters.ywfw
      }
      if (this.filters.county) {
        para.ssxq = this.filters.province + '|' + this.filters.city + '|' + this.filters.county
      } else if (this.filters.city) {
        para.ssxq = this.filters.province + '|' + this.filters.city + '|'
      } else if (this.filters.province) {
        para.ssxq = this.filters.province
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.listLoading = true
      getAjCheckOrganization(para).then((response) => {
        const data = response.data
        this.total = data.totalCount
        this.pageSize = data.pageSize
        data.list.forEach(function(item) {
          if (item.enable) {
            item.enable = '已启用'
          } else {
            item.enable = '未启用'
          }
        })
        this.list = data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.page = 1
      this.query(true, true)
    },
    resetSearch() {
      this.filters = {
        name: '', ywfw: '', citys: []
      }
      this.page = 1
      this.query(true, true)
    },
    goAdd() {
      this.$router.push({ path: '/handlingGuide/inspecorgEdit' })
    },
    init() {
      getCityTree().then((response) => {
        const data = response.data
        this.options = data
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.query(true)
    this.init()
  }
}
</script>
<style scoped>
</style>
