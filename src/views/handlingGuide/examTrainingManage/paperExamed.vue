<template>
  <section class="preview">
    <!-- <el-row class="clearfix">
      <el-button v-print="'#previewExamPaper'" class="right" type="primary" plain icon="el-icon-printer">打印</el-button>
      <el-button class="right" type="primary" plain icon="el-icon-check" style="margin-right:10px;">保存</el-button>
    </el-row> -->
    <el-row class="spt_report">
      <img src="@/assets/icon/back.png"  class="goBack" @click="back">
    </el-row>
    <!-- 考试须知 -->
    <!-- <div class="v-modal" tabindex="0" style="z-index: 2000;" v-if="isInstruction||isExamEnd||isExamCancel"></div> -->
    <!-- <div class="instructions_wrap" v-if="isInstruction">
      <p>考试须知</p>
      <p>考试须知考试须知考试须知考试须知考试须知考试须知考试须知考试须知考试须知考试须知考试须知考试须知</p>
      <el-button class="right" type="primary" plain @click="closeInstructions">我知道了</el-button>
    </div>
    <div class="exam_end_wrap" v-if="isExamEnd">
      <p>考试时间已结束，系统已为您自动提交！</p>
      <el-button class="right" type="primary" plain @click="closeExamOver">我知道了（{{endTime}}s）</el-button>
    </div>
    <div class="exam_cancel_wrap" v-if="isExamCancel">
      <p>温馨提示</p>
      <p>如果您取消考试的话，本次考试的答案将不被提交，也不记录考试次数，下次可以重新参加考试！</p>
      <div style="text-align:center;">
        <el-button plain @click="handleCancelExam('1')" class="saveBtn">确定</el-button>
        <el-button plain @click="handleCancelExam('2')" class="cancelBtn">取消</el-button>
      </div>
    </div> -->
    <!-- 试卷 -->
    <div id="previewExamPaper" v-loading="detailLoading">
      <div class="exam_title_wrap">
        <p class="exam_title">{{examinationData.examinationName}}</p>
        <p class="exam_subtitle">
          <span>考试时间：{{examinationData.examStartTime}} ~ {{examinationData.examEndTime}}</span>
          <span>考试时限：{{examinationData.totalDate}} 分钟</span>
        </p>
      </div>
      <!-- 题型 -->
      <div class="question_wrap" v-for="(item,index) in curPaperData" :key="index">
        <p class="font_b">{{item.titleCN}}、{{item.typeName}}（{{item.desc}}）</p>
        <div class="small_question_wrap clearfix">
          <div v-for="(smallItem,smallIndex) in item.data" :key="smallIndex">
            <p class="question_name clearfix">
              <span class="samllNum">{{smallIndex+1}}、</span>
              <span v-html="smallItem.name" :class="smallItem.name.indexOf('<p>')>-1?'questionContent':'questionContentNoP'"></span>
            </p>
            <!-- 单选题选项 -->
            <div v-if="smallItem.items && smallItem.type===1" class="options_wrap">
              <!-- <el-radio-group v-model="answer[smallItem.id]" @change="saveQuestionAnswer(smallItem.type,smallItem.id,$event)">
                <p v-if="smallItem.items.A" class="option_item"><el-radio label="A">A、<span v-html="smallItem.items.A" class="richTextWrap"></span></el-radio></p>
                <p v-if="smallItem.items.B" class="option_item"><el-radio label="B">B、<span v-html="smallItem.items.B" class="richTextWrap"></span></el-radio></p>
                <p v-if="smallItem.items.C" class="option_item"><el-radio label="C">C、<span v-html="smallItem.items.C" class="richTextWrap"></span></el-radio></p>
                <p v-if="smallItem.items.D" class="option_item"><el-radio label="D">D、<span v-html="smallItem.items.D" class="richTextWrap"></span></el-radio></p>
               </el-radio-group> -->
              <p v-if="smallItem.items.A" class="option_item">A、<span v-html="smallItem.items.A" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.B" class="option_item">B、<span v-html="smallItem.items.B" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.C" class="option_item">C、<span v-html="smallItem.items.C" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.D" class="option_item">D、<span v-html="smallItem.items.D" class="richTextWrap"></span></p>
               <p>您的答案：{{smallItem.answer}}</p>
               <p>正确答案：{{smallItem.rightAnswer}}</p>
            </div>
            <!-- 多选题选项 -->
            <div v-if="smallItem.items && smallItem.type===2" class="options_wrap">
              <!-- <el-checkbox-group v-model="smallItem.answerr" @change="saveQuestionAnswer(smallItem.type,smallItem.id,$event,smallItem.answerr)"> -->
                <!-- <p v-if="smallItem.items.A" class="option_item"><el-checkbox label="A">A、<span v-html="smallItem.items.A" class="richTextWrap"></span></el-checkbox></p>
                <p v-if="smallItem.items.B" class="option_item"><el-checkbox label="B">B、<span v-html="smallItem.items.B" class="richTextWrap"></span></el-checkbox></p>
                <p v-if="smallItem.items.C" class="option_item"><el-checkbox label="C">C、<span v-html="smallItem.items.C" class="richTextWrap"></span></el-checkbox></p>
                <p v-if="smallItem.items.D" class="option_item"><el-checkbox label="D">D、<span v-html="smallItem.items.D" class="richTextWrap"></span></el-checkbox></p>
                <p v-if="smallItem.items.E" class="option_item"><el-checkbox label="E">E、<span v-html="smallItem.items.E" class="richTextWrap"></span></el-checkbox></p>
                <p v-if="smallItem.items.F" class="option_item"><el-checkbox label="F">F、<span v-html="smallItem.items.F" class="richTextWrap"></span></el-checkbox></p> -->
              <!-- </el-checkbox-group> -->
              <p v-if="smallItem.items.A" class="option_item">A、<span v-html="smallItem.items.A" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.B" class="option_item">B、<span v-html="smallItem.items.B" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.C" class="option_item">C、<span v-html="smallItem.items.C" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.D" class="option_item">D、<span v-html="smallItem.items.D" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.E" class="option_item">E、<span v-html="smallItem.items.E" class="richTextWrap"></span></p>
              <p v-if="smallItem.items.F" class="option_item">F、<span v-html="smallItem.items.F" class="richTextWrap"></span></p>
              <p>您的答案：{{smallItem.answer}}</p>
              <p>正确答案：{{smallItem.rightAnswer}}</p>
            </div>
            <!-- 填空题 -->
            <!-- {{smallItem.zhi}} -->
            <div v-if="smallItem.type===3" class="options_wrap">
              <!-- <el-input v-for="(tkItem,tkItemIndex) in smallItem.tkInputNum" :key="tkItemIndex" v-model="smallItem.zhi[tkItem.id][tkItemIndex+'p']"
              @change="saveQuestionAnswer(smallItem.type,smallItem.id,$event,smallItem.zhi,)" placeholder="请输入" class="tkInput"></el-input> -->
              <p>您的答案：{{smallItem.answer}}</p>
              <p>正确答案：{{smallItem.rightAnswer}}</p>
            </div>
            <!-- 判断题 对错 -->
            <div v-if="smallItem.type===4" class="options_wrap pd_options_wrap">
              <!-- <el-radio-group v-model="answer[smallIndex]" @change="saveQuestionAnswer(smallItem.type,smallItem.id,$event)"> -->
                <!-- <span class="option_item"><el-radio label="true">正确</el-radio></span> -->
                <!-- <span class="option_item"><el-radio label="false">错误</el-radio></span> -->
               <!-- </el-radio-group> -->
               <p>您的答案：{{smallItem.answer==='1'?'✔':'×'}}</p>
               <p>正确答案：{{smallItem.rightAnswer===1?'✔':'×'}}</p>
            </div>
            <!-- 简答题、论述题、案例分析题 -->
            <div  v-if="smallItem.type === 5 || smallItem.type === 6 || smallItem.type === 7">
              <!-- <el-input type="textarea" :rows="3" v-model="answer[smallItem.id]"
                @change="saveQuestionAnswer(smallItem.type,smallItem.id,$event)" maxlength="1000" clearable placeholder="请输入您的答案"></el-input> -->
              <!-- 答案 -->
              <p>您的答案：{{smallItem.answer}}</p>
              <p>解析：<span v-html="smallItem.analysis" class="richTextWrap"></span></p>
            </div>
          </div>
        </div>
      </div>
      <!-- 考试成绩 -->
      <div class="exam_bottom clearfix">
        <p class="left">
          <!-- <span class="font_b">考试成绩：</span> 自动阅卷得分 <span class="scoreNumber">{{examinationData.examScore}}</span> 分，人工阅卷得分 <span class="scoreNumber">{{examinationData.examArtificialScore}}</span> 分 -->
          <span class="font_b">考试成绩：</span>
          用时 {{examinationData.totalTime}}，成绩 <span class="scoreNumber">{{Number(examinationData.examScore) + Number(examinationData.examArtificialScore)}}</span> 分
        </p>
        <p class="right">
          <span class="font_b">可重考次数： <span class="scoreNumber">{{examinationData.enableNum}}</span> 次</span>
          <span class="again_exam" @click="handleAgainExam" v-if="(examinationData.enableNum > 0) || (examinationData.unable===false)">重新考试</span>
          <span class="again_exam" v-else></span>
          <el-button size="mini" circle icon="el-icon-question" title="重新考试会有多个考试成绩，我们将以其中的最高分作为最终的成绩！"></el-button>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { questionTypeAll } from '@/utils/codetotext'

