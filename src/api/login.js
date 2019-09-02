import request from '@/utils/request'
const ModuleName = process.env.LOGIN_MODULE
const SyhzModuleName = process.env.SYHZ_MODULE
export function login(username, password) {
  return request({
    url: ModuleName + 'api/login',
    method: 'post',
    data: {
      'userName': username,
      'userPwd': password
    }
  })
}

export function getInfo(para) {
  return request({
    url: ModuleName + 'api/user',
    method: 'get',
    params: para
  })
}

export function logout(params) {
  return request({
    url: ModuleName + 'loginout',
    method: 'post',
    data: params
  })
}

export function xglogin(para) {
  return request({
    url: SyhzModuleName + 'xgLonin',
    method: 'get',
    params: para
  })
}
