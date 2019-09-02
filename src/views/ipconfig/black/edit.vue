<template>
  <div class="notice_edit">
    <el-row class="notice_edit_card">
      <img src="@/assets/icon/back.png"
           class="goBack"
           @click="toback">
      <!--返回-->
    </el-row>
    <el-card class="notice_edit_card">
      <div class="notice">
        <h3>
          <p style="display: inline-block; width: 120px; text-align: right; padding-right: 12px;">{{noticeTitle}}</p>
        </h3>
        <el-form :model="form"
                 ref="form"
                 size="small"
                 :rules="rules"
                 label-width="120px">
          <el-form-item label="IP地址开始"
                        prop="ip">
            <el-input v-model="form.ip"
                      auto-complete="off"
                      clearable
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="IP地址结束"
                        prop="ipEnd">
            <el-input v-model="form.ip"
                      auto-complete="off"
                      clearable
                      maxlength="100"></el-input>
          </el-form-item>
          <!--
          <el-form-item label="运营商"
                        prop="yys">
            <el-input v-model="form.yys"
                      auto-complete="off"
                      clearable
                      maxlength="50"
                      class="input_w"></el-input>
          </el-form-item>
          -->
          <el-form-item label="所属地"
                        prop="adresss">
            <el-input v-model="form.adress"
                      auto-complete="off"
                      clearable
                      maxlength="50"
                      class="input_w"></el-input>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <el-input v-model="form.remark"
                      auto-complete="off"
                      clearable
                      maxlength="100"
                      class="input_w"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       @click="onSubmit(false)"
                       :loading="saveLoading">保 存</el-button>
            <el-button size="small"
                       @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import VueEditor from '@/components/Editor/VueEditor'
import { getTCode } from '@/api/inforCollection'
import { uploadImg } from '@/utils/editorUpload'

export default {
  name: 'edit',
  components: {
    VueEditor
  },
  data() {
    return {
      noticeTitle: '添加站内信息',
      flag: '',
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadImgs: [],
      form: {
        title: '',
        author: '',
        type: '',
        infoSource: '',
        content: ''
      },
      selectedData: [],
      deptList: [],
      depData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      typebList: [],
      orgDisabled: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      releaseLoading: false, // 发布按钮loading
      saveLoading: false, // 保存按钮loading
      errorText: '', // 站内信息校验错误提示
      rules: {
        title: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[\s\S]*$/
            if (!value || !reg.test(value)) {
              callback(new Error('请输入正确的标题'))
            } else {
              callback()
            }
          }
        }],
        author: [{ required: true, message: '请输入发布者', trigger: 'blur' }],
        type: [{ required: true, message: '请选择通知分类', trigger: 'change' }],
        infoSource: [{ required: true, message: '请输入信息来源', trigger: 'blur' }],
        // content: [
        //   // {
        //   //   required: true, message: '请输入站内信息正文', trigger: 'blur'
        //   // },
        //   {
        //     required: true, trigger: 'blur', validator: (rule, value, callback) => {
        //       if (!value || value === '') {
        //         callback(new Error('请输入通告内容'))
        //       } else if (value.trim().length < 1) {
        //         callback(new Error('请输入通告内容'))
        //       } else if (value.length > 30000) {
        //         callback(new Error('通知内容不能超过3万字'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   },
        //   {
        //     max: 30000, message: '通知内容不能超过3万字', trigger: 'blur'
        //   }
        // ],
        noticeOrgId: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (this.deptList.length < 1) {
                callback(new Error('请选择通知部门'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      curDept: {},
      curUser: {}
    }
  },
  methods: {
    menuChange(value, isChecked) {
      if (isChecked) {
        if (this.curDept.id !== value.id) {
          this.deptList.push({
            id: value.id, name: value.name
          })
        }
      } else {
        this.deptList.forEach((item, index) => {
          if (item.id === value.id) {
            this.deptList.splice(index, 1)
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
      this.form.attachement = JSON.stringify(arr)
    },
    onEditorReady(editor) {
    },
    onSubmit(flag) {
      this.toList()
    },
    toList() {
      this.$router.push({ path: '/ipconfig/blacklist' })
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.toList()
      })
    },
    finTztg() {
      // const para = {
      //   id: this.form.id,
      //   noticeOrgId: this.curDept.id
      // }
      // getTztgOne(para).then((response) => {
      //   this.form = response.data[0]
      //   this.form.infoSource = this.form.info_source
      //   this.form.noticeOrgId = parseInt(this.form.noticeOrgId)
      //   if (this.form.attachement) {
      //     this.uploadImgs = JSON.parse(this.form.attachement)
      //   }
      // })
    },
    // findTzTgSigns() {
    //   getTztgSigns({
    //     noticeId: this.form.id
    //   }).then((response) => {
    //     if (response.code === '000000' && response.data) {
    //       const arr = []
    //       if (response.data) {
    //         const curDeptId = this.curDept.id
    //         response.data.forEach(function(item, index) {
    //           if (item.notice_org_id && Number(item.notice_org_id) !== curDeptId) {
    //             arr.push(Number(item.notice_org_id))
    //           }
    //         })
    //       }
    //       this.selectedData = arr
    //       this.$refs.depTree.setCheckedKeys(this.selectedData, false)
    //     }
    //   })
    // },
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
    tcode() {
      getTCode({
        codeLx: 'tztglx'
      }).then((response) => {
        this.typebList = response.data
      })
    },

    contentChange(val) {
      if (val === 0) {
        this.errorText = '请输入站内信息正文'
      } else if (val > 30000) {
        this.errorText = '通知内容不能超过3万字'
      } else {
        this.errorText = ''
      }
    },
    checkDeptIds() {
      this.form.deptIds = this.deptList
      let flag = false
      for (let i = 0; i < this.deptList.length; i++) {
        const dept = this.deptList[i]
        if (String(dept['id']) === String(this.curDept.id)) {
          flag = true
        }
      }
      if (!flag) {
        this.form.deptIds.push({
          id: this.curDept.id, name: this.curDept.depName
        })
      }
    },
    toback() {
      this.$router.back(-1)
    }
  },
  mounted() {
    // this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    // this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.errorText = ''
    this.tcode()
    this.form.id = this.$route.params.id
    this.form.s = this.$route.params.yys
    if (this.form.id) {
      this.orgDisabled = true
      if (this.form.id === '1') {
        this.noticeTitle = '编辑黑名单'
      } else if (this.form.id === '2') {
        this.noticeTitle = '编辑白名单'
      }
      this.form = { 'id': 1, 'ip': '197.0.0.0.1', 'yys': '电信', 'adress': '陕西西安', 'type': 0, 'remark': '非法IP' }
    } else if (this.form.s) {
      if (this.form.s === '0') {
        this.noticeTitle = '添加黑名单'
      } else if (this.form.s === '1') {
        this.noticeTitle = '添加白名单'
      }
    }
  }
}
</script>

<style>
.notice_edit .notice {
  width: 70%;
  margin: 0 auto;
}
.notice_edit h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;

  line-height: 50px;
  margin-bottom: 10px;
}
.notice_edit .input_w {
  width: 100%;
}
.notice_edit .dept-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}
.content .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.notice_edit_card {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
</style>
