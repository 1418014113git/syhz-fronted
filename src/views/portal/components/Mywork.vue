<template>
<div class="myWork">
  <div class="myWorkTitle">我的工作台</div>
  <div v-if="collectList.length < 1" style="line-height: 32px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
  </div>
  <ul class="myWorkUl clearfix">
    <div class="arrow_box arrow_box_left" @click="handlePrevPage">
      <i class="el-icon-arrow-left"></i>
    </div>
     <!-- v-if="index<4" -->
    <li v-for="(item,index) in collectList" :key="index" @click="clickList(item)">
      <img :src="item.icon | join"  class="collectIcon">
      <template v-if="item.name.length>6">
        <el-tooltip  effect="dark" :content="item.name" placement="top">
          <span>{{item.name | ellipsis}}</span>
        </el-tooltip>
      </template>
      <template v-else>
        <span>{{item.name | ellipsis}}</span>
      </template>
    </li>
    <div class="arrow_box arrow_box_right" @click="handleNextPage">
      <i class="el-icon-arrow-right"></i>
    </div >
  </ul>

</div>
</template>

<script>
export default {
  data() {
    return {
      userId: sessionStorage.getItem('userId'), // 获取userId
      collectList: [],
      page: 1,
      pageSize: 4,
      maxPage: 0 // 最多有几页
    }
  },
  filters: {
    join(value) {
      return '/static/image/portal_newImg/' + value + '.png'
    },
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 6) {
        return value.slice(0, 6) + '...'
      }
      return value
    }
  },
  computed: {
    getIsReqCollect() {
      return this.$store.state.app.reReqCollect
    }
  },
  watch: {
    getIsReqCollect(val) { // 监听state状态变化
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init() { // 查询收藏列表
      if (this.page === 3) {
        this.pageSize = 2
      } else {
        this.pageSize = 4
      }
      var params = {
        userId: this.userId,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      this.$query('page/follow', params).then((response) => {
        this.$store.dispatch('ReReqCollect', false)
        if (response.data && response.data.list.length > 0) {
          this.collectList = response.data.list
          this.maxPage = Math.ceil(response.data.totalCount / 4)
        } else {
          this.collectList = []
        }
      })
    },
    clickList(item) {
      const _this = this
      _this.$router.push({ path: item.path })
    },
    handlePrevPage() {
      if (this.page === 1) {
        this.$message({
          message: '已经是第一页了',
          type: 'warning'
        })
      } else {
        this.page--
        this.init()
      }
    },
    handleNextPage() {
      if (this.page === this.maxPage) {
        this.$message({
          message: '已经是最后一页了',
          type: 'warning'
        })
      } else {
        this.page++
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.myWork {
  border-radius: 8px;
  padding: 3px 8px;
  height: 88px;
  .myWorkTitle {
    padding: 6px 0 0 38px;
    margin-bottom: 5px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url("/static/image/portal_newImg/corwLine.png") no-repeat 3px
      center;
    border-top: 1px dashed #5b8dd8;
  }
  .myWorkUl {
    overflow: hidden;
    // display: flex;
    // justify-content: space-around;
    position: relative;
    li {
      width: 25%;
      float: left;
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      text-align: center;
      cursor: pointer;
      img {
        width: 30px;
        display: block;
        margin: 0 auto;
      }
    }
  }
  .myWorkUl:hover .arrow_box {
    display: inline-block;
  }
  .arrow_box {
    background: rgba(156, 154, 154, 0.4);
    width: 30px;
    height: 30px;
    border-radius: 30px;
    text-align: center;
    line-height: 30px;
    position: absolute;
    cursor: pointer;
    display: none;
  }
  .arrow_box_left {
    top: 10px;
    left: 0px;
  }
  .arrow_box_right {
    top: 10px;
    right: 0px;
  }
}
@media only screen and (max-width: 1367px) {
  .myWork {
    // padding: 5px 0 10px 0;
  }
  // .myWork .myWorkTitle{
  //   margin-bottom: 10px;
  // }
  .myWork .myWorkUl li {
    font-size: 12px;
  }
}
</style>

