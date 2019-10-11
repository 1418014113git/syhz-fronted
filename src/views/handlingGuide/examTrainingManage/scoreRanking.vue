<template>
  <section class="scoreRanking">
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png" class="goBack" @click="back">
    </el-row>
    <div class="exam_title_wrap clearfix">
      <p class="exam_title">{{carryParam.examinationName}}_成绩排名</p>
      <p class="right">发布时间：{{carryParam.startTime}}</p>
    </div>
    <div class="clearfix" style="margin:15px 0 10px;">
      <p class="left">您在本次考试中的排名：<span class="red_text"> {{rankNum}} </span></p>
      <el-button class="right" style="margin-left: 20px;" size="mini" circle icon="el-icon-download" @click="goDownload" title="点击下载所有排名名单；说明：页面只展示前20排名，要想查看更多排名，请点击下载！"></el-button>
      <el-button class="right" size="mini" circle icon="el-icon-question" title="排名规则：成绩相同的，按考试时长排名；成绩和时长相同的，按参加考试次数及试卷提交时间排名！"></el-button>
    </div>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight" :row-class-name="getRowClass" class="table_th_center">
      <el-table-column type="index" label="排名" width="100" align="center" class-name="paiming"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="240" show-overflow-tooltip class-name="tabC"></el-table-column>
      <el-table-column prop="deptName" label="工作单位" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="totalScore" label="考试成绩" width="200" align="center"></el-table-column>
      <el-table-column prop="dateStr" label="考试时长" width="240" align="center"></el-table-column>
    </el-table>
    <!-- 所有成绩排名 -->
    <el-dialog title="成绩排名" :visible.sync="dialogAllScoreVisible" size="small" width="60%" class="allScore">
      <el-button type="primary" @click="toGetPdf" style="float:right;">下载</el-button>
      <div id="pdfDom" style="padding: 30px 0;">
        <div class="exam_title_wrap clearfix">
          <p class="exam_title">{{carryParam.examinationName}}_成绩排名</p>
          <p class="right">发布时间：{{carryParam.startTime}}</p>
        </div>
        <el-table :data="allScore" v-loading="listLoading" style="width: 100%;" border :max-height="tableHeight" :row-class-name="getRowClass" class="table_th_center">
          <el-table-column type="index" label="排名" width="100" align="center" class-name="paiming"></el-table-column>
          <el-table-column prop="realName" label="姓名" width="140" show-overflow-tooltip class-name="tabC"></el-table-column>
          <el-table-column prop="deptName" label="工作单位" show-overflow-tooltip ></el-table-column>
          <el-table-column prop="totalScore" label="考试成绩" width="140" align="center"></el-table-column>
          <el-table-column prop="dateStr" label="考试时长" width="240" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
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
      carryParam: {},
      rankNum: '',
      dialogAllScoreVisible: false, // 下载 所有成绩弹框
      allScore: [], // 所有排名
      htmlTitle: '', // 下载文件的名称
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    examStatusChange(val) {

    },
    getRowClass({ row, rowIndex }) {
      // console.log(rowIndex)
      if (rowIndex < 3) {
        return 'row-paiming-red'
      } else {
        return 'row-paiming'
      }
    },
    queryList(flag) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        id: this.carryParam.examinationId
      }
      this.$query('examination/allscorelistnopage', para).then((response) => {
        this.listLoading = false
        if (response.code === '000000') {
          this.allScore = response.data // 存储所有成绩
          if (response.data.length > 20) {
            this.tableData = response.data.slice(0, 20) // 取前20名成绩
          } else {
            this.tableData = response.data
          }
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryRank() { // 排名
      this.listLoading = true
      const para = {
        examId: this.carryParam.examinationId,
        userId: this.userInfo.id
      }
      this.$query('examtopbyuserid', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.rankNum = response.data[0].rownum
        } else {
          this.rankNum = ''
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    goDownload() { // 下载按钮
      this.dialogAllScoreVisible = true
    },
    toGetPdf() { // 弹框的下载成绩按钮
      window.scrollTo(0, 0)
      this.htmlTitle = this.carryParam.examinationName + '考试成绩'
      this.getPdf(this.htmlTitle)
    },
    handleDetail(index, row) { // 详情
      this.$router.push({ path: '/handlingGuide/examineManage/detail', query: { examId: row.id }})
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 180
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    this.queryList(true)
    this.queryRank()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.scoreRanking {
  width: 90%;
  margin: 0 auto;
  .red_text {
    color: #f72929;
    font-size: 20px;
  }
  .exam_title_wrap {
    margin-bottom: 14px;
    text-align: center;
    border-bottom: 1px solid #bebebe;
    .exam_title {
      // color: #000000;
      font-size: 22px;
      font-weight: bold;
      line-height: 30px;
    }
  }
  .el-table .row-paiming-red .paiming .cell div {
    color: #f72929;
    font-weight: bold;
  }
  .el-table .row-paiming .paiming .cell div {
    color: #000000;
    font-weight: bold;
  }
  // 成绩下载的弹框
  .allScore {
    .el-dialog {
      background: #ffffff;
      border: 1px solid #bebebe;
    }
    .el-dialog__header {
      border-bottom: 2px solid #aaaaaa;
      .el-dialog__title {
        color: #000000;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #000000;
      }
    }
    .el-dialog__body {
      background: #ffffff;
      color: #000000;
    }
    .el-table {
      background: #ffffff;
      color: #000000;
      thead {
        background: #ffffff;
        color: #000000;
      }
      .el-table__body-wrapper tr:nth-child(2n) {
        background-color: transparent;
      }
    }
    .el-table td,
    .el-table th.is-leaf,
    .el-table th > .cell,
    .el-table__empty-text {
      color: #000000;
    }
  }
}
</style>
