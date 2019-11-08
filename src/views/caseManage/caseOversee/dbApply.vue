<template>
  <div>
    <el-row class="dbedit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="cancel">   <!--返回-->
    </el-row>
    <el-card class="dbedit">
    <el-row type="flex" justify="center" v-loading="formLoading">
      <el-col :span="20">
        <!-- <h3 class="assist_form">申请案件督办</h3> -->
        <el-form ref="dbForm" :model="dbBean" :rules="rules" label-width="120px" v-loading="formLoading">
          <el-form-item label="督办案件" prop="caseId">
            <el-select v-model="dbBean.caseId" filterable clearable remote reserve-keyword
                       placeholder="请输入案件名称或者案件编号搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible" @change="caseChange"
                       value-key="id" class="db_create_input">
              <el-option v-for="item in dbajData" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办级别">
            <el-select v-model="dbBean.superviseLevel" placeholder="请选择督办级别" class="db_create_input" :disabled="true">
              <el-option v-for="item in $getDicts('dbjb')" :key="item.dictKey" :label="item.dictName" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办负责人" prop="supervisePersonId">
            <el-select v-model="dbBean.supervisePersonId" placeholder="请选择督办负责人" filterable class="db_create_input" @change="fzrChange">
              <el-option v-for="(item,index) in userData" :key="item.id + index" :label="item.name + ' (' + item.userName + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人电话" prop="checkName">
            <el-input v-model="dbBean.personLiablePhone" auto-complete="off" class="db_create_input" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="申请原因" prop="superviseDesc">
            <vue-editor v-model="dbBean.superviseDesc" useCustomImageHandler @imageAdded="handleImageAdded" style="width: 100%; min-width: 500px;"></vue-editor>
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
            <el-input type="password" v-model="dbBean.secretCode" class="db_create_input" maxlength="500"></el-input>
          </el-form-item>
          <el-form-item label="审核单位" prop="superviseExamDeptId">
            <el-select v-model="dbBean.superviseExamDeptId" placeholder="请选择部门" class="db_create_input" @change="deptChange">
              <el-option v-for="(item,index) in exDeptData" :key="item.id + index" :label="item.departName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="handleSave" v-loading.fullscreen.lock="formLoading">保存</el-button>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit" v-loading.fullscreen.lock="formLoading">申请</el-button> -->
            <!-- <p style="font-size: 12px; color: #ffffff">申请后将不能修改和删除</p> -->
            <el-col :span="24" align="center">
              <el-button size="mini" @click="handleSave('departmentForm')" class="saveBtn" :loading="formLoading">保存</el-button>
              <el-button size="mini" @click="handleCancel()" class="cancelBtn" :loading="formLoading">取消</el-button>
              <el-button size="mini" @click="handleSubmit('departmentForm')" class="saveBtn" :loading="formLoading" >申请</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
