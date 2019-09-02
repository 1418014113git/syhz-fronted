<template>
  <el-card class="solid">
    <div class="notice">{{notice}}</div>
    <div class="fontFamliy">{{fontFamliy}}</div>
    <div class="title2">{{title2}}</div>
    <div class="title3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{title3}}</div>
    <div class="teCiTongZhi">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{teCiTongZhi}}</div>
    <div class="time">{{time}}</div>
    <div class="Title">{{Title}}</div>
    <div class="text">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了实施可持续发展战略，预防因规划和建设项目实施后对环境造成不良影响，促进经济、社会和环境的协调发展，制定本法<br/><br/>
  　　&nbsp;&nbsp;<span class="spand">第一条</span>  为了实施可持续发展战略，预防因规划和建设项目实施后对环境造成不良影响，促进经济、社会和环境的协调发展，制定本法。<br/><br/>
  　　&nbsp;&nbsp;<span class="spand">第二条</span>  本法所称环境影响评价，是指对规划和建设项目实施后可能造成的环境影响进行分析、预测和评估，提出预防或者减轻不良环境影响的对策和措施，进行跟踪监测的方法与制度。<br/><br/>
  　　&nbsp;&nbsp;<span class="spand">第三条</span>  编制本法第九条所规定的范围内的规划，在中华人民共和国领域和中华人民共和国管辖的其他海域内建设对环境有影响的项目，应当依照本法进行环境影响评价。<br/><br/>
  　　&nbsp;&nbsp;<span class="spand">第四条</span>  环境影响评价必须客观、公开、公正，综合考虑规划或者建设项目实施后对各种环境因素及其所构成的生态系统可能造成的影响，为决策提供科学依据。<br/><br/>
  　　&nbsp;&nbsp;<span class="spand">第五条</span>  国家加强环境影响评价的基础数据库和评价指标体系建设，鼓励和支持对环境影响评价的方法、技术规范进行科学研究，建立必要的环境影响评价信息共享制度，提高环境影响评价的科学性。
    </div>
  </el-card>
</template>

<script>
    export default {
      name: 'institutionalNormsInfo', // 法律法规详情
      data() {
        return {
          notice: '关于印发《中华人民共和国环境影响评价法》的通知',
          fontFamliy: '国知发办字〔2006〕87号',
          title2: '各省、自治区、直辖市知识产权局，局机关各部门、专利局各部门、局直属各单位、各社会团体：',
          title3: '  现将《中华人民共和国环境影响评价法》印发，请遵照执行。',
          teCiTongZhi: '  特此通知。 ',
          time: '二○一九年六月十六日',
          Title: '中华人民共和国环境影响评价法(2018修正) '
        }
      }
    }
</script>

<style scoped>
  .solid {
    margin-left: auto;
    margin-right: auto;
    width: 765px;
    height: 940px;
  }
  .notice {
    padding-top: 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
  }
  .fontFamliy {
    margin-top: 10px;
    text-align: center;
    color: #1c252c;
    color: #FFFFFF;
  }
  .title2 {
    margin-top: 10px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .title3 {
    margin-top: 10px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .teCiTongZhi {
    margin-top: 10px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .time {
    margin-top: 10px;
    text-align: center;
    color: #FFFFFF;
  }
  .Title {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #FFFFFF;
  }
  .text {
    margin-top: 15px;
    color: #FFFFFF;
    margin-left: 15px;
    margin-right: 15px;
  }
  .spand {
    font-weight: bold;
  }
  .faqIndex .item {
    margin-top: 10px;
  }
  .faqIndex .is-always-shadow {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .faqIndex .title {
    cursor: pointer;
    padding-bottom: 10px;
  }

  .faqIndex .title button {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 16px;
    color: #f7f0f0;
    padding: 0;
  }

  .faqIndex .title button:hover {
    color: #1b75ba;
  }

  .faqIndex .content {
    color: #646464;
  }

  .faqIndex .bm {
    margin-top: 10px;
    font-size: 12px;
    color: #00a0e9;
  }

  .faqIndex .bm span {
    display: inline-block;
    margin-right: 15px;
  }

  .faqIndex .i-icon {
    margin-right: 5px;
  }

  .faqIndex .menu {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
  }

  .faqIndex .activeSpan {
    background-color: rgba(0, 160, 233, 0.6);
  }
  .faqIndex .menu:hover {
    background-color: rgba(188, 232, 252, 0.1);
  }
</style>
