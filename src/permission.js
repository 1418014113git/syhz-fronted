import router from './router'
import store from './store'
// import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/mainLogin', '/ukTest'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // NProgress.start()
  var userId = sessionStorage.getItem('userid')
  if (getToken()) {
    if (to.path === '/login' || to.path === '/mainLogin' || to.path === '/ukTest') {
      next({ path: '/' })
      // NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // var roles = JSON.parse(sessionStorage.getItem('roles'))
      // if (roles) {
      //   store.dispatch('GetInfo').then(res => { // 拉取用户信息
      //     next()
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || '验证失败，请重新登录')
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   next()
      // }
      if (!userId && whiteList.indexOf(to.path) !== -1) { // 退出登录
        store.dispatch('FedLogOut').then(() => {
          next('/login')
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      store.dispatch('FedLogOut').then(() => {
        next('/login')
      })
      // next('/login')
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  // NProgress.done() // 结束Progress
})
