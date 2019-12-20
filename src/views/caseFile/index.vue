<template>
<!-- 案件档案升级主界面 -->
  <div>
    <el-row>
      <img src="@/assets/icon/back.png" class="goBack" @click="toback">   <!--返回-->
    </el-row>
    <div class="caseFile">
      <el-row style="position:relative;">
        <!-- 左侧导航区 -->
          <el-col class="leftCont" :span="4" :style="{height:countHeight}">
            <left-nav class="bg" :ajbh="AJBH" ></left-nav>
          </el-col>
          <!-- 右侧内容区 -->
          <el-col :span="20" class="rightCont"  :style="{height:countHeight}">
            <div class="rightContDoc" ref="rightContDoc" style="position:relative;">
              <aj-title class="fixTitle bg ajxx" :AjInfo="ajInfo" :ajbh="AJBH" :ajid="AJID" :type="interfaceType" :Rl="isRl" :style="{width:fixTitleWith}"></aj-title>
              <aj-info class="marb bg ajxx" :AjInfo="ajInfo" :ajbh="AJBH" :ajid="AJID" :type="interfaceType" :Rl="isRl" style="margin-top:60px;" ></aj-info>
              <aj-status class="marb bg ajjd" :AjInfo="ajInfo" :ajbh="AJBH" ></aj-status>
              <aj-synopsis  class="marb bg ajgg" :info="ajInfo" :bh="AJBH" :ajid="AJID" :type="interfaceType" :Rl="isRl"></aj-synopsis>
              <guide-detect class="marb ydzc" :ajbh="AJBH" :AjInfo="ajInfo"></guide-detect>
              <fa-address class="marb bg fadz" :AjInfo="ajInfo" :ajbh="AJBH"  :ajid="AJID"  :type="interfaceType" :Rl="isRl"></fa-address>
              <relation-mesh class="marb bg swkx" :ajbh="AJBH" :ajid="AJID" :type="interfaceType" :Rl="isRl"></relation-mesh>
              <info-supplement class="marb xxbc" :info="ajInfo" :ajbh="AJBH"></info-supplement>
              <bz-push class="marb bzts" :ajbh="AJBH"></bz-push>
              <receive-police class="marb bg jcj" :ajbh="AJBH"></receive-police>
              <!--<clues-associate class="marb xsgl" :info="ajInfo" :ajbh="AJBH"></clues-associate>-->
              <spyon-cooperation class="marb zcxz" :ajbh="AJBH" :ajid="AJID" :type="interfaceType" :Rl="isRl"></spyon-cooperation>
              <aj-parallel class="marb ajcb" :ajbh="AJBH"></aj-parallel>
            </div>
          </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LeftNav from './components/leftNav' // 左侧菜单
import AjTitle from './components/ajTitle' // 右侧--案件信息
import AjInfo from './components/ajInfo' // 右侧--案件信息
import AjStatus from './components/ajStatus' // 右侧--案件进度
import AjSynopsis from './components/ajSynopsis' // 右侧--案件梗概
import guideDetect from './components/guideDetect' // 右侧--引导侦查
import FaAddress from './components/faAddress' // 右侧--发案地址
import RelationMesh from './components/relationMesh' // 右侧--关系挖掘
import InfoSupplement from './components/infoSupplement' // 信息补采
import BzPush from './components/bzPush' // 右侧--比中推送
import ReceivePolice from './components/receivePolice' // 接处警
// import CluesAssociate from './components/cluesAssociate' // 线索关联
import SpyonCooperation from './components/spyonCooperation' // 侦查协作
import AjParallel from './components/ajParallel' // 案件串并

