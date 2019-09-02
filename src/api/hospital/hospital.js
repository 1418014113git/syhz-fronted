import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 分页查询
export function getPageList(para) {
  return request({
    url: ModuleName + 'page/tsyjyljgxx',
    method: 'get',
    params: para
  })
}
// 单条查询
export function getDetailById(para) {
  return request({
    url: ModuleName + 'tsyjyljgxx/' + para.id,
    method: 'get'
  })
}
