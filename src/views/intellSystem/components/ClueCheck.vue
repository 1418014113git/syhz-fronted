<template>
  <div class="ClueCheck">
    <el-form ref="ClueCheckForm" size="small" :rules="rules" :model="clueCheck" label-width="120px">
      <el-form-item label="流转人：" prop="checkRequire">
        {{clueCheck.createName}}
      </el-form-item>
      <el-form-item label="发起部门：" prop="checkRequire">
        {{clueCheck.createOrgName}}
      </el-form-item>
      <el-form-item label="核查需求：" prop="checkRequire">
        <el-input type="textarea" :autosize="{minRows: 8, maxRows: 20}" placeholder="请输入内容"
                  v-model="clueCheck.checkRequire">
        </el-input>
      </el-form-item>
      <el-form-item label="反馈时限：" prop="replyTime">
        <el-date-picker value-format="yyyy-MM-dd" v-model="clueCheck.replyTime" type="date" placeholder="反馈时限"
                        size="small" clearable class="input_w" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="接收部门：" prop="acceptOrgId">
        <el-cascader v-model="acceptOrgIds" :options="depData" :show-all-levels="false" :props="props"
                     style="width:80%" :change-on-select="true" clearable @change="acceptDeptChange"></el-cascader>
      </el-form-item>
      <el-form-item label="接收人：" prop="acceptStaffId">
        <el-select v-model="clueCheck.acceptStaffId" placeholder="请选择" filterable class="input_w" clearable @change="staffChange">
          <el-option v-for="item in userData" :key="item.value" :label="item.name + ' (' + item.userName + ')'" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人电话：" prop="staffPhone">
        <el-input v-model="clueCheck.staffPhone" placeholder="负责人电话" class="input_w" clearable size="small" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="上传附件：">
        <el-upload class="upload-demo" multiple :action="uploadAction"
                   :auto-upload="true"
                   :file-list="uploadImgs"
                   :on-success="imgSuccess"
                   :on-remove="imgRemove"
                   :on-preview="imgPreview"
                   :before-remove="imgBfRemove"
                   :before-upload="beforeUpload">
          <el-button size="small" type="primary">点击上传</el-button>
          <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-on:click="onSubmit" v-loading.fullscreen.lock="saveLoading">提交</el-button>
        <el-button size="small" v-on:click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    saveClueCheck
  } from '@/api/cluecheck'
  import {
    getSessionDeptSelect, getUsersByDep
  } from '@/api/depts'
  import {
    getClueCheckDepts
  } from '@/api/dept'

  export default {
    name: 'ClueCheck',
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        saveLoading: false,
        props: {
          label: 'name',
          value: 'id'
        },
        clueCheck: {
          acceptOrgId: '',
          acceptStaffId: '',
          staffPhone: '',
          replyTime: '',
          checkRequire: ''
        },
        acceptOrgIds: [],
        depList: [],
        depData: [],
        userData: [],
        userAllInfo: [],
        rules: {
          acceptOrgId: [
            {
              required: true, trigger: 'change', validator: (rule, value, callback) => {
                if (this.acceptOrgIds.length === 0) {
                  callback(new Error('请选择接收单位'))
                } else {
                  callback()
                }
              }
            }
          ],
          acceptStaffId: [
            {
              required: true, message: '请选择接收人', trigger: 'change'
            }
          ],
          staffPhone: [
            {
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                const reg = /(^(\d{3,4}-?)?\d{7,8})$|^((\+86)|(86))?(1)\d{10}$/
                if (!reg.test(value)) {
                  callback(new Error('请输入正确的联系电话'))
                } else {
                  callback()
                }
              }
            }
          ],
          replyTime: [{
            required: true, message: '请选择反馈时限', trigger: 'change'
          }],
          checkRequire: [
            {
              required: true, message: '请输入线索核查要求', trigger: 'blur'
            },
            {
              max: 500, message: '线索核查要求不能超过500字', trigger: 'blur'
            }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - (3600 * 1000 * 24)
          }
        },
        uploadImgs: [],
        curUser: {},
        curDept: {}
      }
    },
    methods: {
      onSubmit() {
        this.$refs.ClueCheckForm.validate(valid => {
          if (valid) {
            this.handleSubmit()
          }
        })
      },
      handleSubmit() {
        if (!this.$parent.$parent.clueCheckId) {
          return false
        }
        if (this.acceptOrgIds.length === 0) {
          return false
        }
        this.handleImg()
        this.clueCheck.acceptOrgId = this.acceptOrgIds[this.acceptOrgIds.length - 1]
        for (let i = 0; i < this.userData.length; i++) {
          if (this.userData[i]['value'] === this.clueCheck.acceptStaffId) {
            this.clueCheck.acceptStaffName = this.userData[i]['name']
            break
          }
        }
        this.clueCheck.clueStatus = 1
        this.clueCheck.clueId = this.$parent.$parent.clueCheckId
        saveClueCheck(this.clueCheck).then((res) => {
          this.saveLoading = false
          if (res.code === '000000') {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$refs.ClueCheckForm.resetFields()
            this.clueCheck = {
              acceptOrgId: '', acceptStaffId: '', staffPhone: '', replyTime: '', checkRequire: ''
            }
            this.uploadImgs = []
            this.$emit('cancel')
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      cancel() {
        this.$refs.ClueCheckForm.resetFields()
        this.clueCheck = {
          acceptOrgId: '',
          acceptStaffId: '',
          staffPhone: '',
          replyTime: '',
          checkRequire: ''
        }
        const currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
        const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
        if (currentDep && curUser) {
          this.clueCheck.createId = curUser.id
          this.clueCheck.createName = curUser.realName
          this.clueCheck.createOrgId = currentDep.id
          this.clueCheck.createOrgName = currentDep.depName
        }
        this.$emit('cancel')
      },
      getUsers(deptCodes) {
        this.userData = []
        getUsersByDep(deptCodes).then((response) => {
          if (response.data && response.data.length > 0) {
            const data = response.data
            this.userAllInfo = data
            const list = []
            data.forEach(function(item) {
              list.push({
                value: item.id, name: item.real_name, userName: item.user_name, phone: item.phone
              })
            })
            this.userData = list
          }
        })
      },
      acceptDeptChange(val) {
        if (val && val.length > 0) {
          const vid = val[val.length - 1]
          for (let i = 0; i < this.depList.length; i++) {
            if (this.depList[i]['id'] === vid) {
              this.clueCheck.acceptOrgName = this.depList[i]['name']
              this.getUsers([this.depList[i]['depCode'].substring(0, 8)])
              break
            }
          }
        }
      },
      staffChange(val) {
        for (let i = 0; i < this.userAllInfo.length; i++) {
          if (this.userAllInfo[i]['id'] === val) {
            this.clueCheck.staffPhone = this.userAllInfo[i]['phone']
            break
          }
        }
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
          this.clueCheck.attachment = JSON.stringify(arr)
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
      initDeptData() {
        this.depData = getClueCheckDepts(getSessionDeptSelect(), this.curDept.depCode, this.curDept.parentDepCode)
        this.depList = getSessionDeptSelect()
      }
    },
    mounted() {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.curDept && this.curUser) {
        this.clueCheck.createId = this.curUser.id
        this.clueCheck.createName = this.curUser.realName
        this.clueCheck.createOrgId = this.curDept.id
        this.clueCheck.createOrgName = this.curDept.depName
      }
      this.initDeptData()
    }
  }
</script>

<style scoped>
.ClueCheck .input_w {
	width: 50%;
}
</style>
