<template>
  <section>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.name" placeholder="要素名称/要素描述" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column prop="id" label="要素编号"></el-table-column>
      <el-table-column prop="name" label="要素名称"></el-table-column>
      <el-table-column prop="description" label="要素描述"></el-table-column>
      <el-table-column prop="type_name" label="要素分类"></el-table-column>
      <el-table-column prop="index_number" label="要素权重"></el-table-column>
      <el-table-column prop="enable" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button title="编辑" size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDel(scope.$index, scope.row)"></el-button>
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
  import { getKeyWordListPage, deleteKeyWord } from '@/api/intellSystem'
  export default {
    name: 'index',
    data() {
      return {
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        pageSize: 15,
        listLoading: false,
        data: [],
        tableHeight: null
      }
    },
    methods: {
      formatStatus(row, column) {
        return row.enable === false ? '未启用' : '已启用'
      },
      excelImport() {

      },
      otherImport() {

      },
      handleAdd: function() {
        this.$router.push({ path: '/intellSystem/keyword/add' })
      },
      query(flag) {
        this.listLoading = true
        this.page = flag ? 1 : this.page
        const para = {
          pageNum: this.page,
          name: this.filters.name,
          pageSize: this.pageSize
        }
        getKeyWordListPage(para).then((response) => {
          this.listLoading = false
          this.data = response.data.list
          this.pageSize = response.data.pageSize
          this.total = response.data.totalCount
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.query(false)
      },
      handleSizeChange(val) {
        this.page = 1
        this.pageSize = val
        this.query(false)
      },
      handleEdit: function(index, row) {
        this.$router.push({ path: '/intellSystem/keyword/edit/' + row.id })
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const para = { id: row.id }
          deleteKeyWord(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.query(false)
          })
        }).catch(() => {

        })
      }
    },
    mounted() {
      this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
      this.query(true)
    }
  }
</script>

<style scoped>
  p > span{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
  }
</style>
