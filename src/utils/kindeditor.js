import KindEditor from '../components/Editor/VueEditor'
const install = function(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('KindEditor', KindEditor)
}

export default install
