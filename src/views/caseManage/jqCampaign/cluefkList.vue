<template>
  <section class="cluefkList">
   <!--线索反馈-->
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    <el-form :inline="true"  ref="filters" label-width="90px" class="form">
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="接收单位">
          <el-input v-model="filters.receiveName" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="filters.address" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="核查情况">
          <el-select  v-model="filters.qbxsResult" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('qbxsfkzt')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-bottom: 0;">
        <el-form-item label="线索序号">
          <el-input v-model="filters.serialNumber" clearable placeholder="" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select  v-model="filters.qbxsCategory" size="small" placeholder="全部" clearable>
            <el-option :label="item.dictName" :value="item.dictKey" v-for="item in $getDicts('fllb')" :key="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query(true,true)">查询</el-button>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
          <el-button type="primary" size="small"  @click="allFeedback">批量反馈</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" ref="multipleTable" style="width: 100%;" :max-height="tableHeight" @select="handleselectRow" @select-all="handleselectAll">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="60" label="序号" ></el-table-column>
      <el-table-column prop="serialNumber"  label='线索序号'  min-width="100"></el-table-column>
      <el-table-column prop="receiveName"  label='接收单位'  min-width="250" show-overflow-tooltip >
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.receiveName)">{{scope.row.receiveName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qbxsCategory"  label='线索分类'  min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.qbxsCategory'>{{$getDictName(scope.row.qbxsCategory+'','fllb')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qbxsResult"  label='核查情况'  min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.qbxsResult'>{{$getDictName(scope.row.qbxsResult+'','qbxsfkzt')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ysxz"  label='移送（次）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="larqCount"  label='立案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="parqCount"  label='破案（起）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="zhrys" label="抓获（人）"  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xsjl"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="yjss" label="移诉（人）"   min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column  v-for="(item, index) in tableHead" :key="index" :label="item"   min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.data[index+1])">{{scope.row.data[index+1]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" title="反馈"  type="primary" icon="el-icon-edit-outline" circle   v-if="controlfkBtn(scope.row)"  @click="handlefkDetail(scope.$index, scope.row)"></el-button>
          <!-- <el-button size="mini" title="线索流转记录"  type="primary" circle    @click="handlelzDetail(scope.$index, scope.row)"><svg-icon icon-class="move"></svg-icon></el-button> -->
        </template>
      </el-table-column>
    </el-table>

     <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--线索反馈详情弹出层-->
    <el-dialog title="反馈" :visible.sync="isShowfkDialog" @close="clearChildData">
      <cluefk-detail ref="ffchild" :isShowdialog="isShowfkDialog"   @closeDialog="clearChildData"   @init="query(true)"  :row="curRow" :allRow="paramCheckiItem"></cluefk-detail>
    </el-dialog>

    <!--线索流转记录弹出层-->
    <el-dialog title="线索流转记录" :visible.sync="isShowlzrecord" class="xslzdialog">
      <cluelz-detail :isShowdialog="isShowlzrecord"  :row="curRow"></cluelz-detail>
    </el-dialog>
  </section>
</template>
<script>
import CluefkDetail from './cluefkDetail' // 线索反馈详情
import CluelzDetail from './cluelzDetail' // 线索流转记录
export default {
  name: 'cluefkList',
  components: {
    CluefkDetail,
    CluelzDetail
  },
  data() {
    return {
      filters: {
        receiveName: '', // 接收单位
        address: '', // 地址
        qbxsResult: '', // 核查情况
        serialNumber: '', // 线索序号
        qbxsCategory: '' // 分类
      },
      assistId: '', // 集群id
      listData: [], // 线索列表
      isShowfkDialog: false, // 是否显示详情弹框
      listLoading: false, // 列表加载loading
      isShowlzrecord: false, // 是否显示线索流转记录弹框
      total: 0,
      page: 1,
      pageSize: 15,
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null, // 列表外层容器的高度
      paramDeptCode: '', // 详情页传递过来的参数
      tableHead: [], // 表头
      checkItem: [], // 复选框中选中的列表项
      paramCheckiItem: {} // 传递给反馈详情页的复选框选中的列表项对象
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
      this.initData()
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        address: this.filters.address, // 地址
        receiveName: this.filters.receiveName,	// 接收单位
        qbxsResult: this.filters.qbxsResult, // 协查情况
        serialNumber: this.filters.serialNumber, //  序号
        qbxsCategory: this.filters.qbxsCategory, // 分类
        pageNum: this.page, // 页数
        pageSize: this.pageSize, // 条数
        deptCode: this.paramDeptCode,
        assistId: this.assistId, // 集群id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }

      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('caseassistclue/feedBackClues', para).then((response) => {
        this.listLoading = false
        if (response.data.list && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.listData = response.data.list // 列表
          var titles = response.data.titles // 表头
          this.tableHead = []
          titles.forEach((item, index) => {
            if (index > 0) {
              this.tableHead.push(item) // 表头数据只取序号之后的
            }
          })
          this.$nextTick(function() {
            this.memoryChecked() // 记忆复选框被选中的列表
          })
        } else {
          this.initData()
        }
      }).catch(() => {
        this.initData()
        this.listLoading = false
      })
    },
    initData() {
      this.page = 1
      this.total = 0
      this.pageSize = 15
      this.listData = []
      this.tableHead = []
      this.checkItem = []
      this.curRow = {}
      this.paramCheckiItem = {}
    },
    clearChildData() {
      this.isShowfkDialog = false
      this.$refs.ffchild.initData()
    },
    resetForm() { // 重置
      this.filters = {
        address: '', // 地址
        receiveName: '', // 接收单位
        qbxsResult: '', // 协查情况
        serialNumber: '', // 序号
        qbxsCategory: '' // 分类
      }
      this.deptCode = '' // 接收单位code
      this.acceptDeptName = '' // 接收单位名称
      this.initData()
      this.query(true)
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(true, true)
    },
    handlefkDetail(index, row) { // 反馈详情
      if (!row.fbId) {
        this.$confirm('该线索还未签收，请先前往详情页进行签收。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((action) => {
          if (this.$route.query.assistType) { // 协查详情
            this.$gotoid('/caseAssist/detail', this.assistId)
          } else {
            this.$router.push({ path: '/jqCampaign/detail', query: { id: this.assistId }}) // 集群战役详情
          }
        }).catch(() => {

        })
      } else {
        this.isShowfkDialog = true
        this.curRow = row
      }
    },
    handlelzDetail(index, row) { // 显示线索流转记录弹框
      this.isShowlzrecord = true
      this.curRow = row
    },
    closeDialog() { // 关闭线索流转记录弹框
      this.isShowlzrecord = false
    },
    toback() { // 返回
      this.$router.back(-1)
    },
    rowClick(text) {
      this.$alert(text, '内容', {
        confirmButtonText: '关闭'
      })
    },
    controlfkBtn(row) { // 控制反馈按钮显示  只有本单位的才能显示反馈按钮
      return ((this.curDept.depType !== '4' && row.receiveCode === this.curDept.depCode) || (this.curDept.depType === '4' && row.receiveCode === this.curDept.parentDepCode))
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      if (this.checkItem.length === 0 && selection.length > 0) {
        this.checkItem.push(row)
      } else {
        var checkItem_ = this.checkItem
        checkItem_.forEach((item) => {
          if (row.fbId === item.fbId) {
            this.removeByValue(this.checkItem, row.fbId)
          } else {
            if (!this.temp(row.fbId)) {
              this.checkItem.push(row)
            }
          }
        })
      }
    },
    handleselectAll(selection) { // 全选
      var allSelect = selection
      if (selection.length > 0) {
        var checkItem_1 = this.checkItem
        allSelect.forEach((item, index) => {
          checkItem_1.forEach((it, i) => {
            if (it.fbId !== item.fbId) {
              if (!this.temp(item.fbId)) {
                this.checkItem.push(item)
              }
            }
          })
        })
        if (this.checkItem.length === 0) {
          allSelect.forEach((item, i) => {
            this.checkItem.push(item)
          })
        }
      } else {
        this.listData.forEach((item) => {
          this.checkItem.forEach((it) => {
            if (item.fbId === it.fbId) {
              this.removeByValue(this.checkItem, item.fbId)
            }
          })
        })
      }
    },
    removeByValue(arr, val) { // 去重
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].fbId === val) {
          arr.splice(i, 1)
        }
      }
    },
    temp(id) {
      var checkId = []
      this.checkItem.forEach(item => {
        checkId.push(item.fbId)
      })

      if (checkId.indexOf(id) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 记忆函数
    memoryChecked() {
      var checkId = []
      this.checkItem.forEach(item => {
        checkId.push(item.fbId)
      })
      if (this.listData.length > 0) {
        this.listData.forEach((item, index) => {
          if (checkId.indexOf(item.fbId) !== -1) {
            if (this.$refs.multipleTable) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          } else {
            if (this.$refs.multipleTable) {
              this.$refs.multipleTable.toggleRowSelection(item, false)
            }
          }
        })
      }
    },
    allFeedback() { // 批量反馈
      var fkFlag = false
      var qbxsId = [] // 线索id
      var fkId = [] // 反馈id
      if (this.checkItem.length === 0) { // 未勾选反馈列表
        this.$message.error('请至少选择一条需要反馈的线索！')
        return false
      }
      this.checkItem.forEach(item => {
        fkId.push(item.fbId)
        qbxsId.push(item.qbxsId)
        if (item.qbxsResult !== 1) { // 存在已反馈过的线索
          fkFlag = true
        }
      })
      if (fkFlag) {
        this.$confirm('勾选的线索中，存在已经反馈的线索，若要继续进行批量反馈，原反馈内容将被替换，是否继续批量反馈？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isShowfkDialog = true // 显示反馈弹框
          this.curRow = {}
          this.paramCheckiItem = {
            qbxsId: qbxsId.join(','), // 线索id
            fbId: fkId.join(','), // 反馈id
            clusterId: this.assistId // 集群id
          }
        }).catch(() => {
          this.isShowfkDialog = false // 隐藏反馈弹框
          this.paramCheckiItem = {}
        })
      } else {
        this.isShowfkDialog = true // 显示反馈弹框
        this.curRow = {}
        this.paramCheckiItem = {
          qbxsId: qbxsId.join(','), // 线索id
          fbId: fkId.join(','), // 反馈id
          clusterId: this.assistId // 集群id
        }
      }
    }
  },
  mounted() {
    this.checkItem = []
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 320
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.$route.query.id) {
      this.assistId = this.$route.query.id
      this.paramDeptCode = this.$route.query.deptCode ? this.$route.query.deptCode : ''
      this.query(true)
    }
  },
  activated() {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.cluefkList{
  padding: 0 10px;
  .el-dialog{
    width: 82%;
    max-height: 80vh;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 10px 0 15px 20px;
  }
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .inputW{
    width: 400px;
  }
  .el-cascader-menu__item.is-disabled{
    background-color: transparent;
  }
  .tableBox{
    width: 100%;
    overflow: auto;
  }
  .xslzdialog{
     .el-dialog{
      width: 80%;
      max-height: 80vh;
      overflow: auto;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
