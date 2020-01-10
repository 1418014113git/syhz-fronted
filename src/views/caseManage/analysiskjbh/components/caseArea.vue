<template>
  <section class="ajrlStatistical">
   <!--发案地域案件统计-->
    <p class="comTit">
      发案地域案件统计
      <el-popover
      class="zbts"
      placement="right"
      width="350"
      trigger="hover">
        <div>
          <span>根据查询条件统计不同地区、不同发案地域案件数量</span>
        </div>
        <el-button  type="primary" size="mini" circle  slot="reference"><svg-icon icon-class="wenhao1"></svg-icon></el-button>
      </el-popover>
      <img src="/static/image/download.png" alt=""  title="下载"  class="download"  v-show="caseData.length>0"   @click="download">
    </p>

    <!--列表-->
    <el-table :data="caseData" v-loading="listLoading"  ref="table" style="width: 100%;margin-top:15px;"  :row-key='getRowKeys'  :expand-row-keys="expandstab"  @expand-change="handleExpand"
    :row-class-name="getRowClass">
      <!-- 只有总队可以展开 -->
      <el-table-column type="expand" v-if="curDept.depType === '1'">
        <template slot-scope="scope">
          <el-table :data="scope.row.subDeptCaseData" v-loading="subLoading" style="width: 100%;">
            <el-table-column prop="" width="48"></el-table-column>
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="orgName" label="单位" min-width="10%" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="chengqu" label="城区" min-width="6%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.chengqu>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'城区','second')">{{$thousSplit(sonScope.row.chengqu+'')}}</span>
                <span v-else >{{sonScope.row.chengqu}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jiaoqu" label="郊区" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.jiaoqu>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'郊区','second')">{{$thousSplit(sonScope.row.jiaoqu+'')}}</span>
                <span v-else >{{sonScope.row.jiaoqu}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="zheng" label="镇" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.zheng>0" :class="sonScope.row.canClickSon?'linkColor':''"  @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'镇','second')">{{$thousSplit(sonScope.row.zheng+'')}}</span>
                <span v-else >{{sonScope.row.zheng}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="xiangcun" label="乡村" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.xiangcun>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'乡村','second')">{{$thousSplit(sonScope.row.xiangcun+'')}}</span>
                <span v-else >{{sonScope.row.xiangcun}}</span>
              </template>
            </el-table-column>
             <el-table-column prop="linqu" label="林区" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.linqu>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'林区','second')">{{$thousSplit(sonScope.row.linqu+'')}}</span>
                <span v-else >{{sonScope.row.linqu}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="other" label="其他" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.other>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'其他','second')">{{$thousSplit(sonScope.row.other+'')}}</span>
                <span v-else >{{sonScope.row.other}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="总计" min-width="5%" align="center">
              <template slot-scope="sonScope">
                <span v-if="sonScope.row.total>0" :class="sonScope.row.canClickSon?'linkColor':''" @click="linkAjcx(sonScope.row.canClickSon,sonScope.row,'','second')">{{$thousSplit(sonScope.row.total+'')}}</span>
                <span v-else >{{sonScope.row.total}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index+1<caseData.length">{{scope.$index+1}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" :label="curDept.depType === '1' ? '地市' : '单位'"  min-width="10%" align="center"></el-table-column>
      <el-table-column prop="chengqu" label="城区" min-width="6%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.chengqu>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'城区','first')">{{$thousSplit(scope.row.chengqu+'')}}</span>
          <span v-else >{{scope.row.chengqu}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jiaoqu" label="郊区" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.jiaoqu>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'郊区','first')">{{$thousSplit(scope.row.jiaoqu+'')}}</span>
          <span v-else >{{scope.row.jiaoqu}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="zheng" label="镇" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.zheng>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'镇','first')">{{$thousSplit(scope.row.zheng+'')}}</span>
          <span v-else >{{scope.row.zheng}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="xiangcun" label="乡村" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.xiangcun>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'乡村','first')">{{$thousSplit(scope.row.xiangcun+'')}}</span>
          <span v-else >{{scope.row.xiangcun}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="linqu" label="林区" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.linqu>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'林区','first')">{{$thousSplit(scope.row.linqu+'')}}</span>
          <span v-else >{{scope.row.linqu}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="other" label="其他" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.other>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'其他','first')">{{$thousSplit(scope.row.other+'')}}</span>
          <span v-else >{{scope.row.other}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计" min-width="5%" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.total>0" :class="scope.row.canClick?'linkColor':''" @click="linkAjcx(scope.row.canClick,scope.row,'','first')">{{$thousSplit(scope.row.total+'')}}</span>
          <span v-else>{{scope.row.total}}</span>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  props: ['queryData', 'queryParam'],
  data() {
    return {
      expandstab: [], // 设置当前的展开行
      listLoading: false, // 列表加载loading
      subLoading: false, // 子列表loading
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curParam: {}, // 存储查询参数
      caseData: [], // 一级列表数据
      subDeptCaseData: [], // 展开项列表数据
      systemTime: '', // 当前系统时间
      tableHeight: null,
      fileName: '发案地域案件统计表' // xlsx文件标题
    }
  },
  watch: {
    queryParam(val) {
      this.curParam = val
    },
    queryData(val) {
      this.getSysTime()
      this.caseData = val
    }
  },
  methods: {
    getRowClass(row) {
      if (row.row.total === 0 || !row.row.canExpand) {
        return 'row-expand-cover'
      }
    },

    handleExpand(row, expands) {
      if (expands.length) {
        this.expandstab = []
        if (row) {
          this.expandstab.push(row.orgCode)
          this.querySubDeptCaseData(row) // 查询展开项里的数据
        } else {
          this.expandstab = []
        }
      }
    },

    querySubDeptCaseData(row) { // 查询展开项里的数据
      this.expands = [] // 初始化所有行不展开
      this.subLoading = true
      const para = JSON.parse(JSON.stringify(this.curParam))
      para.deptType = 2 // 部门类型
      para.deptCode = row.orgCode // 区域code
      this.$queryPost('ajfxyp/dataList', para).then((response) => {
        if (response.code === '000000') {
          this.subLoading = false
          if (response.data.zhuAndTableData.length > 0) {
            this.subDeptCaseData = response.data.zhuAndTableData
            for (let index = 0; index < this.subDeptCaseData.length; index++) {
              const element = this.subDeptCaseData[index]
              if (this.curDept.depType === '1') { // 总队
                element.canClickSon = true // 可点击跳转
              } else if (this.curDept.depType === '2') { // 地市支队
                element.canClickSon = true // 可点击跳转
              } else if ((this.curDept.depType === '3' && element.orgCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4)) || (this.curDept.depType === '4' && element.orgCode.substring(0, 4) === this.curDept.areaCode.substring(0, 4))) { // 区县只能点击自己
                element.canClickSon = true // 可点击跳转
              } else {
                element.canClickSon = false // 不可点击
              }
              this.$set(this.subDeptCaseData, index, element)

              if (this.caseData && this.caseData.length > 0) {
                for (let i = 0; i < this.caseData.length; i++) {
                  const item = this.caseData[i]
                  if (item.orgCode.substring(0, 4) === row.orgCode.substring(0, 4)) {
                    item.subDeptCaseData = this.subDeptCaseData
                  }
                }
              }
            }
          }
        }
      }).catch(() => {
        this.subLoading = false
      })
    },
    buildTime(para) {
      const systemDate = new Date(this.systemTime)
      let startTime = ''
      let endTime = ''
      if (this.curParam.selectDateType === 'year') { // 本年
        startTime = systemDate.getFullYear() + '-01-01 00:00:00'
        const day = new Date(systemDate.getFullYear(), 12, 0)
        endTime = systemDate.getFullYear() + '-12-' + day.getDate() + ' 23:59:59'
      }
      if (this.curParam.selectDateType === 'quarter') { // 本季
        if (systemDate.getMonth() + 1 <= 3) {
          startTime = systemDate.getFullYear() + '-01-01 00:00:00'
          endTime = systemDate.getFullYear() + '-03-31 23:59:59'
        } else if (systemDate.getMonth() + 1 > 3 && systemDate.getMonth() + 1 <= 6) {
          startTime = systemDate.getFullYear() + '-04-01 00:00:00'
          endTime = systemDate.getFullYear() + '-06-30 23:59:59'
        } else if (systemDate.getMonth() + 1 > 6 && systemDate.getMonth() + 1 <= 9) {
          startTime = systemDate.getFullYear() + '-07-01 00:00:00'
          endTime = systemDate.getFullYear() + '-09-30 23:59:59'
        } else if (systemDate.getMonth() + 1 > 9 && systemDate.getMonth() + 1 <= 12) {
          startTime = systemDate.getFullYear() + '-10-01 00:00:00'
          endTime = systemDate.getFullYear() + '-12-31 23:59:59'
        }
      }
      if (this.curParam.selectDateType === 'month') { // 本月
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-01 00:00:00'
        const day = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + day.getDate() + ' 23:59:59'
      }
      if (this.curParam.selectDateType === 'week') { // 本周
        systemDate.setDate(systemDate.getDate() - systemDate.getDay() + 1)
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 00:00:00'
        systemDate.setDate(systemDate.getDate() + 6)
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 23:59:59'
      }
      if (this.curParam.selectDateType === 'week') { // 本日
        startTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 00:00:00'
        endTime = systemDate.getFullYear() + '-' + (systemDate.getMonth() + 1) + '-' + systemDate.getDate() + ' 23:59:59'
      }
      para.startTime = startTime
      para.endTime = endTime
      // 赋当前时间
      return para
    },
    getSysTime() { // 查询当前系统时间
      this.$query('knowledge/queryTime').then(response => {
        this.systemTime = response.data
      })
    },
    linkAjcx(canClick, row, fadyName, level) { // 跳转到案件查询统计页
      if (!canClick) {
        return false
      }
      var param = {
        analysis: true, // 分析研判 跳转标识 传：true
        childFlag: this.curParam.Isinclude ? 'y' : 'n' // 是否统计子级
      }
      if (row.orgCode) { // 非合计行orgCode才有值
        if (this.curDept.depType === '1') { // 总队
          if (level === 'first') { // 一级
            param.areaCode = ['610000', row.orgCode] // 地市
          } else { // 展开项
            param.areaCode = ['610000', this.curDept.areaCode.substring(0, 4) + '00', row.orgCode] // 区县
          }
        } else if (this.curDept.depType === '2' || this.curDept.depType === '3') { // 支队查出来的是他下面的所有区县,大队查的是他自己的区县
          param.areaCode = ['610000', this.curDept.areaCode.substring(0, 4) + '00', row.orgCode] // 当前点击的orgCode
        } else if (this.curDept.depType === '4') { // 派出所
          if (this.curDept.areaCode === '611400') { // 杨凌例外
            param.areaCode = ['610000', '611400']
          } else { // 正常的派出所
            param.areaCode = ['610000', this.curDept.areaCode.substring(0, 4) + '00', row.orgCode]
          }
        }
      }

      if (fadyName) { // 发案地域汉字名称
        param.fadyName = fadyName
      }

      if (this.curParam.classfy) { // 案件分类
        param.syhFllb = this.curParam.classfy.split(',')
      }

      if (this.curParam.ajzt) { // 案件状态
        param.ajzt = this.curParam.ajzt
      }
      if (this.curParam.startTime) { // 自定义开始时间
        if (this.curParam.selectType === 'la') { // 立案日期
          param.larqStart = this.curParam.startTime
        } else { // 破案日期
          param.parqStart = this.curParam.startTime
        }
      }
      if (this.curParam.endTime) { // 自定义结束时间
        if (this.curParam.selectType === 'la') { // 立案日期
          param.larqEnd = this.curParam.endTime
        } else { // 破案日期
          param.parqEnd = this.curParam.endTime
        }
      }
      if (this.curParam.selectDateType && this.curParam.selectDateType !== 'other') {
        const para = this.buildTime({})
        if (this.curParam.selectType === 'la') { // 立案日期
          param.larqStart = para.startTime
          param.larqEnd = para.endTime
        } else { // 破案日期
          param.parqStart = para.startTime
          param.parqEnd = para.endTime
        }
      }
      this.$gotoid('/caseManage/caseList', JSON.stringify(param))
    },
    getRowKeys(row) {
      return row.orgCode
    },
    download() { // 下载
      const param = {
        data: this.caseData
      }
      this.$gotoid('/caseManage/casezbdownload', JSON.stringify(param))
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.expandstab = []
    this.curParam = this.queryParam
    if (this.queryData.length > 0) {
      this.getSysTime()
      this.caseData = this.queryData
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.ajrlStatistical {
  .el-table__expanded-cell {
    padding: 0;
  }
  .el-table__body-wrapper tbody
    .el-table__row:last-child
    .el-table__expand-icon {
    color: transparent;
  }

  //时间选择框disabled时的颜色
  .el-range-editor.is-disabled {
    background-color: rgba(0, 89, 130, 0.7);
    border-color: rgba(0, 160, 233, 0.6);
  }
  .el-range-editor.is-disabled input {
    background-color: transparent;
  }

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
  .datezhi {
    .el-form-item__label {
      text-align: center;
    }
  }
  .case-trend .card {
    margin-bottom: 20px;
  }
  .case-claim .el-table__expanded-cell {
    width: 500px;
    margin-left: 100px;
    padding: 0;
  }
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    text-decoration: underline;
  }
  .inputw {
    width: 220px;
  }
  .el-select .el-input--small .el-input__inner {
    height: 25px !important;
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
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
  .download{
    width: 23px;
    float: right;
    cursor: pointer;
    margin-right: 10px;
  }
}
@media only screen and (max-width: 1367px) {
}
</style>
