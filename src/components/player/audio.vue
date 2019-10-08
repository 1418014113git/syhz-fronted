<template>
  <div id="player" class="audio_player">
    <img :src="showImg">
    <div class="btn-audio paused" @click="audioClick">
      <img src="/static/image/online/paused.png">
      <img src="/static/image/online/player.png">
      <audio id="mp3Btn">
        <source :src="enPath" type="audio/mpeg" />
      </audio>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'audioPath',
      'viewImg'
    ],
    data() {
      return {
        detailData: {},
        enPath: this.audioPath,
        showImg: this.viewImg
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        if (this.num === 0) {
          this.$emit('viewLog', '0')
          this.num += 1
        }
        console.log('player play!', player)
      },
      onPlayerPause(player) {
        this.$emit('uploadViewLog', player.currentTime())
        console.info(player.target.currentTime)
        console.log('player pause!', player)
      },
      onPlayerEnded(player) {
        this.$emit('uploadViewLog', player.currentTime())
        console.log('player ended!', player)
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
      handlerDown() {
        this.$emit('downLoad', this.detailData.enPath, this.detailData.enName + '.' + this.detailData.enClass)
      },
      audioClick() {
        const audio = document.getElementById('mp3Btn')
        // audio.on('touchend', '.timeline', function(e) {
        //   var x = e.originalEvent.changedTouches[0].clientX - this.offsetLeft
        //   var X = x < 0 ? 0 : x
        //   var W = document.getElementsByClassName('timeline')[0].clientWidth
        //   var place = X > W ? W : X
        //   audio.currentTime = (place / W).toFixed(2) * audio.duration
        //   // (place/W).toFixed(2)*100+"%"
        // })
        event.stopPropagation()
        if (audio.paused) {
          document.getElementsByClassName('btn-audio')[0].classList.remove('paused')
          document.getElementsByClassName('btn-audio')[0].classList.add('player')
          audio.play()
          return
        } else {
          console.info(audio.currentTime)
          document.getElementsByClassName('btn-audio')[0].classList.remove('player')
          document.getElementsByClassName('btn-audio')[0].classList.add('paused')
          audio.pause()
          this.$emit('uploadViewLog', audio.currentTime)
        }
      }
    },
    watch: {
      'audioPath': function(audioPath) {
        this.enPath = audioPath
      },
      'viewImg': function(viewImg) {
        this.showImg = viewImg
      }
    },
    mounted() {
      this.detail()
    }
  }
</script>

<style>
  .audio_player audio{
    width:100%;
  }
  .audio_player .aplayer{
    margin: 0;
    background-color: #000;
    overflow: inherit;
    z-index: 99;
  }
  .audio_player .aplayer-pic{
    background-image: none !important;
    background-color: transparent !important;
    height: 36px;
    width: 36px;
  }
  .audio_player .aplayer .aplayer-body .aplayer-info{
    padding-top: 9px;
    height: 36px;
    overflow: inherit;
  }
  .audio_player .aplayer .aplayer-body .aplayer-info .aplayer-music{
    display: none;
  }
  .audio_player .aplayer-pic .aplayer-pause{
    width: 26px;
    height: 26px;
    border: 2px solid #fff;
    bottom: 50%;
    right: 50%;
    margin: 0 -15px -15px 0;
  }
  .audio_player .aplayer-pic .aplayer-pause .aplayer-icon-pause{
    position: absolute;
    top: 3px;
    left: 3px;
    height: 20px;
    width: 20px;
  }
  .audio_player .aplayer-controller .aplayer-time .aplayer-icon .aplayer-fill{
    fill: #fff;
  }
  .audio_player .aplayer-controller .aplayer-time .aplayer-icon:hover{
    opacity: 0.6;
  }
  .audio_player .aplayer-controller .aplayer-time .aplayer-icon:hover .aplayer-fill{
    fill: #00a0e9;
  }
  .audio_player .aplayer-bar-wrap .aplayer-bar .aplayer-played{
    background-color: #00a0e9!important;
  }
  .audio_player .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb{
    border-color: #00a0e9!important;
  }
  .audio_player .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb:hover{
    border-color: #00a0e9!important;
    background-color: #00a0e9!important;
  }
  .audio_player .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb .aplayer-loading-icon{
    background-color: #00a0e9!important;
  }
  .audio_player .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar .aplayer-volume{
    background-color: #00a0e9!important;
  }

  .classRoom_audioPlayer .video_div{
    /*border: 1px solid #00A0E9;*/
    /*background-color: rgba(0, 63, 94, 0.6);*/
    background-image: linear-gradient(to bottom , #272929, #615f5c);
  }
  .audio_player > img{
    width: 100%;
    height: 415px;
  }
  .audio_player {
    width: 60%;
    float: left;
    /*border-right: 1px solid #00A0E9;*/
    position: relative;
  }
  .audio_player .audio_player_txt {
    width: 30%;
    float: left;
    padding: 20px 10px 10px 20px;
  }
  .audio_player .audio_player_txt ul li{
    padding: 10px 0;
  }
  .audio_player .audio_player_txt ul li span{
    display: inline-block;
    width: 40%;
    text-align: right;
  }
  .audio_player .audio_player_txt ul li span:last-child{
    text-align: left;
    width: 60%;
  }
  .audio_player .audio_player_clean{
    clear: both;
  }
  .audio_player .audio_player_foot{
    padding: 7px 0 7px 20px;
    /*background-color: rgba(0, 0, 0, 0.6);*/
    background-image: linear-gradient(to bottom , #555451, #1b1c1c);
  }
  .audio_player .audio_player_foot strong{
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
  .audio_player .audio_player_foot > span{
    width: 10%;
    display: inline-block;
    font-size: 14px;
    position: relative;
    top: -5px;
  }
  .audio_player .audio_player_foot > span:last-child{
    width: 5%;
  }
  .audio_player .audio_player_foot .el-button.el-button--text.el-button--small{
    color: #fff;
    border-radius: 50%;
    position: relative;
    top: 5px;
  }
  .audio_player .audio_player_foot .el-button.el-button--text.el-button--small:hover{
    color: #00A0E9;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .audio_player .audio_player_foot svg{
    width: 22px;
    height: 22px;
    position: relative;
    left:  1px;
    top: -1px;
  }
  .audio_player .audio_player_fj {
    width: 100%;
    padding: 10px 0 7px 0;
  }
  .audio_player .audio_player_fj ul li{
    float: left;
    background-color: #005178;
    padding: 4px 15px;
    border: 1px solid #00A0E9;
    border-radius: 4px;
    margin-right: 15px;
    font-size: 14px;
  }
  .audio_player .audio_player_fj ul li.active{
    background-color: #0077af;
  }
  .audio_player .audio_player_fj ul li:hover{
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
  .btn-audio.paused > img:nth-child(1){
    display: none;
  }
  .btn-audio.player > img:nth-child(2){
    display: none;
  }
  .audio_player .video_div .btn-audio > img{
    width: 45px;
    height: 45px;
    padding: 10px;
  }
  .audio_player .video_div .btn-audio.paused > img{
    padding-left: 14px;
  }
  .audio_player .video_div .btn-audio > img:hover{
    cursor: pointer;
    border-radius: 50%;
    background-color: rgba(240, 240, 240, 0.4);
  }
</style>
