<template>
  <section class="setScore">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="left">
          <span class="font_b">考试成绩：</span>
          <span>用时45分32秒，自动阅卷得分</span><span class="scoreNumber"> 78 </span>分
        </div>
        <el-button class="right" size="medium" type="primary" plain icon="el-icon-check">完成阅卷</el-button>
      </div>
      <div>
        <div class="question_wrap">
          <p class="font_b">三、简答题（每题10分，共20分）</p>
          <div class="small_question_wrap clearfix">
            <div class="left">
              <p>1、简单题的说法大幅度随风倒十分</p>
              <p>
                <span class="font_b">您的答案：</span>就感觉如果
              </p>
              <p>
                <span class="font_b">解析：</span>咬定青山不放松，立根原在破岩中。千磨万击还坚劲，任尔东西南北风”这首诗是郑燮，是咏松树的
              </p>
            </div>
            <div class="right" style="">
              <p class="score_text">得分</p>
              <el-input type="text" size="small" v-model="score" class="scoreInput"></el-input>
            </div>
          </div>
        </div>
      </div>
    </el-card>
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
      score: '',
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
.setScore {
  .scoreNumber {
    font-size: 20px;
    color: #f72929;
  }
  .question_wrap p {
    margin-bottom: 15px;
  }
  .small_question_wrap {
    margin-left: 30px;
    .left {
      width: 80%;
    }
    .right {
      width: 100px;
      text-align: center;
      border: 1px solid #dedede;
      .score_text {
        line-height: 32px;
        border-bottom: 1px solid #bebebe;
        margin-bottom: 0px;
      }
    }
  }
  .font_b {
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
  }
}
.scoreInput .el-input__inner {
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
  outline: none;
  background-color: none;
  padding: 5px 0;
}
</style>
