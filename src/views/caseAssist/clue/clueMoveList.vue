<template>
  <section class="clueMoveList">
      <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" :max-height="tableHeight">
        <el-table-column type="index" width="60" label="序号" ></el-table-column>
        <el-table-column prop="receiveName" label='操作单位' min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qbxsCategory" label='操作人' min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qbxsResult"  label='操作时间'  min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ysxz"  label='操作内容'  min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiveName" label='接收单位' min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qbxsResult" label='原因' min-width="250" show-overflow-tooltip></el-table-column>
      </el-table>
  </section>
</template>

<script>
export default {
  name: 'clueMoveList',
  props: ['assistId', 'qbxsId'],
  data() {
    return {
      filters: {
        area: [],
        department: [],
        assistId: ''
      },
      listData: [],
      listLoading: false,
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      tableHeight: null
    }
  },
  methods: {
    query() {
      this.listLoading = true
      const para = {
        assistId: this.assistId
      }
      this.$query('', para).then(response => {
        this.listLoading = false
        this.listData = response.data
      }).catch(() => {
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 320
  }
}
</script>

<style>
  .clueMoveList .el-table--border, .el-table--group {
    border: 0;
  }
  .clueMoveList .el-table--border td, .clueMoveList .el-table--border th, .clueMoveList .el-table__body-wrapper{
    border-right: 0;
  }
  .clueMoveList .el-table--border th, .clueMoveList .el-table__fixed-right-patch {
    border-bottom: 0;
  }

  .clueMoveList .el-table--border::after,
  .clueMoveList .el-table--group::after {
    width: 0;
  }
  .clueMoveList .tableBox{
    width: 100%;
    overflow: auto;
  }
</style>
