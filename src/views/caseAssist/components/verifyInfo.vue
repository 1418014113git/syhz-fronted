<template>
  <section>
    <!-- 审核信息 -->
    <div class="caseAssist_verifyInfo pubStyle">
      <div class="titlePub">
        <div slot="header" class="clearfix">
          <span class="letterSpc">{{title}}</span>
        </div>
      </div>
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="statisticCollect" max-height="156">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="deptName" label="申请单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="申请人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="acceptedTime" label="申请时间"></el-table-column>
        <el-table-column prop="acceptDeptName" label="审核单位" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateUser" label="审核人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="审核时间"></el-table-column>
        <el-table-column prop="wflowStatus" label="审核状态">
          <template slot-scope="scope">
            <span v-if='scope.row.wflowStatus'>{{$getDictName(scope.row.wflowStatus+'','flowStatus')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="审核意见"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" title="重新申请" type="primary" circle v-if="reApplyEnable(scope.row)" @click="handleApply(scope.$index, scope.row)"><svg-icon icon-class="shenqing"></svg-icon></el-button>
            <el-button size="mini" title="审核" type="primary" circle v-if="auditEnable(scope.row)" @click="handleVerify(scope.$index, scope.row)"><svg-icon icon-class="audit"></svg-icon></el-button>
          </template>
        </el-table-column>
      </el-table>

       <!-- 审核弹框-->
      <el-dialog title="审核" :visible.sync="auditDialogVisible" class="auditForm" :close-on-click-modal="false">
        <audit-com ref="auditCom" @closeDialog="closeDialog" :assistId="curAssistId" :info="info" :row="curRow"></audit-com>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import auditCom from './auditCom' // 审核弹框
import Vue from 'vue'
export default {
  props: ['assistId', 'info'],
  name: 'index',
  components: {
    auditCom
  },
  data() {
    return {
      title: '审核信息',
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      curRow: {},
      auditDialogVisible: false,
      paramDept: sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : '',
      listData: [], // 审核信息列表
      listLoading: false, // 页面loading
      pageSize: 5,
      curAssistId: '',
      event: new Vue()
    }
  },
  watch: {
    assistId(val) {
      this.curAssistId = val
      this.query(true)
    }
  },
  methods: {
    reApplyEnable(row) {
      if (this.info.applyDeptCode === this.curDept.depCode && String(row.wflowStatus) === '4') {
        return true
      }
      return (((this.curDept.depType === '4' && this.curDept.parentDepId === row.createDept) || (this.curDept.depType !== '4' && this.curDept.id === row.createDept)) && String(row.wflowStatus) === '4')
    },
    auditEnable(row) {
      if (row.acceptedDeptId === this.curDept.id && String(row.wflowStatus) === '1') {
        this.event.$emit('assistRow', row)
        return true
      }
      return (Number(this.curDept.depType) < 3 && this.curDept.id === row.acceptDeptId && String(row.wflowStatus) === '1')
    },
    init() {
      if (this.assistId) {
        this.curAssistId = this.assistId
      }
      this.query(true)
    },
    query(flag) {
      this.listLoading = true
      const param = {
        id: this.curAssistId,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      this.$query('caseAssist/examineList', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        this.$resetSetItem('assistT1', this.listData.length) // 将总数存在session中
      }).catch(() => {
        this.$resetSetItem('assistT1', 0) // 将总数存在session中
        this.listLoading = false
        this.initData()
      })
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
      this.$gotoid('/caseAssist/edit')
    },
    handleVerify(index, row) { // 审核
      this.curRow = row
      this.curRow.cityNum = this.info.cityNum
      this.auditDialogVisible = true
      if (this.$refs.auditCom) {
        this.$refs.auditCom.setBaseInfo(this.info, this.curRow)
      }
    },
    closeDialog() {
      this.auditDialogVisible = false
      location.reload()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style>
  .caseAssist_verifyInfo .auditForm .el-dialog{
    width: 40%;
  }
  .caseAssist_verifyInfo .auditForm .el-form{
    padding: 10px 20px;
  }
  .caseAssist_verifyInfo .titlePub {
    font-size: 17px;
    padding: 6px 18px 16px 5px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url(/static/image/personFile_images/titlePub.png) no-repeat center
    center;
    background-size: 100% 65%;
  }
  .caseAssist_verifyInfo .titlePub .letterSpc {
    letter-spacing: 3px;
  }
  @media only screen and (max-width: 1367px) {
    .caseAssist_verifyInfo .titlePub .titlePub {
      padding: 6px 3px 16px 5px;
    }
  }
</style>
