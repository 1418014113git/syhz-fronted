<template>
  <section>
    <el-row style="width:90%;margin:0 auto;">
      <el-col :span="24">
        <el-form ref="legalDocForm" :model="legalDocForm" :rules="rules" label-width="124px" class="flws-form">
          <el-form-item label="法律文书名称" prop="wsbt">
            <el-select v-model="legalDocForm.wsbt" placeholder="请选择法律文书名称" filterable @change="wsbtChange" style="width:100%;">
              <el-option v-for="item in wsbtList" :key="item.code" :label="item.codeName" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文号" prop="wh">
            <el-input v-model="legalDocForm.wh" maxlength="30" placeholder="请输入文号"></el-input>
          </el-form-item>
          <el-form-item label="填发单位" prop="tfdw">
            <el-tooltip class="item" effect="dark" :content="legalDocForm.tfdwName" placement="top-start" :popper-class="(legalDocForm.tfdwName&&legalDocForm.tfdwName.length>11)?'tooltipShow':'tooltipHide'">
              <el-select v-model="legalDocForm.tfdw" placeholder="请选择填发单位" filterable @change="deptChange" style="width:100%;">
                <el-option v-for="item in tfdwData" :key="item.id" :label="item.name" :value="item.depCode"></el-option>
              </el-select>
             </el-tooltip>
          </el-form-item>
          <el-form-item label="填发日期" prop="tfrq">
            <el-date-picker
              v-model="legalDocForm.tfrq"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="填发人" prop="tfrName">
            <el-input v-model="legalDocForm.tfrName" maxlength="30" placeholder="请输入填发人" ></el-input>
          </el-form-item>
          <el-form-item label="是否有效" prop="sfyx">
            <el-select v-model="legalDocForm.sfyx" placeholder="请选择" clearable @change="selectChange($event,'sfyxData')">
              <el-option v-for="item in sfyxData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审批标识" prop="spbs">
            <el-select v-model="legalDocForm.spbs" placeholder="请选择" clearable @change="selectChange($event,'spbsData')">
              <el-option v-for="item in spbsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文书图片" prop="uploadImgs" class="uploadImgs">
            <el-upload drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadImgs"
                       :on-success="imgSuccess"
                       :on-remove="imgRemove"
                       :on-preview="imgPreview"
                       :before-remove="imgBfRemove"
                       :before-upload="beforeUpload"
                       :limit="30"
                       :on-exceed="handleExceed"
                       accept="image/*">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipTextImg}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文书附件" prop="uploadFiles" class="uploadImgs">
            <el-upload drag multiple :action="uploadAction"
                       :auto-upload="true"
                       :file-list="uploadFiles"
                       :on-success="imgSuccess1"
                       :on-remove="imgRemove1"
                       :on-preview="imgPreview"
                       :before-remove="imgBfRemove"
                       :before-upload="beforeUpload1"
                       :limit="10"
                       :on-exceed="handleExceed1">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipTextOther}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-loading="saveLoading">提交</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import {
  getSessionDeptSelect
} from '@/api/depts'
export default {
  props: ['ajbh', 'againNowsInfo'],
  data() {
    return {
      uploadAction: this.UploadAttachment.uploadFileUrl,
      legalDocForm: {
        tfdw: '',
        sfyx: '1',
        sfyxName: '有效',
        spbs: '1',
        spbsName: '是',
        wsnr: {
          images: '',
          others: ''
        }
      }, // 没有文书表单
      wsbtList: [], // 法律文书标题数据源
      tfdwData: [], // 审核部门数据list
      saveLoading: false,
      AJBH: '',
      // againNowsInfo: {}, // 再次无文书申请数据
      sfyxData: [ // 是否有效
        { value: '0', name: '无效' },
        { value: '1', name: '有效' }
      ],
      spbsData: [ // 审批标识
        { value: '0', name: '否' },
        { value: '1', name: '是' }
      ],
      userInfo: {}, // 当前用户
      curDept: {}, // 当前部门
      uploadImgs: [], // 文书图片
      uploadFiles: [], // 文书附件
      pickerOptions: {
        disabledDate(time) {
          // 填发日期 只能选今天和以前的
          return time.getTime() > Date.now()
        }
      },
      rules: {
        wsbt: [{
          required: true, message: '请选择法律文书名称', trigger: 'change'
        }],
        tfdw: [{
          required: true, message: '请选择填发单位', trigger: 'change'
        }],
        tfrq: [{
          required: true, message: '请选择填发日期', trigger: 'change'
        }],
        tfrName: [{
          required: true, message: '请输入填发人', trigger: 'blur'
        }]
      }

    }
  },
  watch: {
    ajbh(val) {
      if (val) {
        this.AJBH = val
        this.initData()
      }
    }
    // againNowsInfo(val) {
    //   if (val) {
    //     console.log(val)
    //     this.legalDocForm = val
    //   }
    // }
  },
  methods: {
    init(row) {
      // this.legalDocForm = row
    },
    initData() {
      if (this.ajbh) {
        this.AJBH = this.ajbh
      }
      if (sessionStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      if (sessionStorage.getItem('depToken')) {
        this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      }
      this.legalDocForm.tfrName = this.userInfo.realName
      this.initDept()
      this.initFlwsType()
    },
    initFlwsType() {
      this.$query('tcpcode', { codeLx: 'WSBT' }).then((response) => {
        if (response.data && response.data.length > 0) {
          this.wsbtList = response.data
          // const temp = {}
          // for (let index = 0; index < response.data.length; index++) {
          //   const element = response.data[index]
          //   temp[element.codeName] = element.code
          // }
          // const arr = []
          // for (const key in temp) {
          //   arr.push({ code: temp[key], codeName: key })
          // }
          // console.log(arr)
        }
      }).catch(() => {
      })
    },
    wsbtChange(val) { // 法律文书change
      if (val) {
        for (let i = 0; i < this.wsbtList.length; i++) {
          if (val === this.wsbtList[i].code) {
            this.legalDocForm.flwsmc = this.wsbtList[i].codeName
          }
        }
      } else {
        this.legalDocForm.wsbt = ''
      }
    },
    onSubmit() {
      this.$refs.legalDocForm.validate(valid => {
        if (valid) {
          if (this.uploadImgs.length > 0) {
            this.handleImg()
          } else {
            this.$message.error('文书图片不能为空')
            return false
          }
          if (this.uploadFiles.length > 0) {
            this.handleFile()
          } else {
            this.$message.error('文书附件不能为空')
            return false
          }
          this.legalDocForm.wsnr = JSON.stringify(this.legalDocForm.wsnr)
          this.saveLoading = true
          var param = JSON.parse(JSON.stringify(this.legalDocForm))
          param.userId = this.userInfo.id
          param.userName = this.userInfo.realName
          param.tfrq = param.tfrq.replace(/-/g, '') // 将日期中的短横线去掉
          param.czdw = this.curDept.depCode // 存当前部门code
          param.ajbh = this.AJBH
          // console.log(param)
          this.$save('ajflws', param).then((response) => {
            if (response.code === '000000') {
              this.saveLoading = false
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$emit('changeDialog', false)
              // window.location.reload()
            }
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    reset() {
      this.$refs.legalDocForm.resetFields()
      this.legalDocForm = {
        tfdw: this.curDept.depCode, // 默认填发单位是当前部门
        tfrName: this.userInfo.realName, // 填发人 默认是当前登录用户的realname
        sfyx: '1',
        sfyxName: '有效',
        spbs: '1',
        spbsName: '是',
        wsnr: {
          images: '',
          others: ''
        }
      }
      this.deptChange(this.curDept.depCode) // 默认填发单位是当前部门
      this.uploadImgs = []
      this.uploadFiles = []
    },
    initDept() {
      this.tfdwData = getSessionDeptSelect()
      this.legalDocForm.tfdw = this.curDept.depCode
      this.deptChange(this.curDept.depCode) // 默认填发单位是当前部门
    },
    deptChange(val) {
      if (val) {
        for (let i = 0; i < this.tfdwData.length; i++) {
          if (val === this.tfdwData[i].depCode) {
            this.legalDocForm.tfdwName = this.tfdwData[i].name
          }
        }
      } else {
        this.legalDocForm.tfdwName = ''
      }
    },
    selectChange(val, array) {
      if (val) {
        for (let i = 0; i < array.length; i++) {
          var element = array[i]
          if (val === array[i].value) {
            if (array === 'sfyxData') { // 是否有效
              this.legalDocForm.sfyxName = element.name
            } else if (array === 'spbsData') { // 审批标识
              this.legalDocForm.spbsName = element.name
            }
          }
        }
      } else {
        if (array === 'sfyxData') { // 是否有效
          this.legalDocForm.sfyxName = ''
        } else if (array === 'spbsData') { // 审批标识
          this.legalDocForm.spbsName = ''
        }
      }
    },
    handleImg() {
      if (this.uploadImgs.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadImgs.length; i++) {
          const img = this.uploadImgs[i]
          if (img.status === 'success') {
            // arr.push({
            //   name: img.name, path: img.path ? img.path : img.response.data
            // })
            arr.push(img.path || img.response.data)
          }
        }
        this.legalDocForm.wsnr.images = arr.join(',')
      } else {
        this.$message.error('文书图片不能为空')
        return false
      }
    },
    handleFile() {
      if (this.uploadFiles.length > 0) {
        const arr = []
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const img = this.uploadFiles[i]
          if (img.status === 'success') {
            // arr.push({
            //   name: img.name, path: img.path ? img.path : img.response.data
            // })
            arr.push(JSON.stringify({ name: img.name, path: img.path || img.response.data }))
          }
        }
        this.legalDocForm.wsnr.others = arr.join('|') // 这里不能用逗号
      } else {
        this.$message.error('文书附件不能为空')
        return false
      }
    },
    handleExceed(files, fileList) { // 限制上传文件个数
      this.$message.error('最多上传30张文书图片')
    },
    handleExceed1(files, fileList) { // 限制上传文件个数
      this.$message.error('最多上传10个文书附件')
    },
    imgSuccess(res, file, fileList) {
      this.uploadImgs = fileList
    },
    imgRemove(file, fileList) {
      this.uploadImgs = fileList
    },
    imgSuccess1(res, file, fileList) {
      this.uploadFiles = fileList
    },
    imgRemove1(file, fileList) {
      this.uploadFiles = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    imgPreview(file) {
      // console.log(file)
    },
    beforeUpload(file) {
      const msg = this.UploadAttachment.imgValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    },
    beforeUpload1(file) {
      const msg = this.UploadAttachment.fileOtherValid(file)
      if (msg.length > 0) {
        this.$message({
          message: msg, type: 'warning'
        })
        return false
      }
    }
  },
  mounted() {
    this.initData()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.flws-form {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .uploadImgs.el-form-item .el-form-item__label:after {
    content: "*";
    color: #f56c6c;
    margin-left: 5px;
  }
  .uploadImgs.el-form-item::before {
    display: table;
    content: "";
  }
}
</style>



