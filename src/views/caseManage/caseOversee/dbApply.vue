<template>
  <div>
    <el-row class="dbedit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <el-card class="dbedit">
    <el-row type="flex" justify="center" v-loading="formLoading">
      <!-- <el-col :span="20"> -->
      <el-form ref="dbForm" :model="dbApplyForm" :rules="rules" label-width="120px" v-loading="formLoading" style="width:90%;">
        <el-col :span="24">
          <el-form-item label="督办案件" prop="caseId" v-if="!(carryParam.type==='up')">
            <el-select v-model="dbApplyForm.caseId" filterable clearable remote reserve-keyword
                       placeholder="请输入案件名称或者案件编号搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible" @change="caseChange"
                       value-key="id" class="db_create_input">
              <el-option v-for="item in dbajData" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办级别" prop="superviseLevel">
            <el-select v-model="dbApplyForm.superviseLevel" placeholder="请选择督办级别" class="db_create_input" :disabled="true">
              <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="督办负责人" prop="supervisePersonId">
            <el-select v-model="dbApplyForm.supervisePersonId" placeholder="请选择督办负责人" filterable class="db_create_input" @change="fzrChange">
              <el-option v-for="(item,index) in userData" :key="item.id + index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办联系人" prop="connectionPersonId">
            <el-select v-model="dbApplyForm.connectionPersonId" placeholder="请选择督办联系人" filterable class="db_create_input" @change="lxrChange">
              <el-option v-for="(item,index) in userData" :key="item.id + index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="负责人电话" prop="personLiablePhone">
            <el-input v-model="dbApplyForm.personLiablePhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="personConnectionPhone">
            <el-input v-model="dbApplyForm.personConnectionPhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="申请原因" prop="superviseDesc">
            <vue-editor v-model="dbApplyForm.superviseDesc" useCustomImageHandler @imageAdded="handleImageAdded" style="width: 100%; min-width: 500px;"></vue-editor>
          </el-form-item>
          <el-form-item label="附件" prop="attachment">
            <el-upload drag multiple :action="uploadAction"
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
          <el-form-item label="查阅密码" prop="secretCode">
            <!-- type="password" -->
            <el-input v-model="dbApplyForm.secretCode" clearable class="db_create_input" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="审核单位" prop="superviseDeptCode">
            <el-select v-model="dbApplyForm.superviseDeptCode" placeholder="请选择部门" class="db_create_input" @change="deptChange" clearable>
              <el-option v-for="(item,index) in exDeptData" :key="item.id + index" :label="item.departName" :value="item.departCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" align="center">
          <el-form-item>
          <!-- <el-button type="primary" @click="handleSave" v-loading.fullscreen.lock="formLoading">保存</el-button>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" v-loading.fullscreen.lock="formLoading">申请</el-button> -->
          <!-- <p style="font-size: 12px; color: #ffffff">申请后将不能修改和删除</p> -->
            <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading" v-if="!(carryParam.type==='up')">保存</el-button>
            <el-button size="mini" @click="handleCancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
            <el-button size="mini" @click="handleSubmit('departmentForm')" class="saveBtn" :loading="formLoading" >申请</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    <!-- </el-col> -->
    </el-row>
  </el-card>
</div>
</template>

