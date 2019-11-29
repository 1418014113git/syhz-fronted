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
        </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table :data="listData" v-loading="listLoading" ref="multipleTable" style="width: 100%;overflow:auto;" max-height="490">
      <el-table-column type="index" width="60" label="序号" ></el-table-column>
      <el-table-column prop="serialNumber"  label='线索序号'  min-width="100"></el-table-column>
      <el-table-column prop="receiveName"  label='接收单位'  min-width="250" show-overflow-tooltip >
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.receiveName)">{{scope.row.receiveName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qbxsCategory"  label='线索分类'  min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.qbxsCategory'>{{$getDictName(scope.row.qbxsCategory+'','fllb')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qbxsResult"  label='核查情况'  min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.qbxsResult'>{{$getDictName(scope.row.qbxsResult+'','qbxsfkzt')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="syajs"  label='移送（次）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="larqCount"  label='立案（起）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="parqCount"  label='破案（起）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="zhrys" label="抓获（人）"  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xsjl"  label='刑拘（人）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pzdb"  label='批捕（人）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="yjss" label="移诉（人）"   min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column  v-for="(item, index) in tableHead" :key="index" :label="item"   min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="rowClick(scope.row.data[index+1])">{{scope.row.data[index+1]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" title="反馈"  type="primary" icon="el-icon-edit-outline" circle   v-if="controlBtn(scope.row)"  @click="handleDetail(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

     <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-top:10px;">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange"
                     :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>

    <!--线索反馈详情弹出层-->
    <el-dialog title="反馈" :visible.sync="isShowfkDialog" @close="clearChildData">
      <cluefk-detail ref="ffchild" :isShowdialog="isShowfkDialog" :row="curRow"></cluefk-detail>
    </el-dialog>
  </section>
</template>
<script>
import CluefkDetail from './cluefkDetail' // 线索反馈详情
export default {
  name: 'cluefkList',
  components: {
    CluefkDetail
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
      total: 0,
      page: 1,
      pageSize: 15,
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {}, // 存储当前被点击行数据
      tableHeight: null,
      paramDeptCode: '', // 详情页传递过来的参数
      tableHead: [] // 表头
    }
  },
  methods: {
    query(flag, hand) { // 列表数据查询
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
          titles.forEach((item, index) => {
            if (index > 0) {
              this.tableHead.push(item) // 表头数据只取序号之后的
            }
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
    handleDetail(index, row) { // 详情
      if (!row.fbId) {
        this.$alert('该线索还未签收，请先前往详情页进行签收。', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {
            if (this.$route.query.assistType) { // 协查详情
              this.$gotoid('/caseAssist/detail', this.assistId)
            } else {
              this.$router.push({ path: '/jqCampaign/detail', query: { id: this.assistId }}) // 集群战役详情
            }
          }
        })
        return false
      }
      this.isShowfkDialog = true
      this.curRow = row
    },
    toback() { // 返回
      this.$router.back(-1)
    },
    rowClick(text) {
      this.$alert(text, '内容', {
        confirmButtonText: '关闭'
      })
    },
    controlBtn(row) { // 控制反馈按钮显示  只有本单位的才能显示反馈按钮
      return ((this.curDept.depType !== '4' && row.receiveCode === this.curDept.depCode) || (this.curDept.depType === '4' && row.receiveCode === this.curDept.parentDepCode))
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
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
}
</style>
