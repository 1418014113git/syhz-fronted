<template>
<div>
    <el-row class="report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
    </el-row>
    <el-card class="report">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3>
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">集群战役信息</p>
        </h3>
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="160px">
          <el-form-item label="集群战役名称：" prop="assistTitle">
            <el-input v-model="form.assistTitle" auto-complete="off" clearable maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="时间范围：" prop="dateRand">
            <el-date-picker v-model="dateRand" type="daterange" range-separator="至"  class="input_w"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="dateChange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="参与部门：" prop="selectedDepts">
            <el-collapse>
              <el-collapse-item title="选择部门" name="1">
                <div class="dept-tree">
                  <el-tree class="filter-tree" :data="depData" :props="{children: 'children',label: 'name'}" default-expand-all
                           ref="depTree"
                           highlight-current show-checkbox check-strictly @check-change="menuChange"
                           :expand-on-click-node="false" node-key="id"
                           style="margin-top: 5px;">
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="审核部门：" v-if="saveType==='approve'" prop="approveDept">
            <el-select v-model="form.approveDept" placeholder="请选择部门"  class="input_w" clearable @change="deptChange">
              <el-option v-for="item in exDeptData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人员：">
            <el-select v-model="dutyPerson" multiple placeholder="请选择" filterable class="input_w" clearable>
              <el-option v-for="item in userData1" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参与人员：">
            <el-select v-model="partakePerson" multiple placeholder="请选择" filterable class="input_w" clearable>
              <el-option v-for="item in userData2" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务案件：">
            <el-select v-model="form.caseId" filterable remote reserve-keyword placeholder="输入案件名称搜索" @change="ajChange"
              :remote-method="queryCase" @visible-change="caseVisible" value-key="id" clearable ref="ajSelect" :loading="caseLoading" style="width:100%">
              <el-option v-for="item in caseList" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="任务线索">-->
          <!--<el-select-->
          <!--v-model="form.task_key"-->
          <!--multiple-->
          <!--filterable-->
          <!--remote-->
          <!--reserve-keyword-->
          <!--placeholder="输入标题搜索"-->
          <!--:remote-method="getIntell"-->
          <!--:loading="intellLoading"-->
          <!--@visible-change="intellVisible"-->
          <!--value-key="id" style="width:100%">-->
          <!--<el-option-->
          <!--v-for="item in intellData"-->
          <!--:key="item.id"-->
          <!--:label="item.BT+' ('+item.XSXXBH+')'"-->
          <!--:value="item">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="集群战役内容：" prop="assistContent">
            <vue-editor v-model="form.assistContent" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
          </el-form-item>
          <el-form-item label="上传附件：" style="margin-top: 15px;">
            <el-upload class="upload-demo" drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="attachment"
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
          <el-form-item>
            <el-button type="primary" @click="edit(false)" v-if="$isViewBtn('101007')" >保 存</el-button>
            <el-button type="primary" @click="edit(true)"  v-if="$isViewBtn('101008')">{{btnText}}</el-button>
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
  add, edit, getOne, saveInge, reject
} from '@/api/investigation'
import {
  parseTime
} from '@/utils/index'
import VueEditor from '@/components/Editor/VueEditor'
import {
  getUsersByDep, getSessionDeptSelect
} from '@/api/depts'
/*
import {
  getIntellList
} from '@/api/intellSystem'
*/
// import {
//   getCaseList
// } from '@/api/casePage'
import {
  uploadImg
} from '@/utils/editorUpload'
import { getTJXJ, getParentDeptArray } from '@/api/dept'

