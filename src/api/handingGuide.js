import request from '@/utils/request'
const ModuleName = process.env.SYHZ_MODULE

/* 案例指引分页 */
export function getCaseGuidePage(para) {
  return request({
    url: ModuleName + 'page/caseguide',
    method: 'get',
    params: para
  })
}
/* 案例指引详情 */
export function getCaseGuideDetail(para) {
  return request({
    url: ModuleName + 'caseguide/' + para.id,
    method: 'get'
  })
}
/* 案例指引新增 */
export function addCaseGuide(para) {
  return request({
    url: ModuleName + 'caseguide',
    method: 'put',
    data: para
  })
}
/* 案例指引修改 */
export function editCaseGuide(para) {
  return request({
    url: ModuleName + 'caseguide/' + para.id,
    method: 'post',
    data: para
  })
}
/* 案例指引删除 */
export function delCaseGuide(para) {
  return request({
    url: ModuleName + 'caseguide/' + para.id,
    method: 'delete'
  })
}
