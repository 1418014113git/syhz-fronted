<template>
 <!--案件统计情况报表导出页-->
  <section class="exportTable">
    <el-row>
      <el-col style="margin-top:20px;">
        <el-button type="primary" icon="el-icon-upload2" @click="print" style="float:left;"><a>导出</a></el-button>
        <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
      </el-col>
    </el-row>
    <!--导出excel-->
     <!-- show-summary :summary-method="getSummaries" -->
    <el-table :data="teamData"  style="width: 100%;" class="table_th_center" id="table-content">
      <el-table-column type="index" :width="smallItemWidth-10" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="省市" :width="smallItemWidth+70" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="合计" :width="smallItemWidth+10" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" label="民警">
        <el-table-column prop="count1" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
        <el-table-column prop="age1" label="平均年龄" :width="smallItemWidth+20" align="center"></el-table-column>
        <el-table-column prop="" label="性别" align="center">
          <el-table-column prop="sex01" label="男" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="sex11" label="女" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="" label="学历" align="center">
          <el-table-column prop="culture11" label="研" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture21" label="本" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture31" label="专" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="辅警">
        <el-table-column prop="count2" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
        <el-table-column prop="age2" label="平均年龄" :width="smallItemWidth+20" align="center"></el-table-column>
        <el-table-column prop="" label="性别" align="center">
          <el-table-column prop="sex02" label="男" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="sex12" label="女" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="" label="学历" align="center">
          <el-table-column prop="culture12" label="研" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture22" label="本" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture32" label="专" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="工勤">
        <el-table-column prop="count3" label="数量" :width="smallItemWidth+10" align="center"></el-table-column>
        <el-table-column prop="age3" label="平均年龄" :width="smallItemWidth+20" align="center"></el-table-column>
        <el-table-column prop="" label="性别" align="center">
          <el-table-column prop="sex03" label="男" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="sex13" label="女" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="" label="学历" align="center">
          <el-table-column prop="culture13" label="研" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture23" label="本" :width="smallItemWidth" align="center"></el-table-column>
          <el-table-column prop="culture33" label="专" :width="smallItemWidth" align="center"></el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>

  </section>
</template>

<script>
// import { getajzbList } from '@/utils/anzbList'
export default {
  name: 'exportanjtb',
  data() {
    return {
      smallItemWidth: 70, // 表格最小格子的宽度
      // tableData: getajzbList(),
      teamData: [],
      fileName: '队伍基本情况统计表' // xlsx文件标题
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    print() {
      const _that = this
      var tables = document.getElementById('table-content')
      tables.getElementsByClassName('el-table__header')[0].border = '1'
      tables.getElementsByClassName('el-table__body')[0].border = '1'
      this.removeTags('th', 'gutter')
      var html = "<html><head><meta charset='utf-8'/><style>table{font-size:16px;} td{text-align:center;height:25px;}</style></head><body>" + tables.outerHTML + '</body></html>'
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      var blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      var a = document.getElementsByTagName('a')[0]
      a.href = URL.createObjectURL(blob)
      // 设置文件名
      a.download = this.fileName + '.xls'
      setTimeout(() => {
        _that.goBack()
      }, 6000)
    },
    removeTags(tagName, tagClass) {
      var tagElements = document.getElementsByTagName(tagName)
      for (var m = 0; m < tagElements.length; m++) {
        if (tagElements[m].className === tagClass) {
          tagElements[m].parentNode.removeChild(tagElements[m])
        }
      }
    },
    goBack() { // 返回案件侦办统计表页
      this.$router.back(-1)
    }
  },

  mounted() {
    if (sessionStorage.getItem(this.$route.path)) {
      const param = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.teamData = param.data
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.exportTable {
  #table-content {
    margin-top: 10px;
  }
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  //修改表格边框颜色
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: none;
    border-right: 1px solid #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
}
</style>
