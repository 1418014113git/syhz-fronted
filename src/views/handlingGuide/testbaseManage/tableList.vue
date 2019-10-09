<template>
  <section class="testTableList">
    <div class="addTestQuestion">
      <el-button type="primary" size="small" @click="addTestQuestion" icon="el-icon-plus" v-if="menuItemNode.deleteable==='0'">添加试题</el-button>
      <a :href="downLoadUrl+'试题导入模板.xlsx'"  download="试题导入模板.xlsx" style="margin:0 10px;">
        <el-button type="primary" icon="el-icon-upload2">模板导出</el-button>
      </a>
      <el-button type="primary" @click="importTem('importInfo')" :loading="importLoading" icon="el-icon-download">批量导入</el-button>
    </div>
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="试题类型" prop="AJMC">
        <el-select v-model="filters.tx" placeholder="请选择题型" @change="questionTypeChange">
          <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" class-name="tabC" align="center"></el-table-column>
      <el-table-column prop="subjectName" label="题目内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="scope.row.subjectName" class="richTextWrap questionCon"></span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyDate" label="更新时间" width="200" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" width="120" class-name="tabC" align="center">
        <template slot-scope="scope">
          <!-- <el-tag type="success"> -->
            {{$getLabelByValue(scope.row.type+'', txData)}}
          <!-- </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" circle @click="handleDetail(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑"></el-button>
          <el-button size="mini" circle type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除"></el-button>
          <!-- <el-button size="mini" circle type="danger" v-if="scope.row.deleteable=='1'" @click="handleRevord(scope.$index, scope.row)" title="发布">
            <svg-icon icon-class="audit"></svg-icon>
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 详情弹框 -->
    <el-dialog title="试题详情" :visible.sync="dialogDetailVisible" size="small" @close="closeDia('detail')" class="comDialog" width="50%">
      <question-detail :questionItem="curQuestion"></question-detail>
    </el-dialog>
    <!-- 导入弹框 -->
    <el-dialog title="试题导入" :visible.sync="dialogImportVisible" size="small" @close="closeDia('importInfo')" class="comDialog">
      <el-form ref="importInfo" size="small" :rules="rules" :model="importInfo" label-width="100px" v-loading="importLoading">
        <el-form-item label="模块" prop="category">
          <el-cascader :options="mokuaiList" v-model="importInfo.category" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="试题文件" class="fileItem">
          <!-- <span class="fileinput-button"> -->
          <!-- <el-button >选择文件</el-button> -->
            <!-- <span>选择文件</span> -->
            <input type="file" @change="getFile" clearable name="file" id="excelFile"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          <!-- </span> -->
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDia('importInfo')" class="cancelBtn" :loading="importLoading">取消</el-button>
          <el-button type="primary" @click="submitImportForm('importInfo')" class="saveBtn" :loading="importLoading">导入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导入试题的提示 错误信息 -->
    <el-dialog width="50%" title="提示信息" :visible.sync="innerErrorInfoVisible" append-to-body>
      <el-table :data="errorData">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template slot-scope="scope">
            <!-- <el-tag type="success"> -->
              {{$getLabelByValue(scope.row.type+'', txData)}}
            <!-- </el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="num" label="行数" width="60"></el-table-column>
        <el-table-column prop="des" label="错误信息" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'
import questionDetail from './detail'
import importexport from '@/api/importexport'
import Http from '@/api/http'
import axios from 'axios'
export default {
  name: 'list',
  props: {
    menuItemNode: {
      type: Object,
      required: false
    },
    dataList: {
      type: Array,
      required: false
    },
    parentId: {
      type: Number,
      required: false,
      default: function() {
        return -1
      }
    },
    parentColName: {
      type: String,
      required: false,
      default: function() {
        return 'parentId'
      }
    }
  },
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      ModuleName: Http.ModuleName,
      tableData: [], // 列表数据
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      filters: {
        tx: '1'
      },
      // txData: questionTypeAll('all'),
      txData: questionTypeAll('1'),
      dialogImportVisible: false, // 导入弹框
      importLoading: false, // 导入弹框loading
      importInfo: {
        category: [] // 模块
      }, // 导入弹框
      fileCon: '', // 导入试题内容
      dialogDetailVisible: false,
      curQuestion: {},
      mokuaiList: [],
      innerErrorInfoVisible: false, // 导入错误信息提示框
      errorData: [], // 导入错误信息提示
      props: {
        value: 'id'
      },
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0], // 当前部门信息
      rules: {
        category: {
          required: true, message: '请选择模块', trigger: 'change'
        }
      }
    }
  },
  components: {
    questionDetail
  },
  watch: { // 监听state状态变化
    menuItemNode: {
      handler: function(val, oldeval) {
        this.queryList(true)
      }
    },
    dataList: {
      handler: function(val, oldeval) {
        this.changeData(val)
        // this.mokuaiList = [val]
      }
    }
  },
  methods: {
    changeData(data) { // tree数据结构改造
      if (data.length > 0) {
        const _this = this
        const newMenuData = []
        data.forEach(item => {
          if (item[_this.parentColName] === _this.parentId) {
            newMenuData.push(_this.buildChildren(_this, item, data))
          }
        })
        var datas = newMenuData[0].children
        datas.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => a.sort - b.sort) // 升序
            if (item.children.children && item.children.children.length > 0) {
              item.children.children.sort((c, d) => c.sort - d.sort) // 升序
            }
          }
        })
        this.mokuaiList = datas
      } else {
        this.mokuaiList = []
      }
    },
    buildChildren(_this, parent, data) {
      const newChildren = []
      data.forEach(item => {
        if (parent.id === item[_this.parentColName]) {
          newChildren.push(_this.buildChildren(_this, item, data))
        }
      })
      if (newChildren.length > 0) {
        parent.children = newChildren
        parent.leaf = 1
      }
      return parent
    },
    questionTypeChange(val) {
      this.queryList(true, true)
    },
    queryList(flag, hand) { // 列表数据查询
      // console.log('menuItemNode', JSON.stringify(this.menuItemNode))
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        subjectCategoryId: this.menuItemNode.id // 试题模块的id
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('questions/list/' + this.filters.tx, para).then((response) => {
        this.listLoading = false
        this.tableData = response.data.list
        this.total = response.data.totalCount
        this.page = response.data.pageNum
        this.pageSize = response.data.pageSize
        if (this.tableData.length > 0) {
          this.tableData.forEach(element => {
            if (element.subjectName.indexOf('[]') > 0) { // 填空题的[] 展示的时候替换为下横线
              element.subjectName = element.subjectName.replace(/\[/g, '__').replace(/\]/g, '__')
            }
          })
        }
      }).catch(() => {
        this.listLoading = false
        this.tableData = []
      })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.queryList(false, true)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.queryList(true, true)
    },
    handleDetail(index, row) { // 详情
      // this.$router.push({ path: '/handlingGuide/testbaseManage/detail', query: { id: row.id, questionType: row.type }})
      this.dialogDetailVisible = true
      this.curQuestion = row // 当前选择的问题
    },
    handleEdit(index, row) { // 编辑，此处需要判断试题有没有在考试中（未过期、已过期两种）引用
      this.listLoading = true
      var messageText = ''
      this.$query('questions/checkinpaper?id=' + row.id, {}).then((response) => {
        if (response.data) {
          if (response.data.type === '1') { // 考试未过期
            messageText = '该试题已经被抽取到 “' + response.data.paperName + '” 试卷中，暂时不能编辑！'
            this.$confirm(messageText, '提示', {
              confirmButtonText: '知道了',
              cancelButtonText: '取消',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.listLoading = false
            }).catch(() => {
              this.listLoading = false
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          } if (response.data.type === '2') { // 考试过期
            messageText = '该试题在已结束的考试试卷中有使用，如果修改可能会影响到警员查看以往考试信息！是否继续修改？'
            this.$confirm(messageText, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              // showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.listLoading = false
              this.$router.push({ path: '/handlingGuide/testbaseManage/edit', query: { questinoId: row.id, questionType: row.type, questionCatrgory: row.subjectCategoryId }})
            }).catch(() => {
              this.listLoading = false
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        } else { // 未引用到考试
          this.listLoading = false
          this.$router.push({ path: '/handlingGuide/testbaseManage/edit', query: { questinoId: row.id, questionType: row.type, questionCatrgory: row.subjectCategoryId }})
        }
      }).catch(() => {
        this.listLoading = false
        this.$message({
          type: 'info',
          message: '请求失败'
        })
      })
    },
    handleDelete(index, row) { // 删除
      this.listLoading = true
      var messageText = ''
      this.$query('questions/checkinpaper?id=' + row.id, {}).then((response) => {
        if (response.data) {
          if (response.data.type === '1') { // 考试未过期
            messageText = '该试题已经被抽取到 “' + response.data.paperName + '” 试卷中，暂时不能删除！'
            this.$confirm(messageText, '提示', {
              confirmButtonText: '知道了',
              cancelButtonText: '取消',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.listLoading = false
            }).catch(() => {
              this.listLoading = false
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          } if (response.data.type === '2') { // 考试过期
            messageText = '该试题在已结束的考试试卷中有使用，如果删除可能会影响到警员查看以往考试信息！是否继续删除？'
            this.$confirm(messageText, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              // showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.removeQuestion(row)
            }).catch(() => {
              this.listLoading = false
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        } else { // 未引用到考试
          this.removeQuestion(row)
        }
      }).catch(() => {
        this.listLoading = false
        this.$message({
          type: 'info',
          message: '请求失败'
        })
      })
    },
    removeQuestion(row) {
      var para = {
        id: row.id,
        type: row.type
      }
      this.$query('questions/deletebyid', para).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          this.$message({
            message: '删除成功', type: 'success'
          })
          this.queryList(true, true)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    addTestQuestion() { // 添加试题
      this.$router.push({ path: '/handlingGuide/testbaseManage/edit', query: { questionCatrgory: this.menuItemNode.id }})
    },
    importTem() { // 试题导入
      this.dialogImportVisible = true
      this.importInfo.mokuai = this.menuItemNode.label // 左侧选中的部门
    },
    getFile() {
      if (event.target.files[0]) {
        this.fileCon = event.target.files[0]
      } else {
        this.fileCon = ''
      }
    },
    submitImportForm(formName) { // 导入弹框提交按钮
      if (this.fileCon === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.importLoading = true
          const formData = new FormData()
          formData.append('file', this.fileCon) // 文件
          formData.append('subjectCategoryId', this.importInfo.category[this.importInfo.category.length - 1]) // 选择的试题模块
          formData.append('deptCode', this.deptInfo.depCode) // 创建部门
          formData.append('deptName', this.deptInfo.depName) // 创建部门
          formData.append('creator', this.userInfo.userName) // 创建人
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'userId': this.userInfo.id,
              'userName': this.userInfo.userName
            }
          }
          axios.post(this.ModuleName + 'exam/examUploadFile', formData, config).then((response) => {
            this.importLoading = false
            if (response.data.message !== 'OK') { // 有异常
              const file = document.getElementById('excelFile')
              file.value = ''
              this.$message({
                message: response.data.message, type: 'error'
              })
              this.fileCon = ''
            } if (response.data.message === 'OK') {
              if (response.data.data && response.data.data.length > 0) { // 上传失败
                this.innerErrorInfoVisible = true
                var errorInfo = []
                for (let index = 0; index < response.data.data.length; index++) {
                  var element = response.data.data[index]
                  for (const key in element.errors) {
                    if (element.errors.hasOwnProperty(key)) {
                      var obj = {}
                      obj.type = element.type
                      obj.num = key
                      obj.des = element.errors[key].join(',')
                      errorInfo.push(obj)
                    }
                  }
                }
                this.errorData = errorInfo
              } else if (response.data.data === null) {
                this.$message({
                  message: '保存成功', type: 'success'
                })
                this.dialogImportVisible = false
                this.innerErrorInfoVisible = false
                this.queryList(true)
              }
            }
          }).catch((response) => {
            this.importLoading = false
            this.$message({
              message: '导入失败', type: 'error'
            })
          })
        }
      })
    },
    closeDia(type) {
      if (type === 'detail') { // 试题详情
        this.dialogDetailVisible = false
        // this.curQuestion = {}
      } else if (type === 'importInfo') {
        const file = document.getElementById('excelFile')
        if (file) {
          file.value = ''
        }
        this.resetForm('importInfo')
        this.fileCon = ''
        this.dialogImportVisible = false
      }
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 200
    this.queryList(true, true)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.testTableList {
  height: 100%;
  .addTestQuestion {
    float: right;
    margin-bottom: 10px;
  }
  .toolbar {
    margin: 10px 0 8px;
  }
  .el-table p {
    margin: 0;
  }
  .questionCon {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // .fileItem .el-form-item__content {
  //   position: relative;
  // }
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .fileinput-button input {
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    font-size: 200px;
  }
  // #excelFile {
  //   background: blue;
  // }
}
</style>
