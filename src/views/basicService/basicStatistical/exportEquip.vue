<template>
 <!--装备信息导出页-->
  <section class="exportTable">
    <el-row>
      <el-col style="margin-top:20px;">
        <el-button type="primary" icon="el-icon-upload2" @click="print" style="float:left;"><a>导出</a></el-button>
        <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
      </el-col>
    </el-row>
    <!--导出excel-->
    <el-table :data="tableData" style="width: 100%;margin-top: 15px;"  :span-method="arraySpanMethod" id="table-content">
      <el-table-column width="60" type="index" label="序号" align="center">
         <template slot-scope="scope">
            <span v-if="scope.$index+1<tableData.length">{{scope.$index+1}}</span>
            <span v-else>合计</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaName" align="center" label="省市"   width="120" show-overflow-tooltip></el-table-column>
      <el-table-column   v-for="(item,index1) in tableHead" :key="index1" :label="item.label"  align="center">
        <el-table-column v-for="(it, index2) in item.children" :key="index2" :label="it.label" :prop="it.prop" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="it.label==='必配装备'" :class="{'redColor':(scope.row['value1'+it.groupId]<scope.row['value2'+it.groupId])}">{{scope.row[scope.column.property]}}</span>
            <span v-else-if="it.label==='有待更新'"  :class="{'redColor':(it.label==='有待更新'&& scope.row[scope.column.property]>0)}">{{scope.row[scope.column.property]}}</span>
            <span v-else>{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'exportEquip',
  data() {
    return {
      tableData: [], // 列表数据
      tableHead: [], // 表头数据
      fileName: '装备信息统计表' // xlsx文件标题
    }
  },
  methods: {
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 0) {
          // console.log('row', JSON.stringify(row))
          // this.$set(row, 'index', '合计')
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    goBack() { // 返回装备信息统计页
      this.$router.back(-1)
    }
  },

  mounted() {
    if (sessionStorage.getItem(this.$route.path)) {
      const param = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.tableHead = param.th
      this.tableData = param.list
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.exportTable{
  width: 97%;
  margin: 0 auto;
  #table-content {
    margin-top: 10px;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
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
    border-right: 1px solid #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
 .el-table__body-wrapper{
    tbody{
      tr:last-child{
        td:nth-child(1){
          // color: transparent;
          // border-right: 0;
        }
        td:nth-child(2){
          // text-align: left;
        }
      }
    }
  }
}
</style>
