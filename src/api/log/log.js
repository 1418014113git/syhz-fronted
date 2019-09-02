import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE
const LoginModuleName = process.env.LOGIN_MODULE

// 分页查询
export function getPageList(para) {
  return request({
    url: ModuleName + 'page/sysoperatrlog',
    method: 'get',
    params: para
  })
}

export function getLoginPageList(para) {
  return request({
    url: LoginModuleName + 'page/sysloginlog',
    method: 'get',
    params: para
  })
}

// 分页查询
export function getApplicationLog(para) {
  return request({
    url: ModuleName + 'page/applicationaccesslog',
    method: 'get',
    params: para
  })
}

export function getMsloginlog(para) {
  return request({
    url: LoginModuleName + 'page/msloginlog',
    method: 'get',
    params: para
  })
}
