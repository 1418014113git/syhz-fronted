<template>
  <section>
    <!-- 催办信息 -->
    <div class="auditInfo">
      <div class="titleWrap">
        <div class="left">{{title}}</div>
        <div class="right">
          <!-- 【下发催办】，审核单位人员，案件督办状态为督办中、督办结束或评价打分时可下发催办给申请单位。 -->
          <el-button v-if="$isViewBtn('100816')&&dbInfo.superviseDepartCode===deptInfo.depCode&&(dbInfo.status===5||dbInfo.status===6||dbInfo.status===7)"
              type="primary" size="small" @click="handleXfcb">下发催办</el-button>
        </div>
      </div>
      <el-table :data="cbDataList" style="width: 100%;" v-loading="loading" max-height="156" class="table_th_center">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="urgentDeptName" label="催办部门"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="urgentPersonName" label="催办人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="urgedContent" label="催办内容"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate" label="催办时间"  width="170" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signUserName" label="签收人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signTime" label="签收时间" width="170" align="center"></el-table-column>
        <el-table-column prop="feedbackContent" label="反馈内容" width="170" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="feekbackTime" label="反馈时间" width="170" align="center"></el-table-column>
        <el-table-column prop="feedbackPersonName" label="反馈人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="催办状态"  width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictName(scope.row.status+'','cbzt')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <!-- 0: {codeDesc: "催办状态", codeLx: "cbzt", dictName: "待签收", dictKey: "1"}
            1: {codeDesc: "催办状态", codeLx: "cbzt", dictName: "已签收", dictKey: "2"}
            2: {codeDesc: "催办状态", codeLx: "cbzt", dictName: "已反馈", dictKey: "3"} -->
            <el-button
              v-if="$isViewBtn('100817') && ((deptInfo.depType!=='4'&&scope.row.urgedDeptId === deptInfo.depCode)||(deptInfo.depType==='4'&&scope.row.urgedDeptId === deptInfo.parentDepCode))&& scope.row.status==='2'"
              title="反馈" size="mini" type="primary" @click="handlerFeedback(scope.$index, scope.row)" circle icon="el-icon-edit-outline"></el-button>
            <el-button
              v-if="$isViewBtn('100818') && ((deptInfo.depType!=='4'&&scope.row.urgedDeptId === deptInfo.depCode)||(deptInfo.depType==='4'&&scope.row.urgedDeptId === deptInfo.parentDepCode))&&scope.row.status==='1'"
              title="签收" size="mini" type="primary" @click="handlerUrgeSign(scope.$index, scope.row)" circle icon="el-icon-check"></el-button>
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
      <!-- 下发催办 -->
      <el-dialog title="下发催办" :visible.sync="xfcbDiaVisible" @close="closeXfcb">
        <issued-urge :bcbInfo="bcbData" ref="urgeForm" @closeDialog="closeDialog" @initList="init"></issued-urge>
      </el-dialog>
      <!-- 催办反馈 -->
      <el-dialog title="催办反馈" :visible.sync="cbfkDiaVisible">
        <el-form ref="feedbackForm" :rules="rules" :model="feedbackForm" size="small" label-width="100px">
          <el-form-item label="反馈内容" prop="content">
            <el-input v-model.trim="feedbackForm.content" type="textarea" :rows="3" clearable  maxlength="500" placeholder="最多输入500个字符" class="inputW"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button  class="cancelBtn" @click="feedBackCancel" :loading="btnLoading" style="margin-right:20px;">取消</el-button>
          <el-button  class="saveBtn" type="primary" @click="feedBackSubmit" :loading="btnLoading">反馈</el-button>
        </el-row>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import Bus from '@/utils/bus.js'
