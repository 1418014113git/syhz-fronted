import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 接口公共部分
  timeout: 30000 // 请求超时时间
})

const CODE_SUCCESS = '000000'// 请求成功
const NO_LOGIN = '800001'// 登录超时，重新登录
const ACCESS_TOKEN_EXPIRE = '800002'// accessToken失效
const APP_CODE = 'SYH_ZHYP,SYH_AJGL,SYH_ZXRW,SYH_JYJD,SYH_JBCJFX,SYH_BAZY,SYH_XXCJ,SYH_RZGL,SYH_PLATFORM'
var mb_flag = false // 是否有弹出框
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['accessToken'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['userId'] = sessionStorage.getItem('userId')
    config.headers['appCode'] = APP_CODE
    config.headers['JH'] = '020183'
    if (sessionStorage.getItem('username')) {
      config.headers['userName'] = encodeURI(sessionStorage.getItem('username'))
    }
    if (sessionStorage.getItem('userInfo')) {
      config.headers['realName'] = encodeURI(JSON.parse(sessionStorage.getItem('userInfo')).realName)
    }
  }
  // 对put请求进行重复过滤
  if (config.method === 'put' || config.method === 'PUT') {
    const configData = config.md5
    const randomObj = {
      randomData: configData,
      requestId: config.data.requestId
    }
    const randomData_JSON = sessionStorage.getItem('randomData')
    if (randomData_JSON === undefined || randomData_JSON === null || randomData_JSON === '') {
      sessionStorage.setItem('randomData', JSON.stringify(randomObj))
      return config
    } else {
      const randomData = JSON.parse(randomData_JSON).randomData
      // console.info('sessionStorage.getItem(\'randomData\')：' + randomData)
      if (randomData === configData && config.data.requestId - JSON.parse(randomData_JSON).requestId < 1000) {
        console.info('重复提交：' + configData)
        return Promise.reject(new Error('repeatGet'))
      } else {
        sessionStorage.setItem('randomData', JSON.stringify(randomObj))
        return config
      }
    }
  } else {
    if (config.method === 'get' || config.method === 'GET') {
      const randomObj = {
        url: config.url,
        requestId: config.params.requestId
      }
      const randomData_JSON = sessionStorage.getItem('_requestId')
      if (randomData_JSON === undefined || randomData_JSON === null || randomData_JSON === '') {
        sessionStorage.setItem('_requestId', JSON.stringify(randomObj))
        return config
      } else {
        const randomData = JSON.parse(randomData_JSON).url
        if (randomData === config.url && config.params.requestId - JSON.parse(randomData_JSON).requestId < 1000) {
          console.info('请求太快了' + config.url)
          return Promise.reject(new Error('repeatSubmit'))
        } else {
          sessionStorage.setItem('_requestId', JSON.stringify(randomObj))
          return config
        }
      }
    }
    return config
  }
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === CODE_SUCCESS) { // 登录成功
      return response.data
    } else if (res.code === NO_LOGIN) { // 登录超时
      if (!mb_flag) {
        mb_flag = true
        MessageBox.confirm('登录超时，重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          mb_flag = false
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      MessageBox.confirm('登录超时，重新登录', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          MessageBox.close()
        }
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (res.code === ACCESS_TOKEN_EXPIRE) { // accessToken过期
      console.log('accessToken过期')
    } else {
      if (res === 'ok') {
        console.info('附件删除成功')
      } else {
        // 非000000以外的其他异常提示
        var message = res.message ? res.message : '请求无法受理，请稍后再试!'
        if (!mb_flag) {
          mb_flag = true
          MessageBox.alert(message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            mb_flag = false
          }).catch(() => {
            mb_flag = false
          })
          return Promise.reject('error')
        }
      }
    }
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
      if (!mb_flag) {
        mb_flag = true
        MessageBox.alert(error.message, '提示', {
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
    return Promise.reject(error)
  }
)

export default service
