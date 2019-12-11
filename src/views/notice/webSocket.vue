<template>
  <div>
    <!--<div class="message">-->
      <!--<div id="message" class="content">-->
        <!--<div v-for="item in messageData" :key="item.index" :class="item.sendNo === curUser.id ? 'mes_before' : 'mes_after'">-->
          <!--<span v-if="item.sendNo === curUser.id" class="mes_right">{{item.message}}</span>-->
          <!--<span v-if="item.sendNo !== curUser.id" class="mes_left">{{item.message}}</span>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="send" @click="inputFocus()">-->
        <!--<textarea id="textarea" class="mes_input" rows="3" v-model="val" @keyup.enter="send"></textarea>-->
        <!--<el-button class="mes_btn" @click="send">发消息</el-button>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'webSocket',
    data() {
      return {
        val: '',
        socket: null,
        messageData: [],
        curUser: {},
        curDept: {},
        notifyInstance: null
      }
    },
    created() {
      // const _this = this
      // document.onkeydown = function(event) {
      //   event = event || window.event
      //   const key = event.keyCode
      //   if (key === 13) {
      //     _this.send()
      //     event.returnValue = false
      //   }
      // }
      window.onbeforeunload = function() {
        // this.closeWeb()
      }
    },
    mounted() {
      // 初始化
      // if (sessionStorage.getItem('userInfo')) {
      //   this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      //   this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      //   this.queryMessage()
      //   this.init()
      // }
    },
    methods: {
      init() {
        // if (typeof (WebSocket) === undefined) {
        //   alert('您的浏览器不支持socket')
        // } else {
        //   // 实例化socket
        //   this.$query('sysconfig', { configKey: 'webSocket_url' }).then(response => {
        //     if (response.data !== undefined && response.data !== null && response.data.length > 0) {
        //       const path = response.data[0].configValue.trim() + this.curUser.id
        //       this.socket = new WebSocket(path)
        //       // 监听socket连接
        //       this.socket.onopen = this.open
        //       // 监听socket错误信息
        //       this.socket.onerror = this.error
        //       // 监听socket消息
        //       this.socket.onmessage = this.getMessage
        //       // 监听socket关闭
        //       this.socket.onclose = this.close
        //     } else {
        //       console.info('未获取到SYS_CONFIG表[config_key=\'webSocket_url\']的配置')
        //     }
        //   })
        // }
      },
      open() {
        console.log('socket连接成功')
      },
      error() {
        console.log('连接错误')
      },
      getMessage(msg) {
        // console.info(msg)
        const data = JSON.parse(msg.data)
        // const data = JSON.parse('{"category":1,"acceptId":"1"}')
        if (data.category === 1 && String(data.acceptId) === String(this.curUser.id)) {
          this.queryMessage()
        }
      },
      queryMessage() {
        this.$query('message/unread/' + this.curUser.id, { deptCode: this.curDept.depCode }).then(response => {
          if (response.data !== undefined && response.data !== null) {
            if (response.data.num > 0) {
              this.systemMessageBox(response.data)
            }
          }
        })
      },
      systemMessageBox(data) {
        const _this = this
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        const h = this.$createElement
        this.notifyInstance = this.$notify({
          title: ' ' + data.num + ' ',
          dangerouslyUseHTMLString: true,
          message: h('p', null, [
            h('span', {
              on: {
                click: function() {
                  _this.notifyInstance.close()
                  _this.$gotoid('/message/list', data.id)
                }
              }
            }, data.title)
          ]),
          showClose: true,
          position: 'bottom-right',
          customClass: 'messageBox_class',
          duration: 0,
          iconClass: 'warning_icon'
        })
      },
      send() {
        const data = {
          message: this.val,
          sendTime: this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          sendNo: this.curUser.id
        }
        this.socket.send(JSON.stringify(data))
        this.val = ''
      },
      close() {
        console.log('socket已经关闭')
      },
      closeWeb() {
        console.info(this.socket)
        // this.socket.close()
      },
      inputFocus() {
        document.getElementById('textarea').focus()
      }
    }
  }
</script>

<style scoped>
  .message {
    margin: 0 auto;
    width: 40%;
    height: 500px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    color: #333;
    font-size: 14px;
  }
  .content{
    height: 390px;
    border-bottom: 1px solid #ccc;
    padding: 5px;
    overflow-y: auto;
  }
  .content::-webkit-scrollbar-thumb {
    background: #f5f5f5;
  }
  .content::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  .content:hover::-webkit-scrollbar-thumb{
    background: rgba(122, 168, 190, 0.3);
  }
  .content:hover::-webkit-scrollbar-track{
    background: rgba(176, 183, 200, 0);
  }
  .content > div {
    width: 100%;
    display: inline-block;
    padding: 5px 0;
  }
  .mes_left{
    float: left;
    background-color: #ffffff;
    padding: 7px 11px;
    word-wrap: break-word;
    word-break: break-all;
    max-width: 60%;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    position: relative;
  }
  .mes_right{
    float: right;
    background-color: #7de00c;
    padding: 7px 11px;
    word-wrap: break-word;
    word-break: break-all;
    max-width: 60%;
    border-radius: 4px;
  }
  .mes_after:before{
    content: '';
    border-width: 6px;
    border-style: solid;
    border-color: transparent #e2e2e2 transparent transparent;
    position: relative;
    top: 10px;
    float: left;
  }
  .mes_left:before{
    content: '';
    border-width: 6px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
    position: absolute;
    top: 9px;
    float: left;
    left: -11px;
  }
  .mes_before:before{
    content: '';
    border-width: 6px;
    border-style: dashed dashed dashed solid;
    border-color: transparent transparent transparent #7de00c;
    position: relative;
    top: 10px;
    float: right;
  }
  .send{
    height: 110px;
  }
  .mes_input{
    border: none;
    background: none;
    width: 100%;
    padding: 5px;
    overflow-y: auto;
    resize: none;
  }
  .mes_btn{
    margin-top: 5px;
    float: right;
    margin-right: 5px;
  }
</style>
