<template>
  <!-- 地市反馈 -->
  <div class="caseAssist_areaBack pubStyle">
    <div class="titlePub">
      <div slot="header" class="clearfix">
        <span class="letterSpc">{{title}}</span>
      </div>
    </div>
    <div style="overflow: auto;">
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="deptName" label="单位" align="center" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xsNum" label="线索总数（条）" width="160" align="center">
          <template slot-scope="scope">
            <span class="linkColor"  @click="toClueList(scope.row)" v-if="scope.row.xsNum && enableTo(scope.row, scope.$index)">{{scope.row.xsNum}}</span>
            <span v-else>{{scope.row.xsNum || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="线索核查核实情况（条）" align="center" show-overflow-tooltip>
          <el-table-column prop="cs" label="查实" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor" @click="toClueList(scope.row, '2')" v-if="scope.row.cs && enableTo(scope.row, scope.$index)">{{scope.row.cs}}</span>
              <span v-else>{{scope.row.cs || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cf" label="查否" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor" @click="toClueList(scope.row, '3')" v-if="scope.row.cf && enableTo(scope.row, scope.$index)">{{scope.row.cf}}</span>
              <span v-else>{{scope.row.cf || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="whc" label="未核查" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor" @click="toClueList(scope.row, '')" v-if="scope.row.whc && enableTo(scope.row, scope.$index)">{{scope.row.whc}}</span>
              <span v-else>{{scope.row.whc || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hcl" label="核查率" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.hcl || 0}} %
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="移送行政部门处理（次）" width="120" align="center"></el-table-column>
        <el-table-column label="侦办刑事案件" align="center" show-overflow-tooltip>
          <el-table-column prop="larqCount" label="立案（起）" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parqCount" label="破案（起）" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zhrys" label="抓获（人）" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xsjl" label="刑拘（人）" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pzdb" label="批捕（人）" width="120" align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="yjss" label="移诉（人）" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dhwd" label="捣毁窝点（个）" width="160" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sajz" label="涉案金额（万元）" width="160" align="center" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="score" label="评价打分" width="120" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.$index === listData.length - 1">
              -
            </span>
            <span v-else>
              <el-button v-if="$isViewBtn('100909') && enableDistributeClue(scope.row)" size="mini" title="线索分发"  type="primary" circle  @click="handleDistributeClue(scope.$index, scope.row)"><svg-icon icon-class="fenfa"></svg-icon></el-button>
              <el-button v-if="$isViewBtn('100910') && enableFeedBack(scope.row)" size="mini" title="反馈"  type="primary" circle  @click="handleFeedBack(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
              <el-button v-if="$isViewBtn('100911') && enableScore(scope.row)" size="mini" title="评价打分"  type="primary" circle  @click="handleScore(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
              <el-button v-if="scope.row.score !== undefined" size="mini" title="评价详情"  type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--<el-row>-->
      <!--<el-col :span="24" class="toolbar">-->
        <!--<el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"-->
            <!--:page-size="pageSize" :total="total" :current-page="page" style="float:right;">-->
        <!--</el-pagination>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!-- 评价打分 -->
    <el-dialog title="评价打分" :visible.sync="evaluateDialogVisible" :close-on-click-modal="false" class="evaluateForm">
      <el-form ref="evaluateForm" :rules="rules" :model="evaluateForm" size="small" label-width="90px">
        <el-form-item label="打分" prop="score">
          <el-rate v-model="evaluateForm.score"></el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="evaluate">
          <el-input v-model.trim="evaluateForm.commentText" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="save" class="saveBtn" :loading="btnLoading">完 成</el-button>
      </el-row>
    </el-dialog>

     <!-- 评价打分详情 -->
    <el-dialog title="评价详情" :visible.sync="evaluateDetailDialogVisible" :close-on-click-modal="false" class="evaluateForm">
      <el-form :model="evaluateDetailForm" size="small" label-width="90px">
        <el-form-item label="打分" prop="score">
          <el-rate v-model="evaluateDetailForm.score" disabled></el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="evaluate">
          <el-input v-model.trim="evaluateDetailForm.commentText" type="textarea" :rows="4" disabled maxlength="500"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分发线索-->
    <el-dialog title="分发线索" :visible.sync="clueDistributeDialogVisible" class="clueDistribute" :close-on-click-modal="false" @close="closeClueDialog">
      <distributeClue ref="distributeClue" @closeDialog="closeClueDialog" :assistStatus="info.status" :assistId="curAssistId" source="detail"></distributeClue>
    </el-dialog>
  </div>
</template>
<script>
import distributeClue from './distributeClue.vue'
export default {
  props: ['assistId', 'info', 'showType'],
  name: 'index',
  components: {
    distributeClue
  },
  data() {
    return {
      title: '',
      evaluateForm: { // 评价打分
        assistId: '',
        deptCode: '',
        score: 0,
        commentText: ''
      },
      evaluateDetailForm: { // 评价打分详情
        score: 0,
        commentText: ''
      },
      curUser: {},
      curDept: {},
      listData: [], // 地市线索协查战果反馈表
      listLoading: false, // 页面loading
      evaluateDialogVisible: false, // 评价打分弹出框
      evaluateDetailDialogVisible: false, // 评价打分弹出框
      btnLoading: false, // 评价打分按钮loading
      clueDistributeDialogVisible: false, // 是否显示分发线索弹出框
      updateOp: false,
      pageSize: 5,
      page: 1,
      total: 0,
      curAssistId: '', // 存储列表传递过来的id
      rules: {
        score: [ // 评价打分
          {
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请打分'))
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
    assistId(val) {
      this.curAssistId = val
      this.query(true)
    }
  },
  methods: {
    enableScore(row) {
      const curDate = new Date()
      const endDate = new Date(this.info.endDate)
      return (row.hcl === 100 || curDate > endDate) && row.parentCode === this.curDept.depCode
    },
    enableDistributeClue(row) {
      return row.deptCode === this.curDept.depCode && parseInt(row.parentType) <= 2 // && (String(this.info.status) === '5' || String(this.info.status) === '8')
    },
    enableFeedBack(row) {
      return row.deptCode === this.curDept.depCode // && (String(this.info.status) === '5' || String(this.info.status) === '8')
    },
    enableTo(row, index) {
      if (index === this.listData.length - 1) {
        return false
      }
      if (this.info.applyDeptCode === this.curDept.depCode) {
        return true
      }
      if (String(this.info.category) === '2') {
        if (this.info.auditDeptCode === this.curDept.depCode) {
          return true
        }
      }
      if (row.deptCode === this.curDept.depCode) {
        return true
      }
      if (row.parentCode === this.curDept.depCode) {
        return true
      }
      return false
    },
    init() {
      if (this.assistId) {
        this.curAssistId = this.assistId
      }
      this.query(true)
    },
    async getParentDept(paramCode) {
      const response = await this.$queryAsyns('hsyzparentdepart/' + paramCode, {}, 'upms')
      if (response.code === '000000') {
        return response.data.departCode
      }
    },
    findParentDept(paramCode) {
      const deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
      for (let i = 0; i < deptArr.length; i++) {
        const item = deptArr[i]
        if (item.depCode === paramCode) {
          return item
        }
      }
    },
    query(flag) {
      this.listLoading = true
      const param = {
        type: 1,
        assistId: this.curAssistId,
        parentCode: this.curDept.parentDepCode,
        pageSize: this.pageSize,
        pageNum: flag ? 1 : this.page
      }
      if (String(this.showType) === '2') {
        param.parentCode = this.curDept.depCode
      } else {
        param.curDeptType = this.curDept.depType === '4' ? this.findParentDept(this.curDept.depCode).parentCode : this.curDept.depType
      }
      this.$query('caseassistclue/detailCount', param).then((response) => {
        this.listLoading = false
        const arr = response.data
        for (let i = 0; i < arr.length - 1; i++) {
          const item = arr[i]
          const paramCode = item.deptCode
          const parentItem = this.findParentDept(paramCode)
          item.parentCode = parentItem.parentCode
          item.parentType = parentItem.depType
        }
        this.listData = arr
        this.total = response.data.totalCount
        this.total = response.data.length > 1 ? response.data.length - 1 : 0
        this.pageSize = response.data.pageSize
        if (String(this.showType) === '1') {
          if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
            this.$resetSetItem('assistT3', this.total) // 将总数存在session中
          } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 区县
            this.$resetSetItem('assistT5', this.total) // 将总数存在session中
          }
        } else {
          this.$resetSetItem('assistT5', this.total)
        }
      }).catch(() => {
        this.listLoading = false
        if (String(this.showType) === '1') {
          if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
            this.$resetSetItem('assistT3', 0) // 将总数存在session中
          } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 区县
            this.$resetSetItem('assistT5', 0) // 将总数存在session中
          }
        } else {
          this.$resetSetItem('assistT3', 0)
        }
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
      this.pageSize = val
      this.query(true)
    },
    toClueList(row, type) {
      const para = {
        id: this.curAssistId,
        type: type,
        assistType: '1',
        deptCode: '',
        cityCode: row.deptCode.substring(0, 6)
      }
      if (this.curDept.depType === '3' || String(this.showType) !== '1') {
        para.deptCode = row.deptCode
      }
      this.$router.push({ path: '/caseAssist/clueList', query: para })
    },
    handleDistributeClue(index, row) { // 线索分发
      this.clueDistributeDialogVisible = true
      if (this.$refs.distributeClue) {
        this.$refs.distributeClue.init()
      }
    },
    handleFeedBack(index, row) { // 线索反馈
      this.curRow = row
      let deptCode = ''
      if (row.deptCode !== this.info.applyDeptCode && this.curDept.depType !== '1') {
        deptCode = row.deptCode
      }
      this.$router.push({ path: '/caseAssist/clueFeedBackList', query: { id: this.curAssistId, deptCode: deptCode, assistType: 1 }}) // 跳转到线索反馈页
    },
    handleScore(index, row) { // 评价打分
      this.evaluateForm.assistId = this.curAssistId
      this.evaluateForm.deptCode = row.deptCode
      if (row.score !== undefined) {
        this.evaluateForm.score = row.score
        this.evaluateForm.commentText = row.commentText
      }
      this.evaluateDialogVisible = true
    },
    handleDetail(index, row) { // 评价详情
      this.evaluateDetailDialogVisible = true
      this.evaluateDetailForm = row
    },
    closeClueDialog(val) { // 关闭分发线索弹框
      if (val) {
        this.updateOp = true
      } else {
        this.clueDistributeDialogVisible = false
        if (this.updateOp || val !== undefined) {
          location.reload()
        }
      }
    },
    getSummaries(param) { // 总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = '--'
        }
      })
    },
    save() { // 保存
      this.$refs.evaluateForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$update('/caseAssist/appraise', this.evaluateForm).then((response) => {
            this.$message({
              message: '打分成功！',
              type: 'success',
              duration: 2000
            })
            this.btnLoading = false
            this.evaluateDialogVisible = false
            this.query(true)
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    cancel() {
      this.evaluateDialogVisible = false
      this.evaluateForm = {
        assistId: '',
        deptCode: '',
        score: 0,
        commentText: ''
      }
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    if (String(this.showType) === '1') {
      if (this.curDept.depType === '1' || this.curDept.depType === '2') { // 地市
        this.title = '地市'
      } else if (this.curDept.depType === '3' || this.curDept.depType === '4') { // 区县
        this.title = '区县'
      }
    } else {
      this.title = '区县'
    }
    this.title += '线索协查战果反馈表'
    this.init()
  }
}
</script>
<style>
  .caseAssist_areaBack .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .caseAssist_areaBack .el-table--border,
  .caseAssist_areaBack .el-table--group {
    border: 1px solid #2f627a;
  }
  .caseAssist_areaBack .el-table--border td {
    /*border-right: 1px solid #2f627a;*/
    border-right-color: #2f627a;
  }
  .caseAssist_areaBack .el-table--border::after,
  .caseAssist_areaBack .el-table--group::after {
    width: 0;
  }
  .caseAssist_areaBack .evaluateForm .el-dialog{
    width: 35%;
  }
  .caseAssist_areaBack .el-form{
    padding: 10px 20px;
  }
  .caseAssist_areaBack textarea{
    /*min-height: 80px;*/
  }
  .caseAssist_areaBack .clueDistribute .el-dialog{
    width: 80%;
    overflow: auto;
  }
  .caseAssist_areaBack .titlePub {
    font-size: 17px;
    padding: 6px 18px 16px 5px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url(/static/image/personFile_images/titlePub.png) no-repeat center
    center;
    background-size: 100% 65%;
  }
  .caseAssist_areaBack .titlePub .letterSpc {
    letter-spacing: 3px;
  }
  @media only screen and (max-width: 1367px) {
    .caseAssist_areaBack .clueDistribute .el-dialog {
      width: 85%;
    }
  }
  @media only screen and (max-width: 1367px) {
    .caseAssist_areaBack .titlePub .titlePub {
      padding: 6px 3px 16px 5px;
    }
  }
</style>
