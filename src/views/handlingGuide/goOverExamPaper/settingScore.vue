<template>
  <section class="setScore">
  <el-row class="">
    <img src="@/assets/icon/back.png"  class="goBack" @click="goBack">   <!--返回-->
  </el-row>
    <el-card class="box-card" v-loading="listLoading">
      <div slot="header" class="clearfix">
        <div class="left">
          <span class="font_b">考试成绩：</span>
          <span>用时{{totalTime}}，自动阅卷得分</span><span class="scoreNumber"> {{zdCore}} </span>分
        </div>
        <el-button class="right" size="medium" type="primary" plain icon="el-icon-check"  :loading="btnLoading"  @click="save">完成阅卷</el-button>
      </div>
      <div class="qusestionBox">
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
                  <span class="font_b">您的答案：</span>{{items.answer}}
                </p>
                <p>
                  <span class="font_b">解析：</span>{{items.analysis}}
                </p>
              </div>
              <div class="right" style="">
                <p class="score_text">得分</p>
                <el-input type="text" size="small"  v-model="items.yjscore"  maxlength="3" @change="inputChange(items)"></el-input>
              </div>
            </div>
            <!-- <div class="right" style="">
              <p class="score_text">得分</p>
              <el-input type="text" size="small"  v-model="item.score"  @change="inputChange(index,item)"></el-input>
            </div> -->
          </div>
        </div>
      </div>
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
      txData: questionTypeName(),
      yjParam: {}, // 存储改造后的'完成阅卷'参数
      list: [], // 试卷列表
      creator: JSON.parse(sessionStorage.getItem('userInfo')).userName // 当前登录人账号
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
  watch: { // 监听state状态变化
  },
  methods: {
    query(param) { // 阅卷列表数据查询
      this.totalTime = param.totalTime
      this.zdCore = param.score
      this.listLoading = true
      const para = {
        userId: param.userId, // 用户Id
        recordId: param.recordId, // 考试Id
        id: param.examId // 试卷Id
      }
      this.$query('exam/subjectiveQuestions', para).then((response) => {
        this.listLoading = false
        if (response.data) {
          var data = response.data
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
      console.log('list', JSON.stringify(this.list))
    },
    inputChange(row) {
      if (Number(row.yjscore) > Number(row.score)) {
        row.yjscore = Number(row.score)
        // this.$set(row, 'yjscore', Number(row.score))
      }
      console.log('row', JSON.stringify(row))
    },
    save() { // 完成阅卷
      var isSumbit = true
      var subData = this.yjParam.data
      subData.forEach((item, index) => {
        if (!item.score) {
          isSumbit = false
        }
      })
      if (isSumbit) {
        this.btnLoading = true
        this.$update('exam/subjectiveJudge', this.yjParam).then((response) => {
          this.btnLoading = false
          this.$message({
            type: 'success',
            message: '阅卷成功!'
          })
          this.$router.push({ path: '/handlingGuide/goOverExamPaper/index' })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.$alert('还有题目没有打分，不能提交完成阅卷。', '提示', {
          type: 'error',
          confirmButtonText: '确定'
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
      this.query(param)
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
  }
  .small_question_wrap {
    margin-left: 27px;
    .left {
      width: 80%;
    }
    .right {
      width: 100px;
      text-align: center;
      border: 1px solid #00a0e9;
      border-bottom: 0;
      .score_text {
        line-height: 32px;
        margin-bottom: 0px;
      }
    }
  }
  .font_b {
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
  }
  .qusestionBox{
    height: 72vh;
    overflow: auto;
  }
  .el-card__header {
    padding: 12px 20px !important;
  }
  .el-card__body {
    padding: 20px 8px 20px 20px !important;
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
      width: 22px;
    }
    .questionContentNoP {
      margin-left: 22px;
    }
    .questionContent {
      float: left;
      margin-left: 20px;
      p {
        text-indent: 20px;
      }
    }
  }
</style>
