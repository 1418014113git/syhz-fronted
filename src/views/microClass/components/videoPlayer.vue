<template>
  <div class="classRoom_videoPlayer">
    <el-row type="flex" justify="center">
      <el-col :span="playType !== '5' ? 24 : 20">
        <el-card>
          <div class="video_div">
            <div id="player" class="video_player" :style="playType !== '5' ? 'width: 100%' : ''">
              <videoPlayer class="video-player vjs-custom-skin"
                           ref="videoPlayer"
                           :playsinline="false"
                           :options="playerOptions"
                           @play="onPlayerPlay($event)"
                           @pause="onPlayerPause($event)"
                           @ended="onPlayerEnded($event)">
                           <!--@loadeddata="onPlayerLoadeddata($event)"-->
                           <!--@waiting="onPlayerWaiting($event)"-->
                           <!--@playing="onPlayerPlaying($event)"-->
                           <!--@timeupdate="onPlayerTimeupdate($event)"-->
                           <!--@canplay="onPlayerCanplay($event)"-->
                           <!--@canplaythrough="onPlayerCanplaythrough($event)"-->
                           <!--@ready="playerReadied"-->
                           <!--@statechanged="playerStateChanged($event)"-->
              <!--&gt;-->
              </videoPlayer>
            </div>
            <div v-if="playType === '5'" class="video_player_txt">
              <ul>
                <li><span>上传者：</span><span>{{detailData.creationName}}</span></li>
                <li><span>上传时间：</span><span>{{detailData.creationTime}}</span></li>
                <li><span>审核时间：</span><span>{{detailData.auditTime ? detailData.auditTime : '-'}}</span></li>
                <li class="con"><span>内容简介：</span>
                  <el-tooltip v-if="detailData.describe" effect="light" popper-class="con_tooltip" :content="detailData.describe" placement="top">
                    <span>{{detailData.describe ? detailData.describe : '暂无'}}</span>
                  </el-tooltip>
                  <span v-else>暂无</span>
                </li>
              </ul>
            </div>
            <div class="video_player_clean"></div>
            <div class="video_player_foot">
              <strong :style="playType !== '5' ? 'width: 75%' : ''" :title="detailData.title">{{detailData.title}}</strong>
              <span :style="playType !== '5' ? 'width: 18%' : ''" >热度： {{detailData.viewNumber}} 人</span>
              <span @click="handlerDown"><el-button type="text" title="下载"><svg-icon icon-class="down"></svg-icon></el-button></span>
            </div>
          </div>
          <div v-if="playType === '5'" class="video_player_fj">
            <ul>
              <li v-for="item in detailData.courseList" :key="item.index" :class="item.id === detailId ? 'active' : ''" @click="partsClick(item.id)">第{{item.en_order}}节</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  export default {
    props: [
      'playerDetail',
      'playType' // 1 flfg, 2 hybz, 3 gfzd, 4 alzy, 5 pxzl
    ],
    components: {
      videoPlayer
    },
    data() {
      return {
        notTake: false,
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: '',
            src: '' // url地址
          }],
          poster: '', // 你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        },
        detailId: this.$parent.rowId,
        num: 0,
        waitTime: 0,
        waitInterval: null,
        detailData: this.playerDetail,
        intervalSplit: 3000, // 毫秒
        timeInterval: null,
        autoUpdateInterval: null,
        learningTime: 10000 // 毫秒
      }
    },
    methods: {
      option() {
        this.$refs.videoPlayer.player.play() // 播放
        this.$refs.videoPlayer.player.pause() // 暂停
        this.$refs.videoPlayer.player.src(this.playerOptions.sources[0].src) // 重置进度条
      },
      stopRun() {
        this.$refs.videoPlayer.player.pause()
      },
      // listen event
      onPlayerPlay(player) {
        if (this.detailData.flag && this.notTake) {
          if (this.num === 0) {
            if (this.playType === '5') {
              this.$emit('viewLog', '0')
            } else {
              this.$emit('viewLog', '1', '0')
            }
            this.num += 1
          }
          this.bindSetInterval()
          this.bindSetTimeOut()
        }
        this.bindWaitInterval()
      },
      onPlayerPause(player) {
        if (this.detailData.flag && this.notTake) {
          this.uploadViewLog()
        }
        this.clearTimeInterval()
      },
      onPlayerEnded(player) {
        if (this.detailData.flag && this.notTake) {
          this.uploadViewLog()
        }
        this.clearTimeInterval()
      },
      onPlayerLoadeddata(player) {
        console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        // 获取当前播放的时长
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        console.log('player Canplaythrough!', player)
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        // seek to 10s
        console.log('example player 1 readied', player)
        player.currentTime(10)
        console.log('example 01: the player is readied', player)
      },
      setDetail(playerDetail) {
        const data = JSON.parse(sessionStorage.getItem('depToken'))
        if (data !== undefined && data !== null && data.length > 0) {
          this.notTake = true
        } else {
          this.notTake = false
        }
        this.detailData = playerDetail
        this.playerOptions.poster = this.src()
        this.playerOptions.sources[0].src = this.detailData.enPath
      },
      src() {
        if (this.detailData.enIcon) {
          return this.detailData.enIcon
        } else {
          if (this.detailData.type === 1) {
            return '/static/image/online/sp.jpg'
          }
          if (this.detailData.type === 2) {
            return '/static/image/online/yp.jpg'
          }
          if (this.detailData.type === 3) {
            return '/static/image/online/hj.jpg'
          }
          if (this.detailData.type === 4) {
            return '/static/image/online/zh.jpg'
          }
        }
      },
      partsClick(id) {
        const para = {
          filters: this.$parent.filters,
          enType: this.$parent.enType,
          jumpType: this.$parent.source,
          id: id
        }
        if (this.$parent.source === 'trainMaterial') {
          para.auditView = this.$parent.auditView
          para.active = this.$parent.active
        }
        sessionStorage.setItem(this.$route.path, JSON.stringify(para))
        this.$router.go(0)
      },
      handlerDown() {
        this.$download_http(this.detailData.enPathOld, { fileName: this.detailData.enName + this.detailData.enClass })
        if (this.detailData.flag && this.notTake) {
          this.addJF('3')
          this.$emit('viewLog', '1', '1')
        }
      },
      addJF(type) {
        // 0登陆 1学习资料 2资料上传 3资料下载 4学习时长
        const config = JSON.parse(sessionStorage.getItem('config'))
        const currentTypeConfig = config['ruleType' + type]
        const param = this.$setCurrentUser({})
        const para = {
          belongSys: this.playType === '5' ? '1' : '0', // 0知识库 1网上培训
          belongMode: this.playType === '5' ? '1' : this.playType,
          belongType: this.detailData.type,
          tableId: this.detailData.id,
          branch: currentTypeConfig.oneNumber,
          maxBranch: currentTypeConfig.maxNumber,
          fractionType: type,
          fractionReckon: '0',
          fractionTime: this.$parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
          fractionUserId: param.creationId,
          fractionUserName: param.creationName,
          fractionAreaCode: param.areaCode,
          fractionDeptCode: param.belongDepCode,
          fractionDeptName: param.belongDepName,
          creationId: param.creationId,
          creationName: param.creationName,
          remark: '获得积分'
        }
        this.$save('trainFraction', para).then(response => {
          if (type === '4' && response.data === '999') {
            this.clearJFInterval()
          }
        })
      },
      uploadViewLog() {
        this.$emit('uploadViewLog', this.waitTime)
      },
      bindSetInterval() {
        if (this.waitTime * 1000 < this.intervalSplit) {
          this.intervalSplit = this.intervalSplit - this.waitTime * 1000
        } else if (this.waitTime * 1000 > this.intervalSplit) {
          this.intervalSplit = this.waitTime * 1000 - this.intervalSplit
        }
        this.timeInterval = setInterval(() => {
          this.addJF('4')
          this.initSplit()
        }, this.intervalSplit)
        this.autoUpdateInterval = setInterval(() => {
          this.uploadViewLog()
        }, this.learningTime)
      },
      bindWaitInterval() {
        this.waitInterval = setInterval(() => {
          this.waitTime += 1
        }, 1000)
      },
      clearJFInterval() {
        clearInterval(this.timeInterval)
      },
      clearTimeInterval() {
        clearInterval(this.timeInterval)
        clearInterval(this.autoUpdateInterval)
        clearInterval(this.waitInterval)
      },
      bindSetTimeOut() {
        setTimeout(() => {
          this.addJF('1')
        }, this.learningTime)
      },
      initSplit() {
        let config = JSON.parse(sessionStorage.getItem('config'))
        if (config === null || config === undefined) {
          this.$store.dispatch('GetConfig').then(() => {
            config = JSON.parse(sessionStorage.getItem('config'))
            const currentTypeConfig = config['ruleType4']
            this.intervalSplit = currentTypeConfig.ruleTime * 1000
            const currentTypeConfig1 = config['ruleType1']
            this.learningTime = currentTypeConfig1.ruleTime * 1000
          })
        } else {
          const currentTypeConfig = config['ruleType4']
          this.intervalSplit = currentTypeConfig.ruleTime * 1000
          const currentTypeConfig1 = config['ruleType1']
          this.learningTime = currentTypeConfig1.ruleTime * 1000
        }
      }
    },
    watch: {
      'playerDetail': function(playerDetail) {
        this.setDetail(playerDetail)
      }
    },
    created() {
      this.$navigation.on('forward', (to, from) => {
        this.clearTimeInterval()
      })
      this.$navigation.on('back', (to, from) => {
        this.clearTimeInterval()
      })
    },
    mounted() {
      this.initSplit()
      this.setDetail(this.playerDetail)
    }
  }
