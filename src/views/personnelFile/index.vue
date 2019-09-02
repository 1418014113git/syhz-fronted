<template>
<!-- 人员档案升级版 -->
  <div>
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
     <div class="personnelFile">
     <el-row>
       <!-- 左侧导航区 -->
        <el-col class="leftCont" :span="4" :style="{height:countHeight}">
          <left-nav class="bg"  :cardId="cardId"></left-nav>
        </el-col>
        <!-- 右侧内容区 -->
        <el-col :span="20" class="rightCont"  :style="{height:countHeight}">
          <div class="rightContDoc" ref="rightContDoc">
            <base-info class="marb  bg jbxx" :cardId="cardId"></base-info>
            <import-info class="marb  bg zdlx"  :cardId="cardId"></import-info>
            <involve-case-info class="marb bg saxx" :cardId="cardId"></involve-case-info>
            <punish-info class="marb bg xzcf" :cardId="cardId"></punish-info>
            <trajectory class="marb bg zxgj" :cardId="cardId"></trajectory>
            <relation-mesh class="marb  bg gxwj" :cardId="cardId"></relation-mesh>
            <car-info class="marb bg clxx" :cardId="cardId"></car-info>
            <service-info class="marb bg fwxx" :cardId="cardId"></service-info>
            <div class="marb sbrs" >
              <div class="cell_title">
                <span class="small_line"></span>
                <span class="text">社保人事</span>
              </div>
              <social-security class="marb bg sbrs" :cardId="cardId"></social-security>
            </div>
          </div>
        </el-col>
     </el-row>
  </div>
  </div>
</template>

<script>
import LeftNav from './components/leftNav' // 左侧菜单
import BaseInfo from './components/baseInfo' // 右侧--基本信息
import ImportInfo from './components/ImportInfo' // 右侧--重点类别信息
import RelationMesh from './components/relationMesh' // 右侧--关系挖掘
import InvolveCaseInfo from './components/involveCaseInfo' // 右侧--涉案信息
import PunishInfo from './components/punishInfo' // 右侧--行政处罚信息
import Trajectory from './components/trajectory' // 右侧--最近轨迹
import CarInfo from './components/carInfo' // 右侧--车辆信息
import ServiceInfo from './components/serviceInfo' // 右侧--服务信息
import SocialSecurity from './components/socialSecurity' // 右侧--社保人事
import $ from 'jquery'
export default {
  name: 'personnelFile',
  data() {
    return {
      countHeight: document.documentElement.clientHeight - 130 + 'px',
      cardId: '', // 从详情页面返回的是身份证号码、案件编号或线索编号
      classList: ['jbxx', 'zdlx', 'saxx', 'xzcf', 'zxgj', 'gxwj', 'clxx', 'fwxx', 'sbrs']
    }
  },
  components: {
    LeftNav,
    BaseInfo,
    ImportInfo,
    RelationMesh,
    InvolveCaseInfo,
    PunishInfo,
    Trajectory,
    CarInfo,
    ServiceInfo,
    SocialSecurity
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
    }
  },
  created() {
    if (this.$route.query.cardId) { // 正式
      this.cardId = this.$route.query.cardId
    }
    // 测试
    // this.cardId = '152224199005230516'
  },
  mounted() {
    const _this = this
    document.querySelector('.rightCont').addEventListener('scroll', _this.handleScroll) // 监听滚动条变化
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    if (this.$route.query.cardId) { // 正式
      this.cardId = this.$route.query.cardId
    }
    document.querySelector('.rightCont').addEventListener('scroll', this.handleScroll) // 监听滚动条变化
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.leftCont {
  width: 15%;
  overflow: auto;
  margin-right: 20px;
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
    width: 83.3%;
  }

@media only screen and (max-width: 1367px) {
  .leftCont {
    width: 17.5%;
  }
  .rightCont {
    width: 80%;
  }
}
</style>

