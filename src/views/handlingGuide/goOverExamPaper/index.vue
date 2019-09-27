<template>
  <section class="testTableList">
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="单位" prop="AJMC">
        <el-input type="text" size="small" v-model="filters.options1" clearable placeholder="请输入关键字检索单位"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="AJMC">
        <el-input type="text" size="small" v-model="filters.options1" clearable placeholder="请输入关键字检索姓名"></el-input>
      </el-form-item>
      <el-form-item label="阅卷状态" prop="AJMC">
        <el-select v-model="filters.tx" placeholder="请选择题型" @change="examStatusChange">
          <el-option v-for="item in ksztData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryList(true,true)">检索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="序号" width="70" class-name="tabC"></el-table-column>
      <el-table-column prop="name" label="单位名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="date" label="考试时间" width="400" class-name="tabC"></el-table-column>
      <el-table-column prop="date" label="自动阅卷得分" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="date" label="人工阅卷得分" width="200" class-name="tabC"></el-table-column>
      <el-table-column prop="type" label="阅卷状态" width="200" class-name="tabC">
        <template slot-scope="scope">
          <!-- <el-tag type="success"> -->
            {{$getLabelByValue(scope.row.type, txData)}}
          <!-- </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" circle @click="goOverScore(scope.$index, scope.row)" icon="el-icon-view" title="阅卷"></el-button>
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
import { goOverPaperStatus } from '@/utils/codetotext'
import importexport from '@/api/importexport'
export default {
  props: ['menuItemNode'],
  data() {
    return {
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      tableData: [
        { name: '11', date: '2019-01-01 21:01 ~ 2019-01-01 21:01', type: '2' }
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
      txData: goOverPaperStatus() // 阅卷状态

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
    goOverScore() { // 去阅卷
      this.$router.push({ path: '/handlingGuide/goOverExamPaper/settingScore' })
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
