<template>
  <section>
    <el-button style="float: right" size="small" type="primary">新增</el-button>
    <el-table :data="list"  v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="file_no" label="许可文件编号"></el-table-column>
      <el-table-column prop="file_name" label="许可文件名称"></el-table-column>
      <el-table-column prop="start_time" label="有效期自"></el-table-column>
      <el-table-column prop="end_time" label="有效期至"></el-table-column>
      <el-table-column prop="office" label="许可机关"></el-table-column>
      <el-table-column prop="content" label="许可内容"></el-table-column>
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
            file_name: '文件A',
            start_time: '2017-02-12',
            end_time: '2017-10-12',
            office: '机关A',
            content: '许可的内容'
          },
          {
            file_no: 'SD0002',
            file_name: '文件B',
            start_time: '2017-12-12',
            end_time: '2018-03-12',
            office: '机关B',
            content: '许可的内容'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
