<template>
<!-- 督办详情 -->
  <div class="dbDetail">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
     <div class="personnelFile">
     <el-row v-loading="loading">
       <!-- 左侧导航区 -->
        <el-col class="leftCont" :span="3" :style="{height:countHeight}">
          <left-nav class="bg" :leftNumber="leftData"></left-nav>
        </el-col>
        <!-- 右侧内容区 -->
        <el-col :span="21" class="rightCont" :style="{height:countHeight}">
          <div class="rightContDoc" ref="rightContDoc">
            <base-info class="marb bg jbxx" :jbxxData="dbDetailData.jbxx" :dshData="dbDetailData.shxx"></base-info>
            <audit-info class="marb bg shxx" :dbId="dbId" ></audit-info>
            <endcase-report class="marb bg jabg" :jabgData="dbDetailData.jabg"></endcase-report>
            <evaluation-score class="marb bg pjdf" :pjdfData="dbDetailData.pjdf"></evaluation-score>
            <urge-info class="marb bg cbxx" :cbData="dbDetailData.cbxx"></urge-info>
            <new-progress class="marb bg zxjz" :zxjzData="dbDetailData.zxjz"></new-progress>
          </div>
        </el-col>
     </el-row>
  </div>
  </div>
</template>

<script>
import LeftNav from './components/leftNav' // 左侧菜单
import BaseInfo from './components/baseInfo' // 右侧--基本信息
import AuditInfo from './components/auditInfo' // 右侧--审核信息
import EndcaseReport from './components/endcaseReport' // 右侧--结案报告
import EvaluationScore from './components/evaluationScore' // 右侧--评价打分
import UrgeInfo from './components/urgeInfo' // 右侧--催办信息
import NewProgress from './components/newProgress' // 右侧--最新进展
import $ from 'jquery'
export default {
  name: 'personnelFile',
  data() {
    return {
      countHeight: document.documentElement.clientHeight - 130 + 'px',
      dbId: '', // 从详情页面返回的是身份证号码、案件编号或线索编号
      classList: ['jbxx', 'shxx', 'jabg', 'pjdf', 'cbxx', 'zxjz'],
      loading: true,
      leftData: {},
      dbDetailData: {}, // 督办详情
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')), // 当前用户信息
      deptInfo: JSON.parse(sessionStorage.getItem('depToken'))[0] // 当前部门信息
    }
  },
  components: {
    LeftNav,
    BaseInfo,
    AuditInfo,
    EndcaseReport,
    EvaluationScore,
    UrgeInfo,
    NewProgress
  },
  computed: {
    getIstotop() {
      return this.$store.state.app.personeltotop
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
    jump(val) {
      var total = document.querySelector('.' + val).offsetTop
      $('.rightCont').animate({ scrollTop: total }, 0)
    },
    toback() {
      this.$router.back(-1)
    },
    // 监听滚动条变化
    handleScroll() {
      var documentHeight = this.$refs.rightContDoc.offsetHeight
      var difference = documentHeight - (document.documentElement.clientHeight - 130)
      if (document.querySelector('.rightCont').scrollTop > 0) { // 如何滚动条顶部距离>0,则将状态ToTop初始化为0
        this.$store.dispatch('ToTop', 0)
      }
      for (var i = 0; i < this.classList.length - 1; i++) {
        if (document.querySelector('.rightCont').scrollTop === 0) {
          this.$store.dispatch('MouleClass', this.classList[0])
        } else if (document.querySelector('.rightCont').scrollTop >= document.querySelector('.' + this.classList[i]).offsetTop - 10 && document.querySelector('.rightCont').scrollTop < difference) {
          this.$store.dispatch('MouleClass', this.classList[i])
        } else if (document.querySelector('.rightCont').scrollTop === difference + 20) {
          // console.log('到底了')
          this.$store.dispatch('MouleClass', this.classList[7])
        }
      }
    },
    queryDbDetail() {
      if (this.$route.query.dbId) { // 正式
        this.dbId = this.$route.query.dbId
        // 查详情
        this.loading = true
        this.$query('casesupervise', { id: this.dbId }).then((response) => {
          this.loading = false
          if (response.code === '000000') {
            this.dbDetailData = response.data.data
            this.leftData = response.data.th
            // 基本信息
            this.dbDetailData.jbxx.jabgTitle = this.dbDetailData.jabg ? this.dbDetailData.jabg.title : '' // 是否有结案报告

            // 结案报告
            if (!this.dbDetailData.jabg) {
              this.dbDetailData.jabg = {}
            }
            this.dbDetailData.jabg.dbId = this.dbId // 将督办id存入 结案报告中
            this.dbDetailData.jabg.signStatus = this.dbDetailData.jbxx.signStatus // 将签收状态存入 结案报告中，必须是签收了后 才能上报结案报告
            this.dbDetailData.jabg.createDeptCode = this.dbDetailData.jbxx.applyDepartCode // 申请部门code
            this.dbDetailData.jabg.dbStatus = this.dbDetailData.jbxx.status // 本级督办状态
            // this.dbDetailData.jabg.reportStatus = this.dbDetailData.jabg.reportStatus // 结案报告状态
            // this.dbDetailData.jabg.upDbStatus = this.dbDetailData.jabg.upDbStatus // 上级督办状态
            // this.dbDetailData.jabg.wdStatus = this.dbDetailData.jabg.wdStatus // 是否有上级督办

            // 评价打分
            this.dbDetailData.pjdf.dbId = this.dbId // 将督办id存入 评价打分中
            this.dbDetailData.pjdf.status = this.dbDetailData.jbxx.status // 将督办状态存入 评价打分中
            this.dbDetailData.pjdf.superviseDepartCode = this.dbDetailData.jbxx.superviseDepartCode // 将审核单位存入 评价打分中
            // 催办
            this.dbDetailData.cbxx.dbId = this.dbId // 将督办id存入 催办
            this.dbDetailData.cbxx.status = this.dbDetailData.jbxx.status // 将督办状态存入 催办
            this.dbDetailData.cbxx.superviseDepartCode = this.dbDetailData.jbxx.superviseDepartCode // 将审核单位存入催办
          }
        }).catch(() => {
          this.loading = false
        })
      }
    }
  },
  created() {

  },
  mounted() {
    const _this = this
    document.querySelector('.rightCont').addEventListener('scroll', _this.handleScroll) // 监听滚动条变化
    this.queryDbDetail()
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    if (this.$route.query.dbId) { // 正式
      this.dbId = this.$route.query.dbId
    }
    document.querySelector('.rightCont').addEventListener('scroll', this.handleScroll) // 监听滚动条变化
    this.queryDbDetail()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.dbDetail {
  .leftCont {
    width: 11.8%;
    margin-right: 10px;
  }
  .rightCont {
    overflow: auto;
  }
  .marb {
    margin-bottom: 20px;
  }
  .bg {
    background-color: rgba(0, 64, 94, 0.7);
  }
  .cell_title {
    margin: 0 0 10px 5px;
    .text {
      // display: inline-block;
      line-height: 20px;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      margin-left: 3px;
    }
    .small_line {
      display: inline-block;
      width: 8px;
      height: 20px;
      background: #00a0e9;
      border-radius: 3px;
      vertical-align: middle;
    }
  }
  .archiveTab.el-tabs {
    border: none;
    background: none;
    .el-tabs__header {
      background: url(/static/image/personFile_images/titlePub.png) no-repeat
        center center;
      background-size: 100% 65%;
      margin: 0;
    }
    .el-tabs__nav-scroll {
      padding: 6px 18px 16px 5px;
    }
    .el-tabs__nav-wrap::after {
      // 去掉tab自带的下划线
      height: 0;
    }
    .el-tabs__active-bar {
      height: 0;
    }
    .el-tabs__item {
      padding: 0 20px;
      height: 20px;
      line-height: 20px;
    }
    .el-tabs__item.is-top:last-child {
      padding-right: 20px;
    }
    .el-tabs__item.is-active {
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      .no_data_title {
        color: #bce8fc;
        text-shadow: 0 0 2px #fff;
      }
    }
    .el-tabs__item {
      color: #00a0e9;
    }
    .tab_title_line {
      // taba页签右边的斜线
      width: 26px;
      position: absolute;
      right: -10px;
      top: -1px;
    }
  }
  .goBack {
    margin: 0 10px 5px 0;
  }
  .toolbar {
    margin: 2px 0 0 !important;
  }
  .rightCont {
    // width: 83.3%;
  }
  .pubStyle {
    border: 2px solid rgb(0, 160, 233);
    border-radius: 6px;
    padding: 0 12px 0 8px;
  }

  @media only screen and (max-width: 1367px) {
    .leftCont {
      // width: 17.5%;
      margin-right: 5px;
    }
    .rightCont {
      // width: 80%;
    }
  }

  // 带按钮的 标题栏
  .titleWrap {
    width: 100%;
    padding: 7px 0 7px 7px;
    border-bottom: 2px solid #00a0e9;
    overflow: hidden;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    font-size: 17px;
    margin-bottom: 10px;
    .left {
      float: left;
      letter-spacing: 3px;
    }
  }
  // 固定左侧列的样式问题
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    tr:nth-child(odd) {
    background-color: #004f77;
  }
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    tr:nth-child(even) {
    background-color: #032c43;
  }
  .el-table__fixed
    .el-table__fixed-body-wrapper
    .el-table__body
    .el-table__body
    tr:hover
    > td {
    background-color: #2164a1;
  }
  .el-table__fixed::before,
  .el-table__fixed::before {
    opacity: 0;
  }
}
</style>

