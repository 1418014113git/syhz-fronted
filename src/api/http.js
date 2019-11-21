import request from '@/utils/request'
import requester from '@/utils/requester'
import axios from 'axios'
const ModuleName = process.env.SYHZ_MODULE
const LoginModuleName = process.env.LOGIN_MODULE
const zdryModuleName = process.env.MODULE_ZDRY
// const downModuleName = process.env.DOWN_MODULE
export default {
  ModuleName, LoginModuleName
}
// 查询操作
export function query(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return request({
    url: moduleName + url,
    method: 'get',
    params: params
  })
}

// 同步查询
export function queryAsyns(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return new Promise((resolve, reject) => {
    axios.get(moduleName + url, {
      params: params
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 添加操作
export function save(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return request({
    url: moduleName + url,
    method: 'put',
    data: params
  })
}

// 修改操作
export function update(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return request({
    url: moduleName + url,
    method: 'post',
    data: params
  })
}

// 修改操作
export function updateFile(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params
  })
}

// 同步查询
export function updateAsyns(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return new Promise((resolve, reject) => {
    axios.post(moduleName + url, params).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 删除操作
export function remove(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return request({
    url: moduleName + url,
    method: 'delete',
    params: params
  })
}
// 下载文件
export function download(url, params) {
  axios({
    method: 'get',
    url: ModuleName + url,
    params: params,
    responseType: 'arraybuffer'
  }).then(response => {
    downloadFile(response)
    return response
  }).catch((error) => {
    Promise.reject(error)
  })
}

// 下载文件
export function download_http(url, params) {
  axios({
    method: 'get',
    url: url,
    params: params,
    responseType: 'arraybuffer'
  }).then(response => {
    downloadFile_view(response, params.fileName)
    return response
  }).catch((error) => {
    Promise.reject(error)
  })
}

// 下载文件
export function download_http_mg(url, params) {
  axios({
    method: 'get',
    url: url,
    params: params,
    responseType: 'arraybuffer'
  }).then(response => {
    downloadFile_view(response, params.fileName)
    return response
  }).catch((error) => {
    Promise.reject(error)
  })
}

// 下载文件到本地
function downloadFile(res) {
  if (!res.data) {
    return
  }
  const fileName = res.headers['content-disposition'].match(/=(\S*.*)/)[1]
  const contentType = res.headers['content-type']
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(new Blob([res.data], { type: contentType })) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = fileName // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

// 下载文件到本地
function downloadFile_view(res, fileName) {
  if (!res.data) {
    return
  }
  const contentType = res.headers['content-type']
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(new Blob([res.data], { type: contentType })) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = fileName // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

// 重点人员查询
export function zdryhc(url, param) {
  return requester({
    url: zdryModuleName + url,
    method: 'post',
    data: param
  })
}

// post 查询，有时候接口要求 查询用post
export function queryPost(url, params, moduleType) {
  let moduleName = ModuleName
  if (moduleType) {
    moduleName = LoginModuleName
  }
  return request({
    url: moduleName + url,
    method: 'post',
    data: params
  })
}
