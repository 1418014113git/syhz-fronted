<template>
<div class="gfzdDetail">
  <el-row class="caseEdit">
    <img src="@/assets/icon/back.png"  class="goBack" @click="callback">   <!--返回-->
  </el-row>
  <el-card class="caseEdit" v-loading="loading">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <div class="title">{{detailData.title}}</div>
        <div class="gfzdDetail">
          <div class="lineDetail">
            <div><span>类别：</span>
              <span v-if="detailData.articleType === 1">食品</span>
              <span v-if="detailData.articleType === 2">药品</span>
              <span v-if="detailData.articleType === 3">环境</span>
              <span v-if="detailData.articleType === 4">综合</span>
            </div>
            <div></div>
            <div class="detailBtn">
              <el-button type="success" v-if="$isViewBtn('118003') && detailData.createUser === String(curUser.id)" plain @click="doEdit">修改</el-button>
            </div>
          </div>
          <div class="lineDetail">
            <div><span>颁布机关：</span><span>{{detailData.publishOrgName}}</span></div>
            <div><span>颁布日期：</span><span>{{this.$parseTime(detailData.publishTime, '{y}-{m}-{d}')}}</span></div>
          </div>
          <div class="lineDetail">
            <div><span>颁布文号：</span><span>{{detailData.publishCode}}</span></div>
            <div><span>施行日期：</span><span>{{this.$parseTime(detailData.effectiveTime, '{y}-{m}-{d}')}}</span></div>
          </div>
          <div class="lineDetail">
            <div><span>发布单位：</span><span>{{detailData.belongDepName}}</span></div>
            <div><span>发布人：</span><span>{{detailData.creationName}}</span></div>
          </div>
          <div class="lineDetail">
            <div><span>发布日期：</span><span>{{this.$parseTime(detailData.creationTime, '{y}-{m}-{d}')}}</span></div>
          </div>
        </div>
        <div v-if="detailData.content && detailData.content !== ''" class="gfzdContent">
          <div v-html="detailData.content" class="e-p-line ql-editor" style="padding: 10px 50px;"></div>
        </div>
        <div v-if="detailData.enclosure && detailData.enclosure.length > 0" class="enclosure_con">
          <div v-for="item in detailData.enclosure" :key="item.key" class="file_data_list" @click="handlerClick(item)">
            <div class="img">
              <img :src="src(item)">
              <div class="tag">
                <span v-if="detailData.articleType === 1">食品</span>
                <span v-if="detailData.articleType === 2">药品</span>
                <span v-if="detailData.articleType === 3">环境</span>
                <span v-if="detailData.articleType === 4">综合</span>
                _
                <span v-if="item.enType === 0">文档</span>
                <span v-if="item.enType === 1">视频</span>
                <span v-if="item.enType === 2">音频</span>
                <span v-if="item.count > 1"> （共{{ item.count}}节）</span>
              </div>
            </div>
            <p class="en_title">{{ item.count > 1 ? item.title : item.enName }}</p>
            <div class="time">
              <span>{{ item.creationName }}</span>
              <span>{{ item.creationTime }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-dialog title="" :visible.sync="audioDialogVisible" :close-on-click-modal="false" :show-close="false" @close="dialogClose" class="play_dialog">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="dialogClose">   <!--返回-->
    </el-row>
    <audio-player ref="audioPlayer" :playType="1" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></audio-player>
  </el-dialog>
  <el-dialog title="" :visible.sync="videoDialogVisible" :close-on-click-modal="false" :show-close="false" @close="dialogClose" class="play_dialog">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="dialogClose">   <!--返回-->
    </el-row>
    <video-player ref="videoPlayer" :playType="1" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></video-player>
  </el-dialog>
  <el-dialog title="" :visible.sync="documentDialogVisible" :close-on-click-modal="false" :show-close="false" @close="dialogClose" class="play_dialog">
    <el-row class="caseEdit">
      <img src="@/assets/icon/back.png"  class="goBack" @click="dialogClose">   <!--返回-->
    </el-row>
    <document-player ref="documentPlayer" :playType="1" :playerDetail="playerDetail" @viewLog="viewLog" @uploadViewLog="uploadViewLog"></document-player>
  </el-dialog>
</div>
</template>

<script>
  import videoPlayer from '@/views/microClass/components/videoPlayer'
  import audioPlayer from '@/views/microClass/components/audioPlayer'
  import documentPlayer from '@/views/microClass/components/documentPlayer'
  import VueEditor from '@/components/Editor/VueEditor'
  import { uploadImg } from '@/utils/editorUpload'
  import Attachment from '@/api/attachment'

  export default {
    name: 'caseEdit',
    components: {
      VueEditor,
      videoPlayer,
      audioPlayer,
      documentPlayer
    },
    data() {
      return {
        videoDialogVisible: false,
        audioDialogVisible: false,
        documentDialogVisible: false,
        playerDetail: {},
        uploadAction: Attachment.uploadFileUrl,
        id: '',
        callBack: '',
        active: '',
        filters: {},
        loading: false,
        currentDep: {},
        curUser: {},
        detailData: {},
        categoryOptions: [
          { label: '法律', value: '1' },
          { label: '行政法规', value: '2' },
          { label: '地方性行政法规', value: '201' },
          { label: '部门规章', value: '202' },
          { label: '司法解释', value: '3' },
          { label: '其他规范性文件', value: '4' }
        ],
        viewId: ''
      }
    },
    methods: {
      src(item) {
        if (item.enClass === '.mp3' || item.enClass === '.mp4' || item.enClass === '.avi' || item.enClass === '.wmv') {
          if (this.detailData.articleType === 1) {
            return '/static/image/online/sp.jpg'
          }
          if (this.detailData.articleType === 2) {
            return '/static/image/online/yp.jpg'
          }
          if (this.detailData.articleType === 3) {
            return '/static/image/online/hj.jpg'
          }
          if (this.detailData.articleType === 4) {
            return '/static/image/online/zh.jpg'
          }
        }
        if (item.enClass === '.doc' || item.enClass === '.docx') {
          return '/static/image/online/word.jpg'
        }
        if (item.enClass === '.pdf') {
          return '/static/image/online/pdf.jpg'
        }
        if (item.enClass === '.ppt' || item.enClass === '.pptx') {
          return '/static/image/online/ppt.jpg'
        }
      },
      getCategoryData(key) {
        let a = ''
        this.categoryOptions.forEach(item1 => {
          if (item1.value === (key + '')) {
            a += item1.label + ','
          }
        })
        return a.substring(0, a.length - 1)
      },
      doEdit() {
        this.$gotoid('/handlingGuide/gfzd/edit', this.id)
      },
      callback() {
        if (this.callBack === '') {
          this.$router.push('/handlingGuide/gfzdList')
        } else {
          const para = {
            filters: this.filters,
            active: this.active
          }
          this.$gotoid('/handlingGuide/knowLedgeBase', JSON.stringify(para))
        }
      },
      getDetail() {
        this.loading = true
        this.$query('standardinfodetail/' + this.id, {}).then(response => {
          this.loading = false
          this.detailData = response.data
          if (this.callBack === '') { // 从列表页进来的
            this.viewLog('0', '0')
          }
        }).catch(() => {
          this.loading = false
        })
      },
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((response) => {
          if (response.code === '000000') {
            Editor.insertEmbed(cursorLocation, 'image', response.data)
            resetUploader()
          }
        }).catch((e) => {})
      },
      handlerClick(row) {
        this.playerDetail = row
        this.playerDetail.title = row.enName
        this.playerDetail.creationName = this.detailData.creationName
        this.playerDetail.creationTime = this.detailData.creationTime
        this.playerDetail.auditTime = this.detailData.auditTime
        this.playerDetail.type = this.detailData.articleType + ''
        this.playerDetail.flag = (this.callBack !== 'knowLedgeBase')
        if (row.enType === 0) {
          this.documentDialogVisible = true
          if (this.$refs.documentPlayer) {
            this.$refs.documentPlayer.setDetail(row)
          }
        }
        if (row.enType === 1) {
          this.videoDialogVisible = true
          if (this.$refs.videoPlayer) {
            this.$refs.videoPlayer.setDetail(row)
          }
        }
        if (row.enType === 2) {
          this.audioDialogVisible = true
          if (this.$refs.audioPlayer) {
            this.$refs.audioPlayer.setDetail(row)
          }
        }
      },
      dialogClose() {
        this.documentDialogVisible = false
        this.videoDialogVisible = false
        this.audioDialogVisible = false
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.clearTimeInterval()
          this.$refs.audioPlayer.stopRun()
        }
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.clearTimeInterval()
          this.$refs.videoPlayer.stopRun()
        }
        if (this.$refs.documentPlayer) {
          this.$refs.documentPlayer.clearTimeInterval()
        }
      },
      viewLog(viewType, operateType) {
        let para = {
          tableId: this.id,
          stopTime: '',
          remark: '',
          ip: sessionStorage.getItem('currentIp'),
          ensId: this.playerDetail.id,
          belongMode: '3',
          belongType: this.detailData.articleType,
          documentId: this.detailData.documentId,
          viewType: viewType, // 0 文章， 1 附件
          operateType: operateType // 0 预览， 1 下载
        }
        para = this.$setCurrentUser(para)
        this.$save('konwledgeLog', para).then(response => {
          if (viewType === '1' && operateType === '0') {
            this.viewId = response.data
          }
        })
      },
      uploadViewLog(stopTime) {
        let para = {
          stopTime: stopTime
        }
        para = this.$setCurrentUser(para)
        para.lastId = para.creationId
        para.lastName = para.creationName
        this.$update('Knowledge/' + this.viewId, para).then(response => {
          console.info('更新停留时间')
        })
      }
    },
    mounted() {
      this.currentDep = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      if (sessionStorage.getItem(this.$route.path) && sessionStorage.getItem(this.$route.path) !== undefined) {
        const para = JSON.parse(sessionStorage.getItem(this.$route.path))
        if (para.id) {
          this.id = para.id
          this.getDetail()
        }
        if (para.jumpType) {
          this.callBack = para.jumpType
          this.active = para.active
        }
        if (para.filters) {
          this.filters = para.filters
        }
      }
    }
  }
