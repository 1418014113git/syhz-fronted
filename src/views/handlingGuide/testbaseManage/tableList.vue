<template>
  <section class="testTableList">
  <div class="addTestQuestion">
    <el-button type="primary" v-if="menuItemNode.deleteable==='0'"  @click="addTestQuestion">添加试题</el-button>
  </div>
    <!--列表-->
    <el-table :data="list" v-loading="listLoading" style="width: 100%;"  class="testList"  :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="ajlbName" label="模块名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="success">{{getStatus(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"  circle  @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-promotion"  circle  @click="handleRelease(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="primary" icon="el-icon-delete"  circle  @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
export default {
  props: ['menuItemNode'],
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null
    }
  },
  watch: { // 监听state状态变化
    menuItemNode: {
      handler: function(val, oldeval) {
        this.query(true)
      }
    }
  },
  methods: {
    query(flag) { // 列表数据查询
      console.log('menuItemNode', JSON.stringify(this.menuItemNode))
      // this.listLoading = true
      // this.page = flag ? 1 : this.page
      // const para = {
      //   pageNum: this.page,
      //   pageSize: this.pageSize,
      //   logFlag: 1, // 添加埋点参数
      //   id: this.menuItemNode.id
      // }
      // this.$query('', para).then((response) => {
      //   this.listLoading = false
      //   if (response.data && response.data.length > 0) {
      //     this.list = response.data.list
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.query(true)
    },
    handleEdit(index, row) { // 编辑

    },
    handleDelete(index, row) { // 删除

    },
    handleRelease(index, row) { // 发布

    },
    addTestQuestion() { // 添加试题

    },
    getStatus(row) { // 获取试题类型名称
      var name = ''
      if (row.type === '1') {
        name = '选择题'
      } else if (row.type === '2') {
        name = '填空题'
      } else if (row.type === '3') {
        name = '判断题'
      }
      return name
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 180
    // this.query(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testTableList{
   height: 100%;
  .addTestQuestion{
    float: right;
    margin-bottom: 10px;
  }
}
</style>
