<template>
  <div>
    <button @click="send('test')">发消息</button>
  </div>
</template>

<script>
  export default {
    name: 'webSocket',
    data() {
      return {
        path: 'ws://192.168.0.200:8005/qrCodePage/ID=1/refreshTime=5',
        socket: null
      }
    },
    mounted() {
      // 初始化
      this.init()
    },
    methods: {
      init() {
        if (typeof (WebSocket) === undefined) {
          alert('您的浏览器不支持socket')
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path)
          // 监听socket连接
          this.socket.onopen = this.open
          // 监听socket错误信息
          this.socket.onerror = this.error
          // 监听socket消息
          this.socket.onmessage = this.getMessage
        }
      },
      open() {
        console.log('socket连接成功')
      },
      error() {
        console.log('连接错误')
      },
      getMessage(msg) {
        console.log(msg.data)
      },
      send(params) {
        this.socket.send(params)
      },
      close() {
        console.log('socket已经关闭')
      }
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close
    }
  }
</script>

<style scoped>

</style>
