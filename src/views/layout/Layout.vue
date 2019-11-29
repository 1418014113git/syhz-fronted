<template>
  <div class="app-wrapper" @mouseover="isOvertime()">
    <headers></headers>
    <div class="main-container" :style="{height:contHeight}">
      <bread-crumb></bread-crumb>
      <app-main></app-main>
    </div>
    <right-fixed></right-fixed>
  </div>
</template>

<script>
import AppMain from './components/AppMain'
import Headers from './components/Headers'
import RightFixed from '../../components/RightFixed'
import BreadCrumb from '../../components/Breadcrumb'
export default {
  name: 'layout',
  data() {
    return {
      contHeight: document.documentElement.clientHeight - 60 + 'px',
      lastTime: null, // 最后一次鼠标移动的时间
      currentTime: null, // 当前鼠标移动的时间
      timeOut: 30 * 60 * 1000 // 设置超时时间： 30分钟
    }
  },
  components: {
    AppMain,
    Headers,
    RightFixed,
    BreadCrumb
  },
  computed: {
    getUserIcons() {
      return this.$store.state.app.istotop
    }
  },
  watch: {
    getUserIcons(val) { // 监听state状态变化
      // if (val === 1 && document.querySelector('.main-container').scrollTop > 0) {
      //   document.querySelector('.main-container').scrollTop = 0
      // }
    }
  },
  created() {
    this.lastTime = new Date().getTime() // 页面第一次打开时，记录当前时间
  },
  mounted() {
    // const _this = this
    // document.querySelector('.main-container').addEventListener('scroll', _this.handleScroll, true) // 监听滚动条变化
  },
  methods: {
    // 监听滚动条变化
    handleScroll() {
      // if (document.querySelector('.main-container').scrollTop > 0) { // 如何滚动条顶部距离>0,则将状态ToTop初始化为0
      //   this.$store.dispatch('ToTop', 0)
      // }
    },
    isOvertime() {
      this.currentTime = new Date().getTime() // 记录这次鼠标移动的时间
      if ((this.currentTime - this.lastTime) > this.timeOut) { // 判断上次最后一次鼠标移动的时间和这次鼠标移动的时间间隔是否大于30分钟
        // this.$store.dispatch('FedLogOut').then(() => {
        //   this.$router.push({
        //     path: '/login'
        //   })
        // })
        sessionStorage.clear()
        this.$router.push({
          path: '/login'
        })

        this.$alert('由于您长时间未操作，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            sessionStorage.clear()
            this.$router.push({
              path: '/login'
            })
          }
        })
      } else {
        this.lastTime = new Date().getTime() // 如果在30分钟内鼠标移动，则把这次鼠标移动的时间记录覆盖掉之前存的最后一次鼠标移动的时间
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 .app-wrapper{
   width: 100%;
   height: 100%;
 }
  .main-container{
    // background: #08183c url('../../assets/portal_images/mainBg.png')no-repeat center;
    // background-size: 100% 100%;
    overflow: hidden;
    padding-bottom: 20px;
  }
</style>

