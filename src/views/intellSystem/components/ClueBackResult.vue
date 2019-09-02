<template>
  <div class="ClueBackResult">
    <el-form ref="CheckResultForm" size="small" :rules="backRules" :model="checkResult" label-width="100px">
      <el-form-item label="反馈信息" prop="replyContent">
        <el-input type="textarea" :autosize="{minRows: 8, maxRows: 20}" placeholder="请输入内容" v-model="checkResult.replyContent">
        </el-input>
      </el-form-item>
      <el-form-item label="上传附件">
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
        <el-button type="primary" size="small" v-on:click="onBackResult" v-loading.fullscreen.lock="saveLoading">提交</el-button>
        <el-button size="small" v-on:click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    saveCheckResult
  } from '@/api/cluecheck'

  export default {
    name: 'ClueBackResult',
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        checkResult: {
          replyContent: ''
        },
        backRules: {
          replyContent: [
            {
              required: true, message: '请输入要反馈的信息', trigger: 'blur'
            },
            {
              max: 500, message: '反馈内容不能超过500字', trigger: 'blur'
            }
          ]
        },
        saveLoading: false,
        uploadImgs: []
      }
    },
    methods: {
      onBackResult() {
        if (!this.$parent.$parent.selectClues) {
          return false
        }
        this.checkResult.clueId = this.$route.params.id
        this.$refs.CheckResultForm.validate(valid => {
          if (valid) {
            this.checkResult.createId = this.$parent.$parent.curUser.id
            this.checkResult.createName = this.$parent.$parent.curUser.realName
            this.checkResult.createOrgId = this.$parent.$parent.currentDep.id
            this.checkResult.createOrgName = this.$parent.$parent.currentDep.depName
            this.checkResult.seeStatus = 1
            this.checkResult.clueCheckIds = this.$parent.$parent.selectClues
            this.handleImg()
            saveCheckResult(this.checkResult).then((res) => {
              if (res.code === '000000') {
                this.$message({
                  message: '反馈成功',
                  type: 'success'
                })
                this.cancel()
              }
            })
          }
        })
      },
      cancel() {
        this.$refs.CheckResultForm.resetFields()
        this.checkResult = {
          replyContent: ''
        }
        this.uploadImgs = []
        this.$emit('cancel')
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
          this.checkResult.attachment = JSON.stringify(arr)
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
      }
    }
  }
</script>

<style scoped>
</style>
