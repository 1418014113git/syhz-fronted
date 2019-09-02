/**
 *  此封装方法针对接口无code码时。一般这种接口响应基本上是第三方接口，和内部规范的接口数据结构不一致。
 */
import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
  timeout: 30000 // 请求超时时间
})
var mb_flag = false // 是否有弹出框

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['JH'] = '020183'
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response // 重点人员类型接口响应没有data这层
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      if (!mb_flag) {
        mb_flag = true
        MessageBox.alert('请求超时，请您稍后再试！', '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            MessageBox.close()
            mb_flag = false
          }
        }).then(() => {
          mb_flag = false
        })
      }
    }
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break

        case 401:
          error.message = '未授权，请登录'
          break

        case 403:
          error.message = '拒绝访问'
          break

        case 404:
          error.message = `请求地址出错`
          break

        case 408:
          error.message = '请求超时，请您稍后再试！'
          break

        case 500:
          error.message = '服务器内部错误'
          break

        case 501:
          error.message = '服务未实现'
          break

        case 502:
          error.message = '网关错误'
          break

        case 503:
          error.message = '服务不可用'
          break

        case 504:
          error.message = '网关超时'
          break

        case 505:
          error.message = 'HTTP版本不受支持'
          break

        default: error.message = error.response.data.error
      }
      MessageBox.alert(error.message, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          MessageBox.close()
        }
      })
    }
    return Promise.reject(error)
  }
)

export default service
