<template>
  <section v-loading="loading" class="examDetail">
    <el-row class="report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="handleBack">   <!--返回-->
    </el-row>
    <el-card class="report">
      <div class="detailHeader">
        <span>风险管理考试（第二部分）</span>
      </div>
      <div class="detailContent">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="questionType">
              <span>{{ questionTypeText[currentData.questionType] + '  (  ' + (currentNum) + ' / ' + dataSize + '  )' }}</span>
              <div>
                <template v-if="currentData.collect === 0">
                  <i class="el-icon-star-off"></i>
                  <span>添加收藏</span>
                </template>
                <template v-else-if="currentData.collect === 1">
                  <i class="el-icon-star-on"></i>
                  <span>已收藏</span>
                </template>
              </div>
            </div>
            <div class="cutOffRule"></div>
            <div class="questionTopic ">
              <span>{{ (currentNum) + '.  ' + currentData.questionTitle }}</span>
            </div>
            <div class="questionAnswer">
              <template v-if="currentData.questionType === 1">
                <el-radio-group v-model="answerType_1">
                  <div class="radioStyle" v-for="(item, index) in currentData.questionContent" :key="index" :value="item">
                    <el-radio :label="item.index">{{ item.index + item.answer }}</el-radio>
                  </div>
                </el-radio-group>
              </template>
              <template v-else-if="currentData.questionType === 2">
                <el-checkbox-group v-model="answerType_2">
                  <div class="radioStyle" v-for="(item, index) in currentData.questionContent" :key="index" :value="item">
                    <el-checkbox :label="item.index">{{ item.index + item.answer }}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </template>
              <template v-else-if="currentData.questionType === 3">
                <el-radio-group v-model="answerType_3">
                  <div class="radioStyle" v-for="(item, index) in currentData.questionContent" :key="index" :value="item">
                    <el-radio :label="item.index">{{ item.index + item.answer }}</el-radio>
                  </div>
                </el-radio-group>
              </template>
              <template v-else-if="currentData.questionType === 4">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="answerType_4" style="margin-top:20px; margin-bottom:20px; width: 93%;"></el-input>
              </template>
            </div>
            <div class="rightAnswer" v-show="false">
              <el-card>
                <div>
                  <span>{{ '正确答案： ' + currentData.rightAnswer }}</span>
                </div>
                <div>
                  <span>{{ '试题解析： ' + currentData.rightAnswerSpecification }}</span>
                </div>
              </el-card>
            </div>
            <div class="cutOffRule"></div>
            <div class="detailFooter">
              <el-button size="medium" @click="handleUpClick(currentIndex, currentType)">上一题</el-button>
              <el-button size="medium" @click="handleSubmitClick(currentIndex, currentType)">提交答案</el-button>
              <el-button size="medium" @click="handlePauseClick(currentIndex, currentType)">暂停考试</el-button>
              <el-button size="medium" @click="handleNextClick(currentIndex, currentType)">下一题</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <el-collapse v-model="activeNames" @change="handleCollapseChange">
              <el-collapse-item title="单选题" name="1">
                <div class="questionIndexContent" v-if="questionDataList[1]">
                  <div :class="(index === currentIndex && currentType === 1) ? 'questionIndexSelected': 'questionIndex'" @click="handleQuestionIndex(index, 1)" v-for="(item, index) in questionDataList[1]" :key="index" :value="item">{{ index + 1 }}</div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="多选题" name="2" v-if="questionDataList[2]">
                <div class="questionIndexContent">
                  <div :class="(index === currentIndex && currentType === 2) ? 'questionIndexSelected': 'questionIndex'" @click="handleQuestionIndex(index, 2)" v-for="(item, index) in questionDataList[2]" :key="index" :value="item">{{ index + 1 }}</div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="判断题" name="3" v-if="questionDataList[3]">
                <div class="questionIndexContent">
                  <div :class="(index === currentIndex && currentType === 3) ? 'questionIndexSelected': 'questionIndex'" @click="handleQuestionIndex(index, 3)" v-for="(item, index) in questionDataList[3]" :key="index" :value="item">{{ index + 1 }}</div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="简单题" name="4" v-if="questionDataList[4]">
                <div class="questionIndexContent">
                  <div :class="(index === currentIndex && currentType === 4) ? 'questionIndexSelected': 'questionIndex'" @click="handleQuestionIndex(index, 4)" v-for="(item, index) in questionDataList[4]" :key="index" :value="item">{{ index + 1 }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
      </el-row>
      </div>
      
    </el-card>
  </section>
</template>
<script>
const listDataTest = {
  1: [{ sectionTitle: '新环境保护法知识考试 - 1', questionType: 1, collect: 0,
    questionTitle: '以环境的构成要素为标准进行分类,环境可分为:()',
    questionContent: [{ index: 'A', answer: '农业环境、工业环境、生活环境等' }, { index: 'B', answer: '大气环境、水环境、土壤环境等' }, { index: 'C', answer: '城市环境、区域环境、流域环境等' }, { index: 'D', answer: '人工环境、生态环境、生活环境等' }], rightAnswer: 'B', rightAnswerSpecification: '无' },
  { sectionTitle: '新环境保护法知识考试 - 1', questionType: 1, collect: 0,
    questionTitle: '直接体现预防为主原则的环境法基本制度是:()',
    questionContent: [{ index: 'A', answer: '排污收费制度' }, { index: 'B', answer: '限期治理制度' }, { index: 'C', answer: '“三同时”制度' }, { index: 'D', answer: '环境事故报告制度' }], rightAnswer: 'C', rightAnswerSpecification: '无' }],
  2: [{ sectionTitle: '新环境保护法知识考试 - 1', questionType: 2, collect: 1, questionTitle: '根据环境质量影响评价制度,大中型开发建设项目必须编制:',
    questionContent: [{ index: 'A', answer: '环境影响报告书' }, { index: 'B', answer: '环境影响报告表' }, { index: 'C', answer: '环境保护方案' }, { index: 'D', answer: '环境污染防治方案' }], rightAnswer: ['A'], rightAnswerSpecification: '无' }],
  3: [{ sectionTitle: '新环境保护法知识考试 - 1', questionType: 3, collect: 0, questionTitle: '企业事业单位应当防止、减少环境污染和生态破坏,对所造成的损害依法承担责任。', questionContent: [{ index: 'A', answer: '对' }, { index: 'B', answer: '错' }], rightAnswer: 'A', rightAnswerSpecification: '无' },
    { sectionTitle: '新环境保护法知识考试 - 1', questionType: 3, collect: 0, questionTitle: '新闻媒体应当开展环境保护法律法规和环境保护知识的宣传,对环境违法行为进行舆论', questionContent: [{ index: 'A', answer: '对' }, { index: 'B', answer: '错' }], rightAnswer: 'A', rightAnswerSpecification: '无' }],
  4: [{ sectionTitle: '新环境保护法知识考试 - 1', questionType: 4, collect: 0, questionTitle: '企业应采取什么措施减少污染物的产生', rightAnswer: '企业应当优先使用清洁能源,采用资源利用率高、污染物排放量少的工艺、设备以及废弃物综合利用技术和污染物无害化处理技术,减少污染物的产生。', rightAnswerSpecification: '无' }]
}

const answerDataRevice = {
  1: [{ index: 0, answer: 'B' }, { index: 1, answer: 'C' }],
  2: [{ index: 1, answer: ['A'] }],
  3: [{ index: 0, answer: 'A' }, { index: 1, answer: 'A' }],
  4: [{ index: 1, answer: '企业应当优先使用清洁能源,采用资源利用率高、污染物排放量少的工艺' }]
}

const answerDataContinue = {
  1: [{ index: 0, answer: 'A' }, { index: 1, answer: 'B' }],
  2: [{ index: 0, answer: ['A', 'B'] }],
  3: [{ index: 0, answer: 'A' }],
  4: []
}

export default {
  name: 'examDetail',
  data() {
    return {
      loading: false,
      activeNames: ['1'],
      questionDataList: [],
      currentData: {},
      currentIndex: 0,
      currentType: 1,
      dataSize: 0,
      questionTypeText: {
        1: '单选题',
        2: '多选题',
        3: '判断题',
        4: '简答题'
      },
      answerType_1: '',
      answerType_2: [],
      answerType_3: '',
      answerType_4: '',
      answerObject: {
        1: [],
        2: [],
        3: [],
        4: []
      },
      showrightAnswerFlag: false,
      showType: ''
    }
  },
  computed: {
    currentNum() {
      let tempNum = 0
      if (this.currentType > 1) {
        for (let i = 1; i < this.currentType; i++) {
          tempNum += listDataTest[i].length
        }
      }
      return tempNum + this.currentIndex + 1
    }
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: '/educational/ExamPractice'
      })
    },
    handleCollapseChange(val) {
      console.log('handleCollapseChange', val)
    },
    handleQuestionIndex(index, type) {
      this.currentType = type
      this.currentIndex = index
      this.currentData = listDataTest[this.currentType][this.currentIndex]
    },
    handleUpClick(index, type) {
      if (index === 0 && type !== 1) {
        this.currentType = type - 1
        this.currentIndex = listDataTest[this.currentType].length - 1
      } else if (index !== 0) {
        this.currentIndex = index - 1
      } else {
        return
      }
      this.currentData = listDataTest[this.currentType][this.currentIndex]
      this.showrightAnswer(this.currentType, true)
    },
    verificationAnswer(index, type, answer) {
      if (this.answerObject[type][index]) {
        this.answerObject[type][index].answer = answer
      } else {
        this.answerObject[type].push({
          index: index,
          answer: answer
        })
      }
    },
    showrightAnswer(type, flag) {
      if (this.answerObject && this.answerObject[this.currentType] && this.answerObject[this.currentType][this.currentIndex]) {
        if (flag) {
          switch (type) {
            case 1:
              this.answerType_1 = this.answerObject[this.currentType][this.currentIndex].answer
              break
            case 2:
              this.answerType_2 = this.answerObject[this.currentType][this.currentIndex].answer
              break
            case 3:
              this.answerType_3 = this.answerObject[this.currentType][this.currentIndex].answer
              break
            case 4:
              this.answerType_4 = this.answerObject[this.currentType][this.currentIndex].answer
              break
            default:
              break
          }
        }
        this.showrightAnswerFlag = true
      } else {
        this.showrightAnswerFlag = false
      }
    },
    handleSubmitClick(index, type) {
      switch (type) {
        case 1:
          if (this.answerType_1) {
            this.verificationAnswer(index, type, this.answerType_1)
          }
          break
        case 2:
          if (this.answerType_2) {
            this.verificationAnswer(index, type, this.answerType_2)
          }
          break
        case 3:
          if (this.answerType_3) {
            this.verificationAnswer(index, type, this.answerType_3)
          }
          break
        case 4:
          if (this.answerType_4) {
            this.verificationAnswer(index, type, this.answerType_4)
          }
          break
        default:
          break
      }
      this.showrightAnswer(type, false)
      // this.handleNextClick(index, type)
    },
    handlePauseClick() {
      this.$confirm('确定暂停考试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/educational/ExamPractice'
        })
        this.$message({
          type: 'success',
          message: '暂停考试成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消暂停考试操作'
        })
      })
    },
    handleNextClick(index, type) {
      if ((index + 1) === listDataTest[type].length && type !== 4) {
        this.currentType = type + 1
        this.currentIndex = 0
      } else if ((index + 1) !== listDataTest[type].length) {
        this.currentIndex = index + 1
      } else {
        return
      }
      this.currentData = listDataTest[this.currentType][this.currentIndex]
      this.resetAnswer()
      this.showrightAnswer(this.currentType, true)
    },
    resetAnswer() {
      this.answerType_1 = ''
      this.answerType_2 = []
      this.answerType_3 = ''
      this.answerType_4 = ''
    }
  },
  mounted() {
    this.questionDataList = listDataTest
    this.currentData = listDataTest[1][0]
    this.dataSize = listDataTest[1].length + listDataTest[2].length + listDataTest[3].length + listDataTest[4].length
    this.currentIndex = 0
    this.currentType = 1
    this.showType = this.$route.query.status
    if (this.showType) {
      switch (this.showType) {
        case '0':
          this.answerObject = {
            1: [],
            2: [],
            3: [],
            4: []
          }
          break
        case '1':
          this.answerObject = answerDataContinue
          break
        case '2':
          this.answerObject = answerDataRevice
          break
        default:
          break
      }
    }
    this.showrightAnswer(this.currentType, true)
  }
}
</script>

