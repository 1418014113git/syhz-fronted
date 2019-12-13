<template>
  <div class="caseAssist_edit">
    <el-row class="assistCard">
      <img src="@/assets/icon/back.png"  class="goBack" @click="backList">   <!--返回-->
    </el-row>
    <el-card class="assistCard" v-loading="formLoading">
      <el-row type="flex" justify="center" class="mar_top">
        <el-col :span="18">
          <el-form :model="caseAssistForm" ref="caseAssistForm" :rules="rules" label-width="120px">
            <el-col :span="24" v-if="firstSubmitVisible">
              <el-form-item label="标题" prop="title">
                <el-input v-model="caseAssistForm.title" auto-complete="off" clearable maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="发起单位">
                <el-input v-model="caseAssistForm.applyDeptName" auto-complete="off" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="案件" prop="caseId">
                <el-select v-model="caseAssistForm.caseId" filterable clearable remote reserve-keyword placeholder="输入案件名称搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible" @change="caseChange" value-key="id" style="width:100%">
                  <el-option v-for="item in caseList" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="firstSubmitVisible && category === '3'">
              <el-form-item label="编号" prop="assistNumber">
                <el-input v-model="caseAssistForm.assistNumber" auto-complete="off" clearable maxlength="50" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="category === '3' ? 11 : 24" :class="category === '3' ? 'mar_left' : ''" v-if="firstSubmitVisible">
              <el-form-item label="协查级别" prop="assistLevel">
                <el-select v-model="caseAssistForm.assistLevel" placeholder="请选择" clearable :disabled="noauth" @change="levelChange">
                  <el-option v-for="item in assistLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="firstSubmitVisible">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker v-model="caseAssistForm.startDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :disabled="timeDisable" @change="startChange" clearable></el-date-picker>
              </el-form-item>
              <el-form-item label="发起人" prop="applyPersonName">
                <el-input v-model="caseAssistForm.applyPersonName" auto-complete="off" clearable maxlength="50" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" class="mar_left" v-if="firstSubmitVisible">
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker v-model="caseAssistForm.endDate" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :disabled="timeEndDisable" @change="endChange" clearable></el-date-picker>
              </el-form-item>
              <el-form-item label="发起人电话" prop="applyPersonPhone">
                <el-input v-model="caseAssistForm.applyPersonPhone" placeholder="发起人电话" clearable maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="涉及线索" prop="" class="must" v-if="secondSubmitVisible">
                <el-button  @click="importClue">导入线索</el-button>
                <span class="mar_left_15" @click="distribute('0','0')">线索总数： <span class="numStyle">  {{clueNum.total}}</span></span>
                <span class="mar_left_15" @click="distribute('2','2')">已分发线索： <span class="numStyle">  {{clueNum.distribute}}</span></span>
                <span class="mar_left_15" @click="distribute('1','1')">未分发线索： <span class="numStyle">  {{clueNum.total - clueNum.distribute}}</span></span>
                <el-button  class="mar_left_15" @click="distribute('0','0')">分发</el-button>
              </el-form-item>
              <el-form-item label="涉及单位" prop="" class="must" v-if="secondSubmitVisible">
                <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" max-height="400" show-summary>
                  <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                  <el-table-column prop="deptName" align="center" label='单位'  min-width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="clueCount" align="center" label="线索数量"  width="200">
                    <template slot-scope="scope">
                      <span class="linkColor"  @click="distribute('list',scope.row)">{{scope.row.clueCount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                      <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="distribute('list',scope.row)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="正文" prop="assistContent" class="assistContent" v-if="firstSubmitVisible">
                <vue-editor ref="child" v-model="caseAssistForm.assistContent" useCustomImageHandler @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
              </el-form-item>
              <el-form-item label="上传附件" v-if="firstSubmitVisible">
                <el-upload class="upload-demo" drag multiple :action="uploadAction" :limit="10"
                           :auto-upload="true"
                           :file-list="uploadImgs"
                           :on-success="imgSuccess"
                           :on-remove="imgRemove"
                           :on-preview="imgPreview"
                           :before-remove="imgBfRemove"
                           :before-upload="beforeUpload" :disabled="noauth">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText_Notice_size}}<br>{{UploadAttachment.tipText_Notice_style}}</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="查阅密码" prop="passKey" v-if="firstSubmitVisible">
                <el-input v-model="caseAssistForm.passKey" type="password" maxlength="20" minlength="6" size="small" placeholder="6~20位大小写字母、数字"></el-input>
              </el-form-item>
              <el-form-item label="审核单位" v-if="category === '2' && firstSubmitVisible" prop="acceptDept">
                <el-select v-model="caseAssistForm.acceptDept" placeholder="请选择部门"  class="input_w" clearable :disabled="noauth" @change="deptChange">
                  <el-option v-for="(item, index) in exDeptData" :key="index" :label="item.departName" :value="item.departCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="cancelEdit" class="cancelBtn" :disabled="formLoading">取 消</el-button>
                <el-button type="primary" v-if="saveBtnVisible" class="saveBtn" @click="onSubmit(0)" :loading="saveBtnLoading" :disabled="applyBtnLoading">保 存</el-button>
                <el-button type="primary" class="saveBtn" @click="onSubmit(1)" v-if="secondSubmitVisible" :loading="applyBtnLoading" :disabled="saveBtnLoading">{{ btnText }}</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 导入线索弹框-->
    <el-dialog title="导入线索" :visible.sync="importClueVisible" :close-on-click-modal="false">
      <import-clue :isShowDialog="importClueVisible"  @closeDialog="closeImportClueDialog" :category="category" :id="editId" @result="getResult"></import-clue>
    </el-dialog>

    <!-- 分发线索-->
    <el-dialog title="分发线索" :visible.sync="distributeClueVisible" class="distribute_clue" :close-on-click-modal="false" @close="closeDistributeClueDialog">
      <distributeClue @closeDialog="closeDistributeClueDialog" :assistId="editId" :fastatus="qbxsDistribute" :jsdw="receiveName" source="add" @result="getDistributeResult"></distributeClue>
    </el-dialog>
  </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import { getSessionDeptSelect } from '@/api/depts'
