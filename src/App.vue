<template>
  <div id="app" @mouseover="isOvertime()">
    <navigation>
      <router-view></router-view>
    </navigation>
    <lg-preview></lg-preview>
    <webSocket ref="webSocket"></webSocket>
  </div>
</template>

<script>
  import webSocket from '@/views/notice/webSocket'
  export default {
    name: 'App',
    components: {
      webSocket
    },
    data() {
      return {
        timeOutInterval: null,
        // timeOutTime: 1000 * 20, // 测试 20秒刷新一次
        timeOutTime: 1000 * 60 * 30, // 30分钟刷新一次
        lastOpTime: null,
        notifyInstance: null
      }
    },
    activated() {
    },
    mounted() {
      // const query = this.GetQueryString('timeOut')
      // if (query === 'timeOut') {
      //   this.$alert('由于您长时间未操作，请重新登录', '提示', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       const href = window.location.href
      //       window.location.href = href.split('?')[0]
      //     }
      //   })
      // }
    },
    created() {
      this.$navigation.on('forward', (to, from) => {
        if (to.route.path === '/login') {
          this.clearTimeOutInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.closeWeb()
          }
        }
        if (to.route.path === '/portal' && this.timeOutInterval === null) {
          this.outTimeInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.init()
          }
        }
      })
      this.$navigation.on('back', (to, from) => {
        if (to.route.path === '/login') {
          this.clearTimeOutInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.closeWeb()
          }
        }
      })
      if (sessionStorage.getItem('userInfo')) {
        this.outTimeInterval()
        if (this.$refs.webSocket) {
          this.$refs.webSocket.init()
        }
      }
    },
    methods: {
      GetQueryString(variable) {
        if (window.location.href.indexOf('?') > -1) {
          const query = window.location.href.split('?')[1]
          const vars = query.split('&')
          for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')
            if (pair[0] === variable) {
              return pair[1]
            }
          }
        }
        return ''
      },
      isOvertime() {
        if (this.$route.path !== '/login') {
          const currentTime = new Date()
          // 如果监听鼠标移动的当前时间和上次的时间已经相差大于等于30分钟，则直接操作超时方法，跳转至登录
          if (this.lastOpTime !== null && currentTime.getTime() - this.lastOpTime >= this.timeOutTime) {
            this.jumpMessage()
          } else {
            this.lastOpTime = new Date().getTime()
          }
        }
      },
      outTimeInterval() {
        const _this = this
        this.timeOutInterval = setInterval(function() {
          if (_this.lastOpTime === null) {
            _this.lastOpTime = new Date().getTime()
          } else {
            const currentTime = new Date()
            if (currentTime.getTime() - _this.lastOpTime >= _this.timeOutTime) {
              _this.jumpMessage()
            }
          }
        }, this.timeOutTime)
      },
      jumpMessage() {
        this.clearTimeOutInterval()
        sessionStorage.clear()
        this.$alert('由于您长时间未操作，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            const href = window.location.href
            window.location.href = href.split('?')[0]
          }
        })
        this.$router.push({ path: '/login' })
      },
      clearTimeOutInterval() {
        clearInterval(this.timeOutInterval)
        this.timeOutInterval = null
        this.lastOpTime = null
      }
    }
  }
</script>
<style>
  @import '../src/styles/font.css';
</style>
<style rel="stylesheet/scss" lang="scss">
  .messageBox_class {
    background: url(/static/image/portal_images/message_alert.png) no-repeat center;
    background-size: 100% 100%;
    border: 0;
    width: 400px;
    padding-left: 20px;
  }
  .messageBox_class .el-notification__group.is-with-icon {
    position: relative;
    margin-left: 0;
  }
  .messageBox_class .el-notification__content{
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    padding: 35px 15px;
    width: 372px;
    color: #30d2ff;
    font-size: 18px;
    margin-bottom: 8px;
    text-align: center;
    min-height: 100px;
  }
  .messageBox_class .el-notification__content p > span:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .messageBox_class .el-notification__title{
    color: #30d2ff;
    width: 75%;
    font-weight: normal;
    font-size: 16px;
  }
  .messageBox_class .el-notification__title:before{
    content: "您有";
    color: #fff;
  }
  .messageBox_class .el-notification__title:after{
    content: "条未读消息";
    color: #fff;
  }
  .messageBox_class .el-notification__closeBtn{
    top: 0;
    right: 8px;
  }
  .messageBox_class .el-notification__closeBtn.el-icon-close{
    padding: 3px;
    color: #fff;
    font-size: 14px;
  }
  .messageBox_class .el-notification__closeBtn.el-icon-close:before{
    content: "关闭";
  }
  .messageBox_class .el-notification__closeBtn.el-icon-close:hover{
    color: #30d2ff;
  }
  .messageBox_class .el-notification__icon{
    margin-top: -4px;
  }
  .messageBox_class .warning_icon{
    background: url(/static/image/online/warning.png);
    padding: 12px;
    background-size: 24px 24px;
    display: none;
  }
</style>
