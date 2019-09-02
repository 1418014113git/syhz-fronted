<template>
<div>
  <el-row class="person_black">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toback">   <!--返回-->
  </el-row>
   <el-card class="person_black">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <h3>
          <p style="display: inline-block; width: 140px; text-align: right; padding-right: 22px;">申请移出黑名单</p>
        </h3>
        <!--:inline="true"-->
        <!--<el-form  :model="form" size="small" label-width="120px">
          <el-form-item label="作出决定机关">
            <el-select  v-model="form.removeDept" placeholder="请选择作出决定机关" style="width:100%">
              <el-option  v-for="item in deptList" :key="item.id" :label="item.dep_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>-->
        <el-form style="margin-top:20px" ref="form" :model="form" :rules="rules" label-width="160px">
          <el-form-item label="列入黑名单原因：">
            <el-table :data="tableData">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="blacklist_reason" label="列入黑名单原因" show-overflow-tooltip></el-table-column>
              <el-table-column label="附件" min-width="40%">
                <template slot-scope="scope">
                  <a v-for="item in scope.row.uploadFiles" :href="item.path"
                     style="text-decoration:underline;color: rgb(32, 160, 255);display: block" :download="item.name">{{item.name}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="create_date" label="列入日期" width="180"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="移出黑名单原因：" prop="removeReason">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.removeReason"></el-input>
          </el-form-item>
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
            <el-button>取消</el-button>
            <el-button type="primary" @click="onSubmit">移出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
import { removeBlackList, getBlacklistPerson } from '@/api/collect/personCollect'
// import { getDeptSelect } from '@/api/depts'

export default {
  name: 'RemoveBlackList',
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadImgs: [],
      deptList: [],
      form: {
        id: '',
        removeReason: '',
        file: '',
        removeDept: '',
        date: '',
        removeAttachment: ''
      },
      rules: {
        removeReason: [{ required: true, message: '请输入移出黑名单原因', trigger: 'blur' }]
      },
      tableData: []
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleImg()
          removeBlackList(this.form).then((response) => {
            if (response.success === true) {
              this.$message({
                message: '申请成功',
                type: 'success'
              })
              this.$router.push({ path: '/inforCollection/personnelList' })
            }
          })
        }
      })
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
    beforeUpload(file) {
      const msg = this.UploadAttachment.fileValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    },
    imgPreview(file) {
      console.log(file)
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
      this.form.removeAttachment = JSON.stringify(arr)
    },
    initList() {
      // getDeptSelect().then((response) => {
      //   this.deptList = response.data
      // })
    },
    toback() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.initList()
    // 根据企业编号查询申请加入黑名单信息
    const para = {
      personId: this.$route.query.id
    }
    getBlacklistPerson(para).then((response) => {
      this.tableData = response.data
      if (this.tableData.length > 0) {
        this.form = this.tableData[0]
        // this.form.personId = this.tableData[0].person_id
        console.log(this.form)
      }
      this.tableData.forEach((item) => {
        if (item.attachment) {
          item.uploadFiles = JSON.parse(item.attachment)
        }
      })
    })
  }
}
</script>

<style scoped>
.person_black {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}

.person_black > form {
  margin-top: 40px;
}

.person_black > form:last-child {
  margin: 0;
}

.person_black h3 {
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
</style>
