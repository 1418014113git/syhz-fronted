<template>
  <section class="trainBox">
    <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-table v-else :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="areaName" label="省市" align="center" min-width="70"></el-table-column>
      <el-table-column prop="" label="学习人次" align="center"></el-table-column>
      <el-table-column prop="" label="学习时长" align="center" min-width="70"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'Train',
  data() {
    return {
      tableData: [
        {
          'deptName': '陕西省公安厅',
          'realNum': 2,
          'areaCode': '610000',
          'userCount': 3,
          'areaName': '省厅',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省西安市公安局环食药侦支队',
          'realNum': 1,
          'areaCode': '610100',
          'userCount': 7,
          'areaName': '西安市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省铜川市公安局环食药支队',
          'realNum': 0,
          'areaCode': '610200',
          'userCount': 5,
          'areaName': '铜川市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省宝鸡市公安局环食药支队',
          'realNum': 0,
          'areaCode': '610300',
          'userCount': 5,
          'areaName': '宝鸡市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省咸阳市公安局环食药侦支队',
          'realNum': 0,
          'areaCode': '610400',
          'userCount': 8,
          'areaName': '咸阳市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省杨凌示范区公安局治安支队',
          'realNum': 0,
          'areaCode': '610403',
          'userCount': 0,
          'areaName': '杨凌区',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省渭南市公安局环食药侦支队',
          'realNum': 0,
          'areaCode': '610500',
          'userCount': 8,
          'areaName': '渭南市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省延安市公安局环食药支队',
          'realNum': 0,
          'areaCode': '610600',
          'userCount': 10,
          'areaName': '延安市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省汉中市公安局环食药支队',
          'realNum': 0,
          'areaCode': '610700',
          'userCount': 8,
          'areaName': '汉中市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省榆林市公安局环食药侦支队',
          'realNum': 0,
          'areaCode': '610800',
          'userCount': 4,
          'areaName': '榆林市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省安康市公安局环食药大队',
          'realNum': 0,
          'areaCode': '610900',
          'userCount': 15,
          'areaName': '安康市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省商洛市公安局环食药支队',
          'realNum': 0,
          'areaCode': '611002',
          'userCount': 6,
          'areaName': '商洛市',
          'total5': 15,
          'total6': 117
        },
        {
          'deptName': '陕西省西咸新区公安局治安支队',
          'realNum': 0,
          'areaCode': '616200',
          'userCount': 0,
          'areaName': '西咸新区',
          'total5': 15,
          'total6': 117
        }
      ]
    }
  },
  methods: {
    init() {
      this.$query('/knowledge/queryTrainCrouse', { cityCode: 1 }).then((response) => {
        if (response.data) {
          this.tableData = response.data
        }
      })
    }
  },
  mounted() {
    // this.init()
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