import titlePub from './titlePub'
import issuedUrge from './issuedUrge'
export default {
  props: ['cbData'],
  name: 'index',
  components: {
    titlePub,
    issuedUrge
  },
  data() {
    return {
      title: '催办信息',
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      cbDataList: [],
      dbInfo: {},
      curCbxx: {}, // 催办信息
      xfcbDiaVisible: false, // 下发催办
      cbfkDiaVisible: false, // 催办反馈
      feedbackForm: {}, // 催办反馈 表单
      btnLoading: false,
      bcbData: {}, // 被催办的信息
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入反馈内容'))
            } else {
              callback()
            }
          }
        }
        ]
      }
    }
  },
  watch: {
    cbData(val) {
      // this.loading = true
      this.initData() // 初始化数据
      if (val) {
        this.dbInfo = val
        this.init(true)
      }
    }
  },
  methods: {
    init(flag) {
      if (this.dbInfo) {
        this.bcbData = {
          urgedDeptCode: this.dbInfo.urgedDeptCode,
          urgedDeptId: this.dbInfo.urgedDeptId,
          urgedDeptName: this.dbInfo.urgedDeptName,
          urgedPersonId: this.dbInfo.urgedPersonId,
          urgedPersonName: this.dbInfo.urgedPersonName,
          superviseId: this.dbInfo.dbId // 督办id
        }
        this.loading = true
        var param = {
          id: this.dbInfo.dbId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
        this.$query('page/casesuperviseurgent', param).then((response) => {
          if (response.code === '000000') {
            this.loading = false
            this.cbDataList = response.data.list
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    initData() { // 初始化数据
      this.cbDataList = []
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
    handleXfcb() { // 下发催办
      this.xfcbDiaVisible = true
    },
    handlerFeedback(index, row) { // 反馈
      this.curCbxx = row // 当前行的催办信息
      this.cbfkDiaVisible = true
    },
    handlerUrgeSign(index, row) { // 签收
      this.loading = true
      const req = {
        id: row.id,
        dbId: row.dbId,
        cbId: row.cbId,
        signUserId: this.userInfo.id,
        updateUserId: this.userInfo.id,
        status: 2,
        userId: this.userInfo.id,
        userName: this.userInfo.realName,
        type: 1 // 签收
      }
      this.$update('dbcbaccept/' + row.id, req).then((response) => {
        if (response.code === '000000') {
          this.$alert('<p><i class="el-icon-success" style="color:#67c23a;margin-right:20px;font-size:20px;"></i><span style="font-size:16px;">签收催办成功</span></p><p style="margin-left:40px;color:#dedede;">请尽快对该催办进行反馈</p>', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '知道了'
          })
          this.init()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    feedBackCancel() { // 反馈--取消
      this.resetForm('feedbackForm') // 重置表单
      this.cbfkDiaVisible = false
    },
    closeDialog() { // 关闭弹框
      this.xfcbDiaVisible = false // 下发催办弹框隐藏
    },
    closeXfcb() {
      // this.closeDialog()
      if (this.$refs.urgeForm) {
        this.$refs.urgeForm.cancelDialog()
      } else {
        this.xfcbDiaVisible = false // 下发催办弹框隐藏
      }
    },
    feedBackSubmit() { // 反馈--确认
      this.$refs.feedbackForm.validate(valid => {
        if (valid) {
          const req = {
            id: this.curCbxx.id,
            dbId: this.curCbxx.dbId,
            cbId: this.curCbxx.cbId,
            feedbackContent: this.feedbackForm.content,
            status: 3,
            userId: this.userInfo.id,
            userName: this.userInfo.realName,
            type: 2 // 反馈
          }
          this.$update('dbcbaccept/' + this.curCbxx.id, req).then((response) => {
            if (response.code === '000000') {
              this.$message({
                message: '提交成功', type: 'success'
              })
              this.cbfkDiaVisible = false
              this.resetForm('feedbackForm') // 重置表单
              this.init() // 刷新列表
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    }
  },
  created: function() { // 下发催办
    Bus.$on('xiafaCuiban', message => {
      // if (this.ajbh) {
      this.handleXfcb()
      // }
    })
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
