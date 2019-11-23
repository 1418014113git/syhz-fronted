<template>
  <section>
    <div class="box">
      <img src="@/assets/icon/back.png" class="img" @click="goback()">
      <div>
        <div class="title">
          <span class="title-font">{{delHtmlTag(title)}}</span>
        </div>
        <div style="margin-left: 100px;">
          <div  style="margin-bottom: 10px">
            <span style="margin-right: 70px">{{ formatTime(ctime)}}</span>
            <span style="margin-right: 70px">来源：{{ formatSourceType(sourceType)}}</span>
            <span style="margin-right: 70px">作者：{{ author}}</span>
            <span>倾向性：</span>
            <span v-bind:style = "getColor(orientation)">{{ formatOrientation(orientation)}}</span>
          </div>
          <div>
            <span>原文链接：</span>
            <span style="color: #8c939d">{{url}}</span>
          </div>
        </div>
      </div>
      <div style="margin-top: 60px;" v-html="content">
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'list',
    data() {
      return {
        title: '',
        ctime: '',
        sourceType: '',
        author: '',
        orientation: '',
        url: '',
        content: ''
      }
    },
    methods: {
      init() {
        var data = this.$route.query.data
        this.title = data.title
        this.ctime = data.ctime
        this.sourceType = data.sourceType
        this.author = data.author
        this.orientation = data.orientation
        this.url = data.url
        this.content = data.content
      },
      formatTime(str) {
        return this.$parseTime(str, '{y}-{m}-{d} {h}:{i}')
      },
      formatSourceType(str) {
        if (str === 1) {
          str = '网媒'
        } else if (str === 2) {
          str = '论坛'
        } else if (str === 3) {
          str = '博客'
        } else if (str === 4) {
          str = '微博'
        } else if (str === 5) {
          str = '平媒'
        } else if (str === 6) {
          str = '微信'
        } else if (str === 7) {
          str = '视频'
        } else if (str === 9) {
          str = 'APP'
        } else if (str === 10) {
          str = '评论'
        } else if (str === 99) {
          str = '其他'
        }
        return str
      },
      formatOrientation(str) {
        if (str === 1) {
          str = '正面'
        } else if (str === 2) {
          str = '负面'
        } else if (str === 3) {
          str = '中性'
        }
        return str
      },
      // 去掉字符串中的HTML标签
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, '')
      },
      getColor(val) {
        if (val === 1) {
          val = 'color:#2fd5ff'
        } else if (val === 2) {
          val = 'color:#FF0000'
        } else if (val === 3) {
          val = 'color:orange'
        }
        console.log(val)
        return val
      },
      goback() { // 返回
        this.$router.back(-1)
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .img {
    cursor: pointer;
    margin-left: 90%;
    margin-bottom: 20px;
  }
  .box{
    width: 80%;
    margin-left: 10%;
  }
  .title{
    margin-bottom: 20px;
    text-align: center;
  }
  .title-font{
    font-size: 25px;
    font-weight: bolder;
  }
</style>
