import request from '@/utils/request'

const ModuleName = process.env.SYHZ_MODULE

// 查询
export function getPageData(para) {
  return request({
    url: ModuleName + 'inegmapp/pagebycid',
    method: 'post',
    data: para
  })
}

export function getCountNum(para) {
  return request({
    url: ModuleName + 'inegmapp/count',
    method: 'post',
    data: para
  })
}

export function saveQbxsMapping(para) {
  return request({
    url: ModuleName + 'qbxsmapping',
    method: 'put',
    data: para
  })
}
