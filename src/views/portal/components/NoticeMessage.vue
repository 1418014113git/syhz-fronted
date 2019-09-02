<template>
  <div class="NoticeMessageBox">
    <div class="NoticeMessage marquee-outer-wrapper">
      <div class="marquee-inner-wrapper">
        <span v-if="marqueeText.length > 0" class="first-marquee" v-html="marqueeText"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeMessage',
  data() {
    return {
      sysnotice: [],
      marqueeText: ''
    }
  },
  methods: {
    getSysNotice() {
      this.$query('sysnoticeintime', {}).then(response => {
        if (response.data.length > 0) {
          this.sysnotice = response.data
          response.data.forEach(item => {
            this.marqueeText +=
              "<a href='/#/sysnotice/SysNoticeDetail/" +
              item.id +
              "'>" +
              '【系统公告】' +
              item.title +
              '</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          })
        }
      })
    },
    gotoNoticeDetail(id) {
      this.$gotoid('/sysnotice/SysNoticeDetail', id)
    }
  },
  mounted() {
    this.getSysNotice()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.NoticeMessageBox {
  display: flex;
  margin-bottom: 3px;
  position: relative;
  top: 2px;
}
.NoticeMessage {
  width: 70.6%;
  height: 35px;
  margin-right: 3px;
}
.NoticeMessage .marquee-outer-wrapper {
  overflow: hidden;
  width: 100%;
}

.NoticeMessage .marquee-inner-wrapper {
  width: 100%;
  height: 35px;
  font-size: 14px;
  line-height: 35px;
  margin: 0 auto;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.NoticeMessage .marquee-inner-wrapper span {
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
}

.NoticeMessage .first-marquee {
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
@media only screen and (max-width: 1367px) {
  .TopMessage {
    width: 70%;
  }
  .gndhTit {
    font-size: 15px;
  }
}
</style>
