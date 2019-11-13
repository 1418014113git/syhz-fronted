<template>
<!-- 集群战役详情 -->
  <div class="mainDetail">
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
     <div class="personnelFile">
     <el-row>
       <!-- 左侧导航区 -->
        <el-col class="leftCont" :span="3" :style="{height:countHeight}">
          <left-nav class="bg"  :cardId="cardId"></left-nav>
        </el-col>
        <!-- 右侧内容区 -->
        <el-col :span="21" class="rightCont"  :style="{height:countHeight}">
          <div class="rightContDoc" ref="rightContDoc">
            <base-info class="marb bg jbxx" :cardId="cardId"></base-info>
            <!-- <verify-info class="marb bg shxx" :cardId="cardId"></verify-info>
            <area-sign class="marb bg dsqs" :cardId="cardId"></area-sign>
            <area-back class="marb bg dsfk" :cardId="cardId"></area-back>
            <county-sign class="marb bg qxqs" :cardId="cardId"></county-sign>
            <county-back class="marb bg qxfk" :cardId="cardId"></county-back> -->
          </div>
        </el-col>
     </el-row>
  </div>
  </div>
</template>

<script>
import LeftNav from './components/leftNav' // 左侧菜单
import BaseInfo from './components/baseInfo' // 右侧--基本信息
// import VerifyInfo from './components/verifyInfo' // 右侧--审核信息
// import AreaSign from './components/areaSign' // 右侧--地市签收
// import AreaBack from './components/areaBack' // 右侧--地市反馈
// import CountySign from './components/countySign' // 右侧--区县签收
// import CountyBack from './components/countyBack' // 右侧--区县反馈
import $ from 'jquery'
export default {
  name: 'personnelFile',
  data() {
    return {
      countHeight: document.documentElement.clientHeight - 130 + 'px',
      cardId: '', // 从详情页面返回的是身份证号码、案件编号或线索编号
      classList: ['jbxx', 'shxx', 'dsqs', 'dsfk', 'qxqs', 'qxfk']
    }
  },
  components: {
    LeftNav,
    BaseInfo
    // VerifyInfo,
    // AreaSign,
    // AreaBack,
    // CountySign,
    // CountyBack
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
  }
  .rightCont {
    // width: 80%;
  }
}
</style>

