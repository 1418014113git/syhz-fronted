<template>
  <section>
    <!-- 区县反馈 -->
    <div class="countyBack pubStyle">
      <title-pub :title="title"></title-pub>
      <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="" max-height="260">
        <el-table-column type="index" label="序号" width="60" >
          <template slot-scope="scope">
            <span v-if="scope.$index+1<listData.length">{{scope.$index+1}}</span>
            <span v-else>总计</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="单位"   min-width="180" show-overflow-tooltip></el-table-column>
         <el-table-column prop="xsNum" label="线索总数（条）" >
          <template slot-scope="scope">
            <span class="linkColor"  v-if="controlClick(scope.row)" @click="gotoxslist(scope.row, '')">{{scope.row.xsNum}}</span>
            <span>{{scope.row.xsNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="线索核查核实情况（条）"  show-overflow-tooltip>
          <el-table-column prop="cs" label="查实"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"  v-if="controlClick(scope.row)"  @click="gotoxslist(scope.row,'2')">{{scope.row.cs}}</span>
              <span>{{scope.row.cs}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cf" label="查否"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"  v-if="controlClick(scope.row)"  @click="gotoxslist(scope.row,'1')">{{scope.row.cf}}</span>
              <span>{{scope.row.cf}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="whc" label="未核查"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="linkColor"   v-if="controlClick(scope.row)" @click="gotoxslist(scope.row,'3')">{{scope.row.whc}}</span>
              <span>{{scope.row.whc}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hcl" label="核查率"  show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="ysajList" label="移送行政部门处理（次）" align="center"></el-table-column>
        <el-table-column prop="" label="侦办刑事案件"  show-overflow-tooltip>
          <el-table-column prop="larqCount" label="立案（起）"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="parqCount" label="破案（起）"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="dhwd" label="捣毁窝点（个）"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="xsjl" label="刑事拘留（人）"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="pzdb" label="批准逮捕（人）"   show-overflow-tooltip></el-table-column>
          <el-table-column prop="sajz" label="涉案金额（万元）"  show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column prop="commentText" label="评价打分" ></el-table-column>
        <el-table-column label="操作"  width="160" align="center">
          <template slot-scope="scope">
           <el-button size="mini" title="反馈"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfk(scope.row) && $isViewBtn('101910')"  @click="handlefankui(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
           <el-button size="mini" title="评价打分"  type="primary" circle  v-if="scope.$index+1<listData.length && curDept.depType === '2' && Number(baseInfo.status)>= 4 && $isViewBtn('101911')"  @click="handledafen(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
           <el-button size="mini" title="评价详情"  type="primary" v-if="scope.$index+1<listData.length && scope.row.score"   icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange"
              :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 评价打分 -->
      <el-dialog title="评价打分" :visible.sync="isShowpjdf" size="small" class="pjdfForm"  @close="cancel('pjdfForm')">
        <el-form ref="pjdfForm" :rules="rules" :model="pjdfForm" size="small" label-width="90px">
          <el-form-item label="打分" prop="score">
            <el-rate v-model="pjdfForm.score"></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="evaluate">
            <el-input v-model.trim="pjdfForm.evaluate" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button  @click="cancel('pjdfForm')"  class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save"  class="saveBtn" :loading="btnLoading">完 成</el-button>
        </el-row>
      </el-dialog>

       <!-- 评价打分详情 -->
      <el-dialog title="评价详情" :visible.sync="isShowpjdfdetail" size="small" class="pjdfForm">
        <el-form size="small" label-width="90px">
          <el-form-item label="打分" prop="score">
            <el-rate v-model="curRow.score" disabled></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="commentText">
            <el-input v-model.trim="curRow.commentText" type="textarea" :rows="4" disabled maxlength="500"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import Bus from '@/utils/bus.js'
export default {
  props: ['info'],
  name: 'countyBack',
  components: {
    titlePub
  },
  data() {
    return {
      title: '区县线索协查战果反馈表',
      pjdfForm: { // 评价打分
        score: 0,
        evaluate: ''
      },
      baseInfo: {}, // 基础信息
      parentCode: '', // 当前部门的上级单位
      curUser: {}, // 用户信息
      curDept: {}, // 当前登录的部门
      curRow: {},
      listData: [], // 区县线索协查战果反馈表
      listLoading: false, // 页面loading
      isShowpjdf: false, // 评价打分弹出框
      isShowpjdfdetail: false, // 评价打分弹出框
      btnLoading: false, // 评价打分按钮loading
      isShowdrffxsDialog: false, // 是否显示分发线索弹出框
      pageSize: 5,
      page: 1,
      total: 0,
      clusterId: '', // 存储列表传递过来的id
      pcsParentDept: '', // 派出所上级部门的数据信息
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
    info(val) {
      if (val.clusterId) {
        this.clusterId = val.clusterId
        this.baseInfo = val
        this.getDeptsshdw() // 查上级单位
      }
    }
  },
  methods: {
    init() {
      if (this.info.clusterId) {
        this.clusterId = this.info.clusterId
        this.baseInfo = this.info
        this.getDeptsshdw() // 查上级单位
      }
    },
    query() { // 查询列表
      Bus.$emit('isShowfkbtn', false) // 线索反馈按钮
      this.listLoading = true
      var param = {
        parentCode: this.parentCode, // 上级部门Code
        assistId: this.clusterId, // 集群Id
        curDeptType: this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType
      }
      this.$query('caseassistclue/detailCount', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        this.controlBtn(res.data)
        this.$resetSetItem('t3', this.total) // 将总数存在session中
      }).catch(() => {
        this.listLoading = false
        this.$resetSetItem('t3', 0) // 将总数存在session中
        this.initData()
      })
    },
    controlClick(row) { // 数字点击权限控制
      if (this.listData.length > 0) {
        if (!row.cityCode) { // 合计行可点
          return (Number(this.curDept.depType) < 3 || this.curDept.areaCode === this.baseInfo.cityCode || this.$isViewBtn('101908')) // 上级单位、申请单位、审核单位可点。
        } else {
          return false
        }
      } else {
        return false
      }
    },
    controlxsfk(row) { // 线索反馈按钮显隐控制
      return ((this.curDept.depType === '4' && this.curDept.parentDepCode === row.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.deptCode)) && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8') // 当前登录的是派出所时，用他的父级单位的cdoe去判断   集群战役处于协查中、协查结束状态时
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的线索反馈、线索分发按钮
      if (data.length > 0) {
        data.forEach(item => {
          if (((this.curDept.depType === '4' && this.curDept.parentDepCode === item.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === item.deptCode)) && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8')) { // 当前登录的是派出所时，用他的父级单位的cdoe去判断   集群战役处于协查中、协查结束状态时
            Bus.$emit('isShowfkbtn', true) // 线索反馈按钮
          }
          if (this.curDept.depType === '2' && Number(this.baseInfo.status) >= 4) { // 集群战役审核通过后  上级单位可以评价打分 区县上级单位是大队
            Bus.$emit('isShowpjbtn', true) // 评价打分
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
    gotoxslist(row, type) { // 线索列表
      if (!row.cityCode) { // 合计行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: '', cityCode: '', curDeptCode: '' } // 线索列表页面
        })
      }
    },
    handlefenfa(index, row) { // 线索分发
      this.curRow = row
      this.isShowdrffxsDialog = true
    },
    handlefankui(index, row) { // 线索反馈
      this.curRow = row
      var deptCode = ''
      // if (((this.curDept.depType !== '4' && this.curDept.depCode !== this.baseInfo.applyDeptCode) || (this.curDept.depType === '4' && this.curDept.parentDepCode !== this.baseInfo.applyDeptCode)) && this.curDept.depType !== '1') { // 当前部门如果和发起单位相同时不传，不同时传当前部门，如果需要查询接受单位，需要覆盖此字段。
      //   deptCode = this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode
      // }
      // this.$router.push({ path: '/jqcampaign/clueFeedback', query: { id: this.clusterId, deptCode: deptCode, curDeptCode: row.deptCode }}) // 跳转到线索反馈页
      if (row.deptCode !== this.baseInfo.applyDeptCode && this.curDept.depType !== '1') {
        deptCode = row.deptCode
      }
      this.$router.push({ path: '/jqcampaign/clueFeedback', query: { id: this.clusterId, deptCode: deptCode }}) // 跳转到线索反馈页
    },
    handledafen(index, row) { // 评价打分
      this.isShowpjdf = true
      this.curRow = row
    },
    handleDetail(index, row) { // 评价详情
      this.isShowpjdfdetail = true
    },
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowdrffxsDialog = val
      this.query()
    },
    getDeptsshdw() { // 查询上级单位
      var paramCode = ''
      if (this.curDept.depType === '4') { // 派出所
        paramCode = this.curDept.parentDepCode
      } else {
        paramCode = this.curDept.depCode
      }
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.parentCode = response.data.departCode
          this.query()
        }
      }).catch(() => {
      })
    },
    save() { // 保存
      this.$refs.pjdfForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          const param = {
            clusterId: this.clusterId, //  集群战役Id
            deptCode: this.curRow.deptCode, // 反馈列表当前行的部门code
            commentText: this.pjdfForm.commentText, // 评价文字
            score: this.pjdfForm.score // 评价分值
          }
          this.$update('casecluster/appraise', param).then((response) => {
            this.$message({
              message: '打分成功！',
              type: 'success',
              duration: 2000
            })
            this.btnLoading = false
            this.isShowpjdf = false
            this.query()
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    cancel() {
      this.isShowpjdf = false
      this.resetForm('pjdfForm')
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '4') {
        // // 查询派出所的上级(大队)的部门信息
        this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
          if (response.code === '000000') {
            this.pcsParentDept = response.data
          }
        }).catch(() => {

        })
      }
    }
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.countyBack{
  //修改表格边框颜色
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
  .pjdfForm{
    .el-dialog{
      width: 35%;
    }
  }
  .el-form{
    padding: 10px 20px;
  }
  .ffxsForm{
    .el-dialog{
      width: 80%;
      max-height: 80vh;
      overflow: auto;
    }
  }
  .el-table--border, .el-table--group {
    border: 0;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper{
    border-right: 0;
  }
  .el-table--border th, .el-table__fixed-right-patch {
    border-bottom: 0;
  }
}
@media only screen and (max-width: 1367px) {
  .countyBack .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
