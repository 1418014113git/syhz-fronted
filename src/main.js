import Vue from 'vue'
import 'babel-polyfill'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'

import '../src/assets/theme/them-#1E98D2/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control

import Attachment from '@/api/attachment'
import { isResView, isResDisabled } from '@/utils/auth'
import { isViewBtn, gotoid, closePath, parseTime, handlerDateTime, thousSplit, str2ArrBuf, resetSetItem, drawWaterMark, echartOptionToContent, getLabelByValue, pickerOptionChange, setCurrentUser } from '@/utils/public'
import { query, queryAsyns, save, update, remove, download, zdryhc, download_http } from '@/api/http'
import { validatePhone, regEnCnNumber, regEnNumber, regNumber, regCn, regEn, regEmail, regQQ, regWx, regAddress } from '@/utils/validate'
import Watermark from '@/utils/watermark'
Vue.prototype.isResView = isResView
Vue.prototype.isResDisabled = isResDisabled
Vue.prototype.$isViewBtn = isViewBtn
Vue.prototype.$gotoid = gotoid
Vue.prototype.$closePath = closePath
Vue.prototype.$parseTime = parseTime
Vue.prototype.$handlerDateTime = handlerDateTime
Vue.prototype.$query = query
Vue.prototype.$queryAsyns = queryAsyns
Vue.prototype.$save = save
Vue.prototype.$update = update
Vue.prototype.$remove = remove
Vue.prototype.$download = download
Vue.prototype.$download_http = download_http
Vue.prototype.$validatePhone = validatePhone
Vue.prototype.$regEnCnNumber = regEnCnNumber
Vue.prototype.$regEnNumber = regEnNumber
Vue.prototype.$regNumber = regNumber
Vue.prototype.$regCn = regCn
Vue.prototype.$regEn = regEn
Vue.prototype.$regEmail = regEmail
Vue.prototype.$regQQ = regQQ
Vue.prototype.$regWx = regWx
Vue.prototype.$regAddress = regAddress
Vue.prototype.UploadAttachment = Attachment
Vue.prototype.$thousSplit = thousSplit // 千分符
Vue.prototype.$zdryhc = zdryhc // 重点人员类型查询接口
Vue.prototype.$str2ArrBuf = str2ArrBuf
Vue.prototype.$Watermark = Watermark // 添加水印
Vue.prototype.$drawWaterMark = drawWaterMark // 页面上画水印
Vue.prototype.$resetSetItem = resetSetItem
Vue.prototype.$echartOptionToContent = echartOptionToContent // ecart数据视图自定义
Vue.prototype.$getLabelByValue = getLabelByValue // 通过value取name
Vue.prototype.$pickerOptionChange = pickerOptionChange // 开始时间和结束时间 是否可选限制
Vue.prototype.$setCurrentUser = setCurrentUser

// Vue.use(ElementUI)
Vue.use(ElementUI, { size: 'small' }) // 全局配置组件使用small

Vue.config.productionTip = false
// import vuePicturePreview from 'vue-picture-preview'
import vuePicturePreview from './components/vue-picture-preview'
Vue.use(vuePicturePreview)
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueKindEditor from '@/utils/kindeditor.js'
import '../static/kindeditor/themes/default/default.css'
import '../static/kindeditor/kindeditor-all-min.js'
import '../static/kindeditor/lang/zh-CN.js'
Vue.use(VueKindEditor)

import Navigation from 'vue-navigation'
Vue.use(Navigation, { router })
import Print from 'vue-print-nb' // 打印插件
Vue.use(Print)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted() {
    this.$drawWaterMark()
  }
})
