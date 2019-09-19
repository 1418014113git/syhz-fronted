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
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70" class-name="tabC"></el-table-column>
      <el-table-column prop="subjectName" label="题目内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="modifyDate" label="更新时间" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="type" label="类型" width="200" class-name="tabC">
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
          <el-button size="mini" circle type="danger" v-if="scope.row.deleteable=='1'" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除"></el-button>
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
    <el-dialog title="试题详情" :visible.sync="dialogDetailVisible" size="small" @close="closeDia('detail')" class="comDialog">
      <question-detail :questionItem="curQuestion"></question-detail>
    </el-dialog>
    <!-- 导入弹框 -->
    <el-dialog title="试题导入" :visible.sync="dialogImportVisible" size="small" @close="closeDia('importInfo')" class="comDialog">
      <el-form ref="importInfo" size="small" :model="importInfo" label-width="100px" v-loading="importLoading">
        <el-form-item label="模块" prop="tx">
          <!-- <el-select v-model="importInfo.mokuai" placeholder="请选择二级模块">
            <el-option v-for="item in txData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input type="text" size="small" v-model="importInfo.mokuai" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="试题文件">
          <input type="file" @change="getFile" clearable name="file" id="excelFile"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDia('importInfo')" :loading="importLoading">取消</el-button>
          <el-button type="primary" @click="submitImportForm('importInfo')" :loading="importLoading">导入</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-dialog width="50%" title="提示信息" :visible.sync="innerErrorInfoVisible" append-to-body>
        <el-table :data="errorData">
          <el-table-column prop="number" label="行数" width="100"></el-table-column>
          <el-table-column prop="des" label="错误信息"></el-table-column>
        </el-table>
      </el-dialog> -->
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
  props: ['menuItemNode'],
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
        tx: '0'
      },
      txData: questionTypeAll('all'),
      dialogImportVisible: false, // 导入弹框
      importLoading: false, // 导入弹框loading
      importInfo: {}, // 导入弹框
      fileCon: '', // 导入试题内容
      dialogDetailVisible: false,
      curQuestion: {},
      userInfo: {}, // 当前用户信息
      deptInfo: {} // 当前部门信息

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
    }
  },
  methods: {
    questionTypeChange(val) {
      this.queryList(true, true)
    },
    queryList(flag, hand) { // 列表数据查询
      console.log('menuItemNode', JSON.stringify(this.menuItemNode))
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        // subjectCategoryId: this.menuItemNode.id
        subjectCategoryId: 1
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('questions/list/' + this.filters.tx, para).then((response) => {
        this.listLoading = false
        this.tableData = response.data
        if (this.tableData.length > 0) {
          this.tableData.forEach(element => {
            if (element.subjectName.indexOf('[]') > 0) {
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
      this.curQuestion = row
    },
    handleEdit(index, row) { // 编辑
      var message1 = '该试题已经被抽取到XXXX（试卷名称）试卷中，暂时不能编辑或删除！'
      // var message2 = '该试题在已结束的考试试卷中有使用，如果修改可能会影响到警员查看以往考试信息！是否继续修改？'
      var messageText = message1
      this.$confirm(messageText, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        // showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/handlingGuide/testbaseManage/edit', query: { type: '3' }})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleDelete(index, row) { // 删除
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
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
          formData.append('createDept', this.deptInfo.depName) // 创建部门
          formData.append('createName', this.userInfo.realName) // 创建人
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'userId': this.userInfo.id,
              'userName': this.userInfo.userName
            }
          }
          axios.post(this.ModuleName + 'pitchman/upload', formData, config).then((response) => {
            this.importLoading = false
            if (response.data.message !== 'OK') { // 有异常
              const file = document.getElementById('excelFile')
              file.value = ''
              this.$message({
                message: response.data.message, type: 'error'
              })
              this.fileCon = ''
            } if (response.data.message === 'OK') {
              if (response.data.data.type === 'success') { // 上传成功
                this.$message({
                  message: '保存成功', type: 'success'
                })
                this.dialogImportVisible = false
                this.innerErrorInfoVisible = false
                this.queryList(true)
              } else if (response.data.data.type !== 'success') {
                this.innerErrorInfoVisible = true
                var errorInfo = []
                for (let index = 0; index < response.data.data.list.length; index++) {
                  const element = JSON.parse(response.data.data.list[index])
                  errorInfo[index] = { number: element[0], des: element[1] }
                }
                this.errorData = errorInfo
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
        this.dialogImportVisible = false
      }
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - document.querySelector('.el-form').offsetHeight - 180
    // this.$refs.filters.offsetHeight
    console.log(this.tableHeight)
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.deptInfo = JSON.parse(sessionStorage.getItem('depToken'))[0]
    this.queryList(true, true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testTableList {
  height: 100%;
  .addTestQuestion {
    float: right;
    margin-bottom: 10px;
  }
}
</style>
