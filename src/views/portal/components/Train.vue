<template>
  <section class="trainBox">
    <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-table v-else :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="areaName" label="省市" align="center" min-width="70"></el-table-column>
      <el-table-column prop="total5" label="学习人次" align="center"></el-table-column>
      <el-table-column prop="total6" label="学习时长" align="center" min-width="70"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'Train',
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    init() {
      this.$update('knowledge/queryTrainCrouse', { cityCode: 1 }).then((response) => {
        if (response.data) {
          this.tableData = response.data
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.trainBox {
  margin-top: 10px;
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .poaj {
    font-size: 16px;
    text-align: center;
    color: #38dc98;
    padding-top: 3px;
  }
}
</style>
