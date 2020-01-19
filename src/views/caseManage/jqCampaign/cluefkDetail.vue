<template>
  <section class="clueDetail">
   <!--线索反馈详情-->
      <el-form :model="xsfkForm" size="small" ref="xsfkForm" :rules="rules" v-loading="listLoading"  label-width="120px" class="xsfkForm">
        <el-form-item label="核查情况"  prop="qbxsResult">
          <el-radio-group v-model="xsfkForm.qbxsResult" @change="changeQbxsResult">
            <el-radio :label="2">查实</el-radio>
            <el-radio :label="3" style="margin-left:50px;">查否</el-radio>
            <el-popover
            class="qkts"
            placement="right"
            width="300"
            trigger="hover">
            <div>
              <span>线索<span class="redC">查实</span>情况包括：电话、地址准确无误可联系到核查对象、
               被核查对象主动配合、被核查对象否认否买**等；
              </span> <br>
               <span>线索<span class="redC">查否</span>情况包括：电话、地址存在错误<span class="redC">无法联系</span>
               到核查对象。
              </span>
            </div>
            <el-button  type="primary" size="mini" circle slot="reference"><svg-icon icon-class="wenhao"></svg-icon></el-button>
          </el-popover>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理方式"  prop="handleResult"  v-if="xsfkForm.qbxsResult===2">
          <el-radio-group v-model="xsfkForm.handleResult" @change="changeclfsResult">
            <el-radio :label="1">立案</el-radio>
            <el-radio :label="2" style="margin-left:50px;">移送行政部门处理</el-radio>
            <el-radio :label="3" style="margin-left:50px;">其他处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="侦办刑事案件" prop="zbajmc"  v-if="isShowzbaj" class="stxt">
          <el-autocomplete
              class="inputW"
              v-model="zbajmc"
              :fetch-suggestions="querySearchAsyncName"
              placeholder="请输入案件名称搜索"
              :trigger-on-focus="false"
              @select="handleSelectName"
            ></el-autocomplete>
          <el-button type="primary" size="small"  @click="checkaj">选择</el-button>
        </el-form-item>
        <el-form-item label=""  v-if="isShowzbaj">
          <el-table :data="zblistData"  style="width: 100%;" class=""  show-summary :summary-method="getSummaries" sum-text="总计">
            <el-table-column type="index" width="60" label="序号"></el-table-column>
            <el-table-column prop="ajmc"  label='案件名称'  min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ajbh"  label='案件编号'  min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <a class="linkColor" @click="toAjDetail(scope.row.id)">{{scope.row.ajbh}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="ajztName"  label='案件状态'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="larq"  label='立案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.larq">{{scope.row.larq}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="parq"  label='破案日期'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.parq">{{scope.row.parq}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="zhrys"  label='抓获（人）'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.zhrys">{{scope.row.zhrys}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="ryclcs"  label='刑拘（人）'  min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pzdb"  label='批捕（人）'  min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.pzdb">{{scope.row.pzdb}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
             <el-table-column prop="yjss" label="移诉（人）"  min-width="100"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if='scope.row.yjss'>{{scope.row.yjss}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="dhwd"  label='捣毁窝点（个）'  min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.dhwd">{{scope.row.dhwd}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="sajz"  label='涉案金额（万元）'  min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.sajz">{{scope.row.sajz}}</span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  width="100" fixed="right">
              <template slot-scope="scope">
                <el-button  size="mini" title="移除案件"  type="primary" icon="el-icon-delete" circle  @click="handleDel(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="反馈内容" prop="backResult"  placeholder="请输入反馈内容">
          <vue-editor v-model="xsfkForm.backResult" useCustomImageHandler  @imageAdded="handleImageAdded" @contentChange="contentChange"></vue-editor>
        </el-form-item>
        <el-form-item label="附件" style="margin-top: 15px;">
          <el-upload class="upload-demo" drag multiple  ref="fileUpload"
              :action="uploadAction"
              :auto-upload="true"
              :file-list="backFiles"
              :on-success="imgSuccess"
              :on-remove="imgRemove"
              :before-remove="imgBfRemove"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :limit="10"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，最多10个</div>
            <div class="el-upload__tip" slot="tip">{{UploadAttachment.tipText}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row class="tabC dialogBtnUpLine">
        <el-button  @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button  type="primary" @click="save" :loading="btnLoading" class="saveBtn">反 馈</el-button>
      </el-row>
  </section>
</template>
<script>
import { uploadImg } from '@/utils/editorUpload'
import VueEditor from '@/components/Editor/VueEditor'
export default {
  props: ['row', 'isShowdialog', 'allRow'],
  name: 'clueDetail',
  components: {
    VueEditor
  },
  data() {
    return {
      xsfkForm: {
        qbxsResult: '', // 核查情况
        handleResult: '', // 处理方式
        backResult: '', // 反馈内容
        backFiles: '' // 附件
      },
      zbajmc: '', // 存储检索框输入的案件名称
      zbajList: {}, // 侦办案件选择的下拉框item
      backFiles: [], // 导入的附件集合
      curDeptName: '', // 当前部门名称
      curDepartId: '', // 当前部门id
      curDeptCode: '', // 当前部门code
      xsfkRow: {}, // 存储线索反馈列表传递过来的当前行的数据
      // yslistData: [], // 移送案件列表
      // ysajSelectData: [], // 移送案件下拉框数据
      zbajSelectData: [], // 侦办案件下拉框数据
      zblistData: [], // 侦办刑事案件列表
      // yslistLoading: false, // 移送案件列表加载loading
      // zblistLoading: false, // 侦办刑事案件列表加载loading
      listLoading: false, // 页面加载loading
      // isShowTime: false, // 是否显示更新时间
      isShowzbaj: false, // 是否显示侦办刑事案件  选查否后隐藏处理方式和侦办刑事案件， 选立案时显示侦办刑事案件，其他选项时隐藏
      isQueryName: false,
      curUser: {}, // 当前登录用户
      curDept: {}, // 当前登录的部门
      // updateTime: '', // 存储更新时间
      // detailInfo: {}, // 存储详情信息
      // ysajbh: '', // 存储下拉选项的移送案件编号
      btnLoading: false, // 反馈按钮loading
      allfkdata: {}, // 批量反馈传递的参数
      selectList: [], // 侦办刑事案件下拉数据
      selectAjmc: '', // 存储被选择的下拉项
      uploadAction: this.UploadAttachment.uploadFileUrl,
      rules: {
        qbxsResult: [ //  协查情况
          { required: true, trigger: 'change', message: '请选择协查情况' }
        ],
        handleResult: [ //  处理方式
          { required: true, trigger: 'change', message: '请选择处理方式' }
        ],
        // zbajmc: [ //  侦办刑事案件名称
        //   { required: true, trigger: 'blur', message: '请选择侦办刑事案件' }
        // ],
        backResult: [{ // 反馈内容
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
              return callback(new Error('请输入反馈内容'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  watch: { // 监听state状态变化
    row: {
      handler: function(val, oldeval) {
        this.xsfkRow = val
      }
    },
    isShowdialog: {
      handler: function(val, oldeval) {
        if (val) {
          if (this.xsfkRow.fbId) {
            this.detail() // 查详情
          }
        }
      }
    },
    allRow: {
      handler: function(val, oldeval) {
        this.allfkdata = val
      }
    }
  },
  methods: {
    detail() { // 查详情
      this.listLoading = true
      this.xsfkForm.qbxsResult = this.xsfkRow.qbxsResult ? (this.xsfkRow.qbxsResult !== 1 ? this.xsfkRow.qbxsResult : '') : ''
      const para = {
        assistId: this.xsfkRow.clusterId, // 集群Id
        type: 'detail', // 操作类型
        fbId: this.xsfkRow.fbId, // 反馈Id
        assistType: 2 // 2 集群
      }
      this.$query('caseassistclue/feedBack/detail', para).then((response) => {
        this.listLoading = false
        this.xsfkForm.handleResult = response.data.handleResult || '' // 处理方式
        this.xsfkForm.backResult = response.data.backResult || '' // 反馈内容
        this.xsfkForm.backFiles = response.data.backFiles || '' // 附件
        this.backFiles = response.data.backFiles ? JSON.parse(response.data.backFiles) : [] // 附件
        this.zblistData = response.data.zbxssList || [] // 侦办案件列表集合
        if (this.xsfkForm.qbxsResult === 2 && this.xsfkForm.handleResult === 1) { // 查实  立案
          this.isShowzbaj = true
        } else {
          this.isShowzbaj = false
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getfqDepts() { // 如果登上来的是派出所 发起单位显示他的父级单位
      this.$query('hsyzparentdepart/' + this.curDept.depCode, {}, 'upms').then((response) => {
        if (response.code === '000000') {
          this.curDeptName = response.data.departName // 当前部门名称
          this.curDepartId = response.data.id // 当前部门id
          this.curDeptCode = response.data.departCode // 当前部门code
        }
      }).catch(() => {
      })
    },
    initData() {
      this.$refs['xsfkForm'].resetFields()
      this.yslistData = [] // 移送案件列表
      this.ysajSelectData = [] // 移送案件下拉框数据
      this.zbajSelectData = [] // 侦办案件下拉框数据
      this.zblistData = [] // 侦办刑事案件列表
      this.zbajmc = '' // 存储下拉选项的侦办刑事案件名称
    },
    toAjDetail(id) { // 跳转案件档案
      this.$router.push({
        path: '/caseFile/index', query: { id: id }
      })
    },
    checkaj() { // 选择案件
      // 侦办案件
      if (!this.zbajmc) {
        this.$message.error('请输入案件名称搜索')
      } else {
        if (this.selectList.length > 0 && !this.zbajList.ajbh) {
          this.$message.error('请选择案件')
          return
        }
        if (this.zbajList.ajbh && this.selectAjmc === this.zbajmc) {
          this.zblistData.push(this.zbajList)
          this.zblistData = this.unique(this.zblistData) // 去重
        }
      }
    },
    unique(arr) { // 数组列表去重
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].ajbh === arr[j].ajbh) { // 第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    changeQbxsResult(val) { // 查实、查否操作
      if (val === 3) { // 查否
        this.isShowzbaj = false
        this.xsfkForm.handleResult = '' // 清空处理方式
      } else { // 查实
        if (!this.xsfkForm.handleResult || this.xsfkForm.handleResult === 1) { // 处理方式未选 或 选的是立案
          this.isShowzbaj = true
        }
      }
    },
    changeclfsResult(val) { // 处理方式操作
      if (val === 1) { // 立案
        this.isShowzbaj = true
      } else if (val === 2) { // 移送行政部门处理
        this.isShowzbaj = false
      } else { // 其他处理
        this.isShowzbaj = false
      }
    },
    handleDel(index, row) { // 移除案件
      this.$confirm('确定要移除该案件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.zblistData.splice(index, 1)
      }).catch(() => {

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
      }).catch((e) => { })
    },
    imgSuccess(res, file, fileList) {
      if (res.code !== '000000') {
        this.$alert('上传失败， 请重新上传', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.clearFileList()
          }
        })
        return false
      }
      this.backFiles = fileList
    },
    clearFileList() {
      this.$refs.fileUpload.abort()
      const elementArr = document.getElementsByClassName('el-upload-list__item')
      for (let i = 0; i < elementArr.length; i++) {
        const element = elementArr[i]
        if (i === elementArr.length - 1) {
          element.setAttribute('style', 'display: none;')
          element.remove()
        }
      }
    },
    handleExceed() { // 上传文件超过最大限制时，提示信息
      this.$message.error(`最多上传10个文件`)
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
    imgRemove(file, fileList) {
      this.backFiles = fileList
    },
    imgBfRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('确定移除' + file.name + '？')
      }
    },
    handleImg() {
      if (this.backFiles.length > 0) {
        const arr = []
        for (let i = 0; i < this.backFiles.length; i++) {
          const img = this.backFiles[i]
          if (img.status === 'success') {
            arr.push({
              name: img.name, path: img.path ? img.path : img.response.data
            })
          }
        }
        this.xsfkForm.backFiles = JSON.stringify(arr)
      }
    },
    cancel() { // 取消
      this.$emit('closeDialog', false) // 关闭弹框
    },
    save() { // 反馈
      this.$refs.xsfkForm.validate(valid => {
        if (valid) {
          this.handleImg() // 附件list数据改造，用于编辑时的附件展示使用
          if (this.isShowzbaj && this.zblistData.length === 0) {
            this.$alert('请选择案件', '提示', {
              type: 'error',
              confirmButtonText: '确定'
            })
            return false
          }
          var zbxssList = []
          this.zblistData.forEach(function(item) {
            zbxssList.push(item.ajbh)
          })
          const param = {
            qbxsId: this.xsfkRow.qbxsId ? this.xsfkRow.qbxsId : this.allfkdata.qbxsId, // 线索id
            fbId: this.xsfkRow.fbId ? this.xsfkRow.fbId : this.allfkdata.fbId, // 反馈Id
            qbxsResult: this.xsfkForm.qbxsResult, // 核查结果
            assistId: this.xsfkRow.clusterId ? this.xsfkRow.clusterId : this.allfkdata.clusterId, // 集群Id
            handleResult: this.xsfkForm.handleResult, // 处理方式
            zbxss: this.xsfkForm.qbxsResult === 3 ? '' : (this.xsfkForm.handleResult === 1 ? zbxssList.join(',') : ''), // 案件编号逗号分隔
            backResult: this.xsfkForm.backResult, // 处理方式
            backFiles: this.xsfkForm.backFiles, // 附件
            userId: this.curUser.id, // 当前用户Id
            userName: this.curUser.realName, // 当前用户真实姓名
            curDeptName: this.curDept.depType === '4' ? this.curDeptName : this.curDept.depName, // 当前部门名称
            curDeptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
            assistType: 2 // 2 集群
          }
          this.btnLoading = true
          this.$update('caseassistclue/feedBack', param).then((response) => {
            this.btnLoading = false
            this.$message({
              message: '反馈成功',
              type: 'success'
            })
            this.$emit('closeDialog', false) // 关闭弹框   init
            this.$emit('init')
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    querySearchAsyncName(queryString, cb) { // 根据案件名称检索
      if (queryString) {
        this.isQueryName = true
        this.zbajList = {}
        if (this.isQueryName) {
          var param = {
            ajmc: this.zbajmc, // 案件名称
            type: 2, // 1移送案件，2侦办案件
            fbId: this.xsfkRow.fbId ? this.xsfkRow.fbId : this.allfkdata.fbId, // 反馈Id
            assistId: this.xsfkRow.clusterId ? this.xsfkRow.clusterId : this.allfkdata.clusterId, // 集群Id
            deptCode: this.curDept.depType === '4' ? this.curDeptCode : this.curDept.depCode, // 当前部门code
            assistType: 2 //  2 集群
          }
          this.$query('caseassistclue/ajSearch', param).then((response) => {
            var restaurants = response.data
            this.selectList = response.data
            restaurants.forEach(element => {
              element.value = element.ajmc
            })
            queryString = queryString.trim() // 去掉输入框的首尾空格
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          })
        }
      } else {
        this.isQueryName = false
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelectName(item) {
      this.zbajmc = item.ajmc
      this.selectAjmc = item.ajmc
      this.zbajList = item
      this.isQueryName = false
    },
    getSummaries(param) { // 总计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index === 1 || index === 2 || index === 3) {
          sums[index] = '-'
          return
        }
        if (index === 4 || index === 5) { // 立案日期， 破案日期
          const values = data.map(item => Date.parse(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + 1
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 0
          }
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.$thousSplit(sums[index] + '')
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    contentChange(val) {
      this.$refs.xsfkForm.validateField('backResult')
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    if (sessionStorage.getItem('depToken')) {
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      if (this.curDept.depType === '4') { // 派出所
        this.getfqDepts()
      }
    }
    this.xsfkRow = this.row
    this.allfkdata = this.allRow
    if (this.xsfkRow.fbId) {
      this.detail() // 查详情
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.clueDetail{
  .el-table--border th {
    border-bottom: 1px solid #2f627a;
    border-right: 1px solid #2f627a;
  }
  .el-table--border,
  .el-table--group {
    border: 1px solid #2f627a;
  }
  .el-table--border td {
    // border-right: 1px solid #2f627a;
    border-right-color: #2f627a;
  }
  .el-table--border::after,
  .el-table--group::after {
    width: 0;
  }
  .stxt{
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 5px;
    }
  }
  .tipText{
    padding: 5px 0;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .textCen{
    .el-input__inner{
      text-align: center;
    }
  }
  .inputW{
    width: 400px;
  }

  // 动态添加列表行时，需要修改下样式
  .el-table__fixed-footer-wrapper tbody td {
    background: rgba(0, 89, 130, 1);
    border: none;
  }
  // 将滚定条设置到合计行下方
  // .el-table{
  //   overflow: auto;
  // }
  // .el-table__body-wrapper,
  // .el-table__header-wrapper,
  // .el-table__footer-wrapper{
  //   overflow:visible !important;
  // }
  // .el-table::after{
  //   position: relative !important;
  // }
}
.redC{
  color: #f72929;
}
.qkts{
  margin-left: 60px;
  .el-button--mini.is-circle, .el-button--small.is-circle {
    padding: 0;
  }
  .svg-icon[data-v-5d4549d3] {
    width: 1.2em;
    height: 1.2em;
  }
}
</style>
