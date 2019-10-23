<template>
<div class="myWork">
  <div class="myWorkTitle">我的工作台</div>
  <div v-if="collectList.length < 1" style="line-height: 32px; text-align: center; color: #fff;font-size:15px;">
      暂无数据
  </div>
  <ul class="myWorkUl">
    <li v-for="(item,index) in collectList" :key="index"  v-if="index<4" @click="clickList(item)">
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
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      userId: sessionStorage.getItem('userId'), // 获取userId
      collectList: []
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
      var params = { userId: this.userId }
      this.$query('follow', params).then((response) => {
        this.$store.dispatch('ReReqCollect', false)
        if (response.data && response.data.length > 0) {
          this.collectList = response.data
        } else {
          this.collectList = []
        }
      })
    },
    clickList(item) {
      const _this = this
      _this.$router.push({ path: item.path })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.myWork{
    border-radius: 8px;
    padding: 3px 8px;
    height: 88px;
  .myWorkTitle{
    padding: 6px 0 0 38px;
    margin-bottom: 5px;
    color: #bce8fc;
    text-shadow: 0 0 2px #fff;
    background: url('/static/image/portal_newImg/corwLine.png') no-repeat 3px center;
    border-top:  1px dashed #5b8dd8;
  }
  .myWorkUl{
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    li{
      color: #bce8fc;
      text-shadow: 0 0 2px #fff;
      text-align: center;
      cursor: pointer;
      img{
        width: 30px;
        display: block;
        margin: 0 auto;

      }
    }
  }
}
@media only screen and (max-width: 1367px) {
  .myWork{
    // padding: 5px 0 10px 0;
  }
  // .myWork .myWorkTitle{
  //   margin-bottom: 10px;
  // }
  .myWork .myWorkUl li{
    font-size: 12px;
  }
}
</style>

