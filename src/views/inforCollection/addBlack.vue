<template>
  <section>
    <div>
      <el-row class="info_collect_rbl">
        <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
      </el-row>
    </div>
    <el-card class="info_collect_rbl">
      <div class="add_black">
        <h3>重点关注申请</h3>
        <el-form :model="form" ref="form" size="small" :rules="rules" label-width="155px">
          <el-form-item label="企业名称：">
            {{form.dwmc}}
          </el-form-item>
          <el-form-item label="加入黑名单原因：" prop="blacklistReason">
            <el-input type="textarea" v-model="form.blacklistReason" auto-complete="off" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="主要违法行为：" prop="unlawAct">
            <el-input type="textarea" v-model="form.unlawAct" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="处罚依据：" prop="according">
            <el-input type="textarea" v-model="form.according" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="处罚结果：" prop="accordingMessage">
            <el-input type="textarea" v-model="form.accordingMessage" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="涉案产品系统：" prop="relevanceSystem">
            <el-input type="textarea" v-model="form.relevanceSystem" maxlength="100"></el-input>
          </el-form-item>

          <!--<el-form-item label="上级审批单位" prop="approveDept">
            <el-select  v-model="form.approveDept" placeholder="请选择上级审批单位" style="width:100%">
              <el-option  v-for="item in deptList" :key="item.id" :label="item.dep_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="上传附件：">
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
            <el-button type="primary" @click="onSubmit">保 存</el-button>
            <el-button size="small" @click="cancelEdit">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
  import {
    addBlacklist
  } from '@/api/inforCollection'
  import {
    getSessionDeptTree
  } from '@/api/depts'

  export default {
    name: 'add',
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        uploadImgs: [],
        deptList: [],
        form: {
          approveDept: '',
          dwmc: ''
        },
        defaultMsg: '这里是UE测试',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        rules: {
          title: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
              const reg = /^[\s\S]*$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的标题'))
              } else {
                callback()
              }
            }
          }],
          blacklistReason: [{ required: true, message: '加入黑名单原因', trigger: 'blur' }],
          unlawAct: [{ required: true, message: '请输入主要违法行为', trigger: 'blur' }],
          according: [{ required: true, message: '请输入处罚依据', trigger: 'blur' }],
          accordingMessage: [{ required: true, message: '请输入处罚结果', trigger: 'blur' }],
          relevanceSystem: [{ required: true, message: '请输入涉案产品系统', trigger: 'blur' }],
          approveDept: [{ required: true, message: '请输入上级审批单位', trigger: 'blur' }]
        }
      }
    },
    components: {
    },
    methods: {
      onEditorReady(editor) {
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
      onSubmit: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 提交申请
            this.handleImg()
            addBlacklist(this.form).then((response) => {
              if (response.success === true) {
                this.$message({
                  message: '申请成功',
                  type: 'success'
                })
                this.toList()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      toList() {
        this.$router.push({
          path: '/inforCollection'
        })
      },
      cancelEdit() {
        this.$confirm('确认要放弃操作吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.toList()
        })
      },
      initList() {
        this.deptList = getSessionDeptTree()
      },
      toback() {
        this.$router.back(-1)
      }
    },
    mounted() {
      this.form.companyId = this.$route.query.id
      this.form.dwmc = this.$route.query.DWMC
    }
  }
</script>

<style scoped>
.info_collect_rbl {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.add_black {
	width: 60%;
	margin: 0 auto;
}
.add_black h3 {
	font-size: 16px;
	font-weight: bold;
	height: 50px;
	line-height: 50px;
	margin-bottom: 10px;
}
</style>
