import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 查询
export function getLineList(para) {
  return request({
    url: ModuleName + 'businesslog',
    method: 'get',
    params: para
  })
}
