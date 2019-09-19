<template>
  <section class="testTableList">
    <div class="addTestQuestion">
      <el-button type="primary" size="small" @click="addTestQuestion" icon="el-icon-plus">添加考试</el-button>
    </div>
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="考试状态" prop="AJMC">
        <el-select v-model="filters.tx" placeholder="请选择题型" @change="examStatusChange">
          <el-option v-for="item in ksztData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试名称" prop="AJMC">
        <el-input type="text" size="small" v-model="filters.options1" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryList(true,true)">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70" class-name="tabC"></el-table-column>
      <el-table-column prop="name" label="考试"></el-table-column>
      <el-table-column prop="date" label="考试截至时间" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="date" label="考试时限" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="date" label="允许次数" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="type" label="试卷类型" width="200" class-name="tabC">
        <template slot-scope="scope">
          <!-- <el-tag type="success"> -->
            {{$getLabelByValue(scope.row.type, txData)}}
          <!-- </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" circle @click="handleDetail(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑"></el-button>
          <el-button size="mini" circle @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除"></el-button>
          <el-button size="mini" circle type="danger"  @click="handleDelete(scope.$index, scope.row)" title="发布">
            <svg-icon icon-class="release"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                     :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'
import importexport from '@/api/importexport'
import axios from 'axios'
export default {
  props: ['menuItemNode'],
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      tableData: [
        { name: '11', date: '2019-01-01 21:01', type: '2' }
      ], // 列表数据
      ksztData: [
        { label: '未过期', value: '1' },
        { label: '已过期', value: '2' }
      ],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      filters: {},
      txData: questionTypeAll('all')

    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    examStatusChange(val) {

    },
    queryList(flag) { // 列表数据查询
      console.log('menuItemNode', JSON.stringify(this.menuItemNode))
      // this.listLoading = true
      // this.page = flag ? 1 : this.page
      // const para = {
      //   pageNum: this.page,
      //   pageSize: this.pageSize,
      //   logFlag: 1, // 添加埋点参数
      //   id: this.menuItemNode.id
      // }
      // this.$query('', para).then((response) => {
      //   this.listLoading = false
      //   if (response.data && response.data.length > 0) {
      //     this.list = response.data.list
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      this.queryList(false)
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      this.queryList(true)
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
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // this.$router.push({ path: '/handlingGuide/testbaseManage/edit' })
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
      this.$router.push({ path: '/handlingGuide/examineManage/add' })
    },
    importTem() {
      this.dialogImportVisible = true
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
          formData.append('createDept', this.dept.depName) // 创建部门
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
                this.query(true)
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
    closeDia() {
      const file = document.getElementById('excelFile')
      if (file) {
        file.value = ''
      }
      this.dialogImportVisible = false
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 180
    // this.query(true)
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
