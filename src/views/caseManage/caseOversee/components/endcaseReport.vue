<template>
  <section>
    <!-- 审核信息 -->
    <div class="auditInfo">
      <div class="titleWrap">
        <div class="left">{{title}}</div>
        <div class="right">
          <!--
            【审核】，审核单位有权限，有审核权限的人，记录处于待审核状态时显示。
            【修改结案报告】，申请单位有权限，上传结案报告后，且没有审核通过时显示。
            【上报结案报告】，申请单位人员，案件督办状态为督办中、督办结束或评价打分，且不存在结案报告时。其他情况隐藏。
            审核结案报告页面-【通过且向上上报】，审核单位人员，有审核权限，该案件存在上级督办记录，且上级督办记录案件督办状态为督办中、督办结束或评价打分，且没有上报结案报告时显示该按钮
           -->
          <el-button v-if="$isViewBtn('100815') && ((deptInfo.depType!=='4'&&jabgInfo.createDeptCode === deptInfo.depCode)||(deptInfo.depType==='4'&&jabgInfo.createDeptCode === deptInfo.parentDepCode))
              && jabgInfo.title && jabgInfo.reportStatus!==3"
              type="primary" size="small"  @click="handleReportEdit">修改结案报告</el-button>
          <el-button v-if="$isViewBtn('100814') && jabgInfo.signStatus==='2' && ((deptInfo.depType!=='4'&&jabgInfo.createDeptCode === deptInfo.depCode)||(deptInfo.depType==='4'&&jabgInfo.createDeptCode === deptInfo.parentDepCode))
              && (jabgInfo.dbStatus===5||jabgInfo.dbStatus===6||jabgInfo.dbStatus===7) && !jabgInfo.title"
              type="primary" size="small"  @click="handleReport">上报结案报告</el-button>
        </div>
      </div>
      <!-- 结案报告详情 -->
      <div class="jabgDetailWrap" v-if="jabgInfo.title">
        <p class="title">{{jabgInfo.title}}</p>
        <p class="content" v-html="jabgInfo.content"></p>
        <div class="attachment">
          附件：
          <div style="margin:-20px 0 0 60px;">
            <p v-for="item in showDetailFiles" :key="item.path">
                <!-- <a :title="item.name" :href="item.path" target="_blank" class="fjlink">{{item.name}}</a>&nbsp;&nbsp;&nbsp; -->
                <a @click="downFile(item)" class="fjlink">{{item.name}}</a>
            </p>
          </div>
        </div>
      </div>
      <el-table :data="jabgDataList" style="width: 100%;margin-top:20px;" v-loading="loading" class="table_th_center">
        <el-table-column type="index" label="序号" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column prop="applyDepartName" label="上报单位" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyUserName" label="上报人" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="applyDate" label="上报时间" width="170" align="center"></el-table-column>
        <el-table-column prop="auditDepartName" label="审核部门" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditUserName" label="审核人" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="170" align="center"></el-table-column>
        <el-table-column prop="flowStatus" label="审核结果" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictName(scope.row.flowStatus+'','dbajzt')}}
          </template>
        </el-table-column>
        <el-table-column prop="auditContent" label="审核意见" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button v-if="$isViewBtn('100821') && scope.row.auditDeptCode === deptInfo.depCode && scope.row.flowStatus==='1'"
                      title="审核" size="mini" type="primary" @click="handlerAuditJabg(scope.$index, scope.row)" circle>
                      <svg-icon icon-class="audit"></svg-icon>
            </el-button>
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
      <!-- 上传 编辑 结案报告 -->
      <el-dialog :title="dialogTitle" :visible.sync="isShowJabg" size="small" width="58%" @close="closeDialog('jabgForm')">
        <el-form ref="jabgForm" :rules="rules" :model="jabgForm" size="small" label-width="110px" v-loading="formLoading">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="jabgForm.title" clearable  maxlength="50" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="结案报告" prop="content">
            <vue-editor v-model="jabgForm.content" useCustomImageHandler @imageAdded="handleImageAdded" style="width: 100%; min-width: 500px;"></vue-editor>
          </el-form-item>
          <el-form-item label="附件" prop="evaluate">
            <el-upload drag multiple ref="fileUpload" :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadFiles"
                       :on-success="attachmentSuccess"
                       :on-remove="attachmentRemove"
                       :before-remove="attachmentBfRemove"
                       :before-upload="beforeUpload"
                       :limit="10"
                       :on-exceed="handleExceed">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，最多10个</div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-row class="tabC" style="margin: 20px auto 10px;">
          <el-button  @click="jabgCancel" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="jabgSubmit('jabgForm')"  class="saveBtn" :loading="formLoading">上 报</el-button>
        </el-row>
      </el-dialog>
      <!-- 结案报告审核 -->
      <el-dialog title="审核" :visible.sync="isShowReportAudit" size="small" @close="closeDialog('reportAuditForm')">
        <el-form ref="reportAuditForm" :rules="rules" :model="reportAuditForm" size="small" label-width="100px">
          <el-form-item label="审核意见" prop="auditContent">
            <el-input v-model.trim="reportAuditForm.auditContent" type="textarea" :rows="3" clearable maxlength="500" placeholder="最多输入500个字符" class="inputW"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="tabC dialogBtnUpLine">
          <el-button v-if="$isViewBtn('100821')" @click="reportAuditSubmit('4')" :loading="formLoading" class="cancelBtn">不通过</el-button>
          <el-button v-if="$isViewBtn('100821')" type="primary" @click="reportAuditSubmit('3')" class="saveBtn" :loading="formLoading">通过</el-button>
          <el-button v-if="$isViewBtn('100821') && (jabgInfo.upDbStatus === 5||jabgInfo.upDbStatus === 6||jabgInfo.upDbStatus === 7) && jabgInfo.upJabgStatus===0" type="primary" @click="reportAuditSubmit('5')" class="saveBtn" :loading="formLoading">通过且向上上报</el-button>
        </el-row>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import Bus from '@/utils/bus.js'
