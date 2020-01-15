<template>
  <section>
    <!-- 区县反馈 -->
    <div class="countyBack pubStyle">
       <title-pub :title="title">
        <!-- <i v-if="listData.length>0" title="导出全部线索" class="export_btn" @click="exportallxs"><svg-icon icon-class="export"></svg-icon></i> -->
      </title-pub>
        <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
          <el-table-column type="index" label="序号" width="60" fixed>
            <template slot-scope="scope">
              <span v-if="scope.$index+1<listData.length">{{scope.$index+1}}</span>
              <span v-else>总计</span>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="单位"   min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="xsNum" label="线索总数（条）" min-width="140">
            <template slot-scope="scope">
              <span class="linkColor"  v-if="controlClick(scope.row) && scope.row.xsNum>0"  @click="gotoxslist(scope.row, '')">{{scope.row.xsNum}}</span>
              <span v-else>{{scope.row.xsNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="线索核查核实情况（条）"  align="center" show-overflow-tooltip>
            <el-table-column prop="cs" label="查实"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"  v-if="controlClick(scope.row) && scope.row.cs>0"  @click="gotoxslist(scope.row,'2')">{{scope.row.cs}}</span>
                <span v-else>{{scope.row.cs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cf" label="查否"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"  v-if="controlClick(scope.row) && scope.row.cf>0"  @click="gotoxslist(scope.row,'3')">{{scope.row.cf}}</span>
                <span v-else>{{scope.row.cf}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="whc" label="未核查"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"   v-if="controlClick(scope.row) && scope.row.whc" @click="gotoxslist(scope.row,'1')">{{scope.row.whc}}</span>
                <span v-else>{{scope.row.whc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hcl" label="核查率"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.hcl ? scope.row.hcl : 0}}%</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="ysxz" label="移送行政部门处理（次）"  min-width="130"></el-table-column>
          <el-table-column prop="" label="侦办刑事案件"  align="center" show-overflow-tooltip>
            <el-table-column prop="larqCount" label="立案（起）"  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parqCount" label="破案（起）"  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="zhrys" label="抓获（人）"  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xsjl" label="刑拘（人）"  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb" label="批捕（人）"   min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yjss" label="移诉（人）"   min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dhwd" label="捣毁窝点（个）"  min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sajz" label="涉案金额（万元）"  min-width="150" show-overflow-tooltip></el-table-column>
          </el-table-column>
          <el-table-column prop="score" label="评价打分" min-width="100"></el-table-column>
          <el-table-column label="操作"  width="160" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" title="反馈"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfk(scope.row) && $isViewBtn('101910')"  @click="handlefankui(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
              <el-button size="mini" title="评价打分"  type="primary" circle  v-if="scope.$index+1<listData.length && controlpjdf(scope.row) && $isViewBtn('101911')"  @click="handledafen(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
              <el-button size="mini" title="评价详情"  type="primary" v-if="scope.$index+1<listData.length && scope.row.score && controlpjxq(scope.row)"   icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
              <!-- <el-button size="mini" title="转回上级"  type="primary" v-if="scope.$index+1<listData.length && controlrecall(scope.row)"  circle  @click="handleRecall(scope.$index, scope.row)"><svg-icon icon-class="back"></svg-icon></el-button> -->
            </template>
          </el-table-column>
        </el-table>
      <!-- 评价打分 -->
      <el-dialog title="评价打分" :visible.sync="isShowpjdf" size="small" class="pjdfForm"  @close="cancel('pjdfForm')">
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
            <span>{{curRow.commentText}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 转回上级-->
      <el-dialog title="转回上级" :visible.sync="isShowzhsj"  class="recallForm" :close-on-click-modal="false" v-loading="zhsjLoading" @close="cancel('zhsjForm')">
        <el-form ref="zhsjForm" :rules="zhsjrules" :model="zhsjForm" size="small" label-width="100px">
          <p class="zhsjp">将线索转回上级单位。</p>
          <el-form-item label="接收单位" prop="parentDepartName">
            <el-input v-model.trim="zhsjForm.parentDepartName"  disabled></el-input>
          </el-form-item>
          <el-form-item label="原因" prop="content">
            <el-input v-model.trim="zhsjForm.content" type="textarea" :rows="4" clearable  maxlength="500" placeholder="最多输入500个字符"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button  type="primary" @click="sumbit"  class="saveBtn" :loading="tjbtnLoading">提交</el-button>
        </el-row>
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
        commentText: ''
      },
      zhsjForm: { // 转回上级
        content: '', // 原因
        parentDepartName: '' // 上级单位名称
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
      pageSize: 5,
      page: 1,
      total: 0,
      clusterId: '', // 存储列表传递过来的id
      pcsParentDept: {}, // 派出所上级部门的数据信息
      qxqsbtn: false, // 区县签收也是否有签收按钮
      isShowzhsj: false, // 是否显示转回上级弹框
      tjbtnLoading: false, // 转回上级提交按钮loading
      zhsjLoading: false, // 转回上级弹框页面loading
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
      },
      zhsjrules: {
        parentDepartName: [ // 接收单位（上级单位）
          { required: true, message: '请填写接收单位', max: 6, trigger: 'blur' }
        ],
        content: [ // 原因
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请填写原因'))
            } else {
              callback()
            }
          } }
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
      Bus.$on('qxqsbtn', (data) => { // 接收地市签收列表传递过来的参数
        this.qxqsbtn = data
      })
    },
    query() { // 查询列表
      Bus.$emit('isShowfkbtn', false) // 线索反馈按钮
      this.listLoading = true
      var param = {
        // parentCode: this.curDept.depType === '2' ? this.curDept.depCode : this.parentCode, // 上级部门Code
        assistId: this.clusterId, // 集群Id
        deptType: this.curDept.depType === '4' ? this.pcsParentDept.departType : this.curDept.depType,
        type: 2 // 集群
      }
      if (this.curDept.depType === '2') { // 支队  传本部门code
        param.parentCode = this.curDept.depCode
      } else if (this.curDept.depType === '3') { // 大队 传当前部门code
        param.curDeptCode = this.curDept.depCode
      } else if (this.curDept.depType === '4') { // 派出所，传父级部门code
        param.curDeptCode = this.curDept.parentDepCode
      }
      this.$query('caseassistclue/detailCount', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        this.controlBtn(res.data)
        if (this.listData.length > 0) {
          this.$resetSetItem('t5', this.listData.length - 1) // 将总数存在session中 减去合计行
        } else {
          this.$resetSetItem('t5', 0) // 将总数存在session中
        }
      }).catch(() => {
        this.listLoading = false
        this.$resetSetItem('t5', 0) // 将总数存在session中
        this.initData()
      })
    },
    controlClick(row) { // 数字点击权限控制
      if (this.listData.length > 0) {
        if (row.cityCode) { // 非合计行
          return ((this.curDept.depType === '2' && this.curDept.areaCode === this.baseInfo.cityCode) || this.curDept.areaCode === row.cityCode || this.curDept.depCode === row.deptCode || (this.curDept.depType === '4' && (this.curDept.parentDepCode === row.deptCode || this.curDept.parentDepCode === this.baseInfo.applyDeptCode))) // 上级单位/审核单位，申请单位，本单位可点。
        } else { // 合计行
          return ((this.curDept.depType === '2' && this.curDept.areaCode === this.baseInfo.cityCode) || this.curDept.depCode === this.baseInfo.applyDeptCode || (this.curDept.depType === '4' && this.curDept.parentDepCode === this.baseInfo.applyDeptCode)) // 上级单位/审核单位，申请单位可点。
        }
      } else {
        return false
      }
    },
    controlxsfk(row) { // 线索反馈按钮显隐控制
      if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
        const curDate = new Date(this.baseInfo.systemTime)
        const startDate = new Date(this.baseInfo.startDate)
        return (((this.curDept.depType === '4' && this.curDept.parentDepCode === row.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.deptCode)) && curDate > startDate) // 当前登录的是派出所时，用他的父级单位的cdoe去判断   集群战役处于协查中、协查结束状态时
      } else {
        return false
      }
    },
    controlpjdf(row) { // 评价打分按钮显隐控制
      if (Number(this.baseInfo.status) >= 4) { // 审核通过之后
        const curDate = new Date(this.baseInfo.systemTime)
        const endDate = new Date(this.baseInfo.endDate)
        return (this.curDept.depType === '2' && this.curDept.areaCode === row.cityCode) && (String(row.hcl) === '100' || String(row.hcl) === '100.00' || curDate > endDate) // 核查率是100，当前时间>结束时间，上级单位可以评价打分
      } else {
        return false
      }
    },
    controlpjxq(row) { // 评价详情按钮显隐控制
      return (this.curDept.depType === '2' && this.curDept.areaCode === row.cityCode) || (this.curDept.depType === '4' && this.curDept.parentDepCode === row.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.deptCode) // 当前登录的是派出所时，用他的父级单位的cdoe去判断
    },
    controlrecall(row) { // 转回上级按钮显隐控制 协查中本单位可以操作
      return this.baseInfo.status + '' === '5' && ((this.curDept.depType !== '4' && this.curDept.depCode === row.deptCode) || (this.curDept.depType === '4' && this.curDept.parentDepCode === row.deptCode))
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的线索反馈、线索分发按钮
      const curDate = new Date(this.baseInfo.systemTime)
      if (data.length > 0) {
        data.forEach(item => {
          if (((this.curDept.depType === '4' && this.curDept.parentDepCode === item.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === item.deptCode))) { // 当前登录的是派出所时，用他的父级单位的cdoe去判断   集群战役处于协查中、协查结束状态时
            if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
              const startDate = new Date(this.baseInfo.startDate)
              if (curDate > startDate) {
                Bus.$emit('isShowfkbtn', true) // 显示线索反馈按钮
              }
            }
          }
          if (Number(this.baseInfo.status) >= 4) { // 审核通过之后
            const endDate = new Date(this.baseInfo.endDate)
            if ((this.curDept.depType === '2' && this.curDept.areaCode === item.cityCode) && (String(item.hcl) === '100' || String(item.hcl) === '100.00' || curDate > endDate)) {
              Bus.$emit('isShowpjbtn', true) // 显示评价打分按钮
            }
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
      if (row.cityCode) { // 列表行
        var cityCode = row.deptCode.substring(0, 6)
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: this.baseInfo.applyDeptCode, cityCode: cityCode, curDeptCode: row.deptCode, deptType: row.deptType } // 线索列表页面
        })
      } else { // 合计行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: '', cityCode: '', curDeptCode: '', deptType: '' } // 线索列表页面
        })
      }
    },
    handlefankui(index, row) { // 线索反馈
      if (String(row.signStatus) !== '2') { // 签收列表有签收按钮，表示有未签收的线索
        this.$alert('该线索还未签收，请先进行签收。', '提示', {
          type: 'warning',
          confirmButtonText: '确定'
        })
        return false
      }
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
      if (this.curRow.score) {
        this.pjdfForm.score = this.curRow.score
      }
      if (this.curRow.commentText) {
        this.pjdfForm.commentText = this.curRow.commentText
      }
    },
    handleDetail(index, row) { // 评价详情
      this.isShowpjdfdetail = true
      this.curRow = row
    },
    handleRecall(index, row) { // 转回上级
      this.isShowzhsj = true
      this.getDeptsshdw(row.deptCode)
    },
    getDeptsshdw(deptCode) { // 查询上级单位
      var paramCode = ''
      if (deptCode) {
        this.zhsjLoading = true
        paramCode = deptCode
      } else {
        if (this.curDept.depType === '4') { // 派出所
          paramCode = this.curDept.parentDepCode
        } else {
          paramCode = this.curDept.depCode
        }
      }
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.zhsjLoading = false
          this.parentCode = response.data.departCode
          this.zhsjForm.parentDepartName = response.data.departName
          this.query()
        }
      }).catch(() => {
        this.zhsjLoading = false
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
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    cancel(obj) {
      this.isShowpjdf = false
      this.isShowzhsj = false
      this.resetForm(obj)
    },
    exportallxs() { // 导出全部线索

    },
    sumbit() { // 转回上级提交
      this.$refs.zhsjForm.validate(valid => {
        if (valid) {
          this.tjbtnLoading = true
          const param = {
            clusterId: this.clusterId, //  集群战役Id
            deptCode: this.curRow.deptCode, // 反馈列表当前行的部门code
            content: this.zhsjForm.content, // 原因
            parentCode: this.parentCode, // 上级部门Code
            parentName: this.zhsjForm.parentDepartName // 上级部门名称
          }
          this.$update('', param).then((response) => {
            this.$message({
              message: '提交成功！',
              type: 'success',
              duration: 2000
            })
            this.tjbtnLoading = false
            this.isShowzhsj = false
            this.query()
          }).catch(() => {
            this.tjbtnLoading = false
          })
        }
      })
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
      max-height: 80vh;
      overflow: auto;
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
  .el-button+.el-button {
    margin-left: 5px;
  }
  .title {
    width: 100%;
    padding: 7px 0 7px 7px;
    border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    margin-bottom: 10px;
  }
  .left {
    float: left;
    letter-spacing: 3px;
  }
  .right {
    float: right;
  }
}
@media only screen and (max-width: 1367px) {
  .countyBack .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
