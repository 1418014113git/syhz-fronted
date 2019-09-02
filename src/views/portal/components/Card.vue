
<template>
  <el-col :span="colSpan" class="carddiv" :class="cls">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-if="content!=='Gndh'">
        <!-- <img class="iconImg" :src="icon"> -->
        <span>{{title}}</span>
        <el-button v-if="moreBtn !== '' && more !== ''" style="float: right; padding: 3px 0;color: #bce8fc;text-shadow: 0 0 2px #fff;" type="text" @click="toMore(more)">{{moreBtn}}</el-button>
      </div>

      <e-chart v-if="content=='Echart'"></e-chart>
      <community-data-echart v-else-if="content=='CommunityDataEchart'"></community-data-echart>
      <carousel v-else-if="content=='Carousel'"></carousel>
      <list v-else-if="content=='List'"></list>
      <tab v-else-if="content=='Tab'"></tab>
      <high v-else-if="content=='High'"></high>
      <work v-else-if="content=='Work'"></work>
      <statistical v-else-if="content=='Statistical'"></statistical>
      <an-jian v-else-if="content=='AnJian'"></an-jian>
      <gndh v-else-if="content=='Gndh'"></gndh>
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
      Gndh
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
          if (arr[0] === 'tztg') {
            localStorage.setItem('curAppCode', '001')
          }
        }
        this.$router.push({ path: val })
      }
    }
  }
</script>

<style scoped>
.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}

.clearfix:after {
	clear: both;
}

.box-card {
  height: 340px;
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
@media screen and (min-width:1368px) and (max-width:1600px){
	.carddiv .el-button {
    margin-right: 5px;
  }
}
</style>
