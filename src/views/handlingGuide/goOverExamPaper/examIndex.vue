<template>
  <section class="testTableList">
    <!--阅卷列表 以考试为单位-->
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="考试名称" prop="examinationName">
        <el-input type="text" size="small" v-model.trim="filters.examinationName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="考试状态" prop="examStatus">
        <el-select v-model="filters.examStatus" placeholder="请选择" clearable @change="examStatusChange">
          <el-option v-for="item in ksztData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryList(true,true)">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="examinationName" label="考试" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="date" label="考试时间" width="400" align="center">
        <template slot-scope="scope">
          {{scope.row.startDate}} ~ {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column prop="totalDate" label="考试时限" width="100" align="center"></el-table-column>
      <el-table-column prop="permitNumber" label="允许次数" width="100" align="center"></el-table-column>
      <el-table-column prop="type" label="试卷类型" width="140" align="center">
        <template slot-scope="scope">
          {{$getLabelByValue(scope.row.type+'', paperType)}}
        </template>
      </el-table-column>
      <el-table-column prop="examStatus" label="状态" width="140" align="center">
        <template slot-scope="scope">
          {{$getLabelByValue(scope.row.examStatus+'', ksztData)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button size="mini" circle @click="handleDetail(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑" :disabled="scope.row.status"></el-button>
          <el-button size="mini" circle @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除" :disabled="scope.row.status"></el-button>
          <el-button size="mini" circle @click="handlePublishScore(scope.$index, scope.row)" title="发布成绩" v-if="!scope.row.status">
            <svg-icon icon-class="release"></svg-icon>
          </el-button> -->
          <!-- scope.row.isGoOver===1 ||  -->
          <!-- status 是否发布成绩 true 已经发布了 -->
          <el-button size="mini" circle @click="handleGoOverExam(scope.$index, scope.row)" icon="el-icon-view" title="阅卷" v-if="scope.row.examStatus !== 3" :disabled="scope.row.status"></el-button>
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
import { examStatus, examPaperType } from '@/utils/codetotext'
import importexport from '@/api/importexport'
export default {
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      tableData: [], // 列表数据
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      filters: {},
      ksztData: examStatus(), // 考试状态
      paperType: examPaperType(), // 试卷类型
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    examStatusChange(val) {

    },
    queryList(flag, hand) { // 列表数据查询，根据阅卷老师查可阅卷的考试列表
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        deptCode: this.deptInfo.depCode,
        userId: this.userInfo.id, // 当前登录
        examinationName: this.filters.examinationName || '', // 考试名称
        examStatus: this.filters.examStatus || '' // 考试状态
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('examination/findAllExaminationMark', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          // for (let index = 0; index < response.data.list.length; index++) {
          //   var element = response.data.list[index]
          //   if (element.markPeople) {
          //     var markArr = element.markPeople.split(',')
          //     if (markArr.indexOf(this.userInfo.id + '') > -1) {
          //       element.isGoOver = 1 // 是否可以阅卷
          //     } else {
          //       element.isGoOver = 0
          //     }
          //   }
          // }
          this.tableData = response.data.list
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.listLoading = false
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
      this.$router.push({ path: '/handlingGuide/examineManage/detail', query: { examId: row.id }})
    },
    handleEdit(index, row) { // 编辑
      // 检查是否可编辑
      var para = {
        id: row.id
      }
      this.$query('examination/checkexamination', para).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          this.$router.push({ path: '/handlingGuide/examineManage/edit', query: { examId: row.id }})
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDelete(index, row) { // 删除
      this.listLoading = true
      // 检查是否可删除
      var para = {
        id: row.id
      }
      this.$query('examination/checkexamination', para).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          this.deleteExam(row)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    deleteExam(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        var para = {
          id: row.id,
          delFlag: 1
        }
        this.$remove('examination/delete', para).then((response) => {
          this.listLoading = false
          if (response.code === '000000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryList(true) // 刷新列表
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${action}`
                })
              }
            })
          }
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handlePublishScore(index, row) { // 发布成绩
      var param = {
        id: row.id,
        status: 1 // 发布成绩标志字段
      }
      this.$update('examination/update', param).then((response) => {
        if (response.code === '000000') {
          this.formLoading = true
          this.loading = false
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
          this.queryList(true) // 刷新列表
        }
      }).catch(() => {
        this.formLoading = false
      })
    },
    handleGoOverExam(index, row) { // 阅卷
      this.$router.push({ path: '/handlingGuide/goOverExamPaper/index', query: { examId: row.id }})
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
    this.queryList(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.testTableList {
  height: 100%;
}
</style>
