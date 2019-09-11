<template>
  <section>
    <!-- 注册公司信息 -->
    <el-form :inline="true" :model="filters" size="small" label-width="124px" label-position="left">
      <el-form-item label="单位名称：">
        <el-input size="small" clearable v-model="filters.name" placeholder="请输入公司名称" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="统一信用代码：" label-width="124px">
        <el-input size="small" clearable v-model="filters.name" placeholder="请输入统一信用代码" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="负责人名称：">
        <el-input size="small" clearable v-model="filters.personsName" placeholder="请输入负责人名称" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码：">
        <el-input size="small" clearable v-model="filters.cardNumber" placeholder="请输入身份证号码" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input size="small" clearable v-model="filters.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="公司位置：">
        <el-input size="small" clearable v-model="filters.address" placeholder="请输入公司位置" maxlength="50"></el-input>
      </el-form-item>
      <!-- <el-form-item label="企业性质：">
        <el-select size="small" clearable filterable v-model="filters.DWXZ" placeholder="企业性质">
          <el-option v-for="item in enterprise_nature" :key="item.value" :label="item.code_name" :value="item.code_name"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="分类等级：">
        <el-select size="small" clearable filterable v-model="filters.DWLB" placeholder="请选择分类等级">
          <el-option value="01" label="A级"></el-option>
          <el-option value="02" label="B级"></el-option>
          <el-option value="03" label="C级"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="query(true,true)">查询</el-button>
        <el-button size="small" @click="clearFilters">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="excelImport" v-if="$isViewBtn('110002')">Excel导入/下载模板</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="pedlarList"  v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="经营项目">
              <span>{{ props.row.manageProject }}</span>
            </el-form-item>
            <el-form-item label="行政区划">
              <span>{{ props.row.area }}</span>
            </el-form-item>
            <el-form-item label="公司位置">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="经度">
              <span>{{ props.row.n }}</span>
            </el-form-item>
            <el-form-item label="纬度">
              <span>{{ props.row.e }}</span>
            </el-form-item>
            <el-form-item label="填报人">
              <span>{{ props.row.createName }}</span>
            </el-form-item>
            <el-form-item label="填报部门">
              <span>{{ props.row.createDept }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="companyName" label="单位名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unicode" label="统一信用代码" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="personName" label="法人"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="legalPersonCard" label="身份证号码" width="180"></el-table-column>
      <el-table-column prop="personName" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="registerStatus" label="登记状态"></el-table-column>
      <el-table-column prop="status" label="经营状态"></el-table-column>
      <!-- <el-table-column prop="address" label="公司位置" min-width="140" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="grade" label="风险等级" ></el-table-column>
      <el-table-column prop="personNumber" label="从业人数"></el-table-column>
      <!-- <el-table-column prop="registerNumber" label="备案登记号" width="120"></el-table-column> -->
      <el-table-column prop="approveStatus" label="审核状态">
        <template slot-scope="scope">
          {{formatStatus(scope.row.approveStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <!-- v-if="$isViewBtn('110007')" -->
          <el-button title="详情" size="mini" type="primary" icon="el-icon-document" circle  @click="handleDetail(scope.row)"></el-button>
          <el-button title="申请审核" size="mini" type="primary" icon="el-icon-check" circle  @click="handleApplyAudit(scope.$index, scope.row)"></el-button>
          <el-button title="审核" size="mini" type="primary" icon="audit" circle  @click="handleAudit(scope.$index, scope.row)">
            <svg-icon icon-class="audit"></svg-icon>
          </el-button>
          <el-button title="审核记录" size="mini" type="primary" icon="el-icon-tickets" circle  @click="queryAuditRecord(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]"  @size-change="handleSizeChange"
                     :page-size="pageSize" :total="total" :current-page="page" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 导入弹框 -->
    <el-dialog title="企业导入" :visible.sync="dialogImportVisible" size="small" @close="back('importInfo')" class="comDialog">
      <el-form ref="importInfo" size="small" :model="importInfo" label-width="100px" v-loading="importLoading">
        <el-form-item label="类　　别：">
          <el-select v-model="importInfo.type" placeholder="请选择" filterable @change="comTypeChange">
            <el-option
              v-for="item in comTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下载模板：">
          <a :href="downLoadUrl+curComType.label+'.xls'"  :download="curComType.label+'模板.xls'">
            <el-button type="primary">下载企业信息模板-{{curComType.label}}</el-button>
          </a>
        </el-form-item>
        <el-form-item label="文　　件：">
          <input type="file" @change="getFile" clearable name="file" id="excelFile"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitImportForm('importInfo')" :loading="importLoading">导 入</el-button>
          <el-button @click="back('importInfo')" :loading="importLoading">返 回</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="50%" title="提示信息" :visible.sync="innerErrorInfoVisible" append-to-body>
        <el-table :data="errorData">
          <el-table-column prop="number" label="行数" width="100"></el-table-column>
          <el-table-column prop="des" label="错误信息"></el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog title="企业审核" :visible.sync="auditVisible" :close-on-click-modal=false @close="back('auditFormInfo')" class="auditDialogWrap">
      <el-row>
        <el-col :span="24">
          <el-table :data="pedlarList"  v-loading="listLoading" style="width: 100%;" max-height="300">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="companyName" label="单位名称" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardNumber" label="统一信用代码" width="180"></el-table-column>
            <el-table-column prop="personName" label="法人" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="legalPersonCard" label="身份证号码" width="180"></el-table-column>
            <el-table-column prop="personName" label="联系电话" width="120"></el-table-column>
            <el-table-column prop="registerStatus" label="登记状态"></el-table-column>
            <el-table-column prop="status" label="经营状态"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <br>
      <el-form :model="auditFormInfo" size="small" ref="auditFormInfo" :rules="rules" label-width="94px">
        <el-row>
          <el-col :span="20">
            <!-- <el-form-item label="报考人员：" prop="teacherId">
              <span>{{curBatchInfo.total}}人</span>
            </el-form-item> -->
            <el-form-item label="审核意见：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="auditFormInfo.remark" clearable maxlength="200" placeholder="最多输入200个字符"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="margin-left: 94px;" :span="20">
            <el-button type="primary" @click="auditHandle('1')" :loading="auditLoading">通过</el-button>
            <el-button type="warning" @click="auditHandle('2')" :loading="auditLoading">不通过</el-button>
            <el-button @click="back('auditFormInfo')">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 审核记录 -->
    <div class="auditRecord">
      <el-dialog title="审核记录" :visible.sync="auditRecordVisible" :close-on-click-modal=false @close="handleCloseRecordDialog">
        <el-table :data="auditRecordData" stripe v-loading="listLoading" style="width: 100%;margin-top:0;">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="flowCreateDate" label="申请时间" width="160"></el-table-column>
          <el-table-column prop="acceptDeptName" label="审核部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">已通过</span>
              <span v-if="scope.row.status === 2">已驳回</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="意见" width="220" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import { getComArchivesApproveStatus } from '@/utils/codetotext'
import { getTCode } from '@/api/inforCollection'
import importexport from '@/api/importexport'
import Http from '@/api/http'
import axios from 'axios'

export default {
  name: 'index',
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      ModuleName: Http.ModuleName, // syhz的moduleName
      listLoading: false, // 列表数据loading
      pedlarList: [], // 列表数据
      filters: { // 筛选条件
        name: '',
        personName: '',
        cardNumber: '',
        phone: '',
        address: ''
      },
      total: 0,
      page: 1,
      pageSize: 15,
      dialogImportVisible: false, // 导入弹框
      enterprise_nature: [],
      importInfo: {
        type: '01' // 默认第一种类型
      }, // 导入表单
      innerErrorInfoVisible: false, // 导入错误信息提示框
      errorData: [], // 导入错误信息提示
      importLoading: false, // 导入loading
      fileCon: '', // 上传的文件
      auditVisible: false, // 审核弹框
      auditFormInfo: {
        remark: ''
      }, // 审核
      auditLoading: false, // 审核通过不通过按钮loading
      auditRecordVisible: false, // 审核记录弹框
      auditRecordData: [], // 审核记录
      userInfo: {}, // 当前登录用户信息
      dept: {}, // 当前登录用户部门信息
      tableHeight: null,
      rules: {
        // remark: [
        //   { required: true, trigger: 'blur', message: '请输入审核意见' }
        // ]
      },
      comTypeData: [ // 企业类别
        {
          value: '01',
          label: '自然保护区信息'
        }, {
          value: '03',
          label: '餐饮服务企业'
        }, {
          value: '04',
          label: '食品生产加工企业'
        }, {
          value: '05',
          label: '酒类企业'
        }, {
          value: '06',
          label: '违法企业（人员）基本信息表'
        }, {
          value: '07',
          label: '诊所'
        }, {
          value: '08',
          label: '蔬果、肉类批发市场'
        }, {
          value: '09',
          label: '药店'
        }, {
          value: '10',
          label: '药品生产企业'
        }, {
          value: '11',
          label: '药品批发经营企业'
        }, {
          value: '12',
          label: '肉制品屠宰、加工企业'
        }, {
          value: '13',
          label: '保化企业、美容机构'
        }, {
          value: '14',
          label: '医疗机构'
        }, {
          value: '15',
          label: '养殖企业'
        }, {
          value: '16',
          label: '个体物流寄递企业'
        }
      ],
      curComType: { value: '01', label: '自然保护区信息' }, // 导入或下载当前选择的类型，默认为第一项
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    formatStatus(status) { // 审核状态
      return getComArchivesApproveStatus(status + '')
    },
    getFile() {
      if (event.target.files[0]) {
        this.fileCon = event.target.files[0]
      } else {
        this.fileCon = ''
      }
    },
    comTypeChange(val) { // 导入或下载类型选择change
      console.log(val)
      for (let index = 0; index < this.comTypeData.length; index++) {
        const element = this.comTypeData[index]
        if (element.value === val) {
          this.curComType = element // 当前选择的类型
        }
      }
    },
    submitImportForm(formName) { // 导入弹框提交按钮
      if (this.fileCon === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.importLoading = true
          const formData = new FormData()
          formData.append('file', this.fileCon) // 文件
          formData.append('createDept', this.dept.depName) // 创建部门
          formData.append('createName', this.userInfo.realName) // 创建人
          formData.append('logFlag', 1) // 写日志标志
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'userId': this.userInfo.id,
              'userName': this.userInfo.userName
            }
          }
          axios.post(this.ModuleName + 'pitchman/upload', formData, config).then((response) => {
            this.importLoading = false
            if (response.data.message !== 'OK') { // 有异常
              const file = document.getElementById('excelFile')
              file.value = ''
              this.$message({
                message: response.data.message, type: 'error'
              })
              this.fileCon = ''
            } if (response.data.message === 'OK') {
              if (response.data.data.type === 'success') { // 上传成功
                this.$message({
                  message: '保存成功', type: 'success'
                })
                this.dialogImportVisible = false
                this.innerErrorInfoVisible = false
                this.query(true)
              } else if (response.data.data.type !== 'success') {
                this.innerErrorInfoVisible = true
                var errorInfo = []
                for (let index = 0; index < response.data.data.list.length; index++) {
                  const element = JSON.parse(response.data.data.list[index])
                  errorInfo[index] = { number: element[0], des: element[1] }
                }
                this.errorData = errorInfo
              }
            }
          }).catch((response) => {
            this.importLoading = false
            this.$message({
              message: '导入失败', type: 'error'
            })
          })
        }
      })
    },
    excelImport() { // excel导入按钮
      this.dialogImportVisible = true
    },
    handleDetail(row) { // 点击详情
      this.$gotoid('/inforCollection/comRegisterDetail', JSON.stringify(row))
    },
    query(flag, hand) { // 查询列表
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        name: this.filters.name,
        personName: this.filters.personName,
        cardNumber: this.filters.cardNumber,
        phone: this.filters.phone,
        address: this.filters.address
      }
      if (hand) {
        para.logFlag = 1
      }
      this.listLoading = true
      this.$query('page/company', para).then((response) => {
        if (response.code === '000000') {
          const data = response.data
          this.total = data.totalCount
          this.pageSize = data.pageSize
          this.pedlarList = data.list
          this.listLoading = false
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(false, true)
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.query(false, true)
    },
    handleApplyAudit() { // 申请审核
      this.$confirm('您确定要提交审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.applyAudit() // 申请审核
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    applyAudit() { // 申请审核
      this.listLoading = true
      // var param = {
      //   examBranchId: this.curBatchObj.examBranchId,
      //   type: this.personType,
      //   createUser: this.loginUser ? this.loginUser.id : '',
      //   createUserName: this.loginUser.userName,
      //   dept: this.deptInfo.deptCode,
      //   deptName: this.deptInfo.deptName,
      //   bussionTable: 'T_EXAM_BRANCH',
      //   acceptDept: '-1',
      //   acceptDeptName: '住建厅',
      //   examType: this.curBatchObj.type
      // }
      // this.$save('buildExamineSubmitAudit', param).then((response) => {
      //   this.listLoading = false
      //   if (response.data.code === '000000') {
      //     this.$message({
      //       type: 'success',
      //       message: '申请成功!'
      //     })
      //     this.queryBatch()
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    handleAudit() { // 上级部门审核
      this.auditVisible = true
    },
    auditHandle(type) { // 考试批次审核
      this.auditLoading = true
      var param = {
        bussionValue: this.curBatchInfo.examBranchId, // 考试批次id
        status: type, // 状态
        remark: this.auditFormInfo.remark, // 审核意见
        approveUserName: this.loginUser.userName, // 登录人用户名
        approveUser: this.loginUser.id, // 登录人id
        branchNo: this.curBatchInfo.branchNo // 批次编号
      }
      this.$save('buildExamineBatch', param).then((response) => {
        this.auditLoading = false
        this.$message({
          type: 'success',
          message: '审核成功!'
        })
        this.auditVisible = false
        this.queryExamBatch(true)
      }).catch(() => {
        this.auditLoading = false
        this.queryExamBatch(true)
      })
    },
    queryAuditRecord() { // 查询审核记录
      this.auditRecordVisible = true
      this.listLoading = true
      // var param = {
      //   examBranchId: this.curBatchObj.examBranchId,
      //   bussionTable: 'T_EXAM_BRANCH'
      // }
      // this.$query('sysexaminerecord', param).then((response) => {
      //   this.listLoading = false
      //   this.auditRecordData = response.data
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    handleCloseRecordDialog() { // 关闭审核记录弹框
      this.auditRecordVisible = false
    },
    clearFilters() { // 重置筛选表单
      this.filters = {
        name: '', personName: '', cardNumber: '', phone: '', address: ''
      }
      this.query(true, true)
    },
    tcode(type) {
      const para = {
        codeLx: type
      }
      getTCode(para).then((response) => {
        if (type === 'qyxz') {
          this.enterprise_nature = response.data
        } else {
          this.stateArr = response.data
        }
      })
    },
    back(formName) { // 弹框返回按钮
      this.resetForm(formName)
      if (formName === 'importInfo') { // 导入弹框
        const file = document.getElementById('excelFile')
        if (file) {
          file.value = ''
        }
        this.dialogImportVisible = false
        this.importInfo.type = '01' // select 类别
        this.curComType = this.comTypeData[0] // 当前选择的类型
      } else if (formName === 'auditFormInfo') { // 审核弹框
        this.auditVisible = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.dept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // this.query(true)
    // this.tcode('qyxz')
  },
  activated() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
p > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.comDialog .el-dialog__body {
  padding: 10px 20px 10px 20px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
}
.auditRecord {
  .el-dialog {
    width: 60%;
  }
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
}
.auditDialogWrap .el-dialog__body {
  padding: 10px 30px 10px 30px;
}
</style>
