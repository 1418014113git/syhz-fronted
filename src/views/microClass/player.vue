<template>
  <section class="online_classroom_player">
    <filter-common v-if="auditView" ref="filterCommon" :isMore="false" :postfix="postfix" @changeList="changeList" :uploadFlag="false"></filter-common>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <img src="@/assets/icon/back.png" class="goBack" @click="callback">
      </el-col>
    </el-row>
    <div class="file_data" v-if="enType === '1'">
      <div>
        <video-player ref="videoPlayer" :playType="'5'" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></video-player>
      </div>
    </div>
    <div class="file_data" v-if="enType === '2'">
      <div>
        <audio-player ref="audioPlayer" :playType="'5'" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></audio-player>
      </div>
    </div>
    <div class="file_data" v-if="enType === '0'">
      <div>
        <document-player ref="documentPlayer" :playType="'5'" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></document-player>
      </div>
    </div>
  </section>
</template>

<script>
  import filterCommon from './components/filterCommon'
  import videoPlayer from './components/videoPlayer'
  import audioPlayer from './components/audioPlayer'
  import documentPlayer from './components/documentPlayer'
  export default {
    name: 'player',
    components: {
      filterCommon,
      videoPlayer,
      audioPlayer,
      documentPlayer
    },
    data() {
      return {
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
        const param = JSON.stringify(this.filters)
        this.filters.enType = ''
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.clearTimeInterval()
        }
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.clearTimeInterval()
        }
        if (this.$refs.documentPlayer) {
          this.$refs.documentPlayer.clearTimeInterval()
        }
        if (this.source === 'online') {
          this.$gotoid('/micro/onlineClassRoom', param)
        }
        if (this.source === 'trainMaterial') {
          const para = {
            filters: this.filters,
            active: this.active
          }
          this.$gotoid('/micro/trainMaterial', JSON.stringify(para))
        }
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
        this.enType = filters.enType
        this.source = filters.jumpType
        this.rowId = filters.id
        if (this.enType === '0') {
          this.postfix = '文档'
        }
        if (this.enType === '1') {
          this.postfix = '视频'
        }
        if (this.enType === '2') {
          this.postfix = '音频'
        }
        if (filters.auditView) {
          this.active = filters.active
          this.filters = filters.filters
          this.auditView = filters.auditView
        } else {
          this.filters = filters.filters
          this.$refs.filterCommon.setFilter(filters.filters)
        }
        this.detail()
      }
    }
  }
</script>

<style scoped>
</style>