// import { regCode } from '@/utils/validate'
import titlePub from './titlePub'
import VueEditor from '@/components/Editor/VueEditor'
import { uploadImg } from '@/utils/editorUpload'
export default {
  props: ['jabgData'],
  name: 'index',
  components: {
    titlePub,
    VueEditor
  },
  data() {
    return {
      title: '结案报告',
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadFiles: [], // 附件
      showDetailFiles: [], // 展示的附件
      jabgInfo: {}, // 结案报告的详情
      loading: false, // 页面加载loading
      page: 1,
      total: 0,
      pageSize: 5,
      jabgDataList: [],
      dialogTitle: '上报结案报告',
      isShowJabg: false, // 结案报告 表单 弹框是否显示
      jabgForm: {},
      AJBH: '', // 案件编号
      formLoading: false,
      reportAuditForm: {}, // 结案报告审核
      isShowReportAudit: false, // 结案报告审核弹框是否显示
      remarkAuditType: '', // 是否审核通过 标志
      curReport: {}, // 当前点击的审核单位
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      curDeptParent: {}, // 当前部门的父级部门
      exDeptData: {}, // 审核单位
      rules: {
        title: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入标题'))
            } else {
              callback()
            }
          }
        }],
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入结案报告'))
            } else {
              callback()
            }
          }
        }],
        auditContent: [ // 审核意见校验
          { required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (this.remarkAuditType === '4') { // 不通过
              if (!value) {
                callback(new Error('审核意见不能为空'))
              } else {
                callback()
              }
            } else { // 通过，如果意见栏没有输入意见信息，后台处理自动写入“审核通过”
              callback()
            }
          } }
        ]
      }
    }
  },
  watch: {
    jabgData(val) {
      // this.loading = true
      this.initData() // 初始化数据
      if (val) {
        this.jabgInfo = val
        this.init(true)
      }
    }
  },
  methods: {
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    },
    clearFileList() {
      this.$refs.fileUpload.abort()
      const elementArr = document.getElementsByClassName('el-upload-list__item')
      for (let i = 0; i < elementArr.length; i++) {
        const element = elementArr[i]
        if (i === elementArr.length - 1) {
          element.setAttribute('style', 'display: none;')
          element.remove()
        }
      }
    },
    attachmentSuccess(res, file, fileList) {
      if (res.code !== '000000') {
        this.$alert('上传失败， 请重新上传', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.clearFileList()
          }
        })
        return false
      }
      this.uploadFiles = fileList
    },
    attachmentRemove(file, fileList) {
      this.uploadFiles = fileList
    },
    attachmentBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    handleExceed(files, fileList) { // 限制上传文件个数
      this.$message.error('最多上传10个文件')
    },
    beforeUpload(file) {
      const msg = this.UploadAttachment.fileValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    },
    init(flag) {
      if (this.jabgData) {
        this.loading = true
        this.jabgInfo = this.jabgData
        if (this.jabgData.attachment) { // 申请的附件
          this.uploadFiles = [] // 先清空掉该数组
          var files = this.jabgData.attachment.split('|')
          for (let index = 0; index < files.length; index++) {
            var element = files[index]
            element = JSON.parse(element)
            this.uploadFiles.push(element)
            this.showDetailFiles = this.uploadFiles // 供 显示的文件数组
          }
        }
        // 查询 结案报告
        var param = {
          id: this.jabgInfo.dbId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
        this.$query('page/casesupervisereport', param).then((response) => {
          if (response.code === '000000') {
            this.loading = false
            this.jabgDataList = response.data.list
            this.total = response.data.totalCount
            this.pageSize = response.data.pageSize
          }
        }).catch(() => {
          this.loading = false
        })
      }
      this.getDepts('audit') // 查上级审核单位
      // 如果是派出所  要查 父级部门
      // if (this.deptInfo.depType === '4') { // 派出所
      this.getDepts('parent') // 查父级单位
      // }
    },
    initData() { // 初始化数据
      this.jabgDataList = []
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
    handleReport() { // 上报结案报告
      this.isShowJabg = true
      this.dialogTitle = '上报结案报告'
    },
    handleReportEdit() { // 修改结案报告
      this.isShowJabg = true
      this.dialogTitle = '修改结案报告'
      this.jabgForm = JSON.parse(JSON.stringify(this.jabgData))
    },
    jabgCancel() {
      this.isShowJabg = false
    },
    jabgSubmit(formName) {
      // 上传结案报告
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true
          if (this.uploadFiles.length > 0) {
            this.handleFile()
          }
          var param = JSON.parse(JSON.stringify(this.jabgForm))
          if (this.jabgInfo.id) { // 修改结案报告
            param.status = this.jabgInfo.reportStatus // 修改结案报告时 传上一次的状态
          } else {
            param.status = 1 // 上传 规定为1
          }
          param.dbId = this.jabgInfo.dbId // 督办id
          param.createUser = this.userInfo.id // 用户id
          param.createUserName = this.userInfo.realName // 用户姓名
          if (this.deptInfo.depType === '4') { // 派出所取父级部门信息
            param.createDept = this.curDeptParent.id // 上报人部门
            param.createDeptName = this.curDeptParent.departName // 上报人部门名称
            param.createDeptCode = this.curDeptParent.departCode // 上报人部门code
          } else {
            param.createDept = this.deptInfo.id // 上报人部门
            param.createDeptName = this.deptInfo.depName // 上报人部门名称
            param.createDeptCode = this.deptInfo.depCode // 上报人部门code
          }
          param.examineDeptId = this.exDeptData.id // 上级部门code
          param.examineDeptName = this.exDeptData.departName // 上级部门
          param.examineDeptCode = this.exDeptData.departCode // 上级部门

          this.formLoading = true
          if (this.jabgInfo.id) { // 编辑
            this.$update('casesupervisereport/' + this.jabgInfo.id, param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '提交成功', type: 'success'
                })
                this.isShowJabg = false
                location.reload()
              } else {
                // this.$message({
                //   message: '机构信息保存失败，请联系管理员！', type: 'success'
                // })
              }
            }).catch(() => {
              this.$message({
                message: '保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          } else { // 添加
            this.$save('casesupervisereport', param).then((response) => {
              this.formLoading = false
              if (response.code === '000000') {
                this.$message({
                  message: '提交成功', type: 'success'
                })
                this.isShowJabg = false
                location.reload()
              } else {
                // this.$message({
                //   message: '机构信息保存失败，请联系管理员！', type: 'success'
                // })
              }
            }).catch(() => {
              this.$message({
                message: '保存失败，请联系管理员！', type: 'error'
              })
              this.formLoading = false
            })
          }
        }
      })
    },
    handlerAuditJabg(index, row) { // 列表操作列---结案报告审核
      this.curReport = row
      this.isShowReportAudit = true
    },
    reportAuditSubmit(type) { // 结案报告审核 type：3通过,4不通过,5通过并向上申请
      this.remarkAuditType = type
      this.$refs.reportAuditForm.validate(valid => {
        if (valid) {
          this.formLoading = true // 加载进度条
          var param = {
            userId: this.userInfo.id, // 审核人id
            userName: this.userInfo.realName, // 审核人姓名
            departCode: this.deptInfo.depCode, // 审核人部门code
            departName: this.deptInfo.depName // 审核人部门名称
          }
          param.dbId = this.jabgInfo.dbId // 督办id
          param.status = type // 审核状态
          if ((type === '3' || type === '5') && !this.reportAuditForm.auditContent) { // 通过
            param.content = '审核通过'
          } else {
            param.content = this.reportAuditForm.auditContent // 审核意见
          }
          if (type === '5') { // 通过且向上上报
            param.UpDepartId = this.curDeptParent.id
            param.UpDepartName = this.curDeptParent.departName
            param.UpDepartCode = this.curDeptParent.departCode
          }
          param = Object.assign(param, this.curReport)
          this.$update('CaseSuperviseReportExamine/' + this.curReport.id, param).then((response) => {
            if (response.code === '000000') {
              this.formLoading = false // 关闭加载条
              this.$message({
                message: '保存成功', type: 'success'
              })
              location.reload()
              // this.$emit('closeDialog', false)
            }
          }).catch(() => {
            this.formLoading = false // 关闭加载条
          })
        }
      })
    },
    handleFile() {
      if (this.uploadFiles.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const img = this.uploadFiles[i]
          if (img.status === 'success') {
            // arr.push({
            //   name: img.name, path: img.path ? img.path : img.response.data
            // })
            arr.push(JSON.stringify({ name: img.name, path: img.path || img.response.data }))
          }
        }
        this.jabgForm.attachment = arr.join('|') // 这里不能用逗号
      } else {
        // this.$message.error('文书附件不能为空')
        // return false
      }
    },
    getDepts(type) { // 根据code 查上级单位
      var paramCode = ''
      if (type === 'audit') { // 查审核单位
        if (this.deptInfo.depType === '4') { // 派出所
          paramCode = this.deptInfo.parentDepCode
        } else {
          paramCode = this.deptInfo.depCode
        }
      } else if (type === 'parent') { // 查父级单位
        paramCode = this.deptInfo.depCode
      }
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          if (type === 'audit') {
            this.exDeptData = response.data // 审核单位
          } else if (type === 'parent') {
            this.curDeptParent = response.data // 当前部门的父级部门
          }
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    downFile(item) {
      const arr = item.path.split('/file')
      const path = process.env.ATTACHMENT_MODULE + 'file' + arr[1]
      this.$download_http_mg(path, { fileName: item.name })
    },
    resetForm(formName) { // 重置表单
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    closeDialog(formName) {
      this.resetForm(formName)
    }
  },
  created: function() { // 监听 无文书提交申请后 更新案件梗概的状态显示
    Bus.$on('shangbaoJabg', message => {
      // if (this.ajbh) {
      this.handleReport()
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
  .jabgDetailWrap {
    width: 96%;
    margin: 10px auto;
    .title {
      font-size: 20px;
      text-align: center;
      color: #409eff;
    }
    .attachment {
      margin: 30px 0 10px;
    }
  }
}
</style>
