<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>情报信息</span>
    </div>
    <el-card class="cont-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>共10个涉案情报</span>
      </div>
      <el-table :data="data">
        <el-table-column prop="date" label="获取日期"></el-table-column>
        <el-table-column prop="level" label="情报级别"></el-table-column>
        <el-table-column prop="content" label="情报内容"></el-table-column>
        <el-table-column prop="xc" label="是否协查"></el-table-column>
      </el-table>
    </el-card>
  </el-card>
</template>

<script>
  export default {
    name: 'EnterpriseInfo',
    components: {},
    data() {
      return {
        data: [
          { date: '2018-06-11', level: '重要', content: '2017-12-12发现嫌疑人打车蒙ASD251出行', xc: '是' }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
