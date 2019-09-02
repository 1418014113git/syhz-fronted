<template>
  <section>
    <el-row class="reportWrap">
      <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <el-card class="reportWrap">
      <div class="report">
        <h3>人员黑名单信息</h3>
        <div class="report_form">
          <el-form :model="blackList" size="small" ref="form" :rules="rules"  label-width="120px" @submit.prevent="onSubmit">
            <el-form-item label="申请原因" prop="blacklist_reason">
              <el-input type="textarea" v-model="blackList.blacklist_reason"></el-input>
            </el-form-item>
            <el-form-item label="主要违法原因" prop="unlaw_act">
              <el-input type="textarea" v-model="blackList.unlaw_act"></el-input>
            </el-form-item>
            <el-form-item label="处罚依据" prop="according">
              <el-input type="textarea" v-model="blackList.according"></el-input>
            </el-form-item>
            <el-form-item label="处罚结果" prop="according_message">
              <el-input type="textarea" v-model="blackList.according_message"></el-input>
            </el-form-item>
            <el-form-item label="涉案产品系统" prop="relevance_system">
              <el-input  v-model="blackList.relevance_system"></el-input>
            </el-form-item>
            <!--<el-form-item label="审批部门" prop="approve_dept">
              <el-select v-model="blackList.approve_dept"  placeholder="请选择" style="width: 100%;">
                <el-option  v-for="item in deptList" :key="item.id" :label="item.dep_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="上传附件" prop="attachment">
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
              <el-button type="primary" @click="submit">保 存</el-button>
              <el-button size="small" @click="cancelEdit">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </section>
</template>
<script>
  import { saveBlackList, getBlackListById, deleteblackListById } from '@/api/collect/personCollect'
  import { getSessionDeptTree } from '@/api/depts'

  export default {
    name: 'personBlackListEdit',
    data() {
      return {
        uploadAction: this.UploadAttachment.uploadFileUrl,
        uploadImgs: [],
        deptList: [],
        treeData: [],
        blackList: {
          blacklist_reason: '',
          unlaw_act: '',
          according: '',
          according_message: '',
          relevance_system: '',
          approve_dept: '',
          attachment: '',
          person_id: 0,
          enable: 1
        },
        rules: {
          blacklist_reason: [{
            required: true, message: '黑名单原因不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '黑名单原因长度在 2 到 1000个字符', trigger: 'blur'
          }
          ],
          unlaw_act: [{
            required: true, message: '主要违法原因不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '违法原因长度在 2 到 1000个字符', trigger: 'blur'
          }
          ],
          according: [{
            required: true, message: '处罚依据不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '处罚依据长度在 2 到 1000个字符', trigger: 'blur'
          }
          ],
          according_message: [{
            required: true, message: '处罚结果不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 32, message: '处罚结果长度在 2 到 1000个字符', trigger: 'blur'
          }
          ],
          approve_dept: [{
            required: true, message: '审批部门不能为空', trigger: 'blur'
          }
          ]
        }
      }
    },
    methods: {
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
        this.blackList.attachment = JSON.stringify(arr)
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$route.query.id && this.$route.query.flag === 'delete') {
              this.blackList.id = this.$route.query.id
              this.blackList.enable = 0
              deleteblackListById(this.blackList).then((res) => {
              })
              saveBlackList(this.blackList).then((res) => {
                this.$message({
                  message: '移出成功',
                  type: 'success'
                })
              })
              this.toList()
            } else {
              this.handleImg()
              this.blackList.enable = 0
              saveBlackList(this.blackList).then((res) => {
                this.$message({
                  message: '申请成功',
                  type: 'success'
                })
                this.toList()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      detail() {
        const para = {
          id: this.$route.query.id
        }
        getBlackListById(para).then((response) => {
          const data = response.data
          this.enterpriseInfo = {
            DWMC: data.DWMC,
            DWXZ: data.DWXZ,
            DJDW: data.DJDW,
            SWDJH: data.SWDJH,
            ZZJGDM: data.ZZJGDM,
            MLXZ: data.MLXZ,
            FRDBXM: data.FRDBXM,
            DJZT: data.DJZT,
            ZCRQ: data.ZCRQ,
            YYZZBH: data.YYZZBH,
            TYSHXYDM: data.TYSHXYDM,
            FRDBZJHM: data.FRDBZJHM,
            JYFWZY: data.JYFWZY
          }
        })
      },
      toList() {
        this.$router.push({ path: '/inforCollection/personnelList' })
      },
      toback() {
        this.$router.back(-1)
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
      }
    },
    mounted() {
      this.blackList.person_id = this.$route.query.id
      // this.initList()
    }
  }
</script>
<style scoped>
.reportWrap{
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.report {
	width: 60%;
	margin: 0 auto;
}
.report h3 {
	font-size: 16px;
	font-weight: bold;
	height: 50px;
	line-height: 50px;
	margin-bottom: 10px;
}
.report .report_form {
	width: 80%;
	margin: 0 auto;
}
</style>