export default {
  name: 'preview',
  props: ['curPaper'],
  data() {
    return {
      paperData: [], // 试卷数据
      data: {},
      isInstruction: false, // 考试须知 弹框
      isExamEnd: false, // 考试结束 弹框
      isExamCancel: false, // 取消考试
      txData: questionTypeAll(),
      detailLoading: false,
      mm: 0,
      ss: 0,
      radio: {},
      endTime: 3, // 结束弹框 倒计时3秒
      paperId: '',
      curPaperData: [],
      answer: {
        // '695': { '0': '', '1': '' }
      }, // 用户答案
      answerr: [],
      examinationData: {},
      recordId: '', // 考试记录id
      startTime: '',
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  watch: { // 监听state状态变化

  },
  methods: {
    closeInstructions() { // 考试须知，(我知道了)
      this.isInstruction = false
      this.saveExamStart()
    },
    closeExamOver() { // 考试结束，(我知道了)
      this.saveExamStart()
    },
    handleCancelExam(type) { // 取消考试 弹框
      this.isExamCancel = false
      if (type === '1') { // 确定
        this.$router.back(-1)
      } else if (type === '2') {
        // 继续答题
      }
    },

    queryPaperData() { // 试卷数据查询
      this.detailLoading = true
      var examedPara = {
        userId: this.userInfo.id,
        recordId: this.carryParam.recordId
      }
      this.$query('exam/examPaper/' + this.carryParam.examinationId, examedPara).then((response) => {
        this.detailLoading = false
        this.examinationData = response.data
        var data = response.data.datas
        this.dealData(data)
      }).catch(() => {
        this.detailLoading = false
      })
      // var data = { 'six': { 'data': [{ 'score': 2, 'name': '<p>春秋战国之交，掀起了一场社会大变革的风暴。在这场摧枯拉朽、势不可挡的大变革中，旧的奴隶主阶级没落了，新的地主阶级兴起了；旧的制度和道德伦理观念，被新的制度和意识形态取代了；一部分农民获得较多的自由，社会的生产关系也发生了深刻的变化；阶级矛盾尖锐激烈，兼并战争连年不断，整个社会呈现出纷繁复杂的大动荡大改组局面。</p>', 'id': 784, 'sort': 1, 'type': 6 }], 'sort': '6', 'type': 6, 'value': '2', 'desc': '每小题2分' }, 'paperName': '2019第六次全体人员学习试卷', 'four': { 'data': [{ 'score': 2, 'name': 'XXXXXX判断1030', 'id': 1030, 'sort': 1, 'type': 4 }, { 'score': 2, 'name': '判断测试1033', 'id': 1033, 'sort': 1, 'type': 4 }, { 'score': 2, 'name': '判断1032', 'id': 1032, 'sort': 1, 'type': 4 }], 'sort': '4', 'type': 4, 'value': '2', 'desc': '每小题2分' }, 'one': { 'data': [{ 'name': '2+6=', 'id': 1064, 'type': 1, 'items': { 'A': '5', 'B': '7', 'C': '8', 'D': '9' }}, { 'name': '1+3=', 'id': 1073, 'type': 1, 'items': { 'A': '7', 'B': '6', 'C': '5', 'D': '4' }}, { 'name': '3+4=', 'id': 1060, 'type': 1, 'items': { 'A': '10', 'B': '7', 'C': '8', 'D': '11' }}], 'sort': '1', 'type': 1, 'value': '2', 'desc': '每小题2分' }, 'seven': { 'data': [{ 'score': 2, 'name': '<p>春秋战国时代是由封建制向郡县制过渡的时代，是先进的封建生产关系战胜落后的奴隶制生产关系的时代，在学术上是诸子蓬起、百家争鸣空前活跃的时代。各种艺术蓬勃发展，有声有色。春秋战国持续了几百年，各诸侯国独立发展，形成不同的文化氛围，李学勤先生概括为几个文化圈：中原文化圈、北方文化圈、齐鲁文化圈、楚文化圈、吴越文化圈、巴蜀滇文化圈。在相互兼并战争中相互融合。秦统一后，共同形成丰富多彩的中华文化。在春秋战国之交，欧洲的希腊文化也正进入发展的盛期，中西两大文化体系遥遥相对。两相比较，希腊以技艺高超的雕刻闻名于世，为后世留下无数的艺术珍品，在世界美术史上放射着永不磨灭的光辉；中国春秋战国时期则以多功能的青铜器闻名于世，青铜器是集雕刻、绘画、书法、工艺于一体的综合艺术品，融实用、审美于一身，既是沟通人权与神权的信物，又是区别等级名分的标记。</p>', 'id': 789, 'sort': 1, 'type': 7 }], 'sort': '7', 'type': 7, 'value': '2', 'desc': '每小题2分' }, 'two': { 'data': [{ 'name': 'You think you can play me the fool? ', 'id': 1031, 'type': 2, 'items': { 'A': 'Zi Yan', 'B': 'If a gentleman is not heavy, ', 'C': 'then he is not arrogant; ', 'D': 'if he is not loyal, ' }}, { 'name': 'He looked at me as if I were a simpleton. ', 'id': 1036, 'type': 2, 'items': { 'A': 'sly, and let it come. ', 'B': 'Master ', 'C': 'What is it, what is it that is ', 'D': 'different from others?"' }}, { 'name': "You're just imagining me, you crazy fool. ", 'id': 1028, 'type': 2, 'items': { 'A': 'and the relatives. ', 'B': 'If you have the power, ', 'C': 'you can learn the text."', 'D': 'Zi Xia: "Xianxian is easy to color; ' }}], 'sort': '2', 'type': 2, 'value': '2', 'desc': '每小题2分' }, 'three': { 'data': [{ 'score': 2, 'name': "<p>I think [] the world of him, but something [] tells me it's not []</p>", 'id': 695, 'sort': 1, 'type': 3 }, { 'score': 2, 'name': '<p>Oh darling, I [] you. </p>', 'id': 677, 'sort': 1, 'type': 3 }, { 'score': 2, 'name': "<p>I'll [] her till the end of time. </p>", 'id': 693, 'sort': 1, 'type': 3 }], 'sort': '3', 'type': 3, 'value': '2', 'desc': '每小题2分' }, 'five': { 'data': [{ 'score': 2, 'name': '<p>战国时代的形势是：楚在南，赵在北，燕在东北，齐在东，秦在西，韩、魏在中间。在这七个大国中，沿黄河流域从西到东的三个大国──秦、魏、齐、在前期具有左右局势的力量。</p>\r\n<p>从魏文侯开始至公元前四世纪中叶，是魏国独霸中原的时期。魏的强大，引起韩、赵、秦的忧虑，它们之间摩擦不断。公元前354年，赵国攻卫，魏视卫为自己的属国，于是出兵攻打赵都邯郸。赵向齐求援，齐派田忌救赵，用孙膑之计，袭击魏都大梁。时魏军虽已攻下邯郸，不得不撤军回救本国，在桂陵被齐军打败。次年，魏、韩联合，又打败齐军。公元前342年魏攻韩，韩向齐求救，齐仍派田忌为将，孙膑为军师，设计将魏军诱入马陵埋伏圈，齐军万箭齐发，魏国大将庞涓自杀，魏太子申被俘。这就是著名的马陵之战。由此造成了齐、魏在东方的均势。</p>\r\n<p>秦国自商鞅变法以后，逐渐成为七国中实力最强的国家，于是向东扩展势力。先是打败了三晋，割取魏在河西的全部土地。后又向西、南、北扩充疆土，到公元前四世纪末，其疆土之大与楚国接近。</p>\r\n<p>在秦与三晋争斗之时，齐国在东方发展势力。公元前315年，齐国利用燕王哙将王位「禅让」给相国子之而引起的内乱，一度攻下燕国。后因燕人强烈反对，齐军才从燕国撤出。当时能与秦国抗争的唯有齐国，斗争的焦点则集中在争取楚国。</p>\r\n<p>楚国的改革不彻底，国力不强，但它幅员广大，人口众多。楚结齐抗秦，使秦国的发展大受影响。于是秦派张仪入楚，劝楚绝齐从秦，许以商于之地六百里为代价。楚怀王贪图便宜，遂与齐国破裂。当楚国派人去要地时，秦相张仪却狡辩称“只有六里”。楚怀王兴兵伐秦，大败而回。楚国势孤力弱，秦便东向进图中原。先是与韩、魏争斗，后与齐国争斗。公元前286年，齐灭宋，使各国感到不安。秦国便约韩、赵、魏、燕国攻齐，大败齐军。燕国以乐毅为将，趁势攻下齐都临淄，攻占七十余城。齐王逃至国外，为楚所杀。齐国的强国地位从此一去不复返。由此，秦国开始了东向大发展。</p>\r\n', 'id': 779, 'sort': 1, 'type': 5 }], 'sort': '5', 'type': 5, 'value': '2', 'desc': '每小题2分' }}
      // this.dealData(data)
    },
    dealData(data) {
      var _this = this
      var staticArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
      var titleText = ['一', '二', '三', '四', '五', '六', '七']
      _this.curPaperData = []
      for (let index = 0; index < staticArr.length; index++) {
        var element = staticArr[index]
        if (data[element]) {
          data[element].titleCN = titleText[index]
          if (data[element].data && data[element].data.length > 0 && data[element].data[0].type) {
            data[element].typeName = _this.$getLabelByValue(data[element].data[0].type + '', _this.txData)
          } else {
            data[element].typeName = '无'
          }
          if (data[element].data[0].type === 3) { // 填空题
            for (let k = 0; k < data[element].data.length; k++) {
              var tkelement = data[element].data[k]
              if (tkelement.name.indexOf('[]') > -1) {
                var num = (tkelement.name.split('[]')).length - 1 // 填空的个数，得知输入框的个数
                tkelement.tkInputNum = []
                tkelement.zhi = {}
                tkelement.zhi[tkelement.id] = {}
                for (var i = 0; i < Number(num); i++) {
                  tkelement.tkInputNum.push({ index: i, type: tkelement.type, id: tkelement.id })
                  tkelement.zhi[tkelement.id][i + 'p'] = ''
                }
                tkelement.name = tkelement.name.replace(/\[/g, '___').replace(/\]/g, '___') // 将方括号[]替换为 下横线
              }
            }
          }
          if (data[element].data[0].type === 2) { // 多选题
            for (let m = 0; m < data[element].data.length; m++) {
              var melement = data[element].data[m]
              melement.answerr = [] // 初始化 存放答案的数组
            }
          }
          _this.curPaperData.push(data[element])
        }
      }
    },
    handleAgainExam() { // 重新考试
      this.$router.push({ path: '/handlingGuide/examTrainingManage/trainingOnline', query: { examinationId: this.examinationData.id }})
    },
    saveExamStart() { // 提交开始考试信息
      this.detailLoading = true
      var param = {
        userId: this.userInfo.id,
        userName: this.userInfo.userName,
        realName: this.userInfo.realName,
        examId: this.carryParam.examinationId, // 考试id
        creator: this.userInfo.userName,
        deptCode: this.deptInfo.depCode,
        deptName: this.deptInfo.depName
      }
      this.$save('exam/start', param).then((response) => {
        this.detailLoading = false
        if (response.code === '000000') {
          this.startTime = response.data.startTime // 考试开始时间
          this.recordId = response.data.recordId // 考试记录id
          var minutes = Number(this.examinationData.totalDate) * 60
          this.countdown(minutes) // 倒计时开始，参数 秒数
        }
      }).catch(() => {
        this.detailLoading = false
      })
    },
    saveQuestionAnswer(type, questionsId, answer, OtherAnswer) { // 保存题目答案
      // console.log(type)
      // console.log(questionsId)
      // console.log(answer)
      // console.log(OtherAnswer) // 多选题 填空题 取这个答案

      var param = {
        recordId: this.recordId,
        paperId: this.examinationData.paperId, // 试卷id
        examId: this.carryParam.examinationId, // 考试id
        questionsId: questionsId,
        type: type,
        creator: this.userInfo.userName,
        deptCode: this.deptInfo.depCode,
        deptName: this.deptInfo.depName
      }
      if (type === 2) { // 多选题
        if (OtherAnswer.length > 0) {
          OtherAnswer = OtherAnswer.sort()
          param.answer = OtherAnswer.join(',')
        }
      } else if (type === 3) { // 填空题
        // console.log(OtherAnswer[questionsId + ''])
        var da = OtherAnswer[questionsId + '']
        var daArr = []
        for (const key in da) {
          if (da.hasOwnProperty(key)) {
            const element = da[key]
            daArr.push(element)
          }
        }
        param.answer = daArr.join('|')
      } else {
        param.answer = answer
      }

      this.$update('exam/saveAnswer', param).then((response) => {
        this.detailLoading = false
        // if (response.code === '000000') {
        // }
      }).catch(() => {
        this.detailLoading = false
      })
    },
    lastCancelExam() { // 页面下方取消考试
      this.isExamCancel = true
      // console.log(this.curPaperData)
    },
    lastSubmitExam(submitType) { // 页面下方提交答案
      // 判断是否存在 主观题
      var hasSubjective = false
      for (let index = 0; index < this.curPaperData.length; index++) {
        const element = this.curPaperData[index]
        if (element.data && element.data.length > 0) {
          if (element.data[0].type === 5 || element.data[0].type === 6 || element.data[0].type === 7) {
            hasSubjective = true
            break
          }
        }
      }
      var param = {
        recordId: this.recordId, // 考试记录
        userId: this.userInfo.id,
        examId: this.carryParam.examinationId, // 考试id
        submitStatus: submitType, // 提交试卷方式，1 手动提交，2 自动提交
        creator: this.userInfo.userName,
        examType: hasSubjective ? '' : 'nonexistent'
      }
      this.detailLoading = true
      this.$update('exam/submitAnswer', param).then((response) => {
        this.detailLoading = false
        if (response.code === '000000') { // 提交答案成功
          this.$router.push({ path: '/handlingGuide/examTrainingManage/index' })
        }
      }).catch(() => {
        this.detailLoading = false
      })
    },
    countdown(allSeconds) {
      var _this = this
      allSeconds = Number(allSeconds)
      allSeconds--
      var mm = parseInt(allSeconds / 60)
      var ss = allSeconds % 60
      this.mm = mm > 9 ? mm : '0' + mm
      this.ss = ss > 9 ? ss : '0' + ss
      if ((mm === 3 && ss === 0) || (mm === 2 && ss === 0) || (mm === 1 && ss === 0)) {
        this.$notify.info({
          title: '提示',
          message: '离考试结束还有 ' + mm + ' 分钟，请您尽快检查答卷，以免漏答或错答！如果到时您还未提交，系统将自动为您提交答卷！',
          duration: 10000
        })
      }
      if (mm === 0 && ss === 0) {
        this.isExamEnd = true // 考试结束的弹框
        this.countdownOver(3)
      } else {
        setTimeout(function() {
          _this.countdown(allSeconds)
        }, 1000)
      }
    },
    countdownOver(endTime) { // 结束弹框 倒计时
      var _this = this
      this.endTime--
      if (this.endTime === 0) { // 交卷
        this.lastSubmitExam('2') // 自动交卷
        // return
      } else {
        setTimeout(function() {
          _this.countdownOver(this.endTime)
        }, 1000)
      }
    },
    back() {
      this.$router.back(-1)
    }
  },
  mounted() {
    if (this.$route.query) {
      this.carryParam = this.$route.query
    }
    this.queryPaperData()
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
// p {
//   margin: 0 0 0 6px;
// }
.instructions_wrap,
.exam_end_wrap,
.exam_cancel_wrap {
  position: absolute;
  left: calc(50% - 250px);
  z-index: 2001;
  padding: 20px;
  background: #ffffff;
  width: 500px;
  p {
    color: #000000;
  }
  p:nth-child(1) {
    text-align: center;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
.instructions_wrap {
  top: calc(50% - 150px);
  height: 300px;
}
.exam_end_wrap,
.exam_cancel_wrap {
  top: calc(50% - 80px);
  height: 160px;
}
// 考试须知的内容
.instructions_wrap p:nth-child(2) {
  text-indent: 20px;
  line-height: 30px;
  height: 200px;
  max-height: 200px;
  overflow-y: auto;
}
.exam_end_wrap p:nth-child(1) {
  margin: 30px auto;
}
.exam_cancel_wrap p:nth-child(2) {
  text-indent: 20px;
  line-height: 30px;
  margin-bottom: 10px;
}
// 显示题目
#previewExamPaper {
  padding: 20px;
  margin-top: 10px;
  background: #c7eece;
  color: #000000;
  .exam_title_wrap {
    margin-bottom: 14px;
    text-align: center;
    border-bottom: 2px solid #bebebe;
    .exam_title {
      color: #000000;
      font-size: 22px;
      font-weight: bold;
      line-height: 30px;
    }
    .exam_subtitle {
      // margin-bottom:
      span:first-child {
        margin-right: 100px;
      }
    }
  }
}
.preview {
  width: 70%;
  margin: 0 auto;
  .scoreNumber {
    font-size: 20px;
    color: #f72929;
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
    // 填空题的空
    .tkInput {
      width: 220px;
      margin-right: 20px;
    }
    // 单选框样式
    .el-radio {
      color: #000000;
    }
    .el-radio__inner {
      background: #fff;
      border: 1px solid #bbbbbb;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #409eff;
      background: #409eff;
    }
    .el-radio-group {
      display: initial;
    }
    // 复选框样式
    .el-checkbox {
      color: #000000;
    }
    .el-checkbox__inner {
      border: 1px solid #bbbbbb;
      background: #fff;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #1e98d2;
      border-color: #1e98d2;
    }
    // 输入框
    .el-input__inner {
      color: #000000;
      border: 1px solid #aaaaaa;
    }
    // 文本域
    .el-textarea__inner {
      color: #111111;
      background-color: #fff;
      background-image: none;
      border: 1px solid #aaaaaa;
      margin-bottom: 10px;
    }
  }
  .font_b {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
  }

  .options_wrap {
    margin: 5px 0 5px 10px;
    p {
      margin: 0 0 5px;
    }
  }
  .pd_options_wrap {
    margin: 6px 0 0;
    .option_item {
      display: inline-block;
      width: 22%;
    }
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
      p {
        text-indent: 20px;
      }
    }
  }
  // 试卷底部
  .exam_bottom {
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid #dedede;
    .again_exam {
      color: #0570db;
      text-decoration: underline;
      margin: 0 20px;
      cursor: pointer;
    }
  }
  .richTextWrap p:nth-child(1) {
    display: inline-block;
  }
}
</style>
<style media="previewExamPaper" type="text/css">
.noprint {
  display: none;
}
.print {
  margin-left: 25%;
}
@page {
  size: auto;
  margin: 0mm;
}
</style>