<style scoped>
.examDetail .report {
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
}
.examDetail .detailHeader {
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content : center;
}
.examDetail .questionType {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content : space-between;
}
.examDetail .questionTopic {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}
.examDetail .questionAnswer {
  width: 100%; 
  margin-left: 30px;
}
.examDetail .radioStyle {
  height: 50px; 
  display: flex;
  align-items: center;
}
.examDetail .rightAnswer {
  margin-bottom: 20px;
}
.examDetail .detailFooter {
  display: flex;
  justify-content : space-between;
  align-items : center;
  margin-top: 10px;
}
.examDetail .cutOffRule {
  border-bottom: 1px solid #e4e7ed;
  width: 100%;
}
.examDetail .questionIndexContent {
  width: 100%;
  display: flex;
}
.examDetail .questionIndex {
  width: 40px;
  height: 25px;
  text-align: center;
  border: 1px solid #00a0e9;
  border-radius: 5px;
  margin-left: 5px;
}
.examDetail .questionIndexSelected {
  width: 40px;
  height: 25px;
  text-align: center;
  border: 1px solid #00a0e9;
  background-color: #4baddb;
  border-radius: 5px;
  margin-left: 5px;
}
.examDetail .questionIndex:hover {
  background-color: #4baddb;
  cursor: pointer;
}
</style>