
<template>
  <el-col :span="colSpan" class="carddiv" :class="cls">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-if="content==='Gndh'">
        <span class="zxbz">
          <img src="/static/image/portal_newImg/zxbz.png">
          <span @click="clickHovList">在线帮助</span>
        </span>
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0;color: #bce8fc;text-shadow: 0 0 2px #fff;" type="text" @click="addMenu">{{moreBtn}}</el-button>
      </div>
      <!-- 11.21 破案案件统计 -->
      <div slot="header" class="clearfix" v-else-if="content==='Statistical'">
        <span class="phajtj">
          <el-tooltip effect="dark" content="统计本年度破获案件数量" placement="top-start">
            <img src="/static/image/portal_newImg/zxbz.png">
          </el-tooltip>
        </span>
        <span>{{title}}</span>
        <el-button v-if="moreBtn !== '' && more !== ''" style="float: right; padding: 3px 0;color: #bce8fc;text-shadow: 0 0 2px #fff;" type="text" @click="toMore(more)">{{moreBtn}}</el-button>
      </div>
      <!-- 11.21 高发案件类别 -->
      <div slot="header" class="clearfix" v-else-if="content==='High'">
        <span class="phajtj">
          <el-tooltip effect="dark" content="统计最近12个月内前6个月和后6个月立案的高发案件环比情况" placement="top-start">
            <img src="/static/image/portal_newImg/zxbz.png">
          </el-tooltip>
        </span>
        <span>{{title}}</span>
        <el-button v-if="moreBtn !== '' && more !== ''" style="float: right; padding: 3px 0;color: #bce8fc;text-shadow: 0 0 2px #fff;" type="text" @click="toMore(more)">{{moreBtn}}</el-button>
      </div>
      <div slot="header" class="clearfix" v-else>
        <span>{{title}}</span>
        <el-button v-if="moreBtn !== '' && more !== ''" style="float: right; padding: 3px 0;color: #bce8fc;text-shadow: 0 0 2px #fff;" type="text" @click="toMore(more)">{{moreBtn}}</el-button>
      </div>

      <e-chart v-if="content=='Echart'"></e-chart>
      <community-data-echart v-else-if="content=='CommunityDataEchart'"></community-data-echart>
      <carousel v-else-if="content=='Carousel'"></carousel>
      <list ref="noticeList" v-else-if="content=='List'"></list>
      <tab v-else-if="content=='Tab'"></tab>
      <high v-else-if="content=='High'"></high>
      <work v-else-if="content=='Work'"></work>
      <statistical v-else-if="content=='Statistical'"></statistical>
      <an-jian v-else-if="content=='AnJian'"></an-jian>
      <gndh v-else-if="content=='Gndh'"></gndh>
      <exam v-else-if="content=='Exam'"></exam>
      <train v-else-if="content=='Train'"></train>
    </el-card>
  </el-col>
</template>
<script>
import EChart from './EChart'
import Carousel from './Carousel'
import List from './List'
import Tab from './Tab'
import High from './High'
import Rank from './Rank'
import Work from './Work'
import CommunityDataEchart from './CommunityDataEchart'
import Statistical from './Statistical'
import AnJian from './AnJian'
import Gndh from './Gndh'
import Exam from './Exam'
import Train from './Train'

export default {
  components: {
    EChart,
    Carousel,
    List,
    Tab,
    High,
    Rank,
    Work,
    CommunityDataEchart,
    Statistical,
    AnJian,
    Gndh,
    Exam,
    Train
  },
  name: 'Card',
  props: {
    colSpan: {
      type: Number,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: ''
    },
    moreBtn: {
      type: String,
      default: ''
    },
    more: {
      type: String,
      default: ''
    }
  },
  methods: {
    toMore(val) {
      const arr = val.substring(1, val.length).split('/')
      if (arr.length > 0) {
        if (arr[0] === 'zhyp') {
          localStorage.setItem('curAppCode', '002')
        }
        if (arr[0] === 'notice') {
          localStorage.setItem('curAppCode', 'C')
        }
      }
      if (arr[0] === 'notice') {
        const para = {}
        if (this.$refs.noticeList.curIndex === 1) {
          para.signStatus = '1'
        }
        this.$gotoid(val, JSON.stringify(para))
      } else {
        this.$router.push({ path: val })
      }
    },
    addMenu() {
      this.$store.dispatch('ClickAll', true)
    },
    clickHovList() {
      this.$router.push({ path: '/micro/difficult' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.carddiv {
  width: 32.6%;
}
.carddiv:nth-child(1),
.carddiv:nth-child(2),
.carddiv:nth-child(3),
.carddiv:nth-child(4),
.carddiv:nth-child(5),
.carddiv:nth-child(6) {
  margin-bottom: 15px;
}

.carddiv:nth-child(2),
.carddiv:nth-child(5),
.carddiv:nth-child(8) {
  margin-left: 1%;
  margin-right: 1%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  height: 350px;
  margin: 0;
}
.iconImg {
  margin-right: 3px;
}
.dbaj {
  width: 17px;
  height: 20px;
}
.gfaj,
.jgph,
.laba {
  width: 20px;
  height: 20px;
}
.ajzs {
  width: 18px;
  height: 18px;
}
.community {
  width: 18px;
  height: 18px;
}
.grdb {
  width: 17px;
  height: 20px;
}
.Echart .el-card__header div {
  padding-left: 60px;
}
.zxbz {
  float: left;
  font-weight: initial;
  font-size: 14px;
  cursor: pointer;
  img {
    width: 14px;
  }
}
.phajtj {
  float: left;
  font-weight: initial;
  cursor: pointer;
  img {
    width: 18px;
  }
}
.Exam .el-card__header .el-button {
  margin-right: 15px !important;
}

.List {
  .el-card__header {
    padding: 8px 15px 8px 70px;
  }
}
// .Statistical {
//   .el-card__header {
//     padding: 8px 15px 8px 70px;
//   }
// }
.Exam {
  .el-card__header {
    padding: 8px 5px 8px 70px;
  }
}
.Tab {
  .el-card__header {
    padding: 8px 5px 8px 30px;
  }
}
// .High {
//   .el-card__header {
//     padding: 8px 5px 8px 76px;
//   }
// }
.Echart {
  .el-card__header {
    padding: 8px 15px 5px 17px;
  }
}
.Train {
  .el-card__header {
    padding: 8px 15px 5px 60px;
  }
}

@media screen and (min-width: 1368px) and (max-width: 1600px) {
  .carddiv .el-button {
    margin-right: 5px;
  }
}
@media only screen and (max-width: 1367px) {
  .zxbz {
    font-size: 12px;
  }
}
</style>
