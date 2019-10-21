<template>
  <section class="deptTableList">
    <el-form :inline="true" :model="filters" ref="filters" label-width="98px" style="text-align: left;">
      <el-form-item label="地市" prop="examStatus">
        {{selectCurDep.name && Number(selectCurDep.name.length)>11}}
        <el-tooltip effect="dark" :content="selectCurDep.name" placement="top-start" :popper-class="(selectCurDep.name&&selectCurDep.name.length>11)===true?'tooltipShow':'tooltipHide'">
          <el-cascader
            :options="deptOptions"
            v-model="filters.deptCode"
            :props="deptProps"
            :show-all-levels=false
            change-on-select
            @change="handleDeptChange"
            clearable placeholder="全部">
          </el-cascader>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList(true)">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button type="info" @click="reset">导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="examinationName" label="机构全称" min-width="160" show-overflow-tooltip>
         <template slot-scope="scope">
            <span class="canClick" @click="handleDepartDetail(scope.row)">{{scope.row.examinationName}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="totalDate" label="机构级别" width="100" align="center"></el-table-column>
      <el-table-column prop="permitNumber" label="实有人数" width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="type" label="试卷类型" width="140" align="center">
        <template slot-scope="scope">
          {{$getLabelByValue(scope.row.type+'', paperType)}}
        </template>
      </el-table-column> -->
      <el-table-column prop="examStatus" label="所属行政区划" width="140" align="center"></el-table-column>
      <el-table-column prop="examStatus" label="主要负责人" width="140" align="center"></el-table-column>
      <el-table-column prop="examStatus" label="分管局领导" width="140" align="center"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" circle @click="handleDetail(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          <el-button size="mini" circle @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑"></el-button>
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
      deptOptions: [], // 部门数据
      deptProps: {
        value: 'depCode',
        label: 'name',
        children: 'children'
      },
      selectCurDep: { name: '' }, // 当前选中的部门
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    handleDeptChange(val) { // 发布单位
      // console.log(val)
      if (val.length > 0) {
        var deptArr = JSON.parse(sessionStorage.getItem('DeptSelect'))
        for (let i = 0; i < deptArr.length; i++) {
          const dept = deptArr[i]
          if (dept.depCode === val[val.length - 1]) {
            this.selectCurDep = dept
            break
          }
        }
      } else {
        this.selectCurDep = { name: '' }
      }
    },
    examStatusChange(val) {

    },
    queryList(flag, hand) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        deptCode: this.deptInfo.depCode,
        examinationName: this.filters.examinationName || '', // 考试名称
        examStatus: this.filters.examStatus || '' // 考试状态
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      // page/examination
      this.$query('examination/findAllExamination', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
          for (let index = 0; index < response.data.list.length; index++) {
            var element = response.data.list[index]
            if (element.markPeople) {
              var markArr = element.markPeople.split(',')
              if (markArr.indexOf(this.userInfo.id + '') > -1) {
                element.isGoOver = 1 // 是否可以阅卷
              } else {
                element.isGoOver = 0
              }
            }
          }
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
    handleDepartDetail(index, row) { // 跳转详情
      this.$router.push({ path: '/basicService/deptInfo/detail', query: { examId: row.id }})
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/basicService/deptInfo/detail', query: { examId: row.id }})
    },
    handleEdit(index, row) { // 编辑
      this.$router.push({ path: '/basicService/deptInfo/edit', query: { examId: row.id }})
      // 检查是否可编辑
      // var para = {
      //   id: row.id
      // }
      // this.$query('examination/checkexamination', para).then((response) => {
      //   this.listLoading = false
      //   if (response.code === '000000') {
      //     this.$router.push({ path: '/handlingGuide/examineManage/edit', query: { examId: row.id }})
      //   }
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    getTree(treeArray) {
      const r = []
      const tmpMap = {}
      for (let i = 0, l = treeArray.length; i < l; i++) {
        tmpMap[treeArray[i]['depCode']] = treeArray[i]
      }
      for (let i = 0, l = treeArray.length; i < l; i++) {
        const key = tmpMap[treeArray[i]['parentCode']]
        if (key && key.depType !== '4') { // 去掉派出所的层级
          if (!key['children']) {
            if (treeArray[i].depType !== '4') {
              key['children'] = []
              key['children'].push(treeArray[i])
            }
          } else {
            if (treeArray[i].depType !== '4') {
              key['children'].push(treeArray[i])
            }
          }
        } else {
          if (treeArray[i].depType !== '4') {
            r.push(treeArray[i])
          }
        }
      }
      return r
    },
    reset() { // 重置
      this.filters = {

      }
      // this.dateRange = []
      // this.yearDate = '' // 年份
      // this.quarterDate = '' // 季度
      // this.monthDate = '' // 月份
      // this.startTime = '' // 开始时间
      // this.endTime = '' // 结束时间
      this.queryList(true)
    },
    handleGoOverExam(index, row) { // 阅卷
      // this.$router.push({ path: '/handlingGuide/goOverExamPaper/index', query: { examId: row.id }})
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
    var dept = this.getTree(JSON.parse(sessionStorage.getItem('DeptSelect')))
    this.deptOptions = dept
    this.tableHeight = document.documentElement.clientHeight - 180
    this.queryList(true)
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.deptTableList {
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    // color: rgba(0, 160, 233, 0.6);
    text-decoration: underline;
  }
}
.tooltipShow {
  opacity: 1;
}
.tooltipHide {
  opacity: 0;
}
</style>
