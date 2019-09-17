<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item label="时间：">
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="截止日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="归属地：">
        <el-cascader :clearable="true" v-model="filters.citys" :options="options" :props="props" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cityName" label="行政区划"></el-table-column>
      <el-table-column prop="jgnum" label="机构信息"></el-table-column>
      <el-table-column prop="rynum" label="人员信息"></el-table-column>
      <el-table-column prop="zbnum" label="装备信息"></el-table-column>
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
      startTime: '',
      endTime: '',
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
        // const para = {
        //   id: row.ID
        // }
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.page = 1
        this.query()
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.query(true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(true)
    },
    query(hand) {
      // var param = {}
      // if (hand) {
      //   param.logFlag = 1 // 是否写日志
      // }
      const array = [{
        cityName: '西安市', jgnum: 89, rynum: 254, zbnum: 437
      }, {
        cityName: '铜川市', jgnum: 45, rynum: 143, zbnum: 378
      }, {
        cityName: '宝鸡市', jgnum: 23, rynum: 107, zbnum: 325
      }, {
        cityName: '咸阳市', jgnum: 20, rynum: 103, zbnum: 246
      }, {
        cityName: '渭南市', jgnum: 57, rynum: 145, zbnum: 534
      }, {
        cityName: '延安市', jgnum: 67, rynum: 124, zbnum: 236
      }, {
        cityName: '汉中市', jgnum: 46, rynum: 168, zbnum: 345
      }, {
        cityName: '榆林市', jgnum: 63, rynum: 178, zbnum: 347
      }, {
        cityName: '安康市', jgnum: 45, rynum: 137, zbnum: 234
      }, {
        cityName: '商洛市', jgnum: 50, rynum: 156, zbnum: 345
      }]
      this.list = array
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
      this.$router.push({ path: '/handlingGuide/inspecorgEdit' })
    },
    init() {
      getCityTree().then((response) => {
        const data = response.data
        for (var i = 0; i < data.length; i++) {
          if (data[i].cityCode === '610000') {
            this.options = data[i].children
          }
        }
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
.canClick {
  cursor: pointer;
}
.canClick:hover {
  text-decoration: underline;
}
</style>
