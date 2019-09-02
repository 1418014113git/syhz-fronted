<template>
<div>
  <el-row class="spt_report">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
  </el-row>
  <el-card class="spt_report">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3>
          <p style="display: inline-block; width: 120px; text-align: right; padding-right: 22px;">专项任务信息</p>
        </h3>
        <el-form :model="form" size="small" ref="form" :rules="rules" label-width="140px">
          <el-form-item label="承办单位：">
            {{form.createDeptName}}
          </el-form-item>
          <el-form-item label="承办单位电话：" prop="partakePhone">
            <el-input v-model="form.partakePhone" auto-complete="off" class="input_w" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="form.taskName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="时间范围：" prop="dateRand">
            <el-date-picker v-model="dateRand" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="dateChange" value-format="yyyy-MM-dd HH:mm:ss" clearable class="input_w"></el-date-picker>
          </el-form-item>
          <el-form-item label="参与部门：" prop="deptList">
            <el-collapse>
              <el-collapse-item title="选择部门" name="1">
                <div class="dept-tree">
                  <el-tree v-model="deptList" class="filter-tree" :data="depData" :props="defaultProps"
                           default-expand-all
                           ref="depTree" highlight-current show-checkbox check-strictly @check-change="menuChange"
                           :default-checked-keys="selectedData" :expand-on-click-node="false" node-key="id"
                           style="margin-top: 5px;">
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="任务简要：" prop="taskDescription" style="margin-top: 20px">
            <vue-editor v-model="form.taskDescription" useCustomImageHandler
                        @imageAdded="handleImageAdded"></vue-editor>
          </el-form-item>
          <el-form-item label="签发人：" prop="dutyPersonJson" style="margin-top: 20px">
            <el-select v-model="dutyPerson" multiple filterable placeholder="请选择" style="width: 100%;"
                       @change="dutyChange">
              <el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="承办人：" prop="partakePersonJson">
            <!--<el-select v-model="partakePerson" multiple filterable placeholder="请选择" style="width: 100%;"-->
                       <!--@change="partakeChange">-->
              <!--<el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value"></el-option>-->
            <!--</el-select>-->
            {{form.userName}}
          </el-form-item>
          <el-form-item label="任务线索：" prop="taskKey">
            <el-input type="textarea" v-model="form.taskKey"></el-input>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload :action="uploadAction" class="upload-demo" drag multiple
                       :auto-upload="true" :file-list="uploadImgs"
                       :on-success="imgSuccess" :on-remove="imgRemove" :on-preview="imgPreview"
                       :before-remove="imgBfRemove" :before-upload="beforeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="edit(false)" v-if="$isViewBtn('102008')">保 存</el-button>
            <el-button type="primary" @click="edit(true)" v-if="$isViewBtn('102009')">直接发布</el-button>
            <el-button type="info" @click="cancelEdit">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
  import { addTask, editTask, getTask } from '@/api/specialTasks'
  import VueEditor from '@/components/Editor/VueEditor'
  import { getSessionDeptSelect, getUsersByDep } from '@/api/depts'
  import { getMSDept, getQXDept } from '@/api/dept'
  import {
    uploadImg
  } from '@/utils/editorUpload'

  export default {
    name: 'add',
    components: {
      VueEditor
    },
    data() {
      return {
        dateRand: [],
        uploadAction: this.UploadAttachment.uploadFileUrl,
        uploadImgs: [],
        deptList: [],
        dutyPerson: [],
        partakePerson: [],
        selectedData: [],
        depData: [],
        userData: [],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        options: [],
        form: {
          taskName: '',
          startDate: '',
          endDate: '',
          deptList: '',
          taskDescription: '',
          dutyPerson: '',
          partakePerson: '',
          partakePhone: '',
          taskKey: '',
          attachment: '',
          status: '0'
        },
        rules: {
          taskName: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /^[\s\S]*$/
              if (!value || value.length < 1) {
                callback(new Error('请输入任务名称'))
              } else if (value.length > 100) {
                callback(new Error('任务名称不能超过100字'))
              } else if (!reg.test(value)) {
                callback(new Error('任务名称由字母，数字，汉字组成'))
              } else {
                callback()
              }
            }
          }],
          taskDescription: [{ required: true, message: '请输入任务简要', trigger: 'blur' }],
          dateRand: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.dateRand || this.dateRand.length < 2) {
                callback(new Error('请选择时间范围'))
              } else {
                callback()
              }
            }
          }],
          deptList: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.deptList || this.deptList.length === 0) {
                callback(new Error('请勾选参与部门'))
              } else {
                callback()
              }
            }
          }],
          dutyPersonJson: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.form.dutyPersonJson || this.form.dutyPersonJson.length === 0) {
                callback(new Error('请勾选签发人'))
              } else {
                callback()
              }
            }
          }],
          partakePersonJson: [{
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!this.form.partakePersonJson || this.form.partakePersonJson.length === 0) {
                callback(new Error('请勾选承办人'))
              } else {
                callback()
              }
            }
          }],
          taskKey: [{
            required: false, trigger: 'blur', validator: (rule, value, callback) => {
              if (value.length > 500) {
                callback(new Error('线索信息不能超过500字'))
              } else {
                callback()
              }
            }
          }],
          partakePhone: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const reg = /(^(\d{3,4}-?)?\d{7,8})$|^((\+86)|(86))?(1)\d{10}$/
              if (!value || value.length < 1 || !reg.test(value)) {
                callback(new Error('请输入正确的联系电话'))
              } else {
                callback()
              }
            }
          }]
        },
        curDept: {}
      }
    },
    methods: {
      dateChange(val) {
        this.form.startDate = val[0]
        this.form.endDate = val[1]
      },
      menuChange(value, isChecked) {
        if (isChecked) {
          this.deptList.push({
            id: value.id, name: value.name, depCode: value.depCode, parentCode: value.parentCode
          })
        } else {
          let i = -1
          this.deptList.forEach(function(item, index) {
            if (item.id === value.id) {
              i = index
            }
          })
          if (i > -1) {
            this.deptList.splice(i, 1)
          }
        }
        this.getUsers()
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
      getDepts() {
        const type = this.curDept.depCode
        const t1 = type.substring(2, 6)
        const t2 = type.substring(4, 6)
        if (t1 === '0000') { // 省厅
          const deptList = getSessionDeptSelect()
          this.depData = getMSDept(deptList)
        }
        if (t1 !== '0000' && t2 === '00') { // 市
          const deptList = getSessionDeptSelect()
          this.depData = getQXDept(deptList, type)
        }
        if (this.$route.params.id) {
          this.detail()
        }
      },
      getUsers() {
        const codes = []
        for (let i = 0; i < this.deptList.length; i++) {
          codes.push(this.deptList[i]['depCode'].substring(0, 8))
        }
        if (codes.length < 1) {
          this.userData = []
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
            this.userData = list
          }
        })
      },
      detail() {
        const para = {
          id: this.$route.params.id
        }
        getTask(para).then((response) => {
          const data = response.data
          const arr = []
          if (data.dept_list) {
            JSON.parse(data.dept_list).forEach(function(item, index) {
              arr.push(item.id)
            })
          }
          this.selectedData = arr
          this.$refs.depTree.setCheckedKeys(this.selectedData, false)

          if (data.duty_person) {
            this.dutyPerson = JSON.parse(data.duty_person)
          }
          if (data.partake_person) {
            this.partakePerson = JSON.parse(data.partake_person)
          }
          this.form.createDeptName = data.create_dept_name
          this.form.taskName = data.task_name
          this.form.startDate = data.start_date
          this.form.endDate = data.end_date
          this.form.deptList = data.dept_list
          this.form.taskDescription = data.task_description
          this.form.dutyPerson = data.duty_person
          this.form.partakePerson = data.partake_person
          this.form.partakePhone = data.partake_phone
          this.form.taskKey = data.task_key
          this.form.attachment = data.attachment
          this.form.status = data.status
          this.dateRand = [data.start_date, data.end_date]
          if (data.attachment) {
            this.uploadImgs = JSON.parse(data.attachment)
          }
          if (data.duty_person_json) {
            this.form.dutyPersonJson = JSON.parse(data.duty_person_json)
          }
          if (data.partake_person_json) {
            this.form.partakePersonJson = JSON.parse(data.partake_person_json)
          }
        })
      },
      edit(flag) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.handleImg()
            this.doDeptIds()
            this.form.deptList = this.deptList.length > 0 ? JSON.stringify(this.deptList) : ''
            this.form.dutyPerson = this.dutyPerson.length > 0 ? JSON.stringify(this.dutyPerson) : ''
            this.form.partakePerson = this.partakePerson.length > 0 ? JSON.stringify(this.partakePerson) : ''
            this.form.dutyPersonJson = this.form.dutyPersonJson.length > 0 ? JSON.stringify(this.form.dutyPersonJson) : '[]'
            this.form.partakePersonJson = this.form.partakePersonJson.length > 0 ? JSON.stringify(this.form.partakePersonJson) : '[]'
            flag ? this.form.status = '5' : this.form.status = '0'
            const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
            this.form.userId = curUser.id
            this.form.userName = curUser.realName
            if (this.$route.params.id) {
              if (flag) {
                this.form.bizType = 6
                this.form.action = '下发专项任务'
              }
              this.form.id = this.$route.params.id
              editTask(this.form).then((res) => {
                this.listLoading = false
                this.$message({
                  message: '修改成功', type: 'success'
                })
                this.toList()
              }).catch(() => {
                this.listLoading = false
              })
            } else {
              this.form.bizType = 6
              if (flag) {
                this.form.action = '添加并下发专项任务'
              } else {
                this.form.action = '添加专项任务'
              }
              addTask(this.form).then((res) => {
                this.listLoading = false
                this.$message({
                  message: '添加成功', type: 'success'
                })
                this.toList()
              }).catch(() => {
                this.listLoading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/specialTasks'
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      doDeptIds() {
        const arr = []
        if (this.deptList.length > 0) {
          this.deptList.forEach((item) => {
            arr.push('[' + item.id + ']')
          })
        }
        this.form.deptIds = arr.join(',')
      },
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((response) => {
          if (response.code === '000000') {
            Editor.insertEmbed(cursorLocation, 'image', response.data)
            resetUploader()
          }
        }).catch((e) => {
        })
      },
      dutyChange(val) {
        this.form.dutyPersonJson = []
        for (let j = 0; j < val.length; j++) {
          for (let i = 0; i < this.userData.length; i++) {
            if (this.userData[i]['value'] === val[j]) {
              this.form.dutyPersonJson.push({
                id: this.userData[i]['value'], name: this.userData[i]['name']
              })
            }
          }
        }
      },
      partakeChange(val) {
        this.form.partakePersonJson = []
        for (let j = 0; j < val.length; j++) {
          for (let i = 0; i < this.userData.length; i++) {
            if (this.userData[i]['value'] === val[j]) {
              this.form.partakePersonJson.push({
                id: this.userData[i]['value'], name: this.userData[i]['name']
              })
            }
          }
        }
      }
    },
    mounted() {
      const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (curDept && curUser) {
        this.curDept = curDept
        this.form.createId = curUser.id
        this.form.createName = curUser.realName
        this.form.userId = curUser.id
        this.form.userName = curUser.realName
        this.form.createDeptId = curDept.id
        this.form.createDeptName = curDept.depName
        this.form.partakePersonJson = [{
          id: curUser.id, name: curUser.realName
        }]
        this.partakePerson = [curUser.id]
        this.getDepts()
      }
    }
  }
</script>

<style scoped>
  .spt_report {
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }

  .spt_report h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .spt_report .input_w {
    width: 100%;
  }

  .spt_report .dept-tree {
    max-height: 400px;
    overflow-y: auto;
    padding: 5px;
  }
</style>
