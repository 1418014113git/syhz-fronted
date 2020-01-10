<template>
  <section class="casezbdownload">
   <!--发案地域案件统计列表下载页-->
   <el-col style="padding: 0 20px;margin-top: 10px;">
      <el-button type="primary" icon="el-icon-download" style="margin-top: 6px;" @click="downLoad"><a id="downLoad">下载</a></el-button>
      <img src="@/assets/icon/back.png"  class="goBack"  @click="goBack">  <!--返回-->
    </el-col>
    <!--列表-->
    <el-table :data="caseData"  id="table-content">
      <el-table-column type="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index+1<caseData.length">{{scope.$index+1}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" :label="curDept.depType === '1' ? '地市' : '单位'"  min-width="10%" align="center"></el-table-column>
      <el-table-column prop="chengqu" label="城区" min-width="6%" align="center"></el-table-column>
      <el-table-column prop="jiaoqu" label="郊区" min-width="5%" align="center"></el-table-column>
      <el-table-column prop="zheng" label="镇" min-width="5%" align="center"></el-table-column>
      <el-table-column prop="xiangcun" label="乡村" min-width="5%" align="center"></el-table-column>
      <el-table-column prop="linqu" label="林区" min-width="5%" align="center"></el-table-column>
      <el-table-column prop="other" label="其他" min-width="5%" align="center"></el-table-column>
      <el-table-column prop="total" label="总计" min-width="5%" align="center"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      caseData: [], // 列表数据
      curDept: {}, // 当前登录的部门
      fileName: '发案地域案件统计表' // xlsx文件标题
    }
  },
  methods: {
    downLoad() { // 下载
      const _that = this
      var tables = document.getElementById('table-content')
      tables.getElementsByClassName('el-table__header')[0].border = '1'
      tables.getElementsByClassName('el-table__body')[0].border = '1'
      this.removeTags('th', 'gutter')
      var html = "<html><head><meta charset='utf-8'/><style>table{font-size:16px;} td{text-align:center;height:25px;}</style></head><body>" + tables.outerHTML + '</body></html>'
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      var blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      var a = document.getElementById('downLoad')
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
    goBack() { // 返回发案地域案件统计页
      this.$router.back(-1)
    }
  },
  mounted() {
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    const param = JSON.parse(sessionStorage.getItem(this.$route.path))
    this.caseData = param.data
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.casezbdownload {

  table {
    border: 1px solid #2f627a;
    border-bottom: none;
  }
  thead th {
    border-right: 1px solid #2f627a;
  }
  .el-table__body td {
    border-right: 1px solid #2f627a;
    border-bottom: 1px solid #2f627a;
  }
  .el-table__body-wrapper tr:nth-child(even) {
    background-color: transparent;
  }
}
@media only screen and (max-width: 1367px) {
}
</style>
