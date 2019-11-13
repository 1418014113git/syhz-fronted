<template>
 <!--申请集群战役-->
<div class="jqzyAdd">
  <el-row class="report">
    <img src="@/assets/icon/back.png"  class="goBack" @click="toList">   <!--返回-->
  </el-row>
  <el-card class="report">
    <p  class="tittle">申请集群战役</p>
    <el-form :model="form" size="small" ref="form" :rules="rules" label-width="120px" style="width:80%;margin:0 auto;">
      <el-row type="flex" justify="center" v-if="!isShowExport">
        <el-col :span="23">
          <el-form-item label="标题：" prop="clusterTitle">
            <el-input v-model="form.clusterTitle" auto-complete="off" clearable maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around" v-if="!isShowExport">
        <el-col :span="11">
          <el-form-item label="发起单位" prop="fqdepartment">
            <el-input v-model.trim="form.fqdepartment" auto-complete="off"  placeholder="" maxlength="100" disabled></el-input>
          </el-form-item>
          <el-form-item label="发起人" prop="fqPerson">
            <el-input  v-model.trim="form.fqPerson" auto-complete="off" clearable placeholder="" maxlength="20" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="涉及省/市数" prop="clusterCitys">
            <el-input v-model.trim="form.clusterCitys" maxlength="4"  placeholder="" clearable  @keyup.native="number"></el-input>
          </el-form-item>
          <el-form-item label="发起人电话" prop="applyPersonPhone">
            <el-input v-model.trim="form.applyPersonPhone" auto-complete="off" clearable maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="23">
          <el-form-item label="涉及线索" prop="" class="stxt" v-if="isShowExport">
            <el-button  @click="drxs">导入线索</el-button>
            <span class="marl" @click="distribute">线索总数： <span class="numStyle">  {{xsNum.xsTotal}}</span></span>
            <span class="marl" @click="distribute">已分发线索： <span class="numStyle">  {{xsNum.yfsxsnum}}</span></span>
            <span class="marl" @click="distribute">未分发线索： <span class="numStyle">  {{xsNum.weffxsnum}}</span></span>
            <el-button  class="marl" @click="distribute">分发</el-button>
          </el-form-item>
          <el-form-item label="涉及单位" prop="" v-if="isShowExport">
            <el-table :data="listData" v-loading="listLoading" style="width: 100%;" class="" max-height="400">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
              <el-table-column prop="" align="center" label='单位'  min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="xsnum" align="center" label="线索数量"  width="200">
                <template slot-scope="scope">
                  <span class="linkColor"  @click="distribute(scope.row)">{{scope.row.xsnum}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" title="详情"  type="primary" icon="el-icon-document" circle  @click="distribute(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="正文：" prop="assistContent"  v-if="!isShowExport">
            <vue-editor v-model="form.assistContent" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
          </el-form-item>
          <el-form-item label="附件：" style="margin-top: 15px;"  v-if="!isShowExport">
            <el-upload class="upload-demo" drag multiple :action="uploadAction"
                :auto-upload="true"
                :file-list="attachment"
                :on-success="imgSuccess"
                :on-remove="imgRemove"
                :before-remove="imgBfRemove"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :limit="5"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"> 点击或将文件拖拽到这里上传，最多5个，单个文件最大500M</div>
              <div class="el-upload__tip" slot="tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg .xls .xlsx...</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="查阅密码" prop="passKey" v-if="!isShowExport">
            <el-input v-model.trim="form.passKey" auto-complete="off" clearable placeholder="请输入" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="审核单位："  prop="acceptDeptId"  v-if="!isShowExport">
            <el-select v-model="superviseExamDeptId" placeholder="请选择上级单位"  class="input_w"  @change="deptChange">
              <el-option v-for="(item,index) in exDeptData" :key="index" :label="item.departName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="tabC btnUpLine" style="margin-top: 20px;">
        <el-col :span="20">
          <el-button  @click="cancelEdit" class="cancelBtn">取 消</el-button>
          <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">保 存</el-button>
          <el-button  type="primary" @click="apply" :loading="btnLoading" class="saveBtn" v-if="isShowApplyBtn">申 请</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <!-- 导入线索弹框-->
  <el-dialog title="导入线索" :visible.sync="isShowdrxsDialog"  class="drxsForm" :close-on-click-modal="false">
    <import-clue  :isShowDialog="isShowdrxsDialog"  @closeDialog="closedrxsDialog"></import-clue>
  </el-dialog>

  <!-- 分发线索-->
  <el-dialog title="分发线索" :visible.sync="isShowdrffxsDialog"  class="ffxsForm" :close-on-click-modal="false">
    <jqzy-disib  :isShowDialog="isShowdrffxsDialog"  @closeDialog="closeffxsDialog"></jqzy-disib>
  </el-dialog>
</div>
</template>

<script>
// import { getSessionDeptSelect } from '@/api/depts'
import { uploadImg } from '@/utils/editorUpload'
// import { getParentDeptArray } from '@/api/dept'
import VueEditor from '@/components/Editor/VueEditor'
import ImportClue from './components/importClue'
import JqzyDisib from './components/jqzyDisib'

export default {
  name: 'jqzyAdd',
  components: {
    VueEditor,
    ImportClue,
    JqzyDisib
  },
  data() {
    return {
      form: {
        clusterTitle: '', // 标题
        fqdepartment: '', // 发起单位
        fqPerson: '', // 发起人
        clusterCitys: '', // 涉及省/市数
        applyPersonPhone: '', // 发起人电话
        assistContent: '', // 正文
        acceptDeptId: '', // 审核部门Id
        acceptDeptName: '', // 审核部门名称
        acceptDept: '', // 审核部门code
        passKey: '', // 查阅密码
        curDeptType: '' // 部门类型
      },
      superviseExamDeptId: '', // 审核部门Id
      listData: [], // 涉及单位列表
      xsNum: { // 线索数
        xsTotal: 5, // 线索总数
        yfsxsnum: 2, // 已分发线索数
        weffxsnum: 3 // 未分发线索
      },
      listLoading: false,
      btnLoading: false,
      isShowApplyBtn: false, // 初始化时不显示申请按钮，当点击保存成功后，显示申请按钮。
      // isShowExport: false, // 是否显示涉及线索和涉及单位
      isShowExport: true, // 是否显示涉及线索和涉及单位
      isShowdrxsDialog: false, // 是否显示导入线索弹框
      isShowdrffxsDialog: false, // 是否显示分发线索弹出框
      inittype: '', // 初始化时默认是空，当初始化时点击了保存按钮保存成功后， 赋值：inittype=1
      attachment: [], // 导入的文件集合
      uploadAction: this.UploadAttachment.uploadFileUrl,
      curDept: {},
      curUser: {},
      exDeptData: [], // 审核单位下拉框
      rules: {
        clusterTitle: [{ // 标题
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入标题'))
            } else {
              if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        }],
        fqPerson: [{ // 发起人
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入发起人姓名'))
            } else {
              if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        }],
        applyPersonPhone: [{ // 发起人电话
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const regMoble = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
            var regFixMob = /^([0-9]{3,4}-)?[0-9]{7,8}$/
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入电话号码'))
            } else if (this.$regCode.test(value)) {
              callback(new Error('请不要输入特殊字符'))
            } else if (regMoble.test(value) || regFixMob.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的电话号码'))
            }
          }
        }],
        clusterCitys: [ //  涉及省/市数
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        assistContent: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入正文内容'))
            } else {
              if (this.$regCode.test(value)) {
                callback(new Error('请不要输入特殊字符'))
              } else {
                callback()
              }
            }
          }
        }],
        acceptDeptId: [ //  审核单位
          { required: true, message: '请选择审核单位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    queryList() { // 查询涉及单位对应的列表
      const param = {

      }
      this.listLoading = true
      this.$query('', param).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.listData = response.data
        } else {
          this.listData = []
        }
      }).catch(() => {
        this.listLoading = false
        this.listData = []
      })
    },
    queryxsnum() { // 查询线索数
      const param = {

      }
      this.$query('', param).then((response) => {
        if (response.data) {
          this.xsNum = response.data
        }
      }).catch(() => {

      })
    },
    deptChange(data) {
      if (data) {
        for (let i = 0; i < this.exDeptData.length; i++) {
          if (data === this.exDeptData[i]['id']) {
            this.superviseExamDeptId = this.exDeptData[i]['id'] // 审核部门Id
            this.form.acceptDeptName = this.exDeptData[i]['departName'] // 审核部门名称
            this.form.acceptDept = this.exDeptData[i]['departCode'] // 审核部门code
            return true
          }
        }
      } else {
        this.superviseExamDeptId = null // 审核部门Id
        this.form.acceptDeptName = null // 审核部门名称
        this.form.acceptDept = null // 审核部门code
      }
    },
    toList() {
      this.$router.back(-1)
      // if (sessionStorage.getItem(this.$route.path)) {
      //   var carryParam = JSON.parse(sessionStorage.getItem(this.$route.path))
      //   if (carryParam.source && carryParam.source === 'ajda') { // 是从案件档案跳转过来的
      //     if (carryParam.id) {
      //       if (carryParam.isRl) {
      //         this.$router.push({
      //           path: '/caseFile/index', query: { id: carryParam.id, isRl: carryParam.isRl }
      //         })
      //       } else {
      //         this.$router.push({
      //           path: '/caseFile/index', query: { id: carryParam.id }
      //         })
      //       }
      //     } else if (carryParam.ajbh) {
      //       if (carryParam.interfaceType) {
      //         this.$router.push({
      //           path: '/caseFile/index', query: { ajbh: carryParam.ajbh, interfaceType: carryParam.interfaceType } // 传递案件编号
      //         })
      //       } else if (carryParam.isRl) {
      //         this.$router.push({
      //           path: '/caseFile/index', query: { ajbh: carryParam.ajbh, isRl: carryParam.isRl } // 传递案件编号
      //         })
      //       }
      //     } else {
      //       this.$router.back(-1)
      //     }
      //   } else {
      //     this.$router.back(-1)
      //   }
      // } else {
      //   this.$router.back(-1)
      // }
    },
    cancelEdit() {
      this.$confirm('确认要放弃操作吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.resetForm()
        this.toList()
      })
    },
    handleImg() {
      if (this.attachment.length > 0) {
        const arr = []
        for (let i = 0; i < this.attachment.length; i++) {
          const img = this.attachment[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.form.attachment = JSON.stringify(arr)
      }
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.form = {
        clusterTitle: '', // 标题
        fqdepartment: '', // 发起单位
        fqPerson: '', // 发起人
        clusterCitys: '', // 涉及省/市数
        applyPersonPhone: '', // 发起人电话
        assistContent: '', // 正文
        passKey: '' // 查阅密码
      }
    },
    getDepts() {
      this.form.curDeptType = this.curDept.depType
      var paramCode = ''
      if (this.curDept.depType === '4') { // 派出所
        paramCode = this.curDept.parentDepCode
      } else {
        paramCode = this.curDept.depCode
      }
      // 查审核单位 自己的上级
      this.$query('hsyzparentdepart/' + paramCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.exDeptData = [response.data]
        }
      }).catch(() => {
        this.caseLoading = false
      })
    },
    queryCase(val) {
      if (!val) {
        return false
      }
      this.caseLoading = true
      this.$query('searchsyhaj', {
        ajmc: val,
        depCode: this.curDept.depCode
      }).then((response) => {
        this.caseLoading = false
        if (response.data) {
          this.caseList = response.data
        }
      })
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

    drxs() { // 导入线索
      this.isShowdrxsDialog = true // 显示导入线索谈框
    },
    distribute(row) { // 分发
      this.isShowdrffxsDialog = true
      // this.$router.push({ path: '', query: { type: 'listDetail', id: row.id }}) // 跳转到线索分发页
    },
    closedrxsDialog(val) { // 关闭导入线索弹框
      this.isShowdrxsDialog = val
      // this.queryList()
    },
    closeffxsDialog(val) { // 关闭分发线索弹框
      this.isShowdrffxsDialog = val
      // this.queryList()
    },
    save() { // 保存
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.userId = this.curUser.id // 当前用户Id
          this.form.userName = this.curUser.realName // 当前用户真实姓名
          this.from.curDeptName = this.curUser.departName // 当前部门名称
          this.from.curDeptCode = this.curUser.departCode // 当前部门code
          this.from.curDeptId = this.curUser.departId // 当前部门id
          this.from.acceptDeptId = this.superviseExamDeptId //  审核部门id
          this.handleImg() // 附件list转换成字符串
          this.btnLoading = true
          if (!this.inittype) { // 初始化时保存，涉及线索和涉及单位此时都不显示。
            this.$update('casecluster/save', this.form).then((response) => {
            // this.$message({
            //   message: '人员信息保存成功！',
            //   type: 'success',
            //   duration: 2000
            // })
              this.inittype = 1 // 改变此状态，
              // if(){
              //   this.isShowApplyBtn = true // 保存成功后，,线索列表有数据，显示申请按钮。
              // }else{
              //   this.isShowApplyBtn = false // 保存成功后，线索列表无数据，隐藏申请按钮。
              // }

              this.isShowExport = true // 显示涉及线索和涉及单位
              this.btnLoading = false
            }).catch(() => {
              this.btnLoading = false
            })
          } else { //  初始化时保存成功，此时申请按钮，涉及线索和涉及单位都显示，其他的内容都隐藏。
            this.$update('' + this.curId, this.form).then((response) => {
              this.$message({
                message: '信息保存成功！',
                type: 'success',
                duration: 2000
              })
              this.inittype = 1
              this.btnLoading = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    apply() { // 申请

    },
    number() { // 只能是数字
      var num = this.form.clusterCitys.replace(/[^\.\d]/g, '').replace('.', '')
      this.form.clusterCitys = num
      this.form.clusterCitys = this.form.clusterCitys.replace('.', '')
    },
    handleExceed() { // 上传文件超过最大限制时，提示信息
      this.$message.error(`最多上传5个文件`)
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.form.fqPerson = this.curUser.realName // 当前登录人姓名
    this.form.applyPersonPhone = this.curUser.applyPersonPhone ? this.curUser.applyPersonPhone : '' // 当前登录人电话
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.form.fqdepartment = this.curDept.depName // 当前登录人单位
      // this.getDepts()
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.jqzyAdd {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  .tittle{
    text-align: left;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .input_w {
    width: 100%;
    min-width: 150px;
  }
  .el-collapse-item__header {
    color: #409eff;
  }
  .stxt{
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
  .numStyle{
    cursor: pointer;
    font-weight: bold;
    text-decoration:underline;
  }
  .numStyle:hover{
    color: #00a0e9;
  }
  .marl{
    margin-left: 15px;
  }
  .ffxsForm{
    .el-dialog{
      width: 75%;
      max-height: 80vh;
      overflow: auto;
    }
  }
}
@media only screen and (max-width: 1367px) {
  .jqzyAdd .ffxsForm .el-dialog {
    width: 85%;
  }
}
</style>
