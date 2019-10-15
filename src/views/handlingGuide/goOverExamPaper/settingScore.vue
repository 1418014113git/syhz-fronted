<template>
  <section class="setScore">
  <el-row class="">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
    <el-card class="box-card" v-loading="listLoading">
      <div slot="header" class="clearfix">
        <div class="left">
          <span class="font_b">考试成绩：</span>
          <span>用时{{totalTime}}，</span><span>自动阅卷得分</span><span class="scoreNumber"> {{zdCore}} </span>分
          <span v-if="yjStatus==='end'">
            <span>，人工阅卷得分</span><span class="scoreNumber"> {{artScore}} </span>分
          </span>
        </div>
        <el-button class="right" size="medium" type="primary" plain icon="el-icon-check"   v-if="yjStatus==='start'"  @click="save">完成阅卷</el-button>
      </div>
      <div class="qusestionBox" v-if="list.length>0">
        <div class="question_wrap" v-for="(item,index) in list" :key="index">
          <p class="font_b">{{item.titleCN}}、{{item.typeName}}（{{item.desc}}）</p>
          <div class="small_question_wrap clearfix">
            <div v-for="(items,indexs) in item.data" :key="indexs">
              <div class="left">
                <p class="question_name clearfix">
                  <span class="samllNum">{{indexs+1}}、</span>
                  <span v-html="items.name" :class="items.name.indexOf('<p>')>-1?'questionContent':'questionContentNoP'"></span>
                </p>
                <p>
                  <span class="font_b">您的答案：</span>
                  <span v-html="items.answer" class="richTextWrap questionContentNoP"></span>
                </p>
                <p>
                  <span class="font_b">解析：</span>
                  <span v-html="items.analysis" class="richTextWrap"></span>
                </p>
              </div>
              <div class="right" style="">
                <p class="score_text">得分</p>
                <el-input type="number" size="small"  v-if="yjStatus==='start'"  v-model="items.yjscore"  maxlength="3"  @change="inputChange(items)" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                <el-input type="number" size="small"  v-else  v-model="items.artScore"  maxlength="3"  :disabled="true"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" v-if="noData">暂无数据</div>
    </el-card>
  </section>
