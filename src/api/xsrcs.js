import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getWjwXsPage(para) {
  return request({
    url: ModuleName + 'page/wjwxs',
    method: 'get',
    params: para
  })
}

// 单条查询
export function getWjwXs(para) {
  return request({
    url: ModuleName + 'wjwxs/' + para.id,
    method: 'get'
  })
}
// 分页查询
export function getWjwYyPage(para) {
  return request({
    url: ModuleName + 'page/wjwyy',
    method: 'get',
    params: para
  })
}

// 单条查询
export function getWjwYy(para) {
  return request({
    url: ModuleName + 'wjwyy/' + para.id,
    method: 'get'
  })
}
