<template>
  <div class="classRoom_learningIntegral">
    <el-card class="caseEdit">
      <p><strong>我的积分</strong><i class="el-icon-info"></i> 学习知识库资料和在线课堂资料都可以积分！</p>
      <div class="totalCount">
        <span>成长总积分<i>{{total.systembranchCount}}</i></span>
        <span>|</span>
        <span>总积分排名<i>{{total.systemOrder}}</i></span>
        <span><el-button type="text" v-if="$isViewBtn('139004')" @click="detail">积分明细 >></el-button></span>
      </div>
      <p><strong>当月排名</strong></p>
      <div class="count">
        <span><strong>人数：{{total.dayUserCount}} 人</strong></span>
        <span><strong>我的积分：{{total.daybranchCount}}</strong></span>
        <span><strong>我的排名：{{total.dayOrder}}</strong></span>
        <span><el-button type="text" icon="el-icon-menu" v-if="$isViewBtn('139004')" @click="monthMore">更多 >></el-button></span>
      </div>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="monthRecords" v-loading="loading" style="width: 100%;">
          <el-table-column type="index" label="排名" width="100"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="dept" label="所在单位"></el-table-column>
          <el-table-column prop="fractionNumber" label="积分数"></el-table-column>
        </el-table>
      </el-row>
      <p><strong>总分排名</strong></p>
      <div class="count">
        <span><strong>人数：{{total.systemUserCount}} 人</strong></span>
        <span><strong>我的积分：{{total.systembranchCount}}</strong></span>
        <span><strong>我的排名：{{total.systemOrder}}</strong></span>
        <span><el-button type="text" icon="el-icon-menu" v-if="$isViewBtn('139004')" @click="totalMore">更多 >></el-button></span>
      </div>
      <el-row type="flex" justify="center" style="margin-top:15px;">
        <el-table :data="totalRecords" v-loading="loading" style="width: 100%;">
          <el-table-column type="index" label="排名" width="100"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="dept" label="所在单位"></el-table-column>
          <el-table-column prop="fractionNumber" label="积分数"></el-table-column>
        </el-table>
      </el-row>
      <p><strong>赚取积分</strong></p>
      <div class="zIntegral">
        <div v-for="(item, index) in dayFraction" :key="item.index">
          <img :src="'/static/image/online/type' + index + '.png'">
          <span>{{item.ruleName}}</span>
          <span class="small">{{item.ruleDescribe.replace('*时长', (item.ruleTime / 60 + '分钟'))}}<i>+{{item.oneNumber}}</i></span>
          <div class="progress-bar" :style="item.ruleType === 2 ? 'margin-top: 13px;' : ''">
            <div class="bar has-rotation has-colors red heat-gradient" role="progressbar">
              <div class="bar-face face-position back percentage">
                <span>{{item.dayFraction}}分/{{item.maxNumber}}分</span>
              </div>
              <div class="bar-percentage" :style="'width:' + ((item.dayFraction/item.maxNumber).toFixed(2) * 100) + '%' "></div>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="toGo(item.ruleType)" class="saveBtn" :disabled="item.dayFraction >= item.maxNumber">
              <span v-if="item.dayFraction >= item.maxNumber">已完成</span>
              <span v-else>
                <span v-if="item.ruleType === 0">已完成</span>
                <span v-if="item.ruleType === 1">去看看</span>
                <span v-if="item.ruleType === 2">去上传</span>
                <span v-if="item.ruleType === 3">去下载</span>
                <span v-if="item.ruleType === 4">去学习</span>
              </span>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style>
  .classRoom_learningIntegral .progress-bar{
    background: none;
    width: 100%;
    -webkit-box-shadow: none;
    margin-top: 30px;
  }
  .classRoom_learningIntegral .bar{font-size:1em;position:relative;display:inline-block;width:75%;height:15px;transition:all .5s ease-in-out;border-radius:60px;}
  .classRoom_learningIntegral .bar .bar-face{position:absolute;bottom:0;left:0;display:inline-block;box-sizing:border-box;width:100%;height:100%;background-color:#b1b1b1;backface-visibility:visible;transition:transform .5s ease-out;border-radius:60px}
  .classRoom_learningIntegral .bar .bar-face.percentage:before{content:'';position:absolute;bottom:0;width:0;height:100%;margin:0;display:block;box-sizing:border-box;color:rgba(68,68,68,.8);transition:all .5s ease-out;border-radius:60px}
  .classRoom_learningIntegral .bar .bar-percentage{
    height: 100%;
    background: -moz-linear-gradient(left, rgb(243, 194, 39), rgb(212, 108, 2));
    background: -o-linear-gradient(left, rgb(243, 194, 39), rgb(212, 108, 2));
    background: -ms-linear-gradient(left, rgb(243, 194, 39), rgb(212, 108, 2));
    background: linear-gradient(to right, rgb(243, 194, 39), rgb(212, 108, 2));
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$color1', endColorstr='$color2', GradientType=1);
    background-size: 42em;
    position: absolute;
    border-radius: 60px;
  }
  .classRoom_learningIntegral .bar.heat-gradient .percentage > span{
    color: #fff;
    z-index: 99;
    position: relative;
    top: -2px;
    left: 0;
  }
  .classRoom_learningIntegral .btn{
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }

  .classRoom_learningIntegral .zIntegral > div{
    float: left;
    width: 20%;
    background: rgba(0, 89, 130, 0.7);
    padding: 30px 30px;
    margin: 0 52px 10px 15px;
    text-align: center;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(1) > img{
    width: 30%;
    height: 58px;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(2) > img{
    width: 44%;
    height: 58px;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(3) > img{
    width: 36%;
    height: 58px;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(4) > img{
    width: 45%;
    height: 58px;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(5) > img{
    width: 34%;
    height: 58px;
  }
  .classRoom_learningIntegral .zIntegral > div:nth-child(4n){
    margin-right: 15px;
  }
  .classRoom_learningIntegral .zIntegral > div > span{
    width: 100%;
    display: inline-block;
    text-align: center;
    padding: 10px 0 2px 0;
  }
  .classRoom_learningIntegral .zIntegral > div > span.small{
    font-size: 12px;
    color: #ccc;
  }
  .classRoom_learningIntegral .zIntegral > div > span.small > i{
    font-style: normal;
    color: #ff8511;
  }
</style>

<script>
  export default {
    data() {
      return {
        loading: false,
        monthRecords: [],
        total: {
          systemOrder: 0,
          systemUserCount: 0,
          systembranchCount: 0,
          daybranchCount: 0,
          dayOrder: 0,
          dayUserCount: 0
        },
        totalRecords: [],
        dayFraction: []
      }
    },
    methods: {
      queryTotal() {
        this.loading = true
        const para = this.$setCurrentUser({})
        this.$query('fractionlog', { id: para.creationId, pageSize: 5, pageNum: 1 }).then(response => {
          this.total = response.data.fraction
          this.monthRecords = response.data.monthRank.list
          this.totalRecords = response.data.systemRank.list
          this.dayFraction = response.data.dayFraction
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      monthMore() {
        this.$gotoid('/micro/integralMonth')
      },
      totalMore() {
        this.$gotoid('/micro/integralTotal')
      },
      detail() {
        this.$gotoid('/micro/integralDetail')
      },
      toGo(ruleType) {
        if (ruleType === 0) {
          this.$gotoid('/micro/onlineClassRoom')
        }
        if (ruleType === 1) {
          this.$gotoid('/micro/onlineClassRoom')
        }
        if (ruleType === 2) {
          this.$gotoid('/micro/onlineClassRoom')
        }
        if (ruleType === 3) {
          this.$gotoid('/micro/onlineClassRoom')
        }
        if (ruleType === 4) {
          this.$gotoid('/micro/onlineClassRoom')
        }
      }
    },
    mounted() {
      this.queryTotal()
    }
  }
</script>
<style>
  .classRoom_learningIntegral p{
    margin-top: 35px;
    margin-bottom: 20px;
  }
  .classRoom_learningIntegral p:first-child{
    margin-top: 10px;
  }
  .classRoom_learningIntegral p span{
    color: #ff8511;
    font-weight: bold;
    margin: 0 5px;
  }
  .classRoom_learningIntegral p strong{
    margin-right: 20px;
    font-size: 18px;
  }
  .classRoom_learningIntegral .totalCount{
    width: 100%;
    padding: 20px;
    background: rgba(0, 89, 130, 0.7);
  }
  .classRoom_learningIntegral .totalCount > span{
    display: inline-block;
    width: 20%;
    text-align: center;
  }
  .classRoom_learningIntegral .totalCount > span:nth-child(2){
    width: 20px;
    margin: 0;
  }
  .classRoom_learningIntegral .totalCount > span > i {
    font-style: normal;
    color: #ff8511;
    font-weight: bold;
    margin-left: 40px;
  }
  .classRoom_learningIntegral .totalCount > span:first-child > i{
    color: #fff;
  }
  .classRoom_learningIntegral .totalCount > span:last-child{
    float: right;
    text-align: right;
    cursor: pointer;
  }
  .classRoom_learningIntegral .totalCount > span:last-child:hover{
    color: rgb(75, 173, 219);
  }
  .classRoom_learningIntegral .count {
    width: 100%;
    padding: 6px 10px;
    background: rgba(0, 89, 130, 0.7);
  }
  .classRoom_learningIntegral .count > span{
    display: inline-block;
    width: 18%;
  }
  .classRoom_learningIntegral .count > span:first-child{
    width: 15%;
  }
  .classRoom_learningIntegral .count > span:last-child{
    float: right;
    text-align: right;
    cursor: pointer;
  }
  .classRoom_learningIntegral .count > span strong{
    font-size: 16px;
  }
  .classRoom_learningIntegral .el-table__row .cell span{
    display: inline-block;
    width: 40%;
  }
  .classRoom_learningIntegral .el-table__header th{
    border-bottom: 1px solid #ebeef5;
  }
</style>
