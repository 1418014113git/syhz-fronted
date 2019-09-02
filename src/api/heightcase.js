import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

// 查询
export function getHeightTrend(para) {
  return request({
    url: ModuleName + 'heightcasetrend',
    method: 'get',
    params: para
  })
}
export function getHeightTrendByType(para) {
  return request({
    url: ModuleName + 'heightcasebytype',
    method: 'get',
    params: para
  })
}

export function getHeightTrendTBHB(para) {
  return request({
    url: ModuleName + 'heightcasetbhb',
    method: 'get',
    params: para
  })
}

export function ajzmnum(para) {
  return request({
    url: ModuleName + 'ajzmnum',
    method: 'get',
    params: para
  })
}
