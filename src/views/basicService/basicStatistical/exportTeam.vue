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
    <el-table :data="teamData"  style="width: 100%;" class="table_th_center" id="table-content"
     ref="teamStatistical" :row-class-name="getRowClass">
      <el-table-column type="index" :min-width="smallItemWidth-10" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位机构':'省市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.canClickJump===true">{{scope.row.deptName}}</span>
          <span v-else>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ryNum" label="人员数量" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="avgAge" label="平均年龄" :min-width="smallItemWidth" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="" label="性别">
        <el-table-column prop="sex0" label="男" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="sex1" label="女" :min-width="smallItemWidth" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="政治面貌" align="center">
        <el-table-column prop="zzmm1" label="中共党员" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm3" label="共青团员" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm2" label="民主党派" :min-width="smallItemWidth+26" align="center"></el-table-column>
        <el-table-column prop="zzmm4" label="群众" :min-width="smallItemWidth+26" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="文化程度（学历）" align="center">
        <el-table-column prop="whcd1" label="研究生" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd3" label="本科" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd2" label="专科" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd4" label="高中" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd5" label="初中" :min-width="smallItemWidth+16" align="center"></el-table-column>
        <el-table-column prop="whcd6" label="小学" :min-width="smallItemWidth+16" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="" label="获得学位">
        <el-table-column prop="xw1" label="博士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw2" label="硕士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw3" label="学士" :min-width="smallItemWidth" align="center"></el-table-column>
        <el-table-column prop="xw4" label="无" :min-width="smallItemWidth" align="center"></el-table-column>
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
      smallItemWidth: 60, // 表格最小格子的宽度
      // tableData: getajzbList(),
      teamData: [],
      firstCanJump: false,
      fileName: '队伍基本情况统计表' // xlsx文件标题
    }
  },
  methods: {
    getRowClass(row) {
      if (row.row.cityName === '合计') { // 合计行 隐藏展开符号 和 序号
        return 'row-expand-cover'
      }
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
      var canClick = true // 判断 查全省的列表 还是 单位机构的列表
      if (this.teamData.length > 1) {
        if (this.teamData[0].cityName === this.teamData[1].cityName) { // 查的是同一个市
          canClick = true // 表头显示 单位机构
        } else { // 表头显示 省市
          canClick = false
        }
      } else {
        canClick = true // 表头显示 单位机构
      }
      for (let index = 0; index < this.teamData.length; index++) {
        const element = this.teamData[index]
        this.firstCanJump = canClick // 判断表头文字 true 表头文字显示单位机构，false省市
        element.canClickJump = canClick // 判断表格值 显示 cityName 还是 deptname
        if (element.cityName === '合计') {
          element.deptName = '合计'
          element.canClickJump = false // 合计 不能跳转
        }
      }
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
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  .row-expand-cover .xuhao .cell div {
    color: transparent;
  }
}
</style>
