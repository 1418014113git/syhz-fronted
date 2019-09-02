<template>
<div class="GndhMenu">
  <ul class="Gndhul">
    <li v-for="(item,index) in rightfixeddata" :key="index" @click="clickNavList(item)">
      <!-- <img v-if="item.icon" :src="item.icon">
      <span>{{item.name}}</span> -->
      <img :src="item.src">
    </li>
    <li class="addMenu"  @click="addMenu">
      <span>全部</span>
    </li>
  </ul>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'rightfixeddata'
    ])
  },
  methods: {
    clickNavList(item) {
      const _this = this
      _this.$router.push({ path: item.path })
      this.$store.dispatch('NavChangeApp', item.name)
      this.$store.dispatch('NavAppCode', item.appcode)
    },
    addMenu() {
      // console.log('点击全部')
      this.$store.dispatch('ClickAll', true)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.GndhMenu{
  .Gndhul{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: hidden;
    margin-bottom: 2px;
    li{
    width: 24%;
    height: 72px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    margin-bottom: 7px;
      cursor: pointer;
      img{
        width: 100%;
        height: 100%;
      }
    }
    li:nth-child(4),li:last-child{
      margin-right: 0;
    }
    .addMenu{
      text-shadow: 0 0 2px #fff;
      box-shadow: 0 0 2px #fff;
      border: 2px solid  #bce8fc;
      background: url('/static/image/portal_newImg/addMenu.png') no-repeat center 38px;
      background-size: 19px;
      margin-right: 0;
      color: #bce8fc;
      padding: 0 !important;
      height: 72px;
      line-height: 44px;
    }
  }
}
@media only screen and (max-width: 1367px) {
  .GndhMenu .Gndhul{
    margin-bottom: 8px;
  }
  .GndhMenu .Gndhul li{
    height: 59px;
    font-size: 12px;
    margin-right: 4px;
    margin-bottom: 5px;
  }
  .GndhMenu .Gndhul .addMenu{
    background: url(/static/image/portal_newImg/addMenu.png) no-repeat center 31px;
    background-size: 15px;
    height: 59px;
    line-height: 37px;
  }
}
</style>

