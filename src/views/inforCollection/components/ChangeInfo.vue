<template>
  <section>
    <el-button style="float: right" size="small" type="primary">新增</el-button>
    <el-table :data="changeList"  v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="title" label="变更事项"></el-table-column>
      <el-table-column prop="before_content" label="变更前内容"></el-table-column>
      <el-table-column prop="after_content" label="变更后内容"></el-table-column>
      <el-table-column prop="date" label="变更日期"></el-table-column>
    </el-table>
  </section>
</template>

<script>
  export default {
    name: 'ChangeInfo',
    data() {
      return {
        listLoading: false,
        changeList: [
          {
            title: '注册资金变更',
            before_content: '注册资金50万',
            after_content: '注册资金1000万',
            date: '2017-09-12'
          },
          {
            title: '公司性质变更',
            before_content: '游戏公司',
            after_content: '证券公司',
            date: '2017-12-12'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
