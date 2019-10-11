<template>
  <div class="TopMessageBox">
    <div class="TopMessage marquee-outer-wrapper">
      <div class="marquee-inner-wrapper">
        <span v-if="marqueeText.length > 0"
              class="first-marquee"
              v-html="marqueeText"></span>
      </div>
    </div>
    <div class="gndhTit">功能导航</div>
    <!-- <div class="search">
      <el-form :inline="true"
               :model="filters"
               size="mini"
               @submit.native.prevent>
        <el-row type="flex"
                justify="center">
          <el-form-item class="word">
            <el-input placeholder="输入关键字搜索"
                      v-model.trim="filters.word"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="small"
                       v-on:click="searchs()">搜应用</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div> -->
  </div>

</template>

<script>
import {
  getInegLastDay
} from '@/api/investigation'
import {
  getLInegLastDay
} from '@/api/assistCase'
export default {
  name: 'TopMessage',
  data() {
    return {
      marqueeText: '',
      curDept: {},
      filters: {
        word: ''
      }
    }
  },
  methods: {
    inegLastDay() {
      getInegLastDay({
        deptId: this.curDept.id
      }).then((res) => {
        this.marqueeText = ''
        if (res.code === '000000' && res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            this.marqueeText += '<a href="/#/caseManage/investigation/detail/' + item.id + '">全国性协查：【' + item.assist_title + '】将于 ' + this.$parseTime(item.end_date, '{y}年{m}月{d}日') + ' 即将到期，请及时处理！&nbsp;&nbsp;&nbsp;&nbsp;</a>'
          })
        }
        getLInegLastDay({
          deptId: this.curDept.id
        }).then((res) => {
          if (res.code === '000000' && res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              this.marqueeText += '<a href="/#/caseAssist/detail/' + item.id + '">案件协查：【' + item.AJMC + '】将于 ' + this.$parseTime(item.end_time, '{y}年{m}月{d}日') + ' 即将到期，请及时处理！&nbsp;&nbsp;&nbsp;&nbsp;</a>'
            })
          }
        })
        this.$query('sysnoticeintime', {}).then(response => {
          if (response.data.length > 0) {
            this.sysnotice = response.data
            response.data.forEach(item => {
              this.marqueeText +=
                "<a href='/#/sysnotice/SysNoticeDetail/" +
                item.id +
                "?fromindex=true'>" +
                '【系统公告】' +
                item.title +
                '</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            })
          }
        })
      })
    },
    searchs() {
      this.$router.push({ path: '/oneclickQuery/list/' + this.filters.word })
    }

  },
  mounted() {
    this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
    console.info(sessionStorage.getItem('depToken'))
    this.inegLastDay()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.TopMessageBox {
  display: flex;
  margin-bottom: 3px;
  position: relative;
  top: 2px;
}
.TopMessage {
  width: 70.6%;
  height: 35px;
  margin-right: 3px;
}
.TopMessage .marquee-outer-wrapper {
  overflow: hidden;
  width: 100%;
}

.TopMessage .marquee-inner-wrapper {
  width: 100%;
  height: 35px;
  font-size: 14px;
  line-height: 35px;
  margin: 0 auto;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.TopMessage .marquee-inner-wrapper span {
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
}

.TopMessage .first-marquee {
  -webkit-animation: 40s first-marquee linear infinite normal;
  animation: 40s first-marquee linear infinite normal;
  padding-right: 100%;
  cursor: pointer;
  color: #eab247;
}

.first-marquee:hover {
  color: #3bc0fc !important;
  animation-play-state: paused;
}

@keyframes first-marquee {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    display: none;
  }
}
.gndhTit {
  height: 100%;
  line-height: 35px;
  font-size: 16px;
  color: #bce8fc;
  text-shadow: 0 0 2px #fff;
  padding-left: 13px;
  position: relative;
}
.gndhTit::before {
  display: inline-block;
  content: "";
  width: 7px;
  height: 20px;
  background: #00a0e9;
  position: absolute;
  left: 0;
  top: 8px;
}
.search {
  float: right;
  margin-left: 5%;
  widows: 100px;
}

@media only screen and (max-width: 1367px) {
  .TopMessage {
    width: 70%;
  }
  .gndhTit {
    font-size: 15px;
  }
}
</style>