</script>

<style>
  .classRoom_videoPlayer .video-js .vjs-big-play-button {
    left: 44%;
    top: 44%;
  }
  .classRoom_videoPlayer .video_div{
    /*border: 1px solid #00A0E9;*/
    /*background-color: rgba(0, 63, 94, 0.6);*/
    background-image: linear-gradient(to bottom , #272929, #615f5c);
  }
  .classRoom_videoPlayer .video_player {
    width: 60%;
    float: left;
    /*border-right: 1px solid #00A0E9;*/
  }
  .classRoom_videoPlayer .video_player_txt {
    width: 40%;
    float: left;
    padding: 20px 10px 10px 20px;
  }
  .classRoom_videoPlayer .video_player_txt ul li{
    padding: 10px 0;
  }
  .classRoom_videoPlayer .video_player_txt ul li span{
    display: inline-block;
    width: 20%;
    text-align: right;
  }
  .classRoom_videoPlayer .video_player_txt ul li span:last-child{
    text-align: left;
    width: 70%;
  }
  .classRoom_videoPlayer .video_player_txt ul li.con{
    padding-bottom: 0;
    position: relative;
  }
  .classRoom_videoPlayer .video_player_txt ul li.con span:first-child{
    display: inline-block;
    height: 100%;
    vertical-align: top;
  }
  .classRoom_videoPlayer .video_player_txt ul li.con span:last-child{
    max-height: 240px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 11;
    display: -webkit-box;
    position: absolute;
    top: 10px;
    left: 20%;
  }
  .con_tooltip{
    width: 30%;
    color: #565656;
    background: #f1f1f1 !important;
  }
  /*.con_tooltip{*/
    /*width: 30%;*/
    /*background: #023a5a !important;*/
    /*color: #89c0de !important;*/
  /*}*/
  /*.el-tooltip__popper.con_tooltip .popper__arrow::after{*/
    /*border-top-color: #023a5a !important;*/
  /*}*/
  .classRoom_videoPlayer .video_player_clean{
    clear: both;
  }
  .classRoom_videoPlayer .video_player_foot{
    padding: 7px 0 7px 20px;
    /*background-color: rgba(0, 0, 0, 0.6);*/
    background-image: linear-gradient(to bottom , #555451, #1b1c1c);
  }
  .classRoom_videoPlayer .video_player_foot strong{
    width: 45%;
    display: inline-block;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    top: 4px;
    padding-right: 20px;
  }
  .classRoom_videoPlayer .video_player_foot > span{
    width: 10%;
    display: inline-block;
    font-size: 14px;
    position: relative;
    top: -5px;
  }
  .classRoom_videoPlayer .video_player_foot > span:last-child{
    width: 5%;
  }
  .classRoom_videoPlayer .video_player_foot .el-button.el-button--text.el-button--small{
    color: #fff;
    border-radius: 50%;
    position: relative;
    top: 5px;
  }
  .classRoom_videoPlayer .video_player_foot .el-button.el-button--text.el-button--small:hover{
    color: #00A0E9;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .classRoom_videoPlayer .video_player_foot svg{
    width: 22px;
    height: 22px;
    position: relative;
    left:  1px;
    top: -1px;
  }
  .classRoom_videoPlayer .video_player_fj {
    width: 100%;
    padding: 10px 0 7px 0;
  }
  .classRoom_videoPlayer .video_player_fj ul li{
    float: left;
    background-color: #005178;
    padding: 4px 15px;
    border: 1px solid #00A0E9;
    border-radius: 4px;
    margin-right: 15px;
    font-size: 14px;
  }
  .classRoom_videoPlayer .video_player_fj ul li.active{
    background-color: #0077af;
  }
  .classRoom_videoPlayer .video_player_fj ul li:hover{
    background-color: #0077af;
    cursor: pointer;
  }
  /*.classRoom_videoPlayer .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:hover,*/
  /*.classRoom_videoPlayer .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:active,*/
  /*.classRoom_videoPlayer .video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active{*/
    /*width: 4em;*/
  /*}*/
  .classRoom_videoPlayer .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:hover .vjs-volume-control.vjs-control.vjs-volume-horizontal{
    z-index: 99;
  }
  .classRoom_videoPlayer .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:hover{
    background: rgba(43, 51, 63, 0.8);
  }
  .classRoom_videoPlayer .vjs-volume-control.vjs-control.vjs-volume-horizontal{
    /*position: absolute!important;*/
    /*bottom: 36px;*/
    /*left: 0;*/
    background: rgba(43, 51, 63, 0.8);
    width: 6em !important;
    padding-right: 10px;
    /*-webkit-transform: rotate(-90deg);!*Safari 4+,Google Chrome 1+ *!*/
    /*-moz-transform: rotate(-90deg);!*Firefox 3.5+*!*/
    /*filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);!*ie*!*/
  }
</style>
