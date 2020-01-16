<template>
  <section class="online_classroom_player" :style="{height: tableHeight}">
    <filter-common v-if="auditView" ref="filterCommon" :isMore="false" :postfix="postfix" @changeList="changeList" :uploadFlag="false"></filter-common>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <img src="@/assets/icon/back.png" class="goBack" @click="callback">
      </el-col>
    </el-row>
    <div class="file_data">
      <div>
        <video-player ref="videoPlayer" :playType="'5'" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></video-player>
      </div>
    </div>
  </section>
</template>

<script>
  import filterCommon from '../microClass/components/filterCommon'
  import videoPlayer from '../microClass/components/videoPlayer'
  export default {
    name: 'player',
    components: {
      filterCommon,
      videoPlayer
    },
    data() {
      return {
        tableHeight: null,
        postfix: '',
        enType: '',
        filters: {},
        source: '',
        active: '',
        rowId: '',
        viewId: '',
        auditView: true,
        playerDetail: {}
      }
    },
    methods: {
      callback() {
        this.$router.back(-1)
      },
      changeList() {
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.clearTimeInterval()
        }
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.clearTimeInterval()
        }
        if (this.$refs.documentPlayer) {
          this.$refs.documentPlayer.clearTimeInterval()
        }
      },
      viewLog(type) {
        let para = {
          courseId: this.rowId,
          stopTime: '',
          remark: '',
          type: type,
          ip: sessionStorage.getItem('currentIp')
        }
        para = this.$setCurrentUser(para)
        this.$save('traincourselog', para).then(response => {
          if (type === '0') {
            this.viewId = response.data
          }
        })
      },
      uploadViewLog(stopTime) {
        let para = {
          id: this.viewId,
          stopTime: stopTime
        }
        para = this.$setCurrentUser(para)
        para.lastId = para.creationId
        para.lastName = para.creationName
        this.$update('traincourselog/' + this.viewId, para).then(response => {
          console.info('更新停留时间')
        })
      },
      detail() {
        this.$query('traincourselist/' + this.rowId).then(response => {
          this.playerDetail = response.data
          this.playerDetail.flag = (this.source !== 'trainMaterial')
          if (this.enType === '1') {
            this.$refs.videoPlayer.setDetail(this.playerDetail)
          }
          if (this.enType === '2') {
            this.$refs.audioPlayer.setDetail(this.playerDetail)
          }
          if (this.enType === '0') {
            this.$refs.documentPlayer.setDetail(this.playerDetail)
          }
        })
      }
    },
    mounted() {
      const param = sessionStorage.getItem(this.$route.path)
      if (param !== undefined && param !== null && param !== '') {
        const filters = JSON.parse(param)
        this.rowId = filters.id
        this.postfix = '视频'
        this.detail()
      }
      this.tableHeight = document.documentElement.clientHeight - 125 + 'px'
    }
  }
</script>

<style>
  .online_classroom_player{
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .online_classroom_player::-webkit-scrollbar {
    width: 0px;
    height: 1px;
  }
</style>
