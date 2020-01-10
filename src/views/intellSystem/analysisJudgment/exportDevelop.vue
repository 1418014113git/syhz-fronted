<template>
 <!--案件统计情况报表导出页-->
  <section class="exportTable">
    <el-row>
      <el-col style="margin-top:20px;">
        <el-button type="primary" icon="el-icon-download" @click="print" style="float:left;"><a>导出</a></el-button>
        <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
      </el-col>
    </el-row>
    <!--导出excel 案件数量统计-->
    <el-table v-if="param.tableType === '1'" :data="teamData"  style="width: 100%;" class="table_th_center" id="table-content"
      :row-key="getRowKeys" ref="teamStatistical" :row-class-name="getRowClass">
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位':'地市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- v-if="scope.row.canClickJump===true"  -->
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalList" label="立案">
        <el-table-column prop="z1l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            <span class="canClick" @click="goDeptStatistical(scope.row)">{{scope.row.totalList.z1l1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="z1l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z1l2}}
          </template>
        </el-table-column>
        <el-table-column prop="z1l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z1l3}}
          </template>
        </el-table-column>
        <el-table-column prop="z1l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z1l4}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="破案">
        <el-table-column prop="z2l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z2l1}}
          </template>
        </el-table-column>
        <el-table-column prop="z2l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z2l2}}
          </template>
        </el-table-column>
        <el-table-column prop="z2l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z2l3}}
          </template>
        </el-table-column>
        <el-table-column prop="z2l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z2l4}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="销案">
        <el-table-column prop="z3l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z3l1}}
          </template>
        </el-table-column>
        <el-table-column prop="z3l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z3l2}}
          </template>
        </el-table-column>
        <el-table-column prop="z3l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z3l3}}
          </template>
        </el-table-column>
        <el-table-column prop="z3l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z3l4}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="" label="结案">
        <el-table-column prop="z4l1" label="食品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z4l1}}
          </template>
        </el-table-column>
        <el-table-column prop="z4l2" label="药品" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z4l2}}
          </template>
        </el-table-column>
        <el-table-column prop="z4l3" label="环境" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z4l3}}
          </template>
        </el-table-column>
        <el-table-column prop="z4l4" label="总计" :min-width="smallItemWidth" align="center">
          <template slot-scope="scope">
            {{scope.row.totalList.z4l4}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="z5" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
            {{scope.row.totalList.z5}}
          </template>
      </el-table-column>
    </el-table>
    <!-- 案件状态统计 -->
    <el-table v-if="param.tableType === '2'" :data="caseStatusTable"  style="width: 100%;" class="table_th_center" id="table-content"
      :row-key="getRowKeys" ref="teamStatistical" :row-class-name="getRowClass">
      <el-table-column type="index" :width="smallItemWidth" label="序号" align="center" class-name="xuhao"></el-table-column>
      <el-table-column prop="cityName" :label="firstCanJump===true?'单位':'地市'" :min-width="smallItemWidth+70" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- v-if="scope.row.canClickJump===true" class="canClick" @click="goDeptStatistical(scope.row)" -->
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="z1" label="受理" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z1}}
        </template>
      </el-table-column>
      <el-table-column prop="z2" label="立案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z2}}
        </template>
      </el-table-column>
      <el-table-column prop="z3" label="破案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z3}}
        </template>
      </el-table-column>
      <el-table-column prop="z4" label="销案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z4}}
        </template>
      </el-table-column>
      <el-table-column prop="z5" label="转治安案件" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z5}}
        </template>
      </el-table-column>
      <el-table-column prop="z6" label="结案" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z6}}
        </template>
      </el-table-column>
      <el-table-column prop="z7" label="归档" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z7}}
        </template>
      </el-table-column>
      <el-table-column prop="z8" label="总计" :min-width="smallItemWidth" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalList.z8}}
        </template>
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
      param: {}, // 跳转的参数
      fileName: '案件数量统计' // xlsx文件标题
    }
  },
  methods: {
    getRowKeys(row) {
      return row.departCode
    },
    getRowClass(row) {
      if (row.row.cityName === '总计') { // 合计行 隐藏展开符号 和 序号
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
      this.param = JSON.parse(sessionStorage.getItem(this.$route.path))
      if (this.param.tableType === '1') {
        this.fileName = '案件数量统计'
        this.teamData = this.param.data
        var canClick = true // 判断 查全省的列表 还是 单位机构的列表
        if (this.teamData.length > 2) { // 有一行总计,所以要大于2
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
      } else {
        this.fileName = '案件状态统计'
        this.caseStatusTable = this.param.data
        var canClick1 = true // 判断 查全省的列表 还是 单位机构的列表
        if (this.caseStatusTable.length > 2) { // 有一行总计,所以要大于2
          if (this.caseStatusTable[0].cityName === this.caseStatusTable[1].cityName) { // 查的是同一个市
            canClick1 = true // 表头显示 单位机构
          } else { // 表头显示 省市
            canClick1 = false
          }
        } else {
          canClick1 = true // 表头显示 单位机构
        }
        for (let index = 0; index < this.caseStatusTable.length; index++) {
          const element = this.caseStatusTable[index]
          this.firstCanJump = canClick1 // 判断表头文字 true 表头文字显示单位机构，false省市
          element.canClickJump = canClick1 // 判断表格值 显示 cityName 还是 deptname
          if (element.cityName === '合计') {
            element.deptName = '合计'
            element.canClickJump = false // 合计 不能跳转
          }
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