</template>
<script>
import { questionTypeName } from '@/utils/codetotext'
export default {
  data() {
    return {
      listLoading: false,
      btnLoading: false,
      tableHeight: null,
      totalTime: '', // 用时
      zdCore: '', // 自动阅卷得分
      artScore: '', // 人工阅卷得分
      txData: questionTypeName(),
      list: [], // 试卷列表
      rowParam: {}, // 列表页传递过来的当前行的数据
      creator: JSON.parse(sessionStorage.getItem('userInfo')).userName, // 当前登录人账号
      paperName: '', // 试卷名称
      paperId: '', // 试卷id
      yjStatus: '', // 阅卷状态  'start'：未阅卷，'end':已阅卷
      noData: false
      // ruleForm: {
      //   rules: {
      //     score: [ // 阅卷分值
      //       {
      //         required: true, trigger: 'blur', validator: (rule, value, callback) => {
      //           if (!value) {
      //             callback(new Error('请给该试题打分'))
      //           } else {
      //             callback()
      //           }
      //         }
      //       },
      //       { min: 0, max: 30, message: '限制可输入长度为最大30', trigger: 'blur' }
      //     ]
      //   },
      //   list: [] // 试卷列表
      // }
    }
  },
  methods: {
    query() { // 阅卷列表数据查询
      this.totalTime = this.rowParam.totalTime // 总时长
      this.yjStatus = this.rowParam.status // 阅卷状态
      this.zdCore = this.rowParam.score // 自动阅卷分数
      this.artScore = this.rowParam.artScore // 人工阅卷分数
      this.listLoading = true
      const para = {
        userId: this.rowParam.userId, // 用户Id
        recordId: this.rowParam.recordId, // 考试Id
        id: this.rowParam.examId // 试卷Id
      }
      this.$query('exam/subjectiveQuestions', para).then((response) => {
        this.listLoading = false
        if (response.data) {
          var data = response.data
          this.paperName = response.data.paperName
          this.paperId = response.data.paperId
          this.dealData(data)
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    dealData(data) {
      var staticArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
      var titleText = ['一', '二', '三', '四', '五', '六', '七']
      this.list = []
      for (let index = 0; index < staticArr.length; index++) {
        var element = staticArr[index]
        if (data[element]) {
          data[element].titleCN = titleText[index]
          data[element].score = ''
          if (data[element].data && data[element].data.length > 0 && data[element].type) {
            data[element].typeName = this.$getLabelByValue(data[element].type + '', this.txData)
          } else {
            data[element].typeName = '无'
          }
          for (let k = 0; k < data[element].data.length; k++) {
            data[element].data[k].yjscore = ''
          }
          this.list.push(data[element])
        }
      }
      if (this.list.length === 0) {
        this.noData = true
      }
    },
    inputChange(row) {
      if (Number(row.yjscore) > Number(row.score)) {
        this.$set(row, 'yjscore', Number(row.score))
      } else if (Number(row.yjscore) < 0) {
        this.$set(row, 'yjscore', 0)
      }
    },
    save() { // 完成阅卷
      var lsData = []
      this.list.forEach((item, index) => {
        var datas = item.data
        datas.forEach((it, i) => {
          var obj = {
            answerId: it.answerId,
            questionsId: it.id,
            score: it.yjscore + '',
            type: it.type
          }
          lsData.push(obj)
        })
      })

      var yjParam = {
        recordId: this.rowParam.recordId,
        userId: this.rowParam.userId,
        paperId: this.paperId,
        creator: this.creator,
        data: lsData
      }
      var subData = yjParam.data
      var isSumbit = true
      subData.forEach((item, index) => {
        if (!item.score) {
          isSumbit = false
          this.$alert('还有题目没有打分，不能提交完成阅卷。', '提示', {
            type: 'error',
            confirmButtonText: '确定'
          })
          return
        }
      })
      if (isSumbit) {
        this.$confirm('确认是否完成阅卷？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.$update('exam/subjectiveJudge', yjParam).then((response) => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '阅卷成功!'
            })
            this.$router.push({ path: '/handlingGuide/goOverExamPaper/index', query: { examId: this.rowParam.examId }})
          }).catch(() => {
            this.listLoading = false
          })
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    goBack() { // 返回
      this.$router.back(-1)
    }
  },
  mounted() {
    var param = JSON.parse(sessionStorage.getItem(this.$route.path))
    if (param) {
      this.rowParam = param
      this.query()
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.setScore {
  .scoreNumber {
    font-size: 20px;
    color: #f72929;
  }
  .question_wrap p {
    margin-bottom: 15px;
    word-break: break-all;
  }
  .small_question_wrap {
    margin-left: 27px;
    .left {
      width: 84%;
    }
    .right {
      width: 100px;
      text-align: center;
      border-bottom: 0;
      .score_text {
        line-height: 32px;
        margin-bottom: 0px;
        // border: 1px solid #00a0e9;
        border: 1px solid #000;
        border-bottom: 0;
      }
    }
  }
  .font_b {
    // color: #ffffff;
    color: #000;
    font-size: 18px;
    font-weight: bold;
  }
  .qusestionBox {
    // height: 72vh;
    overflow: auto;
  }
  .el-card {
    color: #000;
    background: #fff;
    border: 1px solid #000;
  }
  .el-card__header {
    padding: 12px 20px !important;
    border-bottom: 1px solid #000;
  }
  .el-card__body {
    padding: 20px 8px 20px 20px !important;
  }
  .noData {
    text-align: center;
  }
  .el-input__inner {
    color: #000;
    background-color: #fff;
    border: 1px solid #000;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #000;
    color: #f72929;
    text-align: center;
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
.question_name {
  position: relative;
  .samllNum {
    position: absolute;
    top: 0;
    left: 0;
    width: 26px;
  }
  .questionContentNoP {
    margin-left: 22px;
  }
  .questionContent {
    float: left;
    margin-left: 10px;
    p {
      text-indent: 10px;
    }
  }
}
</style>
