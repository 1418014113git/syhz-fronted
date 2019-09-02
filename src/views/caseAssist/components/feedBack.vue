<template>
  <div class="lingeFeedBack" v-loading="listLoading">
    <el-row style="padding: 0 0 10px; text-align: right">
      <el-button v-if="showFkBtn && isFkIng && bsIdState && $isViewBtn('100909')" @click="showFkDialog">添加反馈</el-button>
    </el-row>
    <el-table :data="listData" style="width: 100%;">
      <el-table-column label="反馈部门" min-width="10%">
        <template slot-scope="scope">
          <p :title="scope.row.create_dept_name" class="ellipsis-word">{{scope.row.create_dept_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="反馈人" min-width="6%">
        <template slot-scope="scope">
          <p :title="scope.row.create_user_name" class="ellipsis-word">{{scope.row.create_user_name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" min-width="20%">
        <template slot-scope="scope">
          <p :title="scope.row.content" class="ellipsis-word" @click="showContent(scope.$index)" style="cursor: pointer">{{scope.row.content}}</p>
        </template>
      </el-table-column>
      <el-table-column label="反馈时间" width="120px">
        <template slot-scope="scope">
          {{scope.row.create_time | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="attachment" label="反馈附件" min-width="10%">
        <template slot-scope="scope">
          <p v-for="item in getImgName(scope.row.attachment)" @click="downFile(item.path)" style="cursor: pointer">{{item.name}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" width="200">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="(scope.row.inegFeedStatus === '0')" title="修改" size="mini" type="primary"-->
                     <!--@click="editInfo(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>-->
          <!--<el-button v-if="(scope.row.inegFeedStatus === '0')" title="删除" size="mini" type="danger"-->
                     <!--@click="handleDel(scope.$index, scope.row)" icon="el-icon-delete" circle></el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination v-if="listTotal > 0" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="listTotal" :current-page="page" style="float:right;"></el-pagination>
    </el-col>
    <!--添加反馈-->
    <el-dialog :visible.sync="dialogVisible" :before-close="cleanDialog">
      <div slot="title">
        {{dialogTitle}}
      </div>
      <el-form ref="linegFeedBackForm" :model="feedBean" :rules="rules" label-width="140px">
        <el-form-item label="反馈部门：">
          {{curDept.depName}}
        </el-form-item>
        <el-form-item label="反馈人：">
          {{curUser.realName}}
        </el-form-item>
        <el-form-item label="反馈内容：" prop="content">
          <el-input type="textarea" :autosize="{minRows: 3, maxRows: 10}" clearable v-model="feedBean.content" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="反馈附件">
          <el-upload class="upload-demo" drag multiple :action="uploadAction" :auto-upload="true" :file-list="uploadImgs"
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
        <el-form-item style="padding-top: 10px;">
          <el-button type="primary" @click="saveFeedBack">提交</el-button>
          <el-button @click="cleanDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="contentDialog" title="反馈内容">
      <el-row>
        <el-col>
          {{dialogContent}}
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import {
  getLocalInegFeed, saveLocalInegFeed
} from '@/api/assistCase'
import { uploadImg } from '@/utils/editorUpload'

export default {
  name: 'lingeFeedBack',
  props: ['id', 'assistDepts', 'state', 'bsId'],
  data() {
    return {
      dialogContent: '',
      uploadAction: this.UploadAttachment.uploadFileUrl,
      uploadImgs: [],
      page: 1,
      listTotal: 0,
      pageSize: 10,
      listData: [],
      contentDialog: false,
      listLoading: false,
      showFkBtn: false,
      bsIdState: false,
      isFkIng: false,
      dialogVisible: false,
      feedBean: {},
      curDept: {},
      curUser: {},
      inegId: '',
      depts: '',
      dialogTitle: '',
      rules: {
        content: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const reg = /^[\s\S]*$/
            if (!value || value.length < 1) {
              callback(new Error('请输入反馈内容'))
            } else if (value.length > 1000) {
              callback(new Error('反馈内容不能超过1000字'))
            } else if (!reg.test(value)) {
              callback(new Error('反馈内容由字母，数字，汉字组成'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  methods: {
    showContent(index) {
      this.contentDialog = true
      this.dialogContent = this.listData[index]['content']
    },
    getImgName(imgs) {
      if (imgs && imgs.length > 0) {
        return JSON.parse(imgs)
      }
      return []
    },
    saveFeedBack() {
      this.$refs.linegFeedBackForm.validate(valid => {
        if (valid) {
          this.$confirm('提交后将无法修改，请认真检查无误后提交?', '提示', {
            type: 'warning'
          }).then(() => {
            this.handleSave()
          }).catch(() => {
            this.InfLoading = false
          })
        }
      })
    },
    handleSave() {
      this.listLoading = true
      this.handleImg()
      this.feedBean.action = '添加反馈信息'
      saveLocalInegFeed(this.feedBean).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          this.$message({
            message: '反馈成功', type: 'success'
          })
          window.location.reload()
        }
      })
    },
    query() {
      this.listLoading = true
      getLocalInegFeed({
        inegId: this.inegId,
        pageNum: this.page,
        deptId: this.curDept.id
      }).then((res) => {
        this.listLoading = false
        if (res.code === '000000') {
          this.listData = res.data.list
          this.listTotal = res.data.totalCount
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    showFkDialog() {
      this.dialogVisible = true
      this.dialogTitle = '添加反馈'
      this.feedBean.content = ''
    },
    cleanDialog() {
      this.$refs.linegFeedBackForm.resetFields()
      this.dialogVisible = false
    },
    handleCurrentChange(val) {
      this.page = val
      this.query()
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
        this.feedBean.attachment = JSON.stringify(arr)
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
    downFile(path) {
      window.open(path)
    }
  },
  filters: {
    formatDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.curDept && this.curUser) {
      this.feedBean.createUser = this.curUser.id
      this.feedBean.createUserName = this.curUser.realName
      this.feedBean.createDeptId = this.curDept.id
      this.feedBean.createDeptName = this.curDept.depName
      this.feedBean.inegFeedStatus = 1
      this.feedBean.userId = this.curUser.id
      this.feedBean.userName = this.curUser.realName
      this.feedBean.bizType = 5
    }
    if (!this.bsId) {
      this.bsIdState = true
    } else {
      this.bsIdState = false
    }
  },
  watch: {
    id(val) {
      if (val) {
        this.inegId = val
        this.feedBean.inegId = val
        this.feedBean.bizId = val
        this.query()
      }
    },
    assistDepts(val) {
      this.showFkBtn = false
      if (val && val.indexOf('[' + this.curDept.id + ']') > -1) {
        this.showFkBtn = true
      }
    },
    state(val) {
      if (val && Number(val) >= 5) {
        this.isFkIng = true
      }
    },
    bsId(val) {
      if (!val || val === '') {
        this.bsIdState = true
      } else {
        this.bsIdState = false
      }
    }
  }
}
</script>

<style scoped>
</style>
