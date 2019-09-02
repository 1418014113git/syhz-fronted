<template>
  <section class="app-main" :style="{height:contHeights}">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive  v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else-if="!$route.meta.keepAlive"></router-view> -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      contHeights: document.documentElement.clientHeight - 60 - 48 + 'px'
    }
  },
  computed: {
    getUserIcons() {
      return this.$store.state.app.istotop
    }
  },
  watch: {
    getUserIcons(val) { // 监听state状态变化
      if (val === 1 && document.querySelector('.app-main').scrollTop > 0) {
        document.querySelector('.app-main').scrollTop = 0
      }
    }
  },
  mounted() {
    const _this = this
    document.querySelector('.app-main').addEventListener('scroll', _this.handleScroll, true) // 监听滚动条变化
  },
  methods: {
    // 监听滚动条变化
    handleScroll() {
      if (document.querySelector('.app-main').scrollTop > 0) { // 如何滚动条顶部距离>0,则将状态ToTop初始化为0
        this.$store.dispatch('ToTop', 0)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 .app-main{
  //  height: 100%;
   width: 97%;
   min-height: 100%;
   overflow-y: auto;
   padding: 10px 20px 35px 6px;
   margin: 0 auto;
   border-radius: 3px;
 }
 .app-main::-webkit-scrollbar { //隐藏滚动条，但依旧具备可以滚动的功能,只在chrome浏览器下有效
  display: none;
}
</style>
