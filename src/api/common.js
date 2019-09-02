import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 关注案件
export function concernCase(para) {
  return request({
    url: ModuleName + 'ajconcern',
    method: 'put',
    data: para
  })
}
// 取消关注
export function cancelConcern(para) {
  return request({
    url: ModuleName + 'ajconcern/' + para.id,
    method: 'post',
    data: para
  })
}

// 查询是否关注此案件
export function getConcernCase(para) {
  return request({
    url: ModuleName + 'ajconcern',
    method: 'get',
    params: para
  })
}
