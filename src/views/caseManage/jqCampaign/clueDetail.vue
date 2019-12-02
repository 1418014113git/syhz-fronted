<template>
  <section class="clueDetail">
   <!--线索列表详情-->
      <el-form label-width="120px" class="form" v-loading="listLoading">
        <el-form-item label="核查情况：">
          <span v-if="curRow.qbxsResult">{{ $getDictName(curRow.qbxsResult+'', 'qbxsfkzt') }}</span>
        </el-form-item>
        <el-form-item label="移送案件">
          <el-table :data="yslistData" v-loading="yslistLoading" style="width: 100%;" class="">
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column prop="ajmc" align="center" label='案件名称'  show-overflow-tooltip></el-table-column>
             <el-table-column prop="ajbh" align="center" label='案件编号'  show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajlbName" align="center" label='案件类别'  show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="侦办刑事案件">
          <el-table :data="zblistData" v-loading="zblistLoading" style="width: 100%;" class="">
            <el-table-column type="index" width="60" label="序号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.$index+1<zblistData.length">{{scope.$index+1}}</span>
                <span v-else>总计</span>
              </template>
            </el-table-column>
            <el-table-column prop="ajmc" align="center" label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh" align="center" label='案件编号'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.ajId)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajztName" align="center" label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="larq" align="center" label='立案日期'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parq" align="center" label='破案日期'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="zhrys"  label='抓获（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yjss" label="移诉（人）"   min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
  </section>
</template>
<script>
export default {
  props: ['row', 'isShowdialog'],
  name: 'clueDetail',
  data() {
    return {
      yslistData: [], // 移送案件列表
      zblistData: [], // 侦办刑事案件列表
      listLoading: false, // 页面加载loading
      yslistLoading: false, // 移送案件列表加载loading
      zblistLoading: false, // 侦办刑事案件列表加载loading
      xzqhOptions: [], // 行政区划数据
      deptOptions: [], // 部门数据
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      curRow: {} // 存储当前被点击行数据
    }
  },
  watch: { // 监听state状态变化
    row: {
      handler: function(val, oldeval) {
        if (val.fbId) { // 反馈id
          this.curRow = val
          this.detail() // 查详情
        }
      }
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        if (val) {
          this.initData()
        }
      }
    }
  },
  methods: {
    detail() { // 查详情
      this.listLoading = true
      const para = {
        assistId: this.curRow.clusterId, // 集群Id
        type: 'detail', // 操作类型
        fbId: this.curRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.listLoading = false
        if (response.data.zbxss && response.data.zbxss > 0) { // 查询侦办刑事案件列表接口
          this.queryzbxsaj() // 侦办刑事案件列表数据查询
        }
        if (response.data.syajs && response.data.syajs > 0) { // 查询移送案件案件接口
          this.queryysaj() // 移送案件列表数据查询
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryysaj() { // 移送案件列表数据查询
      this.yslistLoading = true
      const para = {
        assistId: this.curRow.clusterId, // 集群Id
        type: 'ys', // 操作类型
        fbId: this.curRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.yslistLoading = false
        this.yslistData = response.data
      }).catch(() => {
        this.yslistLoading = false
        this.yslistData = []
      })
    },
    queryzbxsaj() { // 侦办刑事案件列表数据查询
      this.zblistLoading = true
      const para = {
        assistId: this.curRow.clusterId, // 集群Id
        type: 'zb', // 操作类型
        fbId: this.curRow.fbId, // 反馈Id
        assistType: this.$route.query.assistType ? 1 : 2 // 1 协查， 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.zblistLoading = false
        this.zblistData = response.data.list
      }).catch(() => {
        this.zblistLoading = false
        this.zblistData = []
      })
    },
    initData() {
      this.curRow.qbxsResult = '' // 核查情况
      this.yslistData = [] // 移送案件列表
      this.zblistData = [] // 侦办刑事案件列表
    },
    toAjDetail(id) { // 跳转案件档案
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    }
  },
  mounted() {
    // this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    if (this.row.fbId) { // 反馈id
      this.curRow = this.row
      this.detail() // 查详情
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueDetail{
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
}
</style>
