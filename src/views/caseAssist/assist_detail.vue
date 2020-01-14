<template>
  <!-- 协查详情 -->
  <div class="caseAssistDetail">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div class="caseAssist_detail">
      <el-row>
        <!-- 左侧导航区 -->
        <el-col class="leftCont" :span="3" :style="{height:countHeight}">
          <left-nav class="bg" :assistId="assistId" ref="leftNav"></left-nav>
        </el-col>
        <!-- 右侧内容区 -->
        <el-col :span="21" class="rightCont"  :style="{height:countHeight}">
          <div class="rightContDoc" ref="rightContDoc">
            <base-info ref="baseInfo" class="marb bg baseInfo" :assistId="assistId" :info="baseInfo" :signBtnVisibleH="signBtnVisibleH" :evaluateBtnVisibleH="evaluateBtnVisibleH"></base-info>
            <verify-info v-if="auditVisible" class="marb bg auditInfo" :assistId="assistId" :info="baseInfo"></verify-info>
            <SignCom class="marb bg signInfo" :assistId="assistId" :info="baseInfo" :showType="1" @setSignBtnVisibleH="setSignBtnVisibleH"></SignCom>
            <FeedBackCom class="marb bg feedbackInfo" :assistId="assistId" :info="baseInfo" :showType="1" @setEvaluateBtnVisibleH="setEvaluateBtnVisibleH"></FeedBackCom>
            <SignCom v-if="areaVisible" class="marb bg signInfo_area" :assistId="assistId" :info="baseInfo" :showType="2" @setSignBtnVisibleH="setSignBtnVisibleH"></SignCom>
            <FeedBackCom v-if="areaVisible" class="marb bg feedbackInfo_area" :assistId="assistId" :info="baseInfo" :showType="2" @setEvaluateBtnVisibleH="setEvaluateBtnVisibleH"></FeedBackCom>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import LeftNav from './components/leftNav' // 左侧菜单
  import BaseInfo from './components/baseInfo' // 右侧--基本信息
  import VerifyInfo from './components/verifyInfo' // 右侧--审核信息
  import SignCom from './components/signCom'
  import FeedBackCom from './components/feedbackCom'
  import $ from 'jquery'
  export default {
    name: 'assist_detail',
    data() {
      return {
        countHeight: document.documentElement.clientHeight - 160 + 'px',
        classList: ['baseInfo', 'auditInfo', 'signInfo', 'feedbackInfo'],
        curUser: JSON.parse(sessionStorage.getItem('userInfo')),
        curDept: JSON.parse(sessionStorage.getItem('depToken'))[0],
        assistId: sessionStorage.getItem(this.$route.path),
        baseInfo: {},
        systemTime: null,
        areaVisible: false,
        signBtnVisibleH: true,
        evaluateBtnVisibleH: true,
        auditVisible: true
      }
    },
    components: {
      LeftNav,
      BaseInfo,
      VerifyInfo,
      SignCom,
      FeedBackCom
    },
    computed: {
      getIstotop() {
        if (this.$store.state.app.personeltotop) {
          return this.$store.state.app.personeltotop
        }
      },
      getUserIcons() {
        return this.$store.state.app.istotop
      }
    },
    watch: {
      getIstotop(val) {
        // 监听state状态变化
        this.jump(val)
      },
      getUserIcons(val) { // 监听state状态变化
        if (val === 1 && document.querySelector('.rightCont').scrollTop > 0) {
          document.querySelector('.rightCont').scrollTop = 0
        }
      }
    },
    methods: {
      setSignBtnVisibleH(val) {
        this.signBtnVisibleH = val
        this.$refs.baseInfo.setSignBtnVisibleH(this.signBtnVisibleH)
      },
      setEvaluateBtnVisibleH(val) {
        this.evaluateBtnVisibleH = val
        this.$refs.baseInfo.setEvaluateBtnVisibleH(this.evaluateBtnVisibleH)
      },
      detail() { // 查询详情
        this.$query('caseAssist/' + this.assistId, {}).then((response) => {
          this.baseInfo = response.data
          if (response.data.attachment !== undefined && response.data.attachment !== null && response.data.attachment !== '') {
            this.baseInfo.attachment = JSON.parse(response.data.attachment)
          } else {
            this.baseInfo.attachment = []
          }
          this.baseInfo.systemTime = this.systemTime
          this.$refs.baseInfo.setBaseInfo(this.baseInfo)
          if (String(this.baseInfo.category) === '3') {
            this.auditVisible = false
          } else {
            this.$refs.leftNav.showItem()
          }
        }).catch(() => {
        })
      },
      getSysTime() {
        this.$query('knowledge/queryTime').then(response => {
          this.systemTime = response.data
          this.detail()
        })
      },
      jump(val) {
        if (val !== undefined && val !== '') {
          if (document.querySelector('.' + val)) {
            const total = document.querySelector('.' + val).offsetTop
            $('.rightCont').animate({ scrollTop: total }, 0)
          }
        }
      },
      toback() {
        this.$router.push({ path: '/caseAssist/list' }) // 跳转到列表页
      },
      // 监听滚动条变化
      handleScroll() {
        this.$store.dispatch('Personeltotop', '')
        const documentHeight = this.$refs.rightContDoc.offsetHeight
        const difference = documentHeight - (document.documentElement.clientHeight - 130)
        if (document.querySelector('.rightCont').scrollTop > 0) { // 如何滚动条顶部距离>0,则将状态ToTop初始化为0
          this.$store.dispatch('ToTop', 0)
        }
        for (let i = 0; i < this.classList.length - 1; i++) {
          const scrollTop = document.querySelector('.rightCont').scrollTop
          if (document.querySelector('.' + this.classList[i])) {
            const offsetTop = document.querySelector('.' + this.classList[i]).offsetTop
            if (scrollTop === 0) {
              this.$store.dispatch('MouleClass', this.classList[0])
            } else if (scrollTop >= offsetTop - 10) {
              this.$store.dispatch('MouleClass', this.classList[i])
            } else if (scrollTop === difference + 20) {
              this.$store.dispatch('MouleClass', this.classList[this.classList.length - 1])
            }
          }
        }
      }
    },
    mounted() {
      const _this = this
      document.querySelector('.rightCont').addEventListener('scroll', _this.handleScroll) // 监听滚动条变化
      if (this.curDept.depType === '2' && this.curDept.areaCode !== '611400' && this.curDept.areaCode !== '616200') { // 地市 并且 不是杨凌 不是西咸
        this.areaVisible = true
        this.classList.push('signInfo_area')
        this.classList.push('feedbackInfo_area')
      }
      this.getSysTime()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .caseAssistDetail .leftCont {
    width: 11.8%;
    margin-right: 10px;
  }
  .caseAssistDetail .rightCont {
    overflow: auto;
  }
  .caseAssistDetail .marb {
    margin-bottom: 20px;
  }
  .caseAssistDetail .bg {
    background-color: rgba(0, 64, 94, 0.7);
  }
  .caseAssistDetail .cell_title {
    margin: 0 0 10px 5px;
  }
  .caseAssistDetail .cell_title .text {
    // display: inline-block;
    line-height: 20px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    margin-left: 3px;
  }
  .caseAssistDetail .cell_title .small_line {
    display: inline-block;
    width: 8px;
    height: 20px;
    background: #00a0e9;
    border-radius: 3px;
    vertical-align: middle;
  }
  .caseAssistDetail .archiveTab.el-tabs {
    border: none;
    background: none;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__header {
    background: url(/static/image/personFile_images/titlePub.png) no-repeat center center;
    background-size: 100% 65%;
    margin: 0;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__nav-scroll {
    padding: 6px 18px 16px 5px;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__nav-wrap::after {
    // 去掉tab自带的下划线
    height: 0;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__active-bar {
    height: 0;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__item {
    padding: 0 20px;
    height: 20px;
    line-height: 20px;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__item.is-top:last-child {
    padding-right: 20px;
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__item.is-active {
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    .no_data_title {
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
    }
  }
  .caseAssistDetail .archiveTab.el-tabs .el-tabs__item {
    color: #00a0e9;
  }
  .caseAssistDetail .archiveTab.el-tabs .tab_title_line {
    // taba页签右边的斜线
    width: 26px;
    position: absolute;
    right: -10px;
    top: -1px;
  }
  .caseAssistDetail .goBack {
    margin: 0 10px 5px 0;
  }
  .caseAssistDetail .toolbar {
    margin: 2px 0 0 !important;
  }
  .caseAssistDetail .pubStyle {
    border: 2px solid rgb(0, 160, 233);
    border-radius: 6px;
    padding: 0 12px 10px 8px;
  }
  /*.el-table__fixed .el-table__fixed-body-wrapper .el-table__body tr:nth-child(even) {*/
     /*background-color: #032c43; */
  /*}*/

  // 固定左侧列的样式问题
  .caseAssistDetail .el-table__fixed .el-table__fixed-body-wrapper .el-table__body tr:nth-child(odd){
    background-color: rgba(0, 89, 130, 1);
  }
  .caseAssistDetail .el-table__fixed .el-table__fixed-body-wrapper .el-table__body tr:nth-child(even){
    background-color: #032c43;
  }
  .caseAssistDetail .el-table__fixed .el-table__fixed-body-wrapper .el-table__body .el-table__body tr:hover>td{
    background-color: #2164a1;
  }
</style>