</script>

<style>
  .gfzdDetail{
    padding: 20px 40px;
    display: inline-block;
    width: 100%;
  }
  .gfzdDetail > div.lineDetail{
    width: 100%;
    padding: 5px;
    display: inline-block;
  }
  .gfzdDetail > div.lineDetail > div{
    float: left;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .gfzdDetail > div.lineDetail > div.detailBtn{
    width: 10%;
    text-align: right;
  }
  .gfzdDetail > div.lineDetail > div > span:first-child{
    width: 80px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }
  .gfzdContent{
    border-top: 1px solid #eeeeee;
    padding-top: 20px;
    min-height: 500px;
  }
  .gfzdDetail .title{
    color: rgb(32, 160, 255);
    font-size: 26px;
    text-align: center;
  }
  .gfzdDetail .enclosure_con{
    border-top: 1px solid #eeeeee;
    padding: 20px 40px;
  }
  .gfzdDetail .file_data_list{
    width: 23%;
    float: left;
    margin-right: 38px;
    padding: 15px 15px 10px 15px;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  .gfzdDetail .file_data_list:hover, .gfzdDetail .file_data_list:active{
    border: 1px solid #00A0E9;
    border-radius: 4px;
    background-color: #003F5E;
    background-color: rgba(0,63,94,0.6);
    cursor: pointer;
  }
  .gfzdDetail .file_data_list:nth-child(4n){
    margin-right: 0;
  }
  .gfzdDetail .file_data_list .img {
    position: relative;
  }
  .gfzdDetail .file_data_list .img > img{
    width: 100%;
    height: 130px;
  }
  .gfzdDetail .file_data_list .img .tag{
    position: absolute;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    width: 100%;
    padding-left: 10px;
    background-color: #000;
    background-color: rgba(0,0,0,0.6);
    font-size: 14px;
    /*opacity: 0.1;*/
  }
  .gfzdDetail .file_data_list .en_title{
    margin: 20px 0 5px;
    text-overflow: ellipsis;
    width: 100%;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
  }
  .gfzdDetail .file_data_list .time{
    color: #ccc;
    font-size: 14px;
    margin-top: 20px;
  }
  .gfzdDetail .file_data_list .time > span {
    float: left;
  }
  .gfzdDetail .file_data_list .time > span:last-child {
    float: right;
  }

  .play_dialog .el-dialog{
    width: 80%;
    background: none;
    border: 0;
  }
  .play_dialog .el-dialog .el-dialog__header{
    border: none;
  }
  .play_dialog .el-dialog .el-dialog__body .caseEdit.el-row {
    width: 100%;
  }
</style>
