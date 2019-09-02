import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getCasePage(para) {
  return request({
    url: ModuleName + 'page/casepage',
    method: 'get',
    params: para
  })
}
export function getCaseList(para) {
  return request({
    url: ModuleName + 'casepage',
    method: 'get',
    params: para
  })
}