export default {
  name: 'add',
  components: {
    VueEditor
  },
  data() {
    return {
      saveType: '',
      btnText: '',
      dateRand: [],
      intellQuery: {
        BT: ''
      },
      intellData: [],
      intellTotal: 0,
      caseDialog: false,
      intellLoading: false,
      caseLoading: false,
      selectedDepts: [],
      dutyPerson: [],
      partakePerson: [],
      depData: [],
      exDeptData: [],
      deptProps: {
        value: 'id',
        label: 'name'
      },
      userData1: [],
      userData2: [],
      caseList: [],
      form: {
        assistTitle: '',
        startDate: '',
        endDate: '',
        partakeDept: '',
        assistContent: '',
        dutyPerson: '',
        partakePerson: '',
        task_key: [],
        caseId: '',
        status: '0',
        approveDept: '',
        partakeDeptIds: ''
      },
      attachment: [],
      uploadAction: this.UploadAttachment.uploadFileUrl,
      curDept: {},
      curUser: {},
      rules: {
        assistTitle: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg1 = /^[\s\S]*$/ // 任意字符
            if (value.length < 1) {
              callback(new Error('请输入集群战役名称'))
            } else if (value.length > 100) {
              callback(new Error('集群战役名称不能超过100字'))
            } else if (!reg1.test(value)) {
              callback(new Error('请输入正确的集群战役名称'))
            } else {
              callback()
            }
          }
        }],
        assistContent: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入正确的集群战役内容'))
            } else {
              callback()
            }
          }
        }],
        dateRand: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!this.dateRand || this.dateRand.length < 2) {
              callback(new Error('请选择时间范围'))
            } else {
              callback()
            }
          }
        }],
        selectedDepts: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!this.selectedDepts || this.selectedDepts.length === 0) {
              callback(new Error('请勾选参与部门'))
            } else {
              callback()
            }
          }
        }],
        approveDept: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!this.form.approveDept) {
              callback(new Error('请选择审核部门'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    ajChange(val) {
      if (val) {
        for (let i = 0; i < this.caseList.length; i++) {
          if (val === this.caseList[i].id) {
            this.form.caseName = this.caseList[i].AJMC
            return true
          }
        }
      } else {
        this.form.caseId = ''
        this.form.caseName = ''
      }
    },
    dateChange(val) {
      this.form.startDate = val[0]
      this.form.endDate = val[1]
    },
    menuChange(value, isChecked) {
      if (isChecked) {
        this.selectedDepts.push({
          id: value.id, name: value.name, depCode: value.depCode, parentCode: value.parentCode
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
      this.getUsers2()
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['id']) {
            this.form.approveDeptName = this.exDeptData[i]['name']
            return true
          }
        }
      } else {
        this.form.approveDept = null
        this.form.approveDeptName = null
      }
    },
    detail() {
      const para = {
        id: this.$route.params.id
      }
      getOne(para).then((response) => {
        const data = response.data
        const arr = []
        JSON.parse(data.partake_dept).forEach((item, index) => {
          arr.push(item.id)
        })
        this.$refs.depTree.setCheckedKeys(arr)

        if (data.duty_person) {
          this.dutyPerson = JSON.parse(data.duty_person)
        }
        if (data.partake_person) {
          this.partakePerson = JSON.parse(data.partake_person)
        }
        if (data.attachment) {
          this.attachment = JSON.parse(data.attachment)
        }
        this.form = {
          id: data.id,
          assistTitle: data.assist_title,
          startDate: data.start_date,
          endDate: data.end_date,
          partakeDept: data.partake_dept,
          assistContent: data.assist_content,
          dutyPerson: data.dutyPerson,
          partakePerson: data.partakePerson,
          attachment: data.attachment,
          status: data.status,
          caseId: data.case_id,
          caseName: data.case_name
        }
        this.dateRand = [data.start_date, data.end_date]
        if (data.clue_json) {
          this.form.task_key = JSON.parse(data.clue_json)
        } else {
          this.form.task_key = []
        }
        if (data.approve_dept && data.approve_dept !== '') {
          this.form.approveDept = Number(data.approve_dept)
          this.form.approveDeptName = data.approve_dept_name
          this.btnText = '提交申请'
          this.saveType = 'approve'
        } else {
          this.btnText = '下发'
          this.saveType = ''
        }
        if (data.case_name) {
          this.queryCase(data.case_name)
        }
      })
    },
    edit(flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.startDate = parseTime(this.form.startDate, '{y}-{m}-{d} {h}:{i}:{s}')
          this.form.endDate = parseTime(this.form.endDate, '{y}-{m}-{d} {h}:{i}:{s}')
          this.form.partakeDept = this.selectedDepts.length > 0 ? JSON.stringify(this.selectedDepts) : ''
          this.form.dutyPerson = this.dutyPerson.length > 0 ? JSON.stringify(this.dutyPerson) : ''
          this.form.partakePerson = this.partakePerson.length > 0 ? JSON.stringify(this.partakePerson) : ''
          this.form.userId = this.curUser.id
          this.form.userName = this.curUser.realName
          this.handleDepts()
          this.handleImg()
          this.eachBean()
          if (this.$route.params.id) { // 修改
            this.form.id = this.$route.params.id
            if (flag) {
              if (this.form.status === '2') {
                this.form.type = '0004'
                this.rejectAndFlow()
              } else {
                this.editAndFlow()
              }
            } else {
              this.onlyEdit()
            }
          } else { // 添加
            this.form.bizType = 4
            this.form.action = '添加全国性协查'
            this.form.status = flag ? 1 : 0
            if (flag) {
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
    handleDepts() {
      const arr = []
      if (this.selectedDepts.length > 0) {
        this.selectedDepts.forEach((item) => {
          arr.push('[' + item.id + ']')
        })
      }
      this.form.partakeDeptIds = arr.join(',')
    },
    onlySave() {
      saveInge(this.form).then((res) => {
        this.resReturn(res, '新增成功')
      })
    },
    saveFlow() {
      add(this.form).then((res) => {
        this.resReturn(res, '新增成功')
      })
    },
    resReturn(res, message) {
      if (res.code === '000000') {
        this.listLoading = false
        this.$message({
          message: message,
          type: 'success'
        })
        this.resetForm('form')
        this.toList()
      }
    },
    onlyEdit() {
      this.form.status = 0
      edit(this.form).then((res) => {
        this.resReturn(res, '修改成功')
      })
    },
    editAndFlow() {
      this.form.skip = 'true'
      this.form.serverId = this.form.id
      this.form.status = 1
      add(this.form).then((res) => {
        this.resReturn(res, '修改成功')
      })
    },
    rejectAndFlow() {
      reject(this.form).then((res) => {
        this.resReturn(res, '修改成功')
      })
    },
    toList() {
      // this.$router.back(-1)
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
        this.toList()
      })
    },
    handleImg() {
      if (this.attachment.length > 0) {
        const arr = []
        for (let i = 0; i < this.attachment.length; i++) {
          const img = this.attachment[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.form.attachment = JSON.stringify(arr)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.selectedDepts = []
      this.dutyPerson = []
      this.partakePerson = []
      this.form.caseId = ''
      this.dateRand = []
      this.$refs.depTree.setCheckedKeys([])
    },
    getDepts() {
      this.depData = getTJXJ(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
      this.exDeptData = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
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
          this.userData1 = list
        }
      })
    },
    getUsers2() {
      const codes = []
      for (let i = 0; i < this.selectedDepts.length; i++) {
        codes.push(this.selectedDepts[i]['depCode'].substring(0, 8))
      }
      if (codes.length < 1) {
        this.userData2 = []
        return false
      }
      getUsersByDep(codes).then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data
          const list = []
          data.forEach((item) => {
            list.push({
              value: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
            })
          })
          this.userData2 = list
        }
      })
    },
    eachBean() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      const intellSelected = this.form.task_key
      this.form.applyPersonId = this.curUser.id
      this.form.applyPersonName = this.curUser.realName
      this.form.applyDeptId = this.curDept.id
      this.form.applyDeptName = this.curDept.depName
      if (intellSelected) {
        const arr = []
        for (let i = 0; i < intellSelected.length; i++) {
          arr.push({
            id: intellSelected[i]['id'], BT: intellSelected[i]['BT']
          })
          this.form.clueJson = JSON.stringify(arr)
        }
      }
      this.form.task_key = ''
    },
    // getIntell(val) {
    //   if (!val) {
    //     return false
    //   }
    //   this.intellLoading = true
    //   const para = {}
    //   // if (/^\d*$/.test(val)) {
    //   //   para.XSXXBH = val
    //   // } else {
    //   para.BT = val
    //   // }
    //   getIntellList(para).then((response) => {
    //     this.intellLoading = false
    //     this.intellData = response.data
    //   })
    // },
    // intellVisible(flag) {
    //   if (!flag) {
    //     this.intellData = []
    //   }
    // },
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
        }
      })
    },
    caseVisible(flag) {
      if (!flag) { // 关闭时清空数据
        this.caseList = []
      }
    },
    imgSuccess(res, file, fileList) {
      this.attachment = fileList
    },
    imgRemove(file, fileList) {
      this.attachment = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {
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
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((response) => {
        if (response.code === '000000') {
          Editor.insertEmbed(cursorLocation, 'image', response.data)
          resetUploader()
        }
      }).catch((e) => { })
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getDepts()
    if (this.$route.params.id) {
      this.detail()
    }
    const deptcode = this.curDept.depCode
    if (deptcode) {
      this.getUsers1(deptcode.substring(0, 8))
    }
    if (this.$route.query.caseName && this.$route.query.caseId) {
      if (!isNaN(Number(this.$route.query.caseId)) && Number(this.$route.query.caseId) !== 0) {
        // this.form.caseId = this.$route.query.caseId
        this.form.caseName = this.$route.query.caseName
        this.queryCase(this.$route.query.caseName)
      }
    }
    if (sessionStorage.getItem(this.$route.path)) {
      var carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      this.saveType = carryParam.type || ''
      if (carryParam.type === '') {
        this.btnText = '下发'
      } else {
        this.btnText = '提交申请'
      }
      if (carryParam.caseName && carryParam.caseId) { // 案件档案跳转过来的
        this.form.caseId = Number(carryParam.caseId)
        this.form.caseName = carryParam.caseName
        this.queryCase(carryParam.caseName)
      }
    }
  }
}
</script>

<style scoped>
.report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}

.report h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}

.report .input_w {
  width: 100%;
  min-width: 150px;
}

.report .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}

.report .el-collapse-item__header {
  color: #409eff;
}
</style>
