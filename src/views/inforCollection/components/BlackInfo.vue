<template>
  <section>
    <el-button style="float: right" size="small" type="primary">新增</el-button>
    <el-table :data="list"  v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="file_no" label="类别"></el-table-column>
      <el-table-column prop="type" label="列入黑名单原因"></el-table-column>
      <el-table-column prop="content" label="列入日期"></el-table-column>
      <el-table-column prop="office" label="作出决定机关（列入）"></el-table-column>
      <el-table-column prop="punish_date" label="移出黑名单原因"></el-table-column>
      <el-table-column prop="show_date" label="移出日期"></el-table-column>
      <el-table-column prop="show_date" label="作出决定机关（移出）"></el-table-column>
    </el-table>
  </section>
</template>

<script>
    export default {
      name: 'HighRiskInfo',
      data() {
        return {
          listLoading: false,
          list: [

          ]
        }
      }
    }
</script>

<style scoped>

</style>
