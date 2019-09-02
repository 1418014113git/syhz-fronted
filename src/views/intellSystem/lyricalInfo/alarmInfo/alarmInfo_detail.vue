<template>
  <el-row class="inspect_apply" type="flex" justify="center">
    <el-col :span="20">
      <el-card>
        <div slot="header" class="clearfix">
          <span>舆情警情详情</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="toList">返回</el-button> -->
          <img src="@/assets/icon/back.png"  class="goBack" @click="goback()">   <!--返回-->
        </div>
        <el-row class="line">
          <el-col :span="3" class="title">倾向性：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.tendency}}</el-col>
          <el-col :span="3" class="title">专题名称：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.topicName}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">标题：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.title}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">来源：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.source}}</el-col>
          <el-col :span="3" class="title">频道：</el-col>
          <el-col :span="3" class="ft_color_999">{{detail.channel}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">要闻链接地址：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.linkAddress}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">浏览数：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.browseNumber}}</el-col>
          <el-col :span="3" class="title">回复数：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.answerNumber}}</el-col>
          <el-col :span="3" class="title">转载数：</el-col>
          <el-col :span="3" class="ft_color_999" v-html="detail.reprintNumber"></el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">关键词：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.keyword}}</el-col>
          <el-col :span="3" class="title">媒体类别：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.type}}</el-col>
          <el-col :span="3" class="title">作者：</el-col>
          <el-col :span="3" class="ft_color_999" v-html="detail.author"></el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">发布时间：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.releaseTime}}</el-col>
          <el-col :span="3" class="title">抓取时间：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.grabTime}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">摘要字数：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.summaryNumber}} 天</el-col>
          <el-col :span="3" class="title">文字字数：</el-col>
          <el-col :span="6" class="ft_color_999">{{detail.wordNumber}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">新闻摘要：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.summary}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="3" class="title">内容：</el-col>
          <el-col :span="20" class="ft_color_999">{{detail.content}}</el-col>
        </el-row>
        <el-row style="padding: 50px;"></el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'edit',
    data() {
      return {
        detail: {
          // tendency: '中性',
          // topicName: '地域信息',
          // title: '今朝煤矿沉陷区明日旅游“花果山”',
          // source: '趣头条[APP]',
          // channel: '',
          // linkAddress: 'http://html2.qktoutiao.com/detail/2019/06/28/190388222.html',
          // browseNumber: '0',
          // answerNumber: '0',
          // reprintNumber: '38',
          // keyword: '伊金霍洛旗',
          // type: 'APP',
          // author: '正北方网',
          // releaseTime: '2019-06-28 09:42:31',
          // grabTime: '2019-06-28 09:42:48',
          // summaryNumber: '149',
          // summary: '近日，记者来到伊金霍洛旗乌兰木伦镇，只见山坡上百草返青，沟渠里杨柳吐翠，到处是绿意盎然的景象。在生机勃然的大地上挥锹植树的安子龙，时不时深情地眺望远方，远方是绵延不断的山峁，纵横相接的沟壑。而这些连绵不断的山峁沟壑曾是他的家乡，此刻的他心潮澎湃、思绪万千。安子龙脚下的这片土地叫明安木独，是伊金霍洛旗',
          // wordNumber: '1130'
        },
        deptList: [],
        uploadImgs: [],
        results: [],
        curDept: {}
      }
    },
    methods: {
      goback() {
        this.$router.push({ path: '/lyricalInfo/alarmInfo/' })
      },
      init() {
        console.log(this.$route.query.row)
        this.detail = this.$route.query.row
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped>
  .inspect_apply h3 {
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }

  .inspect_apply .input_w {
    width: 40%;
  }

  .inspect_apply .title {
    text-align: right;
    color: #fff;
  }

  .inspect_apply .line {
    padding: 15px 0;
    border-bottom: 1px dashed #d9d9d9;
  }
</style>
