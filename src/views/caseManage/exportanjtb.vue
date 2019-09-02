<template>
 <!--案件统计情况报表导出页-->
  <section class="exportTable">
    <el-col style="padding-right:20px;">
      <el-button type="primary" icon="el-icon-upload2" @click="print"><a>导出</a></el-button>
      <!-- <el-button type="primary" @click="goBack">返回</el-button> -->
      <img src="@/assets/icon/back.png"  class="goBack" style="margin: 20px 0 0 15px;" @click="goBack">   <!--返回-->
    </el-col>

    <!--导出excel-->
    <el-table id="table-content" class="table-content" :data="tableData" style="width: 200%" border>
      <el-table-column type="index" width="50" label="序号"  align="center"></el-table-column>
        <el-table-column prop="cityName" label="市" width="102" align="center"></el-table-column>
        <el-table-column label="侦破刑事案件数" align="center" >
          <el-table-column prop="zpxs.food" label="食品"  width="60" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.solveCases.food>0">{{scope.row.solveCases.food}}</span>
              <span v-else >{{scope.row.solveCases.food}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="solveCases.drugs" label="药品"  width="60" align="center">
            <template slot-scope="scope">
              <span  v-if="scope.row.solveCases.drugs>0">{{scope.row.solveCases.drugs}}</span>
              <span  v-else>{{scope.row.solveCases.drugs}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="solveCases.environment" label="资源环境" width="60" align="center">
            <template slot-scope="scope">
              <span  v-if="scope.row.solveCases.environment>0">{{scope.row.solveCases.environment}}</span>
              <span  v-else>{{scope.row.solveCases.environment}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="solveCases.total" label="总案件数"  width="60" align="center"></el-table-column>
          <el-table-column prop="solveCases.integral" label="计分"  width="60" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="判决案件数" align="center" >
          <el-table-column  label="食品"  width="60" align="center" ></el-table-column>
          <el-table-column  label="药品"  width="60" align="center" ></el-table-column>
          <el-table-column  label="资源环境" width="60" align="center" ></el-table-column>
          <el-table-column  label="总案件数"  width="60" align="center" ></el-table-column>
          <el-table-column  label="计分"  width="60" align="center" ></el-table-column>
        </el-table-column>
        <el-table-column label="大案侦办" align="center">
          <el-table-column   label="侦破涉黑案件数"  width="70" align="center"></el-table-column>
            <el-table-column   label="侦破涉恶案件数"  width="70" align="center"></el-table-column>
          <el-table-column prop="supervises.superviseB1" label="侦破部督案件数"  width="70" align="center" >
            <template slot-scope="scope">
              <span  v-if="scope.row.supervises.superviseB1>0">{{scope.row.supervises.superviseB1}}</span>
              <span  v-else>{{scope.row.supervises.superviseB1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supervises.superviseB2" label="未侦破部督案件数"  width="70"  align="center" >
            <template slot-scope="scope">
              <span  v-if="scope.row.supervises.superviseB2>0">{{scope.row.supervises.superviseB2}}</span>
              <span  v-else>{{scope.row.supervises.superviseB2}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supervises.superviseT1" label="侦破厅督案件数"  width="70" align="center" >
            <template slot-scope="scope">
              <span  v-if="scope.row.supervises.superviseT1>0">{{scope.row.supervises.superviseT1}}</span>
              <span  v-else>{{scope.row.supervises.superviseT1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supervises.superviseT2" label="未侦破厅督案件数" width="70"  align="center" >
            <template slot-scope="scope">
              <span  v-if="scope.row.supervises.superviseT2>0">{{scope.row.supervises.superviseT2}}</span>
              <span  v-else>{{scope.row.supervises.superviseT2}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supervises.integral" label="计分"  width="60" align="center" >
            <template slot-scope="scope">
              <span>{{scope.row.supervises.integral}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="打击处理人员情况" align="center">
          <el-table-column label="逮捕人数" align="center">
            <el-table-column prop="handle.arrestFood" label="食品" width="60"  align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.arrestFood>0">{{scope.row.handle.arrestFood}}</span>
                <span  v-else>{{scope.row.handle.arrestFood}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.arrestDrugs" label="药品" width="60"  align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.arrestDrugs>0">{{scope.row.handle.arrestDrugs}}</span>
                <span  v-else>{{scope.row.handle.arrestDrugs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.arrestEnvironment" label="资源环境" width="60"  align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.arrestEnvironment>0">{{scope.row.handle.arrestEnvironment}}</span>
                <span  v-else>{{scope.row.handle.arrestEnvironment}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.arrestTotal" label="合计"  width="60" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="起诉人数" align="center">
            <el-table-column prop="handle.sueFood" label="食品" width="60"  align="center" >
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.sueFood>0">{{scope.row.handle.sueFood}}</span>
                <span  v-else>{{scope.row.handle.sueFood}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.sueDrugs" label="药品" width="60"  align="center" >
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.sueDrugs>0">{{scope.row.handle.sueDrugs}}</span>
                <span  v-else>{{scope.row.handle.sueDrugs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.sueEnvironment" label="资源环境" width="60"  align="center" >
              <template slot-scope="scope">
                <span  v-if="scope.row.handle.sueEnvironment>0">{{scope.row.handle.sueEnvironment}}</span>
                <span  v-else>{{scope.row.handle.sueEnvironment}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="handle.sueTotal" label="合计"  width="60" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="handle.integral" label="计分"  width="60" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="全国性案件协查数" align="center">
          <el-table-column label="发起" align="center">
            <el-table-column prop="nationalAssist.launchFood" label="食品"  width="60" align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.nationalAssist.launchFood>0">{{scope.row.nationalAssist.launchFood}}</span>
                <span  v-else>{{scope.row.nationalAssist.launchFood}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nationalAssist.launchDrugs" label="药品"  width="60" align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.nationalAssist.launchDrugs>0">{{scope.row.nationalAssist.launchDrugs}}</span>
                <span  v-else>{{scope.row.nationalAssist.launchDrugs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nationalAssist.launchTotal" label="合计" width="60"  align="center"></el-table-column>
            <el-table-column prop="nationalAssist.launchIntegral" label="计分" width="60"  align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="不按要求核查反馈" align="center">
            <el-table-column prop="noFeedBacks.noFBFood" label="食品"  width="60" align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.noFeedBacks.noFBFood>0">{{scope.row.noFeedBacks.noFBFood}}</span>
                <span  v-else>{{scope.row.noFeedBacks.noFBFood}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="noFeedBacks.noFBDrugs" label="药品"  width="60" align="center">
              <template slot-scope="scope">
                <span  v-if="scope.row.noFeedBacks.noFBDrugs>0">{{scope.row.noFeedBacks.noFBDrugs}}</span>
                <span  v-else>{{scope.row.noFeedBacks.noFBDrugs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="noFeedBacks.noFBTotal" label="合计" width="60"  align="center"></el-table-column>
            <el-table-column prop="noFeedBacks.noFBIntegral" label="计分" width="60"  align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="total" label="总分" width="60"  align="center"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getajzbList } from '@/utils/anzbList'
export default {
  name: 'exportanjtb',
  data() {
    return {
      tableData: getajzbList(),
      fileName: '案件侦办、打击处理和全国性协查情况统计表' // xlsx文件标题
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
    goBack() { // 返回案件侦办统计表页
      this.$router.back(-1)
    }
  },

  mounted() {
    const param = JSON.parse(sessionStorage.getItem(this.$route.path))
    this.fileName = param.title
    this.tableData = param.data
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.exportTable {
  .table-content{
    margin-top: 20px;
  }
 .el-table__header-wrapper {
    border-bottom: 1px solid #fff;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }
  .el-table--border {
    border: 1px solid #ebeef5;
  }
  .el-year-table td .cell {
    color: #fff !important;
  }
  .el-button{
    margin:  20px 0 20px 20px;
  }
}
</style>
