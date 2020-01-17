<template>
  <div class="box">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png" class="goBack" @click="goback()">
    </el-row>
    <el-row class="caseEdit">
      <div class="body">
        <div style="margin: 50px 0 0 0">
          <div class="title">
            <span class="title-font">{{delHtmlTag(title)}}</span>
          </div>
          <div style="margin-left: 100px;">
            <div style="margin-bottom: 10px">
              <span style="margin-right: 70px">{{ formatTime(ctime)}}</span>
              <span style="margin-right: 70px">来源：{{ formatSourceType(sourceType)}}</span>
              <span style="margin-right: 70px">作者：{{ author}}</span>
              <span>倾向性：</span>
              <span v-bind:style="getColor(orientation)">{{ formatOrientation(orientation)}}</span>
            </div>
            <div>
              <span>原文链接：</span>
              <span style="color: #8c939d">{{url}}</span>
            </div>
          </div>
        </div>
        <div class="content" v-html="content">
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'lyricalDetail',
    data() {
      return {
        title: '',
        ctime: '',
        sourceType: '',
        author: '',
        orientation: '',
        url: '',
        content: '',
        rowId: ''
      }
    },
    methods: {
      // 初始化
      init() {
        this.$query('publicOpinion/getOne', { id: this.rowId }).then((response) => {
          var data = response.data
          this.title = data.title
          this.ctime = data.ctime
          this.sourceType = data.sourceType
          this.author = data.author
          this.orientation = data.orientation
          this.url = data.url
          this.content = data.content
        })
        // var data = this.$route.query.data
        // this.title = data.title
        // this.ctime = data.ctime
        // this.sourceType = data.sourceType
        // this.author = data.author
        // this.orientation = data.orientation
        // this.url = data.url
        // this.content = data.content
      },
      // 格式化发布时间
      formatTime(str) {
        return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12)
      },
      // 格式化媒体类型
      formatSourceType(str) {
        var list = this.$getDicts('mtlx')
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictKey + '' === str + '') {
            return list[i].dictName
          }
        }
      },
      // 格式化倾向性
      formatOrientation(str) {
        var list = this.$getDicts('qxx')
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictKey + '' === str + '') {
            return list[i].dictName
          }
        }
      },
      // 去掉字符串中的HTML标签
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, '')
      },
      // 倾向性获取字体颜色
      getColor(val) {
        if (val === 1) {
          val = 'color:#2fd5ff'
        } else if (val === 2) {
          val = 'color:#FF0000'
        } else if (val === 3) {
          val = 'color:orange'
        }
        return val
      },
      // 返回
      goback() {
        this.$router.back(-1)
      }
    },
    mounted() {
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.id) {
          this.rowId = para.id
          this.init()
        }
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .body {
    padding: 10px 0;
    overflow: auto;
    border: 1px solid rgb(0, 160, 233);
    background: rgba(0, 64, 94, 0.7);
    border-radius: 8px;
  }

  .img {
    cursor: pointer;
    margin-left: 93%;
    margin-bottom: 20px;
  }

  .box {
    padding: 20px 40px;
    display: inline-block;
    width: 100%;
  }

  .title {
    width: 80%;
    margin-left: 10%;
    color: rgb(32, 160, 255);
    margin-bottom: 20px;
    text-align: center;
  }

  .title-font {
    font-size: 25px;
    font-weight: bolder;
  }

  .content {
    margin: 60px 30px 30px 30px
  }
</style>
