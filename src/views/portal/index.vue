<template>
  <section class="portalCont" @mouseover="isOvertime()">
    <div class="portalWrap">
      <top></top>
      <top-message></top-message>
      <div class="cardCount">
        <card v-for="item in cardData" :col-span="item.span" :title="item.title" :content="item.content" :icon="item.icon" :cls="item.content"  :key="item.id" :more-btn="item.moreBtn" :more="item.more"></card>
      </div>
      <work-menu v-if="isShowMenu"></work-menu>
    </div>
    <import-common-data></import-common-data>
     <foot></foot>
     <online-help></online-help>
  </section>
</template>
<script>
import Top from './components/Top'
import Card from './components/card'
import ImportCommonData from './components/ImportCommonData'
import TopMessage from './components/TopMessage'
import OnlineHelp from './components/onlineHelp'
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
    WorkMenu,
    OnlineHelp
  },
  data() {
    return {
      sysnotice: [],
      cardData: [],
      cardData1: [ // 全部菜单（省厅权限）
        { 'span': 7, 'title': '大要案推送', 'content': 'Carousel' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 9, 'title': '统计', 'content': 'AnJian' },
        { 'span': 7, 'title': '功能导航', 'content': 'Gndh' },
        { 'span': 7, 'title': '站内信息', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 9, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 7, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 7, 'title': '外部信息资源', 'content': 'CommunityDataEchart', 'moreBtn': '更多', 'more': '/synthesizeAnalysis/socialIntegrationResources' },
        { 'span': 9, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 7, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' }
      ],
      cardData2: [ // 市
        // { 'span': 7, 'title': '站内信息', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        // { 'span': 9, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        // { 'span': 7, 'title': '功能导航', 'content': 'Gndh' },
        // { 'span': 7, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        // { 'span': 9, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        // { 'span': 7, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' }

        // 20190731 门户权限变更需求   总队、市一样9个模块
        { 'span': 7, 'title': '大要案推送', 'content': 'Carousel' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 9, 'title': '统计', 'content': 'AnJian' },
        { 'span': 7, 'title': '功能导航', 'content': 'Gndh' },
        { 'span': 7, 'title': '站内信息', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 9, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 7, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 7, 'title': '外部信息资源', 'content': 'CommunityDataEchart', 'moreBtn': '更多', 'more': '/synthesizeAnalysis/socialIntegrationResources' },
        { 'span': 9, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 7, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' }
      ],
      cardData3: [ // 旗县
        // { 'span': 7, 'title': '站内信息', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        // { 'span': 9, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        // { 'span': 7, 'title': '功能导航', 'content': 'Gndh' }

        // 20190731 门户权限变更需求   县区6个功能同原市
        { 'span': 7, 'title': '站内信息', 'content': 'List', 'moreBtn': '更多', 'more': '/tztg/index' },
        { 'span': 9, 'title': '督办案件最新进展', 'content': 'Tab' }, // 更多按钮暂时隐藏掉，后续功能完善了在显示
        { 'span': 7, 'title': '功能导航', 'content': 'Gndh' },
        { 'span': 7, 'title': '破获案件统计', 'content': 'Statistical', 'moreBtn': '更多', 'more': '/caseManage/statistics' }, // 更多跳转到案件统计情况页面
        { 'span': 9, 'title': '案件走势图', 'content': 'Echart', 'moreBtn': '更多', 'more': '/zhyp/caseTrend' },
        { 'span': 7, 'title': '高发案件类别', 'content': 'High', 'moreBtn': '更多', 'more': '/zhyp/hightCaseTrend' }
      ],
      isShowMenu: this.$store.state.app.clickAll, // 是否显示个性化菜单
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
            this.$drawWaterMark()
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
    },
    accessControlModel() { // 模块显示权限控制
      // this.cardData = this.cardData1
      var depToken = JSON.parse(sessionStorage.getItem('depToken')) // 获取权限code，前6位是150000时是公安厅，否则是非公安厅
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
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({
                path: '/login'
              })
            })
          }
        })
      } else {
        this.lastTime = new Date().getTime() // 如果在30分钟内鼠标移动，则把这次鼠标移动的时间记录覆盖掉之前存的最后一次鼠标移动的时间
      }
    }
  },
  mounted() {
    this.init()
  },
  created() {
    this.lastTime = new Date().getTime() // 网页第一次打开时，记录当前时间
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.portalCont {
  width: 100%;
  height: 100%;
  min-height: 100%;
  position: relative;
  background: url("/static/image/portal_newImg/portalBg.png") no-repeat center
    center;
  background-size: 100% 100%;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 14px;
  .portalWrap {
    width: 100%;
    // height: 100%;
    min-height: 93%;
    padding: 20px 30px 0 30px;
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
    // margin-top: 30px;
    border-radius: 8px !important;
    border: 2px solid rgb(0, 160, 233);
  }
  //  div:nth-child(2){
  //   border: 0 !important;
  //  }
  div:nth-child(3) {
    padding-bottom: 3px;
    // border: 2px solid transparent !important;
  }
  div:nth-child(1),
  div:nth-child(2),
  div:nth-child(3),
  div:nth-child(4),
  div:nth-child(5),
  div:nth-child(6) {
    margin-bottom: 30px;
  }

  div:nth-child(2),
  div:nth-child(5),
  div:nth-child(8) {
    margin-left: 2%;
    margin-right: 2%;
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
      padding: 15px 18px 0 18px;
      min-height: 90%;
    }
  }
  .cardCount div:nth-child(1),
  .cardCount div:nth-child(2),
  .cardCount div:nth-child(3),
  .cardCount div:nth-child(4),
  .cardCount div:nth-child(5),
  .cardCount div:nth-child(6) {
    margin-bottom: 23px;
  }
}
.marqueea {
  color: orange;
}
</style>
