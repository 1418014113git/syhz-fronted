<template>
  <div class="classRoom_audioPlayer">
    <el-row type="flex" justify="center">
      <el-col :span="playType !== '5' ? 24 : 20">
        <el-card>
          <div class="video_div">
            <div id="player" class="audio_player" :style="playType !== '5' ? 'width: 100%' : ''">
              <img :src="srcUrl">
              <!--<audio id="audio" src="http://192.168.42.204:8084/video/02、spring boot返回json数据_高清.mp4" controls="controls"-->
                     <!--@play="onPlayerPlay($event)"-->
                     <!--@pause="onPlayerPause($event)"-->
                     <!--@ended="onPlayerEnded($event)"-->
              <!--&gt;</audio>-->
              <div class="btn-audio paused">
                <div @click="audioClick">
                  <img src="/static/image/online/paused.png">
                  <img src="/static/image/online/player.png">
                </div>
                <div class="slider_progress">
                  <div>{{playTime}}</div>
                  <div><el-slider v-model="value" :format-tooltip="formatTooltip" :show-tooltip="false" @change="sliderChange"></el-slider></div>
                  <div>{{allTime}}</div>
                </div>
                <audio id="mp3Btn" @ended="ended" ref="audio">
                  <source :src="detailData.enPath" type="audio/mpeg" />
                </audio>
              </div>
            </div>
            <div v-if="playType === '5'" class="audio_player_txt">
              <ul>
                <li><span>上传者：</span><span>{{detailData.creationName}}</span></li>
                <li><span>上传时间：</span><span>{{detailData.creationTime}}</span></li>
                <li><span>审核时间：</span><span>{{detailData.auditTime ? detailData.auditTime : '-'}}</span></li>
                <li><span>内容简介：</span><span>{{detailData.describe ? detailData.describe : '暂无'}}</span></li>
              </ul>
            </div>
            <div class="audio_player_clean"></div>
            <div class="audio_player_foot">
              <strong :style="playType !== '5' ? 'width: 75%' : ''" :title="detailData.title">{{detailData.title}}</strong>
              <span :style="playType !== '5' ? 'width: 18%' : ''">热度： {{detailData.viewNumber}} 人</span>
              <span @click="handlerDown"><el-button type="text" title="下载"><svg-icon icon-class="down"></svg-icon></el-button></span>
            </div>
          </div>
          <div v-if="playType === '5'" class="audio_player_fj">
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
  export default {
    props: [
      'playerDetail',
      'playType' // 1 flfg, 2 hybz, 3 gfzd, 4 alzy, 5 pxzl
    ],
    data() {
      return {
        srcUrl: '',
        value: 0,
        playTime: '00:00',
        allTime: '00:00',
        allCount: 0,
        playInterval: null,
        audioMusic: {
          title: '',
          author: '',
          url: 'http://192.168.42.204:8084/video/02、spring boot返回json数据_高清.mp4',
          pic: '',
          lrc: ''
        },
        detailData: this.playerDetail,
        detailId: this.rowId,
        num: 0,
        intervalSplit: 3000, // 毫秒
        timeInterval: null,
        autoUpdateInterval: null,
        learningTime: 10000 // 毫秒
      }
    },
    methods: {
      formatTooltip(val) {
        return val / this.allCount
      },
      sliderChange(value) {
        const audio = document.getElementById('mp3Btn')
        audio.currentTime = value / 100 * audio.duration
        this.playTime = this.buildTime(audio.currentTime)
      },
      src() {
        if (this.detailData.enIcon) {
          this.srcUrl = this.detailData.enIcon
        } else {
          if (this.detailData.type === 1) {
            this.srcUrl = '/static/image/online/sp.jpg'
          }
          if (this.detailData.type === 2) {
            this.srcUrl = '/static/image/online/yp.jpg'
          }
          if (this.detailData.type === 3) {
            this.srcUrl = '/static/image/online/hj.jpg'
          }
          if (this.detailData.type === 4) {
            this.srcUrl = '/static/image/online/zh.jpg'
          }
        }
      },
      setDetail(playerDetail) {
        this.detailData = playerDetail
        this.src()
        const audio = document.getElementById('mp3Btn')
        audio.load()
        this.audioMusic = {
          title: this.detailData.enName,
          author: this.detailData.creationName,
          url: 'http://192.168.42.204:8084/video/02、spring boot返回json数据_高清.mp4', // this.detailData.enPath,
          pic: this.detailData.enIcon,
          lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
        }
      },
      partsClick(id) {
        const para = {
          filters: this.$parent.filters,
          enType: '2',
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
        this.autoUpdateInterval = setInterval(() => {
          const audio = document.getElementById('mp3Btn')
          this.$emit('uploadViewLog', audio.currentTime)
        }, this.learningTime)
      },
      clearTimeInterval() {
        clearInterval(this.timeInterval)
        clearInterval(this.autoUpdateInterval)
      },
      stopRun() {
        const audio = document.getElementById('mp3Btn')
        audio.pause()
      },
      bindSetTimeOut() {
        setTimeout(() => {
          this.addJF('1')
        }, this.learningTime)
      },
      ended() {
        const audio = document.getElementById('mp3Btn')
        if (this.detailData.flag) {
          this.$emit('uploadViewLog', audio.currentTime)
          this.clearTimeInterval()
        }
        document.getElementsByClassName('btn-audio')[0].classList.remove('player')
        document.getElementsByClassName('btn-audio')[0].classList.add('paused')
      },
      audioClick() {
        const audio = document.getElementById('mp3Btn')
        event.stopPropagation()
        if (audio.paused) {
          const time = audio.duration
          this.allCount = parseInt(time)

          this.allTime = this.buildTime(time)
          this.playInterval = setInterval(() => {
            this.playTime = this.buildTime(audio.currentTime)
            if (this.playTime === this.allTime) {
              clearInterval(this.playInterval)
            }
            this.value = (audio.currentTime / audio.duration) * 100
          }, 1000)
          document.getElementsByClassName('btn-audio')[0].classList.remove('paused')
          document.getElementsByClassName('btn-audio')[0].classList.add('player')
          audio.play()
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
          return
        } else {
          document.getElementsByClassName('btn-audio')[0].classList.remove('player')
          document.getElementsByClassName('btn-audio')[0].classList.add('paused')
          audio.pause()
          clearInterval(this.playInterval)
          if (this.detailData.flag) {
            this.$emit('uploadViewLog', audio.currentTime)
            this.clearTimeInterval()
          }
        }
      },
      buildTime(time) {
        const minute = time / 60
        let minutes = parseInt(minute)
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        const second = time % 60
        let seconds = Math.round(second)
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        return minutes + ':' + seconds
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
  .classRoom_audioPlayer .video-js .vjs-big-play-button {
    left: 50%;
    top: 50%;
  }
  .classRoom_audioPlayer audio{
    width:100%;
  }
  .classRoom_audioPlayer .aplayer{
    margin: 0;
    background-color: #000;
    overflow: inherit;
    z-index: 99;
  }
  .classRoom_audioPlayer .aplayer-pic{
    background-image: none !important;
    background-color: transparent !important;
    height: 36px;
    width: 36px;
  }
  .classRoom_audioPlayer .aplayer .aplayer-body .aplayer-info{
    padding-top: 9px;
    height: 36px;
    overflow: inherit;
  }
  .classRoom_audioPlayer .aplayer .aplayer-body .aplayer-info .aplayer-music{
    display: none;
  }
  .classRoom_audioPlayer .aplayer-pic .aplayer-pause{
    width: 26px;
    height: 26px;
    border: 2px solid #fff;
    bottom: 50%;
    right: 50%;
    margin: 0 -15px -15px 0;
  }
  .classRoom_audioPlayer .aplayer-pic .aplayer-pause .aplayer-icon-pause{
    position: absolute;
    top: 3px;
    left: 3px;
    height: 20px;
    width: 20px;
  }
  .classRoom_audioPlayer .aplayer-controller .aplayer-time .aplayer-icon .aplayer-fill{
    fill: #fff;
  }
  .classRoom_audioPlayer .aplayer-controller .aplayer-time .aplayer-icon:hover{
    opacity: 0.6;
  }
  .classRoom_audioPlayer .aplayer-controller .aplayer-time .aplayer-icon:hover .aplayer-fill{
    fill: #00a0e9;
  }
  .classRoom_audioPlayer .aplayer-bar-wrap .aplayer-bar .aplayer-played{
    background-color: #00a0e9!important;
  }
  .classRoom_audioPlayer .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb{
    border-color: #00a0e9!important;
  }
  .classRoom_audioPlayer .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb:hover{
    border-color: #00a0e9!important;
    background-color: #00a0e9!important;
  }
  .classRoom_audioPlayer .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb .aplayer-loading-icon{
    background-color: #00a0e9!important;
  }
  .classRoom_audioPlayer .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar .aplayer-volume{
    background-color: #00a0e9!important;
  }

  .classRoom_audioPlayer .video_div{
    /*border: 1px solid #00A0E9;*/
    /*background-color: rgba(0, 63, 94, 0.6);*/
    background-image: linear-gradient(to bottom , #272929, #615f5c);
  }
  .classRoom_audioPlayer .video_div img{
    width: 100%;
    height: 415px;
  }
  .classRoom_audioPlayer .audio_player {
    width: 60%;
    float: left;
    /*border-right: 1px solid #00A0E9;*/
    position: relative;
  }
  .classRoom_audioPlayer .audio_player_txt {
    width: 30%;
    float: left;
    padding: 20px 10px 10px 20px;
  }
  .classRoom_audioPlayer .audio_player_txt ul li{
    padding: 10px 0;
  }
  .classRoom_audioPlayer .audio_player_txt ul li span{
    display: inline-block;
    width: 40%;
    text-align: right;
  }
  .classRoom_audioPlayer .audio_player_txt ul li span:last-child{
    text-align: left;
    width: 60%;
  }
  .classRoom_audioPlayer .audio_player_clean{
    clear: both;
  }
  .classRoom_audioPlayer .audio_player_foot{
    padding: 7px 0 7px 20px;
    /*background-color: rgba(0, 0, 0, 0.6);*/
    background-image: linear-gradient(to bottom , #555451, #1b1c1c);
  }
  .classRoom_audioPlayer .audio_player_foot strong{
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
  .classRoom_audioPlayer .audio_player_foot > span{
    width: 10%;
    display: inline-block;
    font-size: 14px;
    position: relative;
    top: -5px;
  }
  .classRoom_audioPlayer .audio_player_foot > span:last-child{
    width: 5%;
  }
  .classRoom_audioPlayer .audio_player_foot .el-button.el-button--text.el-button--small{
    color: #fff;
    border-radius: 50%;
    position: relative;
    top: 5px;
  }
  .classRoom_audioPlayer .audio_player_foot .el-button.el-button--text.el-button--small:hover{
    color: #00A0E9;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .classRoom_audioPlayer .audio_player_foot svg{
    width: 22px;
    height: 22px;
    position: relative;
    left:  1px;
    top: -1px;
  }
  .classRoom_audioPlayer .audio_player_fj {
    width: 100%;
    padding: 10px 0 7px 0;
  }
  .classRoom_audioPlayer .audio_player_fj ul li{
    float: left;
    background-color: #005178;
    padding: 4px 15px;
    border: 1px solid #00A0E9;
    border-radius: 4px;
    margin-right: 15px;
    font-size: 14px;
  }
  .classRoom_audioPlayer .audio_player_fj ul li.active{
    background-color: #0077af;
  }
  .classRoom_audioPlayer .audio_player_fj ul li:hover{
    background-color: #0077af;
    cursor: pointer;
  }
  .btn-audio{
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-size: cover;
    padding-left: 5px;
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 369px;
  }
  .btn-audio.paused > div > img:nth-child(1){
    display: none;
  }
  .btn-audio.player > div > img:nth-child(2){
    display: none;
  }
  .classRoom_audioPlayer .video_div .btn-audio > div > img{
    width: 40px;
    height: 40px;
    padding: 10px;
  }
  .classRoom_audioPlayer .video_div .btn-audio.paused > div > img{
    padding-left: 14px;
  }
  .classRoom_audioPlayer .video_div .btn-audio > div > img:hover{
    cursor: pointer;
    border-radius: 50%;
    background-color: rgba(240, 240, 240, 0.4);
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .classRoom_audioPlayer .slider_progress {
    width: 85%;
    position: absolute;
    top: 5px;
    left: 50px;
  }
  .classRoom_audioPlayer .slider_progress > div{
    display: inline-block;
    position: absolute;
  }
  .classRoom_audioPlayer .slider_progress > div:nth-child(1){
    top: -3px;
  }
  .classRoom_audioPlayer .slider_progress > div:nth-child(2){
    width: 87%;
    left: 55px;
  }
  .classRoom_audioPlayer .slider_progress > div:nth-child(3){
    right: -30px;
    top: -3px;
  }
  .classRoom_audioPlayer .el-slider__bar{
    background-color: #074f71;
  }
  .classRoom_audioPlayer .el-slider__button{
    border-color: #074f71;
  }
</style>
