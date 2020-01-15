<template>
  <section>
    <!-- 审核信息 -->
    <div class="verifyInfo pubStyle">
      <title-pub :title="title"></title-pub>
      <div style="max-height:260px;overflow: auto;">
        <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="statisticCollect">
          <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
          <el-table-column prop="deptName" label="申请单位"  min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="申请人" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="acceptedTime" label="申请时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="acceptDeptName" label="审核单位" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateUser" label="审核人" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateTime" label="审核时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="wflowStatus" label="审核状态" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if='scope.row.wflowStatus'>{{$getDictName(scope.row.wflowStatus+'','flowStatus')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="审核意见" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作"  width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" title="重新申请"  type="primary" circle  v-if="controlcxsq(scope.row) && $isViewBtn('101901')" @click="handleApply(scope.$index, scope.row)"><svg-icon icon-class="shenqing"></svg-icon></el-button>
              <el-button size="mini" title="审核"  type="primary" circle  v-if="controlshbtn(scope.row) && $isViewBtn('101908')"  @click="handleVerify(scope.$index, scope.row)"><svg-icon icon-class="audit"></svg-icon></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row> -->

       <!-- 审核弹框-->
      <el-dialog title="审核" :visible.sync="isShowshDialog"  class="stshForm" :close-on-click-modal="false">
        <audit-com  :isShowDialog="isShowshDialog"  @closeDialog="closeshDialog" :id="clusterId"  :info="baseInfo" :row="curRow"></audit-com>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import auditCom from './auditCom' // 审核弹框
import Bus from '@/utils/bus.js'
export default {
  props: ['info'],
  name: 'index',
  components: {
    titlePub,
    auditCom
  },
  data() {
    return {
      title: '审核信息',
      baseInfo: {}, // 基础信息
      curUser: {},
      curDept: {},
      curRow: {},
      isShowshDialog: false, // 是否显示审核弹框
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 审核信息列表
      listLoading: false, // 页面loading
      pageSize: 5,
      page: 1,
      total: 0,
      clusterId: '' // 存储列表传递过来的id
    }
  },
  watch: {
    info(val) {
      if (val.clusterId) {
        this.clusterId = val.clusterId
        this.baseInfo = val
        this.query(true)
      }
    }
  },
  methods: {
    init() {
      if (this.info.clusterId) {
        this.clusterId = this.info.clusterId
        this.baseInfo = this.info
        this.query(true)
      }
    },
    query(flag) {
      this.listLoading = true
      var param = {
        id: this.clusterId
        // pageSize: this.pageSize,
        // pageNum: flag ? 1 : this.page
      }
      this.$query('casecluster/examineList', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        // this.listData = res.data.list
        // this.total = res.data.totalCount
        // this.pageSize = res.data.pageSize
        this.controlBtn(this.listData)
        this.$resetSetItem('t1', this.listData.length) // 将总数存在session中
      }).catch(() => {
        this.$resetSetItem('t1', 0) // 将总数存在session中
        Bus.$emit('isShowsqbtn', false)
        Bus.$emit('isShowshbtn', false)
        this.listLoading = false
        this.initData()
      })
    },
    controlcxsq(row) { // 重新申请按钮显隐控制
      return (((this.curDept.depType === '4' && this.curDept.parentDepId === row.createDeptId) || (this.curDept.depType !== '4' && this.curDept.id === row.createDeptId)) && row.wflowStatus + '' === '4')
    },
    controlshbtn(row) { // 审核按钮显隐控制
      return (Number(this.curDept.depType) < 3 && this.curDept.id === row.acceptedDeptId && row.wflowStatus === '1')
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的申请，审核按钮
      // Bus.$emit('isShowsqbtn', false)
      // Bus.$emit('isShowshbtn', false)
      if (data.length > 0) {
        data.forEach(item => {
          if (((this.curDept.depType === '4' && this.curDept.parentDepId === item.createDeptId) || (this.curDept.depType !== '4' && this.curDept.id === item.createDeptId)) && item.wflowStatus + '' === '4') { // 当前登录的是派出所时，用他的父级单位的id去判断  4：审核不通过
            Bus.$emit('isShowsqbtn', true) // 控制详情页上方的申请按钮显隐
          }
          if (Number(this.curDept.depType) < 3 && this.curDept.id === item.acceptedDeptId && item.wflowStatus + '' === '1') { // wflowStatus:审核状态  1: 待审核
            Bus.$emit('isShowshbtn', true) // 控制详情页上方的审核按钮显隐
            Bus.$emit('row', item)
          }
        })
      }
    },
    initData() {
      this.listData = []
      this.total = 0
      this.pageSize = 5
      this.page = 1
    },
    handleCurrentChange(val) { // 涉案信息
      this.page = val
      this.query(false)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false)
    },
    handleApply(index, row) { // 重新申请
      this.curRow = row
      this.$router.push({ path: '/jqCampaign/jqzyAdd', query: { type: 'detail', id: this.clusterId }}) // 跳转到集群战役申请页
    },
    handleVerify(index, row) { // 审核
      this.curRow = row
      this.isShowshDialog = true
    },
    closeshDialog(val) { // 关闭审核弹框 点击"通过/不通过"时，页面需要重新加载，更新审核状态。
      this.isShowshDialog = val
      location.reload()
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.verifyInfo{
  .stshForm{
    .el-dialog{
      width: 40%;
    }
    .el-form{
      padding: 10px 20px;
    }
  }
  // 固定左侧列的样式问题
  .el-table__fixed .el-table__fixed-body-wrapper .el-table__body tr:nth-child(odd){
    background-color: rgba(0, 89, 130, 1);
  }
  .el-table__fixed .el-table__fixed-body-wrapper .el-table__body tr:nth-child(even){
    background-color: #032c43;
  }
  .el-table__fixed .el-table__fixed-body-wrapper .el-table__body .el-table__body tr:hover>td{
    background-color: #2164a1;
  }
}
</style>
