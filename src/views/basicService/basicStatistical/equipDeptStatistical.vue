<template>
  <section class="equipDeptStatistical">
   <!--装备信息点击地市跳转过来查询改地市下的单位机构列表统计页面-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->

    <!--列表-->
    <el-table :data="tableData"  v-loading="listLoading" class="mainTable"   style="width: 100%;margin-top: 15px;"  :max-height="tableHeight"  :span-method="arraySpanMethod">
      <el-table-column label="单位机构" width="260" align="right" fixed>
				<el-table-column prop="label" label="配备项目" width="160"  show-overflow-tooltip>
          <template slot-scope="scope">
            <p style="text-align:center; margin:0;">
              <span>{{scope.row.label}} </span><br>
              <span style="color:#f72929;">{{getTypeName(scope.row.allocateType)}}</span>
            </p>
          </template>
        </el-table-column>
				<el-table-column prop="name" label="" width="100"  align="center" show-overflow-tooltip></el-table-column>
			</el-table-column>
      <el-table-column   v-for="(item,index) in tableHead" :key="index" :label="item.label"  align="center"  min-width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.nameType === 1"> <!--实配/应配-->
            <span  v-if="Number(scope.row.tableHead[index].sp) >0"   :class="(scope.row.tableHead[index].sp<scope.row.tableHead[index].yp)?'errorColor':'linkColor'"  @click="handleDetail(scope.row,scope.row.tableHead[index])">{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
            <span  v-else-if="Number(scope.row.tableHead[index].yp) >0" class="noClickerrorColor">{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
            <span  v-else>{{scope.row.tableHead[index].sp}}/{{scope.row.tableHead[index].yp}}</span>
          </span>
          <span v-else>
            <span class=""  v-if="scope.row.tableHead[index].gx>0">有</span>
            <span class=""  v-else>--</span>
          </span>
        </template>
      </el-table-column>
    </el-table>

  <!--装备信息明细弹框-->
  <el-dialog title="装备信息明细" :visible.sync="zbmxListDialog">
    <p class="mxTitle">{{mxTitle}}</p>
    <el-table :data="zbmxList"   v-loading="detailLoading" style="width: 100%;"  class="zbmxList" max-height="500">
      <el-table-column type="index" label="序号"  width="70">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseTime" label="采购日期"  min-width="120px">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.row.purchaseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detailNumber" label="配备数量">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{scope.row.detailNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipStatus" label="状态">
        <template slot-scope="scope">
          <span :class="{'noClickerrorColor':scope.row.equipStatus === 1}">{{getTypeStatus(scope.row.equipStatus)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'equipDeptStatistical',
  data() {
    return {
      listLoading: false, // 列表loading
      detailLoading: false, // 装备信息明细弹框页面loading
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储列表数字当前被点击行数据
      zbmxList: [], // 明细列表
      mxTitle: '', // 装备明细列表标题
      curTableHeadRow: {}, // 存储列表数字当前被点击行下的tableHead和列表tableHead对应索引的数据
      zbmxListDialog: false, // 是否显示装备信息明细弹框
      paramCityCode: '', // 存储地市列表跳转过来传递的cityCode
      tableHead: [], // 表头
      tableData: [], // 列表
      groupId: '',
      tableHeight: null // 列表最大高度
    }
  },
  methods: {
    query(hand) { // 列表数据查询
      this.listLoading = true
      const para = {
        provinceCode: '',
        departCode: '',
        cityCode: this.paramCityCode,
        groupId: this.groupId
      }
      if (this.paramCityCode === '610000') {
        para.departCode = '610000530000'
      }
      this.$update('basicequip/total', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.tableHead && response.data.tableData) {
          this.tableData = response.data.tableData // 列表
          this.tableHead = response.data.tableHead // 表头
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.listLoading = false
        this.tableData = []
      })
    },
    initData() {
      this.tableData = []
    },
    handleDetail(row, datas) { // 装备信息详情页
      this.curRow = row
      this.curTableHeadRow = datas
      this.mxTitle = datas.deptName + ' __ ' + this.curRow.label
      this.zbmxListDialog = true // 显示装备信息明细
      this.queryDetail(datas)
    },
    queryDetail(datas) { // 弹框详情查询
      this.detailLoading = true
      const para = {
        allocateId: datas.allocateId,
        belongDepCode: datas.deptCode,
        groupId: this.groupId
      }
      this.$query('basicequipdetail', para).then((response) => {
        this.detailLoading = false
        this.zbmxList = response.data
      }).catch(() => {
        this.detailLoading = false
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getTypeStatus(val) { // 根据配备状态获取中文名
      var name = ''
      if (val === 1) {
        name = '需要更新'
      } else if (val === 2) {
        name = '无需更新'
      } else if (val === 3) {
        name = '无更新要求'
      }
      return name
    },
    getTypeName(val) { // 获取配备项目类型，
      var name = ''
      if (val === 1) {
        name = '(必)'
      } else if (val === 2) {
        name = '(选)'
      }
      return name
    },
    toback() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - 180
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.$route.query.cityCode) {
      this.paramCityCode = this.$route.query.cityCode
      this.groupId = this.$route.query.groupId
      this.query() // 查询列表
    }
  },
  activated() {

  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.equipDeptStatistical{
  .editPerStatus .el-form{
    width: 85%;
    margin: 0 auto;
  }
  .tipText{
    margin: 8px 0;
  }
  .mxTitle{
    font-size: 16px;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  .el-icon-question{
    font-size: 17px;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }
  .el-table__expanded-cell {
    display: inherit;
    padding: 0;
  }
  //修改表格边框颜色
  .mainTable{
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
    .el-table__body-wrapper tr:nth-child(even),.el-table__body-wrapper tr:nth-child(odd) {
      background-color: #015281;
    }
    .el-table__fixed-body-wrapper {
      background: #015281;
    }
  }
  //表头左上角斜线样式
  .el-table thead.is-group th {
    background: none;
  }

  .el-table thead.is-group tr:first-of-type th:first-of-type {
    border-bottom: none;
  }

  .el-table thead.is-group tr:first-of-type th:first-of-type:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 180px;
    top: 0;
    left: 0;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-77deg);
    transform-origin: top;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(2):before {
    content: '';
    position: absolute;
    width: 1px;
    height: 102px;
    bottom: 0;
    right: 0;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-76.2deg);
    transform-origin: bottom;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(1):before {
    content: '';
    position: absolute;
    width: 1px;
    height: 28px;
    top: 0px;
    right: 26px;
    background-color: #7e7d7d;
    display: block;
    transform: rotate(-76deg);
    transform-origin: top;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(1) {
    border-right: none;
    position: relative;
  }

  .el-table thead.is-group tr:nth-of-type(2) th:nth-of-type(2) {
    border-left: none;
  }

  .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #2f627a;
  }

  .el-table--border, .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table__fixed-right-patch {
    border-bottom: 0 !important;
  }
  .el-table--border th.gutter:last-of-type {
    border-bottom: 0;
    border-bottom-width: 0;
  }
  .errorColor{
    color: #f72929;
    cursor: pointer;
  }
  .errorColor:hover{
    text-decoration:underline;
  }
  .noClickerrorColor{
    color: #f72929;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
.el-cascader--small {
  font-size: 16px;
}
</style>
