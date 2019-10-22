<template>
  <section class="portalCont" @mouseover="isOvertime()">
    <top :upmsUrl="upmsUrl"></top>
    <div class="portalWrap">
      <!-- <top-message></top-message> -->
      <div class="cardCount">
        <card v-for="item in cardData" :col-span="item.span" :title="item.title" :content="item.content" :icon="item.icon" :cls="item.content"  :key="item.id" :more-btn="item.moreBtn" :more="item.more"></card>
      </div>
      <work-menu v-if="isShowMenu"></work-menu>
    </div>
    <import-common-data></import-common-data>
     <foot></foot>
     <!-- <online-help></online-help> -->
  </section>
</template>
<script>
import Top from './components/Top'
import Card from './components/card'
import ImportCommonData from './components/ImportCommonData'
import TopMessage from './components/TopMessage'
// import OnlineHelp from './components/onlineHelp'
import Foot from './components/foot'
import WorkMenu from './components/WorkMenu'

export default {
  name: 'index',
  components: {
    Top,
    Card,
    TopMessage,
    ImportCommonData,
    Foot,
    WorkMenu
    // OnlineHelp
  },
  data() {
    return {
      sysnotice: [],
      cardData: [],
      curDept: null,
      cardData1: [ // 全部菜单（省厅权限）
        { 'span': 8, 'title': '站内通知', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 8, 'title': '', 'content': 'AnJian' }, // 案件统计数
        { 'span': 8, 'title': '功能导航', 'content': 'Gndh', 'moreBtn': '更多' },
        { 'span': 8, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 8, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 8, 'title': '网上培训', 'content': 'Train', 'moreBtn': '更多', 'more': '/micro/totalList' }, // 网上培训
        // { 'span': 7, 'title': '大要案推送', 'content': 'Carousel' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' },
        { 'span': 8, 'title': '网上考试', 'content': 'Exam', 'moreBtn': '更多', 'more': '/handlingGuide/examineManage/statistical' } // 网上考试
        // { 'span': 7, 'title': '外部信息资源', 'content': 'CommunityDataEchart', 'moreBtn': '更多', 'more': '/synthesizeAnalysis/socialIntegrationResources' }

      ],
      cardData2: [ // 市
        { 'span': 8, 'title': '站内通知', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 8, 'title': '', 'content': 'AnJian' }, // 案件统计数
        { 'span': 8, 'title': '功能导航', 'content': 'Gndh', 'moreBtn': '更多' },
        { 'span': 8, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 8, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 8, 'title': '网上培训', 'content': 'train', 'moreBtn': '更多', 'more': '/micro/totalList' }, // 网上培训
        // { 'span': 7, 'title': '大要案推送', 'content': 'Carousel' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' },
        { 'span': 8, 'title': '网上考试', 'content': 'Exam', 'moreBtn': '更多', 'more': '/handlingGuide/examineManage/statistical' } // 网上考试
        // { 'span': 7, 'title': '外部信息资源', 'content': 'CommunityDataEchart', 'moreBtn': '更多', 'more': '/synthesizeAnalysis/socialIntegrationResources' }
      ],
      cardData3: [ // 旗县
        { 'span': 8, 'title': '站内通知', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 8, 'title': '', 'content': 'AnJian' }, // 案件统计数
        { 'span': 8, 'title': '功能导航', 'content': 'Gndh', 'moreBtn': '更多' },
        { 'span': 8, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 8, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 8, 'title': '网上培训', 'content': 'train', 'moreBtn': '更多', 'more': '/micro/totalList' }, // 网上培训
        // { 'span': 7, 'title': '大要案推送', 'content': 'Carousel' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 8, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' },
        { 'span': 8, 'title': '网上考试', 'content': 'Exam', 'moreBtn': '更多', 'more': '/handlingGuide/examineManage/statistical' } // 网上考试
        // { 'span': 7, 'title': '外部信息资源', 'content': 'CommunityDataEchart', 'moreBtn': '更多', 'more': '/synthesizeAnalysis/socialIntegrationResources' }
      ],
      isShowMenu: this.$store.state.app.clickAll, // 是否显示个性化菜单
      upmsUrl: '', // 存储upms地址
      lastTime: null, // 最后一次鼠标移动的时间
      currentTime: null, // 当前鼠标移动的时间
      timeOut: 30 * 60 * 1000 // 设置超时时间： 30分钟
    }
  },
  computed: {
    getIsShowMenu() {
      return this.$store.state.app.clickAll
    }
  },
  watch: {
    getIsShowMenu(val) { // 监听state状态变化
      this.isShowMenu = val
    }
  },
  methods: {
    init() {
      if (sessionStorage.getItem('loginFlag') && sessionStorage.getItem('loginFlag') === '1') {
        // 首次已经提醒
      } else {
        const curUser = JSON.parse(sessionStorage.getItem('userInfo'))
        this.$query('sysloginnumber', { userName: curUser.userName }, '0').then(response => {
          if (response.data.length > 1) {
            sessionStorage.setItem('currentIp', response.data[0].ip_address)
            // this.$drawWaterMark() // 水印
            if (response.data[0].ip_address !== response.data[1].ip_address) {
              sessionStorage.setItem('loginFlag', '1')

              this.$notify({
                title: '提示',
                message: '您的账号上次在[' + response.data[1].ip_address + ']登录过，请妥善保管您的账号密码',
                position: 'bottom-right'
              })
            }
          }
        })
      }
      this.accessControlModel()
      this.getSysconfig()
      this.getPersonInfoTip()
    },
    getPersonInfoTip() {
      // if (this.curDept && this.curDept.length > 0) {
      //   this.$query('', {}).then(response => {
      //     if (response.data.length > 0) {
      //       this.$confirm('您的个人信息还没有完善，未避免影响您的正常使用，请尽快完善个人信息！', '提示', {
      //         confirmButtonText: '立即完善',
      //         cancelButtonText: '稍后再说',
      //         type: 'warning'
      //       }).then(() => {
      //         this.$router.push({ path: '/basicService/personInfo', query: { type: 'mainEdit', id: this.curUser.id }})
      //       }).catch(() => {

      //       })
      //     }
      //   })
      // }
    },
    getSysconfig() { // 获取upms地址
      this.$query('sysconfig', { configKey: 'upms_url' }).then(response => {
        if (response.data.length > 0) {
          this.upmsUrl = response.data[0].configValue.trim()
        }
      })
    },
    accessControlModel() { // 模块显示权限控制
      // this.cardData = this.cardData1
      var depToken = JSON.parse(sessionStorage.getItem('depToken')) // 获取权限code，前6位是610000时是公安厅，否则是非公安厅
      depToken.forEach(element => {
        var code = element.depCode.substring(0, 6)
        if (code === '610000') { // 省公安厅
          this.cardData = this.cardData1
        } else if (code.substring(0, 2) === '61' && code.substr(code.length - 2) === '00') { // 市
          this.cardData = this.cardData2
        } else { // 旗县
          this.cardData = this.cardData3
        }
      })
    },
    isOvertime() {
      this.currentTime = new Date().getTime() // 记录这次鼠标移动的时间
      if (this.currentTime - this.lastTime > this.timeOut) { // 判断上次最后一次鼠标移动的时间和这次鼠标移动的时间间隔是否大于30分钟
        this.$store.dispatch('FedLogOut').then(() => {
          this.$router.push({
            path: '/login'
          })
        })
        this.$alert('由于您长时间未操作，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({
              path: '/login'
            })
            sessionStorage.clear()
          }
        })
      } else {
        this.lastTime = new Date().getTime() // 如果在30分钟内鼠标移动，则把这次鼠标移动的时间记录覆盖掉之前存的最后一次鼠标移动的时间
      }
    },
    getDist() { // 获取字典
      this.$query('personMessage', {}).then(response => {
        if (response.data.length > 0) {
          sessionStorage.setItem('dictdata', JSON.stringify(response.data))
        }
      })
    }
  },
  mounted() {
    this.curDept = sessionStorage.getItem('depToken') ? JSON.parse(sessionStorage.getItem('depToken'))[0].areaCode : ''
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.init()
  },
  created() {
    this.lastTime = new Date().getTime() // 网页第一次打开时，记录当前时间
    // this.getDist()
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.portalCont {
  width: 100%;
  height: 100%;
  min-height: 100%;
  position: relative;
  background: url("/static/image/portal_newImg/portalBg.png") no-repeat;
  background-size: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 14px;
  .portalWrap {
    width: 100%;
    height: 100%;
    min-height: 93%;
    padding: 0 10px 0 20px;
  }
  .el-card{
    color: #fff;
    background: url('/static/image/portal_newImg/moudBg.png') no-repeat center;
    background-size: 100% 100%;
  }
}
.cardCount {
  width: 100%;
  height: auto;
  // margin: 0 auto;
  // padding-bottom: 20px;
  // overflow: hidden;
  // position: relative;
  // top: -40px;
  div {
    // border-radius: 8px !important;
    // border: 2px solid rgb(0, 160, 233);
  }
  div:nth-child(3) {
    // padding-bottom: 3px;
  }
  div:nth-child(1),
  div:nth-child(2),
  div:nth-child(3),
  div:nth-child(4),
  div:nth-child(5),
  div:nth-child(6) {
    // margin-bottom: 20px;
  }

  div:nth-child(2),
  div:nth-child(5),
  div:nth-child(8) {
    // margin-left: 1%;
    // margin-right: 1%;
  }
}
.navmenubg {
  width: 100%;
  // height: 255px;
  height: 355px;
  background: url("../../assets/portal_images/head_bg.png") no-repeat center
    center;
  background-size: 100% 100%;
  position: relative;
  .guohui,
  .navtitle,
  .navtitsc,
  .yaopan {
    position: absolute;
    display: inline-block;
  }
  .yaopan {
    width: 110px;
    // height: 120px;
    top: 37px;
    left: 0;
  }
  .guohui {
    width: 190px;
    top: 90px;
    left: 245px;
  }
  .navtitle {
    width: 540px;
    // height: 68px;
    top: 130px;
    left: 400px;
  }
  .navtitsc {
    width: 240px;
    top: -10px;
    right: 60px;
  }
}
@media only screen and (max-width: 1367px) {
  .portalCont {
    .portalWrap {
      padding: 15px 5px 0 12px;
      min-height: 90%;
    }
  }
  .cardCount div:nth-child(1),
  .cardCount div:nth-child(2),
  .cardCount div:nth-child(3),
  .cardCount div:nth-child(4),
  .cardCount div:nth-child(5),
  .cardCount div:nth-child(6) {
    // margin-bottom: 23px;
  }
}
.marqueea {
  color: orange;
}
</style>
