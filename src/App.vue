<template>
  <div id="app">
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
        messageInterval: null,
        messageTime: 1000, // 首次进页面，1s请求一次
        lastQueryMessageTime: null,
        index: 1,
        notifyInstance: null
      }
    },
    created() {
      this.$navigation.on('forward', (to, from) => {
        if (to.route.path === '/login') {
          // this.clearMessageInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.closeWeb()
          }
        }
        if (to.route.path === '/portal' && this.messageInterval === null) {
          // this.messageTimeInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.init()
          }
        }
      })
      this.$navigation.on('back', (to, from) => {
        if (to.route.path === '/login') {
          // this.clearMessageInterval()
          if (this.$refs.webSocket) {
            this.$refs.webSocket.closeWeb()
          }
        }
      })
      if (sessionStorage.getItem('userInfo')) {
        // this.messageTimeInterval()
        if (this.$refs.webSocket) {
          this.$refs.webSocket.init()
        }
      }
    },
    methods: {
      messageTimeInterval() {
        const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
        const curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
        const _this = this
        this.messageInterval = setInterval(function() {
          _this.$query('message/unread/' + curUser.id, { time: _this.lastQueryMessageTime, deptCode: curDept.depCode }).then(response => {
            if (response.data !== undefined && response.data !== null) {
              _this.lastQueryMessageTime = response.data.time
              if (response.data.num > 0) {
                _this.systemMessageBox(response.data)
              }
            }
          }).catch(() => {
            _this.clearMessageInterval()
          })
          if (_this.index === 1) {
            _this.index = 10
            _this.clearMessageInterval()
            _this.messageTimeInterval()
          }
        }, this.messageTime * this.index)
      },
      systemMessageBox(data) {
        const _this = this
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        const h = this.$createElement
        this.notifyInstance = this.$notify({
          title: '您有 ' + data.num + ' 条未读消息',
          dangerouslyUseHTMLString: true,
          message: h('p', null, [
            h('span', {
              on: {
                click: function() {
                  _this.notifyInstance.close()
                  _this.$gotoid('/message/list')
                }
              }
            }, data.title)
          ]),
          showClose: true,
          position: 'bottom-right',
          customClass: 'messageBox_class',
          duration: 0,
          iconClass: 'warning_icon'
          // onClick: function() {
          //   this.close()
          //   _this.$gotoid('/message/list')
          // }
        })
      },
      clearMessageInterval() {
        clearInterval(this.messageInterval)
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
