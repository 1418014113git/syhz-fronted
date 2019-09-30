<template>
  <section class="scoreRanking">
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png" class="goBack" @click="back">
    </el-row>
    <div class="exam_title_wrap clearfix">
      <p class="exam_title">{{carryParam.examinationName}}</p>
      <p class="right">发布时间：{{carryParam.startTime}}</p>
    </div>
    <div class="clearfix" style="margin:15px 0 10px;">
      <p class="left">您在本次考试中的排名：<span class="red_text"> {{rankNum}} </span></p>
      <el-button class="right" style="margin-left: 20px;" size="mini" circle icon="el-icon-download" title="点击下载所有排名名单；说明：页面只展示前20排名，要想查看更多排名，请点击下载！"></el-button>
      <el-button class="right" size="mini" circle icon="el-icon-question" title="排名规则：成绩相同的，按考试时长排名；成绩和时长相同的，按参加考试次数及试卷提交时间排名！"></el-button>
    </div>
    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;" :max-height="tableHeight">
      <el-table-column type="index" label="排名" width="100" align="center"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="240" show-overflow-tooltip class-name="tabC"></el-table-column>
      <el-table-column prop="deptName" label="工作单位" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="totalScore" label="考试成绩" width="200" align="center"></el-table-column>
      <el-table-column prop="dateStr" label="考试时长" width="240" align="center"></el-table-column>
    </el-table>
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
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化
  },
  methods: {
    examStatusChange(val) {

    },
    queryList(flag) { // 列表数据查询
      this.listLoading = true
      this.page = flag ? 1 : this.page
      const para = {
        examId: this.carryParam.examinationId
      }
      this.$query('examination/scorelist', para).then((response) => {
        this.listLoading = false
        if (response.data && response.data.length > 0) {
          this.tableData = response.data
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

<style rel="stylesheet/scss" lang="scss" scoped>
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
}
</style>
