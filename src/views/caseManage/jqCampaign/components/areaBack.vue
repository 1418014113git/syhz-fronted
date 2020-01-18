<template>
  <section>
    <!-- 地市反馈 -->
    <div class="areaBack pubStyle">
      <title-pub :title="title">
        <i v-if="listData.length>0" title="导出全部线索" class="export_btn" @click="exportallxs"><svg-icon icon-class="export"></svg-icon></i>
      </title-pub>
        <el-table :data="listData" style="width: 100%;" v-loading="listLoading" class="">
          <el-table-column type="index" label="序号" width="60" fixed>
            <template slot-scope="scope">
              <span v-if="scope.$index+1<listData.length">
                 <span v-if="ispx">{{scope.$index}}</span>
                 <span v-else>{{scope.$index+1}}</span>
              </span>
              <span v-else>总计</span>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="单位"   min-width="200" show-overflow-tooltip  fixed></el-table-column>
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
                <span class="linkColor"  v-if="controlClick(scope.row) && scope.row.cf>0 "  @click="gotoxslist(scope.row,'3')">{{scope.row.cf}}</span>
                <span v-else>{{scope.row.cf}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="whc" label="未核查"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="linkColor"   v-if="controlClick(scope.row) && scope.row.whc>0" @click="gotoxslist(scope.row,'1')">{{scope.row.whc}}</span>
                <span v-else>{{scope.row.whc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hcl" label="核查率"  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.hcl ? (isNaN(scope.row.hcl) ? scope.row.hcl : scope.row.hcl+'%') : '0%'}}</span>
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
          <el-table-column label="操作"  width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" title="线索分发"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfa(scope.row) && $isViewBtn('101909')"  @click="handlefenfa(scope.$index, scope.row)"><svg-icon icon-class="fenfa"></svg-icon></el-button>
              <el-button size="mini" title="反馈"  type="primary" circle  v-if="scope.$index+1<listData.length && controlxsfk(scope.row) && $isViewBtn('101910')" @click="handlefankui(scope.$index, scope.row)"><svg-icon icon-class="fankui"></svg-icon></el-button>
              <el-button size="mini" title="评价打分"  type="primary" circle  v-if="scope.$index+1<listData.length && controlpjdf(scope.row) && $isViewBtn('101911')"  @click="handledafen(scope.$index, scope.row)"><svg-icon icon-class="dafen"></svg-icon></el-button>
              <el-button size="mini" title="评价详情"  type="primary" v-if="scope.$index+1<listData.length && scope.row.score && controlpjxq(scope.row)"  icon="el-icon-document" circle  @click="handleDetail(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
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
            <span>{{curRow.commentText}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 分发线索-->
      <el-dialog title="分发线索" :visible.sync="isShowdrffxsDialog"  class="ffxsForm" :close-on-click-modal="false" @close="closeDia">
        <jqzy-disib  :isShowDialog="isShowdrffxsDialog"  @closeDialog="closeffxsDialog" :id="clusterId"  :xcstatus="baseInfo.status" source="detail" :faxsflag="faxsflag"></jqzy-disib>
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
      faxsflag: false, // 传递给线索分发页面,默认是false，总队点击分发时，此值设为true，则分发线索页面分发到支队，false时，则分发线索页面分发到大队
      pageSize: 5,
      page: 1,
      total: 0,
      clusterId: '', // 集群id
      ecportTitle: '', // 导出的excel名称
      cityListData: [], // citylist
      ispx: false,
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
        this.getCity()
        this.getDeptsshdw() // 查上级单位
      }
    },
    controlClick(row) { // 数字点击权限控制
      if (this.listData.length > 0) {
        if (row.cityCode) { // 非合计行
          return (this.curDept.depType === '1' || this.curDept.depCode === row.deptCode || this.curDept.areaCode === row.cityCode || this.curDept.areaCode === this.baseInfo.cityCode || this.curDept.areaCode.substring(0, 4) === row.cityCode.substring(0, 4) === this.baseInfo.cityCode.substring(0, 4) === '6114') // 6114开头的是杨凌
        } else { // 合计行
          return (this.curDept.depType === '1' || this.curDept.areaCode === this.baseInfo.cityCode || (this.curDept.areaCode.substring(0, 4) === this.baseInfo.cityCode.substring(0, 4) && this.curDept.areaCode.substring(0, 4) === '6114' && this.baseInfo.cityCode.substring(0, 4) === '6114')) // 上级单位/审核单位、申请单位、审核单位可点。 6114开头的是杨凌
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
      if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
        const curDate = new Date(this.baseInfo.systemTime)
        const startDate = new Date(this.baseInfo.startDate)
        return ((this.curDept.depType === '1' && row.deptCode === '610000530000') || this.curDept.depType === '2' && this.curDept.depCode === row.deptCode && this.curDept.depCode !== '611400390000' && row.deptCode !== '611400390000' && curDate > startDate)
      } else {
        return false
      }
    },
    controlxsfk(row) { // 线索反馈按钮显隐控制
      if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
        const curDate = new Date(this.baseInfo.systemTime)
        const startDate = new Date(this.baseInfo.startDate)
        return (((this.curDept.depType === '2' && this.curDept.depCode === row.deptCode) || (this.curDept.depType === '4' && this.curDept.depCode.substring(0, 4) === row.deptCode.substring(0, 4) && this.curDept.depCode.substring(0, 4) === '6114' && row.deptCode.substring(0, 4) === '6114')) && curDate > startDate) // 611400390000 杨凌支队部门code
      } else {
        return false
      }
    },
    controlpjdf(row) { // 评价打分按钮显隐控制
      if (Number(this.baseInfo.status) >= 4) { // 审核通过之后
        const curDate = new Date(this.baseInfo.systemTime)
        const endDate = new Date(this.baseInfo.endDate)
        return this.curDept.depType === '1' && (String(row.hcl) === '100' || String(row.hcl) === '100.00' || curDate > endDate) // 核查率是100，当前时间>结束时间，上级单位可以评价打分
      } else {
        return false
      }
    },
    getCity() {
      this.$query('citytree', { cityCode: '610000' }, 'upms').then((response) => {
        if (response.code === '000000') {
          this.cityListData = response.data ? response.data[0].children : []
          this.getexportName() // 导出excel表的名称
        }
      })
    },
    query() { // 查询列表
      Bus.$emit('isShowffbtn', false) // 线索分发按钮
      Bus.$emit('isShowfkbtn', false) // 线索反馈按钮
      Bus.$emit('isShowpjbtn', false) // 评价打分按钮
      this.listLoading = true
      var param = {
        assistId: this.clusterId, // 集群Id,
        deptType: this.curDept.depType === '4' ? '2' : this.curDept.depType, // 杨凌派出所 类型取杨凌支队的类型
        type: 2 // 集群
      }
      if (this.curDept.depType === '1') { // 总队 传上级部门code
        param.parentCode = this.parentCode
      } else if (this.curDept.depType === '2') { // 支队  传本部门code
        param.curDeptCode = this.curDept.depCode
      } else if (this.curDept.depType === '4') { // 杨凌派出所，传父级部门code
        param.curDeptCode = this.curDept.parentDepCode
      }

      this.$query('caseassistclue/detailCount', param).then((res) => {
        this.listLoading = false
        this.listData = res.data
        if (this.listData.length > 0) {
          this.listData.forEach((item, index) => {
            if (index === 0 && item.deptCode === '610000530000') {
              this.ispx = true
            }
          })
        }

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
    controlpjxq(row) { // 评价详情按钮显隐控制
      return this.curDept.depType === '1' || (this.curDept.depType === '4' && this.curDept.parentDepCode === row.deptCode) || (this.curDept.depType !== '4' && this.curDept.depCode === row.deptCode) // 当前登录的是派出所时，用他的父级单位的cdoe去判断
    },
    controlBtn(data) { // 遍历列表信息，控制详情页上方的线索反馈、线索反馈按钮
      const curDate = new Date(this.baseInfo.systemTime)
      if (data.length > 0) {
        data.forEach(item => {
          if ((this.curDept.depType === '1' && item.deptCode === '610000530000') || this.curDept.depType === '2' && this.curDept.depCode === item.deptCode && this.curDept.depCode !== '611400390000' && item.deptCode !== '611400390000') { // 集群战役处于协查中、协查结束状态时 本单位显示分发  杨凌不能分发，下面没有大队，派出所和支队同权限的
            if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
              const startDate = new Date(this.baseInfo.startDate)
              if (curDate > startDate) {
                Bus.$emit('isShowffbtn', true) // 线索分发显示
              }
            }
          }
          if (((this.curDept.depType === '2' && this.curDept.depCode === item.deptCode) || (this.curDept.depType === '4' && this.curDept.depCode.substring(0, 4) === item.deptCode.substring(0, 4) && this.curDept.depCode.substring(0, 4) === '6114' && item.deptCode.substring(0, 4) === '6114'))) { // 集群战役处于协查中、协查结束状态时 本单位显示反馈  派出所和支队同权限的，可以反馈支队的信息
            if (this.baseInfo.status + '' === '5' || this.baseInfo.status + '' === '6' || this.baseInfo.status + '' === '7') { // 协查中 , 协查超时, 协查结束
              const startDate = new Date(this.baseInfo.startDate)
              if (curDate > startDate) {
                Bus.$emit('isShowfkbtn', true) // 线索反馈显示
                Bus.$emit('xsfkRow', item) // 线索反馈当前行数据
              }
            }
          }
          if (Number(this.baseInfo.status) >= 4) { // 审核通过之后
            const endDate = new Date(this.baseInfo.endDate)
            if (this.curDept.depType === '1' && (String(item.hcl) === '100' || String(item.hcl) === '100.00' || curDate > endDate)) { // 核查率是100，或当前时间>结束时间，上级单位可以评价打分
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
    gotoxslist(row, type) {
      if (row.cityCode) { // 列表行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: this.baseInfo.applyDeptCode, cityCode: row.cityCode, curDeptCode: '', deptType: row.deptType } // 线索列表页面
        })
      } else { // 合计行
        this.$router.push({
          path: '/jqcampaign/clueList', query: { id: this.clusterId, type: type, deptCode: '', cityCode: '', curDeptCode: '', deptType: '' } // 线索列表页面
        })
      }
    },
    handlefenfa(index, row) { // 线索分发
      if (row.deptCode === '610000530000') { // 当前行是总队
        this.faxsflag = true
      } else {
        this.faxsflag = false
      }
      if (!this.faxsflag) {
        if (String(row.signStatus) !== '2') { // 签收列表有签收按钮，表示有未签收的线索
          this.$alert('该线索还未签收，请先进行签收。', '提示', {
            type: 'warning',
            confirmButtonText: '确定'
          })
          return false
        }
      }
      this.curRow = row
      this.isShowdrffxsDialog = true
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
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowdrffxsDialog = val
      location.reload()
    },
    closeDia() {
      this.isShowdrffxsDialog = false
      location.reload()
    },
    getDeptsshdw() { // 查询上级单位
      var paramCode = ''
      if (this.curDept.depType === '4') { // 杨凌派出所
        paramCode = this.curDept.parentDepCode
      } else {
        paramCode = this.curDept.depCode
      }
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.zhsjLoading = false
          this.parentCode = response.data.departCode
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
    cancel(obj) {
      this.isShowpjdf = false
      this.resetForm(obj)
    },
    exportallxs() { // 导出全部线索
      var para = {
        category: 1, // 1是 地市，2 是 区县
        clusterId: this.clusterId, //  集群战役Id
        deptType: this.curDept.depType === '4' ? '2' : this.curDept.depType, // 杨凌派出所 类型取杨凌支队的类型
        deptCode: this.curDept.depType === '4' ? this.curDept.parentDepCode : this.curDept.depCode, // 杨凌派出所传父级code， 其他传当前code
        fileName: this.ecportTitle + '.xlsx'
      }
      this.$download('cluster/export/clue', para)
    },
    getexportName() { // 获取当前城市名称
      if (this.curDept.depType === '1') { // 总队
        this.ecportTitle = this.baseInfo.title + '涉案线索' + this.$parseTime(new Date(), '{y}-{m}-{d}')
      } else {
        this.ecportTitle = this.baseInfo.title + '(' + this.getcityName(this.curDept.areaCode) + ')' + this.$parseTime(new Date(), '{y}-{m}-{d}')
      }
    },
    getcityName(areaCode) { // 获取城市名称
      var cityData = this.cityListData
      var name = ''
      for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].cityCode === areaCode) {
          name = cityData[i].cityName
          break
        }
      }
      return name
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

  .pjdfForm .el-dialog,.recallForm .el-dialog{
    width: 35%;
    max-height: 80vh;
    overflow: auto;
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
}
@media only screen and (max-width: 1367px) {
  .areaBack .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
