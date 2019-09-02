<template>
  <div>
    <el-row>
     <img src="@/assets/icon/back.png"  class="goBack" @click="toList(alzy.source)">   <!--返回-->
    </el-row>
    <div class="alzy_detail">
      <el-row type="flex" justify="center">
        <el-col v-if="!alzy" :span="20">
          <p style="text-align: center;line-height: 100px;">资源不存在</p>
        </el-col>
        <el-col v-else :span="24" v-loading="loading">
          <el-card style="min-height: 500px;padding:20px 50px;">
            <!-- <el-button type="primary" @click="toList(alzy.source)" style="float: right;">返回</el-button> -->
            <h1 class="title">{{alzy.case_num}}：{{alzy.title}}</h1>
            <el-row class="title_note">
              <span>来源：{{getSourceText(alzy.source)}}</span>
              <span>发布时间：{{formatTime(alzy.create_time)}}</span>
              <span>类型：{{getCaseTypeText(alzy.case_type)}}</span>
              <span>地域：{{getAreaText(alzy.case_area)}}</span>
            </el-row>
            <div class="h3Wrap">
              <h3>{{alzy.case_num}}</h3>
              <h3>{{alzy.title}}</h3>
              <h3>({{alzy.summary}})</h3>
              <h3>关键词&emsp;{{alzy.keywords}}</h3>
            </div>
            <div v-html="htmlContent" class="e-p-line ql-editor"></div>
            <el-row class="txt-bottom">
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getCaseGuideDetail
} from '@/api/handingGuide'
import {
  parseTime
} from '@/utils/index'

export default {
  data() {
    return {
      id: '',
      loading: false,
      total: 0,
      page: 1,
      alzy: {},
      htmlContent: ''
    }
  },
  methods: {
    formatTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    },
    getSourceText(type) {
      if (type === '0') {
        return '公安内部'
      } else if (type === '1') {
        return '最高法院'
      } else if (type === '2') {
        return '最高检察院'
      } else if (type === '3') {
        return '其它'
      }
    },
    getCaseTypeText(type) {
      if (type === '0') {
        return '食品'
      } else if (type === '1') {
        return '药品'
      } else if (type === '2') {
        return '环境'
      }
    },
    getAreaText(type) {
      if (type === '0') {
        return '区内'
      } else if (type === '1') {
        return '区外'
      }
    },
    getAlzyDetait() {
      const para = {
        id: this.id
      }
      this.loading = true
      getCaseGuideDetail(para).then((response) => {
        this.loading = false
        this.alzy = response.data
        this.htmlContent = response.data.content
      }).catch(() => {
        this.loading = false
      })
    },
    toList(index) {
      this.$router.push({
        path: '/handlingGuide',
        query: {
          source: index
        }
      })
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.getAlzyDetait()
  }
}
</script>

<style>
.alzy_detail .title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.alzy_detail .txt-bottom {
  text-align: right;
  font-size: 12px;
}

.alzy_detail .txt-bottom span {
  display: inline-block;
  padding: 5px 5px 5px 15px;
}
.alzy_detail .title_note {
  text-align: left;
  line-height: 32px;
  border-bottom: 1px solid #dedede;
}
.alzy_detail .title_note span {
  margin-right: 20px;
}
.h3Wrap {
  margin: 16px auto 10px;
}
.h3Wrap h3 {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
