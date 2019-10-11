import request from '@/utils/request'
import axios from 'axios'
const ModuleName = process.env.SYHZ_MODULE

export function getConfig(para) {
  return request({
    url: ModuleName + 'trainruleconfig',
    method: 'get',
    params: para
  })
}

export function checkFileName(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(ModuleName + url, {
      params: params
    }).then((res) => {
      if (res.data.data !== null && res.data.data.length > 0) {
        reject('您上传的资料在平台上已经存在，需要确认平台上已有的资料是否和您要上传的相同，如果不同，请修改资料名称后重新上传！')
      } else {
        resolve(res)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
