<template>
  <section class="case-trend">
    <el-col>
      <el-card style="margin-bottom: 10px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$isViewBtn('121001')"  @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-bottom: 10px;">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="50" label="序号"  align="center" ></el-table-column>
          <el-table-column prop="cityName" label="市" align="center" width="100"></el-table-column>
          <el-table-column label="破获案件数" align="center" >
            <el-table-column prop="sp" label="食品类" width="120"  align="center" ></el-table-column>
            <el-table-column prop="yp" label="药品类" width="120" align="center" ></el-table-column>
            <el-table-column prop="hj" label="资源环境类" width="120" align="center" ></el-table-column>
            <el-table-column prop="num" label="总计案件数" width="120" align="center" ></el-table-column>
          </el-table-column>
          <el-table-column prop="dya" label="侦破大要案件数"  align="center" ></el-table-column>
          <el-table-column prop="jqzy" label="发起全国性协查数"  align="center" ></el-table-column>
          <el-table-column prop="zpbd" label="侦破部督案件数"  align="center" ></el-table-column>
          <el-table-column prop="zptd" label="侦破厅都案件数"  align="center" ></el-table-column>
          <el-table-column prop="wzpbd" label="未破部督案件数"  align="center" ></el-table-column>
          <el-table-column prop="wzptd" label="未破厅都案件数"  align="center" ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </section>
</template>

<script>
  import { spyphjzdke } from '@/api/portal'
  export default {
    name: 'Statistical',
    data() {
      return {
        tableData: [],
        dateRange: [],
        filters: {
          startTime: '',
          endTime: ''
        },
        loading: false
      }
    },
    methods: {
      query() {
        this.loading = true
        if (this.dateRange && this.dateRange.length === 2) {
          this.filters.startTime = this.dateRange[0]
          this.filters.endTime = this.dateRange[1]
        } else {
          this.filters.startTime = ''
          this.filters.endTime = ''
        }
        const para = this.filters
        spyphjzdke(para).then((response) => {
          if (response.code === '000000' && response.data) {
            this.loading = false
            this.tableData = response.data
            this.tableData.forEach((item, index) => {
              item.cityName = item.cityName.replace('内蒙古', '').replace('自治区', '')
            })
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted() {
      this.query()
    }
  }
</script>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
	overflow-x: auto;
}
</style>