import { getAJJBXXSYHID, getAjJbxxEtlAjbh } from '@/api/caseManage'
import $ from 'jquery'
export default {
  name: 'caseFile',
  data() {
    return {
      countHeight: document.documentElement.clientHeight - 160 + 'px',
      classList: [ // 模块类名
        // 'ajxx', // 案件信息
        // 'ajjd', // 案件进度
        'ajgg', // 案件梗概
        'ydzc', // 引导侦查
        'fadz', // 发案地址
        'swkx', // 关系挖掘
        'xxbc', // 信息补采
        'bzts', // 比中推送
        'jcj', // 接处警
        // 'xsgl', // 线索关联
        'zcxz', // 侦查协作
        'ajcb' // 案件串并
      ],
      AJBH: '', // 案件编号
      AJID: '', // 案件id
      ajInfo: {}, // 基础信息
      carryParam: {}, // 跳转过来的传参
      interfaceType: '',
      isRl: '',
      fixTitleWith: null
    }
  },
  components: {
    LeftNav,
    AjTitle,
    AjInfo,
    AjSynopsis,
    guideDetect,
    AjStatus,
    RelationMesh,
    FaAddress,
    InfoSupplement,
    ReceivePolice,
    // CluesAssociate,
    SpyonCooperation,
    BzPush,
    AjParallel
  },
  computed: {
    getIstotop() {
      if (this.$store.state.app.ajdatotop) {
        return this.$store.state.app.ajdatotop
      }
    },
    getUserIcons() {
      return this.$store.state.app.istotop
    }
  },
  watch: {
    getIstotop(val) {
      // 监听state状态变化
      if (val) {
        this.jump(val)
      }
    },
    getUserIcons(val) { // 监听state状态变化
      if (val === 1 && document.querySelector('.rightCont').scrollTop > 0) {
        document.querySelector('.rightCont').scrollTop = 0
      }
    }
  },
  methods: {
    jump(val) {
      if (val === 'ajgg') { // 案件梗概
        $('.rightCont').animate({ scrollTop: 0 }, 0)
      } else {
        var total = document.querySelector('.' + val).offsetTop
        $('.rightCont').animate({ scrollTop: total }, 0)
      }
    },
    toback() {
      window.history.go(-1)
    },
    // 监听滚动条变化
    handleScroll() {
      this.$store.dispatch('Ajdatotop', '')
      var documentHeight = this.$refs.rightContDoc.offsetHeight
      var difference = documentHeight - (document.documentElement.clientHeight - 130)
      if (document.querySelector('.rightCont').scrollTop > 0) { // 如何滚动条顶部距离>0,则将状态ToTop初始化为0
        this.$store.dispatch('ToTop', 0)
      }
      for (var i = 0; i < this.classList.length - 1; i++) {
        if (document.querySelector('.rightCont').scrollTop === 0) {
          this.$store.dispatch('AjMouleClass', this.classList[0])
        } else if (document.querySelector('.rightCont').scrollTop >= document.querySelector('.' + this.classList[i]).offsetTop - 10 && document.querySelector('.rightCont').scrollTop < difference) {
          this.$store.dispatch('AjMouleClass', this.classList[i])
        } else if (document.querySelector('.rightCont').scrollTop === difference + 20) {
          // console.log('到底了')
          if (window.screen.width > 1366) {
            this.$store.dispatch('AjMouleClass', this.classList[6])
          } else {
            this.$store.dispatch('AjMouleClass', this.classList[8])
          }
        }
      }
    },
    init() { // 根据参数类型，请求不同的接口
      if (this.$route.query.id) {
        this.AJID = this.$route.query.id
        if (this.$route.query.isRl) {
          this.isRl = this.$route.query.isRl
        }
        this.detail(this.$route.query.id)
      } else if (this.$route.query.ajbh && this.$route.query.interfaceType === 'etl') { // 待认领的,包括下发撤销等，请求的接口是带有etl的
        this.interfaceType = this.$route.query.interfaceType
        this.detailAjbh(this.$route.query.ajbh)
      } else if (this.$route.query.ajbh && this.$route.query.isRl === '1') { // 已认领的
        this.isRl = this.$route.query.isRl
        this.detailYrlByAjbh(this.$route.query.ajbh)
      }
      // 测试
      // this.detail(1724)
      // this.detailAjbh('J1529220211116100002')
    },
    detail(id) {
      this.loading = true
      const para = {
        id: id
      }
      getAJJBXXSYHID(para).then((response) => {
        this.loading = false
        if (response.data) {
          this.ajInfo = response.data
          this.AJBH = response.data.AJBH
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detailAjbh(id) { // 通过案件编号 查询待认领的案件详情
      this.loading = true
      const para = {
        AJBH: id
      }
      getAjJbxxEtlAjbh(para).then((response) => {
        this.loading = false
        if (response.data) {
          this.ajInfo = response.data
          this.AJBH = response.data.AJBH
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detailYrlByAjbh(ajbh) { // 通过案件编号 查询已认领的案件详情
      this.$query('ajjbxxsyh/' + ajbh, {}).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          if (res.data) {
            this.ajInfo = res.data
            this.AJBH = res.data.AJBH
          }
        }
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.init()
  },
  mounted() {
    const _this = this
    document.querySelector('.rightCont').addEventListener('scroll', _this.handleScroll) // 监听滚动条变化
    // console.log(document.querySelector('.rightCont').offsetWidth)
    this.fixTitleWith = document.querySelector('.rightCont').offsetWidth - 7 + 'px'
  },
  activated: function() { // 因为查询页被缓存，所以此页面需要此生命周期下才能刷新数据
    document.querySelector('.rightCont').addEventListener('scroll', this.handleScroll) // 监听滚动条变化
    this.fixTitleWith = document.querySelector('.rightCont').offsetWidth - 7 + 'px'
    this.AJBH = ''
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.caseFile {
  .leftCont {
    width: 14%;
    overflow: auto;
    margin-right: 20px;
  }
  .rightCont {
    width: 84.3%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }

  .marb {
    margin-bottom: 20px;
  }
  .bg {
    background-color: rgba(0, 64, 94, 0.7);
    border-radius: 8px;
  }
  .cell_title {
    margin: 0 0 10px 5px;
    .text {
      line-height: 20px;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      margin-left: 3px;
      font-size: 17px;
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
    .no_data_title {
      color: #586d7e;
      text-shadow: none;
    }
  }
  .goBack {
    margin: 0 10px 5px 0;
  }
  .toolbar {
    margin: 2px 0 0 !important;
  }
  .whiteColor {
    color: #fff;
  }
  .bg1,
  .bg2,
  .bg3,
  .bg4,
  .bg5,
  .bg6 {
    padding: 2px 10px;
    background-blend-mode: normal, normal;
    border-radius: 4px;
    margin-right: 6px;
    font-size: 14px;
    word-break: keep-all;
  }
  .bg1 {
    background-image: linear-gradient(90deg, #fe595d 0%, #f789a6 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .bg2 {
    background-image: linear-gradient(140deg, #138fb8 0%, #53c7e0 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .bg3 {
    background-image: linear-gradient(140deg, #40a954 0%, #20e1aa 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .bg4 {
    background-image: linear-gradient(140deg, #177ce0 0%, #54afe0 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .bg5 {
    background-image: linear-gradient(140deg, #6e3ec8 0%, #8f55d5 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .bg6 {
    background-image: linear-gradient(140deg, #ff7a04 0%, #fdbc22 100%),
      linear-gradient(#ff8547, #ff8547);
  }
  .ajlx {
    height: 23px;
    line-height: 18px;
    margin-right: 6px;
    font-size: 14px;
    word-break: keep-all;
    display: inline-block;
  }
  .ellipsis-word {
    height: 23px;
  }
  .prt {
    padding-right: 15px;
  }
  .breakall {
    word-break: break-all;
  }
  .fixTitle{
    position:fixed;
    top:152px;
    left:16.2%;
    right:0;
    z-index:999;
    background:rgba(0, 64, 94, 1)
  }
  @media only screen and (max-width: 1367px) {
    .leftCont {
      width: 17%;
    }
    .rightCont {
      width: 80.6%;
    }
    .fixTitle {
      left: 19.5%;
    }
  }
}
</style>

