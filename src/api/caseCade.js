import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

export function getAJList(para) {
  return request({
    url: ModuleName + 'xscbfxaj',
    method: 'get',
    params: para
  })
}
export function getCPList(para) {
  return request({
    url: ModuleName + 'xscbfxcp',
    method: 'get',
    params: para
  })
}
export function getPSList(para) {
  return request({
    url: ModuleName + 'xscbfxps',
    method: 'get',
    params: para
  })
}
export function getQBBean(para) {
  return request({
    url: ModuleName + 'qbxsjbxx/' + para.id,
    method: 'get'
  })
}
