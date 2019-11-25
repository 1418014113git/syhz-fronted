<template>
  <section class="gfajTab">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="高发案件类别" name="first"> -->
        <div>
          <!-- <el-button type="primary" plain class="morebutton" @click="moreGFAJ">更多</el-button> -->
          <ul class="portal_high_ul" v-loading="loading" v-if="listData.length > 0">
            <li v-for="(data,index) in listData" class="portal_high_li" :key="index">
              <div class="flexParent">
                <p class="ellipsis-word texts">
                  <span v-if="index < 3" class="num b_color_409EFF">{{ index + 1}}</span>
                  <span v-else class="num b_color_656565">{{ index + 1}}</span>
                  <span class="listTit" @click="toAJList(data.ajlb_text)" >{{data.ajlb_text}}</span>
                </p>
                <div class="compare flexParent">
                  <p>环比
                    <span v-if="data.tb_upDown < 0" class="down">{{ data.tb_ratio }}% <i class="downIcon"></i></span>
                    <span v-if="data.tb_upDown > 0" class="up">{{ data.tb_ratio }}% <i class="upIcon"></i></span>
                    <span v-if="data.tb_upDown === 0">{{ data.tb_ratio }}%</span>
                  </p>
                  <!--<p>环比-->
                    <!--<span v-if="data.hb_upDown === 0" class="down">{{ data.hb_ratio }}% <i class="downIcon"></i></span>-->
                    <!--<span v-if="data.hb_upDown === 1" class="up">{{ data.hb_ratio }}% <i class="upIcon"></i></span>-->
                  <!--</p>-->
                </div>
              </div>
            </li>
          </ul>
          <div v-else style="line-height: 260px; text-align: center; color: #fff;font-size:15px;">
            暂无数据
          </div>
        </div>
      <!-- </el-tab-pane>
      <el-tab-pane label="罪名统计" name="second">罪名统计</el-tab-pane>
      <el-tab-pane label="细类统计" name="third">细类统计</el-tab-pane>
    </el-tabs> -->
  </section>
</template>

<script>
import { getHeightCaseTypeList } from '@/api/portal'
export default {
  name: 'List',
  data() {
    return {
      activeName: 'first',
      loading: true,
      listData: [
        // { 'ajlb_text': '升级版盾构机模型限量涉嫌造假案', 'tb_ratio': '10', 'hb_ratio': '10' },
        // { 'ajlb_text': '升级版盾构机模型限量涉嫌造假案', 'tb_ratio': '10', 'hb_ratio': '10' },
        // { 'ajlb_text': '升级版盾构机模型限量涉嫌造假案', 'tb_ratio': '10', 'hb_ratio': '10' },
        // { 'ajlb_text': '升级版盾构机模型限量涉嫌造假案', 'tb_ratio': '10', 'hb_ratio': '10' },
        // { 'ajlb_text': '升级版盾构机模型限量涉嫌造假案', 'tb_ratio': '10', 'hb_ratio': '10' }
      ]
    }
  },
  methods: {
    handleClickTab(tab, event) {
      // console.log(tab, event)
    },
    moreGFAJ() {
      this.$router.push('/zhyp/hightCaseTrend')
    },
    query() {
      const para = {

      }
      getHeightCaseTypeList(para).then((response) => {
        const data = response.data
        data.forEach(function(item, index) {
          item.tb_upDown = item.ajlbNum - item.ajlbNum2
          item.hb_upDown = item.ajlbNum - item.ajlbNum3
          item.tb_ratio = item.ajlbNum2 === 0 ? item.ajlbNum * 100 : Math.abs(parseInt((item.ajlbNum - item.ajlbNum2) / item.ajlbNum2 * 100))
          item.hb_ratio = item.ajlbNum3 === 0 ? item.ajlbNum * 100 : Math.abs(parseInt((item.ajlbNum - item.ajlbNum3) / item.ajlbNum3 * 100))
        })
        this.listData = data
        this.loading = false
      })
    },
    toAJList(ajlb) {
      localStorage.setItem('curAppCode', 'B')
      this.$router.push({
        path: '/caseManage',
        query: {
          ajlbName: ajlb
        }
      })
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.gfajTab {
  .portal_high_ul .portal_high_li {
    width: 100%;
    list-style: none;
    display: inline-block;
    margin-bottom: 25px;
  }
  .portal_high_ul .portal_high_li span.num {
    color: #fff;
    display: inline-block;
    margin: 3px 0 0 0;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 3px;
  }
  .flexParent {
    display: flex;
    justify-content: space-between;
  }
  .b_color_656565 {
    background-image: linear-gradient(0deg, #4b4b4b 0%, #6f6f6f 100%);
  }
  .b_color_409EFF {
    background-image: linear-gradient(0deg, #004d8e 0%, #64bbe9 100%);
  }
  .up {
    color: #da0000;
  }
  .down {
    color: #41ad42;
  }
  .up i,
  .down i {
    font-weight: bolder;
  }
  .el-tabs__content {
    max-height: 280px;
    overflow-y: scroll;
  }
  .morebutton {
    float: right;
  }
  .texts {
    width: 60%;
    color: #fff;
    overflow: hidden;
    padding-right: 10px;
  }
  .listTit {
    cursor: pointer;
  }
  .listTit:hover {
    color: #3da1ff;
  }
  .compare {
    color: #fff;
    font-size: 12px;
    p {
      display: inline-block;
      width: 85px;
    }
  }
  .upIcon,
  .downIcon {
    display: inline-block;
    width: 9px;
    height: 10px;
  }
  .upIcon {
    background: url("/static/image/portal_newImg/up.png") no-repeat center
      center;
    background-size: 100%;
  }
  .downIcon {
    background: url("/static/image/portal_newImg/down.png") no-repeat center
      center;
    background-size: 100%;
  }
}
@media only screen and (max-width: 1367px) {
  .texts {
    font-size: 12px;
  }
  .gfajTab .compare p {
    width: 80px;
  }
}
</style>

