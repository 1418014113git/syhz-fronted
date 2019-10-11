<template>
  <section class="poajBox">
    <div v-if="tableData.length === 0" style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
    </div>
    <el-table v-else :data="tableData" style="width: 100%" class="statisticCollect">
      <el-table-column type="index" width="30" label="序号" align="center"></el-table-column>
      <el-table-column prop="cityName" label="市" align="center" min-width="80"></el-table-column>
      <el-table-column label="破获案件数" align="center">
        <el-table-column prop="sp" label="食品类" align="center" min-width="70"></el-table-column>
        <el-table-column prop="yp" label="药品类" align="center" min-width="70"></el-table-column>
        <el-table-column prop="hj" label="资源环境类" align="center"></el-table-column>
        <el-table-column prop="num" label="总计案件数" align="center" min-width="90"></el-table-column>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { citysajorderlist } from '@/api/portal'

export default {
  name: 'Statistical',
  data() {
    return {
      cityList: '',
      tableData: [],
      virtualData: [
        {
          cityName: '西安市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '铜川市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '宝鸡市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '咸阳市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '渭南市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '延安市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '汉中市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '榆林市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '安康市', sp: '0', yp: '0', hj: '0', num: '0'
        },
        {
          cityName: '商洛市', sp: '0', yp: '0', hj: '0', num: '0'
        }
      ]
    }
  },
  methods: {
    init() {
      citysajorderlist().then((res) => {
        if (res.code === '000000' && res.data) {
          this.tableData = res.data
          this.tableData.forEach((item, index) => {
            // item.cityName = item.cityName.replace('内蒙古', '').replace('自治区', '')
            // if (item.cityName.indexOf('市') < 0) {
            //   item.cityName += '市'
            // }
            this.cityList += ' ' + item.cityName
          })
          if (res.data.length < 1) {
            this.tableData = this.virtualData
          }
          if (res.data.length > 0 && res.data.length < 12) {
            for (let i = 0; i < this.virtualData.length; i++) {
              if (this.cityList.indexOf(this.virtualData[i]['cityName']) < 0) {
                this.tableData.push(this.virtualData[i])
              }
            }
          }
          this.tableData.sort(function(a, b) {
            return b.num - a.num
          })
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
.poajBox {
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
  .el-table thead .cell {
    padding: 2px 0;
  }
}
@media only screen and (max-width: 1367px) {
  .el-table{
    font-size: 12px;
  }
}


</style>