import {
  addSupervise, editSupervise, getDBCase, dbOnlySave, superviseReject
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
      dbBean: {
        caseId: null,
        dbName: null,
        superviseLevel: null,
        supervisePersonId: null,
        superviseExamDeptId: null,
        superviseDesc: ''
      },
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        caseId: [{
          required: true, message: '请选择督办案件', trigger: 'change'
        }],
        superviseLevel: [{
          required: true, message: '请选择督办级别', trigger: 'change'
        }],
        supervisePersonId: [{
          required: false, message: '请选择督办负责人', trigger: 'change'
        }],
        superviseExamDeptId: [{
          required: true, message: '请选择审核部门', trigger: 'change'
        }],
        dbName: [{
          required: true, message: '请输入督办名称', trigger: 'blur'
        }, {
          min: 3, max: 100, message: '长度在 3 到 100 个字', trigger: 'blur'
        }],
        superviseDesc: [{
          required: true, message: '请输入督办说明', trigger: 'blur'
        }, {
          min: 5, max: 500, message: '长度在 5 到 500 个字', trigger: 'blur'
        }]
      }
    }
  },
  components: {
    VueEditor
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
            this.dbBean.caseNumber = this.dbajData[i]['AJBH'] // 案件编号
            this.dbBean.caseCreateTime = this.dbajData[i]['LARQ'] // 立案时间
            this.dbBean.caseName = this.dbajData[i]['AJMC'] // 案件名称
            this.dbBean.caseType = this.dbajData[i]['AJLB1'] // 案件类型
            return true
          }
        }
      } else {
        this.dbBean.caseNumber = null
        this.dbBean.caseCreateTime = null
        this.dbBean.caseName = null
        this.dbBean.caseType = null
      }
    },
    fzrChange(val) { // 督办负责人
      this.userData.forEach((item, i) => {
        if (item.id === val) {
          this.dbBean.supervisePersonId = item.id // 督办人id
          this.dbBean.supervisePerson = item.name // 督办人姓名
          this.dbBean.personLiablePhone = item.phone // 负责人电话
          return true
        }
      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['id']) {
            this.dbBean.superviseExamDeptId = this.exDeptData[i]['id'] // 部门id
            this.dbBean.superviseExamDept = this.exDeptData[i]['departName'] // 部门名称
            this.dbBean.superviseDeptCode = this.exDeptData[i]['departCode'] // 部门code
            this.dbBean.superviseAreaCode = this.exDeptData[i]['areaCode'] // 行政区划
            return true
          }
        }
      } else {
        this.dbBean.superviseExamDeptId = null
        this.dbBean.superviseExamDept = null
        this.dbBean.superviseDeptCode = null
        this.dbBean.superviseAreaCode = null
      }
    },
    handleCancel() { // 表单取消
      this.cancel()
    },
    handleSave() { // 保存
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          if (this.dbBean.id) {
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
          if (this.dbBean.id) {
            this.dbEdit(1)
          } else {
            this.dbSave(1)
          }
        }
      })
    },
    dbEdit(state) {
      const req = this.dbBean
      req.userName = this.userInfo.userName
      req.userId = this.userInfo.userId
      if (this.dbBean.category === 'apply') {
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
      const req = this.dbBean
      req.status = state // 区分按钮 0保存草稿 1申请 待审核
      req.applyPersonId = this.userInfo.id // 申请人id
      req.applyPersonName = this.userInfo.realName // 申请人姓名
      req.applyDeptId = this.deptInfo.id // 申请人部门
      req.applyDeptName = this.deptInfo.depName // 申请人部门名称
      req.applyDeptCode = this.deptInfo.depCode // 申请人部门code
      // req.userId = this.userInfo.id
      // req.userName = this.userInfo.realName
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
        this.dbBean.attachment = arr.join('|') // 这里不能用逗号
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
    caseVisible(flag) {
      if (!flag) {
        this.dbajData = []
      }
    },
    queryCase(val) {
      if (!val) {
        this.dbajData = []
        return false
      }
      this.caseLoading = true
      this.$query('casesuprlaj', {
        ajmc: val, // 案件名称 或 案件编号
        departCode: this.deptInfo.depCode
      }).then((response) => {
        this.caseLoading = false
        if (response.data.length > 0) {
          this.dbajData = response.data
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    initEdit() {
      this.formLoading = true
      // 查询督办详情
      this.$query('dbaj/' + this.$route.params.id, {}).then(response => {
        this.formLoading = false
        const data = response.data
        this.dbBean.id = data.id
        this.dbBean.applyPersonId = data.apply_person_id
        this.dbBean.applyPersonName = data.apply_person_name
        this.dbBean.applyDeptId = data.apply_dept_id
        this.dbBean.applyDeptName = data.apply_dept_name
        this.dbBean.status = data.status
        this.dbBean.superviseLevel = data.supervise_level
        this.dbBean.superviseDesc = data.supervise_desc
        this.dbBean.superviseExamDept = data.supervise_exam_dept
        this.dbBean.superviseExamDeptId = Number(data.supervise_exam_dept_id)
        this.dbBean.supervisePersonId = data.supervise_person_id
        this.dbBean.supervisePerson = data.supervise_person
        this.dbBean.userId = data.apply_person_id
        this.dbBean.userName = data.apply_person_name
        this.dbBean.dbName = data.db_name
        this.dbBean.personLiablePhone = data.person_liable_phone

        for (let i = 0; i < response.data.enclosure.length; i++) { // 附件
          const item = response.data.enclosure[i]
          this.uploadFiles.push({
            name: item.enName + item.enClass,
            url: item.enPathOld
          })
        }
        getDBCase({
          caseId: data.case_id
        }).then((response) => {
          this.formLoading = false
          if (response.data) {
            this.dbajData = response.data
            this.queryCase(this.dbajData[0]['AJMC'])
            this.dbBean.caseId = Number(data.case_id)
          }
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
        this.formLoading = false
      })
    },
    getUsers(deptcode) { // 查部门下面的人员
      getUsersByDep(deptcode).then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data
          const list = []
          data.forEach((item) => {
            list.push({
              id: item.id + '', name: item.real_name, userName: item.user_name, phone: item.phone
            })
          })
          this.userData = list
          this.fzrChange(this.userInfo.id + '')
        }
      })
    },
    getDepts() {
      // this.exDeptData = getParentDeptArray(getSessionDeptSelect(), this.deptInfo.parentDepCode)
      // const level = getDeptLevel(this.deptInfo.depCode)
      // this.dbBean.superviseLevel = String(level + 1)
      this.dbBean.superviseLevel = this.deptInfo.depType
      var paramCode = ''
      if (this.deptInfo.depType === '4') { // 派出所
        paramCode = this.deptInfo.parentDepCode
      } else {
        paramCode = this.deptInfo.depCode
      }
      // 查审核单位 自己的上级
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.exDeptData = [response.data]
        }
      }).catch(() => {
        this.caseLoading = false
      })
    }
  },
  mounted() {
    // 查审核单位
    this.getDepts()
    // let deptcode = []
    // if (Number(this.dbBean.superviseLevel) === 2 || Number(this.dbBean.superviseLevel) === 3) {
    //   deptcode = [61000053]
    // }
    // if (Number(this.dbBean.superviseLevel) === 4) {
    //   deptcode = [this.deptInfo.parentDepCode.substring(0, 8)]
    // }

    // 查督办负责人
    if (this.deptInfo.depType === '4') { // 派出所
      this.getUsers([this.deptInfo.parentDepCode])
    } else {
      this.getUsers([this.deptInfo.depCode])
    }

    if (this.$route.params.id) { // 编辑
      this.initEdit()
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
    //         this.dbBean.caseId = Number(this.$route.query.caseId)
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
