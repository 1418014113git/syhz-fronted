<template>
  <section>
    <el-button style="float: right" size="small" type="primary">新增</el-button>
    <el-table :data="list"  v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="file_no" label="决定书文号"></el-table-column>
      <el-table-column prop="type" label="违法行为类型"></el-table-column>
      <el-table-column prop="content" label="行政处罚内容"></el-table-column>
      <el-table-column prop="office" label="决定机关名称"></el-table-column>
      <el-table-column prop="punish_date" label="处罚决定日期"></el-table-column>
      <el-table-column prop="show_date" label="公示日期"></el-table-column>
    </el-table>
  </section>
</template>

<script>
  export default {
    name: 'AdminLicensingInfo',
    data() {
      return {
        listLoading: false,
        list: [
          {
            file_no: 'SD0001',
            type: '文件A',
            content: '偷税',
            office: '税务局',
            punish_date: '2017-02-12',
            show_date: '2017-10-12'
          },
          {
            file_no: 'SD0002',
            type: '文件B',
            content: '漏税',
            office: '税务局',
            punish_date: '2017-12-12',
            show_date: '2018-03-12'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
