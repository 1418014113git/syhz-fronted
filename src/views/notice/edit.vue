<template>
  <div class="notice_edit">
    <el-row class="notice_edit_card">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <el-card class="notice_edit_card">
      <div class="notice">
        <h3>
          <p style="display: inline-block; width: 120px; text-align: right; padding-right: 12px;">{{noticeTitle}}</p>
        </h3>
        <el-form :model="form" ref="form" size="small" :rules="rules" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" auto-complete="off" clearable maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="发布者" prop="author">
            <el-input v-model="form.author" auto-complete="off" clearable maxlength="50" class="input_w"></el-input>
          </el-form-item>
          <el-form-item label="通知分类" prop="type">
            <el-select v-model="form.type" placeholder="请选择通知分类" class="input_w">
              <el-option  v-for="item in typebList" :key="item.code" :label="item.code_name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知部门" prop="noticeOrgId">
            <el-collapse class="input_w">
              <el-collapse-item title="选择部门" name="1">
                <div class="dept-tree">
                  <el-tree class="filter-tree" :data="depData" :props="defaultProps" default-expand-all
                          ref="depTree"
                          highlight-current show-checkbox check-strictly @check-change="menuChange"
                          :default-checked-keys="selectedData" :expand-on-click-node="false" node-key="id"
                          style="margin-top: 5px;">
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="信息来源" prop="infoSource">
            <el-input v-model="form.infoSource" auto-complete="off" clearable maxlength="100" class="input_w"></el-input>
          </el-form-item>
          <el-form-item label="站内信息正文" prop="content" class="content">
            <vue-editor ref="child" v-model="form.content" useCustomImageHandler @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
            <span style="color: #f56c6c;">{{errorText}}</span>
          </el-form-item>
          <el-form-item label="上传附件">
            <el-upload
                      :action="uploadAction"
                      class="upload-demo" drag multiple
                      :auto-upload="true"
                      :file-list="uploadImgs"
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
            <el-button type="primary" @click="onSubmit(false)" v-if="$isViewBtn('116001')" :loading="saveLoading">保 存</el-button>
            <el-button type="primary" @click="onSubmit(true)" v-if="$isViewBtn('116002')" :loading="releaseLoading">发 布</el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { addTztg, editTztg, getTztgOne, getTztgSigns } from '@/api/notice'
  import VueEditor from '@/components/Editor/VueEditor'
  import { getSessionDeptSelect } from '@/api/depts'
  import { getTCode } from '@/api/inforCollection'
  import { uploadImg } from '@/utils/editorUpload'
  import { getMSDept, getQXDept } from '@/api/dept'

  export default {
    name: 'edit',
    components: {
      VueEditor
    },
    data() {
      return {
        noticeTitle: '添加站内信息',
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
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$refs.child.textLength === 0) {
              this.errorText = '请输入站内信息正文'
            } else if (this.$refs.child.textLength > 30000) {
              this.errorText = '通知内容不能超过3万字'
            } else {
              this.errorText = ''
              this.handleImg()
              if (flag) { // 发布
                this.releaseLoading = true
                this.form.status = 1
              } else { // 保存
                this.saveLoading = true
                this.form.status = 0
              }
              this.checkDeptIds()
              if (this.form.id) {
                editTztg(this.form).then((response) => {
                  this.releaseLoading = false
                  this.saveLoading = false
                  if (response.success === true) {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.toList()
                  }
                }).catch(() => {
                  this.releaseLoading = false
                  this.saveLoading = false
                })
              } else {
                this.form.createOrgId = this.curDept.id
                this.form.createUserId = this.curUser.id
                addTztg(this.form).then((response) => {
                  this.releaseLoading = false
                  this.saveLoading = false
                  if (response.success === true) {
                    this.toList()
                  }
                }).catch(() => {
                  this.releaseLoading = false
                  this.saveLoading = false
                })
              }
            }
          } else {
            if (this.$refs.child.textLength === 0) {
              this.errorText = '请输入站内信息正文'
            } else if (this.$refs.child.textLength > 30000) {
              this.errorText = '通知内容不能超过3万字'
            } else {
              this.errorText = ''
            }
            console.log('error submit!!')
            return false
          }
        })
      },
      toList() {
        this.$router.push({ path: '/tztg/list/' })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      finTztg() {
        const para = {
          id: this.form.id,
          noticeOrgId: this.curDept.id
        }
        getTztgOne(para).then((response) => {
          this.form = response.data[0]
          this.form.infoSource = this.form.info_source
          this.form.noticeOrgId = parseInt(this.form.noticeOrgId)
          if (this.form.attachement) {
            this.uploadImgs = JSON.parse(this.form.attachement)
          }
        })
      },
      findTzTgSigns() {
        getTztgSigns({
          noticeId: this.form.id
        }).then((response) => {
          if (response.code === '000000' && response.data) {
            const arr = []
            if (response.data) {
              const curDeptId = this.curDept.id
              response.data.forEach(function(item, index) {
                if (item.notice_org_id && Number(item.notice_org_id) !== curDeptId) {
                  arr.push(Number(item.notice_org_id))
                }
              })
            }
            this.selectedData = arr
            this.$refs.depTree.setCheckedKeys(this.selectedData, false)
          }
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
        }).catch((e) => {})
      },
      tcode() {
        getTCode({
          codeLx: 'tztglx'
        }).then((response) => {
          this.typebList = response.data
        })
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
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.errorText = ''
      this.tcode()
      this.getDepts()
      this.form.id = this.$route.params.id
      if (this.form.id && /^[0-9]*$/.test(this.form.id)) {
        this.orgDisabled = true
        this.finTztg()
        this.findTzTgSigns()
        this.noticeTitle = '编辑站内信息'
      } else if (this.$route.path.indexOf('save') > 0) {
        this.noticeTitle = '添加站内信息'
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
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
.notice_edit_card{
    width: 80%;
    min-width: 1200px;
    margin: 0 auto;
  }
</style>