import { getAssistLevel } from '@/utils/codetotext'
import { getTJXJ, getParentDeptArray } from '@/api/dept'
import { uploadImg } from '@/utils/editorUpload'
import ImportClue from './components/importClue'
import distributeClue from './components/distributeClue'

export default {
  name: 'assistEdit',
  components: {
    VueEditor,
    ImportClue,
    distributeClue
  },
  data() {
    return {
      timeDisable: true,
      timeEndDisable: true,
      uploadAction: this.UploadAttachment.uploadFileUrl,
      caseLoading: false,
      pageOperationType: '',
      btnText: '申 请',
      category: '',
      deptList: [],
      depData: [],
      exDeptData: [],
      assistLevel: getAssistLevel(),
      caseList: [],
      curUser: JSON.parse(sessionStorage.getItem('userInfo')),
      curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
      formLoading: false,
      saveBtnLoading: false,
      applyBtnLoading: false,
      caseAssistForm: {
        title: '',
        applyPersonId: '',
        applyPersonName: '',
        applyDeptId: '',
        applyDeptName: '',
        assistContent: '',
        assistLevel: '',
        assistDept: '',
        dutyPerson: '',
        applyPersonPhone: '',
        acceptDept: null,
        startDate: null,
        endDate: null,
        attachment: '',
        status: '',
        caseId: '',
        passKey: '',
        assistNumber: '',
        ajbh: '',
        ajmc: ''
      },
      uploadImgs: [],
      rules: {
        title: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const regEnCode = this.$regCode
            const regCnCode = this.$regCode
            if (value === undefined || value === null || value === '') {
              callback(new Error('请输入标题'))
            } else if (value.length > 0 && (regEnCode.test(value) || regCnCode.test(value))) {
              callback(new Error('标题不能输入特殊字符'))
            } else if (value.length > 50) {
              callback(new Error('标题长度不能超过 50个字符'))
            } else {
              return callback()
            }
          }
        }],
        assistContent: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请输入正文'))
            } else if (value.length > 65000) {
              return callback(new Error('正文长度不能超过 65000个字符'))
            }
            return callback()
          }
        }],
        caseId: [{ required: true, message: '请选择协查案件', trigger: 'change' }],
        assistLevel: [{ required: true, message: '请选择协查级别', trigger: 'change' }],
        assistDept: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (this.selectedDepts.length === 0) {
                callback(new Error('请选择协查部门'))
              } else {
                callback()
              }
            }
          }
        ],
        dutyPerson: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        acceptDept: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!this.caseAssistForm.acceptDept) {
              callback(new Error('请选择审核部门'))
            } else {
              callback()
            }
          }
        }],
        assistNumber: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入编号'))
            }
            return callback()
          }
        }],
        applyPersonName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback(new Error('请输入发起人'))
            }
            return callback()
          }
        }],
        applyPersonPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[1][345678][0-9]{9}$/
            if (!reg.test(value)) {
              callback(new Error('请输入11位正确的手机号码'))
            } else {
              callback()
            }
          }
        }],
        startDate: [{
          required: true, trigger: ['change', 'blur'], validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请选择开始时间'))
            }
            if (this.caseAssistForm.endDate) {
              if (new Date(this.caseAssistForm.endDate) < new Date(value)) {
                return callback(new Error('开始时间不能大于截止时间'))
              }
            }
            return callback()
          }
        }],
        endDate: [{
          required: true, trigger: ['change', 'blur'], validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback(new Error('请选择截止时间'))
            }
            if (new Date(this.caseAssistForm.startDate) > new Date(value)) {
              return callback(new Error('截止时间不能小于开始时间'))
            }
            if (new Date(value) < new Date()) {
              return callback(new Error('截止时间不能小于当前系统时间'))
            }
            return callback()
          }
        }],
        passKey: [{
          required: false, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === undefined || value === null || value === '') {
              return callback()
            } else {
              if (!this.$regEnNumber.test(value)) {
                return callback(new Error('查阅密码只支持输入6~20位英文和数字！'))
              }
            }
            return callback()
          }
        }]
      },
      noauth: false,
      selectedDepts: [],
      firstSubmitVisible: true,
      secondSubmitVisible: false,
      importClueVisible: false,
      distributeClueVisible: false,
      saveBtnVisible: true,
      editId: '',
      receiveName: '', // 点击涉及单位当前行时，将涉及单位名称传递给线索列表。
      qbxsDistribute: '', // 点击线索数字时，将数字状态传递给线索列表。
      curDeptCode: '', // 当前部门code  登录上来是派出所时，存储他的父级单位作为他自己的单位
      curDepartId: '', // 当前部门id   登录上来是派出所时，存储他的父级单位作为他自己的单位
      curDeptName: '', // 当前部门名称   登录上来是派出所时，存储他的父级单位作为他自己的单位
      clueNum: {
        total: 0,
        distribute: 0
      },
      listData: [],
      listLoading: false,
      updateOp: false
    }
  },
  methods: {
    levelChange(val) {
      if (val) {
        if (String(val) === '5') {
          this.timeEndDisable = false
        }
        this.timeDisable = false
        this.startChange(this.caseAssistForm.startDate)
      } else {
        this.timeDisable = true
        this.caseAssistForm.startDate = null
        this.caseAssistForm.endDate = null
      }
    },
    checkDeptChange(value, isChecked) {
      if (isChecked) {
        this.selectedDepts.push({
          id: value.id, name: value.name
        })
      } else {
        let i = -1
        this.selectedDepts.forEach((item, index) => {
          if (item.id === value.id) {
            i = index
          }
        })
        if (i > -1) {
          this.selectedDepts.splice(i, 1)
        }
      }
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i].departCode) {
            this.caseAssistForm.acceptDeptName = this.exDeptData[i].departName
            this.caseAssistForm.acceptDeptId = this.exDeptData[i].acceptDeptId
            return true
          }
        }
      } else {
        this.caseAssistForm.acceptDeptId = null
        this.caseAssistForm.acceptDept = null
        this.caseAssistForm.acceptDeptName = null
      }
    },
    queryCase(val) {
      if (!val) {
        return false
      }
      this.caseLoading = true
      const para = {
        ajmc: val,
        depCode: this.curDept.depCode
      }
      if (this.curDept.depType === '1') {
        para.depCode = ''
      }
      this.$query('searchsyhaj', para).then((response) => {
        this.caseLoading = false
        if (response.data) {
          this.caseList = response.data
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    caseVisible(flag) {
      if (!flag) {
        this.caseList = []
      }
    },
    caseChange(val) {
      for (let i = 0; i < this.caseList.length; i++) {
        const item = this.caseList[i]
        if (String(item.id) === String(val)) {
          this.caseAssistForm.ajbh = item.AJBH
          this.caseAssistForm.ajmc = item.AJMC
          this.caseAssistForm.caseId = item.id
        }
      }
    },
    detail() {
      this.formLoading = true
      this.$query('caseAssist/' + this.editId).then(response => {
        this.caseAssistForm.title = response.data.title
        this.caseAssistForm.assistNumber = response.data.assistNumber
        this.timeDisable = false
        this.caseAssistForm.startDate = response.data.startDate
        this.caseAssistForm.endDate = response.data.endDate
        this.caseAssistForm.applyDeptName = response.data.applyDeptName
        this.caseAssistForm.applyPersonName = response.data.applyPersonName
        this.caseAssistForm.citys = response.data.citys
        this.caseAssistForm.applyPersonPhone = response.data.applyPersonPhone
        this.caseAssistForm.assistContent = response.data.assistContent
        this.caseAssistForm.acceptDept = response.data.auditDeptCode
        this.deptChange(response.data.auditDeptCode)
        this.caseAssistForm.passKey = response.data.passKey
        this.caseAssistForm.ajbh = response.data.ajbh
        this.caseAssistForm.ajmc = response.data.ajmc
        this.caseAssistForm.caseId = response.data.id
        this.caseAssistForm.status = response.data.status
        this.caseAssistForm.passKey = response.data.readKey ? response.data.readKey : ''
        this.caseAssistForm.attachment = response.data.attachment
        if (response.data.attachment !== undefined && response.data.attachment !== null && response.data.attachment !== '') {
          this.uploadImgs = JSON.parse(response.data.attachment)
        }
        if (String(response.data.status) !== '0') {
          this.saveBtnVisible = false
        }
        this.queryCase(response.data.ajmc)
        this.caseAssistForm.assistLevel = String(response.data.assistLevel)
        this.secondSubmitVisible = true
        this.firstSubmitVisible = true
        if (response.data.clueTotal > 0 && response.data.clueDistribute > 0) {
          this.getResult(response.data)
          this.queryList(response.data.assistId)
        }
        const _this = this
        setTimeout(function() {
          _this.formLoading = false
        }, 1000)
      }).catch(() => {
        this.formLoading = false
      })
    },
    onSubmit(state) {
      if (state === 1) {
        this.applyBtnLoading = true
      } else {
        this.saveBtnLoading = true
      }
      this.formLoading = true
      this.$refs.caseAssistForm.validate(valid => {
        if (valid) {
          this.handleImg()
          const param = {
            title: this.caseAssistForm.title,
            assistNumber: this.caseAssistForm.assistNumber,
            startDate: this.caseAssistForm.startDate,
            endDate: this.caseAssistForm.endDate,
            applyDeptName: this.caseAssistForm.applyDeptName,
            applyPersonName: this.caseAssistForm.applyPersonName,
            citys: this.caseAssistForm.citys,
            applyPersonPhone: this.caseAssistForm.applyPersonPhone,
            assistContent: this.caseAssistForm.assistContent,
            acceptDeptId: this.caseAssistForm.acceptDeptId,
            acceptDeptName: this.caseAssistForm.acceptDeptName,
            acceptDept: this.caseAssistForm.acceptDept,
            passKey: this.caseAssistForm.passKey,
            attachment: this.caseAssistForm.attachment,
            category: this.category,
            ajbh: this.caseAssistForm.ajbh,
            ajmc: this.caseAssistForm.ajmc,
            caseId: this.caseAssistForm.caseId,
            assistLevel: this.caseAssistForm.assistLevel,
            userId: this.caseAssistForm.userId, // 当前用户Id
            userName: this.caseAssistForm.userName, // 当前用户真实姓名
            curDeptCode: this.caseAssistForm.curDeptCode, // 当前部门code
            curDeptName: this.caseAssistForm.curDeptName, // 当前部门名称
            curDeptId: this.caseAssistForm.curDeptId // 当前部门Id
          }
          if (this.pageOperationType === 'edit') {
            param.status = state === 0 ? state : (this.category === '3' ? '4' : state)
            param.operator = state === 0 ? 'update' : 'submit'
            param.id = this.editId
            if (this.secondSubmitVisible) {
              if (!this.clueNum.total) {
                this.$message({ message: '请导入线索', type: 'error' })
              } else if (this.listData.length === 0) {
                this.$message({ message: '请分发线索', type: 'error' })
              } else {
                let text = ''
                if (state !== 0) {
                  if (String(this.category) === '2') {
                    text = '申请'
                  } else if (String(this.category) === '3') {
                    text = '下发'
                  }
                } else {
                  text = '保存'
                }
                this.save(param, false, true, text, true)
              }
            } else {
              this.save(param, false, false, '', false)
            }
          } else if (this.pageOperationType === 'add') {
            param.status = state === 0 ? state : (this.category === '3' ? '4' : state)
            if (this.secondSubmitVisible) {
              param.operator = 'update'
              param.id = this.editId
              this.save(param, true, true, '保存', true)
            } else {
              param.operator = 'other'
              this.save(param, true, false, '', false)
            }
          }
        } else {
          this.$message({
            message: '提交信息有误，请检查所有填写项',
            type: 'error'
          })
          this.applyBtnLoading = false
          this.saveBtnLoading = false
          this.formLoading = false
          return false
        }
      })
    },
    save(param, flag, alert, alertMes, togo) {
      this.$save('caseAssist/save', param).then((response) => {
        this.editId = response.data // 保存成功后返回的id
        this.applyBtnLoading = false
        this.saveBtnLoading = false
        this.formLoading = false
        if (flag) {
          this.secondSubmitVisible = true
          this.firstSubmitVisible = false
        }
        if (alert) {
          this.$message({
            message: alertMes + '成功！',
            type: 'success',
            duration: 2000
          })
        }
        if (togo) {
          if (this.pageOperationType === 'add' || this.pageOperationType === 'edit') {
            this.$router.push({ path: '/caseAssist/list' })
          } else {
            this.$gotoid('/caseAssist/detail', JSON.stringify({ id: this.caseAssistForm.id }))
          }
        }
      }).catch(() => {
        this.applyBtnLoading = false
        this.saveBtnLoading = false
        this.formLoading = false
      })
    },
    handleImg() {
      if (this.uploadImgs.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.caseAssistForm.attachment = JSON.stringify(arr)
      }
    },
    handleDepts() {
      for (let i = 0; i < this.selectedDepts.length; i++) {
        const data = this.selectedDepts[i]
        if (i === 0) {
          this.caseAssistForm.assistDeptId = '[' + data.id + ']'
          this.caseAssistForm.assistDept = data.name
        } else {
          this.caseAssistForm.assistDeptId += ',[' + data.id + ']'
          this.caseAssistForm.assistDept += ',' + data.name
        }
      }
    },
    backList() {
      if (sessionStorage.getItem(this.$route.path)) {
        var carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (carryParam.source && carryParam.source === 'ajda') { // 是从案件档案跳转过来的
          if (carryParam.id) {
            if (carryParam.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { id: carryParam.id, isRl: carryParam.isRl }
              })
            } else {
              this.$router.push({
                path: '/caseFile/index', query: { id: carryParam.id }
              })
            }
          } else if (carryParam.ajbh) {
            if (carryParam.interfaceType) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: carryParam.ajbh, interfaceType: carryParam.interfaceType } // 传递案件编号
              })
            } else if (carryParam.isRl) {
              this.$router.push({
                path: '/caseFile/index', query: { ajbh: carryParam.ajbh, isRl: carryParam.isRl } // 传递案件编号
              })
            }
          } else {
            this.$router.back(-1)
          }
        } else {
          this.$router.back(-1)
        }
      } else {
        this.$router.back(-1)
      }
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.backList()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    imgSuccess(res, file, fileList) {
      this.uploadImgs = fileList
    },
    imgRemove(file, fileList) {
      this.uploadImgs = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {
      console.log(file)
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
    getDepts() {
      this.depData = getTJXJ(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
      this.exDeptData = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
    },
    computeDate(type, date) {
      if (this.caseAssistForm.assistLevel === '1') {
        return this.addDate(date, '', 12 * type)
      } else if (this.caseAssistForm.assistLevel === '2') {
        return this.addDate(date, 2 * type, '')
      } else if (this.caseAssistForm.assistLevel === '3') {
        return this.addDate(date, 3 * type, '')
      } else if (this.caseAssistForm.assistLevel === '4') {
        return this.addDate(date, 7 * type, '')
      }
    },
    startChange(val) {
      if (val) {
        this.caseAssistForm.startDate = this.addDate(new Date(val + ':00'), '', '')
        if (this.caseAssistForm.assistLevel !== '5') {
          this.caseAssistForm.endDate = this.computeDate(1, new Date(val + ':00'))
        }
      }
    },
    endChange(val) {
      if (val) {
        this.caseAssistForm.endDate = this.addDate(new Date(val + ':00'), '', '')
        if (this.caseAssistForm.assistLevel !== '5') {
          this.caseAssistForm.startDate = this.computeDate(-1, new Date(val + ':00'))
        }
      }
    },
    addDate(date, days, hours) {
      const d = new Date(date)
      if (days) {
        d.setDate(d.getDate() + days)
      }
      if (hours) {
        d.setHours(d.getHours() + hours)
      }
      const m = d.getMonth() + 1
      return d.getFullYear() + '-' + m + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => {})
    },
    contentChange(val) {
      this.$refs.caseAssistForm.validateField('assistContent')
    },
    distribute(type, data) { // 分发
      if (type === 'list') { // 点击涉及单位当前行
        this.receiveName = data.deptName
      } else { // 点击线索数字时，获取当前数字的状态
        this.qbxsDistribute = data
      }
      this.distributeClueVisible = true
    },
    closeImportClueDialog(val) { // 关闭导入线索弹框
      this.importClueVisible = val
      if (this.$route.query.type === 'edit') {
        this.detail()
      } else {
        this.queryList(this.editId) // 查询涉及单位对应的列表
      }
    },
    closeDistributeClueDialog(val) { // 关闭分发线索弹框
      if (val) {
        this.updateOp = true
      } else {
        this.distributeClueVisible = false
        if (this.updateOp || val !== undefined) {
          this.queryList(this.editId) // 查询涉及单位对应的列表
        }
      }
    },
    getResult(val) { // 导入线索页面导入成功后传递的线索数量
      this.clueNum.total = val.clueTotal
      this.clueNum.distribute = val.clueDistribute
    },
    getDistributeResult(val) { // 分发线索页面执行取消，删除操作后返回的线索数量
      this.clueNum.total = val.clueTotal
      this.clueNum.distribute = val.clueDistribute
    },
    queryList(assistId) { // 查询涉及单位对应的列表
      this.listLoading = true
      this.$query('caseassistclue/simpleList', { assistId: assistId, type: 1 }).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.listData = response.data
        } else {
          this.listData = []
        }
      }).catch(() => {
        this.listLoading = false
        this.listData = []
      })
    },
    getLaunchDept() { // 如果登上来的是派出所 发起单位显示成大队
      const launchData = getSessionDeptSelect()
      const parentDepCode = this.curDept.parentDepCode
      for (let i = 0; i < launchData.length; i++) {
        if (parentDepCode === launchData[i].depCode) {
          this.caseAssistForm.applyDeptName = launchData[i].name
          this.curDeptName = launchData[i].name // 当前部门名称
          this.curDepartId = launchData[i].id // 当前部门id
          this.curDeptCode = launchData[i].depCode // 当前部门code
          this.caseAssistForm.curDeptCode = this.curDeptCode
          this.caseAssistForm.curDeptName = this.curDeptName
          this.caseAssistForm.curDeptId = this.curDeptId
        }
      }
    },
    getAuditDept() { // 查询审核单位
      this.caseAssistForm.curDeptType = this.curDept.depType // 部门类型
      let paramCode = ''
      if (this.curDept.depType === '4') { // 派出所
        paramCode = this.curDept.parentDepCode
      } else {
        paramCode = this.curDept.depCode
      }
      // 查审核单位 自己的上级
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          const exDeptData = {
            departCode: response.data.departCode,
            departName: response.data.departName,
            acceptDeptId: response.data.id
          }
          this.exDeptData = [exDeptData]
        }
        if (this.editId !== '') {
          this.detail()
        }
      })
    },
    importClue() {
      this.importClueVisible = true
    },
    initNumber() {
      if (this.category === '3') {
        this.$query('caseAssist/number', { dept: this.curDept.depCode }).then(response => {
          this.caseAssistForm.assistNumber = response.data
        })
      }
    }
  },
  mounted() {
    if (this.curDept && this.curUser) {
      this.caseAssistForm.applyPersonPhone = this.curUser.phone
      this.caseAssistForm.applyPersonId = this.curUser.id
      this.caseAssistForm.applyPersonName = this.curUser.realName
      this.caseAssistForm.userId = this.curUser.id
      this.caseAssistForm.userName = this.curUser.realName
      this.caseAssistForm.applyDeptId = this.curDept.id
      this.caseAssistForm.applyDeptName = this.curDept.depName
      this.caseAssistForm.curDeptName = this.curDept.depName // 当前部门名称
      this.caseAssistForm.curDeptCode = this.curDept.depCode // 当前部门code
      this.caseAssistForm.curDeptId = this.curDept.id // 当前部门id
      if (this.curDept.depType === '4') { // 派出所
        this.getLaunchDept() // 如果登上来的是派出所 发起单位显示成大队
      }
    }
    if (sessionStorage.getItem(this.$route.path)) {
      const param = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.pageOperationType = param.type
      this.category = param.category
      if (param.category === '3') {
        this.btnText = '下 发'
      } else if (param.category === '2') {
        this.btnText = '申 请'
      }
      if (param.id) {
        if (this.pageOperationType !== 'reApply') {
          this.caseAssistForm.id = param.id
        }
        this.editId = param.id
        this.getAuditDept()
      } else {
        this.getAuditDept()
        this.initNumber()
      }
      if (param.caseName && param.caseId) { // 案件档案跳转过来的
        this.queryCase(param.caseName)
        this.caseAssistForm.caseId = Number(param.caseId)
        this.caseAssistForm.caseName = param.caseName
      }
    } else {
      this.initNumber()
    }
  }
}
</script>

<style>
  .caseAssist_edit .assistCard {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
  .caseAssist_edit .el-upload.el-upload--text, .caseAssist_edit .el-upload-dragger{
    width: 100%;
  }
  .caseAssist_edit .el-col-11{
    width: 47.83333%;
  }
  .caseAssist_edit .el-form .el-cascader.el-cascader--small,
  .caseAssist_edit .el-form .el-input.el-input--small,
  .caseAssist_edit .el-form .el-select.el-select--small,
  .caseAssist_edit .el-date-editor.el-input,
  .caseAssist_edit .el-date-editor.el-input__inner{
    width: 100%;
  }
  .caseAssist_edit .mar_top{
    margin-top:15px;
  }
  .caseAssist_edit .mar_left{
    margin-left: 46px;
  }
  .caseAssist_edit .mar_left_15{
    margin-left: 15px;
  }
  .caseAssist_edit .must .el-form-item__label:after {
    content: "*";
    color: #f56c6c;
    margin-left: 5px;
  }
  .distribute_clue .el-dialog__body{
    max-height: 550px;
  }
  .caseAssist_edit .caseAssist_distributeClue .dis_table_div{
    width: 100%;
    overflow: auto;
    max-height: 230px;
  }
  .caseAssist_edit .numStyle{
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
