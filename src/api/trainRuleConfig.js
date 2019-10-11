import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

/* 问答列表 */
export function getConfig(para) {
  return request({
    url: ModuleName + 'trainruleconfig',
    method: 'get',
    params: para
  })
}
