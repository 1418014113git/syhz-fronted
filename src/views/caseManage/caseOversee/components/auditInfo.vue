<template>
  <section>
    <!-- 审核信息 -->
    <div class="auditInfo">
      <title-pub :title="title" url=""></title-pub>
      <el-table :data="shDataList" style="width: 100%;" v-loading="loading" class="table_th_center">
        <el-table-column type="index" label="序号" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column prop="applyDepartName" label="申请部门"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyUserName" label="申请人" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyDate" label="申请时间" width="170" align="center"></el-table-column>
        <el-table-column prop="superviseLevel" label="督办级别" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictName(scope.row.superviseLevel+'','dbjb')}}
          </template>
        </el-table-column>
        <el-table-column prop="auditDepartName" label="审核部门" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditUserName" label="审核人" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="170" align="center"></el-table-column>
        <el-table-column prop="flowStatus" label="审核状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictName(scope.row.flowStatus+'','dbajzt')}}
          </template>
        </el-table-column>
        <el-table-column prop="auditContent" label="审核意见" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button  v-if="$isViewBtn('100813')&&scope.row.auditDeptCode === deptInfo.depCode && scope.row.flowStatus==='1'"
              title="审核" size="mini" type="primary" @click="handlerAudit(scope.$index, scope.row)" circle><svg-icon icon-class="audit"></svg-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"  :page-sizes="[5,10,15,20]"  @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
      <el-dialog title="审核" :visible.sync="isShowshDialog" @close="closeDialog" class="stshForm" :close-on-click-modal="false">
        <audit-com :dsh="curAudit" :dbId="db_Id" ref="auditForm" @closeDialog="closeDialog"></audit-com>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import auditCom from './auditCom' // 审核弹框
import titlePub from './titlePub'
export default {
  props: ['dbId'],
  name: 'index',
  components: {
    titlePub,
    auditCom
  },
  data() {
    return {
      title: '审核信息',
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      db_Id: '',
      shDataList: [], // 审核数据
      curAudit: {}, // 当前行的审核
      isShowshDialog: false, // 审核弹框
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: {
    dbId(val) {
      this.initData() // 初始化数据
      if (val) {
        this.db_Id = val
        this.init(true)
      }
    }
  },
  methods: {
    init(flag) {
      if (this.dbId) {
        this.loading = true
        this.db_Id = this.dbId
        this.$query('page/casesuperviseaudit', { id: this.db_Id }).then((response) => {
          if (response.code === '000000') {
            this.loading = false
            this.shDataList = response.data.list
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    initData() { // 初始化数据
      this.dataList = []
      this.page = 1
      this.total = 0
      this.pageSize = 5
    },
    formatTime(time) {
      return this.$handlerDateTime(time)
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.init()
    },
    handlerAudit(index, row) { // 审核
      this.curAudit = row
      this.isShowshDialog = true
    },
    closeDialog() { // 关闭弹框
      if (this.$refs.auditForm) {
        this.$refs.auditForm.resetForm('auditForm')
      }
      this.isShowshDialog = false // 下发催办弹框隐藏
    }
  },
  mounted() {
    this.init(true)
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.auditInfo {
  width: 100%;
  border: 2px solid #00a0e9;
  padding: 0 8px 8px 8px;
  border-radius: 8px;
}
</style>
