<template>
<!-- 导入线索 -->
<div class="drForm">
  <el-form ref="drForm" :rules="rules" :model="drForm" size="small" label-width="100px">
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-form-item label="分类" prop="type">
          <el-select v-model="drForm.type" placeholder="请选择分类" class="inputW">
            <el-option :label="item.name" :value="item.value" v-for="item in typeData" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-upload class="upload-demo" drag multiple
              :action="uploadAction"
              :file-list="attachment"
              :on-success="imgSuccess"
              :on-remove="imgRemove"
              :on-preview="imgPreview"
              :before-remove="imgBfRemove"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :limit="10"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <span>点击或将文件拖拽到这里上传，最多10个，单个文件最大500M</span><br>
              <span>支持扩展名： .xls .xlsx...</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row class="tabC dialogBtnUpLine">
    <el-popover
      placement="right"
      width="400"
      trigger="hover">
      <div>
         <p>说明：</p>
         <p>1、导入文件支持xls和xlsx两种格式。</p>
         <p>2、第一行规定必须为标题行，且多次导入标题需保持一致。</p>
         <p>3、根据标题中的“<span class="redC">地址</span>”自动分发线索到地市对应的支队，注意标题必须为“<span class="redC">地址</span>”。</p>
         <p>4、标题必须包含“<span class="redC">序号</span>”，该序号为线索序号，用于根据序号快速定位线索。</p>
      </div>
      <el-button  type="primary" slot="reference"  class="saveBtn"><svg-icon icon-class="wenhao"></svg-icon> 导入说明</el-button>
    </el-popover>
    <el-button  @click="cancel" class="cancelBtn marlr">取消</el-button>
    <el-button  type="primary" @click="importFile"  class="saveBtn" :loading="btnLoading">导入</el-button>
  </el-row>
</div>
</template>

<script>
import titlePub from './titlePub'
export default {
  props: ['cardId', 'isShowDialog'],
  name: 'baseInfo',
  data() {
    return {
      curUser: {}, // sessionStorage获取用户信息
      drForm: {
        type: '' // 分类
      },
      attachment: [], // 导入的文件集合
      btnLoading: false, // 省厅弹框按钮loading
      uploadAction: this.UploadAttachment.uploadFileUrl,
      typeData: [ // 分类
        { value: '1', name: '环境' },
        { value: '2', name: '食品' },
        { value: '3', name: '药品' }
      ],
      rules: {
        type: [ // 分类
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    titlePub
  },
  computed: {

  },
  watch: {
    cardId(val) {
      this.cardNumber = val
    },
    isShowDialog: {
      handler: function(val, oldeval) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.initData()
      // if (this.cardId) {
      //   this.cardNumber = this.cardId
      //   this.detail()
      // }
    },
    initData() {
      this.drForm.type = ''
      this.attachment = []
      this.btnLoading = false
      this.resetForm('drForm')
    },
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields()
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
    handleExceed() { // 上传文件超过最大限制时，提示信息
      this.$message.error(`最多上传10个文件`)
    },
    importFile(type) { //   导入线索
      this.$refs.drForm.validate(valid => {
        if (valid) {
          if (this.attachment.length === 0) {
            this.$message({
              message: '请点击或将文件拖拽到上面的框中上传', type: 'warning'
            })
            return false
          }
          // this.btnLoading = true // 加载进度条
          // this.$update('', this.drForm).then((response) => {
          //   this.btnLoading = false // 关闭加载条
          //   this.$emit('closeDialog', false)
          // }).catch(() => {
          //   this.btnLoading = false // 关闭加载条
          // })
        } else {
          this.btnLoading = false // 关闭进度条
          return false
        }
      })
    },
    explain() { // 说明

    },
    cancel() { // 取消
      this.$emit('closeDialog', false)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    }
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.drForm{
  .inputW{
    width: 57%;
  }
  .redC{
    color: #f72929;
  }
  .el-form{
    padding: 10px 20px;
  }
  .el-upload-dragger {
    width: 410px;
    height: 190px;
  }
  .el-upload-list__item {
    width: 70%;
  }
}
.redC{
  color: #f72929;
}
.marlr{
  margin: 0 15px;
}
@media only screen and (max-width: 1367px) {

}
</style>

