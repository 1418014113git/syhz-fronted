<template>
  <div id="navBar_doc" class="classRoom_documentPlayer" v-loading="detailLoading">
    <el-row type="flex" justify="center">
      <el-col  :span="playType !== '5' ? 24 : 20">
        <el-card>
          <div v-if="playType === '5'" class="documentPlayer_title">
            <svg-icon icon-class="pdf1"></svg-icon>
            <strong>{{detailData.title}}</strong>
          </div>
          <div class="documentPlayer_txt">
            <ul>
              <li><span>上传者：</span><span>{{detailData.creationName}}</span></li>
              <li><span>上传时间：</span><span>{{detailData.creationTime}}</span></li>
              <li><span>审核时间：</span><span>{{detailData.auditTime ? detailData.auditTime : '-'}}</span></li>
              <li><span>热度：</span><span>{{detailData.viewNumber}} 人</span></li>
              <li><span></span><span @click="handlerDown"><el-button type="text" icon="el-icon-download" title="下载"></el-button></span></li>
            </ul>
          </div>
          <div id="player">
            <div class="pdf">
              <pdf :src="detailData.enPath"
                :page="currentPage"
                @num-pages="pageCount=$event"
                @page-loaded="currentPage=$event"
                @loaded="loadPdfHandler">
              </pdf>
              <p class="arrow">
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage === 1}">上一页</span>
                {{currentPage}} / {{pageCount}}&nbsp;&nbsp;&nbsp;
                <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage === pageCount}">下一页</span>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  export default {
    props: [
      'playerDetail',
      'playType' // 1 flfg, 2 hybz, 3 gfzd, 4 alzy, 5 pxzl
    ],
    components: {
      pdf
    },
    data() {
      return {
        currentPage: 0,
        pageCount: 0,
        detailData: this.playerDetail,
        detailId: this.rowId,
        detailLoading: false,
        intervalSplit: 3000, // 毫秒
        timeInterval: null,
        currentTime: new Date(),
        learningTime: 10000 // 毫秒
      }
    },
    methods: {
      setDetail(playerDetail) {
        this.detailData = playerDetail
        this.detailLoading = true
        setTimeout(() => {
          this.detailLoading = false
        }, 500)
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
      changePdfPage(val) {
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
        }
        if (this.playType === 5) {
          this.$store.dispatch('ToTop', 1)
        } else {
          location.hash = '#navBar_doc'
        }
        if (this.detailData.flag) {
          const time = new Date()
          const longC = parseFloat((time.getTime() - this.currentTime.getTime()) / 1000).toFixed(3)
          if (longC > 0) {
            this.$emit('uploadViewLog', longC)
          }
          if (this.currentPage === this.pageCount) {
            this.clearTimeInterval()
          }
        }
      },
      loadPdfHandler(e) {
        this.currentPage = 1 // 加载的时候先加载第一页
        if (this.detailData.flag) {
          if (this.playType === '5') {
            this.$emit('viewLog', '0')
          } else {
            this.$emit('viewLog', '1', '0')
          }
          this.bindSetInterval()
          this.bindSetTimeOut()
          this.currentTime = new Date()
        }
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
    // created() {
    //   this.detailData.enPath = pdf.createLoadingTask('/down/test.pdf')
    // },
    mounted() {
      this.initSplit()
      this.setDetail(this.playerDetail)
    }
  }
</script>

<style>
  .classRoom_documentPlayer .video-js .vjs-big-play-button {
    left: 50%;
    top: 50%;
  }
  .classRoom_documentPlayer .pdf > span {
    display: block!important;
  }
  .classRoom_documentPlayer .documentPlayer_title{
    margin-bottom: 10px;
  }
  .classRoom_documentPlayer .documentPlayer_title strong{
    font-size: 18px;
  }
  .classRoom_documentPlayer .documentPlayer_txt{
    height: 45px;
    line-height: 45px;
    padding: 0 10px;
    background-image: linear-gradient(to bottom , #f2f2f2, #e5e5e5);
    color: #555;
    border: 1px solid #ccc;
    /*text-shadow:0 0 2px #777777;*/
  }
  .classRoom_documentPlayer .documentPlayer_txt ul {
    margin-bottom: 0;
    height: 45px;
    line-height: 45px;
  }
  .classRoom_documentPlayer .documentPlayer_txt ul li{
    float: left;
    width: 20%;
  }
  .classRoom_documentPlayer .documentPlayer_txt ul li:nth-child(2),
  .classRoom_documentPlayer .documentPlayer_txt ul li:nth-child(3){
    width: 27%;
  }
  .classRoom_documentPlayer .documentPlayer_txt ul li:last-child{
    width: 5%;
  }
  .classRoom_documentPlayer .documentPlayer_txt .el-button.el-button--text.el-button--small{
    color: #777777;
  }
  .classRoom_documentPlayer .documentPlayer_txt .el-button.el-button--text.el-button--small:hover{
    color: #00A0E9;
    background-color: rgba(102, 102, 102, 0.3);
    border-radius: 50%;
  }
  .classRoom_documentPlayer .documentPlayer_txt .el-icon-download:before{
    font-size: 18px;
    font-weight: bolder;
  }
  .classRoom_documentPlayer .documentPlayer_txt svg{
    width: 22px;
    height: 22px;
    position: relative;
    left:  1px;
    top: -1px;
  }
  .classRoom_documentPlayer .arrow{
    margin-top: 20px;
    text-align: center;
  }
  .classRoom_documentPlayer .arrow span{
    background-color: #005178;
    padding: 4px 15px;
    border: 1px solid #00A0E9;
    border-radius: 4px;
    margin-right: 15px;
    font-size: 14px;
  }
  .classRoom_documentPlayer .arrow span:hover{
    background-color: #0077af;
    cursor: pointer;
  }
</style>
