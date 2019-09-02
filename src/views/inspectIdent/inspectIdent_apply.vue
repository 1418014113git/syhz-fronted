<template>
<div>
  <el-row class="inspect_apply">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
  </el-row>
  <el-card class="inspect_apply">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3 v-if="$route.params.id === '0'">
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">申请检验鉴定</p>
        </h3>
        <h3 v-else>
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">修改检验鉴定</p>
        </h3>
        <el-form :model="form" ref="form" :rules="rules" size="small" label-width="140px"> <!--:rules="rules"-->
          <el-form-item label="送检单位：" prop="copyDeptId">
            {{form.copyDeptName}}
          </el-form-item>
          <el-form-item label="主送：" prop="organizationId">
            <el-select :disabled="disabled" v-model="form.organizationId" placeholder="请选择" class="input_w">
              <el-option v-for="item in zsList" :key="item.id" :label="item.jgmc" :value="item.id">
                <p :title="item.jgmc" class="ellipsis-word" style="max-width: 500px;">{{item.jgmc}}</p>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检民警：" prop="copyPerson2">
            <el-select :disabled="disabled" multiple v-model="form.copyPerson2" filterable placeholder="请选择" class="input_w">
              <el-option v-for="item in personList1" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话：" prop="copyPersonPhone">
            <el-input :disabled="disabled" v-model="form.copyPersonPhone" auto-complete="off" class="input_w"
                      maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="案件：" prop="caseId">
            <el-select :disabled="disabled" v-model="form.caseId" filterable remote reserve-keyword
                       placeholder="输入案件名称搜索" :remote-method="queryCase" :loading="caseLoading"
                       @visible-change="caseVisible"
                       value-key="id" class="input_w">
              <el-option v-for="item in caseList" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检材名称：" prop="checkName">
            <el-input :disabled="disabled" v-model="form.checkName" auto-complete="off" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="送检要求：" prop="checkReason">
            <el-input :disabled="disabled" type="textarea" v-model="form.checkReason" auto-complete="off"
                      :autosize="{ minRows: 5, maxRows: 10}"></el-input>
          </el-form-item>
          <el-form-item label="有效期：" prop="dayNum">
            <el-input-number :disabled="disabled" v-model="form.dayNum" size="mini" :min="1" :max="50" label="有效期"></el-input-number>
            <span style="padding-left: 10px;">天</span>
          </el-form-item>
          <el-form-item label="公安厅联系人：" prop="cellPersonName">
            <el-select :disabled="disabled" v-model="form.cellPersonId" filterable placeholder="请选择" class="input_w" @change="cpChange">
              <el-option v-for="item in personList2" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联络电话：" prop="cellPersonPhone">
            <el-input :disabled="disabled" v-model="form.cellPersonPhone" auto-complete="off" class="input_w" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="审核单位：" prop="approveDept">
            <el-select :disabled="disabled" v-model="form.approveDept" placeholder="请选择" class="input_w">
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload :disabled="disabled" :action="uploadAction" class="upload-demo" drag multiple :auto-upload="true" :file-list="uploadImgs"
                       :on-success="imgSuccess"
                       :on-remove="imgRemove"
                       :on-preview="imgPreview"
                       :before-remove="imgBfRemove"
                       :before-upload="beforeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-show="!disabled">
            <el-button type="primary" @click="onSubmit(false)" v-if="$isViewBtn('104007')"
                       v-loading.fullscreen.lock="saveLoading">保 存
            </el-button>
            <el-button type="primary" @click="onSubmit(true)" v-if="$isViewBtn('104008')"
                       v-loading.fullscreen.lock="saveLoading">提 交
            </el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
  import {
    getCheckOrgList, addAuthenticate, getAuthenticate, editAuthenticate, assistreject, addAuthenticateFlow
  } from '@/api/inspectIdent'
  import {
    getSessionDeptSelect, getUsersByDep
  } from '@/api/depts'
  import { getParentDeptArray } from '@/api/dept'

  export default {
    name: 'edit',
    data() {
      return {
        saveLoading: false,
        uploadAction: this.UploadAttachment.uploadFileUrl,
        form: {
          organizationId: '',
          organizationName: '',
          copyDeptId: '',
          copyDeptName: '',
          copyPerson: '',
          copyPerson2: [],
          copyPersonPhone: '',
          caseId: '',
          caseName: '',
          checkName: '',
          checkReason: '',
          cellPersonId: null,
          cellPersonName: '',
          cellPersonPhone: '',
          approveDept: null,
          dayNum: 1,
          attachment: '',
          status: 0,
          enable: 1,
          copyPersonIds: ''
        },
        curDept: {},
        curUser: {},
        zsList: [],
        deptList: [],
        personList1: [],
        personList2: [],
        ajsyhList: [],
        disabled: false,
        uploadImgs: [],
        caseList: [],
        caseList2: [],
        caseLoading: false,
        rules: {
          organizationId: [{ required: true, message: '请选择主送', trigger: 'change' }],
          copyPersonPhone: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[1][345678][0-9]{9}$/
              if (!reg.test(value)) {
                callback(new Error('请输入11位正确的手机号码'))
              } else {
                callback()
              }
            }
          }],
          cellPersonPhone: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[1][345678][0-9]{9}$/
              if (!reg.test(value)) {
                callback(new Error('请输入11位正确的手机号码'))
              } else {
                callback()
              }
            }
          }],
          copyDeptId: [{ required: true, message: '请选择送检单位', trigger: 'change' }],
          copyPerson2: [{ required: true, message: '请选择送检民警', trigger: 'change' }],
          caseId: [{ required: true, message: '请选择案件', trigger: 'change' }],
          checkName: [{ required: true, message: '请输入检材名称', trigger: 'blur' }],
          checkReason: [
            {
              required: true, message: '请输入送检要求', trigger: 'blur'
            },
            {
              max: 40000, message: '内容过长请修改内容', trigger: 'blur'
            }
          ],
          cellPersonName: [{ required: true, message: '请输入公安厅联系人', trigger: 'blur' }],
          approveDept: [{ required: false, message: '请选择审核单位', trigger: 'change' }],
          dayNum: [{ required: true, message: '请输入有效期', trigger: 'blur' }]
        }
      }
    },
    methods: {
      cpChange(val) {
        for (let i = 0; i < this.personList2.length; i++) {
          if (val === this.personList2[i].value) {
            this.form.cellPersonName = this.personList2[i].name
            this.form.cellPersonPhone = this.personList2[i].phone
            return true
          }
        }
      },
      caseVisible(flag) {
        if (!flag) {
          this.caseList = []
        }
      },
      sortParam() {
        const form = this.form
        this.zsList.forEach(function(item) {
          if (item.id === form.organizationId) {
            form.organizationName = item.jgmc
          }
        })
        this.deptList.forEach(function(item) {
          if (item.id === form.copyDeptId) {
            form.copyDeptName = item.name
          }
        })
        form.copyPerson = ''
        form.copyPersonIds = ''
        this.personList1.forEach(function(item) {
          form.copyPerson2.forEach(function(itemsub) {
            if (itemsub === item.value) {
              form.copyPerson += item.name + ','
              form.copyPersonIds += item.value + ','
            }
          })
        })
        form.copyPerson = form.copyPerson.substring(0, form.copyPerson.lastIndexOf(','))
        form.copyPersonIds = form.copyPersonIds.substring(0, form.copyPersonIds.lastIndexOf(','))
        this.caseList2.forEach(function(item) {
          if (item.id === form.caseId) {
            form.caseName = item.AJMC
          }
        })
      },
      onSubmit(flag) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.saveLoading = true
            this.sortParam()
            this.handleImg()
            if (this.form.id) {
              if (flag) {
                if (String(this.form.status) === '2') {
                  this.form.status = 1
                  this.form.type = '0006'
                  this.handlecheckDept()
                  this.rejectAndFlow()
                } else {
                  this.form.status = 1
                  this.handlecheckDept()
                  this.updAndFlow()
                }
              } else {
                this.onlyUpd()
              }
            } else {
              this.form.status = flag ? 1 : 0
              if (flag) {
                this.handlecheckDept()
                this.saveFlow()
              } else {
                this.onlySave()
              }
            }
          } else {
            return false
          }
        })
      },
      handlecheckDept() {
        if (!this.form.approveDept || this.form.approveDept === '') {
          this.form.status = 6 // 结果反馈中
          this.form.approveDept = null
          this.form.approveDeptName = null
        } else {
          this.handleDept()
        }
      },
      onlySave() {
        addAuthenticate(this.form).then((response) => {
          this.resReturn(response, '申请成功')
        })
      },
      saveFlow() {
        addAuthenticateFlow(this.form).then((response) => {
          this.resReturn(response, '提交成功')
        })
      },
      resReturn(res, message) {
        if (res.code === '000000') {
          this.saveLoading = false
          this.$message({
            message: message, type: 'success'
          })
          this.toList()
        }
      },
      onlyUpd() {
        this.form.status = 0
        editAuthenticate(this.form).then((res) => {
          this.resReturn(res, '修改成功')
        })
      },
      updAndFlow() {
        this.form.skip = 'true'
        this.form.serverId = this.form.id
        addAuthenticateFlow(this.form).then((res) => {
          this.resReturn(res, '修改成功')
        })
      },
      rejectAndFlow() {
        assistreject(this.form).then((res) => {
          this.resReturn(res, '修改成功')
        })
      },
      queryCase(val) {
        if (!val) {
          return false
        }
        this.caseLoading = true
        this.$query('searchsyhaj', {
          ajmc: val,
          depCode: this.curDept.depCode
        }).then((response) => {
          this.caseLoading = false
          if (response.data) {
            this.caseList = response.data
            this.caseList2 = response.data
          }
        }).catch(() => {
          this.caseLoading = false
        })
      },
      toList() {
        this.$router.push({ path: '/inspectIdent/list' })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      handleDept() {
        for (let i = 0; i < this.deptList.length; i++) {
          if (this.deptList[i]['id'] === this.form.approveDept) {
            this.form.approveDeptName = this.deptList[i]['name']
            return true
          }
        }
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
      handleImg() {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.form.attachment = JSON.stringify(arr)
      },
      initList() {
        getCheckOrgList().then((response) => {
          this.zsList = response.data
        })
        this.deptList = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
        const deptcode = this.curDept.depCode
        if (deptcode) {
          this.getUsers1(deptcode.substring(0, 8))
        }
        this.getUsers2()
      },
      getUsers1(deptcode) {
        getUsersByDep([deptcode]).then((response) => {
          if (response.data && response.data.length > 0) {
            const data = response.data
            const list = []
            data.forEach((item) => {
              list.push({
                value: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
              })
            })
            this.personList1 = list
          }
        })
      },
      getUsers2() {
        getUsersByDep([15000053]).then((response) => {
          if (response.data && response.data.length > 0) {
            const data = response.data
            const list = []
            data.forEach((item) => {
              list.push({
                value: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
              })
            })
            this.personList2 = list
          }
        })
      },
      detail(id) {
        // 查询详情
        getAuthenticate({
          id: id
        }).then((response) => {
          this.queryCase(response.data.caseName)
          this.form.id = response.data.id
          this.form.organizationName = response.data.organizationName
          this.form.copyDeptId = response.data.copyDeptId
          this.form.copyDeptName = response.data.copyDeptName
          this.form.copyPerson = response.data.copyPerson
          this.form.copyPersonPhone = response.data.copyPersonPhone
          this.form.caseId = response.data.caseId
          this.form.caseName = response.data.caseName
          this.form.checkName = response.data.checkName
          this.form.checkReason = response.data.checkReason
          this.form.cellPersonId = response.data.cellPersonId
          this.form.cellPersonName = response.data.cellPersonName
          this.form.cellPersonPhone = response.data.cellPersonPhone
          this.form.approveDept = response.data.approveDept
          this.form.dayNum = response.data.dayNum
          this.form.attachment = response.data.attachment
          this.form.status = response.data.status
          this.form.enable = response.data.enable
          this.form.copyPersonIds = response.data.copyPersonIds
          if (response.data.organizationId) {
            this.form.organizationId = response.data.organizationId + ''
          }
          if (response.data.copyPersonIds) {
            this.form.copyPerson2 = response.data.copyPersonIds.split(',')
            for (let i = 0; i < this.form.copyPerson2.length; i++) {
              this.form.copyPerson2[i] = parseInt(this.form.copyPerson2[i])
            }
          }
          if (response.data.attachment) {
            this.form.attachment = response.data.attachment
            this.uploadImgs = JSON.parse(this.form.attachment)
          }
        })
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.form.copyDeptId = this.curDept.id
      this.form.copyDeptName = this.curDept.depName
      this.form.applyDeptId = this.curDept.id
      this.form.applyDeptName = this.curDept.depName
      this.form.applyPersonId = this.curUser.id
      this.form.applyPersonName = this.curUser.realName
      this.form.copyPerson2.push(this.curUser.id)
      this.form.copyPersonPhone = this.curUser.phone
      this.initList()
      if (this.$route.params.id !== '0') {
        this.detail(this.$route.params.id)
      }
      if (this.$route.query.disabled) {
        this.disabled = this.$route.query.disabled
      }
    }
  }
</script>

<style scoped>
  .inspect_apply {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .inspect_apply h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .inspect_apply .input_w {
    width: 100%;
  }

  .inspect_apply .el-form-item {
    margin-bottom: 18px;
  }

</style>
