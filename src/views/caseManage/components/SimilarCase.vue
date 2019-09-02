<template>
  <div class="SimilarCase">
    <el-table :data="cases" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column label="案件编号" min-width="10%">
        <template slot-scope="scope">
          <router-link tag="a" class="ajbh-color" target="_blank" :to="{path:'/caseManage/detailetl/' + scope.row.AJBH}">{{scope.row.AJBH}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="案件名称" min-width="12%">
        <template slot-scope="scope">
          <router-link tag="a" class="ajbh-color" target="_blank" :to="{path:'/caseManage/detailetl/' + scope.row.AJBH}">{{scope.row.AJMC}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="JYAQ" label="简要案情" min-width="25%">
      </el-table-column>
      <el-table-column prop="AJLB_NAME" label="案件类别" min-width="9%" >
      </el-table-column>
      <el-table-column prop="DISTRICT_CODE_NAME" label="市" min-width="14%" >
      </el-table-column>
      <!--<el-table-column label="操作" width="150">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button size="mini" type="primary" icon="el-icon-tickets"  circle @click="toAjDetail(scope.row.AJBH)"></el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {
    getSimilarCase
  } from '@/api/caseManage'
  export default {
    name: 'SimilarCase',
    props: ['ajlb'],
    data() {
      return {
        cases: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        AJLB: ''
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getList(false)
      },
      getList(flag) {
        const type = this.$parent.$parent.$parent.type
        let table = ''
        if (type === 'ajbh') {
          table = 'ETL'
        }
        this.page = flag ? 1 : this.page
        const para = {}
        para.pageNum = this.page
        para.pageSize = this.pageSize
        para.AJLB = this.AJLB
        para.table = table
        this.listLoading = true
        getSimilarCase(para).then((res) => {
          const data = res.data
          this.total = data.totalCount
          this.cases = data.list
          this.listLoading = false
          if (this.cases.length > 0) {
            this.$emit('similarCase', this.total)
          }
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    mounted() {
      if (this.info) {
        this.AJLB = this.info
        this.getList(true)
      }
    },
    watch: {
      ajlb(val) {
        if (val) {
          this.AJLB = val
          this.getList(true)
        }
      }
    }
  }
</script>

<style scoped>

</style>
