<template>
 <div>
  <el-row class="assist">
    <img src="@/assets/icon/back.png"  class="goBack" @click="backList">   <!--返回-->
 </el-row>
  <el-card class="assist">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3>
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">协查信息</p>
        </h3>
        <el-form :model="assist" size="small" ref="form" :rules="rules" label-width="140px">
          <el-form-item label="发起人：">
            {{assist.applyPersonName}}
          </el-form-item>
          <el-form-item label="发起部门：">
            {{assist.applyDeptName}}
          </el-form-item>
          <el-form-item label="协查案件：" prop="caseId">
            <el-select v-model="assist.caseId" filterable clearable remote reserve-keyword
                       placeholder="输入案件名称搜索" :remote-method="queryCase" :loading="caseLoading" @visible-change="caseVisible"
                       value-key="id" style="width:100%">
              <el-option v-for="item in caseList" :key="item.id" :label="item.AJMC+' ('+item.AJBH+')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="协查内容：" prop="assistContent">
            <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容"
                      v-model="assist.assistContent" :disabled="noauth">
            </el-input>
          </el-form-item>
          <el-form-item label="协查级别：" prop="assistType">
            <el-select v-model="assist.assistType" placeholder="请选择" class="input_w" clearable :disabled="noauth" @change="levelChange">
              <el-option v-for="item in assistLevel"
                         :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期：" prop="startTime">
            <el-date-picker v-model="assist.startTime" type="datetime"
                            placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="input_w"
                            :disabled="timeDisable" @change="startChange" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="截止日期：" prop="endTime">
            <el-date-picker v-model="assist.endTime" type="datetime"
                            placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="input_w"
                            :disabled="timeDisable" @change="endChange" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="协查部门：" prop="assistDept">
            <el-collapse>
              <el-collapse-item title="选择部门" name="1">
                <div class="dept-tree">
                  <el-tree class="filter-tree" :data="depData" :props="{children: 'children',label: 'name'}" default-expand-all
                           ref="depTree1"
                           highlight-current show-checkbox check-strictly @check-change="checkDeptChange"
                           :expand-on-click-node="false" node-key="id"
                           style="margin-top: 5px;">
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <!-- <el-form-item label="协查负责人" prop="dutyPerson">
            <el-select v-model="assist.dutyPerson" placeholder="请选择" class="input_w" clearable :disabled="noauth">
              <el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.name"></el-option>
            </el-select>
          </el-form-item> -->
          <!--<el-form-item label="协查负责人电话" prop="dutyPersonPhone">-->
          <!--<el-input v-model="assist.dutyPersonPhone" placeholder="负责人电话" size="small" class="input_w" clearable-->
          <!--:disabled="noauth"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="发起人电话：" prop="dutyPersonPhone">
            <el-input v-model="assist.dutyPersonPhone" placeholder="发起人电话" size="small" class="input_w" clearable
                      :disabled="noauth" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="审核部门：" v-if="saveType==='approve'" prop="approveDept">
            <el-select v-model="assist.approveDept" placeholder="请选择部门"  class="input_w" clearable :disabled="noauth" @change="deptChange">
              <el-option v-for="item in exDeptData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload class="upload-demo" drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadImgs"
                       :on-success="imgSuccess"
                       :on-remove="imgRemove"
                       :on-preview="imgPreview"
                       :before-remove="imgBfRemove"
                       :before-upload="beforeUpload" :disabled="noauth">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="edit(false)" :disabled="noauth" v-if="$isViewBtn('100907')" >保 存</el-button>
            <el-button type="primary" @click="edit(true)" :disabled="noauth"  v-if="$isViewBtn('100908')" >{{btnText}}</el-button>
            <el-button size="small" @click="cancelEdit()" :disabled="noauth"  >取 消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
 </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import {
  addAssistCaseFlow, saveAssistCase, getAssistCase, editAssistCase, assistreject
} from '@/api/assistCase'
import {
  getSessionDeptSelect
} from '@/api/depts'
import {
  getAssistLevel
} from '@/utils/codetotext'
import {
  getAJJBXXSYHID
} from '@/api/caseManage'
import {
  getTJXJ, getParentDeptArray
} from '@/api/dept'

