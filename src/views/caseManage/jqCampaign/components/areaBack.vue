<template>
  <section>
    <!-- 地市反馈 -->
    <div class="areaBack pubStyle">
      <title-pub :title="title"></title-pub>
      <div style="max-height:260px;overflow: auto;">
        <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
          <el-table-column type="index" label="序号" width="60">
            <template slot-scope="scope">
              <span v-if="scope.$index+1<listData.length">{{scope.$index+1}}</span>
              <span v-else>总计</span>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="单位"   min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xsNum" label="线索总数（条）" min-width="130">
            <template slot-scope="scope">
              <span class="linkColor"  v-if="controlClick(scope.row)"  @click="gotoxslist(scope.row, '')">{{scope.row.xsNum}}</span>
              <span v-else>{{scope.row.xsNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="线索核查核实情况（条）"  align="center" show-overflow-tooltip>
            <el-table-column prop="cs" label="查实"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"  v-if="controlClick(scope.row)"  @click="gotoxslist(scope.row,'2')">{{scope.row.cs}}</span>
                <span v-else>{{scope.row.cs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cf" label="查否"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"  v-if="controlClick(scope.row)"  @click="gotoxslist(scope.row,'1')">{{scope.row.cf}}</span>
                <span v-else>{{scope.row.cf}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="whc" label="未核查"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"   v-if="controlClick(scope.row)" @click="gotoxslist(scope.row,'3')">{{scope.row.whc}}</span>
                <span v-else>{{scope.row.whc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hcl" label="核查率"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.hcl ? scope.row.hcl : 0}}%</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="ysajList" label="移送行政部门处理（次）"  min-width="120"></el-table-column>
          <el-table-column prop="" label="侦办刑事案件"  align="center" show-overflow-tooltip>
            <el-table-column prop="larqCount" label="立案（起）"  min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parqCount" label="破案（起）"  min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="zhrys" label="抓获（人）"  min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xsjl" label="刑拘（人）"  min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb" label="批捕（人）"   min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yjss" label="移诉（人）"   min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dhwd" label="捣毁窝点（个）"  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sajz" label="涉案金额（万元）"  min-width="100" show-overflow-tooltip></el-table-column>
          </el-table-column>
          <el-table-column prop="score" label="评价打分" min-width="100"></el-table-column>
          <el-table-column label="操作"  width="160" align="center" fixed="right">
            <template slot-scope="scope">
            <el-button size="mini" title="线索分发"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfa(scope.row) && $isViewBtn('101909')"  @click="handlefenfa(scope.$index, scope.row)"><svg-icon icon-class="fenfa"></svg-icon></el-button>
            <el-button size="mini" title="反馈"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfk(scope.row) && $isViewBtn('101910')" @click="handlefankui(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
            <el-button size="mini" title="评价打分"  type="primary" circle  v-if="scope.$index+1<listData.length &&  curDept.depType === '1' && Number(baseInfo.status)>= 4 && $isViewBtn('101911')"  @click="handledafen(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
            <el-button size="mini" title="评价详情"  type="primary" v-if="scope.$index+1<listData.length && scope.row.score"  icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
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
      <!-- 评价打分 -->
      <el-dialog title="评价打分" :visible.sync="isShowpjdf" size="small" class="pjdfForm" @close="cancel('pjdfForm')">
        <el-form ref="pjdfForm" :rules="rules" :model="pjdfForm" size="small" label-width="90px">
          <el-form-item label="打分" prop="score">
            <el-rate v-model="pjdfForm.score"></el-rate>
          </el-form-item>
          <el-form-item label="评价" prop="commentText">
            <el-input v-model.trim="pjdfForm.commentText" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
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
            <!-- <el-input v-model.trim="curRow.commentText" type="textarea" :rows="4" disabled maxlength="500"></el-input> -->
            <span>{{curRow.commentText}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 分发线索-->
      <el-dialog title="分发线索" :visible.sync="isShowdrffxsDialog"  class="ffxsForm" :close-on-click-modal="false">
        <jqzy-disib  :isShowDialog="isShowdrffxsDialog"  @closeDialog="closeffxsDialog" :id="clusterId"  :xcstatus="baseInfo.status" source="detail"></jqzy-disib>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import titlePub from './titlePub'
import Bus from '@/utils/bus.js'
import JqzyDisib from './jqzyDisib'
export default {
  props: ['info'],
  name: 'areaBack',
  components: {
    titlePub,
    JqzyDisib
  },
  data() {
    return {
      title: '地市线索协查战果反馈表',
      pjdfForm: { // 评价打分
        score: 0, // 分值
        commentText: '' // 评价
      },
      parentCode: '', // 当前部门的上级单位
      curUser: {}, // 用户信息
      curDept: {}, // 当前登录的部门
      baseInfo: {}, // 基础信息
      curRow: {},
      listData: [], // 地市线索协查战果反馈表
      listLoading: false, // 页面loading
      isShowpjdf: false, // 评价打分弹出框
      isShowpjdfdetail: false, // 评价打分弹出框
      btnLoading: false, // 评价打分按钮loading
      isShowdrffxsDialog: false, // 是否显示分发线索弹出框
      pageSize: 5,
      page: 1,
      total: 0,
      clusterId: '', // 集群id
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
        this.baseInfo = this.info
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
    controlClick(row) { // 数字点击权限控制
      if (this.listData.length > 0) {
        if (row.cityCode) { // 非合计行
          return (this.curDept.depType === '1' || this.curDept.depCode === row.deptCode || this.curDept.areaCode === row.cityCode || this.curDept.areaCode === this.baseInfo.cityCode || this.curDept.areaCode.substring(0, 4) === row.cityCode.substring(0, 4) === this.baseInfo.cityCode.substring(0, 4) === '6114') // 6114开头的是杨凌
        } else { // 合计行
          return (this.curDept.depType === '1' || this.curDept.areaCode === row.cityCode || this.curDept.areaCode === this.baseInfo.cityCode || this.curDept.areaCode.substring(0, 4) === this.baseInfo.cityCode.substring(0, 4) === '6114') // 上级单位/审核单位、申请单位、审核单位可点。 6114开头的是杨凌
        }
      } else {
        return false
      }
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    controlxsfa(row) { // 线索分发按钮显隐控制
      return (this.curDept.depType === '2' && this.curDept.depCode === row.deptCode && this.curDept.depCode !== '611400390000' && row.deptCode !== '611400390000' && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8'))
    },
    controlxsfk(row) { // 线索反馈按钮显隐控制
      return (((this.curDept.depType === '2' && this.curDept.depCode === row.deptCode) || (this.curDept.depType === '4' && this.curDept.parentDepCode.substring(0, 4) === row.deptCode.substring(0, 4) === '6114')) && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8')) // 611400390000 杨凌支队部门code
    },
    query() { // 查询列表
      this.listLoading = true
      var param = {
        parentCode: this.parentCode, // 上级部门Code
        assistId: this.clusterId, // 集群Id,
        curDeptType: this.curDept.depType === '4' ? '2' : this.curDept.depType // 杨凌派出所 类型取杨凌支队的类型
      }
      this.$query('caseassistclue/detailCount', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        this.controlBtn(res.data)
        if (this.listData.length > 0) {
          this.$resetSetItem('t3', this.listData.length - 1) // 将总数存在session中 减去合计行
        } else {
          this.$resetSetItem('t3', 0) // 将总数存在session中
        }
      }).catch(() => {
        this.listLoading = false
        this.$resetSetItem('t3', 0) // 将总数存在session中
        this.initData()
      })
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的线索反馈、线索反馈按钮
      Bus.$emit('isShowffbtn', false) // 线索分发
      Bus.$emit('isShowfkbtn', false) // 线索反馈
      Bus.$emit('isShowpjbtn', false) // 评价打分
      if (data.length > 0) {
        data.forEach(item => {
          if (this.curDept.depType === '2' && this.curDept.depCode === item.deptCode && this.curDept.depCode !== '611400390000' && item.deptCode !== '611400390000' && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8')) { // 集群战役处于协查中、协查结束状态时 本单位显示分发  杨凌不能分发，下面没有大队，派出所和支队同权限的
            Bus.$emit('isShowffbtn', true) // 线索分发
          }
          if (((this.curDept.depType === '2' && this.curDept.depCode === item.deptCode) || (this.curDept.depType === '4' && this.curDept.parentDepCode === item.deptCode === '611400390000')) && (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '8')) { // 集群战役处于协查中、协查结束状态时 本单位显示反馈  派出所和支队同权限的，可以反馈支队的信息
            Bus.$emit('isShowfkbtn', true) // 线索反馈
            Bus.$emit('xsfkRow', item) // 线索反馈当前行数据
          }
          if (this.curDept.depType === '1' && Number(this.baseInfo.status) >= 4) { // 集群战役审核通过后  上级单位可以评价打分
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
    gotoxslist(row, type) {
      if (row.cityCode) { // 列表行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: this.baseInfo.applyDeptCode, cityCode: row.cityCode, curDeptCode: row.deptCode, deptType: row.deptType } // 线索列表页面
        })
      } else { // 合计行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: '', cityCode: '', curDeptCode: '', deptType: '' } // 线索列表页面
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
      this.curRow = row
    },
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowdrffxsDialog = val
      this.query()
    },
    getDeptsshdw() { // 查询上级单位
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
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
    }
    this.init()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.areaBack{
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
      max-height: 80vh;
      overflow: auto;
    }
  }
  .el-form{
    padding: 10px 20px;
  }
  textarea{
    // min-height: 80px;
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
  .areaBack .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
