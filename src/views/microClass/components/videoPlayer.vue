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
                <li><span>内容简介：</span><span>{{detailData.describe ? detailData.describe : '暂无'}}</span></li>
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
              <li v-for="item in detailData.courseList" :key="item.index" :class="item.id === detailId ? 'active' : ''" @click="partsClick(i)">第{{item.en_order}}节</li>
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
        detailId: this.rowId,
        num: 0,
        detailData: this.playerDetail,
        intervalSplit: 3000, // 毫秒
        timeInterval: null,
        learningTime: 10000 // 毫秒
      }
    },
    methods: {
      option() {
        this.$refs.videoPlayer.player.play() // 播放
        this.$refs.videoPlayer.player.pause() // 暂停
        this.$refs.videoPlayer.player.src(this.playerOptions.sources[0].src) // 重置进度条
      },
      // listen event
      onPlayerPlay(player) {
        if (this.detailData.flag) {
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
      },
      onPlayerPause(player) {
        if (this.detailData.flag) {
          this.$emit('uploadViewLog', player.currentTime())
        }
      },
      onPlayerEnded(player) {
        if (this.detailData.flag) {
          this.$emit('uploadViewLog', player.currentTime())
          this.clearTimeInterval()
        }
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
        this.detailData = playerDetail
        this.playerOptions.poster = this.detailData.enIcon
        this.playerOptions.sources[0].src = this.detailData.enPath
      },
      partsClick(id) {
        const para = {
          filters: this.$parent.filters,
          enType: '1',
          jumpType: 'online',
          id: id
        }
        this.$gotoid('/micro/videoPlayer', JSON.stringify(para))
      },
      handlerDown() {
        this.$download_http(this.detailData.enPathOld, { fileName: this.detailData.enName + this.detailData.enClass })
        if (this.detailData.flag) {
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
            this.clearTimeInterval()
          }
        })
      },
      bindSetInterval() {
        this.timeInterval = setInterval(() => {
          this.addJF('4')
        }, this.intervalSplit)
      },
      clearTimeInterval() {
        clearInterval(this.timeInterval)
      },
      bindSetTimeOut() {
        setTimeout(() => {
          this.addJF('1')
        }, this.learningTime)
      },
      initSplit() {
        const config = JSON.parse(sessionStorage.getItem('config'))
        const currentTypeConfig = config['ruleType4']
        this.intervalSplit = currentTypeConfig.ruleTime * 1000
        const currentTypeConfig1 = config['ruleType1']
        this.learningTime = currentTypeConfig1.ruleTime * 1000
      }
    },
    watch: {
      'playerDetail': function(playerDetail) {
        this.setDetail(playerDetail)
      }
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
    width: 30%;
    float: left;
    padding: 20px 10px 10px 20px;
  }
  .classRoom_videoPlayer .video_player_txt ul li{
    padding: 10px 0;
  }
  .classRoom_videoPlayer .video_player_txt ul li span{
    display: inline-block;
    width: 40%;
    text-align: right;
  }
  .classRoom_videoPlayer .video_player_txt ul li span:last-child{
    text-align: left;
    width: 60%;
  }
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
</style>