export default {
  name: 'assistEdit',
  components: {
    VueEditor
  },
  data() {
    return {
      timeDisable: true,
      uploadAction: this.UploadAttachment.uploadFileUrl,
      caseLoading: false,
      saveType: '',
      btnText: '',
      deptList: [],
      depData: [],
      exDeptData: [],
      assistLevel: getAssistLevel(),
      userData: [],
      caseList: [],
      caseList2: [],
      curUser: {},
      curDept: {},
      assist: {
        id: '',
        applyPersonId: '',
        applyPersonName: '',
        applyDeptId: '',
        applyDeptName: '',
        assistContent: '',
        assistType: '',
        assistDept: '',
        dutyPerson: '',
        dutyPersonPhone: '',
        approveDept: null,
        startTime: null,
        endTime: null,
        attachment: '',
        status: '',
        caseId: ''
      },
      uploadImgs: [],
      rules: {
        caseId: [{
          required: true, message: '请选择协查案件', trigger: 'change'
        }],
        assistContent: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
            if (value === '') {
              callback(new Error('请输入协查内容'))
            } else if (value.length > 40000) {
              callback(new Error('内容过长请修改内容'))
            } else {
              callback()
            }
          }
        }],
        assistType: [{
          required: true, message: '请选择协查级别', trigger: 'change'
        }],
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
        dutyPerson: [{
          required: true, message: '请选择负责人', trigger: 'change'
        }],
        approveDept: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!this.assist.approveDept) {
              callback(new Error('请选择审核部门'))
            } else {
              callback()
            }
          }
        }],
        dutyPersonPhone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[1][345678][0-9]{9}$/
            if (!reg.test(value)) {
              callback(new Error('请输入11位正确的手机号码'))
            } else {
              callback()
            }
          }
        }],
        startTime: [{
          required: true, trigger: ['change', 'blur'], message: '请选择开始时间'
        }],
        endTime: [{
          required: true, trigger: ['change', 'blur'], message: '请选择截止时间'
        }]
      },
      noauth: false,
      selectedDepts: []
    }
  },
  methods: {
    levelChange(val) {
      if (val) {
        this.timeDisable = false
      } else {
        this.timeDisable = true
        this.assist.startTime = null
        this.assist.endTime = null
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
          if (data === this.exDeptData[i]['id']) {
            this.assist.approveDeptName = this.exDeptData[i]['name']
            return true
          }
        }
      } else {
        this.assist.approveDept = null
        this.assist.approveDeptName = null
      }
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
    caseVisible(flag) {
      if (!flag) {
        this.caseList = []
      }
    },
    /*
    menuChange(value, isChecked) {
      if (isChecked) {
        this.deptList.push({
          id: value.id, name: value.name
        })
      } else {
        const index = this.deptList.indexOf({
          id: value.id, name: value.name
        })
        if (index > -1) {
          this.deptList.splice(index, 1)
        }
      }
    },
    */
    detail() {
      const para = {
        id: this.$route.params.id
      }
      getAssistCase(para).then((response) => {
        const data = response.data
        if (data) {
          this.assist = data
          if (this.assist.approveDept && this.assist.approveDept !== '' && this.assist.approveDept !== 0) { // 以前代码写的是0
            this.btnText = '提交申请'
            this.saveType = 'approve'
          } else {
            this.btnText = '下发'
            this.saveType = ''
            this.assist.approveDept = null
          }
          if (data.attachment) {
            this.uploadImgs = JSON.parse(data.attachment)
          }
          if (data.status === '0' || data.status === '2') {
            this.noauth = false
          } else {
            this.noauth = true
          }
          if (data.assistDeptId) {
            const selectedData = []
            const array = data.assistDeptId.replace(new RegExp(/\[/, 'gm'), '').replace(new RegExp(/\]/, 'gm'), '').split(',')
            for (let i = 0; i < array.length; i++) {
              selectedData.push(array[i])
            }
            this.$refs.depTree1.setCheckedKeys(selectedData)
          }
          this.findAjInfo(data.caseId)
        }
      })
    },
    // queryCase() {
    //   getCaseList({}).then((response) => {
    //     if (response.data.length > 0) {
    //       this.caseList = response.data
    //     }
    //   })
    // },
    edit(flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleImg()
          this.handleDepts()
          if (this.$route.params.id) { // 修改
            this.assist.id = this.$route.params.id
            if (flag) {
              if (this.assist.status === '2') {
                this.assist.type = '0005'
                this.rejectAndFlow()
              } else {
                this.editAndFlow()
              }
            } else {
              this.onlyEdit()
            }
          } else { // 添加
            this.assist.bizType = 5
            this.assist.action = '添加案件协查'
            this.assist.status = flag ? '1' : '0'
            this.assist.enable = 1
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
    onlySave() {
      saveAssistCase(this.assist).then((res) => {
        this.resReturn(res, '添加成功')
      })
    },
    saveFlow() {
      addAssistCaseFlow(this.assist).then((res) => {
        this.resReturn(res, '添加成功')
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
        this.backList()
      }
    },
    onlyEdit() {
      this.assist.status = 0
      editAssistCase(this.assist).then((res) => {
        this.resReturn(res, '修改成功')
      })
    },
    editAndFlow() {
      this.assist.skip = 'true'
      this.assist.serverId = this.assist.id
      this.assist.status = 1
      addAssistCaseFlow(this.assist).then((res) => {
        this.resReturn(res, '修改成功')
      })
    },
    rejectAndFlow() {
      assistreject(this.assist).then((res) => {
        this.resReturn(res, '修改成功')
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
        this.assist.attachment = JSON.stringify(arr)
      }
    },
    handleDepts() {
      for (let i = 0; i < this.selectedDepts.length; i++) {
        const data = this.selectedDepts[i]
        if (i === 0) {
          this.assist.assistDeptId = '[' + data.id + ']'
          this.assist.assistDept = data.name
        } else {
          this.assist.assistDeptId += ',[' + data.id + ']'
          this.assist.assistDept += ',' + data.name
        }
      }
    },
    backList() {
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
        this.backList()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // getUsers(id) {
    //   getUsersByDep(id).then((response) => {
    //     if (response.data && response.data.length > 0) {
    //       const data = response.data
    //       this.userData = []
    //       const list = this.userData
    //       data.forEach(function(item) {
    //         list.push({
    //           value: item.id, name: item.nick_name, userName: item.user_name, phone: item.phone
    //         })
    //       })
    //     }
    //   })
    // },
    findAjInfo(id) {
      if (id) {
        getAJJBXXSYHID({ id: id }).then((response) => {
          const data = response.data
          if (data) {
            this.caseList.push(data)
          }
        })
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
    getDepts() {
      this.depData = getTJXJ(getSessionDeptSelect(), this.curDept.parentDepCode, this.curDept.depCode)
      this.exDeptData = getParentDeptArray(getSessionDeptSelect(), this.curDept.parentDepCode)
    },
    computeDate(type, date) {
      if (this.assist.assistType === '1') {
        return this.addDate(date, '', 12 * type)
      } else if (this.assist.assistType === '2') {
        return this.addDate(date, 2 * type, '')
      } else if (this.assist.assistType === '3') {
        return this.addDate(date, 3 * type, '')
      } else if (this.assist.assistType === '4') {
        return this.addDate(date, 7 * type, '')
      }
    },
    startChange(val) {
      if (val) {
        this.assist.startTime = this.addDate(new Date(val + ':00'), '', '')
        if (this.assist.assistType !== '5') {
          this.assist.endTime = this.computeDate(1, new Date(val + ':00'))
        }
      }
    },
    endChange(val) {
      if (val) {
        this.assist.endTime = this.addDate(new Date(val + ':00'), '', '')
        if (this.assist.assistType !== '5') {
          this.assist.startTime = this.computeDate(-1, new Date(val + ':00'))
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
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getDepts()
    // this.getUsers()
    if (this.$route.params.id) {
      this.assist.id = this.$route.params.id
      this.detail()
    }
    if (this.curDept && this.curUser) {
      this.assist.dutyPersonPhone = this.curUser.phone
      this.assist.applyPersonId = this.curUser.id
      this.assist.applyPersonName = this.curUser.realName
      this.assist.userId = this.curUser.id
      this.assist.userName = this.curUser.realName
      this.assist.applyDeptId = this.curDept.id
      this.assist.applyDeptName = this.curDept.depName
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
        this.queryCase(carryParam.caseName)
        this.assist.caseId = Number(carryParam.caseId)
        this.assist.caseName = carryParam.caseName
      }
    }
  }
}
</script>

<style scoped>
.assist {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}

.assist h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}

.assist .input_w {
  width: 100%;
}

.assist .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
</style>