<script>
import {
  addSupervise, editSupervise, dbOnlySave, superviseReject
} from '@/api/supervise'
import {
  getUsersByDep
} from '@/api/depts'
import VueEditor from '@/components/Editor/VueEditor'
import { uploadImg } from '@/utils/editorUpload'
export default {
  props: {
    bean: Object
  },
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadFiles: [], // 附件
      formLoading: false,
      caseLoading: false, // 督办案件
      dbajData: [],
      exDeptData: [], // 审核单位
      userData: [],
      dbApplyForm: {
        caseId: null,
        superviseLevel: null,
        supervisePersonId: null,
        connectionPersonId: null,
        personConnectionPhone: null,
        superviseDesc: '',
        superviseDeptCode: ''
      },
      carryParam: {}, // 跳转传参
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      curDeptParent: {}, // 当前部门的父级部门
      rules: {
        caseId: [{
          required: true, message: '请选择督办案件', trigger: 'change'
        }],
        superviseLevel: [{
          required: true, message: '请选择督办级别', trigger: 'change'
        }],
        supervisePersonId: [{
          required: true, message: '请选择督办负责人', trigger: 'change'
        }],
        personLiablePhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入督办负责人电话'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的手机号码'))
            }
          }
        }],
        connectionPersonId: [{
          required: true, message: '请选择督办联系人', trigger: 'change'
        }],
        personConnectionPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入督办联系人电话'))
            } else if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的手机号码'))
            }
          }
        }],

        superviseDesc: [{
          required: true, message: '请输入申请原因', trigger: 'blur'
        }],
        secretCode: [{
          required: false, trigger: 'blur', validator: (rule, value, callback) => {
            var reg = /^[a-zA-Z0-9]{6,8}$/
            if (value) {
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('密码格式不正确（6-8位的字母或者数字）！'))
              }
            } else {
              callback()
            }
          }
        }],
        superviseDeptCode: [{
          required: true, message: '请选择审核部门', trigger: 'change'
        }]
        // dbName: [{
        //   required: true, message: '请输入督办名称', trigger: 'blur'
        // }, {
        //   min: 3, max: 100, message: '长度在 3 到 100 个字', trigger: 'blur'
        // }]
      }
    }
  },
  components: {
    VueEditor
  },
  methods: {
    caseVisible(flag) {
      if (!flag) {
        this.dbajData = []
      }
    },
    queryCase(val, id) {
      if (!val && !id) {
        this.dbajData = []
        return false
      }
      this.caseLoading = true
      var param = {}
      if (val) {
        param.ajmc = val // 案件名称 或 案件编号
      }
      if (id) {
        this.formLoading = true
        param.caseId = id // 编辑的时候，根据id去查案件的数据源
      }
      if (this.deptInfo.depType === '4') { // 派出所
        param.departCode = this.deptInfo.parentDepCode
      } else {
        param.departCode = this.deptInfo.depCode
      }
      this.$query('casesuprlaj', param).then((response) => {
        this.caseLoading = false
        this.formLoading = false
        if (response.data.length > 0) {
          this.dbajData = response.data
        }
      }).catch(() => {
        this.caseLoading = false
        this.formLoading = false
      })
    },
    initEdit() { // 编辑时 初始化
      this.formLoading = true
      // 查询督办详情
      this.$query('casesuperviserecord/' + this.carryParam.dbId, {}).then(response => {
        this.formLoading = false
        response.data.superviseLevel = response.data.superviseLevel + ''
        this.queryCase('', response.data.caseId) // 根据案件id 初始化 督办案件数据源
        this.dbApplyForm = response.data
        this.fzrChange(this.dbApplyForm.supervisePersonId) // 督办负责人
        this.lxrChange(this.dbApplyForm.connectionPersonId) // 督办联系人
        this.deptChange(this.dbApplyForm.superviseDeptCode)// 审核单位
        for (let i = 0; i < response.data.attachment.length; i++) { // 附件
          this.uploadFiles = [] // 先清空掉该数组
          var files = response.data.attachment.split('|')
          for (let index = 0; index < files.length; index++) {
            var element = files[index]
            element = JSON.parse(element)
            this.uploadFiles.push(element)
          }
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    initToUp() { // 向上申请
      this.formLoading = true
      // 查询督办详情
      this.$query('casesuperviserecord/' + this.carryParam.dbId, {}).then(response => {
        this.formLoading = false
        response.data.superviseLevel = (Number(response.data.superviseLevel) - 1) + '' // 督办级别
        // 向上申请没有 保存  所以负责人和联系人 取得是自己
        this.dbApplyForm.supervisePersonId = this.userInfo.id // 督办人id
        this.dbApplyForm.connectionPersonId = this.userInfo.id // 联系人id
        this.fzrChange(this.dbApplyForm.supervisePersonId) // 督办负责人
        this.lxrChange(this.dbApplyForm.connectionPersonId) // 督办联系人
        // 申请原因和附件沿用上一次的申请
        this.dbApplyForm.superviseDesc = response.data.superviseDesc // 申请原因
        if (response.data.attachment) {
          for (let i = 0; i < response.data.attachment.length; i++) { // 附件
            this.uploadFiles = [] // 先清空掉该数组
            var files = response.data.attachment.split('|')
            for (let index = 0; index < files.length; index++) {
              var element = files[index]
              element = JSON.parse(element)
              this.uploadFiles.push(element)
            }
          }
        }
        this.dbApplyForm.status = response.data.status // 状态
        this.dbApplyForm.recordId = response.data.recordId //
        this.dbApplyForm.superviseId = response.data.superviseId //
        console.log(this.dbApplyForm)
      }).catch(() => {
        this.formLoading = false
      })
    },
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
    attachmentSuccess(res, file, fileList) {
      this.uploadFiles = fileList
      console.log(this.uploadFiles)
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
    caseChange(val) { // 督办案件change
      if (val) {
        for (let i = 0; i < this.dbajData.length; i++) {
          if (val === this.dbajData[i]['id']) {
            this.dbApplyForm.caseNumber = this.dbajData[i]['AJBH'] // 案件编号
            this.dbApplyForm.caseCreateTime = this.dbajData[i]['LARQ'] // 立案时间
            this.dbApplyForm.caseName = this.dbajData[i]['AJMC'] // 案件名称
            this.dbApplyForm.caseType = this.dbajData[i]['AJLB1'] // 案件类型
            return true
          }
        }
      } else {
        this.dbApplyForm.caseNumber = null
        this.dbApplyForm.caseCreateTime = null
        this.dbApplyForm.caseName = null
        this.dbApplyForm.caseType = null
      }
    },
    fzrChange(val) { // 督办负责人
      console.log(this.userData + ',,,' + val)
      this.userData.forEach((item, i) => {
        if (item.id === val) {
          this.dbApplyForm.supervisePerson = item.name // 督办人姓名
          this.dbApplyForm.personLiablePhone = item.phone // 负责人电话
          return true
        }
      })
    },
    lxrChange(val) { // 督办联系人
      this.userData.forEach((item, i) => {
        if (item.id === val) {
          this.dbApplyForm.connectionPerson = item.name // 联系人姓名
          this.dbApplyForm.personConnectionPhone = item.phone // 联系人电话
          return true
        }
      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['departCode']) {
            this.dbApplyForm.superviseDeptCode = this.exDeptData[i]['departCode'] // 部门code
            this.dbApplyForm.superviseExamDeptId = this.exDeptData[i]['id'] // 部门id
            this.dbApplyForm.superviseExamDept = this.exDeptData[i]['departName'] // 部门名称
            this.dbApplyForm.superviseAreaCode = this.exDeptData[i]['areaCode'] // 行政区划
            return true
          }
        }
      } else {
        this.dbApplyForm.superviseDeptCode = null
        this.dbApplyForm.superviseExamDeptId = null
        this.dbApplyForm.superviseExamDept = null
        this.dbApplyForm.superviseAreaCode = null
      }
    },
    handleCancel() { // 表单取消
      this.cancel()
    },
    handleSave() { // 保存
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          if (this.carryParam.dbId) {
            this.dbEdit(0)
          } else {
            this.dbSave(0)
          }
        }
      })
    },
    handleSubmit() { // 申请
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          if (this.carryParam.dbId) {
            if (this.carryParam.type === 'up') {
              this.dbUptoApply() // 向上申请
            } else {
              this.dbEdit(1)
            }
          } else {
            this.dbSave(1)
          }
        }
      })
    },
    dbUptoApply() { // CaseSuperviseAuidt
      this.formLoading = true
      if (this.uploadFiles.length > 0) {
        this.handleFile()
      }
      const req = this.dbApplyForm
      // req.status = state // 区分按钮 0保存草 0保存草稿 1申请 待审核
      req.applyPersonId = this.userInfo.id // 申请人id
      req.applyPersonName = this.userInfo.realName // 申请人姓名
      if (this.deptInfo.depType === '4') { // 派出所取父级部门信息
        req.applyDeptId = this.curDeptParent.id // 申请人部门
        req.applyDeptName = this.curDeptParent.departName // 申请人部门名称
        req.applyDeptCode = this.curDeptParent.departCode // 申请人部门code
        req.applyAreaCode = this.curDeptParent.areaCode // 申请人行政区划
      } else {
        req.applyDeptId = this.deptInfo.id // 申请人部门
        req.applyDeptName = this.deptInfo.depName // 申请人部门名称
        req.applyDeptCode = this.deptInfo.depCode // 申请人部门code
        req.applyAreaCode = this.deptInfo.areaCode // 申请人行政区划
      }
      req.category = 'apply' // 督办类型
      console.log(req)
      this.$update('CaseSuperviseAuidt/' + this.carryParam.dbId, req).then((response) => {
        if (response.code === '000000') {
          this.saveLoading = false
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$router.push({ path: '/caseManage/dbList' })
        }
      }).catch(() => {
        this.saveLoading = false
      })
    },
    dbEdit(state) {
      this.formLoading = true
      if (this.uploadFiles.length > 0) {
        this.handleFile()
      }
      const req = this.dbApplyForm
      req.status = state // 区分按钮 0保存草 0保存草稿 1申请 待审核
      req.applyPersonId = this.userInfo.id // 申请人id
      req.applyPersonName = this.userInfo.realName // 申请人姓名
      if (this.deptInfo.depType === '4') { // 派出所取父级部门信息
        req.applyDeptId = this.curDeptParent.id // 申请人部门
        req.applyDeptName = this.curDeptParent.departName // 申请人部门名称
        req.applyDeptCode = this.curDeptParent.departCode // 申请人部门code
        req.applyAreaCode = this.curDeptParent.areaCode // 申请人行政区划
      } else {
        req.applyDeptId = this.deptInfo.id // 申请人部门
        req.applyDeptName = this.deptInfo.depName // 申请人部门名称
        req.applyDeptCode = this.deptInfo.depCode // 申请人部门code
        req.applyAreaCode = this.deptInfo.areaCode // 申请人行政区划
      }
      req.category = 'apply' // 督办类型
      console.log(req)
      this.$update('casesuperviserecord/' + this.carryParam.dbId, req).then((response) => {
        if (response.code === '000000') {
          this.saveLoading = false
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$router.push({ path: '/caseManage/dbList' })
        }
      }).catch(() => {
        this.saveLoading = false
      })
    },
    dbEdit1(state) {
      const req = this.dbApplyForm
      req.userName = this.userInfo.userName
      req.userId = this.userInfo.userId
      if (this.dbApplyForm.category === 'apply') {
        this.formLoading = true
        if (state === 0) { // 保存
          this.directEdit(req)
        }
        if (state === 1) { // 申请
          req.serverId = req.id
          if (req.status === '2') {
            req.type = '0003'
            req.approveDept = req.superviseExamDeptId
            req.approveDeptName = req.superviseExamDept
            superviseReject(req).then((res) => {
              this.formLoading = false
              this.returnMsg('提交成功', res)
            }).catch(() => {
              this.formLoading = false
            })
          } else {
            req.status = 1
            addSupervise(req).then((res) => {
              this.formLoading = false
              this.returnMsg('提交成功', res)
            }).catch(() => {
              this.formLoading = false
            })
          }
        }
      }
    },
    directEdit(req) {
      editSupervise(req).then((res) => {
        this.formLoading = false
        this.returnMsg('提交成功', res)
      }).catch(() => {
        this.formLoading = false
      })
    },
    dbSave(state) {
      this.formLoading = true
      if (this.uploadFiles.length > 0) {
        this.handleFile()
      }
      const req = this.dbApplyForm
      req.status = state // 区分按钮 0保存草 0保存草稿 1申请 待审核
      req.applyPersonId = this.userInfo.id // 申请人id
      req.applyPersonName = this.userInfo.realName // 申请人姓名
      if (this.deptInfo.depType === '4') { // 派出所取父级部门信息
        req.applyDeptId = this.curDeptParent.id // 申请人部门
        req.applyDeptName = this.curDeptParent.departName // 申请人部门名称
        req.applyDeptCode = this.curDeptParent.departCode // 申请人部门code
        req.applyAreaCode = this.curDeptParent.areaCode // 申请人行政区划
      } else {
        req.applyDeptId = this.deptInfo.id // 申请人部门
        req.applyDeptName = this.deptInfo.depName // 申请人部门名称
        req.applyDeptCode = this.deptInfo.depCode // 申请人部门code
        req.applyAreaCode = this.deptInfo.areaCode // 申请人行政区划
      }
      req.category = 'apply' // 督办类型
      console.log(req)
      this.$save('directdbaj', req).then((response) => {
        if (response.code === '000000') {
          this.saveLoading = false
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$router.push({ path: '/caseManage/dbList' })
        }
      }).catch(() => {
        this.saveLoading = false
      })
      // if (state === 1) {
      //   req.skip = 'false'
      //   addSupervise(req).then((res) => {
      //     this.formLoading = false
      //     this.returnMsg('提交成功', res)
      //   }).catch(() => {
      //     this.formLoading = false
      //   })
      // } else if (state === 0) {
      //   this.onlySave(req)
      // }
    },
    onlySave(req) {
      req.bizType = 3
      req.action = '添加督办案件'
      dbOnlySave(req).then((res) => {
        this.formLoading = false
        this.returnMsg('提交成功', res)
      }).catch(() => {
        this.formLoading = false
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
        this.dbApplyForm.attachment = arr.join('|') // 这里不能用逗号
      } else {
        // this.$message.error('文书附件不能为空')
        // return false
      }
    },
    cancel() {
      // this.$router.back(-1)
      if (this.$route.query.source && this.$route.query.source === 'ajda') { // 是从案件档案跳转过来的
        if (this.$route.query.id) {
          if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id, isRl: this.$route.query.isRl }
            })
          } else {
            this.$router.push({
              path: '/caseFile/index', query: { id: this.$route.query.id }
            })
          }
        } else if (this.$route.query.ajbh) {
          if (this.$route.query.interfaceType) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, interfaceType: this.$route.query.interfaceType } // 传递案件编号
            })
          } else if (this.$route.query.isRl) {
            this.$router.push({
              path: '/caseFile/index', query: { ajbh: this.$route.query.ajbh, isRl: this.$route.query.isRl } // 传递案件编号
            })
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    },
    returnMsg(msg, response) {
      if (response.code === '000000') {
        this.$message({
          message: msg, type: 'success'
        })
        this.cancel()
      }
    },
    getUsers(deptcode) { // 查部门下面的人员
      getUsersByDep(deptcode).then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data
          const list = []
          data.forEach((item) => {
            list.push({
              id: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
            })
          })
          this.userData = list
          if (this.$route.query.dbId) {
            //
          } else {
            this.dbApplyForm.supervisePersonId = this.userInfo.id // 督办人id
            this.dbApplyForm.connectionPersonId = this.userInfo.id // 联系人id
            this.fzrChange(this.dbApplyForm.supervisePersonId) // 督办负责人
            this.lxrChange(this.dbApplyForm.connectionPersonId) // 督办联系人
          }
          this.judgeInitForm() // 判断如何初始化
        }
      })
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
            this.exDeptData = [response.data] // 审核单位 数据源
          } else if (type === 'parent') {
            this.curDeptParent = response.data // 当前部门的父级部门
          }
          // 督办级别 处理
          if (this.deptInfo.depType === '4') { // 派出所
            this.dbApplyForm.superviseLevel = this.curDeptParent.departType
          } else {
            this.dbApplyForm.superviseLevel = this.deptInfo.depType
          }
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    judgeInitForm() {
      if (this.$route.query.dbId && this.$route.query.type === 'up') { // 向上申请
        this.initToUp() // 向上申请时  初始化
      } else if (this.$route.query.dbId) { // 编辑
        this.initEdit()
      }
    }
  },
  mounted() {
    this.getDepts('audit') // 查审核单位
    // 查督办负责人
    if (this.deptInfo.depType === '4') { // 派出所
      this.getUsers([this.deptInfo.parentDepCode])
      this.getDepts('parent') // 查父级单位
    } else {
      this.getUsers([this.deptInfo.depCode])
    }

    if (this.$route.query.dbId) {
      this.carryParam = this.$route.query
    }

    // if (this.$route.query.caseName && this.$route.query.caseId) {
    //   if (!isNaN(Number(this.$route.query.caseId)) && Number(this.$route.query.caseId) !== 0) {
    //     getDBCase({
    //       caseId: this.$route.query.caseId
    //     }).then((response) => {
    //       this.formLoading = false
    //       if (response.data) {
    //         this.dbajData = response.data
    //         this.queryCase(this.$route.query.caseName)
    //         this.dbApplyForm.caseId = Number(this.$route.query.caseId)
    //       }
    //     }).catch(() => {
    //       this.formLoading = false
    //     })
    //   }
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dbedit {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  .el-card__body {
    padding: 40px 20px 20px;
  }
}

.dbedit h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.dbedit .db_create_input {
  width: 100%;
}
.dbedit .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
</style>
