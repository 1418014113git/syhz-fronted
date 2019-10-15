<template>
  <section class="testTableList">
    <el-form :inline="true" :model="filters" ref="filters" label-width="84px" style="text-align: left;">
      <el-form-item label="" prop="examType" label-width="0">
        <el-select v-model="filters.examType" placeholder="请选择" @change="examTypeChange">
          <el-option v-for="item in ksData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试名称" prop="examinationName">
        <el-input type="text" size="small" v-model.trim="filters.examinationName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryInit(true,true)">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" class="table_th_center">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="examinationName" label="考试" show-overflow-tooltip class="tabC">
        <template slot-scope="scope">
          <span v-if="currentExamType==='1'" class="canClick" @click="handleExamRecord(scope.row)">{{scope.row.examinationName}}</span>
          <span v-else>{{scope.row.examinationName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="考试时间" width="200" align="center" v-if="currentExamType==='1'" :key=Math.random()></el-table-column>
      <el-table-column prop="startTime" label="考试时长" width="200" align="center" v-if="currentExamType==='1'" :key=Math.random()></el-table-column>
      <el-table-column prop="questionsCount" label="题目" width="100" align="center" v-if="currentExamType==='1'" :key=Math.random()></el-table-column>
      <el-table-column prop="score" label="成绩" width="100" align="center" v-if="currentExamType==='1'" :key=Math.random()></el-table-column>
      <el-table-column prop="examinationCount" label="考试次数" width="100" align="center" v-if="currentExamType==='1'" :key=Math.random()></el-table-column>
      <el-table-column prop="status" label="排名" width="100" align="center" v-if="currentExamType==='1'" :key=Math.random()>
        <template slot-scope="scope">
          <el-button size="mini" circle v-if="scope.row.status" :disabled="!scope.row.status" @click="handleRanking(scope.$index, scope.row)" icon="el-icon-tickets" title="排名"></el-button>
          <span v-else>暂未发布</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="开始考试" width="100" align="center" v-if="currentExamType==='1'" :key=Math.random()>
        <!-- 先判断成绩是否发布（已发布的不能开始考试），然后判断是否还有考试的次数 -->
        <template slot-scope="scope">
          <span v-if="scope.row.status">否</span>
          <el-button size="mini" circle v-else-if="scope.row.examinationCount < scope.row.permitNumber" @click="handleStartExam(scope.$index, scope.row)" icon="el-icon-caret-right" title="开始考试"></el-button>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="考试时间" width="400" align="center" v-if="currentExamType==='2'" :key=Math.random()>
        <template slot-scope="scope">
          {{scope.row.startDate}} ~ {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column prop="timeCount" label="考试时限" width="140" align="center" v-if="currentExamType==='2'" :key=Math.random()></el-table-column>
      <el-table-column prop="questionsCount" label="题目" width="100" align="center" v-if="currentExamType==='2'" :key=Math.random()></el-table-column>
      <el-table-column prop="type" label="试卷类型" width="140" align="center" v-if="currentExamType==='2'" :key=Math.random()>
        <template slot-scope="scope">
          {{$getLabelByValue(scope.row.type+'', paperType)}}
        </template>
      </el-table-column>
      <el-table-column prop="permitNumber" label="允许次数" width="140" align="center" v-if="currentExamType==='2'" :key=Math.random()></el-table-column>
      <el-table-column prop="permitNumber" label="开始考试" width="140" align="center" v-if="currentExamType==='2'" :key=Math.random()>
        <template slot-scope="scope">
          <el-button size="mini" circle :disabled="scope.row.status !== 1" @click="handleStartExam(scope.$index, scope.row)" icon="el-icon-caret-right" title="开始考试"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar clearfix">
      <el-pagination v-if="total > 0" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize"
                    :current-page="page" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 考试记录弹框 -->
    <el-dialog width="50%" title="考试记录" :visible.sync="examRecordVisible">
      <el-table :data="examRecordData">
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <!-- <el-table-column prop="examSequence" label="名称" width="160"></el-table-column> -->
        <el-table-column prop="startTime" label="考试时间" width="180" align="center"></el-table-column>
        <el-table-column prop="totalTime" label="考试时长" width="160" align="center"></el-table-column>
        <el-table-column prop="score" label="非主观题成绩" width="120" align="center"></el-table-column>
        <el-table-column prop="artificialScore" label="主观题成绩" width="160" align="center"></el-table-column>
        <el-table-column prop="des" label="操作">
           <template slot-scope="scope">
            <el-button size="mini" circle @click="handlePaperExamed(scope.$index, scope.row)" icon="el-icon-document" title="详情"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
import { examStatus, examPaperType } from '@/utils/codetotext'
import importexport from '@/api/importexport'
export default {
  data() {
    return {
      activeName: 'first',
      downLoadUrl: importexport.downloadFileUrl, // nginx配置的文件下载
      tableData: [], // 列表数据
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      tableHeight: null,
      filters: {
        examType: '1' // 默认 已参加的考试
      },
      currentExamType: '1',
      ksData: [
        { label: '已参加的考试', value: '1' },
        { label: '最新的考试', value: '2' }
      ],
      ksztData: examStatus(), // 考试状态
      paperType: examPaperType(), // 试卷类型
      examRecordVisible: false, // 考试记录弹框
      examRecordData: [], // 考试记录数据
      curExam: {}, // 当前考试的信息
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    examTypeChange(val) {
      if (val) {
        this.currentExamType = val
        if (val === '1') {
          this.queryList(true, true)
        } else if (val === '2') {
          this.queryListNewExam(true, true)
        }
      }
    },
    handleRanking(index, row) { // 排名
      // 参数 考试id 考试名称 发布时间
      this.$router.push({ path: '/handlingGuide/examTrainingManage/scoreRanking', query: { examinationId: row.examinationId, examinationName: row.examinationName, startTime: row.modifyDate }})
    },
    handleStartExam(index, row) { // 开始考试
      this.$router.push({ path: '/handlingGuide/examTrainingManage/trainingOnline', query: { examinationId: row.examinationId, questionsCount: row.questionsCount }})
    },
    queryInit() {
      if (this.currentExamType === '1') {
        this.queryList(true)
      } else if (this.currentExamType === '2') {
        this.queryListNewExam(true, true)
      }
    },
    queryList(flag, hand) { // 列表数据查询 已经考过的
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        logFlag: 1, // 添加埋点参数
        deptId: this.deptInfo.id,
        userId: this.userInfo.id,
        // deptId: 1033,
        // userId: 1050,
        examinationName: this.filters.examinationName || '' // 考试名称
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$update('examination/examinationList', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryListNewExam(flag, hand) { // 列表数据查询 已经考过的
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        pageNum: this.page,
        pageSize: this.pageSize,
        // logFlag: 1, // 添加埋点参数
        deptId: this.deptInfo.id,
        userId: this.userInfo.id,
        examinationName: this.filters.examinationName || '' // 考试名称
      }
      if (hand) { // 手动点击时，添加埋点参数
        para.logFlag = 1
      }
      this.$query('page/examinationlistbynostart', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.list.length > 0) {
          this.tableData = response.data.list
          this.total = response.data.totalCount
          this.page = response.data.pageNum
          this.pageSize = response.data.pageSize
        } else {
          this.tableData = []
          this.total = 0
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCurrentChange(val) { // 分页查询
      this.page = val
      if (this.currentExamType === '1') {
        this.queryList(false, true)
      } else if (this.currentExamType === '2') {
        this.queryListNewExam(false, true)
      }
    },
    handleSizeChange(val) { // 分条查询
      this.pageSize = val
      if (this.currentExamType === '1') {
        this.queryList(true, true)
      } else if (this.currentExamType === '2') {
        this.queryListNewExam(true, true)
      }
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/handlingGuide/examineManage/detail', query: { examId: row.id }})
    },
    handleExamRecord(row) { // 考试记录
      this.curExam = row // 当前考试的信息
      var para = {
        userId: this.userInfo.id,
        examId: row.examinationId
      }
      this.listLoading = true
      var staticSequence = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      this.$query('exam/examRecord', para).then((response) => {
        this.listLoading = false
        this.examRecordVisible = true
        if (response.code === '000000') {
          for (let k = 0; k < response.data.length; k++) {
            var element = response.data[k]
            element.examSequence = '第' + staticSequence[k] + '次考试'
          }
          this.examRecordData = response.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handlePaperExamed(index, row) { // 考试记录详情
      // 传参 考试id 记录id
      this.examRecordVisible = false
      this.$router.push({ path: '/handlingGuide/examTrainingManage/paperExamed', query: { examinationId: row.examinationId, recordId: row.id, examedTimes: this.curExam.examinationCount }})
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
    this.queryInit()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.testTableList {
  height: 100%;
  .canClick {
    cursor: pointer;
  }
  .canClick:hover {
    text-decoration: underline;
  }
}
</style>
